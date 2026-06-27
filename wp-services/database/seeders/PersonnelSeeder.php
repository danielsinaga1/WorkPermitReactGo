<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class PersonnelSeeder extends Seeder
{
    public function run(): void
    {
        $now = Carbon::now();

        $personnel = [
            [
                'employee_id' => 'EMP-001',
                'name'        => 'Budi Hartono',
                'email'       => 'budi.hartono@ptindustri.co.id',
                'phone'       => '08115560001',
                'company'     => 'PT Industri Bontang',
                'department'  => 'Operasi',
                'position'    => 'Supervisor Operasi',
                'qr_code'     => 'QR-EMP-001',
                'nfc_tag_id'  => 'NFC-EMP-001',
                'is_active'   => true,
            ],
            [
                'employee_id' => 'EMP-002',
                'name'        => 'Andi Setiawan',
                'email'       => 'andi.setiawan@ptindustri.co.id',
                'phone'       => '08115560002',
                'company'     => 'PT Industri Bontang',
                'department'  => 'K3LH',
                'position'    => 'Safety Officer',
                'qr_code'     => 'QR-EMP-002',
                'nfc_tag_id'  => 'NFC-EMP-002',
                'is_active'   => true,
            ],
            [
                'employee_id' => 'EMP-003',
                'name'        => 'Dian Permata',
                'email'       => 'dian.permata@ptindustri.co.id',
                'phone'       => '08115560003',
                'company'     => 'PT Industri Bontang',
                'department'  => 'Maintenance',
                'position'    => 'Maintenance Planner',
                'qr_code'     => 'QR-EMP-003',
                'nfc_tag_id'  => null,
                'is_active'   => true,
            ],
            [
                'employee_id' => 'EMP-004',
                'name'        => 'Rizal Pratama',
                'email'       => 'rizal.pratama@kontraktor-a.com',
                'phone'       => '08115560004',
                'company'     => 'PT Kontraktor Andalan',
                'department'  => null,
                'position'    => 'Foreman',
                'qr_code'     => 'QR-EMP-004',
                'nfc_tag_id'  => 'NFC-EMP-004',
                'is_active'   => true,
            ],
            [
                'employee_id' => 'EMP-005',
                'name'        => 'Slamet Widodo',
                'email'       => 'slamet.widodo@kontraktor-a.com',
                'phone'       => '08115560005',
                'company'     => 'PT Kontraktor Andalan',
                'department'  => null,
                'position'    => 'Welder',
                'qr_code'     => 'QR-EMP-005',
                'nfc_tag_id'  => null,
                'is_active'   => true,
            ],
            [
                'employee_id' => 'EMP-006',
                'name'        => 'Yusuf Maulana',
                'email'       => 'yusuf.maulana@ptindustri.co.id',
                'phone'       => '08115560006',
                'company'     => 'PT Industri Bontang',
                'department'  => 'K3LH',
                'position'    => 'Gas Tester',
                'qr_code'     => 'QR-EMP-006',
                'nfc_tag_id'  => 'NFC-EMP-006',
                'is_active'   => true,
            ],
            [
                'employee_id' => 'EMP-007',
                'name'        => 'Dewi Anggraini',
                'email'       => 'dewi.anggraini@ptindustri.co.id',
                'phone'       => '08115560007',
                'company'     => 'PT Industri Bontang',
                'department'  => 'Engineering',
                'position'    => 'Process Engineer',
                'qr_code'     => 'QR-EMP-007',
                'nfc_tag_id'  => null,
                'is_active'   => true,
            ],
            [
                'employee_id' => 'EMP-008',
                'name'        => 'Heri Susanto',
                'email'       => 'heri.susanto@kontraktor-b.com',
                'phone'       => '08115560008',
                'company'     => 'PT Rekayasa Mandiri',
                'department'  => null,
                'position'    => 'Scaffolder',
                'qr_code'     => 'QR-EMP-008',
                'nfc_tag_id'  => 'NFC-EMP-008',
                'is_active'   => true,
            ],
            [
                'employee_id' => 'EMP-009',
                'name'        => 'Agus Prasetyo',
                'email'       => 'agus.prasetyo@ptindustri.co.id',
                'phone'       => '08115560009',
                'company'     => 'PT Industri Bontang',
                'department'  => 'Operasi',
                'position'    => 'Operator Panel',
                'qr_code'     => 'QR-EMP-009',
                'nfc_tag_id'  => null,
                'is_active'   => true,
            ],
            [
                'employee_id' => 'EMP-010',
                'name'        => 'Fitri Handayani',
                'email'       => 'fitri.handayani@ptindustri.co.id',
                'phone'       => '08115560010',
                'company'     => 'PT Industri Bontang',
                'department'  => 'K3LH',
                'position'    => 'HSE Coordinator',
                'qr_code'     => 'QR-EMP-010',
                'nfc_tag_id'  => 'NFC-EMP-010',
                'is_active'   => true,
            ],
            [
                'employee_id' => 'EMP-011',
                'name'        => 'Wahyu Nugroho',
                'email'       => 'wahyu.nugroho@kontraktor-a.com',
                'phone'       => '08115560011',
                'company'     => 'PT Kontraktor Andalan',
                'department'  => null,
                'position'    => 'Rigger',
                'qr_code'     => 'QR-EMP-011',
                'nfc_tag_id'  => null,
                'is_active'   => true,
            ],
            [
                'employee_id' => 'EMP-012',
                'name'        => 'Rudi Irawan',
                'email'       => 'rudi.irawan@ptindustri.co.id',
                'phone'       => '08115560012',
                'company'     => 'PT Industri Bontang',
                'department'  => 'Maintenance',
                'position'    => 'Supervisor Mekanik',
                'qr_code'     => 'QR-EMP-012',
                'nfc_tag_id'  => 'NFC-EMP-012',
                'is_active'   => true,
            ],
        ];

        foreach ($personnel as $p) {
            DB::table('personnel')->insert(array_merge($p, [
                'photo'      => null,
                'created_at' => $now,
                'updated_at' => $now,
            ]));
        }
    }
}
