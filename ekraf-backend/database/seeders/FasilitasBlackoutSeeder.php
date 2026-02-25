<?php

namespace Database\Seeders;

use App\Models\FasilitasBlackout;
use App\Models\Fasilitas;
use Illuminate\Database\Seeder;
use Carbon\Carbon;

class FasilitasBlackoutSeeder extends Seeder
{
    public function run(): void
    {
        $gedung = Fasilitas::where('jenis', 'gedung')->first();
        $gor    = Fasilitas::where('jenis', 'gor')->first();

        if (!$gedung && !$gor) {
            return;
        }

        $blackouts = [
            [
                'fasilitas_id'    => $gedung?->id,
                'tanggal_mulai'   => Carbon::now()->addDays(14)->format('Y-m-d'),
                'tanggal_selesai' => Carbon::now()->addDays(16)->format('Y-m-d'),
                'alasan'          => 'Maintenance AC dan Sound System',
            ],
            [
                'fasilitas_id'    => $gedung?->id,
                'tanggal_mulai'   => '2026-08-17',
                'tanggal_selesai' => '2026-08-17',
                'alasan'          => 'Hari Kemerdekaan RI - Digunakan untuk upacara',
            ],
            [
                'fasilitas_id'    => $gor?->id ?? $gedung?->id,
                'tanggal_mulai'   => Carbon::now()->addDays(21)->format('Y-m-d'),
                'tanggal_selesai' => Carbon::now()->addDays(23)->format('Y-m-d'),
                'alasan'          => 'Renovasi lantai lapangan',
            ],
        ];

        foreach ($blackouts as $b) {
            FasilitasBlackout::create($b);
        }
    }
}
