<?php

namespace App\Http\Controllers;

use App\Models\WorkPermit;
use App\Models\Incident;
use App\Models\SafetyObservation;
use App\Models\CorrectiveAction;
use App\Models\ToolboxMeeting;
use App\Models\LotoLock;
use App\Models\SafetyIndicator;
use App\Models\Personnel;
use App\Models\PersonnelQualification;
use App\Models\EquipmentCertification;
use App\Models\ReportExport;
use App\Models\BSharpObservation;
use App\Models\AuditPlan;
use App\Models\Document;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class HseDashboardController extends Controller
{
    /**
     * Dashboard utama: rekap semua modul.
     */
    public function overview(Request $request)
    {
        $period = $request->get('period', 'month'); // day, week, month, quarter, year
        $dateFrom = $this->getPeriodStart($period);

        $data = [
            // Permit Stats
            'permits' => [
                'total'     => WorkPermit::where('created_at', '>=', $dateFrom)->count(),
                'active'    => WorkPermit::active()->count(),
                'pending'   => WorkPermit::byStatus('pending_approval')->count(),
                'completed' => WorkPermit::where('status', 'completed')->where('created_at', '>=', $dateFrom)->count(),
                'rejected'  => WorkPermit::where('status', 'rejected')->where('created_at', '>=', $dateFrom)->count(),
                'expired'   => WorkPermit::where('status', 'expired')->count(),
                'by_type'   => WorkPermit::where('created_at', '>=', $dateFrom)
                                ->selectRaw('permit_type_id, count(*) as total')
                                ->groupBy('permit_type_id')
                                ->with('permitType:id,name,code,color_code')
                                ->get(),
                'by_priority' => WorkPermit::where('created_at', '>=', $dateFrom)
                                ->selectRaw('priority, count(*) as total')
                                ->groupBy('priority')
                                ->get(),
            ],

            // HSE Stats
            'incidents' => [
                'total'          => Incident::where('incident_date', '>=', $dateFrom)->count(),
                'open'           => Incident::open()->count(),
                'near_miss'      => Incident::where('incident_date', '>=', $dateFrom)->where('type', 'near_miss')->count(),
                'lost_time'      => Incident::where('incident_date', '>=', $dateFrom)->where('type', 'lost_time_injury')->count(),
                'total_lost_days'=> Incident::where('incident_date', '>=', $dateFrom)->sum('lost_days'),
                'by_type'        => Incident::where('incident_date', '>=', $dateFrom)
                                    ->selectRaw('type, count(*) as total')
                                    ->groupBy('type')
                                    ->get(),
                'by_severity'    => Incident::where('incident_date', '>=', $dateFrom)
                                    ->selectRaw('severity, count(*) as total')
                                    ->groupBy('severity')
                                    ->get(),
            ],

            // Safety Observations
            'observations' => [
                'total'    => SafetyObservation::where('observed_at', '>=', $dateFrom)->count(),
                'open'     => SafetyObservation::open()->count(),
                'critical' => SafetyObservation::bySeverity('critical')->open()->count(),
                'by_category' => SafetyObservation::where('observed_at', '>=', $dateFrom)
                                ->selectRaw('category, count(*) as total')
                                ->groupBy('category')
                                ->get(),
            ],

            // Corrective Actions
            'corrective_actions' => [
                'total'   => CorrectiveAction::where('created_at', '>=', $dateFrom)->count(),
                'open'    => CorrectiveAction::open()->count(),
                'overdue' => CorrectiveAction::overdue()->count(),
                'closed'  => CorrectiveAction::whereIn('status', ['completed', 'verified'])
                            ->where('created_at', '>=', $dateFrom)->count(),
            ],

            // Toolbox Meetings
            'toolbox_meetings' => [
                'total'    => ToolboxMeeting::where('meeting_date', '>=', $dateFrom)->count(),
                'completed'=> ToolboxMeeting::completed()->where('meeting_date', '>=', $dateFrom)->count(),
            ],

            // LOTO
            'loto' => [
                'active_locks' => LotoLock::active()->count(),
            ],

            // Certification Alerts
            'alerts' => [
                'expiring_personnel_certs' => PersonnelQualification::expiringSoon(30)->count(),
                'expiring_equipment_certs' => EquipmentCertification::valid()
                    ->whereBetween('expiry_date', [now(), now()->addDays(30)])->count(),
                'expired_personnel_certs'  => PersonnelQualification::where('status', 'valid')
                    ->where('expiry_date', '<', now())->count(),
            ],
        ];

        return $this->successResponse($data);
    }

    /**
     * Safety Leading Indicators — prediksi risiko.
     */
    public function leadingIndicators(Request $request)
    {
        $dateFrom = $this->getPeriodStart($request->get('period', 'month'));

        $totalPermits = WorkPermit::where('created_at', '>=', $dateFrom)->count() ?: 1;
        $totalWorkers = Personnel::active()->count() ?: 1;

        $indicators = [
            [
                'code'  => 'TBM_COMPLIANCE',
                'name'  => 'Toolbox Meeting Compliance Rate',
                'value' => $this->calculateTbmComplianceRate($dateFrom),
                'unit'  => '%',
                'target'=> 95,
                'trend' => $this->calculateTrend('tbm_compliance'),
            ],
            [
                'code'  => 'OBSERVATION_RATE',
                'name'  => 'Safety Observation Rate',
                'value' => round(SafetyObservation::where('observed_at', '>=', $dateFrom)->count() / $totalWorkers * 100, 1),
                'unit'  => 'per 100 workers',
                'target'=> 50,
                'trend' => $this->calculateTrend('observation_rate'),
            ],
            [
                'code'  => 'CA_CLOSURE_RATE',
                'name'  => 'Corrective Action Closure Rate',
                'value' => $this->calculateCaClosureRate($dateFrom),
                'unit'  => '%',
                'target'=> 90,
                'trend' => $this->calculateTrend('ca_closure'),
            ],
            [
                'code'  => 'PERMIT_COMPLIANCE',
                'name'  => 'Permit Compliance Rate',
                'value' => $this->calculatePermitComplianceRate($dateFrom),
                'unit'  => '%',
                'target'=> 98,
                'trend' => $this->calculateTrend('permit_compliance'),
            ],
            [
                'code'  => 'NEAR_MISS_RATIO',
                'name'  => 'Near Miss Reporting Ratio',
                'value' => $this->calculateNearMissRatio($dateFrom),
                'unit'  => 'ratio',
                'target'=> 10,
                'trend' => $this->calculateTrend('near_miss_ratio'),
            ],
            [
                'code'  => 'TRAINING_COMPLIANCE',
                'name'  => 'Personnel Qualification Compliance',
                'value' => $this->calculateTrainingCompliance(),
                'unit'  => '%',
                'target'=> 100,
                'trend' => $this->calculateTrend('training_compliance'),
            ],
        ];

        // Prediksi Risiko berdasarkan indikator
        $riskScore = $this->calculateOverallRiskScore($indicators);

        return $this->successResponse([
            'indicators'     => $indicators,
            'risk_score'     => $riskScore,
            'risk_level'     => $this->riskScoreToLevel($riskScore),
            'recommendations'=> $this->generateRecommendations($indicators),
        ]);
    }

    /**
     * Grafik trend data bulanan.
     */
    public function trendAnalytics(Request $request)
    {
        $months = $request->get('months', 12);
        $trends = [];

        for ($i = $months - 1; $i >= 0; $i--) {
            $start = Carbon::now()->subMonths($i)->startOfMonth();
            $end   = Carbon::now()->subMonths($i)->endOfMonth();
            $label = $start->format('M Y');

            $trends[] = [
                'period'       => $label,
                'permits'      => WorkPermit::whereBetween('created_at', [$start, $end])->count(),
                'incidents'    => Incident::whereBetween('incident_date', [$start, $end])->count(),
                'near_misses'  => Incident::whereBetween('incident_date', [$start, $end])->where('type', 'near_miss')->count(),
                'observations' => SafetyObservation::whereBetween('observed_at', [$start, $end])->count(),
                'tbm_sessions' => ToolboxMeeting::completed()->whereBetween('meeting_date', [$start, $end])->count(),
                'ca_closed'    => CorrectiveAction::whereIn('status', ['completed', 'verified'])->whereBetween('completed_date', [$start, $end])->count(),
                'lost_days'    => Incident::whereBetween('incident_date', [$start, $end])->sum('lost_days'),
            ];
        }

        return $this->successResponse($trends);
    }

    /**
     * Ekspor laporan.
     */
    public function exportReport(Request $request)
    {
        $this->validate($request, [
            'report_type' => 'required|string',
            'format'      => 'required|in:pdf,excel,csv',
        ]);

        $export = ReportExport::create([
            'report_type'  => $request->report_type,
            'format'       => $request->format,
            'parameters'   => $request->get('parameters', []),
            'status'       => 'queued',
            'requested_by' => $request->get('requested_by', 'User'),
        ]);

        // Dalam implementasi produksi, dispatch ke queue
        // dispatch(new GenerateReportJob($export));

        return $this->successResponse($export, 'Laporan sedang diproses', 201);
    }

    public function exportStatus($id)
    {
        $export = ReportExport::find($id);
        if (!$export) return $this->notFoundResponse();
        return $this->successResponse($export);
    }

    // ================================================================
    // ARSHE-PARITY: ACTIVITY FEED & RECENT DOCUMENTS
    // ================================================================

    /**
     * Recent activity feed across all modules — for "Aktivitas Terbaru" panel.
     */
    public function activityFeed(Request $request)
    {
        $limit = (int) $request->input('limit', 10);

        $events = collect();

        Incident::orderByDesc('reported_date')->limit($limit)->get()
            ->each(function ($i) use ($events) {
                $events->push([
                    'type'      => 'incident',
                    'icon'      => 'pi-exclamation-triangle',
                    'color'     => '#ef4444',
                    'title'     => 'Incident baru dilaporkan',
                    'subtitle'  => $i->incident_number . ' - ' . ($i->exact_location ?? 'Unknown'),
                    'reference' => '/dashboard/hse/incidents',
                    'happened_at' => $i->reported_date ?? $i->created_at,
                ]);
            });

        CorrectiveAction::orderByDesc('updated_at')->limit($limit)->get()
            ->each(function ($c) use ($events) {
                $events->push([
                    'type'      => 'corrective_action',
                    'icon'      => 'pi-check-circle',
                    'color'     => '#10b981',
                    'title'     => 'CAR ' . $c->action_number . ' ' . ($c->status === 'completed' ? 'selesai' : 'diupdate'),
                    'subtitle'  => 'Oleh ' . ($c->assigned_by_name ?? 'System'),
                    'reference' => '/dashboard/hse/corrective-actions',
                    'happened_at' => $c->updated_at,
                ]);
            });

        SafetyObservation::orderByDesc('observed_at')->limit($limit)->get()
            ->each(function ($o) use ($events) {
                $events->push([
                    'type'      => 'observation',
                    'icon'      => 'pi-eye',
                    'color'     => '#f59e0b',
                    'title'     => 'Hazard / Observation baru',
                    'subtitle'  => ($o->category ?? '') . ' - ' . ($o->exact_location ?? ''),
                    'reference' => '/dashboard/hse/observations',
                    'happened_at' => $o->observed_at ?? $o->created_at,
                ]);
            });

        BSharpObservation::orderByDesc('observed_at')->limit($limit)->get()
            ->each(function ($b) use ($events) {
                $events->push([
                    'type'      => 'bsharp',
                    'icon'      => 'pi-users',
                    'color'     => $b->behavior_category === 'safe' ? '#10b981' : '#f97316',
                    'title'     => 'B-Sharp Observation: ' . ($b->behavior_category === 'safe' ? 'Perilaku Aman' : 'Perilaku Berisiko'),
                    'subtitle'  => $b->title,
                    'reference' => '/dashboard/hse/bsharp',
                    'happened_at' => $b->observed_at,
                ]);
            });

        ToolboxMeeting::orderByDesc('meeting_date')->limit($limit)->get()
            ->each(function ($t) use ($events) {
                $events->push([
                    'type'      => 'toolbox',
                    'icon'      => 'pi-comments',
                    'color'     => '#3b82f6',
                    'title'     => 'Toolbox Meeting "' . $t->title . '"',
                    'subtitle'  => $t->status === 'completed' ? 'selesai' : 'dijadwalkan',
                    'reference' => '/dashboard/hse/toolbox-meetings',
                    'happened_at' => $t->meeting_date,
                ]);
            });

        $sorted = $events
            ->sortByDesc('happened_at')
            ->values()
            ->take($limit)
            ->map(function ($e) {
                $e['relative'] = $this->relativeTime(Carbon::parse($e['happened_at']));
                return $e;
            });

        return response()->json(['success' => true, 'data' => $sorted]);
    }

    /**
     * Recent documents for "Dokumen Terbaru" widget.
     */
    public function recentDocuments(Request $request)
    {
        $limit = (int) $request->input('limit', 5);
        $docs = Document::active()->orderByDesc('updated_at')->limit($limit)->get();

        return response()->json(['success' => true, 'data' => $docs]);
    }

    private function relativeTime(Carbon $time): string
    {
        $diff = now()->diffInMinutes($time);
        if ($diff < 1) return 'baru saja';
        if ($diff < 60) return $diff . ' menit lalu';
        if ($diff < 1440) return floor($diff / 60) . ' jam lalu';
        return floor($diff / 1440) . ' hari lalu';
    }

    // ================================================================
    // PRIVATE HELPERS
    // ================================================================

    private function getPeriodStart(string $period): Carbon
    {
        return match ($period) {
            'day'     => Carbon::now()->startOfDay(),
            'week'    => Carbon::now()->startOfWeek(),
            'month'   => Carbon::now()->startOfMonth(),
            'quarter' => Carbon::now()->startOfQuarter(),
            'year'    => Carbon::now()->startOfYear(),
            default   => Carbon::now()->startOfMonth(),
        };
    }

    private function calculateTbmComplianceRate(Carbon $from): float
    {
        $activePermits = WorkPermit::where('created_at', '>=', $from)
            ->whereIn('status', ['active', 'completed', 'closed'])->count();
        if ($activePermits === 0) return 100;

        $tbmConducted = ToolboxMeeting::completed()->where('meeting_date', '>=', $from)->count();
        return round(min(($tbmConducted / $activePermits) * 100, 100), 1);
    }

    private function calculateCaClosureRate(Carbon $from): float
    {
        $total = CorrectiveAction::where('created_at', '>=', $from)->count();
        if ($total === 0) return 100;
        $closed = CorrectiveAction::whereIn('status', ['completed', 'verified'])
            ->where('created_at', '>=', $from)->count();
        return round(($closed / $total) * 100, 1);
    }

    private function calculatePermitComplianceRate(Carbon $from): float
    {
        $total = WorkPermit::where('created_at', '>=', $from)
            ->whereNotIn('status', ['draft', 'cancelled'])->count();
        if ($total === 0) return 100;
        $compliant = WorkPermit::where('created_at', '>=', $from)
            ->whereIn('status', ['approved', 'active', 'completed', 'closed'])->count();
        return round(($compliant / $total) * 100, 1);
    }

    private function calculateNearMissRatio(Carbon $from): float
    {
        $incidents = Incident::where('incident_date', '>=', $from)
            ->where('type', '!=', 'near_miss')->count();
        if ($incidents === 0) return 0;
        $nearMiss = Incident::where('incident_date', '>=', $from)
            ->where('type', 'near_miss')->count();
        return round($nearMiss / $incidents, 1);
    }

    private function calculateTrainingCompliance(): float
    {
        $totalPersonnel = Personnel::active()->count();
        if ($totalPersonnel === 0) return 100;
        $expired = PersonnelQualification::where('status', 'valid')
            ->where('expiry_date', '<', now())->distinct('personnel_id')->count('personnel_id');
        return round((($totalPersonnel - $expired) / $totalPersonnel) * 100, 1);
    }

    private function calculateTrend(string $indicatorCode): string
    {
        // Simplified: compare current month vs previous month
        return 'stable'; // up, down, stable
    }

    private function calculateOverallRiskScore(array $indicators): float
    {
        $score = 0;
        foreach ($indicators as $ind) {
            $target = $ind['target'] ?: 1;
            $ratio = $ind['value'] / $target;
            if ($ratio < 0.5) $score += 3;
            elseif ($ratio < 0.8) $score += 2;
            elseif ($ratio < 1.0) $score += 1;
        }
        return round($score / count($indicators) * 10, 1);
    }

    private function riskScoreToLevel(float $score): string
    {
        if ($score >= 25) return 'critical';
        if ($score >= 15) return 'high';
        if ($score >= 8)  return 'medium';
        return 'low';
    }

    private function generateRecommendations(array $indicators): array
    {
        $recs = [];
        foreach ($indicators as $ind) {
            if ($ind['target'] && $ind['value'] < $ind['target'] * 0.8) {
                $recs[] = "Perhatian: {$ind['name']} berada di bawah target ({$ind['value']} vs {$ind['target']} {$ind['unit']})";
            }
        }
        return $recs;
    }
}
