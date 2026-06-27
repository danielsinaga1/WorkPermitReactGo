<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;
use App\Models\HseKpiMetric;
use App\Models\ScorecardPerspective;
use App\Models\ScorecardKpi;
use App\Models\Document;

class ArsheGapSeeder extends Seeder
{
    public function run(): void
    {
        // ----- Default KPI metrics (idempotent) -----
        $metrics = [
            ['metric_code' => 'TRIFR', 'metric_name' => 'TRIR / TRIFR', 'unit' => '', 'target_value' => 0.5, 'lower_is_better' => true],
            ['metric_code' => 'LTIFR', 'metric_name' => 'LTIFR', 'unit' => '', 'target_value' => 0.25, 'lower_is_better' => true],
            ['metric_code' => 'HAZARD_CLOSURE', 'metric_name' => 'Hazard Closure', 'unit' => '%', 'target_value' => 90, 'lower_is_better' => false],
            ['metric_code' => 'CAR_CLOSURE', 'metric_name' => 'CAR Closure', 'unit' => '%', 'target_value' => 90, 'lower_is_better' => false],
            ['metric_code' => 'INSPECTION_COMPLIANCE', 'metric_name' => 'Inspection Compliance', 'unit' => '%', 'target_value' => 95, 'lower_is_better' => false],
            ['metric_code' => 'TRAINING_COMPLIANCE', 'metric_name' => 'Safety Training Compliance', 'unit' => '%', 'target_value' => 90, 'lower_is_better' => false],
            ['metric_code' => 'NEAR_MISS_RATE', 'metric_name' => 'Near Miss Rate', 'unit' => '', 'target_value' => 5.0, 'lower_is_better' => false],
        ];

        foreach ($metrics as $m) {
            HseKpiMetric::firstOrCreate(
                ['metric_code' => $m['metric_code']],
                array_merge($m, ['is_active' => true])
            );
        }

        // ----- Default scorecard perspectives -----
        $perspectives = [
            ['code' => 'safety_leadership',  'name' => 'Safety Leadership',  'weight' => 20, 'display_order' => 1],
            ['code' => 'employee_engagement','name' => 'Employee Engagement','weight' => 20, 'display_order' => 2],
            ['code' => 'process_system',     'name' => 'Process & System',   'weight' => 30, 'display_order' => 3],
            ['code' => 'learning_growth',    'name' => 'Learning & Growth',  'weight' => 15, 'display_order' => 4],
            ['code' => 'incident_management','name' => 'Incident Management','weight' => 15, 'display_order' => 5],
        ];

        foreach ($perspectives as $p) {
            ScorecardPerspective::firstOrCreate(
                ['code' => $p['code']],
                array_merge($p, ['is_active' => true])
            );
        }

        // ----- Default mapping perspective → KPI -----
        $byCode = HseKpiMetric::pluck('id', 'metric_code');
        $byPerspective = ScorecardPerspective::pluck('id', 'code');

        $mapping = [
            'safety_leadership'   => ['TRIFR', 'LTIFR'],
            'employee_engagement' => ['HAZARD_CLOSURE'],
            'process_system'      => ['INSPECTION_COMPLIANCE', 'CAR_CLOSURE'],
            'learning_growth'     => ['TRAINING_COMPLIANCE'],
            'incident_management' => ['NEAR_MISS_RATE'],
        ];

        foreach ($mapping as $perspectiveCode => $codes) {
            $persId = $byPerspective[$perspectiveCode] ?? null;
            if (!$persId) continue;

            $weight = round(100 / count($codes), 2);
            foreach ($codes as $idx => $code) {
                $metricId = $byCode[$code] ?? null;
                if (!$metricId) continue;

                ScorecardKpi::firstOrCreate(
                    [
                        'scorecard_perspective_id' => $persId,
                        'hse_kpi_metric_id' => $metricId,
                    ],
                    [
                        'weight' => $weight,
                        'display_order' => $idx + 1,
                    ]
                );
            }
        }

        // ----- Sample documents (only if none exist yet) -----
        if (Document::count() === 0) {
            $samples = [
                ['title' => 'HSE Plan 2026', 'category' => 'plan', 'version' => '1.0', 'file_path' => '/documents/hse-plan-2026.pdf', 'file_type' => 'pdf'],
                ['title' => 'SOP Incident Reporting', 'category' => 'sop', 'version' => '2.1', 'file_path' => '/documents/sop-incident-reporting.docx', 'file_type' => 'docx'],
                ['title' => 'Risk Assessment Workshop Area', 'category' => 'risk_assessment', 'version' => '1.0', 'file_path' => '/documents/ra-workshop.pdf', 'file_type' => 'pdf'],
                ['title' => 'HSE KPI Monitoring', 'category' => 'report', 'version' => '1.0', 'file_path' => '/documents/hse-kpi-monitoring.xlsx', 'file_type' => 'xlsx'],
                ['title' => 'Work at Height Procedure', 'category' => 'procedure', 'version' => '3.0', 'file_path' => '/documents/wah-procedure.pdf', 'file_type' => 'pdf'],
            ];
            foreach ($samples as $s) {
                Document::create(array_merge($s, [
                    'uploaded_by_name' => 'System',
                    'is_active' => true,
                    'effective_date' => Carbon::now(),
                ]));
            }
        }
    }
}
