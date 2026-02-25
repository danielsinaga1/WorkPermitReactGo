<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('hakis', function (Blueprint $table) {
            $table->id();
            $table->uuid('user_id')->nullable();
            $table->unsignedBigInteger('pelaku_ekraf_id')->nullable();
            $table->string('nama_produk');
            $table->string('slug')->unique();
            $table->enum('jenis_haki', ['merek', 'paten', 'hak_cipta', 'desain_industri', 'indikasi_geografis'])->default('merek');
            $table->string('nomor_permohonan')->nullable();
            $table->string('nomor_sertifikat')->nullable();
            $table->date('tanggal_permohonan')->nullable();
            $table->date('tanggal_terbit')->nullable();
            $table->string('file_sertifikat')->nullable();
            $table->string('file_permohonan')->nullable();
            $table->text('deskripsi')->nullable();
            $table->enum('status', ['draft', 'diajukan', 'proses', 'terdaftar', 'ditolak'])->default('draft');
            $table->text('catatan')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->foreign('user_id')->references('id')->on('users')->onDelete('set null');
            $table->foreign('pelaku_ekraf_id')->references('id')->on('pelaku_ekrafs')->onDelete('set null');
            $table->index('jenis_haki');
            $table->index('status');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('hakis');
    }
};
