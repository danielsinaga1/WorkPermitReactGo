<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('bookings', function (Blueprint $table) {
            $table->id();
            $table->string('kode_booking', 20)->unique(); // e.g. "BK-20260213-001"
            $table->uuid('user_id');
            $table->unsignedBigInteger('fasilitas_id');
            $table->unsignedBigInteger('slot_id')->nullable();
            $table->unsignedBigInteger('tarif_id');
            $table->date('tanggal');
            $table->time('jam_mulai');
            $table->time('jam_selesai');
            $table->text('tujuan_kegiatan');
            $table->integer('jumlah_peserta')->nullable();
            $table->decimal('total_biaya', 15, 2);
            $table->enum('status', [
                'menunggu_bayar',
                'bukti_dikirim',
                'terverifikasi',
                'ditolak',
                'dibatalkan',
                'selesai'
            ])->default('menunggu_bayar');
            $table->string('bukti_bayar')->nullable();
            $table->enum('payment_method', ['qris', 'bank_transfer', 'tunai'])->nullable();
            $table->string('payment_ref')->nullable(); // nomor referensi pembayaran
            $table->uuid('verified_by')->nullable();
            $table->timestamp('verified_at')->nullable();
            $table->text('catatan_admin')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('fasilitas_id')->references('id')->on('fasilitas')->onDelete('cascade');
            $table->foreign('slot_id')->references('id')->on('fasilitas_slots')->onDelete('set null');
            $table->foreign('tarif_id')->references('id')->on('fasilitas_tarifs')->onDelete('cascade');
            $table->foreign('verified_by')->references('id')->on('users')->onDelete('set null');
            $table->index(['user_id', 'status']);
            $table->index(['fasilitas_id', 'tanggal']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('bookings');
    }
};
