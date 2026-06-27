<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class EquipmentCertificationSeeder extends Seeder
{
    public function run(): void
    {
        $now = Carbon::now();

        $equipmentIds = DB::table('equipment')->pluck('id', 'equipment_id');

        $certs = [
            // Mobile Crane
            ['eq' => 'EQP-CRN-001', 'type' => 'SIA',        'cert' => 'SIA-CRN-2025-001', 'body' => 'Kemnaker RI',            'issued' => '2025-06-01', 'expiry' => '2027-06-01'],
            ['eq' => 'EQP-CRN-001', 'type' => 'load_test',   'cert' => 'LT-CRN-2025-001',  'body' => 'PT Surveyor Indonesia',  'issued' => '2025-12-15', 'expiry' => '2026-12-15'],

            // Excavator
            ['eq' => 'EQP-EXC-001', 'type' => 'SIA',        'cert' => 'SIA-EXC-2025-001', 'body' => 'Kemnaker RI',            'issued' => '2025-05-10', 'expiry' => '2027-05-10'],

            // Gas Detector A
            ['eq' => 'EQP-GDT-001', 'type' => 'calibration', 'cert' => 'CAL-GDT-2026-001', 'body' => 'MSA Safety (KAN Lab)',   'issued' => '2026-02-01', 'expiry' => '2026-08-01'],

            // Gas Detector B
            ['eq' => 'EQP-GDT-002', 'type' => 'calibration', 'cert' => 'CAL-GDT-2026-002', 'body' => 'Dräger Indonesia',       'issued' => '2026-01-20', 'expiry' => '2026-07-20'],

            // Chain Block
            ['eq' => 'EQP-CHP-001', 'type' => 'load_test',  'cert' => 'LT-CB-2025-001',   'body' => 'PT Surveyor Indonesia',  'issued' => '2025-09-20', 'expiry' => '2026-09-20'],

            // Welding Machine
            ['eq' => 'EQP-WLD-001', 'type' => 'SIO',        'cert' => 'SIO-WLD-2025-001', 'body' => 'Kemnaker RI',            'issued' => '2025-04-22', 'expiry' => '2027-04-22'],
        ];

        foreach ($certs as $c) {
            $eqId = $equipmentIds[$c['eq']] ?? null;
            if (!$eqId) continue;

            DB::table('equipment_certifications')->insert([
                'equipment_id'       => $eqId,
                'certification_type' => $c['type'],
                'certificate_number' => $c['cert'],
                'issuing_body'       => $c['body'],
                'issued_date'        => $c['issued'],
                'expiry_date'        => $c['expiry'],
                'document_path'      => null,
                'status'             => Carbon::parse($c['expiry'])->isPast() ? 'expired' : 'valid',
                'created_at'         => $now,
                'updated_at'         => $now,
            ]);
        }
    }
}
