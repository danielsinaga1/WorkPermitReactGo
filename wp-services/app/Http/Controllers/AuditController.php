<?php

namespace App\Http\Controllers;

use App\Models\AuditPlan;
use App\Models\AuditFinding;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AuditController extends Controller
{
    // ========== AUDIT PLANS ==========
    public function index(Request $request)
    {
        $query = AuditPlan::with(['workArea', 'leadAuditor'])->withCount('findings');

        if ($request->filled('status')) $query->where('status', $request->status);
        if ($request->filled('audit_type')) $query->where('audit_type', $request->audit_type);
        if ($request->filled('work_area_id')) $query->where('work_area_id', $request->work_area_id);
        if ($request->filled('search')) {
            $s = $request->search;
            $query->where(function ($q) use ($s) {
                $q->where('title', 'like', "%$s%")
                  ->orWhere('audit_number', 'like', "%$s%")
                  ->orWhere('lead_auditor_name', 'like', "%$s%");
            });
        }

        $perPage = (int) $request->input('per_page', 15);
        return response()->json(['success' => true, 'data' => $query->orderByDesc('planned_start')->paginate($perPage)]);
    }

    public function show($id)
    {
        $audit = AuditPlan::with(['workArea', 'leadAuditor', 'findings.responsiblePic'])->findOrFail($id);
        return response()->json(['success' => true, 'data' => $audit]);
    }

    public function store(Request $request)
    {
        $this->validate($request, [
            'title'             => 'required|string|max:255',
            'audit_type'        => 'required|in:internal,external,iso_45001,iso_14001,iso_9001,compliance,management,process',
            'planned_start'     => 'required|date',
            'planned_end'       => 'required|date|after_or_equal:planned_start',
            'lead_auditor_name' => 'required|string',
            'lead_auditor_id'   => 'nullable|integer|exists:personnel,id',
            'work_area_id'      => 'nullable|integer|exists:work_areas,id',
            'scope'             => 'nullable|string',
            'auditee_list'      => 'nullable|array',
            'checklist'         => 'nullable|array',
        ]);

        $data = $request->all();
        $data['audit_number'] = AuditPlan::generateNumber();
        $data['status'] = $data['status'] ?? 'planned';

        $audit = AuditPlan::create($data);
        return response()->json(['success' => true, 'data' => $audit], 201);
    }

    public function update(Request $request, $id)
    {
        $audit = AuditPlan::findOrFail($id);
        $audit->update($request->all());
        return response()->json(['success' => true, 'data' => $audit->fresh()]);
    }

    public function close(Request $request, $id)
    {
        $audit = AuditPlan::findOrFail($id);
        $this->validate($request, ['summary' => 'nullable|string']);
        $audit->status = 'closed';
        $audit->summary = $request->summary ?? $audit->summary;
        $audit->closed_at = now();
        $audit->save();
        $audit->recalculateMetrics();
        return response()->json(['success' => true, 'data' => $audit->fresh()]);
    }

    public function destroy($id)
    {
        $audit = AuditPlan::findOrFail($id);
        $audit->delete();
        return response()->json(['success' => true]);
    }

    // ========== AUDIT FINDINGS ==========
    public function indexFindings($auditId)
    {
        $audit = AuditPlan::findOrFail($auditId);
        return response()->json([
            'success' => true,
            'data' => $audit->findings()->with('responsiblePic')->orderByDesc('created_at')->get(),
        ]);
    }

    public function storeFinding(Request $request, $auditId)
    {
        $audit = AuditPlan::findOrFail($auditId);
        $this->validate($request, [
            'severity'    => 'required|in:critical,major,minor,observation,opportunity',
            'title'       => 'required|string|max:255',
            'description' => 'required|string',
            'clause_reference'      => 'nullable|string',
            'evidence'              => 'nullable|string',
            'responsible_pic_name'  => 'nullable|string',
            'responsible_pic_id'    => 'nullable|integer|exists:personnel,id',
            'target_close_date'     => 'nullable|date',
            'photos'                => 'nullable|array',
        ]);

        $count = $audit->findings()->count() + 1;
        $findingNumber = $audit->audit_number . '-F' . str_pad($count, 3, '0', STR_PAD_LEFT);

        $finding = $audit->findings()->create(array_merge($request->all(), [
            'finding_number' => $findingNumber,
        ]));
        $audit->recalculateMetrics();

        return response()->json(['success' => true, 'data' => $finding], 201);
    }

    public function updateFinding(Request $request, $findingId)
    {
        $finding = AuditFinding::findOrFail($findingId);
        $finding->update($request->all());
        if ($finding->status === 'closed' && !$finding->closed_at) {
            $finding->closed_at = now();
            $finding->save();
        }
        $finding->auditPlan->recalculateMetrics();
        return response()->json(['success' => true, 'data' => $finding->fresh('responsiblePic')]);
    }

    public function summary(Request $request)
    {
        $start = $request->input('from', now()->startOfYear()->toDateString());
        $end   = $request->input('to', now()->endOfYear()->toDateString());

        $base = AuditPlan::whereBetween('planned_start', [$start, $end]);
        $total = (clone $base)->count();
        $byStatus = (clone $base)->select('status', DB::raw('count(*) as total'))->groupBy('status')->get();

        $findings = AuditFinding::whereHas('auditPlan', fn($q) => $q->whereBetween('planned_start', [$start, $end]));
        $totalFindings = (clone $findings)->count();
        $openFindings = (clone $findings)->open()->count();
        $overdueFindings = (clone $findings)->overdue()->count();

        $avgScore = AuditPlan::whereBetween('planned_start', [$start, $end])
            ->whereNotNull('compliance_score')
            ->avg('compliance_score');

        return response()->json([
            'success' => true,
            'data' => [
                'period' => ['start' => $start, 'end' => $end],
                'total_audits'         => $total,
                'by_status'            => $byStatus,
                'total_findings'       => $totalFindings,
                'open_findings'        => $openFindings,
                'overdue_findings'     => $overdueFindings,
                'avg_compliance_score' => $avgScore ? round($avgScore, 2) : null,
            ],
        ]);
    }
}
