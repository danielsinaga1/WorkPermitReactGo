<?php

namespace App\Http\Controllers;

use App\Models\BSharpObservation;
use App\Models\Personnel;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class BSharpController extends Controller
{
    public function index(Request $request)
    {
        $query = BSharpObservation::with(['workArea', 'observer', 'followupPic']);

        if ($request->filled('behavior_category')) {
            $query->where('behavior_category', $request->behavior_category);
        }
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }
        if ($request->filled('work_area_id')) {
            $query->where('work_area_id', $request->work_area_id);
        }
        if ($request->filled('from')) {
            $query->where('observed_at', '>=', $request->from);
        }
        if ($request->filled('to')) {
            $query->where('observed_at', '<=', $request->to);
        }
        if ($request->filled('search')) {
            $s = $request->search;
            $query->where(function ($q) use ($s) {
                $q->where('title', 'like', "%$s%")
                  ->orWhere('description', 'like', "%$s%")
                  ->orWhere('observer_name', 'like', "%$s%")
                  ->orWhere('observation_number', 'like', "%$s%");
            });
        }

        $perPage = (int) $request->input('per_page', 15);
        return response()->json([
            'success' => true,
            'data' => $query->orderByDesc('observed_at')->paginate($perPage),
        ]);
    }

    public function show($id)
    {
        $obs = BSharpObservation::with(['workArea', 'observer', 'followupPic'])->findOrFail($id);
        return response()->json(['success' => true, 'data' => $obs]);
    }

    public function store(Request $request)
    {
        $this->validate($request, [
            'observed_at'        => 'required|date',
            'title'              => 'required|string|max:255',
            'description'        => 'required|string',
            'behavior_category'  => 'required|in:safe,at_risk',
            'observer_name'      => 'required|string|max:255',
            'work_area_id'       => 'nullable|integer|exists:work_areas,id',
            'observer_id'        => 'nullable|integer|exists:personnel,id',
            'observed_subject_name' => 'nullable|string',
            'behavior_tags'      => 'nullable|array',
            'recommended_action' => 'nullable|string',
            'photos'             => 'nullable|array',
            // optional inline follow-up
            'followup_pic_name'  => 'nullable|string',
            'followup_pic_id'    => 'nullable|integer|exists:personnel,id',
            'followup_plan'      => 'nullable|string',
            'followup_target_date' => 'nullable|date',
        ]);

        $data = $request->all();
        $data['observation_number'] = BSharpObservation::generateNumber();

        // If category=at_risk and follow-up info provided, set status follow_up
        if (($data['behavior_category'] ?? null) === 'at_risk' && !empty($data['followup_plan'])) {
            $data['status'] = 'follow_up';
        }

        $obs = BSharpObservation::create($data);
        return response()->json(['success' => true, 'data' => $obs->load(['workArea', 'observer'])], 201);
    }

    public function update(Request $request, $id)
    {
        $obs = BSharpObservation::findOrFail($id);
        $this->validate($request, [
            'title'              => 'sometimes|string|max:255',
            'description'        => 'sometimes|string',
            'behavior_category'  => 'sometimes|in:safe,at_risk',
            'recommended_action' => 'nullable|string',
            'status'             => 'sometimes|in:open,follow_up,completed',
            'followup_pic_name'  => 'nullable|string',
            'followup_pic_id'    => 'nullable|integer|exists:personnel,id',
            'followup_plan'      => 'nullable|string',
            'followup_target_date' => 'nullable|date',
            'photos'             => 'nullable|array',
        ]);
        $obs->update($request->all());
        return response()->json(['success' => true, 'data' => $obs->fresh(['workArea', 'observer', 'followupPic'])]);
    }

    public function complete(Request $request, $id)
    {
        $obs = BSharpObservation::findOrFail($id);
        $obs->status = 'completed';
        $obs->followup_completed_at = now();
        $obs->save();
        return response()->json(['success' => true, 'data' => $obs]);
    }

    public function destroy($id)
    {
        $obs = BSharpObservation::findOrFail($id);
        $obs->delete();
        return response()->json(['success' => true]);
    }

    public function summary(Request $request)
    {
        $start = $request->input('from', now()->startOfMonth()->toDateString());
        $end   = $request->input('to', now()->endOfMonth()->toDateString());

        $base = BSharpObservation::whereBetween('observed_at', [$start, $end]);

        $total = (clone $base)->count();
        $safe  = (clone $base)->safe()->count();
        $atRisk = (clone $base)->atRisk()->count();
        $observers = BSharpObservation::whereBetween('observed_at', [$start, $end])
            ->whereNotNull('observer_id')
            ->distinct('observer_id')
            ->count('observer_id');

        return response()->json([
            'success' => true,
            'data' => [
                'period' => ['start' => $start, 'end' => $end],
                'total_observations' => $total,
                'safe_behavior'   => $safe,
                'at_risk_behavior' => $atRisk,
                'safe_percent'    => $total > 0 ? round(($safe / $total) * 100, 1) : 0,
                'at_risk_percent' => $total > 0 ? round(($atRisk / $total) * 100, 1) : 0,
                'active_observers' => $observers,
            ],
        ]);
    }
}
