<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('atlets', function (Blueprint $table) {
            $table->id();
            $table->string('nama');
            $table->string('slug')->unique();
            $table->string('nik', 20)->nullable();
            $table->date('tanggal_lahir')->nullable();
            $table->enum('jenis_kelamin', ['L', 'P'])->default('L');
            $table->string('cabang_olahraga');
            $table->string('klub')->nullable();
            $table->string('foto')->nullable();
            $table->text('alamat')->nullable();
            $table->string('no_telp', 20)->nullable();
            $table->json('prestasi')->nullable(); // [{"event":"PON XX","tahun":2024,"medali":"emas"}]
            $table->enum('status', ['aktif', 'nonaktif', 'pensiun'])->default('aktif');
            $table->timestamps();
            $table->softDeletes();

            $table->index('cabang_olahraga');
            $table->index('status');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('atlets');
    }
};
