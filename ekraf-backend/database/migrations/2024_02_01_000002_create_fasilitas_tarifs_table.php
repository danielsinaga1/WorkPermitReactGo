<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('fasilitas_tarifs', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('fasilitas_id');
            $table->string('nama_tarif'); // e.g. "Sewa Gedung - Pemerintah", "Sewa Gedung - Umum"
            $table->decimal('harga', 15, 2);
            $table->string('satuan')->default('per_jam'); // per_jam, per_hari, per_sesi
            $table->text('keterangan')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            $table->foreign('fasilitas_id')->references('id')->on('fasilitas')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('fasilitas_tarifs');
    }
};
