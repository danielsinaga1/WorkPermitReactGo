<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('org_kegiatans', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('organisasi_id');
            $table->string('judul');
            $table->text('deskripsi')->nullable();
            $table->datetime('tanggal_mulai');
            $table->datetime('tanggal_selesai')->nullable();
            $table->string('lokasi')->nullable();
            $table->enum('jenis', [
                'rapat',
                'pelatihan',
                'bakti_sosial',
                'olahraga',
                'kesenian',
                'pendidikan',
                'lingkungan',
                'lainnya'
            ])->default('lainnya');
            $table->integer('peserta_target')->nullable();
            $table->string('thumbnail')->nullable();
            $table->json('images')->nullable();
            $table->enum('status', ['draft', 'diajukan', 'disetujui', 'ditolak', 'selesai'])->default('draft');
            $table->boolean('is_published')->default(false);
            $table->timestamps();
            $table->softDeletes();

            $table->foreign('organisasi_id')->references('id')->on('organisasis')->onDelete('cascade');
            $table->index(['organisasi_id', 'tanggal_mulai']);
            $table->index('status');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('org_kegiatans');
    }
};
