<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('destinasi_wisatas', function (Blueprint $table) {
            $table->string('virtual_tour_url')->nullable()->after('images');
        });
    }

    public function down(): void
    {
        Schema::table('destinasi_wisatas', function (Blueprint $table) {
            $table->dropColumn('virtual_tour_url');
        });
    }
};
