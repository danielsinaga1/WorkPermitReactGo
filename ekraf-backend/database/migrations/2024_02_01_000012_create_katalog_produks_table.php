<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('katalog_produks', function (Blueprint $table) {
            $table->id();
            $table->string('nama_produk');
            $table->string('slug')->unique();
            $table->text('deskripsi')->nullable();
            $table->decimal('harga_mulai', 15, 2)->nullable();
            $table->decimal('harga_sampai', 15, 2)->nullable();
            $table->enum('kategori', [
                'batik',
                'kuliner',
                'kriya',
                'fashion',
                'seni_rupa',
                'musik',
                'fotografi',
                'desain',
                'lainnya'
            ]);
            $table->unsignedBigInteger('subsektor_id')->nullable();
            $table->uuid('pemilik_id')->nullable(); // user pelaku UMKM
            $table->string('nama_usaha')->nullable();
            $table->string('thumbnail')->nullable();
            $table->json('images')->nullable();
            $table->string('kontak', 50)->nullable();
            $table->string('whatsapp', 20)->nullable();
            $table->text('alamat')->nullable();
            $table->decimal('latitude', 10, 8)->nullable();
            $table->decimal('longitude', 11, 8)->nullable();
            $table->boolean('is_verified')->default(false);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
            $table->softDeletes();

            $table->foreign('subsektor_id')->references('id')->on('subsektors')->onDelete('set null');
            $table->foreign('pemilik_id')->references('id')->on('users')->onDelete('set null');
            $table->index('kategori');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('katalog_produks');
    }
};
