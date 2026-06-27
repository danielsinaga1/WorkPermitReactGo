<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Carbon\Carbon;

class WpUserSeeder extends Seeder
{
    public function run(): void
    {
        $now = Carbon::now();

        $users = [
            [
                'id'                => (string) Str::uuid(),
                'name'              => 'Administrator HSE',
                'email'             => 'admin@industribontang.co.id',
                'password'          => Hash::make('admin123'),
                'role'              => 'admin',
                'nik'               => '6472010101800001',
                'no_telp'           => '081234567890',
                'alamat'            => 'Jl. Pupuk Raya No. 1, Bontang Utara',
                'email_verified_at' => $now,
                'is_active'         => true,
                'created_at'        => $now,
                'updated_at'        => $now,
            ],
            [
                'id'                => (string) Str::uuid(),
                'name'              => 'Andi Setiawan',
                'email'             => 'hse@industribontang.co.id',
                'password'          => Hash::make('hse123'),
                'role'              => 'safety_officer',
                'nik'               => '6472010201850002',
                'no_telp'           => '082345678901',
                'alamat'            => 'Jl. Loktuan No. 45, Bontang Utara',
                'email_verified_at' => $now,
                'is_active'         => true,
                'created_at'        => $now,
                'updated_at'        => $now,
            ],
            [
                'id'                => (string) Str::uuid(),
                'name'              => 'Rudi Irawan',
                'email'             => 'supervisor@industribontang.co.id',
                'password'          => Hash::make('super123'),
                'role'              => 'supervisor',
                'nik'               => '6472010301820003',
                'no_telp'           => '083456789012',
                'alamat'            => 'Jl. Awang Faroek No. 12, Bontang Selatan',
                'email_verified_at' => $now,
                'is_active'         => true,
                'created_at'        => $now,
                'updated_at'        => $now,
            ],
            [
                'id'                => (string) Str::uuid(),
                'name'              => 'Dewi Anggraini',
                'email'             => 'planner@industribontang.co.id',
                'password'          => Hash::make('planner123'),
                'role'              => 'permit_coordinator',
                'nik'               => '6472010401900004',
                'no_telp'           => '084567890123',
                'alamat'            => 'Jl. Bessai Berinta No. 7, Bontang Utara',
                'email_verified_at' => $now,
                'is_active'         => true,
                'created_at'        => $now,
                'updated_at'        => $now,
            ],
        ];

        foreach ($users as $user) {
            DB::table('users')->insert($user);
        }
    }
}
