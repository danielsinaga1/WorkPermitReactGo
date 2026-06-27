<?php

namespace App\Http\Controllers;

use App\Models\ScorecardPerspective;
use App\Models\ScorecardKpi;
use App\Models\HseKpiMetric;
use App\Models\HseKpiRecord;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class ScorecardController extends Controller
{
    public function indexPerspectives()
    {
        $rows = ScorecardPerspective::active()
            ->with('kpis.metric')
            ->orderBy('display_order')
            ->get();
        return response()->json(['success' => true, 'data' => $rows]);
    }

    public function storePerspective(Request $request)
    {
        $this->validate($request, [
            'code' => 'required|string|unique:scorecard_perspectives,code',
            'name' => 'required|string',
            'weight' => 'nullable|numeric|min:0|max:100',
        ]);
        $row = ScorecardPerspective::create($request->all());
        return response()->json(['success' => true, 'data' => $row], 201);
    }

    public function updatePerspective(Request $request, $id)
    {
        $row = ScorecardPerspective::findOrFail($id);
        $row->update($request->all());
        return response()->json(['success' => true, 'data' => $row->fresh('kpis.metric')]);
    }

    public function destroyPerspective($id)
    {
        $row = ScorecardPerspective::findOrFail($id);
        $row->delete();
        return response()->json(['success' => true]);
    }

    public function attachKpi(Request $request, $perspectiveId)
    {
        $persp = ScorecardPerspective::findOrFail($perspectiveId);
        $this->validate($request, [
            'hse_kpi_metric_id' => 'required|exists:hse_kpi_metrics,id',
            'weight'            => 'nullable|numeric|min:0|max:100',
            'label'             => 'nullable|string',
        ]);
        $row = $persp->kpis()->create($request->all());
        return response()->json(['success' => true, 'data' => $row->load('metric')], 201);
    }

    public function detachKpi($kpiId)
    {
        $row = ScorecardKpi::findOrFail($kpiId);
        $row->delete();
        return response()->json(['success' => true]);
    }

    /**
     * Compute scorecard for a period.
     * Each perspective gets a normalized score (0-100).
     */
    public function compute(Request $request)
    {
        $start = $request->input('period_start', now()->startOfMonth()->toDateString());
        $end   = $request->input('period_end', now()->endOfMonth()->toDateString());

        $perspectives = ScorecardPerspective::active()->with('kpis.metric')->orderBy('display_order')->get();

        $results = [];
        $totalWeight = 0;
        $weightedSum = 0;

        foreach ($perspectives as $persp) {
            $kpiResults = [];
            $kpiWeightSum = 0;
            $kpiWeightedScore = 0;

            foreach ($persp->kpis as $skpi) {
                if (!$skpi->metric) continue;
                $metric = $skpi->metric;

                $latest = HseKpiRecord::where('hse_kpi_metric_id', $metric->id)
                    ->where('period_start', '>=', $start)
                    ->where('period_end', '<=', $end)
                    ->orderByDesc('period_end')
                    ->first();

                $value = $latest?->value;
                $target = $metric->target_value;

                $score = $this->normalizeKpi($value, $target, $metric->lower_is_better);

                $kpiResults[] = [
                    'kpi_id' => $skpi->id,
                    'metric_code' => $metric->metric_code,
                    'metric_name' => $skpi->label ?: $metric->metric_name,
                    'value' => $value,
                    'target' => $target,
                    'unit' => $metric->unit,
                    'score' => $score,
                    'weight' => (float) $skpi->weight,
                ];
                $kpiWeightSum    += (float) $skpi->weight;
                $kpiWeightedScore += $score * (float) $skpi->weight;
            }

            $perspectiveScore = $kpiWeightSum > 0 ? round($kpiWeightedScore / $kpiWeightSum, 2) : 0;
            $results[] = [
                'id' => $persp->id,
                'code' => $persp->code,
                'name' => $persp->name,
                'weight' => (float) $persp->weight,
                'score' => $perspectiveScore,
                'status' => $this->statusFor($perspectiveScore),
                'kpis' => $kpiResults,
            ];

            $weightedSum += $perspectiveScore * (float) $persp->weight;
            $totalWeight += (float) $persp->weight;
        }

        $overall = $totalWeight > 0 ? round($weightedSum / $totalWeight, 2) : 0;

        return response()->json([
            'success' => true,
            'data' => [
                'period'  => ['start' => $start, 'end' => $end],
                'overall' => $overall,
                'overall_status' => $this->statusFor($overall),
                'perspectives' => $results,
            ],
        ]);
    }

    private function normalizeKpi($value, $target, ?bool $lowerIsBetter): float
    {
        if ($value === null || $target === null || (float) $target == 0) return 0;
        $value = (float) $value; $target = (float) $target;

        if ($lowerIsBetter) {
            // 100% if value <= target, decreasing as value grows
            return $value <= $target ? 100 : max(0, 100 - (($value - $target) / $target) * 100);
        }
        // higher is better
        return min(100, ($value / $target) * 100);
    }

    private function statusFor(float $score): string
    {
        if ($score >= 90) return 'baik';
        if ($score >= 70) return 'cukup';
        return 'kurang';
    }
}
