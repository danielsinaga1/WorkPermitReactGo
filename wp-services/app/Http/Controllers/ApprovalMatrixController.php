<?php

namespace App\Http\Controllers;

use App\Models\ApprovalMatrix;
use App\Models\ApprovalMatrixStage;
use App\Models\ApprovalDelegation;
use App\Models\PermitApproval;
use App\Models\WorkPermit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ApprovalMatrixController extends Controller
{
    public function index(Request $request)
    {
        $query = ApprovalMatrix::with(['stages', 'permitType']);

        if ($request->has('permit_type_id')) {
            $query->where('permit_type_id', $request->permit_type_id);
        }
        if ($request->has('risk_level')) {
            $query->where('risk_level', $request->risk_level);
        }

        return response()->json([
            'success' => true,
            'data' => $query->orderBy('name')->get(),
        ]);
    }

    public function show($id)
    {
        $matrix = ApprovalMatrix::with(['stages.defaultApprover', 'permitType'])->findOrFail($id);
        return response()->json(['success' => true, 'data' => $matrix]);
    }

    public function store(Request $request)
    {
        $this->validate($request, [
            'name' => 'required|string',
            'permit_type_id' => 'required|exists:permit_types,id',
            'risk_level' => 'nullable|in:low,medium,high,extreme',
            'approval_mode' => 'in:sequential,parallel',
            'stages' => 'required|array|min:1',
            'stages.*.stage_name' => 'required|string',
            'stages.*.approver_role' => 'required|string',
            'stages.*.sla_hours' => 'integer|min:1',
        ]);

        return DB::transaction(function () use ($request) {
            $matrix = ApprovalMatrix::create($request->only([
                'name', 'permit_type_id', 'risk_level',
                'approval_mode', 'description', 'is_active',
            ]));

            foreach ($request->stages as $idx => $stageData) {
                ApprovalMatrixStage::create(array_merge($stageData, [
                    'approval_matrix_id' => $matrix->id,
                    'stage_order' => $stageData['stage_order'] ?? ($idx + 1),
                ]));
            }

            return response()->json([
                'success' => true,
                'data' => $matrix->load('stages'),
            ], 201);
        });
    }

    public function update(Request $request, $id)
    {
        $matrix = ApprovalMatrix::findOrFail($id);
        $matrix->update($request->only([
            'name', 'permit_type_id', 'risk_level',
            'approval_mode', 'description', 'is_active',
        ]));

        if ($request->has('stages')) {
            return DB::transaction(function () use ($request, $matrix) {
                $matrix->stages()->delete();
                foreach ($request->stages as $idx => $stageData) {
                    ApprovalMatrixStage::create(array_merge($stageData, [
                        'approval_matrix_id' => $matrix->id,
                        'stage_order' => $stageData['stage_order'] ?? ($idx + 1),
                    ]));
                }
                return response()->json(['success' => true, 'data' => $matrix->load('stages')]);
            });
        }

        return response()->json(['success' => true, 'data' => $matrix->load('stages')]);
    }

    public function destroy($id)
    {
        $matrix = ApprovalMatrix::findOrFail($id);
        $matrix->delete();
        return response()->json(['success' => true]);
    }

    public function applyToPermit(Request $request, $permitId)
    {
        $permit = WorkPermit::findOrFail($permitId);

        $riskLevel = $request->input('risk_level');
        $matrix = ApprovalMatrix::findMatching($permit->permit_type_id, $riskLevel);

        if (!$matrix) {
            return response()->json([
                'success' => false,
                'message' => 'No matching approval matrix found for this permit type and risk level',
            ], 404);
        }

        return DB::transaction(function () use ($permit, $matrix) {
            $permit->approvals()->where('decision', 'pending')->delete();

            foreach ($matrix->stages as $stage) {
                PermitApproval::create([
                    'work_permit_id' => $permit->id,
                    'stage_order' => $stage->stage_order,
                    'stage_name' => $stage->stage_name,
                    'stage_type' => $stage->stage_type,
                    'approver_role' => $stage->approver_role,
                    'approver_id' => $stage->default_approver_id,
                    'decision' => 'pending',
                    'deadline_at' => now()->addHours($stage->sla_hours),
                ]);
            }

            return response()->json([
                'success' => true,
                'message' => 'Approval matrix applied to permit',
                'data' => $permit->load('approvals'),
            ]);
        });
    }

    // ============= DELEGATIONS =============
    public function indexDelegations(Request $request)
    {
        $query = ApprovalDelegation::with(['delegator', 'delegatee']);
        if ($request->boolean('active_only')) {
            $now = now();
            $query->where('is_active', true)
                ->where('start_date', '<=', $now)
                ->where('end_date', '>=', $now);
        }
        return response()->json(['success' => true, 'data' => $query->latest()->get()]);
    }

    public function storeDelegation(Request $request)
    {
        $this->validate($request, [
            'delegator_id' => 'required|exists:personnel,id',
            'delegatee_id' => 'required|exists:personnel,id|different:delegator_id',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after:start_date',
            'reason' => 'required|string',
        ]);

        $delegation = ApprovalDelegation::create($request->all());
        return response()->json(['success' => true, 'data' => $delegation], 201);
    }

    public function revokeDelegation($id)
    {
        $delegation = ApprovalDelegation::findOrFail($id);
        $delegation->update(['is_active' => false]);
        return response()->json(['success' => true]);
    }
}
