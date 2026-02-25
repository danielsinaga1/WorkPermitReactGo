<?php

namespace Database\Seeders;

use App\Models\PotensiEkonomi;
use Illuminate\Database\Seeder;

class PotensiEkonomiSeeder extends Seeder
{
    public function run(): void
    {
        $potensiEkonomis = [
            // PDB
            [
                'title' => 'Kontribusi PDB Ekonomi Kreatif',
                'value' => '1.211',
                'unit' => 'Triliun Rupiah',
                'year' => 2023,
                'category' => 'pdb',
                'description' => 'Kontribusi ekonomi kreatif terhadap PDB nasional',
            ],
            [
                'title' => 'Kontribusi PDB Ekonomi Kreatif',
                'value' => '1.134',
                'unit' => 'Triliun Rupiah',
                'year' => 2022,
                'category' => 'pdb',
                'description' => 'Kontribusi ekonomi kreatif terhadap PDB nasional',
            ],
            // Ekspor
            [
                'title' => 'Nilai Ekspor Produk Kreatif',
                'value' => '27.1',
                'unit' => 'Miliar USD',
                'year' => 2023,
                'category' => 'ekspor',
                'description' => 'Total nilai ekspor produk ekonomi kreatif',
            ],
            [
                'title' => 'Nilai Ekspor Produk Kreatif',
                'value' => '25.8',
                'unit' => 'Miliar USD',
                'year' => 2022,
                'category' => 'ekspor',
                'description' => 'Total nilai ekspor produk ekonomi kreatif',
            ],
            // Tenaga Kerja
            [
                'title' => 'Jumlah Tenaga Kerja Kreatif',
                'value' => '18.2',
                'unit' => 'Juta Orang',
                'year' => 2023,
                'category' => 'tenaga_kerja',
                'description' => 'Jumlah tenaga kerja yang terserap di sektor ekonomi kreatif',
            ],
            [
                'title' => 'Jumlah Tenaga Kerja Kreatif',
                'value' => '17.4',
                'unit' => 'Juta Orang',
                'year' => 2022,
                'category' => 'tenaga_kerja',
                'description' => 'Jumlah tenaga kerja yang terserap di sektor ekonomi kreatif',
            ],
            // Usaha
            [
                'title' => 'Jumlah Unit Usaha Kreatif',
                'value' => '8.5',
                'unit' => 'Juta Unit',
                'year' => 2023,
                'category' => 'usaha',
                'description' => 'Jumlah unit usaha di sektor ekonomi kreatif',
            ],
            [
                'title' => 'Jumlah Unit Usaha Kreatif',
                'value' => '8.1',
                'unit' => 'Juta Unit',
                'year' => 2022,
                'category' => 'usaha',
                'description' => 'Jumlah unit usaha di sektor ekonomi kreatif',
            ],
            // Pertumbuhan
            [
                'title' => 'Pertumbuhan Ekonomi Kreatif',
                'value' => '6.8',
                'unit' => '%',
                'year' => 2023,
                'category' => 'pertumbuhan',
                'description' => 'Persentase pertumbuhan ekonomi kreatif',
            ],
            [
                'title' => 'Pertumbuhan Ekonomi Kreatif',
                'value' => '6.5',
                'unit' => '%',
                'year' => 2022,
                'category' => 'pertumbuhan',
                'description' => 'Persentase pertumbuhan ekonomi kreatif',
            ],
        ];

        foreach ($potensiEkonomis as $potensiEkonomi) {
            PotensiEkonomi::create($potensiEkonomi);
        }
    }
}
