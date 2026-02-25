<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('event_festivals', function (Blueprint $table) {
            $table->id();
            $table->string('nama');
            $table->string('slug')->unique();
            $table->text('deskripsi')->nullable();
            $table->datetime('tanggal_mulai');
            $table->datetime('tanggal_selesai')->nullable();
            $table->string('lokasi')->nullable();
            $table->string('thumbnail')->nullable();
            $table->json('images')->nullable();
            $table->enum('kategori', [
                'festival_budaya',
                'pameran',
                'kompetisi',
                'konser',
                'bazaar',
                'seminar',
                'workshop',
                'lainnya'
            ]);
            $table->string('penyelenggara')->nullable();
            $table->string('kontak')->nullable();
            $table->string('website')->nullable();
            $table->decimal('harga_tiket', 15, 2)->default(0);
            $table->boolean('is_published')->default(false);
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('event_festivals');
    }
};
