<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('org_pengurus', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('organisasi_id');
            $table->uuid('user_id')->nullable(); // nullable jika pengurus belum punya akun
            $table->string('nama');
            $table->string('jabatan'); // Ketua, Sekretaris, Bendahara, Anggota
            $table->string('no_telp', 20)->nullable();
            $table->string('email')->nullable();
            $table->string('foto')->nullable();
            $table->string('periode_mulai', 4)->nullable(); // tahun mulai
            $table->string('periode_selesai', 4)->nullable(); // tahun selesai
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            $table->foreign('organisasi_id')->references('id')->on('organisasis')->onDelete('cascade');
            $table->foreign('user_id')->references('id')->on('users')->onDelete('set null');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('org_pengurus');
    }
};
