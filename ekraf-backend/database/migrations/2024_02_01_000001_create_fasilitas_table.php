<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('fasilitas', function (Blueprint $table) {
            $table->id();
            $table->string('nama');
            $table->string('slug')->unique();
            $table->enum('jenis', ['gedung', 'stadion', 'lapangan', 'kolam_renang', 'gor', 'lainnya']);
            $table->text('deskripsi')->nullable();
            $table->text('alamat');
            $table->decimal('latitude', 10, 8)->nullable();
            $table->decimal('longitude', 11, 8)->nullable();
            $table->integer('kapasitas')->nullable();
            $table->string('thumbnail')->nullable();
            $table->json('images')->nullable();
            $table->json('fasilitas_detail')->nullable(); // e.g. ["AC","Proyektor","Sound System"]
            $table->uuid('pengelola_id')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
            $table->softDeletes();

            $table->foreign('pengelola_id')->references('id')->on('users')->onDelete('set null');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('fasilitas');
    }
};
