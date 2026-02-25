<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('potensi_ekonomis', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('value');
            $table->string('unit')->nullable();
            $table->integer('year');
            $table->string('category');
            $table->text('description')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('potensi_ekonomis');
    }
};
