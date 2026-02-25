<?php

namespace Database\Seeders;

use App\Models\FasilitasSlot;
use App\Models\Fasilitas;
use Illuminate\Database\Seeder;
use Carbon\Carbon;

class FasilitasSlotSeeder extends Seeder
{
    public function run(): void
    {
        $fasilitas = Fasilitas::all();
        $startDate = Carbon::now()->startOfDay();

        foreach ($fasilitas as $f) {
            // Create slots for 7 days ahead
            for ($d = 0; $d < 7; $d++) {
                $date = $startDate->copy()->addDays($d);

                // Morning slots
                FasilitasSlot::create([
                    'fasilitas_id' => $f->id,
                    'tanggal'      => $date->format('Y-m-d'),
                    'jam_mulai'    => '08:00',
                    'jam_selesai'  => '12:00',
                    'status'       => $d < 2 ? 'dipesan' : 'tersedia',
                ]);

                // Afternoon slots
                FasilitasSlot::create([
                    'fasilitas_id' => $f->id,
                    'tanggal'      => $date->format('Y-m-d'),
                    'jam_mulai'    => '13:00',
                    'jam_selesai'  => '17:00',
                    'status'       => 'tersedia',
                ]);

                // Evening slots
                FasilitasSlot::create([
                    'fasilitas_id' => $f->id,
                    'tanggal'      => $date->format('Y-m-d'),
                    'jam_mulai'    => '18:00',
                    'jam_selesai'  => '22:00',
                    'status'       => 'tersedia',
                ]);
            }
        }
    }
}
