<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('organisasis', function (Blueprint $table) {
            $table->id();
            $table->string('nama');
            $table->string('singkatan', 50)->nullable();
            $table->string('slug')->unique();
            $table->string('no_sk')->nullable(); // Nomor SK Pendirian
            $table->string('file_sk')->nullable(); // Scan SK
            $table->date('tanggal_berdiri')->nullable();
            $table->string('bidang_fokus')->nullable(); // e.g. "Lingkungan", "Pendidikan", "Olahraga"
            $table->text('alamat_sekretariat')->nullable();
            $table->string('logo')->nullable();
            $table->text('deskripsi')->nullable();
            $table->string('email')->nullable();
            $table->string('no_telp', 20)->nullable();
            $table->string('website')->nullable();
            $table->json('sosial_media')->nullable(); // {"instagram":"@org","facebook":"..."}
            $table->enum('status', [
                'draft',
                'pending_verifikasi',
                'terverifikasi',
                'ditolak',
                'nonaktif'
            ])->default('draft');
            $table->uuid('admin_id'); // User yang mendaftarkan OKP
            $table->uuid('verified_by')->nullable();
            $table->timestamp('verified_at')->nullable();
            $table->text('catatan_verifikasi')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->foreign('admin_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('verified_by')->references('id')->on('users')->onDelete('set null');
            $table->index('status');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('organisasis');
    }
};
