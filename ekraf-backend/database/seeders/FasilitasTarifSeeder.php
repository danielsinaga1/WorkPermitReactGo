<?php

namespace Database\Seeders;

use App\Models\FasilitasTarif;
use App\Models\Fasilitas;
use Illuminate\Database\Seeder;

class FasilitasTarifSeeder extends Seeder
{
    public function run(): void
    {
        $fasilitas = Fasilitas::all();

        foreach ($fasilitas as $f) {
            $tarifs = $this->getTarifsFor($f->jenis, $f->id);
            foreach ($tarifs as $tarif) {
                FasilitasTarif::create($tarif);
            }
        }
    }

    private function getTarifsFor(string $jenis, int $fasilitasId): array
    {
        $base = ['fasilitas_id' => $fasilitasId, 'is_active' => true];

        return match ($jenis) {
            'gedung' => [
                array_merge($base, [
                    'nama_tarif' => 'Sewa Gedung - Pemerintah',
                    'harga'      => 500000,
                    'satuan'     => 'per_hari',
                    'keterangan' => 'Tarif khusus instansi pemerintah',
                ]),
                array_merge($base, [
                    'nama_tarif' => 'Sewa Gedung - Umum',
                    'harga'      => 1500000,
                    'satuan'     => 'per_hari',
                    'keterangan' => 'Tarif untuk masyarakat umum dan swasta',
                ]),
                array_merge($base, [
                    'nama_tarif' => 'Sewa Gedung - Per Sesi (3 Jam)',
                    'harga'      => 750000,
                    'satuan'     => 'per_sesi',
                    'keterangan' => 'Satu sesi = 3 jam',
                ]),
            ],
            'stadion' => [
                array_merge($base, [
                    'nama_tarif' => 'Sewa Stadion - Event Besar',
                    'harga'      => 10000000,
                    'satuan'     => 'per_hari',
                    'keterangan' => 'Tarif event besar / festival',
                ]),
                array_merge($base, [
                    'nama_tarif' => 'Sewa Stadion - Pertandingan',
                    'harga'      => 5000000,
                    'satuan'     => 'per_hari',
                    'keterangan' => 'Tarif pertandingan olahraga',
                ]),
            ],
            'lapangan' => [
                array_merge($base, [
                    'nama_tarif' => 'Sewa Lapangan - Siang',
                    'harga'      => 100000,
                    'satuan'     => 'per_jam',
                    'keterangan' => 'Pukul 08:00 - 17:00',
                ]),
                array_merge($base, [
                    'nama_tarif' => 'Sewa Lapangan - Malam',
                    'harga'      => 150000,
                    'satuan'     => 'per_jam',
                    'keterangan' => 'Pukul 17:00 - 22:00',
                ]),
            ],
            'kolam_renang' => [
                array_merge($base, [
                    'nama_tarif' => 'Tiket Masuk - Dewasa',
                    'harga'      => 25000,
                    'satuan'     => 'per_sesi',
                    'keterangan' => 'Usia 13 tahun ke atas',
                ]),
                array_merge($base, [
                    'nama_tarif' => 'Tiket Masuk - Anak',
                    'harga'      => 15000,
                    'satuan'     => 'per_sesi',
                    'keterangan' => 'Usia di bawah 13 tahun',
                ]),
            ],
            'gor' => [
                array_merge($base, [
                    'nama_tarif' => 'Sewa Lapangan Badminton',
                    'harga'      => 50000,
                    'satuan'     => 'per_jam',
                    'keterangan' => 'Per lapangan badminton',
                ]),
                array_merge($base, [
                    'nama_tarif' => 'Sewa Lapangan Basket',
                    'harga'      => 200000,
                    'satuan'     => 'per_jam',
                    'keterangan' => 'Full court basket',
                ]),
                array_merge($base, [
                    'nama_tarif' => 'Sewa GOR Full - Event',
                    'harga'      => 3000000,
                    'satuan'     => 'per_hari',
                    'keterangan' => 'Seluruh area GOR',
                ]),
            ],
            default => [
                array_merge($base, [
                    'nama_tarif' => 'Sewa Fasilitas - Umum',
                    'harga'      => 500000,
                    'satuan'     => 'per_hari',
                    'keterangan' => 'Tarif sewa harian',
                ]),
            ],
        };
    }
}
