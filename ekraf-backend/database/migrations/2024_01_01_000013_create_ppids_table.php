<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('ppids', function (Blueprint $table) {
            $table->id();
            $table->enum('section', [
                'tentang',
                'profil',
                'tugas_fungsi',
                'struktur_organisasi',
                'visi_misi',
                'regulasi',
                'formulir',
                'jam_pelayanan'
            ]);
            $table->string('title');
            $table->text('content');
            $table->string('file_url')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('ppids');
    }
};
