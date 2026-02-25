<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('payment_logs', function (Blueprint $table) {
            $table->id();
            $table->string('payable_type'); // 'App\Models\Booking' or 'App\Models\TiketWisata'
            $table->unsignedBigInteger('payable_id');
            $table->uuid('user_id');
            $table->decimal('amount', 15, 2);
            $table->enum('method', ['qris', 'bank_transfer', 'tunai']);
            $table->string('reference')->nullable(); // payment gateway reference
            $table->enum('status', ['pending', 'success', 'failed', 'refunded'])->default('pending');
            $table->json('gateway_response')->nullable();
            $table->timestamp('paid_at')->nullable();
            $table->timestamps();

            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->index(['payable_type', 'payable_id']);
            $table->index('status');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('payment_logs');
    }
};
