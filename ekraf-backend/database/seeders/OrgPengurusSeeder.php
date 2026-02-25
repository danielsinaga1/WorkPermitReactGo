<?php

namespace Database\Seeders;

use App\Models\OrgPengurus;
use App\Models\Organisasi;
use App\Models\User;
use Illuminate\Database\Seeder;

class OrgPengurusSeeder extends Seeder
{
    public function run(): void
    {
        $organisasis = Organisasi::all();
        $adminOkp    = User::where('role', 'admin_okp')->first();

        if ($organisasis->isEmpty()) {
            return;
        }

        $jabatanSets = [
            ['Ketua Umum', 'Wakil Ketua', 'Sekretaris', 'Bendahara', 'Koordinator Divisi'],
        ];

        $namaList = [
            'Muhammad Rizky', 'Dewi Lestari', 'Budi Santoso', 'Rina Fitriani',
            'Andi Pratama', 'Nur Hidayah', 'Fajar Setiawan', 'Sri Wahyuni',
            'Dimas Kurniawan', 'Lina Marlina', 'Agus Saputra', 'Ratna Sari',
            'Hendra Gunawan', 'Maya Putri', 'Irfan Hakim', 'Siti Aminah',
            'Yusuf Maulana', 'Indah Permata', 'Reza Firmansyah', 'Wulandari',
        ];

        $idx = 0;
        foreach ($organisasis as $org) {
            foreach ($jabatanSets[0] as $jabatan) {
                OrgPengurus::create([
                    'organisasi_id'    => $org->id,
                    'user_id'          => $jabatan === 'Ketua Umum' ? $adminOkp?->id : null,
                    'nama'             => $namaList[$idx % count($namaList)],
                    'jabatan'          => $jabatan,
                    'no_telp'          => '0811555' . str_pad($idx + 100, 4, '0', STR_PAD_LEFT),
                    'email'            => strtolower(str_replace(' ', '.', $namaList[$idx % count($namaList)])) . '@gmail.com',
                    'foto'             => null,
                    'periode_mulai'    => '2024',
                    'periode_selesai'  => '2027',
                    'is_active'        => true,
                ]);
                $idx++;
            }
        }
    }
}
