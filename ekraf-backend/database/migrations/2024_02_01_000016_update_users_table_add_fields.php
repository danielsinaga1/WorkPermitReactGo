<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        // Columns (nik, no_telp, alamat, email_verified_at) and role as string
        // are already defined in the base users migration.
        // This migration is kept for compatibility but no action needed.
    }

    public function down(): void
    {
        // No-op
    }
};
