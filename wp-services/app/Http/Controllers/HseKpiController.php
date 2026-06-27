<?php

namespace App\Http\Controllers;

use App\Models\HseKpiMetric;
use App\Models\HseKpiRecord;
use App\Models\SafetyManhoursLog;
use App\Models\Incident;
use App\Models\SafetyObservation;
use App\Models\WorkPermit;
use App\Models\CorrectiveAction;
use App\Models\InspectionResult;
use App\Models\InspectionSchedule;
use App\Models\TrainingRecord;
use App\Models\TrainingMatrix;
use App\Models\BSharpObservation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class HseKpiController extends Controller
{
    public function indexMetrics()
    {
        return response()->json([
            'success' => true,
            'data' => HseKpiMetric::active()->get(),
        ]);
    }

    public function storeMetric(Request $request)
    {
        $this->validate($request, [
            'metric_code' => 'required|unique:hse_kpi_metrics',
            'metric_name' => 'required|string',
        ]);
        $metric = HseKpiMetric::create($request->all());
        return response()->json(['success' => true, 'data' => $metric], 201);
    }

    public function updateMetric(Request $request, $id)
    {
        $metric = HseKpiMetric::findOrFail($id);
        $metric->update($request->all());
        return response()->json(['success' => true, 'data' => $metric]);
    }

    // ============= MANHOURS LOG =============
    public function indexManhours(Request $request)
    {
        $query = SafetyManhoursLog::query();
        if ($request->has('from')) $query->where('log_date', '>=', $request->from);
        if ($request->has('to')) $query->where('log_date', '<=', $request->to);
        if ($request->has('site')) $query->where('site', $request->site);
        return response()->json([
            'success' => true,
            'data' => $query->orderBy('log_date', 'desc')->paginate(50),
        ]);
    }

    public function storeManhours(Request $request)
    {
        $this->validate($request, [
            'log_date' => 'required|date',
            'total_personnel' => 'required|integer',
            'total_hours' => 'required|numeric',
        ]);
        $log = SafetyManhoursLog::create($request->all());
        return response()->json(['success' => true, 'data' => $log], 201);
    }

    // ============= COMPUTE & DASHBOARD =============
    public function computeKpi(Request $request)
    {
        $this->validate($request, [
            'period_start' => 'required|date',
            'period_end' => 'required|date|after_or_equal:period_start',
        ]);

        $start = Carbon::parse($request->period_start);
        $end = Carbon::parse($request->period_end);

        $totalManhours = SafetyManhoursLog::whereBetween('log_date', [$start, $end])
            ->sum('total_hours');

        $ltiCount = Incident::whereBetween('incident_date', [$start, $end])
            ->whereIn('severity', ['lost_time', 'fatality'])
            ->count();

        $recordableCount = Incident::whereBetween('incident_date', [$start, $end])
            ->whereIn('severity', ['medical_treatment', 'restricted_work', 'lost_time', 'fatality'])
            ->count();

        $nearMissCount = Incident::whereBetween('incident_date', [$start, $end])
            ->where('severity', 'near_miss')
            ->count();

        $observationsCount = SafetyObservation::whereBetween('observed_at', [$start, $end])->count();
        $permitsCount = WorkPermit::whereBetween('created_at', [$start, $end])->count();

        $ltifr = $totalManhours > 0 ? ($ltiCount * 1_000_000) / $totalManhours : 0;
        $trifr = $totalManhours > 0 ? ($recordableCount * 1_000_000) / $totalManhours : 0;
        $nmRate = $totalManhours > 0 ? ($nearMissCount * 1_000_000) / $totalManhours : 0;

        $daysSinceLastIncident = $this->daysSinceLastIncident();

        return response()->json([
            'success' => true,
            'data' => [
                'period' => [
                    'start' => $start->toDateString(),
                    'end' => $end->toDateString(),
                ],
                'metrics' => [
                    'LTIFR' => round($ltifr, 4),
                    'TRIFR' => round($trifr, 4),
                    'NEAR_MISS_RATE' => round($nmRate, 4),
                    'TOTAL_MANHOURS' => $totalManhours,
                    'LTI_COUNT' => $ltiCount,
                    'RECORDABLE_COUNT' => $recordableCount,
                    'NEAR_MISS_COUNT' => $nearMissCount,
                    'OBSERVATIONS_COUNT' => $observationsCount,
                    'PERMITS_COUNT' => $permitsCount,
                    'DAYS_SINCE_LAST_INCIDENT' => $daysSinceLastIncident,
                ],
            ],
        ]);
    }

    public function saveKpiSnapshot(Request $request)
    {
        $this->validate($request, [
            'period_start' => 'required|date',
            'period_end' => 'required|date',
            'metrics' => 'required|array',
        ]);

        $records = [];
        foreach ($request->metrics as $code => $value) {
            $metric = HseKpiMetric::where('metric_code', $code)->first();
            if (!$metric) continue;

            $records[] = HseKpiRecord::create([
                'hse_kpi_metric_id' => $metric->id,
                'period_start' => $request->period_start,
                'period_end' => $request->period_end,
                'value' => $value,
                'target_value' => $metric->target_value,
                'calculated_at' => now(),
                'calculated_by' => $request->input('calculated_by'),
            ]);
        }

        return response()->json(['success' => true, 'data' => $records], 201);
    }

    public function trends(Request $request)
    {
        $months = $request->input('months', 12);
        $start = now()->subMonths($months)->startOfMonth();

        $trend = [];
        for ($i = 0; $i < $months; $i++) {
            $monthStart = $start->copy()->addMonths($i);
            $monthEnd = $monthStart->copy()->endOfMonth();

            $manhours = SafetyManhoursLog::whereBetween('log_date', [$monthStart, $monthEnd])
                ->sum('total_hours');

            $lti = Incident::whereBetween('incident_date', [$monthStart, $monthEnd])
                ->whereIn('severity', ['lost_time', 'fatality'])
                ->count();

            $recordable = Incident::whereBetween('incident_date', [$monthStart, $monthEnd])
                ->whereIn('severity', ['medical_treatment', 'restricted_work', 'lost_time', 'fatality'])
                ->count();

            $trend[] = [
                'month' => $monthStart->format('Y-m'),
                'label' => $monthStart->format('M Y'),
                'manhours' => $manhours,
                'lti_count' => $lti,
                'recordable_count' => $recordable,
                'ltifr' => $manhours > 0 ? round(($lti * 1_000_000) / $manhours, 4) : 0,
                'trifr' => $manhours > 0 ? round(($recordable * 1_000_000) / $manhours, 4) : 0,
            ];
        }

        return response()->json(['success' => true, 'data' => $trend]);
    }

    public function exportKpi(Request $request)
    {
        $this->validate($request, [
            'period_start' => 'required|date',
            'period_end' => 'required|date',
            'format' => 'in:csv,json',
        ]);

        $records = HseKpiRecord::with('metric')
            ->whereBetween('period_start', [$request->period_start, $request->period_end])
            ->get();

        if (($request->format ?? 'json') === 'csv') {
            $csv = "Metric,Period Start,Period End,Value,Target,Unit\n";
            foreach ($records as $r) {
                $csv .= sprintf(
                    "%s,%s,%s,%s,%s,%s\n",
                    $r->metric->metric_code,
                    $r->period_start,
                    $r->period_end,
                    $r->value,
                    $r->target_value,
                    $r->metric->unit
                );
            }
            return response($csv, 200, [
                'Content-Type' => 'text/csv',
                'Content-Disposition' => 'attachment; filename=hse_kpi.csv',
            ]);
        }

        return response()->json(['success' => true, 'data' => $records]);
    }

    private function daysSinceLastIncident(): int
    {
        $lastIncident = Incident::whereIn('severity', [
            'medical_treatment', 'restricted_work', 'lost_time', 'fatality',
        ])->orderBy('incident_date', 'desc')->first();

        return $lastIncident ? now()->diffInDays($lastIncident->incident_date) : 9999;
    }

    // ============================================================
    // COMPLIANCE METRICS — Hazard / CAR / Inspection / Training
    // ============================================================
    public function complianceMetrics(Request $request)
    {
        $start = $request->input('period_start', now()->startOfMonth()->toDateString());
        $end   = $request->input('period_end', now()->endOfMonth()->toDateString());
        $workAreaId = $request->input('work_area_id');

        // ---- Hazard Closure: % of unsafe_condition observations closed ----
        $hazQuery = SafetyObservation::whereBetween('observed_at', [$start, $end])
            ->where('category', 'unsafe_condition');
        if ($workAreaId) $hazQuery->where('work_area_id', $workAreaId);
        $hazardTotal  = (clone $hazQuery)->count();
        $hazardClosed = (clone $hazQuery)->whereIn('status', ['closed', 'verified'])->count();
        $hazardClosure = $hazardTotal > 0 ? round(($hazardClosed / $hazardTotal) * 100, 2) : 0;

        // ---- CAR Closure: % of corrective actions completed ----
        $carQuery = CorrectiveAction::whereBetween('due_date', [$start, $end]);
        $carTotal  = (clone $carQuery)->count();
        $carClosed = (clone $carQuery)->where('status', 'completed')->count();
        $carClosure = $carTotal > 0 ? round(($carClosed / $carTotal) * 100, 2) : 0;

        // ---- Inspection Compliance: % of scheduled inspections completed ----
        $insQuery = InspectionSchedule::whereBetween('scheduled_date', [$start, $end]);
        if ($workAreaId) $insQuery->where('work_area_id', $workAreaId);
        $insTotal     = (clone $insQuery)->count();
        $insCompleted = (clone $insQuery)->where('status', 'completed')->count();
        $insCompliance = $insTotal > 0 ? round(($insCompleted / $insTotal) * 100, 2) : 0;

        // ---- Safety Training Compliance: % required trainings passed & not expired ----
        $matrixTotal = TrainingMatrix::count();
        $validRecords = TrainingRecord::where('result', 'pass')
            ->where(function ($q) {
                $q->whereNull('expiry_date')->orWhere('expiry_date', '>=', now());
            })
            ->count();
        $trainingCompliance = $matrixTotal > 0
            ? round(min(100, ($validRecords / max(1, $matrixTotal)) * 100), 2)
            : 0;

        return response()->json([
            'success' => true,
            'data' => [
                'period' => ['start' => $start, 'end' => $end],
                'hazard_closure' => [
                    'value' => $hazardClosure,
                    'unit' => '%',
                    'target' => 90,
                    'numerator' => $hazardClosed,
                    'denominator' => $hazardTotal,
                    'status' => $this->statusFor($hazardClosure, 90, 70, false),
                ],
                'car_closure' => [
                    'value' => $carClosure,
                    'unit' => '%',
                    'target' => 90,
                    'numerator' => $carClosed,
                    'denominator' => $carTotal,
                    'status' => $this->statusFor($carClosure, 90, 70, false),
                ],
                'inspection_compliance' => [
                    'value' => $insCompliance,
                    'unit' => '%',
                    'target' => 95,
                    'numerator' => $insCompleted,
                    'denominator' => $insTotal,
                    'status' => $this->statusFor($insCompliance, 95, 70, false),
                ],
                'training_compliance' => [
                    'value' => $trainingCompliance,
                    'unit' => '%',
                    'target' => 90,
                    'numerator' => $validRecords,
                    'denominator' => $matrixTotal,
                    'status' => $this->statusFor($trainingCompliance, 90, 70, false),
                ],
            ],
        ]);
    }

    // ============================================================
    // OVERALL KPI SCORE — Donut Categorization (Baik/Cukup/Kurang)
    // ============================================================
    public function overallScore(Request $request)
    {
        $start = $request->input('period_start', now()->startOfMonth()->toDateString());
        $end   = $request->input('period_end', now()->endOfMonth()->toDateString());

        // 1. Compute compliance metrics inline
        $compliance = $this->complianceMetrics($request)->getData()->data;

        // 2. Lagging indicators (TRIFR/LTIFR — lower is better, normalize)
        $startC = Carbon::parse($start);
        $endC   = Carbon::parse($end);
        $manhours = SafetyManhoursLog::whereBetween('log_date', [$startC, $endC])->sum('total_hours');
        $lti = Incident::whereBetween('incident_date', [$startC, $endC])
            ->whereIn('severity', ['lost_time', 'fatality'])->count();
        $rec = Incident::whereBetween('incident_date', [$startC, $endC])
            ->whereIn('severity', ['medical_treatment', 'restricted_work', 'lost_time', 'fatality'])->count();

        $ltifr  = $manhours > 0 ? round(($lti * 1_000_000) / $manhours, 4) : 0;
        $trifr  = $manhours > 0 ? round(($rec * 1_000_000) / $manhours, 4) : 0;

        $ltifrTarget = 0.25;
        $trifrTarget = 0.50;
        $ltifrScore  = $ltifr <= 0 ? 100 : max(0, 100 - (($ltifr / $ltifrTarget) * 50));
        $trifrScore  = $trifr <= 0 ? 100 : max(0, 100 - (($trifr / $trifrTarget) * 50));

        $kpis = [
            ['code' => 'TRIFR', 'value' => $trifr, 'target' => $trifrTarget, 'unit' => '', 'normalized' => round($trifrScore, 2), 'lower_is_better' => true],
            ['code' => 'LTIFR', 'value' => $ltifr, 'target' => $ltifrTarget, 'unit' => '', 'normalized' => round($ltifrScore, 2), 'lower_is_better' => true],
            ['code' => 'HAZARD_CLOSURE', 'value' => $compliance->hazard_closure->value, 'target' => 90, 'unit' => '%', 'normalized' => $compliance->hazard_closure->value, 'lower_is_better' => false],
            ['code' => 'CAR_CLOSURE', 'value' => $compliance->car_closure->value, 'target' => 90, 'unit' => '%', 'normalized' => $compliance->car_closure->value, 'lower_is_better' => false],
            ['code' => 'INSPECTION_COMPLIANCE', 'value' => $compliance->inspection_compliance->value, 'target' => 95, 'unit' => '%', 'normalized' => $compliance->inspection_compliance->value, 'lower_is_better' => false],
            ['code' => 'TRAINING_COMPLIANCE', 'value' => $compliance->training_compliance->value, 'target' => 90, 'unit' => '%', 'normalized' => $compliance->training_compliance->value, 'lower_is_better' => false],
        ];

        // Categorize
        $categories = ['baik' => 0, 'cukup' => 0, 'kurang' => 0, 'tidak_dinilai' => 0];
        foreach ($kpis as $k) {
            if ($k['normalized'] === null) {
                $categories['tidak_dinilai']++;
            } elseif ($k['normalized'] >= 90) {
                $categories['baik']++;
            } elseif ($k['normalized'] >= 70) {
                $categories['cukup']++;
            } else {
                $categories['kurang']++;
            }
        }

        $overall = round(array_sum(array_column($kpis, 'normalized')) / count($kpis), 2);
        $overallStatus = $this->statusFor($overall, 90, 70, false);

        return response()->json([
            'success' => true,
            'data' => [
                'period' => ['start' => $start, 'end' => $end],
                'overall_score' => $overall,
                'overall_status' => $overallStatus,
                'kpi_count' => count($kpis),
                'breakdown' => [
                    ['label' => 'Baik (≥ 90%)',  'value' => $categories['baik'],  'percent' => round(($categories['baik']  / count($kpis)) * 100, 1), 'color' => '#22c55e'],
                    ['label' => 'Cukup (70-89%)', 'value' => $categories['cukup'], 'percent' => round(($categories['cukup'] / count($kpis)) * 100, 1), 'color' => '#f59e0b'],
                    ['label' => 'Kurang (< 70%)', 'value' => $categories['kurang'],'percent' => round(($categories['kurang']/ count($kpis)) * 100, 1), 'color' => '#ef4444'],
                    ['label' => 'Tidak Dinilai',  'value' => $categories['tidak_dinilai'], 'percent' => round(($categories['tidak_dinilai'] / count($kpis)) * 100, 1), 'color' => '#94a3b8'],
                ],
                'kpis' => $kpis,
            ],
        ]);
    }

    // ============================================================
    // INCIDENT BY SEVERITY CLASS (Kelas I-IV) — for Pie Chart
    // ============================================================
    public function incidentByClass(Request $request)
    {
        $start = $request->input('period_start', now()->subMonths(6)->toDateString());
        $end   = $request->input('period_end', now()->toDateString());

        $rows = Incident::select('severity_class', DB::raw('COUNT(*) as total'))
            ->whereBetween('incident_date', [$start, $end])
            ->groupBy('severity_class')
            ->get();

        $colors = ['I' => '#ef4444', 'II' => '#f59e0b', 'III' => '#3b82f6', 'IV' => '#22c55e'];
        $total = $rows->sum('total');

        $data = [];
        foreach (['I', 'II', 'III', 'IV'] as $cls) {
            $count = (int) ($rows->firstWhere('severity_class', $cls)->total ?? 0);
            $data[] = [
                'class' => "Kelas $cls",
                'value' => $count,
                'percent' => $total > 0 ? round(($count / $total) * 100) : 0,
                'color' => $colors[$cls],
            ];
        }

        return response()->json([
            'success' => true,
            'data' => [
                'total' => $total,
                'breakdown' => $data,
                'period' => ['start' => $start, 'end' => $end],
            ],
        ]);
    }

    // Helper: status by threshold (lower_is_better=false → higher is better)
    private function statusFor(float $value, float $good, float $fair, bool $lowerIsBetter): string
    {
        if ($lowerIsBetter) {
            if ($value <= $good) return 'baik';
            if ($value <= $fair) return 'cukup';
            return 'kurang';
        }
        if ($value >= $good) return 'baik';
        if ($value >= $fair) return 'cukup';
        return 'kurang';
    }
}
