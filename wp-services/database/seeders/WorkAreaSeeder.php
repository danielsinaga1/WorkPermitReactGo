<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class WorkAreaSeeder extends Seeder
{
    public function run(): void
    {
        $now = Carbon::now();

        $areas = [
            [
                'name'          => 'Furnace Area Unit 1',
                'code'          => 'WA-FUR-01',
                'description'   => 'Area tungku pemanas utama unit 1, suhu tinggi, akses terbatas.',
                'zone_type'     => 'hazardous',
                'latitude'      => 0.124500,
                'longitude'     => 117.491200,
                'radius_meters' => 80,
                'plant_unit'    => 'Process Unit 1',
                'is_active'     => true,
            ],
            [
                'name'          => 'Tank Farm Storage',
                'code'          => 'WA-TNK-01',
                'description'   => 'Area tangki penyimpanan bahan kimia dan BBM.',
                'zone_type'     => 'hazardous',
                'latitude'      => 0.126300,
                'longitude'     => 117.493100,
                'radius_meters' => 120,
                'plant_unit'    => 'Storage Area',
                'is_active'     => true,
            ],
            [
                'name'          => 'Compressor Building',
                'code'          => 'WA-CMP-01',
                'description'   => 'Ruang kompresor utama dengan tekanan tinggi.',
                'zone_type'     => 'hazardous',
                'latitude'      => 0.125100,
                'longitude'     => 117.490500,
                'radius_meters' => 50,
                'plant_unit'    => 'Utility',
                'is_active'     => true,
            ],
            [
                'name'          => 'Workshop Mekanik',
                'code'          => 'WA-WKS-01',
                'description'   => 'Bengkel mekanik umum untuk perbaikan alat dan fabrikasi.',
                'zone_type'     => 'general',
                'latitude'      => 0.123800,
                'longitude'     => 117.488900,
                'radius_meters' => 60,
                'plant_unit'    => 'Maintenance',
                'is_active'     => true,
            ],
            [
                'name'          => 'Cooling Tower Area',
                'code'          => 'WA-CLT-01',
                'description'   => 'Area menara pendingin dengan ketinggian, risiko jatuh.',
                'zone_type'     => 'elevated',
                'latitude'      => 0.127200,
                'longitude'     => 117.492000,
                'radius_meters' => 70,
                'plant_unit'    => 'Utility',
                'is_active'     => true,
            ],
            [
                'name'          => 'Confined Space - Vessel V-101',
                'code'          => 'WA-CSV-01',
                'description'   => 'Ruang terbatas vessel V-101. Wajib confined space entry permit.',
                'zone_type'     => 'confined',
                'latitude'      => 0.124900,
                'longitude'     => 117.491800,
                'radius_meters' => 15,
                'plant_unit'    => 'Process Unit 1',
                'is_active'     => true,
            ],
            [
                'name'          => 'Jetty / Loading Area',
                'code'          => 'WA-JTY-01',
                'description'   => 'Area dermaga dan loading/unloading bahan baku & produk.',
                'zone_type'     => 'hazardous',
                'latitude'      => 0.128500,
                'longitude'     => 117.495300,
                'radius_meters' => 150,
                'plant_unit'    => 'Marine',
                'is_active'     => true,
            ],
            [
                'name'          => 'Electrical Substation',
                'code'          => 'WA-ELS-01',
                'description'   => 'Gardu listrik utama 20kV. Risiko sengatan listrik.',
                'zone_type'     => 'hazardous',
                'latitude'      => 0.123200,
                'longitude'     => 117.489500,
                'radius_meters' => 30,
                'plant_unit'    => 'Utility',
                'is_active'     => true,
            ],
            [
                'name'          => 'Office & Control Room',
                'code'          => 'WA-OFC-01',
                'description'   => 'Area perkantoran dan ruang kontrol operasional.',
                'zone_type'     => 'general',
                'latitude'      => 0.122500,
                'longitude'     => 117.487500,
                'radius_meters' => 40,
                'plant_unit'    => 'Office',
                'is_active'     => true,
            ],
            [
                'name'          => 'Pipe Rack Corridor',
                'code'          => 'WA-PRC-01',
                'description'   => 'Koridor pipa utama penghubung antar unit proses.',
                'zone_type'     => 'elevated',
                'latitude'      => 0.125500,
                'longitude'     => 117.491000,
                'radius_meters' => 100,
                'plant_unit'    => 'Process Unit 1',
                'is_active'     => true,
            ],
        ];

        foreach ($areas as $area) {
            DB::table('work_areas')->insert(array_merge($area, [
                'created_at' => $now,
                'updated_at' => $now,
            ]));
        }
    }
}
