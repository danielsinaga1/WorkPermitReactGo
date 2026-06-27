<?php

namespace App\Http\Controllers;

use App\Models\WorkPermit;
use App\Models\PpeChecklist;
use App\Models\PpeChecklistItem;
use App\Models\PermitTransfer;
use App\Models\ClosureChecklist;
use App\Models\ClosureChecklistItem;
use App\Models\FormFieldConfig;
use App\Models\AuditTrail;
use App\Services\EmailNotificationService;
use Illuminate\Http\Request;

class GapFeaturesController extends Controller
{
    // ================================================================
    // PPE CHECKLIST
    // ================================================================

    /**
     * List PPE checklists for a permit.
     */
    public function indexPpeChecklists($permitId)
    {
        $permit = WorkPermit::find($permitId);
        if (!$permit) return $this->notFoundResponse();

        return $this->successResponse(
            $permit->ppeChecklists()->with('items', 'checkedBy')->orderBy('created_at', 'desc')->get()
        );
    }

    /**
     * Create a PPE checklist for a permit.
     */
    public function storePpeChecklist(Request $request, $permitId)
    {
        $permit = WorkPermit::find($permitId);
        if (!$permit) return $this->notFoundResponse();

        $this->validate($request, [
            'checked_by_name' => 'required|string|max:255',
            'checked_by_id'   => 'nullable|integer',
            'remarks'         => 'nullable|string',
            'items'           => 'required|array|min:1',
            'items.*.ppe_item'        => 'required|string|max:255',
            'items.*.is_required'     => 'required|boolean',
            'items.*.is_available'    => 'required|boolean',
            'items.*.is_condition_ok' => 'required|boolean',
            'items.*.remarks'         => 'nullable|string',
        ]);

        $checklist = PpeChecklist::create([
            'work_permit_id'  => $permit->id,
            'checked_by_name' => $request->input('checked_by_name'),
            'checked_by_id'   => $request->input('checked_by_id'),
            'checked_at'      => now(),
            'remarks'         => $request->input('remarks'),
        ]);

        $allCompliant = true;
        foreach ($request->input('items') as $item) {
            $checklist->items()->create($item);
            if ($item['is_required'] && (!$item['is_available'] || !$item['is_condition_ok'])) {
                $allCompliant = false;
            }
        }

        $checklist->update(['is_compliant' => $allCompliant]);
        $checklist->load('items');

        AuditTrail::create([
            'module'       => 'ppe_checklist',
            'action'       => 'create',
            'record_id'    => $checklist->id,
            'performed_by' => $request->input('checked_by_name'),
            'new_values'   => $checklist->toArray(),
            'ip_address'   => $request->ip(),
            'user_agent'   => $request->userAgent(),
            'performed_at' => now(),
        ]);

        return $this->successResponse($checklist, 'PPE checklist created', 201);
    }

    // ================================================================
    // PERMIT TRANSFER
    // ================================================================

    /**
     * List transfers for a permit.
     */
    public function indexTransfers($permitId)
    {
        $permit = WorkPermit::find($permitId);
        if (!$permit) return $this->notFoundResponse();

        return $this->successResponse(
            $permit->transfers()->with('fromPersonnel', 'toPersonnel')->orderBy('created_at', 'desc')->get()
        );
    }

    /**
     * Request a permit transfer.
     */
    public function requestTransfer(Request $request, $permitId)
    {
        $permit = WorkPermit::find($permitId);
        if (!$permit) return $this->notFoundResponse();

        if (!in_array($permit->status, ['approved', 'active'])) {
            return $this->errorResponse('Permit must be approved or active to transfer', 422);
        }

        $this->validate($request, [
            'from_personnel_id' => 'required|integer|exists:personnel,id',
            'to_personnel_id'   => 'required|integer|exists:personnel,id|different:from_personnel_id',
            'from_role'         => 'nullable|string|max:100',
            'to_role'           => 'nullable|string|max:100',
            'reason'            => 'required|string|max:500',
            'requested_by'      => 'required|string|max:255',
        ]);

        $transfer = PermitTransfer::create([
            'work_permit_id'    => $permit->id,
            'from_personnel_id' => $request->input('from_personnel_id'),
            'to_personnel_id'   => $request->input('to_personnel_id'),
            'from_role'         => $request->input('from_role'),
            'to_role'           => $request->input('to_role'),
            'reason'            => $request->input('reason'),
            'requested_by'      => $request->input('requested_by'),
            'status'            => 'pending',
        ]);

        $transfer->load('fromPersonnel', 'toPersonnel');

        // Send notification
        $emailService = new EmailNotificationService();
        $emailService->queueEmail(
            'permit_transfer',
            $transfer->toPersonnel->email ?? '',
            $transfer->toPersonnel->name ?? 'Personnel',
            "Permit Transfer Request: {$permit->permit_number}",
            ['permit' => $permit->toArray(), 'transfer' => $transfer->toArray()]
        );

        AuditTrail::create([
            'module'       => 'permit_transfer',
            'action'       => 'create',
            'record_id'    => $transfer->id,
            'performed_by' => $request->input('requested_by'),
            'new_values'   => $transfer->toArray(),
            'ip_address'   => $request->ip(),
            'user_agent'   => $request->userAgent(),
            'performed_at' => now(),
        ]);

        return $this->successResponse($transfer, 'Transfer request created', 201);
    }

    /**
     * Approve or reject a transfer.
     */
    public function processTransfer(Request $request, $transferId)
    {
        $transfer = PermitTransfer::with('workPermit', 'fromPersonnel', 'toPersonnel')->find($transferId);
        if (!$transfer) return $this->notFoundResponse();

        if ($transfer->status !== 'pending') {
            return $this->errorResponse('Transfer already processed', 422);
        }

        $this->validate($request, [
            'decision'         => 'required|in:approved,rejected',
            'approved_by'      => 'required|string|max:255',
            'approval_remarks' => 'nullable|string',
        ]);

        $oldValues = $transfer->toArray();
        $transfer->update([
            'status'           => $request->input('decision'),
            'approved_by'      => $request->input('approved_by'),
            'approved_at'      => now(),
            'approval_remarks' => $request->input('approval_remarks'),
        ]);

        // If approved, swap personnel on the permit
        if ($request->input('decision') === 'approved') {
            $permit = $transfer->workPermit;
            $permit->personnel()->detach($transfer->from_personnel_id);
            $permit->personnel()->attach($transfer->to_personnel_id, [
                'role_in_permit' => $transfer->to_role ?? $transfer->from_role,
            ]);
        }

        AuditTrail::create([
            'module'       => 'permit_transfer',
            'action'       => $request->input('decision'),
            'record_id'    => $transfer->id,
            'performed_by' => $request->input('approved_by'),
            'old_values'   => $oldValues,
            'new_values'   => $transfer->fresh()->toArray(),
            'ip_address'   => $request->ip(),
            'user_agent'   => $request->userAgent(),
            'performed_at' => now(),
        ]);

        return $this->successResponse($transfer->fresh()->load('fromPersonnel', 'toPersonnel'), 'Transfer processed');
    }

    // ================================================================
    // PERMIT REVOKE
    // ================================================================

    /**
     * Revoke an active/approved permit.
     */
    public function revokePermit(Request $request, $permitId)
    {
        $permit = WorkPermit::find($permitId);
        if (!$permit) return $this->notFoundResponse();

        if (!in_array($permit->status, ['approved', 'active', 'submitted', 'pending_approval'])) {
            return $this->errorResponse('Only active, approved, submitted or pending permits can be revoked', 422);
        }

        $this->validate($request, [
            'revoked_by'    => 'required|string|max:255',
            'revoke_reason' => 'required|string|max:1000',
        ]);

        $oldValues = $permit->toArray();
        $permit->update([
            'status'        => 'cancelled',
            'revoked_by'    => $request->input('revoked_by'),
            'revoked_at'    => now(),
            'revoke_reason' => $request->input('revoke_reason'),
        ]);

        // Send notification about revocation
        $emailService = new EmailNotificationService();
        $emailService->queueEmail(
            'permit_revoked',
            $permit->requester->email ?? '',
            $permit->requester->name ?? 'Requester',
            "Permit Revoked: {$permit->permit_number}",
            ['permit' => $permit->fresh()->toArray(), 'reason' => $request->input('revoke_reason')]
        );

        AuditTrail::create([
            'module'       => 'work_permit',
            'action'       => 'revoke',
            'record_id'    => $permit->id,
            'performed_by' => $request->input('revoked_by'),
            'old_values'   => $oldValues,
            'new_values'   => $permit->fresh()->toArray(),
            'ip_address'   => $request->ip(),
            'user_agent'   => $request->userAgent(),
            'performed_at' => now(),
        ]);

        return $this->successResponse($permit->fresh(), 'Permit revoked successfully');
    }

    // ================================================================
    // CLOSURE CHECKLIST
    // ================================================================

    /**
     * Get closure checklist for a permit.
     */
    public function getClosureChecklist($permitId)
    {
        $permit = WorkPermit::find($permitId);
        if (!$permit) return $this->notFoundResponse();

        $checklist = $permit->closureChecklist()->with('items')->first();
        return $this->successResponse($checklist);
    }

    /**
     * Create/submit closure checklist.
     */
    public function storeClosureChecklist(Request $request, $permitId)
    {
        $permit = WorkPermit::find($permitId);
        if (!$permit) return $this->notFoundResponse();

        if (!in_array($permit->status, ['active', 'approved'])) {
            return $this->errorResponse('Permit must be active or approved for closure checklist', 422);
        }

        $this->validate($request, [
            'completed_by_name' => 'required|string|max:255',
            'completed_by_id'   => 'nullable|integer',
            'remarks'           => 'nullable|string',
            'items'             => 'required|array|min:1',
            'items.*.item_description' => 'required|string|max:500',
            'items.*.is_checked'       => 'required|boolean',
            'items.*.checked_by'       => 'nullable|string|max:255',
            'items.*.remarks'          => 'nullable|string',
        ]);

        // Delete existing if re-submitting
        $existing = $permit->closureChecklist;
        if ($existing) {
            $existing->items()->delete();
            $existing->delete();
        }

        $checklist = ClosureChecklist::create([
            'work_permit_id'    => $permit->id,
            'completed_by_name' => $request->input('completed_by_name'),
            'completed_by_id'   => $request->input('completed_by_id'),
            'completed_at'      => now(),
            'remarks'           => $request->input('remarks'),
        ]);

        $allChecked = true;
        foreach ($request->input('items') as $item) {
            $checklist->items()->create(array_merge($item, [
                'checked_at' => $item['is_checked'] ? now() : null,
            ]));
            if (!$item['is_checked']) {
                $allChecked = false;
            }
        }

        $checklist->update(['all_items_checked' => $allChecked]);
        $checklist->load('items');

        AuditTrail::create([
            'module'       => 'closure_checklist',
            'action'       => 'create',
            'record_id'    => $checklist->id,
            'performed_by' => $request->input('completed_by_name'),
            'new_values'   => $checklist->toArray(),
            'ip_address'   => $request->ip(),
            'user_agent'   => $request->userAgent(),
            'performed_at' => now(),
        ]);

        return $this->successResponse($checklist, 'Closure checklist submitted', 201);
    }

    // ================================================================
    // FORM FIELD CONFIGURATION (No-code builder support)
    // ================================================================

    /**
     * List field configs, optionally by permit type and/or section.
     */
    public function indexFieldConfigs(Request $request)
    {
        $query = FormFieldConfig::query()->where('is_active', true)->orderBy('sort_order');

        if ($request->get('permit_type_id')) {
            $query->where(function ($q) use ($request) {
                $q->where('permit_type_id', $request->get('permit_type_id'))
                  ->orWhereNull('permit_type_id');
            });
        }
        if ($request->get('section')) {
            $query->where('section', $request->get('section'));
        }

        return $this->successResponse($query->get());
    }

    /**
     * Create a new field config.
     */
    public function storeFieldConfig(Request $request)
    {
        $this->validate($request, [
            'permit_type_id' => 'nullable|integer|exists:permit_types,id',
            'section'        => 'required|string|in:general,ppe,risk,gas_test,closure,custom',
            'field_name'     => 'required|string|max:255',
            'field_label'    => 'required|string|max:255',
            'field_type'     => 'required|string|in:text,checkbox,select,textarea,number,date,toggle',
            'options'        => 'nullable|array',
            'is_mandatory'   => 'required|boolean',
            'sort_order'     => 'nullable|integer',
            'instruction'    => 'nullable|string',
            'tooltip'        => 'nullable|string',
        ]);

        $config = FormFieldConfig::create($request->all());
        return $this->successResponse($config, 'Field config created', 201);
    }

    /**
     * Update a field config.
     */
    public function updateFieldConfig(Request $request, $id)
    {
        $config = FormFieldConfig::find($id);
        if (!$config) return $this->notFoundResponse();

        $config->update($request->only([
            'section', 'field_name', 'field_label', 'field_type',
            'options', 'is_mandatory', 'is_active', 'sort_order',
            'instruction', 'tooltip',
        ]));

        return $this->successResponse($config->fresh(), 'Field config updated');
    }

    /**
     * Delete a field config.
     */
    public function destroyFieldConfig($id)
    {
        $config = FormFieldConfig::find($id);
        if (!$config) return $this->notFoundResponse();

        $config->delete();
        return $this->successResponse(null, 'Field config deleted');
    }
}
