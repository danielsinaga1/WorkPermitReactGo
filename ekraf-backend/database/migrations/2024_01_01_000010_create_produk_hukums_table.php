<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('produk_hukums', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('author');
            $table->date('date');
            $table->integer('hits')->default(0);
            $table->string('file_url');
            $table->enum('category', [
                'undang_undang',
                'peraturan_pemerintah',
                'peraturan_presiden',
                'peraturan_menteri',
                'naskah_kerja_sama',
                'rancangan_produk_hukum',
                'produk_hukum_lainnya'
            ]);
            $table->boolean('is_published')->default(true);
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('produk_hukums');
    }
};
