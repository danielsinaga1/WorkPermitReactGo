<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class WpIncidentSeeder extends Seeder
{
    public function run(): void
    {
        $now = Carbon::now();

        $workAreaIds  = DB::table('work_areas')->pluck('id', 'code');
        $personnelIds = DB::table('personnel')->pluck('id', 'employee_id');

        $incidents = [
            [
                'incident_number'       => 'INC-2026-02-001',
                'type'                  => 'first_aid',
                'severity'              => 'minor',
                'work_area_id'          => $workAreaIds['WA-WKS-01'],
                'work_permit_id'        => null,
                'reported_by_name'      => 'Rudi Irawan',
                'reported_by_id'        => $personnelIds['EMP-012'],
                'incident_date'         => Carbon::today()->subDays(15)->setHour(10)->setMinute(30),
                'reported_date'         => Carbon::today()->subDays(15)->setHour(11),
                'exact_location'        => 'Workshop Mekanik, area lathe machine',
                'description'           => 'Pekerja terkena serpihan logam di jari tangan kiri saat mengoperasikan mesin bubut. Luka kecil, ditangani P3K.',
                'immediate_actions_taken'=> 'Luka dibersihkan & diperban di klinik. Pekerja kembali bekerja setelah first aid.',
                'injured_person_name'    => 'Agus Prasetyo',
                'injured_person_company' => 'PT Industri Bontang',
                'injury_type'            => 'laceration',
                'body_part_affected'     => 'Left hand - index finger',
                'lost_days'              => 0,
                'environmental_impact'   => null,
                'property_damage_cost'   => 0,
                'status'                 => 'closed',
                'investigation_lead'     => 'Andi Setiawan',
                'investigation_summary'  => 'Pekerja tidak menggunakan sarung tangan anti-potong. Chuck guard terpasang tapi tidak ditutup saat operasi. Rekomendasi: enforce penggunaan cut-resistant gloves dan machine guard check.',
                'lessons_learned'        => 'Selalu gunakan sarung tangan anti-potong saat operasi mesin bubut. Pastikan machine guard tertutup sebelum operasi.',
                'closed_at'              => Carbon::today()->subDays(10),
                'closed_by'              => 'Fitri Handayani',
            ],
            [
                'incident_number'       => 'INC-2026-03-001',
                'type'                  => 'near_miss',
                'severity'              => 'moderate',
                'work_area_id'          => $workAreaIds['WA-TNK-01'],
                'work_permit_id'        => null,
                'reported_by_name'      => 'Andi Setiawan',
                'reported_by_id'        => $personnelIds['EMP-002'],
                'incident_date'         => Carbon::today()->subDays(4)->setHour(14)->setMinute(15),
                'reported_date'         => Carbon::today()->subDays(4)->setHour(14)->setMinute(45),
                'exact_location'        => 'Tank Farm, jalur pipa antara TK-102 dan TK-103',
                'description'           => 'Kebocoran kecil pada flange gasket pipa transfer antara TK-102 dan TK-103. Terdeteksi oleh petugas patrol rutin. Tidak ada tumpahan signifikan karena segera di-isolasi.',
                'immediate_actions_taken'=> 'Pipa di-isolasi (valve upstream & downstream ditutup). Area dipasang barricade. Tim maintenance dikerahkan untuk penggantian gasket.',
                'injured_person_name'    => null,
                'injured_person_company' => null,
                'injury_type'            => null,
                'body_part_affected'     => null,
                'lost_days'              => 0,
                'environmental_impact'   => json_encode(['Tumpahan kecil (±5 liter) tertampung di drip tray', 'Tidak ada kontaminasi tanah/air']),
                'property_damage_cost'   => 500000, // Rp 500.000 biaya gasket
                'status'                 => 'rca_in_progress',
                'investigation_lead'     => 'Fitri Handayani',
                'investigation_summary'  => null,
                'lessons_learned'        => null,
                'closed_at'              => null,
                'closed_by'              => null,
            ],
            [
                'incident_number'       => 'INC-2026-03-002',
                'type'                  => 'property_damage',
                'severity'              => 'minor',
                'work_area_id'          => $workAreaIds['WA-WKS-01'],
                'work_permit_id'        => null,
                'reported_by_name'      => 'Rizal Pratama',
                'reported_by_id'        => $personnelIds['EMP-004'],
                'incident_date'         => Carbon::today()->subDays(2)->setHour(9)->setMinute(0),
                'reported_date'         => Carbon::today()->subDays(2)->setHour(9)->setMinute(30),
                'exact_location'        => 'Workshop Mekanik, area fabrikasi',
                'description'           => 'Forklift menabrak tiang penyangga kanopi workshop saat memindahkan pallet material. Tiang bengkok ringan, kanopi masih aman.',
                'immediate_actions_taken'=> 'Area di-inspect oleh engineer sipil. Tiang masih fungsional tapi perlu perbaikan. Forklift dihentikan untuk inspeksi.',
                'injured_person_name'    => null,
                'injured_person_company' => null,
                'injury_type'            => null,
                'body_part_affected'     => null,
                'lost_days'              => 0,
                'environmental_impact'   => null,
                'property_damage_cost'   => 3500000, // Rp 3.5 juta
                'status'                 => 'under_investigation',
                'investigation_lead'     => 'Andi Setiawan',
                'investigation_summary'  => null,
                'lessons_learned'        => null,
                'closed_at'              => null,
                'closed_by'              => null,
            ],
            [
                'incident_number'       => 'INC-2026-01-003',
                'type'                  => 'medical_treatment',
                'severity'              => 'moderate',
                'work_area_id'          => $workAreaIds['WA-CLT-01'],
                'work_permit_id'        => null,
                'reported_by_name'      => 'Fitri Handayani',
                'reported_by_id'        => $personnelIds['EMP-010'],
                'incident_date'         => Carbon::today()->subDays(45)->setHour(11)->setMinute(0),
                'reported_date'         => Carbon::today()->subDays(45)->setHour(11)->setMinute(30),
                'exact_location'        => 'Cooling Tower CT-01, tangga akses platform +10m',
                'description'           => 'Pekerja terpeleset di tangga yang basah saat turun dari platform cooling tower. Mengalami cedera pergelangan kaki kanan (sprained ankle).',
                'immediate_actions_taken'=> 'First aid di lokasi, kemudian diantar ke RS Bontang untuk pemeriksaan. Hasil rontgen: tidak ada patah tulang, sprain grade 2.',
                'injured_person_name'    => 'Heri Susanto',
                'injured_person_company' => 'PT Rekayasa Mandiri',
                'injury_type'            => 'sprain',
                'body_part_affected'     => 'Right ankle',
                'lost_days'              => 3,
                'environmental_impact'   => null,
                'property_damage_cost'   => 0,
                'status'                 => 'closed',
                'investigation_lead'     => 'Andi Setiawan',
                'investigation_summary'  => 'Tangga basah karena spray cooling tower. Anti-slip tape sudah aus. Handrail ada tapi pekerja tidak berpegangan.',
                'lessons_learned'        => '1. Pasang anti-slip tape baru di semua tangga area cooling tower. 2. Mandatory handrail contact saat naik/turun. 3. Jadwalkan inspeksi anti-slip setiap 3 bulan.',
                'closed_at'              => Carbon::today()->subDays(30),
                'closed_by'              => 'Fitri Handayani',
            ],
        ];

        foreach ($incidents as $inc) {
            DB::table('incidents')->insert(array_merge($inc, [
                'pdf_report_path' => null,
                'created_at'      => $now,
                'updated_at'      => $now,
            ]));
        }

        // ── Witnesses ──
        $incidentIds = DB::table('incidents')->pluck('id', 'incident_number');

        $witnesses = [
            // INC-2026-02-001 (First Aid workshop)
            ['incident' => 'INC-2026-02-001', 'emp' => 'EMP-003', 'statement' => 'Saya mendengar jeritan dari area mesin bubut. Korban memegangi tangan kiri. Saya segera memanggil P3K.'],
            ['incident' => 'INC-2026-02-001', 'emp' => 'EMP-012', 'statement' => 'Saya melihat korban sedang beroperasi tanpa sarung tangan. Chuck guard terbuka saat mesin jalan.'],

            // INC-2026-01-003 (Medical Treatment)
            ['incident' => 'INC-2026-01-003', 'emp' => 'EMP-011', 'statement' => 'Saya berada di platform atas saat mendengar suara terjatuh. Korban terpeleset di tangga turun. Tangga memang licin karena basah.'],
        ];

        foreach ($witnesses as $w) {
            $incId = $incidentIds[$w['incident']] ?? null;
            $pId   = $personnelIds[$w['emp']] ?? null;
            if (!$incId) continue;

            $name = DB::table('personnel')->where('employee_id', $w['emp'])->value('name');

            DB::table('incident_witnesses')->insert([
                'incident_id'    => $incId,
                'personnel_id'   => $pId,
                'witness_name'   => $name ?? $w['emp'],
                'company'        => DB::table('personnel')->where('employee_id', $w['emp'])->value('company'),
                'statement'      => $w['statement'],
                'statement_date' => $now->copy()->subDays(10),
                'signature_path' => null,
                'created_at'     => $now,
                'updated_at'     => $now,
            ]);
        }

        // ── Root Cause Analyses ──
        $rootCauses = [
            // INC-2026-02-001 (First Aid - 5 Why)
            [
                'incident'   => 'INC-2026-02-001',
                'method'     => '5_why',
                'data'       => json_encode([
                    'why_1' => 'Pekerja terkena serpihan logam → Karena tidak pakai sarung tangan anti-potong',
                    'why_2' => 'Tidak pakai sarung tangan → Karena merasa tidak diperlukan untuk pekerjaan ringan',
                    'why_3' => 'Merasa tidak perlu → Karena tidak ada enforcement APD spesifik per jenis pekerjaan',
                    'why_4' => 'Tidak ada enforcement → Karena SOP hanya menyebut "sarung tangan" tanpa spesifik tipe',
                    'why_5' => 'SOP tidak spesifik → Karena belum dilakukan review SOP mesin bubut pasca-perubahan tooling',
                ]),
                'direct'     => 'Serpihan logam mengenai jari karena tidak menggunakan sarung tangan anti-potong.',
                'contrib'    => 'Chuck guard terbuka saat operasi. Kebiasaan tidak menggunakan APD lengkap untuk pekerjaan "ringan".',
                'root'       => 'SOP mesin bubut belum disesuaikan dengan jenis APD spesifik per operasi. Kurangnya enforcement APD detail.',
                'systemic'   => 'Perlu review dan update seluruh SOP workshop dengan detail APD per jenis mesin/operasi.',
                'by'         => 'Andi Setiawan',
                'at'         => Carbon::today()->subDays(12),
                'status'     => 'approved',
            ],
            // INC-2026-03-001 (Near Miss - Fishbone)
            [
                'incident'   => 'INC-2026-03-001',
                'method'     => 'fishbone',
                'data'       => json_encode([
                    'man'         => 'Patrol rutin berhasil mendeteksi dini',
                    'machine'     => 'Gasket flange sudah melewati umur pakai (installed 2019)',
                    'material'    => 'Gasket material: compressed asbestos → sudah discontinue, ganti spiral wound',
                    'method'      => 'Jadwal penggantian gasket tidak ter-track dalam CMMS',
                    'environment' => 'Thermal cycling mempercepat degradasi gasket',
                ]),
                'direct'     => 'Gasket flange bocor karena degradasi material (umur > 6 tahun).',
                'contrib'    => 'Tidak ada tracking umur pakai gasket di maintenance system.',
                'root'       => 'Preventive maintenance schedule tidak mencakup replacement interval untuk static equipment seperti gasket pada pipa transfer.',
                'systemic'   => null,
                'by'         => 'Fitri Handayani',
                'at'         => Carbon::today()->subDays(2),
                'status'     => 'draft',
            ],
        ];

        foreach ($rootCauses as $rc) {
            $incId = $incidentIds[$rc['incident']] ?? null;
            if (!$incId) continue;

            DB::table('incident_root_causes')->insert([
                'incident_id'           => $incId,
                'rca_method'            => $rc['method'],
                'analysis_data'         => $rc['data'],
                'direct_cause'          => $rc['direct'],
                'contributing_factors'   => $rc['contrib'],
                'root_cause'            => $rc['root'],
                'systemic_issues'       => $rc['systemic'],
                'analyzed_by'           => $rc['by'],
                'analyzed_at'           => $rc['at'],
                'status'                => $rc['status'],
                'created_at'            => $now,
                'updated_at'            => $now,
            ]);
        }
    }
}
