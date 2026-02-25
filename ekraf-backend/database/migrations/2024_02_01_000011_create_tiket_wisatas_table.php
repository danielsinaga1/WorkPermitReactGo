<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('tiket_wisatas', function (Blueprint $table) {
            $table->id();
            $table->string('kode_tiket', 20)->unique(); // e.g. "TK-20260213-001"
            $table->uuid('user_id');
            $table->unsignedBigInteger('destinasi_id');
            $table->date('tanggal_kunjungan');
            $table->integer('jumlah_tiket')->default(1);
            $table->decimal('harga_satuan', 15, 2);
            $table->decimal('total_harga', 15, 2);
            $table->enum('status', [
                'menunggu_bayar',
                'dibayar',
                'digunakan',
                'expired',
                'dibatalkan'
            ])->default('menunggu_bayar');
            $table->enum('payment_method', ['qris', 'bank_transfer'])->nullable();
            $table->string('payment_ref')->nullable();
            $table->string('qr_code')->nullable(); // path ke QR code image
            $table->timestamp('used_at')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('destinasi_id')->references('id')->on('destinasi_wisatas')->onDelete('cascade');
            $table->index(['user_id', 'status']);
            $table->index(['destinasi_id', 'tanggal_kunjungan']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tiket_wisatas');
    }
};
