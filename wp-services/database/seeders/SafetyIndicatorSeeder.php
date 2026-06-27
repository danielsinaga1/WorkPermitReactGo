<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class SafetyIndicatorSeeder extends Seeder
{
    public function run(): void
    {
        $now = Carbon::now();

        $indicators = [
            // ── Leading Indicators ──
            [
                'indicator_code'     => 'KPI-L01',
                'name'               => 'Toolbox Meeting Compliance',
                'type'               => 'leading',
                'category'           => 'training',
                'description'        => 'Persentase pelaksanaan Toolbox Meeting dibandingkan jumlah work permit aktif. Target: setiap pekerjaan berisiko harus didahului TBM.',
                'unit'               => 'percentage',
                'target_value'       => 100.00,
                'threshold_warning'  => 90.00,
                'threshold_critical' => 80.00,
                'calculation_formula'=> '(total_tbm_conducted / total_wp_requiring_tbm) * 100',
                'data_sources'       => json_encode(['toolbox_meetings', 'work_permits']),
                'is_active'          => true,
            ],
            [
                'indicator_code'     => 'KPI-L02',
                'name'               => 'Safety Observation Rate',
                'type'               => 'leading',
                'category'           => 'inspection',
                'description'        => 'Jumlah observasi keselamatan per 100 man-hours. Target minimum 0.5 observasi per 100 man-hours.',
                'unit'               => 'rate',
                'target_value'       => 0.50,
                'threshold_warning'  => 0.30,
                'threshold_critical' => 0.15,
                'calculation_formula'=> '(total_observations / total_manhours) * 100',
                'data_sources'       => json_encode(['safety_observations', 'work_permits']),
                'is_active'          => true,
            ],
            [
                'indicator_code'     => 'KPI-L03',
                'name'               => 'Corrective Action Closure Rate',
                'type'               => 'leading',
                'category'           => 'inspection',
                'description'        => 'Persentase corrective action yang diselesaikan tepat waktu. Target: 95% diselesaikan sebelum due date.',
                'unit'               => 'percentage',
                'target_value'       => 95.00,
                'threshold_warning'  => 85.00,
                'threshold_critical' => 70.00,
                'calculation_formula'=> '(ca_closed_on_time / total_ca_due) * 100',
                'data_sources'       => json_encode(['corrective_actions']),
                'is_active'          => true,
            ],
            [
                'indicator_code'     => 'KPI-L04',
                'name'               => 'Work Permit Compliance',
                'type'               => 'leading',
                'category'           => 'permit_compliance',
                'description'        => 'Persentase work permit yang memenuhi seluruh persyaratan (dokumen, kualifikasi personil, sertifikasi alat). Target: 100%.',
                'unit'               => 'percentage',
                'target_value'       => 100.00,
                'threshold_warning'  => 95.00,
                'threshold_critical' => 85.00,
                'calculation_formula'=> '(wp_fully_compliant / total_wp_issued) * 100',
                'data_sources'       => json_encode(['work_permits', 'permit_approvals', 'personnel_qualifications', 'equipment_certifications']),
                'is_active'          => true,
            ],
            [
                'indicator_code'     => 'KPI-L05',
                'name'               => 'Training / Qualification Compliance',
                'type'               => 'leading',
                'category'           => 'training',
                'description'        => 'Persentase personil dengan kualifikasi & sertfikasi yang masih berlaku. Target: 100% personil aktif memiliki sertifikasi valid.',
                'unit'               => 'percentage',
                'target_value'       => 100.00,
                'threshold_warning'  => 90.00,
                'threshold_critical' => 75.00,
                'calculation_formula'=> '(personnel_valid_cert / total_active_personnel) * 100',
                'data_sources'       => json_encode(['personnel', 'personnel_qualifications']),
                'is_active'          => true,
            ],
            [
                'indicator_code'     => 'KPI-L06',
                'name'               => 'Near Miss Reporting Rate',
                'type'               => 'leading',
                'category'           => 'inspection',
                'description'        => 'Rasio near miss dilaporkan terhadap total insiden. Tingginya near miss report menandakan kultur safety yang baik.',
                'unit'               => 'rate',
                'target_value'       => 5.00,
                'threshold_warning'  => 2.00,
                'threshold_critical' => 1.00,
                'calculation_formula'=> 'near_miss_count / (first_aid + mtc + lwt + fatality + 1)',
                'data_sources'       => json_encode(['incidents']),
                'is_active'          => true,
            ],

            // ── Lagging Indicators ──
            [
                'indicator_code'     => 'KPI-G01',
                'name'               => 'LTIFR (Lost Time Injury Frequency Rate)',
                'type'               => 'lagging',
                'category'           => 'incident_rate',
                'description'        => 'Frekuensi cedera dengan lost time per 1.000.000 man-hours kerja. Target: 0.',
                'unit'               => 'rate',
                'target_value'       => 0.00,
                'threshold_warning'  => 1.00,
                'threshold_critical' => 3.00,
                'calculation_formula'=> '(lwt_incidents / total_manhours) * 1000000',
                'data_sources'       => json_encode(['incidents']),
                'is_active'          => true,
            ],
            [
                'indicator_code'     => 'KPI-G02',
                'name'               => 'TRIR (Total Recordable Incident Rate)',
                'type'               => 'lagging',
                'category'           => 'incident_rate',
                'description'        => 'Total recordable incident (MTC + LWT + Fatality) per 200.000 man-hours. Target: < 1.0.',
                'unit'               => 'rate',
                'target_value'       => 0.00,
                'threshold_warning'  => 0.50,
                'threshold_critical' => 1.00,
                'calculation_formula'=> '((mtc + lwt + fatality) / total_manhours) * 200000',
                'data_sources'       => json_encode(['incidents']),
                'is_active'          => true,
            ],
            [
                'indicator_code'     => 'KPI-G03',
                'name'               => 'Safe Man-Hours',
                'type'               => 'lagging',
                'category'           => 'incident_rate',
                'description'        => 'Total man-hours tanpa Lost Time Incident. Counter reset bila terjadi LTI.',
                'unit'               => 'hours',
                'target_value'       => 1000000.00,
                'threshold_warning'  => null,
                'threshold_critical' => null,
                'calculation_formula'=> 'SUM(manhours) since last LTI',
                'data_sources'       => json_encode(['incidents', 'work_permits']),
                'is_active'          => true,
            ],
        ];

        foreach ($indicators as $ind) {
            DB::table('safety_indicators')->insert(array_merge($ind, [
                'created_at' => $now,
                'updated_at' => $now,
            ]));
        }
    }
}
