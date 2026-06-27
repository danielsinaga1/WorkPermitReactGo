<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class WorkPermitSeeder extends Seeder
{
    public function run(): void
    {
        $now = Carbon::now();

        $permitTypeIds   = DB::table('permit_types')->pluck('id', 'code');
        $workAreaIds     = DB::table('work_areas')->pluck('id', 'code');
        $personnelIds    = DB::table('personnel')->pluck('id', 'employee_id');

        $permits = [
            // ── 1. Active Hot Work ──
            [
                'permit_number'   => 'WP-2026-03-0001',
                'permit_type_id'  => $permitTypeIds['HOT_WORK'],
                'work_area_id'    => $workAreaIds['WA-FUR-01'],
                'requested_by'    => $personnelIds['EMP-004'],
                'title'           => 'Pengelasan Pipa Steam Line SL-1021',
                'work_description'=> 'Pekerjaan pengelasan SMAW pada pipa steam 4" NB di Furnace Area Unit 1. Termasuk persiapan, beveling, root pass, fill, dan cap. Estimasi 3 joint.',
                'planned_start'   => Carbon::today()->setHour(7)->setMinute(0),
                'planned_end'     => Carbon::today()->setHour(15)->setMinute(0),
                'actual_start'    => Carbon::today()->setHour(7)->setMinute(30),
                'actual_end'      => null,
                'priority'        => 'high',
                'status'          => 'active',
                'current_approval_stage' => 5,
                'safety_precautions'     => json_encode(['Fire blanket terpasang', 'APAR ±5m dari titik las', 'Fire watcher: Wahyu', 'Gas test kontinyu']),
                'ppe_requirements'       => json_encode(['Helm safety', 'Kacamata las DIN 11', 'Sarung tangan kulit', 'Apron kulit', 'Sepatu safety', 'Ear plug']),
                'gas_test_results'       => json_encode(['O2' => '20.9%', 'LEL' => '0%', 'H2S' => '0 ppm', 'CO' => '0 ppm']),
                'isolation_details'      => null,
                'special_conditions'     => 'Monitoring gas test setiap 2 jam. Fire watcher tetap di lokasi selama pengelasan.',
                'has_clash'              => false,
            ],
            // ── 2. Approved Confined Space Entry ──
            [
                'permit_number'   => 'WP-2026-03-0002',
                'permit_type_id'  => $permitTypeIds['CONFINED_SPACE'],
                'work_area_id'    => $workAreaIds['WA-CSV-01'],
                'requested_by'    => $personnelIds['EMP-001'],
                'title'           => 'Inspeksi Internal Vessel V-101',
                'work_description'=> 'Inspeksi visual dan NDT (UT thickness) internal vessel V-101. Vessel telah di-isolasi dan di-blind. Purging dengan N2 telah dilakukan.',
                'planned_start'   => Carbon::tomorrow()->setHour(8)->setMinute(0),
                'planned_end'     => Carbon::tomorrow()->setHour(16)->setMinute(0),
                'actual_start'    => null,
                'actual_end'      => null,
                'priority'        => 'critical',
                'status'          => 'approved',
                'current_approval_stage' => 6,
                'safety_precautions'     => json_encode(['Ventilasi mekanis sejak H-2', 'Standby man di manhole', 'Rescue tripod & winch siap', 'Radio HT aktif']),
                'ppe_requirements'       => json_encode(['Helm safety', 'Full body harness', 'SCBA ready', 'Overall coverall', 'Sepatu safety rubber', 'Sarung tangan', 'Gas detector personal']),
                'gas_test_results'       => json_encode(['O2' => '20.9%', 'LEL' => '0%', 'H2S' => '0 ppm', 'CO' => '2 ppm']),
                'isolation_details'      => json_encode(['Blinding pada flange inlet/outlet', 'Electrical isolation breaker MC-V101', 'Drain valve locked open']),
                'special_conditions'     => 'Maksimal 2 orang di dalam vessel. Rotasi setiap 2 jam. Emergency alarm test sebelum masuk.',
                'has_clash'              => false,
            ],
            // ── 3. Draft Lifting ──
            [
                'permit_number'   => 'WP-2026-03-0003',
                'permit_type_id'  => $permitTypeIds['LIFTING'],
                'work_area_id'    => $workAreaIds['WA-WKS-01'],
                'requested_by'    => $personnelIds['EMP-012'],
                'title'           => 'Pengangkatan Heat Exchanger HE-201',
                'work_description'=> 'Pengangkatan heat exchanger HE-201 (berat ±8 ton) dari truck ke posisi maintenance pad menggunakan mobile crane 50T.',
                'planned_start'   => Carbon::today()->addDays(3)->setHour(6)->setMinute(0),
                'planned_end'     => Carbon::today()->addDays(3)->setHour(18)->setMinute(0),
                'actual_start'    => null,
                'actual_end'      => null,
                'priority'        => 'high',
                'status'          => 'draft',
                'current_approval_stage' => 0,
                'safety_precautions'     => json_encode(['Lifting plan attachable', 'Exclusion zone 15m radius']),
                'ppe_requirements'       => json_encode(['Helm safety', 'Vest reflektif', 'Sepatu safety', 'Sarung tangan']),
                'gas_test_results'       => null,
                'isolation_details'      => null,
                'special_conditions'     => null,
                'has_clash'              => false,
            ],
            // ── 4. Completed Plant Work ──
            [
                'permit_number'   => 'WP-2026-02-0015',
                'permit_type_id'  => $permitTypeIds['PLANT'],
                'work_area_id'    => $workAreaIds['WA-CMP-01'],
                'requested_by'    => $personnelIds['EMP-003'],
                'title'           => 'Preventive Maintenance Compressor C-301',
                'work_description'=> 'PM rutin 6 bulanan compressor C-301. Penggantian filter udara, oil, cek alignment, vibrasi, dan bearing temp.',
                'planned_start'   => Carbon::today()->subDays(5)->setHour(7),
                'planned_end'     => Carbon::today()->subDays(5)->setHour(17),
                'actual_start'    => Carbon::today()->subDays(5)->setHour(7)->setMinute(15),
                'actual_end'      => Carbon::today()->subDays(5)->setHour(16)->setMinute(30),
                'priority'        => 'medium',
                'status'          => 'closed',
                'current_approval_stage' => 3,
                'safety_precautions'     => json_encode(['LOTO procedure applied', 'Area barricaded', 'Toolbox meeting done']),
                'ppe_requirements'       => json_encode(['Helm safety', 'Ear plug', 'Kacamata safety', 'Sepatu safety', 'Sarung tangan mekanik']),
                'gas_test_results'       => null,
                'isolation_details'      => json_encode(['Electrical isolation: Breaker C-301 OFF & locked', 'Pneumatic supply valve closed & tagged']),
                'special_conditions'     => null,
                'closure_remarks'        => 'Pekerjaan selesai sesuai jadwal. Compressor sudah dicommissioning dan running normal.',
                'closed_by_name'         => 'Budi Hartono',
                'closed_at'              => Carbon::today()->subDays(5)->setHour(17),
                'has_clash'              => false,
            ],
            // ── 5. Submitted Work at Height ──
            [
                'permit_number'   => 'WP-2026-03-0004',
                'permit_type_id'  => $permitTypeIds['WORK_AT_HEIGHT'],
                'work_area_id'    => $workAreaIds['WA-CLT-01'],
                'requested_by'    => $personnelIds['EMP-008'],
                'title'           => 'Pemasangan Scaffolding di Cooling Tower CT-01',
                'work_description'=> 'Erection scaffolding 4 level (12m) di sisi barat cooling tower CT-01 untuk akses inspeksi fan & motor.',
                'planned_start'   => Carbon::today()->addDays(2)->setHour(6),
                'planned_end'     => Carbon::today()->addDays(4)->setHour(17),
                'actual_start'    => null,
                'actual_end'      => null,
                'priority'        => 'medium',
                'status'          => 'submitted',
                'current_approval_stage' => 1,
                'safety_precautions'     => json_encode(['Scaffolding erect per design', 'Tag system green/red', 'Barricade below']),
                'ppe_requirements'       => json_encode(['Helm safety', 'Full body harness', 'Double lanyard', 'Sepatu safety', 'Sarung tangan']),
                'gas_test_results'       => null,
                'isolation_details'      => null,
                'special_conditions'     => 'Pekerjaan dihentikan jika angin > 40 km/h.',
                'has_clash'              => false,
            ],
            // ── 6. Pending Approval Excavation ──
            [
                'permit_number'   => 'WP-2026-03-0005',
                'permit_type_id'  => $permitTypeIds['EXCAVATION'],
                'work_area_id'    => $workAreaIds['WA-JTY-01'],
                'requested_by'    => $personnelIds['EMP-004'],
                'title'           => 'Penggalian Pondasi Baru Loading Arm #3',
                'work_description'=> 'Penggalian pondasi kedalaman 2m untuk pemasangan loading arm baru di Jetty area. Koordinasi dengan underground utility team.',
                'planned_start'   => Carbon::today()->addDays(5)->setHour(7),
                'planned_end'     => Carbon::today()->addDays(8)->setHour(17),
                'actual_start'    => null,
                'actual_end'      => null,
                'priority'        => 'medium',
                'status'          => 'pending_approval',
                'current_approval_stage' => 3,
                'safety_precautions'     => json_encode(['Underground survey clear', 'Shoring prepared', 'Barricade & signage', 'Access ladder per 7.5m']),
                'ppe_requirements'       => json_encode(['Helm safety', 'Vest reflektif', 'Sepatu safety', 'Sarung tangan']),
                'gas_test_results'       => null,
                'isolation_details'      => null,
                'special_conditions'     => 'Stop jika hujan lebat. Cek stabilitas dinding galian setiap pagi.',
                'has_clash'              => true,
            ],
            // ── 7. Rejected permit ──
            [
                'permit_number'   => 'WP-2026-02-0020',
                'permit_type_id'  => $permitTypeIds['HOT_WORK'],
                'work_area_id'    => $workAreaIds['WA-TNK-01'],
                'requested_by'    => $personnelIds['EMP-005'],
                'title'           => 'Pemotongan Support Bracket TK-105',
                'work_description'=> 'Pemotongan bracket penopang di area tangki TK-105 menggunakan cutting torch.',
                'planned_start'   => Carbon::today()->subDays(3)->setHour(8),
                'planned_end'     => Carbon::today()->subDays(3)->setHour(14),
                'actual_start'    => null,
                'actual_end'      => null,
                'priority'        => 'high',
                'status'          => 'rejected',
                'current_approval_stage' => 3,
                'safety_precautions'     => json_encode(['Fire watch', 'Gas test']),
                'ppe_requirements'       => json_encode(['Helm safety', 'Kacamata las', 'Sarung tangan kulit']),
                'gas_test_results'       => json_encode(['O2' => '20.9%', 'LEL' => '5%', 'H2S' => '0 ppm']),
                'isolation_details'      => null,
                'special_conditions'     => null,
                'rejection_reason'       => 'Area tangki masih beroperasi. Hot work tidak diizinkan saat tangki dalam status operasional. Jadwalkan ulang saat shutdown.',
                'has_clash'              => false,
            ],
            // ── 8. Active Non-Plant ──
            [
                'permit_number'   => 'WP-2026-03-0006',
                'permit_type_id'  => $permitTypeIds['NON_PLANT'],
                'work_area_id'    => $workAreaIds['WA-OFC-01'],
                'requested_by'    => $personnelIds['EMP-003'],
                'title'           => 'Renovasi Ruang Meeting Control Room',
                'work_description'=> 'Pekerjaan renovasi ringan: pengecatan, pemasangan partisi, instalasi AC split baru di ruang meeting lantai 2.',
                'planned_start'   => Carbon::today()->subDays(1)->setHour(8),
                'planned_end'     => Carbon::today()->addDays(2)->setHour(17),
                'actual_start'    => Carbon::today()->subDays(1)->setHour(8)->setMinute(15),
                'actual_end'      => null,
                'priority'        => 'low',
                'status'          => 'active',
                'current_approval_stage' => 2,
                'safety_precautions'     => json_encode(['Area terisolasi dari operasi', 'Ventilasi saat pengecatan']),
                'ppe_requirements'       => json_encode(['Helm safety', 'Masker', 'Sarung tangan', 'Sepatu safety']),
                'gas_test_results'       => null,
                'isolation_details'      => null,
                'special_conditions'     => null,
                'has_clash'              => false,
            ],
        ];

        foreach ($permits as $permit) {
            $data = array_merge($permit, [
                'created_at' => $now,
                'updated_at' => $now,
            ]);
            // Set defaults for nullable fields not present
            $data['rejection_reason']  = $data['rejection_reason']  ?? null;
            $data['suspension_reason'] = $data['suspension_reason'] ?? null;
            $data['closure_remarks']   = $data['closure_remarks']   ?? null;
            $data['closed_by_name']    = $data['closed_by_name']    ?? null;
            $data['closed_at']         = $data['closed_at']         ?? null;

            DB::table('work_permits')->insert($data);
        }
    }
}
