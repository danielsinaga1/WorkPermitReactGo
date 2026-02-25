<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('youth_opportunities', function (Blueprint $table) {
            $table->id();
            $table->string('judul');
            $table->string('slug')->unique();
            $table->text('deskripsi')->nullable();
            $table->enum('jenis', ['beasiswa', 'lowongan_kerja', 'magang'])->default('lowongan_kerja');
            $table->string('penyelenggara')->nullable();
            $table->string('lokasi')->nullable();
            $table->date('batas_pendaftaran')->nullable();
            $table->string('link_pendaftaran')->nullable();
            $table->string('kontak')->nullable();
            $table->string('thumbnail')->nullable();
            $table->json('persyaratan')->nullable();
            $table->decimal('gaji_min', 15, 2)->nullable();
            $table->decimal('gaji_max', 15, 2)->nullable();
            $table->boolean('is_published')->default(true);
            $table->timestamps();
            $table->softDeletes();

            $table->index('jenis');
            $table->index('is_published');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('youth_opportunities');
    }
};
