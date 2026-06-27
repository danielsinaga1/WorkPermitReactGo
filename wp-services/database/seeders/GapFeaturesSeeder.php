<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class GapFeaturesSeeder extends Seeder
{
    public function run(): void
    {
        $now = Carbon::now();

        // Ambil referensi yang sudah di-seed sebelumnya
        $personnelIds = DB::table('personnel')->pluck('id', 'employee_id');
        $permitIds    = DB::table('work_permits')->pluck('id', 'permit_number');
        $permitTypeIds = DB::table('permit_types')->pluck('id', 'code');

        // ================================================================
        // 1. PPE CHECKLISTS — untuk permit WP-2026-03-0001 (Active Hot Work)
        // ================================================================
        $ppeChecklist1Id = DB::table('ppe_checklists')->insertGetId([
            'work_permit_id' => $permitIds['WP-2026-03-0001'],
            'checked_by_name' => 'Andi Setiawan',
            'checked_by_id'   => $personnelIds['EMP-002'],
            'checked_at'      => Carbon::today()->setHour(7)->setMinute(15),
            'is_compliant'    => true,
            'remarks'         => 'Semua APD sudah lengkap dan dalam kondisi baik.',
            'created_at'      => $now,
            'updated_at'      => $now,
        ]);

        $ppeItems1 = [
            ['ppe_item' => 'hard_hat',        'is_required' => true, 'is_available' => true, 'is_condition_ok' => true, 'remarks' => null],
            ['ppe_item' => 'welding_goggles',  'is_required' => true, 'is_available' => true, 'is_condition_ok' => true, 'remarks' => 'DIN 11 shade'],
            ['ppe_item' => 'leather_gloves',   'is_required' => true, 'is_available' => true, 'is_condition_ok' => true, 'remarks' => null],
            ['ppe_item' => 'leather_apron',    'is_required' => true, 'is_available' => true, 'is_condition_ok' => true, 'remarks' => null],
            ['ppe_item' => 'safety_shoes',     'is_required' => true, 'is_available' => true, 'is_condition_ok' => true, 'remarks' => null],
            ['ppe_item' => 'ear_plug',         'is_required' => true, 'is_available' => true, 'is_condition_ok' => true, 'remarks' => null],
            ['ppe_item' => 'fire_blanket',     'is_required' => true, 'is_available' => true, 'is_condition_ok' => true, 'remarks' => 'Terpasang di titik las'],
        ];

        foreach ($ppeItems1 as $item) {
            DB::table('ppe_checklist_items')->insert(array_merge($item, [
                'ppe_checklist_id' => $ppeChecklist1Id,
                'created_at'       => $now,
                'updated_at'       => $now,
            ]));
        }

        // PPE Checklist untuk permit WP-2026-03-0002 (Confined Space) — partial compliance
        $ppeChecklist2Id = DB::table('ppe_checklists')->insertGetId([
            'work_permit_id' => $permitIds['WP-2026-03-0002'],
            'checked_by_name' => 'Yusuf Maulana',
            'checked_by_id'   => $personnelIds['EMP-006'],
            'checked_at'      => Carbon::today()->setHour(6)->setMinute(45),
            'is_compliant'    => false,
            'remarks'         => 'SCBA belum dicek tekanan tabungnya. Perlu diisi ulang sebelum entry.',
            'created_at'      => $now,
            'updated_at'      => $now,
        ]);

        $ppeItems2 = [
            ['ppe_item' => 'hard_hat',         'is_required' => true,  'is_available' => true,  'is_condition_ok' => true,  'remarks' => null],
            ['ppe_item' => 'full_body_harness', 'is_required' => true,  'is_available' => true,  'is_condition_ok' => true,  'remarks' => 'Inspeksi harness OK, tag valid'],
            ['ppe_item' => 'scba',             'is_required' => true,  'is_available' => true,  'is_condition_ok' => false, 'remarks' => 'Tekanan tabung <200 bar, perlu refill'],
            ['ppe_item' => 'coverall',         'is_required' => true,  'is_available' => true,  'is_condition_ok' => true,  'remarks' => null],
            ['ppe_item' => 'safety_shoes',     'is_required' => true,  'is_available' => true,  'is_condition_ok' => true,  'remarks' => 'Rubber sole anti-slip'],
            ['ppe_item' => 'gloves',           'is_required' => true,  'is_available' => true,  'is_condition_ok' => true,  'remarks' => null],
            ['ppe_item' => 'gas_detector',     'is_required' => true,  'is_available' => true,  'is_condition_ok' => true,  'remarks' => 'Kalibrasi valid s/d 15 April 2026'],
        ];

        foreach ($ppeItems2 as $item) {
            DB::table('ppe_checklist_items')->insert(array_merge($item, [
                'ppe_checklist_id' => $ppeChecklist2Id,
                'created_at'       => $now,
                'updated_at'       => $now,
            ]));
        }

        // PPE Checklist untuk permit WP-2026-03-0006 (Non-Plant Active)
        $ppeChecklist3Id = DB::table('ppe_checklists')->insertGetId([
            'work_permit_id' => $permitIds['WP-2026-03-0006'],
            'checked_by_name' => 'Dian Permata',
            'checked_by_id'   => $personnelIds['EMP-003'],
            'checked_at'      => Carbon::today()->subDays(1)->setHour(8)->setMinute(0),
            'is_compliant'    => true,
            'remarks'         => null,
            'created_at'      => $now,
            'updated_at'      => $now,
        ]);

        $ppeItems3 = [
            ['ppe_item' => 'hard_hat',     'is_required' => true,  'is_available' => true, 'is_condition_ok' => true, 'remarks' => null],
            ['ppe_item' => 'mask',         'is_required' => true,  'is_available' => true, 'is_condition_ok' => true, 'remarks' => 'Masker debu 3M'],
            ['ppe_item' => 'gloves',       'is_required' => true,  'is_available' => true, 'is_condition_ok' => true, 'remarks' => null],
            ['ppe_item' => 'safety_shoes', 'is_required' => true,  'is_available' => true, 'is_condition_ok' => true, 'remarks' => null],
        ];

        foreach ($ppeItems3 as $item) {
            DB::table('ppe_checklist_items')->insert(array_merge($item, [
                'ppe_checklist_id' => $ppeChecklist3Id,
                'created_at'       => $now,
                'updated_at'       => $now,
            ]));
        }

        // ================================================================
        // 2. PERMIT TRANSFERS
        // ================================================================
        // Transfer permit #1 (Hot Work) — approved
        DB::table('permit_transfers')->insert([
            'work_permit_id'   => $permitIds['WP-2026-03-0001'],
            'from_personnel_id' => $personnelIds['EMP-004'],
            'to_personnel_id'   => $personnelIds['EMP-005'],
            'from_role'         => 'Performing Authority',
            'to_role'           => 'Performing Authority',
            'reason'            => 'Rizal Pratama izin pulang karena urusan keluarga. Pekerjaan dilanjutkan oleh Slamet Widodo yang memiliki sertifikasi welder.',
            'status'            => 'approved',
            'requested_by'      => 'Rizal Pratama',
            'approved_by'       => 'Budi Hartono',
            'approved_at'       => Carbon::today()->setHour(11)->setMinute(30),
            'approval_remarks'  => 'Slamet memiliki sertif 6G valid. Approved.',
            'created_at'        => $now,
            'updated_at'        => $now,
        ]);

        // Transfer permit #8 (Non-Plant) — pending
        DB::table('permit_transfers')->insert([
            'work_permit_id'   => $permitIds['WP-2026-03-0006'],
            'from_personnel_id' => $personnelIds['EMP-003'],
            'to_personnel_id'   => $personnelIds['EMP-007'],
            'from_role'         => 'Permit Holder',
            'to_role'           => 'Permit Holder',
            'reason'            => 'Dian Permata dipindah tugas ke project lain. Dewi Anggraini mengambil alih.',
            'status'            => 'pending',
            'requested_by'      => 'Dian Permata',
            'approved_by'       => null,
            'approved_at'       => null,
            'approval_remarks'  => null,
            'created_at'        => $now,
            'updated_at'        => $now,
        ]);

        // Transfer permit #4 (Completed Plant) — approved historical
        DB::table('permit_transfers')->insert([
            'work_permit_id'   => $permitIds['WP-2026-02-0015'],
            'from_personnel_id' => $personnelIds['EMP-003'],
            'to_personnel_id'   => $personnelIds['EMP-001'],
            'from_role'         => 'Permit Holder',
            'to_role'           => 'Permit Holder',
            'reason'            => 'Handover shift sore. Budi Hartono sebagai supervisor operasi melanjutkan pengawasan PM.',
            'status'            => 'approved',
            'requested_by'      => 'Dian Permata',
            'approved_by'       => 'Andi Setiawan',
            'approved_at'       => Carbon::today()->subDays(5)->setHour(13)->setMinute(0),
            'approval_remarks'  => 'OK. Budi sudah briefed.',
            'created_at'        => $now,
            'updated_at'        => $now,
        ]);

        // ================================================================
        // 3. CLOSURE CHECKLISTS — untuk permit closed (WP-2026-02-0015)
        // ================================================================
        $closureId = DB::table('closure_checklists')->insertGetId([
            'work_permit_id'    => $permitIds['WP-2026-02-0015'],
            'completed_by_name' => 'Budi Hartono',
            'completed_by_id'   => $personnelIds['EMP-001'],
            'completed_at'      => Carbon::today()->subDays(5)->setHour(16)->setMinute(30),
            'all_items_checked' => true,
            'remarks'           => 'Semua item closure telah diperiksa. Area bersih, isolasi dicabut, peralatan dikembalikan.',
            'created_at'        => $now,
            'updated_at'        => $now,
        ]);

        $closureItems = [
            ['item_description' => 'Semua pekerjaan telah selesai sesuai scope',          'is_checked' => true, 'checked_by' => 'Budi Hartono',  'checked_at' => Carbon::today()->subDays(5)->setHour(16)],
            ['item_description' => 'Area kerja telah dibersihkan',                        'is_checked' => true, 'checked_by' => 'Budi Hartono',  'checked_at' => Carbon::today()->subDays(5)->setHour(16)->setMinute(5)],
            ['item_description' => 'Semua peralatan dan material telah dikeluarkan',      'is_checked' => true, 'checked_by' => 'Dian Permata',  'checked_at' => Carbon::today()->subDays(5)->setHour(16)->setMinute(8)],
            ['item_description' => 'Isolasi listrik telah dicabut dan breaker di-reset',  'is_checked' => true, 'checked_by' => 'Budi Hartono',  'checked_at' => Carbon::today()->subDays(5)->setHour(16)->setMinute(10)],
            ['item_description' => 'Isolasi mekanik/pneumatic telah dicabut',             'is_checked' => true, 'checked_by' => 'Budi Hartono',  'checked_at' => Carbon::today()->subDays(5)->setHour(16)->setMinute(12)],
            ['item_description' => 'Barikade dan rambu keselamatan telah dilepas',         'is_checked' => true, 'checked_by' => 'Andi Setiawan', 'checked_at' => Carbon::today()->subDays(5)->setHour(16)->setMinute(15)],
            ['item_description' => 'Fire watcher telah stand-down (jika hot work)',       'is_checked' => true, 'checked_by' => 'Andi Setiawan', 'checked_at' => Carbon::today()->subDays(5)->setHour(16)->setMinute(15)],
            ['item_description' => 'Gas test final clear',                                'is_checked' => true, 'checked_by' => 'Yusuf Maulana', 'checked_at' => Carbon::today()->subDays(5)->setHour(16)->setMinute(18)],
            ['item_description' => 'Tidak ada temuan/hazard baru di area',                'is_checked' => true, 'checked_by' => 'Andi Setiawan', 'checked_at' => Carbon::today()->subDays(5)->setHour(16)->setMinute(20)],
            ['item_description' => 'Dokumentasi & foto sebelum/sesudah lengkap',          'is_checked' => true, 'checked_by' => 'Dian Permata',  'checked_at' => Carbon::today()->subDays(5)->setHour(16)->setMinute(25)],
        ];

        foreach ($closureItems as $item) {
            DB::table('closure_checklist_items')->insert(array_merge($item, [
                'closure_checklist_id' => $closureId,
                'remarks'              => null,
                'created_at'           => $now,
                'updated_at'           => $now,
            ]));
        }

        // ================================================================
        // 4. EMAIL NOTIFICATIONS — historical log
        // ================================================================
        $emailNotifications = [
            [
                'recipient_email' => 'budi.hartono@ptindustri.co.id',
                'recipient_name'  => 'Budi Hartono',
                'subject'         => '[WP-HSE] Permit WP-2026-03-0001 Telah Disetujui',
                'body'            => 'Yth. Budi Hartono, Permit kerja WP-2026-03-0001 (Pengelasan Pipa Steam Line SL-1021) telah mendapat persetujuan penuh. Silakan mulai pekerjaan sesuai jadwal.',
                'template'        => 'permit_approval',
                'template_data'   => json_encode(['permit_number' => 'WP-2026-03-0001', 'title' => 'Pengelasan Pipa Steam Line SL-1021']),
                'status'          => 'sent',
                'error_message'   => null,
                'sent_at'         => Carbon::today()->setHour(6)->setMinute(55),
            ],
            [
                'recipient_email' => 'rizal.pratama@kontraktor-a.com',
                'recipient_name'  => 'Rizal Pratama',
                'subject'         => '[WP-HSE] Transfer Permit WP-2026-03-0001 Disetujui',
                'body'            => 'Yth. Rizal Pratama, Permintaan transfer permit WP-2026-03-0001 kepada Slamet Widodo telah disetujui oleh Budi Hartono.',
                'template'        => 'permit_transfer',
                'template_data'   => json_encode(['permit_number' => 'WP-2026-03-0001', 'from' => 'Rizal Pratama', 'to' => 'Slamet Widodo']),
                'status'          => 'sent',
                'error_message'   => null,
                'sent_at'         => Carbon::today()->setHour(11)->setMinute(32),
            ],
            [
                'recipient_email' => 'slamet.widodo@kontraktor-a.com',
                'recipient_name'  => 'Slamet Widodo',
                'subject'         => '[WP-HSE] Anda Menerima Transfer Permit WP-2026-03-0001',
                'body'            => 'Yth. Slamet Widodo, Anda telah menerima transfer permit WP-2026-03-0001 dari Rizal Pratama. Silakan lanjutkan pekerjaan pengelasan.',
                'template'        => 'permit_transfer',
                'template_data'   => json_encode(['permit_number' => 'WP-2026-03-0001', 'from' => 'Rizal Pratama', 'to' => 'Slamet Widodo']),
                'status'          => 'sent',
                'error_message'   => null,
                'sent_at'         => Carbon::today()->setHour(11)->setMinute(32),
            ],
            [
                'recipient_email' => 'dewi.anggraini@ptindustri.co.id',
                'recipient_name'  => 'Dewi Anggraini',
                'subject'         => '[WP-HSE] Permit WP-2026-03-0004 Mendekati Kadaluarsa',
                'body'            => 'Yth. Dewi Anggraini, Permit WP-2026-03-0004 (Pemasangan Scaffolding di Cooling Tower CT-01) akan berakhir dalam 24 jam. Pastikan pekerjaan terjadwal atau ajukan perpanjangan.',
                'template'        => 'permit_expiring',
                'template_data'   => json_encode(['permit_number' => 'WP-2026-03-0004', 'title' => 'Pemasangan Scaffolding di Cooling Tower CT-01']),
                'status'          => 'sent',
                'error_message'   => null,
                'sent_at'         => Carbon::today()->addDays(1)->setHour(6),
            ],
            [
                'recipient_email' => 'andi.setiawan@ptindustri.co.id',
                'recipient_name'  => 'Andi Setiawan',
                'subject'         => '[WP-HSE] Gas Test Tidak Aman - WP-2026-03-0001',
                'body'            => 'PERHATIAN: Hasil gas test pada permit WP-2026-03-0001 menunjukkan LEL 12% (di atas batas aman 10%). Segera evakuasi area dan hentikan pekerjaan.',
                'template'        => 'gas_test_unsafe',
                'template_data'   => json_encode(['permit_number' => 'WP-2026-03-0001', 'lel' => '12%', 'threshold' => '10%']),
                'status'          => 'sent',
                'error_message'   => null,
                'sent_at'         => Carbon::today()->setHour(10)->setMinute(45),
            ],
            [
                'recipient_email' => 'admin@ptindustri.co.id',
                'recipient_name'  => 'Admin HSE',
                'subject'         => '[WP-HSE] Laporan Harian Permit Aktif',
                'body'            => 'Laporan harian: 3 permit aktif, 1 permit pending approval, 0 permit expired. Detail terlampir di sistem WP-HSE.',
                'template'        => 'default',
                'template_data'   => json_encode(['active' => 3, 'pending' => 1, 'expired' => 0]),
                'status'          => 'queued',
                'error_message'   => null,
                'sent_at'         => null,
            ],
        ];

        foreach ($emailNotifications as $email) {
            DB::table('email_notifications')->insert(array_merge($email, [
                'created_at' => $now,
                'updated_at' => $now,
            ]));
        }

        // ================================================================
        // 5. FORM FIELD CONFIGS — dynamic fields per permit type
        // ================================================================
        $formFields = [
            // Hot Work — tambahan field
            ['permit_type_id' => $permitTypeIds['HOT_WORK'], 'section' => 'risk', 'field_name' => 'fire_watch_name', 'field_label' => 'Nama Fire Watcher', 'field_type' => 'text', 'options' => null, 'is_mandatory' => true, 'is_active' => true, 'sort_order' => 1, 'instruction' => 'Nama personel yang bertugas sebagai fire watcher selama pekerjaan panas berlangsung.', 'tooltip' => 'Wajib diisi untuk hot work permit'],
            ['permit_type_id' => $permitTypeIds['HOT_WORK'], 'section' => 'risk', 'field_name' => 'fire_extinguisher_type', 'field_label' => 'Jenis APAR Tersedia', 'field_type' => 'select', 'options' => json_encode(['CO2', 'Dry Chemical Powder', 'Foam', 'Water']), 'is_mandatory' => true, 'is_active' => true, 'sort_order' => 2, 'instruction' => null, 'tooltip' => 'Pilih jenis APAR yang tersedia di area kerja'],
            ['permit_type_id' => $permitTypeIds['HOT_WORK'], 'section' => 'risk', 'field_name' => 'welding_method', 'field_label' => 'Metode Pengelasan', 'field_type' => 'select', 'options' => json_encode(['SMAW', 'GMAW/MIG', 'GTAW/TIG', 'FCAW', 'Oxyacetylene']), 'is_mandatory' => false, 'is_active' => true, 'sort_order' => 3, 'instruction' => null, 'tooltip' => null],
            ['permit_type_id' => $permitTypeIds['HOT_WORK'], 'section' => 'gas_test', 'field_name' => 'continuous_monitoring', 'field_label' => 'Pemantauan Gas Kontinyu', 'field_type' => 'checkbox', 'options' => null, 'is_mandatory' => true, 'is_active' => true, 'sort_order' => 1, 'instruction' => 'Centang jika area memerlukan gas monitoring terus-menerus selama pekerjaan.', 'tooltip' => null],

            // Confined Space — tambahan field
            ['permit_type_id' => $permitTypeIds['CONFINED_SPACE'], 'section' => 'risk', 'field_name' => 'rescue_plan', 'field_label' => 'Rencana Rescue', 'field_type' => 'textarea', 'options' => null, 'is_mandatory' => true, 'is_active' => true, 'sort_order' => 1, 'instruction' => 'Jelaskan rencana penyelamatan darurat termasuk peralatan, personel, dan prosedur evakuasi.', 'tooltip' => 'Wajib ada sebelum entry'],
            ['permit_type_id' => $permitTypeIds['CONFINED_SPACE'], 'section' => 'risk', 'field_name' => 'standby_person', 'field_label' => 'Standby Person', 'field_type' => 'text', 'options' => null, 'is_mandatory' => true, 'is_active' => true, 'sort_order' => 2, 'instruction' => null, 'tooltip' => 'Nama personel yang bertugas standby di luar confined space'],
            ['permit_type_id' => $permitTypeIds['CONFINED_SPACE'], 'section' => 'risk', 'field_name' => 'max_occupants', 'field_label' => 'Maks. Orang Dalam Ruang', 'field_type' => 'number', 'options' => null, 'is_mandatory' => true, 'is_active' => true, 'sort_order' => 3, 'instruction' => null, 'tooltip' => 'Jumlah maksimum orang yang diizinkan masuk bersamaan'],
            ['permit_type_id' => $permitTypeIds['CONFINED_SPACE'], 'section' => 'general', 'field_name' => 'ventilation_method', 'field_label' => 'Metode Ventilasi', 'field_type' => 'select', 'options' => json_encode(['Natural', 'Mechanical - Blower', 'Mechanical - Exhaust', 'Combined']), 'is_mandatory' => true, 'is_active' => true, 'sort_order' => 4, 'instruction' => null, 'tooltip' => null],

            // Work at Height — tambahan field
            ['permit_type_id' => $permitTypeIds['WORK_AT_HEIGHT'], 'section' => 'risk', 'field_name' => 'working_height', 'field_label' => 'Ketinggian Kerja (meter)', 'field_type' => 'number', 'options' => null, 'is_mandatory' => true, 'is_active' => true, 'sort_order' => 1, 'instruction' => null, 'tooltip' => 'Ketinggian dari permukaan tanah dalam meter'],
            ['permit_type_id' => $permitTypeIds['WORK_AT_HEIGHT'], 'section' => 'risk', 'field_name' => 'fall_protection_type', 'field_label' => 'Jenis Fall Protection', 'field_type' => 'select', 'options' => json_encode(['Full Body Harness + Lanyard', 'Safety Net', 'Guardrail', 'Scaffolding Railing']), 'is_mandatory' => true, 'is_active' => true, 'sort_order' => 2, 'instruction' => null, 'tooltip' => null],
            ['permit_type_id' => $permitTypeIds['WORK_AT_HEIGHT'], 'section' => 'risk', 'field_name' => 'max_wind_speed', 'field_label' => 'Batas Kecepatan Angin (km/h)', 'field_type' => 'number', 'options' => null, 'is_mandatory' => false, 'is_active' => true, 'sort_order' => 3, 'instruction' => 'Jika melebihi batas ini, pekerjaan harus dihentikan.', 'tooltip' => null],

            // Excavation
            ['permit_type_id' => $permitTypeIds['EXCAVATION'], 'section' => 'risk', 'field_name' => 'excavation_depth', 'field_label' => 'Kedalaman Galian (meter)', 'field_type' => 'number', 'options' => null, 'is_mandatory' => true, 'is_active' => true, 'sort_order' => 1, 'instruction' => null, 'tooltip' => 'Kedalaman maksimum rencana galian'],
            ['permit_type_id' => $permitTypeIds['EXCAVATION'], 'section' => 'risk', 'field_name' => 'underground_clearance', 'field_label' => 'Clearance Utilitas Bawah Tanah', 'field_type' => 'checkbox', 'options' => null, 'is_mandatory' => true, 'is_active' => true, 'sort_order' => 2, 'instruction' => 'Pastikan survey utilitas bawah tanah sudah dilakukan.', 'tooltip' => null],
            ['permit_type_id' => $permitTypeIds['EXCAVATION'], 'section' => 'risk', 'field_name' => 'shoring_required', 'field_label' => 'Shoring Diperlukan', 'field_type' => 'checkbox', 'options' => null, 'is_mandatory' => false, 'is_active' => true, 'sort_order' => 3, 'instruction' => null, 'tooltip' => 'Centang jika kedalaman >1.5m atau tanah tidak stabil'],

            // Lifting
            ['permit_type_id' => $permitTypeIds['LIFTING'], 'section' => 'risk', 'field_name' => 'load_weight', 'field_label' => 'Berat Beban (ton)', 'field_type' => 'number', 'options' => null, 'is_mandatory' => true, 'is_active' => true, 'sort_order' => 1, 'instruction' => null, 'tooltip' => 'Berat total beban yang akan diangkat'],
            ['permit_type_id' => $permitTypeIds['LIFTING'], 'section' => 'risk', 'field_name' => 'crane_capacity', 'field_label' => 'Kapasitas Crane (ton)', 'field_type' => 'number', 'options' => null, 'is_mandatory' => true, 'is_active' => true, 'sort_order' => 2, 'instruction' => null, 'tooltip' => 'Kapasitas crane yang akan digunakan'],
            ['permit_type_id' => $permitTypeIds['LIFTING'], 'section' => 'risk', 'field_name' => 'lifting_plan_attached', 'field_label' => 'Lifting Plan Terlampir', 'field_type' => 'checkbox', 'options' => null, 'is_mandatory' => true, 'is_active' => true, 'sort_order' => 3, 'instruction' => 'Lifting plan harus di-review oleh engineer dan dilampirkan.', 'tooltip' => null],
            ['permit_type_id' => $permitTypeIds['LIFTING'], 'section' => 'risk', 'field_name' => 'exclusion_zone_radius', 'field_label' => 'Radius Exclusion Zone (m)', 'field_type' => 'number', 'options' => null, 'is_mandatory' => true, 'is_active' => true, 'sort_order' => 4, 'instruction' => null, 'tooltip' => 'Radius area terlarang selama operasi lifting'],

            // Closure section — universal
            ['permit_type_id' => null, 'section' => 'closure', 'field_name' => 'post_work_photo', 'field_label' => 'Foto Kondisi Setelah Pekerjaan', 'field_type' => 'file', 'options' => null, 'is_mandatory' => true, 'is_active' => true, 'sort_order' => 1, 'instruction' => 'Upload foto kondisi area setelah pekerjaan selesai.', 'tooltip' => null],
            ['permit_type_id' => null, 'section' => 'closure', 'field_name' => 'additional_remarks', 'field_label' => 'Catatan Tambahan', 'field_type' => 'textarea', 'options' => null, 'is_mandatory' => false, 'is_active' => true, 'sort_order' => 2, 'instruction' => null, 'tooltip' => 'Catatan tambahan terkait penutupan permit'],
        ];

        foreach ($formFields as $field) {
            DB::table('form_field_configs')->insert(array_merge($field, [
                'created_at' => $now,
                'updated_at' => $now,
            ]));
        }

        // ================================================================
        // 6. UPDATE WORK PERMITS — night work flag on relevant permits
        // ================================================================
        // Permit #1 (Hot Work) — bukan night work
        DB::table('work_permits')
            ->where('permit_number', 'WP-2026-03-0001')
            ->update(['is_night_work' => false]);

        // Permit #8 (Non-Plant active) — night work
        DB::table('work_permits')
            ->where('permit_number', 'WP-2026-03-0006')
            ->update([
                'is_night_work'            => true,
                'night_work_justification' => 'Pekerjaan pengecatan harus dilakukan malam hari agar tidak mengganggu operasi kantor di jam kerja.',
            ]);

        // Permit #7 (Rejected) — simulate revoke scenario on a different permit
        // WP-2026-02-0020 sudah rejected, jadi kita set revoke pada salah satu permit
        // Buat contoh: revoke pada permit yang sudah closed TIDAK logis,
        // jadi kita skip revoke demo pada data seed ini (revoke hanya terjadi saat runtime)
    }
}
