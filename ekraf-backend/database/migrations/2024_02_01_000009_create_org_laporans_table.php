<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('org_laporans', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('kegiatan_id');
            $table->string('file_laporan'); // PDF laporan
            $table->text('deskripsi')->nullable();
            $table->json('foto_kegiatan')->nullable(); // array foto dokumentasi
            $table->integer('jumlah_peserta')->nullable();
            $table->text('hasil_kegiatan')->nullable();
            $table->text('kendala')->nullable();
            $table->enum('status', ['diajukan', 'diterima', 'revisi', 'ditolak'])->default('diajukan');
            $table->uuid('reviewed_by')->nullable();
            $table->timestamp('reviewed_at')->nullable();
            $table->text('catatan_review')->nullable();
            $table->timestamps();

            $table->foreign('kegiatan_id')->references('id')->on('org_kegiatans')->onDelete('cascade');
            $table->foreign('reviewed_by')->references('id')->on('users')->onDelete('set null');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('org_laporans');
    }
};
