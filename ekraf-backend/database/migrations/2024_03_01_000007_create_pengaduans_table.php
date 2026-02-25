<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('pengaduans', function (Blueprint $table) {
            $table->id();
            $table->string('kode_pengaduan')->unique();
            $table->uuid('user_id')->nullable();
            $table->string('nama_pelapor');
            $table->string('email_pelapor')->nullable();
            $table->string('no_telp_pelapor', 20)->nullable();
            $table->enum('kategori', ['fasilitas', 'pelayanan', 'saran', 'lainnya'])->default('lainnya');
            $table->string('judul');
            $table->text('deskripsi');
            $table->string('lokasi')->nullable();
            $table->json('foto_lampiran')->nullable();
            $table->enum('status', ['baru', 'diproses', 'ditanggapi', 'selesai', 'ditolak'])->default('baru');
            $table->text('tanggapan')->nullable();
            $table->uuid('ditanggapi_oleh')->nullable();
            $table->timestamp('ditanggapi_at')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->foreign('user_id')->references('id')->on('users')->onDelete('set null');
            $table->foreign('ditanggapi_oleh')->references('id')->on('users')->onDelete('set null');
            $table->index('status');
            $table->index('kategori');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('pengaduans');
    }
};
