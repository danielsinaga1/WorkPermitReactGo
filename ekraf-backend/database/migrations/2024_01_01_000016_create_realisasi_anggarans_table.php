<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('realisasi_anggarans', function (Blueprint $table) {
            $table->id();
            $table->integer('tahun');
            $table->string('program');
            $table->decimal('anggaran', 15, 2);
            $table->decimal('realisasi', 15, 2);
            $table->decimal('persentase', 5, 2);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('realisasi_anggarans');
    }
};
