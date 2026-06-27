<?php

namespace App\Http\Controllers;

use App\Models\PermitTemplate;
use App\Models\WorkPermit;
use Illuminate\Http\Request;

class PermitTemplateController extends Controller
{
    public function index(Request $request)
    {
        $query = PermitTemplate::with(['permitType', 'workArea']);
        if ($request->has('permit_type_id')) $query->where('permit_type_id', $request->permit_type_id);
        if ($request->boolean('active_only')) $query->active();
        return response()->json([
            'success' => true,
            'data' => $query->orderBy('usage_count', 'desc')->orderBy('name')->get(),
        ]);
    }

    public function show($id)
    {
        return response()->json([
            'success' => true,
            'data' => PermitTemplate::with(['permitType', 'workArea'])->findOrFail($id),
        ]);
    }

    public function store(Request $request)
    {
        $this->validate($request, [
            'code' => 'required|unique:permit_templates',
            'name' => 'required|string',
            'permit_type_id' => 'required|exists:permit_types,id',
        ]);
        $template = PermitTemplate::create($request->all());
        return response()->json(['success' => true, 'data' => $template], 201);
    }

    public function update(Request $request, $id)
    {
        $template = PermitTemplate::findOrFail($id);
        $template->update($request->all());
        return response()->json(['success' => true, 'data' => $template]);
    }

    public function destroy($id)
    {
        PermitTemplate::findOrFail($id)->delete();
        return response()->json(['success' => true]);
    }

    public function createPermitFromTemplate(Request $request, $templateId)
    {
        $this->validate($request, [
            'title' => 'required|string',
            'work_description' => 'required|string',
            'planned_start' => 'required|date',
            'requested_by' => 'required|exists:personnel,id',
        ]);

        $template = PermitTemplate::findOrFail($templateId);

        $permitNumber = 'WP-' . date('Ymd') . '-' . str_pad((string) (WorkPermit::count() + 1), 4, '0', STR_PAD_LEFT);

        $plannedStart = \Carbon\Carbon::parse($request->planned_start);
        $plannedEnd = $request->input('planned_end')
            ? \Carbon\Carbon::parse($request->planned_end)
            : $plannedStart->copy()->addHours($template->default_duration_hours);

        $permit = WorkPermit::create([
            'permit_number' => $permitNumber,
            'permit_type_id' => $template->permit_type_id,
            'permit_template_id' => $template->id,
            'work_area_id' => $request->input('work_area_id', $template->default_work_area_id),
            'requested_by' => $request->requested_by,
            'title' => $request->title,
            'work_description' => $request->work_description,
            'planned_start' => $plannedStart,
            'planned_end' => $plannedEnd,
            'priority' => $request->input('priority', 'medium'),
            'status' => 'draft',
            'safety_precautions' => $template->default_safety_precautions,
            'ppe_requirements' => $template->default_ppe_requirements,
        ]);

        $template->incrementUsage();

        return response()->json(['success' => true, 'data' => $permit], 201);
    }

    public function clonePermit(Request $request, $permitId)
    {
        $original = WorkPermit::findOrFail($permitId);

        $permitNumber = 'WP-' . date('Ymd') . '-' . str_pad((string) (WorkPermit::count() + 1), 4, '0', STR_PAD_LEFT);

        $clone = $original->replicate(['actual_start', 'actual_end', 'closed_at', 'closed_by_name']);
        $clone->permit_number = $permitNumber;
        $clone->status = 'draft';
        $clone->current_approval_stage = 0;
        $clone->title = ($request->input('title_prefix', 'COPY OF ')) . $original->title;
        $clone->planned_start = $request->input('planned_start', now()->addDay());
        $clone->planned_end = $request->input('planned_end', now()->addDay()->addHours(8));
        $clone->save();

        return response()->json(['success' => true, 'data' => $clone], 201);
    }
}
