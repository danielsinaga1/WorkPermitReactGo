<?php

namespace App\Http\Controllers;

use App\Models\InspectionTemplate;
use App\Models\InspectionTemplateItem;
use App\Models\InspectionSchedule;
use App\Models\InspectionResult;
use App\Models\InspectionFinding;
use App\Models\CorrectiveAction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class InspectionController extends Controller
{
    // ============= TEMPLATES =============
    public function indexTemplates(Request $request)
    {
        $query = InspectionTemplate::with('items');
        if ($request->has('category')) $query->where('category', $request->category);
        if ($request->has('frequency')) $query->where('frequency', $request->frequency);
        return response()->json(['success' => true, 'data' => $query->active()->get()]);
    }

    public function showTemplate($id)
    {
        return response()->json([
            'success' => true,
            'data' => InspectionTemplate::with('items')->findOrFail($id),
        ]);
    }

    public function storeTemplate(Request $request)
    {
        $this->validate($request, [
            'code' => 'required|unique:inspection_templates',
            'name' => 'required|string',
            'category' => 'required|string',
            'frequency' => 'required|in:daily,weekly,monthly,quarterly,yearly',
            'items' => 'required|array|min:1',
        ]);

        return DB::transaction(function () use ($request) {
            $template = InspectionTemplate::create($request->only([
                'code', 'name', 'description', 'category', 'frequency', 'is_active',
            ]));

            foreach ($request->items as $idx => $item) {
                InspectionTemplateItem::create([
                    'inspection_template_id' => $template->id,
                    'item_order' => $item['item_order'] ?? ($idx + 1),
                    'item_text' => $item['item_text'],
                    'item_type' => $item['item_type'] ?? 'checkbox',
                    'is_critical' => $item['is_critical'] ?? false,
                    'guidance' => $item['guidance'] ?? null,
                ]);
            }

            return response()->json(['success' => true, 'data' => $template->load('items')], 201);
        });
    }

    public function updateTemplate(Request $request, $id)
    {
        $template = InspectionTemplate::findOrFail($id);
        $template->update($request->all());

        if ($request->has('items')) {
            return DB::transaction(function () use ($request, $template) {
                $template->items()->delete();
                foreach ($request->items as $idx => $item) {
                    InspectionTemplateItem::create([
                        'inspection_template_id' => $template->id,
                        'item_order' => $item['item_order'] ?? ($idx + 1),
                        'item_text' => $item['item_text'],
                        'item_type' => $item['item_type'] ?? 'checkbox',
                        'is_critical' => $item['is_critical'] ?? false,
                        'guidance' => $item['guidance'] ?? null,
                    ]);
                }
                return response()->json(['success' => true, 'data' => $template->load('items')]);
            });
        }
        return response()->json(['success' => true, 'data' => $template]);
    }

    // ============= SCHEDULES =============
    public function indexSchedules(Request $request)
    {
        $query = InspectionSchedule::with(['template', 'workArea', 'equipment', 'assignee', 'result']);

        if ($request->has('status')) $query->where('status', $request->status);
        if ($request->has('from')) $query->where('scheduled_date', '>=', $request->from);
        if ($request->has('to')) $query->where('scheduled_date', '<=', $request->to);
        if ($request->has('assigned_to')) $query->where('assigned_to', $request->assigned_to);
        if ($request->boolean('overdue_only')) $query->overdue();

        return response()->json([
            'success' => true,
            'data' => $query->orderBy('scheduled_date')->paginate(50),
        ]);
    }

    public function storeSchedule(Request $request)
    {
        $this->validate($request, [
            'inspection_template_id' => 'required|exists:inspection_templates,id',
            'title' => 'required|string',
            'scheduled_date' => 'required|date',
        ]);

        $template = InspectionTemplate::findOrFail($request->inspection_template_id);
        $schedule = InspectionSchedule::create(array_merge($request->all(), [
            'frequency' => $template->frequency,
            'next_occurrence' => $this->calculateNextOccurrence($request->scheduled_date, $template->frequency),
        ]));
        return response()->json(['success' => true, 'data' => $schedule], 201);
    }

    public function generateRecurring(Request $request)
    {
        $this->validate($request, [
            'inspection_template_id' => 'required|exists:inspection_templates,id',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after:start_date',
        ]);

        $template = InspectionTemplate::findOrFail($request->inspection_template_id);
        $start = Carbon::parse($request->start_date);
        $end = Carbon::parse($request->end_date);
        $created = [];

        $current = $start->copy();
        while ($current <= $end) {
            $created[] = InspectionSchedule::create([
                'inspection_template_id' => $template->id,
                'title' => $template->name . ' - ' . $current->format('Y-m-d'),
                'work_area_id' => $request->work_area_id,
                'equipment_id' => $request->equipment_id,
                'assigned_to' => $request->assigned_to,
                'scheduled_date' => $current->toDateString(),
                'frequency' => $template->frequency,
            ]);
            $current = $this->advanceByFrequency($current, $template->frequency);
        }

        return response()->json([
            'success' => true,
            'message' => count($created) . ' schedules created',
            'data' => $created,
        ], 201);
    }

    public function calendar(Request $request)
    {
        $from = $request->input('from', now()->startOfMonth()->toDateString());
        $to = $request->input('to', now()->endOfMonth()->toDateString());

        $schedules = InspectionSchedule::with(['template', 'workArea', 'assignee'])
            ->whereBetween('scheduled_date', [$from, $to])
            ->get()
            ->groupBy(fn($s) => $s->scheduled_date->toDateString());

        return response()->json(['success' => true, 'data' => $schedules]);
    }

    // ============= EXECUTE INSPECTION =============
    public function startInspection($scheduleId)
    {
        $schedule = InspectionSchedule::with('template.items')->findOrFail($scheduleId);
        $schedule->update(['status' => 'in_progress']);
        return response()->json([
            'success' => true,
            'data' => [
                'schedule' => $schedule,
                'items' => $schedule->template->items,
            ],
        ]);
    }

    public function submitResult(Request $request, $scheduleId)
    {
        $this->validate($request, [
            'inspector_id' => 'required|exists:personnel,id',
            'findings' => 'required|array|min:1',
            'findings.*.item_text' => 'required|string',
            'findings.*.status' => 'required|in:pass,fail,na',
        ]);

        return DB::transaction(function () use ($request, $scheduleId) {
            $schedule = InspectionSchedule::findOrFail($scheduleId);
            $findings = collect($request->findings);
            $passed = $findings->where('status', 'pass')->count();
            $failed = $findings->where('status', 'fail')->count();
            $total = $findings->count();
            $criticalFailed = $findings->where('status', 'fail')
                ->filter(fn($f) => isset($f['severity']) && in_array($f['severity'], ['high', 'critical']))
                ->count();

            $overall = $criticalFailed > 0 ? 'fail'
                     : ($failed > 0 ? 'pass_with_findings' : 'pass');

            $result = InspectionResult::create([
                'inspection_schedule_id' => $schedule->id,
                'inspector_id' => $request->inspector_id,
                'inspected_at' => now(),
                'overall_result' => $overall,
                'total_items' => $total,
                'passed_items' => $passed,
                'failed_items' => $failed,
                'summary' => $request->summary,
                'signature_path' => $request->signature_path,
            ]);

            foreach ($findings as $f) {
                $caId = null;
                if ($f['status'] === 'fail' && !empty($f['create_corrective_action'])) {
                    $ca = CorrectiveAction::create([
                        'description' => $f['remarks'] ?? $f['item_text'],
                        'priority' => $f['severity'] ?? 'medium',
                        'assigned_to' => $f['ca_assigned_to'] ?? null,
                        'due_date' => isset($f['ca_due_date']) ? $f['ca_due_date'] : now()->addDays(7),
                        'status' => 'open',
                        'source_type' => 'inspection',
                        'source_id' => $result->id,
                    ]);
                    $caId = $ca->id;
                }

                InspectionFinding::create([
                    'inspection_result_id' => $result->id,
                    'inspection_template_item_id' => $f['inspection_template_item_id'] ?? null,
                    'item_text' => $f['item_text'],
                    'status' => $f['status'],
                    'severity' => $f['severity'] ?? null,
                    'remarks' => $f['remarks'] ?? null,
                    'photo_path' => $f['photo_path'] ?? null,
                    'corrective_action_id' => $caId,
                ]);
            }

            $schedule->update(['status' => 'completed']);

            if ($schedule->frequency) {
                $next = $this->advanceByFrequency($schedule->scheduled_date, $schedule->frequency);
                InspectionSchedule::create([
                    'inspection_template_id' => $schedule->inspection_template_id,
                    'title' => $schedule->title,
                    'work_area_id' => $schedule->work_area_id,
                    'equipment_id' => $schedule->equipment_id,
                    'assigned_to' => $schedule->assigned_to,
                    'scheduled_date' => $next,
                    'frequency' => $schedule->frequency,
                ]);
            }

            return response()->json([
                'success' => true,
                'data' => $result->load('findings'),
            ], 201);
        });
    }

    public function showResult($id)
    {
        return response()->json([
            'success' => true,
            'data' => InspectionResult::with(['findings', 'inspector', 'schedule.template'])->findOrFail($id),
        ]);
    }

    private function advanceByFrequency($date, string $frequency): Carbon
    {
        $d = Carbon::parse($date);
        return match ($frequency) {
            'daily' => $d->addDay(),
            'weekly' => $d->addWeek(),
            'monthly' => $d->addMonth(),
            'quarterly' => $d->addMonths(3),
            'yearly' => $d->addYear(),
            default => $d->addDay(),
        };
    }

    private function calculateNextOccurrence($date, string $frequency): string
    {
        return $this->advanceByFrequency($date, $frequency)->toDateString();
    }
}
