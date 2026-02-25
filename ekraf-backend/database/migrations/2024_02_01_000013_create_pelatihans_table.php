<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('pelatihans', function (Blueprint $table) {
            $table->id();
            $table->string('judul');
            $table->string('slug')->unique();
            $table->text('deskripsi')->nullable();
            $table->datetime('tanggal_mulai');
            $table->datetime('tanggal_selesai')->nullable();
            $table->string('lokasi')->nullable();
            $table->integer('kuota')->nullable();
            $table->integer('pendaftar_count')->default(0);
            $table->string('thumbnail')->nullable();
            $table->json('images')->nullable();
            $table->string('narasumber')->nullable();
            $table->enum('kategori', [
                'kewirausahaan',
                'digital_marketing',
                'desain',
                'kuliner',
                'kerajinan',
                'teknologi',
                'manajemen',
                'haki',
                'lainnya'
            ]);
            $table->string('kontak_pendaftaran')->nullable();
            $table->string('link_pendaftaran')->nullable();
            $table->boolean('is_published')->default(false);
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('pelatihans');
    }
};
