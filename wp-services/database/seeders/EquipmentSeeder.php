<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class EquipmentSeeder extends Seeder
{
    public function run(): void
    {
        $now = Carbon::now();

        $equipment = [
            [
                'equipment_id'        => 'EQP-CRN-001',
                'name'                => 'Mobile Crane 50 Ton',
                'type'                => 'crane',
                'brand'               => 'Tadano',
                'model'               => 'GR-500EXL',
                'serial_number'       => 'TDN-GR500-20231045',
                'owner_company'       => 'PT Kontraktor Andalan',
                'qr_code'             => 'QR-EQP-CRN-001',
                'nfc_tag_id'          => 'NFC-EQP-CRN-001',
                'last_inspection_date'=> '2025-12-15',
                'next_inspection_date'=> '2026-06-15',
                'condition'           => 'good',
                'is_active'           => true,
            ],
            [
                'equipment_id'        => 'EQP-EXC-001',
                'name'                => 'Excavator 20 Ton',
                'type'                => 'excavator',
                'brand'               => 'Komatsu',
                'model'               => 'PC200-10M0',
                'serial_number'       => 'KMT-PC200-20240389',
                'owner_company'       => 'PT Kontraktor Andalan',
                'qr_code'             => 'QR-EQP-EXC-001',
                'nfc_tag_id'          => null,
                'last_inspection_date'=> '2025-11-01',
                'next_inspection_date'=> '2026-05-01',
                'condition'           => 'good',
                'is_active'           => true,
            ],
            [
                'equipment_id'        => 'EQP-SCF-001',
                'name'                => 'Scaffolding Set A (500m²)',
                'type'                => 'scaffolding',
                'brand'               => 'Layher',
                'model'               => 'Allround',
                'serial_number'       => 'LYH-AR-SET-A-001',
                'owner_company'       => 'PT Rekayasa Mandiri',
                'qr_code'             => 'QR-EQP-SCF-001',
                'nfc_tag_id'          => null,
                'last_inspection_date'=> '2026-01-10',
                'next_inspection_date'=> '2026-04-10',
                'condition'           => 'good',
                'is_active'           => true,
            ],
            [
                'equipment_id'        => 'EQP-GDT-001',
                'name'                => 'Gas Detector 4-in-1 Unit A',
                'type'                => 'gas_detector',
                'brand'               => 'MSA',
                'model'               => 'ALTAIR 5X',
                'serial_number'       => 'MSA-5X-2024-0012',
                'owner_company'       => 'PT Industri Bontang',
                'qr_code'             => 'QR-EQP-GDT-001',
                'nfc_tag_id'          => 'NFC-EQP-GDT-001',
                'last_inspection_date'=> '2026-02-01',
                'next_inspection_date'=> '2026-05-01',
                'condition'           => 'good',
                'is_active'           => true,
            ],
            [
                'equipment_id'        => 'EQP-GDT-002',
                'name'                => 'Gas Detector 4-in-1 Unit B',
                'type'                => 'gas_detector',
                'brand'               => 'Dräger',
                'model'               => 'X-am 5600',
                'serial_number'       => 'DRG-XAM-2024-0055',
                'owner_company'       => 'PT Industri Bontang',
                'qr_code'             => 'QR-EQP-GDT-002',
                'nfc_tag_id'          => null,
                'last_inspection_date'=> '2026-01-20',
                'next_inspection_date'=> '2026-04-20',
                'condition'           => 'good',
                'is_active'           => true,
            ],
            [
                'equipment_id'        => 'EQP-WLD-001',
                'name'                => 'Welding Machine SMAW',
                'type'                => 'welding_machine',
                'brand'               => 'Lincoln Electric',
                'model'               => 'Idealarc R3R-400',
                'serial_number'       => 'LNC-R3R-2023-0201',
                'owner_company'       => 'PT Kontraktor Andalan',
                'qr_code'             => 'QR-EQP-WLD-001',
                'nfc_tag_id'          => null,
                'last_inspection_date'=> '2025-10-15',
                'next_inspection_date'=> '2026-04-15',
                'condition'           => 'fair',
                'is_active'           => true,
            ],
            [
                'equipment_id'        => 'EQP-CHP-001',
                'name'                => 'Chain Block 5 Ton',
                'type'                => 'chain_block',
                'brand'               => 'Kito',
                'model'               => 'CB-050',
                'serial_number'       => 'KTO-CB050-2023-0890',
                'owner_company'       => 'PT Industri Bontang',
                'qr_code'             => 'QR-EQP-CHP-001',
                'nfc_tag_id'          => 'NFC-EQP-CHP-001',
                'last_inspection_date'=> '2025-09-20',
                'next_inspection_date'=> '2026-03-20',
                'condition'           => 'good',
                'is_active'           => true,
            ],
            [
                'equipment_id'        => 'EQP-CMP-001',
                'name'                => 'Air Compressor 185 CFM',
                'type'                => 'compressor',
                'brand'               => 'Atlas Copco',
                'model'               => 'XAS 185',
                'serial_number'       => 'ATC-XAS185-2024-0033',
                'owner_company'       => 'PT Rekayasa Mandiri',
                'qr_code'             => 'QR-EQP-CMP-001',
                'nfc_tag_id'          => null,
                'last_inspection_date'=> '2025-12-01',
                'next_inspection_date'=> '2026-06-01',
                'condition'           => 'good',
                'is_active'           => true,
            ],
        ];

        foreach ($equipment as $eq) {
            DB::table('equipment')->insert(array_merge($eq, [
                'created_at' => $now,
                'updated_at' => $now,
            ]));
        }
    }
}
