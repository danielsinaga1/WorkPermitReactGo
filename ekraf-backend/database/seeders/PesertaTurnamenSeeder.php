<?php

namespace Database\Seeders;

use App\Models\PesertaTurnamen;
use App\Models\Turnamen;
use Illuminate\Database\Seeder;

class PesertaTurnamenSeeder extends Seeder
{
    public function run(): void
    {
        $turnamen = Turnamen::all();

        if ($turnamen->isEmpty()) {
            return;
        }

        // Seed peserta for first turnamen (Piala Walikota)
        $pialaWalikota = $turnamen->first();
        $pesertaPiala = [
            ['nama_peserta' => 'Tim Bontang Selatan FC',  'nama_tim' => 'Bontang Selatan FC', 'no_telp' => '08115581001', 'email' => 'bontangselatan.fc@mail.com',   'status' => 'terverifikasi'],
            ['nama_peserta' => 'Tim Bontang Utara United', 'nama_tim' => 'Bontang Utara United','no_telp' => '08115581002', 'email' => 'bontangutara.utd@mail.com',    'status' => 'terverifikasi'],
            ['nama_peserta' => 'Tim Loktuan Jaya',         'nama_tim' => 'Loktuan Jaya FC',    'no_telp' => '08115581003', 'email' => 'loktuanjaya@mail.com',          'status' => 'terdaftar'],
            ['nama_peserta' => 'Tim Berbas Pantai FC',     'nama_tim' => 'Berbas Pantai FC',   'no_telp' => '08115581004', 'email' => 'berbaspantai@mail.com',         'status' => 'terdaftar'],
            ['nama_peserta' => 'Tim Bontang Lestari FC',   'nama_tim' => 'Bontang Lestari FC', 'no_telp' => '08115581005', 'email' => 'bontanglestari@mail.com',       'status' => 'terverifikasi'],
        ];

        foreach ($pesertaPiala as $p) {
            PesertaTurnamen::create(array_merge($p, [
                'turnamen_id' => $pialaWalikota->id,
                'user_id'     => null,
            ]));
        }

        // Seed peserta for bulutangkis turnamen
        $bulutangkis = $turnamen->where('cabang_olahraga', 'Bulutangkis')->first();
        if ($bulutangkis) {
            $pesertaBadminton = [
                ['nama_peserta' => 'Andi Setiawan',    'nama_tim' => null, 'no_telp' => '08115581101', 'email' => 'andi.s@mail.com',     'status' => 'terverifikasi'],
                ['nama_peserta' => 'Rina Wati',        'nama_tim' => null, 'no_telp' => '08115581102', 'email' => 'rina.w@mail.com',     'status' => 'terverifikasi'],
                ['nama_peserta' => 'Budi & Dimas',     'nama_tim' => 'Ganda Putra 1', 'no_telp' => '08115581103', 'email' => 'budi.d@mail.com',    'status' => 'terdaftar'],
                ['nama_peserta' => 'Sarah & Mira',     'nama_tim' => 'Ganda Putri 1', 'no_telp' => '08115581104', 'email' => 'sarah.m@mail.com',   'status' => 'terverifikasi'],
            ];

            foreach ($pesertaBadminton as $p) {
                PesertaTurnamen::create(array_merge($p, [
                    'turnamen_id' => $bulutangkis->id,
                    'user_id'     => null,
                ]));
            }
        }

        // Seed peserta for karate (completed turnamen)
        $karate = $turnamen->where('cabang_olahraga', 'Karate')->first();
        if ($karate) {
            $pesertaKarate = [
                ['nama_peserta' => 'Putri Ramadhani',  'nama_tim' => 'Dojo Bontang',   'no_telp' => '08115581201', 'email' => 'putri.r@mail.com',   'status' => 'terverifikasi'],
                ['nama_peserta' => 'Kenji Tanaka',     'nama_tim' => 'Dojo Bontang',   'no_telp' => '08115581202', 'email' => 'kenji.t@mail.com',   'status' => 'terverifikasi'],
                ['nama_peserta' => 'Rizki Amanullah',  'nama_tim' => 'Inkanas Samarinda', 'no_telp' => '08115581203', 'email' => 'rizki.a@mail.com',  'status' => 'terverifikasi'],
            ];

            foreach ($pesertaKarate as $p) {
                PesertaTurnamen::create(array_merge($p, [
                    'turnamen_id' => $karate->id,
                    'user_id'     => null,
                ]));
            }
        }
    }
}
