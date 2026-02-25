<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('destinasi_wisatas', function (Blueprint $table) {
            $table->id();
            $table->string('nama');
            $table->string('slug')->unique();
            $table->text('deskripsi')->nullable();
            $table->text('alamat');
            $table->decimal('latitude', 10, 8)->nullable();
            $table->decimal('longitude', 11, 8)->nullable();
            $table->enum('kategori', [
                'alam',
                'budaya',
                'religi',
                'kuliner',
                'edukasi',
                'buatan',
                'bahari',
                'lainnya'
            ]);
            $table->string('thumbnail')->nullable();
            $table->json('images')->nullable();
            $table->time('jam_buka')->nullable();
            $table->time('jam_tutup')->nullable();
            $table->json('hari_operasional')->nullable(); // ["senin","selasa","rabu"...]
            $table->decimal('harga_tiket', 15, 2)->default(0);
            $table->decimal('harga_tiket_asing', 15, 2)->default(0);
            $table->json('fasilitas_wisata')->nullable(); // ["Parking","Toilet","Mushola"]
            $table->string('kontak', 50)->nullable();
            $table->string('website')->nullable();
            $table->boolean('is_ticketed')->default(false);
            $table->boolean('is_active')->default(true);
            $table->unsignedInteger('total_pengunjung')->default(0);
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('destinasi_wisatas');
    }
};
