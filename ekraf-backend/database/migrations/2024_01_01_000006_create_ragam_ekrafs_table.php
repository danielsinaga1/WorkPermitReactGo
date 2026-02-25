<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('ragam_ekrafs', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('content');
            $table->date('date');
            $table->string('thumbnail');
            $table->json('images')->nullable();
            $table->json('descriptions')->nullable();
            $table->unsignedBigInteger('subsektor_id')->nullable();
            $table->foreign('subsektor_id')->references('id')->on('subsektors')->onDelete('set null');
            $table->boolean('is_published')->default(true);
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('ragam_ekrafs');
    }
};
