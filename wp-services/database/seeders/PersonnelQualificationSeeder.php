<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class PersonnelQualificationSeeder extends Seeder
{
    public function run(): void
    {
        $now = Carbon::now();

        // Map employee_id → personnel.id
        $personnelIds = DB::table('personnel')->pluck('id', 'employee_id');

        $qualifications = [
            // Budi Hartono - Supervisor Operasi
            ['personnel' => 'EMP-001', 'type' => 'safety_induction',      'cert' => 'SI-2025-001', 'body' => 'PT Industri Bontang',       'issued' => '2025-01-15', 'expiry' => '2027-01-15'],
            ['personnel' => 'EMP-001', 'type' => 'confined_space_entry',   'cert' => 'CSE-2024-011','body' => 'Kemnaker RI',               'issued' => '2024-06-20', 'expiry' => '2027-06-20'],

            // Andi Setiawan - Safety Officer
            ['personnel' => 'EMP-002', 'type' => 'K3_umum',               'cert' => 'AK3U-2024-501','body' => 'Kemnaker RI',              'issued' => '2024-03-10', 'expiry' => '2027-03-10'],
            ['personnel' => 'EMP-002', 'type' => 'safety_induction',      'cert' => 'SI-2025-002', 'body' => 'PT Industri Bontang',       'issued' => '2025-01-15', 'expiry' => '2027-01-15'],
            ['personnel' => 'EMP-002', 'type' => 'first_aider',           'cert' => 'FA-2024-022', 'body' => 'PMI Kaltim',                'issued' => '2024-08-01', 'expiry' => '2026-08-01'],

            // Dian Permata - Maintenance
            ['personnel' => 'EMP-003', 'type' => 'safety_induction',      'cert' => 'SI-2025-003', 'body' => 'PT Industri Bontang',       'issued' => '2025-01-15', 'expiry' => '2027-01-15'],

            // Rizal Pratama - Foreman Kontraktor
            ['personnel' => 'EMP-004', 'type' => 'safety_induction',      'cert' => 'SI-2025-004', 'body' => 'PT Industri Bontang',       'issued' => '2025-02-01', 'expiry' => '2027-02-01'],
            ['personnel' => 'EMP-004', 'type' => 'working_at_height',     'cert' => 'WAH-2024-033','body' => 'Kemnaker RI',               'issued' => '2024-05-12', 'expiry' => '2027-05-12'],

            // Slamet Widodo - Welder
            ['personnel' => 'EMP-005', 'type' => 'safety_induction',      'cert' => 'SI-2025-005', 'body' => 'PT Industri Bontang',       'issued' => '2025-02-01', 'expiry' => '2027-02-01'],
            ['personnel' => 'EMP-005', 'type' => 'welding_cert',          'cert' => 'WC-6G-2024-018','body' => 'BNSP',                    'issued' => '2024-04-22', 'expiry' => '2027-04-22'],
            ['personnel' => 'EMP-005', 'type' => 'hot_work',              'cert' => 'HW-2024-055', 'body' => 'PT Industri Bontang',       'issued' => '2024-09-01', 'expiry' => '2026-09-01'],

            // Yusuf Maulana - Gas Tester
            ['personnel' => 'EMP-006', 'type' => 'safety_induction',      'cert' => 'SI-2025-006', 'body' => 'PT Industri Bontang',       'issued' => '2025-01-15', 'expiry' => '2027-01-15'],
            ['personnel' => 'EMP-006', 'type' => 'gas_tester',            'cert' => 'GT-2024-009', 'body' => 'Kemnaker RI',               'issued' => '2024-07-10', 'expiry' => '2027-07-10'],
            ['personnel' => 'EMP-006', 'type' => 'confined_space_entry',  'cert' => 'CSE-2024-012','body' => 'Kemnaker RI',               'issued' => '2024-06-20', 'expiry' => '2027-06-20'],

            // Heri Susanto - Scaffolder
            ['personnel' => 'EMP-008', 'type' => 'safety_induction',      'cert' => 'SI-2025-008', 'body' => 'PT Industri Bontang',       'issued' => '2025-02-01', 'expiry' => '2027-02-01'],
            ['personnel' => 'EMP-008', 'type' => 'scaffolding',           'cert' => 'SCF-2024-041','body' => 'BNSP',                      'issued' => '2024-03-15', 'expiry' => '2027-03-15'],
            ['personnel' => 'EMP-008', 'type' => 'working_at_height',     'cert' => 'WAH-2024-034','body' => 'Kemnaker RI',               'issued' => '2024-05-12', 'expiry' => '2027-05-12'],

            // Fitri Handayani - HSE Coordinator
            ['personnel' => 'EMP-010', 'type' => 'K3_umum',              'cert' => 'AK3U-2024-502','body' => 'Kemnaker RI',              'issued' => '2024-03-10', 'expiry' => '2027-03-10'],
            ['personnel' => 'EMP-010', 'type' => 'safety_induction',     'cert' => 'SI-2025-010', 'body' => 'PT Industri Bontang',       'issued' => '2025-01-15', 'expiry' => '2027-01-15'],
            ['personnel' => 'EMP-010', 'type' => 'ISO_45001_auditor',    'cert' => 'ISO-AUD-2024-007','body' => 'BSI Indonesia',          'issued' => '2024-11-01', 'expiry' => '2027-11-01'],

            // Wahyu Nugroho - Rigger
            ['personnel' => 'EMP-011', 'type' => 'safety_induction',     'cert' => 'SI-2025-011', 'body' => 'PT Industri Bontang',       'issued' => '2025-02-01', 'expiry' => '2027-02-01'],
            ['personnel' => 'EMP-011', 'type' => 'rigging_cert',         'cert' => 'RIG-2024-026','body' => 'BNSP',                      'issued' => '2024-08-15', 'expiry' => '2027-08-15'],

            // Rudi Irawan - Supervisor Mekanik
            ['personnel' => 'EMP-012', 'type' => 'safety_induction',     'cert' => 'SI-2025-012', 'body' => 'PT Industri Bontang',       'issued' => '2025-01-15', 'expiry' => '2027-01-15'],
            ['personnel' => 'EMP-012', 'type' => 'LOTO_competent',       'cert' => 'LOTO-2024-003','body' => 'PT Industri Bontang',      'issued' => '2024-04-01', 'expiry' => '2027-04-01'],
        ];

        foreach ($qualifications as $q) {
            $pid = $personnelIds[$q['personnel']] ?? null;
            if (!$pid) continue;

            DB::table('personnel_qualifications')->insert([
                'personnel_id'       => $pid,
                'qualification_type' => $q['type'],
                'certificate_number' => $q['cert'],
                'issuing_body'       => $q['body'],
                'issued_date'        => $q['issued'],
                'expiry_date'        => $q['expiry'],
                'document_path'      => null,
                'status'             => Carbon::parse($q['expiry'])->isPast() ? 'expired' : 'valid',
                'created_at'         => $now,
                'updated_at'         => $now,
            ]);
        }
    }
}
