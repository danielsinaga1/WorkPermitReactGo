<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('turnamens', function (Blueprint $table) {
            $table->id();
            $table->string('nama');
            $table->string('slug')->unique();
            $table->text('deskripsi')->nullable();
            $table->string('cabang_olahraga');
            $table->date('tanggal_mulai');
            $table->date('tanggal_selesai')->nullable();
            $table->string('lokasi')->nullable();
            $table->integer('kuota_peserta')->nullable();
            $table->integer('peserta_count')->default(0);
            $table->string('penyelenggara')->nullable();
            $table->string('kontak')->nullable();
            $table->string('thumbnail')->nullable();
            $table->json('images')->nullable();
            $table->date('batas_pendaftaran')->nullable();
            $table->string('link_pendaftaran')->nullable();
            $table->boolean('is_published')->default(true);
            $table->enum('status', ['pendaftaran', 'berlangsung', 'selesai', 'dibatalkan'])->default('pendaftaran');
            $table->timestamps();
            $table->softDeletes();

            $table->index('cabang_olahraga');
            $table->index('status');
        });

        Schema::create('peserta_turnamens', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('turnamen_id');
            $table->uuid('user_id')->nullable();
            $table->string('nama_peserta');
            $table->string('nama_tim')->nullable();
            $table->string('no_telp', 20)->nullable();
            $table->string('email')->nullable();
            $table->enum('status', ['terdaftar', 'terverifikasi', 'didiskualifikasi'])->default('terdaftar');
            $table->timestamps();

            $table->foreign('turnamen_id')->references('id')->on('turnamens')->onDelete('cascade');
            $table->foreign('user_id')->references('id')->on('users')->onDelete('set null');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('peserta_turnamens');
        Schema::dropIfExists('turnamens');
    }
};
