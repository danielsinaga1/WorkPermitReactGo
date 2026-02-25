<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('pelaku_ekrafs', function (Blueprint $table) {
            $table->id();
            $table->uuid('user_id')->nullable();
            $table->string('nama');
            $table->string('slug')->unique();
            $table->string('nik', 20)->nullable();
            $table->string('nama_usaha')->nullable();
            $table->unsignedBigInteger('subsektor_id')->nullable();
            $table->text('deskripsi_usaha')->nullable();
            $table->text('alamat')->nullable();
            $table->string('kelurahan')->nullable();
            $table->string('kecamatan')->nullable();
            $table->decimal('latitude', 10, 7)->nullable();
            $table->decimal('longitude', 10, 7)->nullable();
            $table->string('no_telp', 20)->nullable();
            $table->string('email')->nullable();
            $table->string('website')->nullable();
            $table->json('sosial_media')->nullable();
            $table->string('foto')->nullable();
            $table->string('logo_usaha')->nullable();
            $table->year('tahun_mulai')->nullable();
            $table->integer('jumlah_karyawan')->nullable();
            $table->enum('skala_usaha', ['mikro', 'kecil', 'menengah', 'besar'])->default('mikro');
            $table->decimal('omzet_tahunan', 15, 2)->nullable();
            $table->enum('status', ['draft', 'pending', 'terverifikasi', 'ditolak'])->default('draft');
            $table->uuid('verified_by')->nullable();
            $table->timestamp('verified_at')->nullable();
            $table->text('catatan_verifikasi')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->foreign('user_id')->references('id')->on('users')->onDelete('set null');
            $table->foreign('subsektor_id')->references('id')->on('subsektors')->onDelete('set null');
            $table->foreign('verified_by')->references('id')->on('users')->onDelete('set null');
            $table->index('status');
            $table->index('skala_usaha');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('pelaku_ekrafs');
    }
};
