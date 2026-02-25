<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        $users = [
            [
                'id'        => Str::uuid(),
                'name'      => 'Administrator',
                'email'     => 'admin@dispopar.go.id',
                'password'  => Hash::make('admin123'),
                'role'      => 'admin',
                'nik'       => '6474011234560001',
                'no_telp'   => '08115550001',
                'alamat'    => 'Jl. Jend. Sudirman No. 1, Bontang',
                'avatar'    => null,
                'is_active' => true,
            ],
            [
                'id'        => Str::uuid(),
                'name'      => 'Editor Konten',
                'email'     => 'editor@dispopar.go.id',
                'password'  => Hash::make('editor123'),
                'role'      => 'editor',
                'nik'       => '6474011234560002',
                'no_telp'   => '08115550002',
                'alamat'    => 'Jl. Gatot Subroto No. 5, Bontang',
                'avatar'    => null,
                'is_active' => true,
            ],
            [
                'id'        => Str::uuid(),
                'name'      => 'User Biasa',
                'email'     => 'user@dispopar.go.id',
                'password'  => Hash::make('user123'),
                'role'      => 'user',
                'nik'       => '6474011234560003',
                'no_telp'   => '08115550003',
                'alamat'    => 'Jl. Ahmad Yani No. 10, Bontang',
                'avatar'    => null,
                'is_active' => true,
            ],
            [
                'id'        => Str::uuid(),
                'name'      => 'Ahmad Budiman',
                'email'     => 'masyarakat@dispopar.go.id',
                'password'  => Hash::make('masyarakat123'),
                'role'      => 'masyarakat',
                'nik'       => '6474011234560004',
                'no_telp'   => '08115550004',
                'alamat'    => 'Jl. Mulawarman No. 15, Bontang Utara',
                'avatar'    => null,
                'is_active' => true,
            ],
            [
                'id'        => Str::uuid(),
                'name'      => 'Siti Rahmawati',
                'email'     => 'masyarakat2@dispopar.go.id',
                'password'  => Hash::make('masyarakat123'),
                'role'      => 'masyarakat',
                'nik'       => '6474011234560005',
                'no_telp'   => '08115550005',
                'alamat'    => 'Jl. Letjen S. Parman No. 20, Bontang Selatan',
                'avatar'    => null,
                'is_active' => true,
            ],
            [
                'id'        => Str::uuid(),
                'name'      => 'Ketua OKP Bontang',
                'email'     => 'adminokp@dispopar.go.id',
                'password'  => Hash::make('adminokp123'),
                'role'      => 'admin_okp',
                'nik'       => '6474011234560006',
                'no_telp'   => '08115550006',
                'alamat'    => 'Jl. MT Haryono No. 8, Bontang',
                'avatar'    => null,
                'is_active' => true,
            ],
            [
                'id'        => Str::uuid(),
                'name'      => 'Pengelola Gedung',
                'email'     => 'pengelola@dispopar.go.id',
                'password'  => Hash::make('pengelola123'),
                'role'      => 'pengelola',
                'nik'       => '6474011234560007',
                'no_telp'   => '08115550007',
                'alamat'    => 'Jl. Ir. Sutami No. 3, Bontang',
                'avatar'    => null,
                'is_active' => true,
            ],
        ];

        foreach ($users as $user) {
            User::create($user);
        }
    }
}
