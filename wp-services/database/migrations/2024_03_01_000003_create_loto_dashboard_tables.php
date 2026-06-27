<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * ================================================================
     * LOTO & ASSET MANAGEMENT + DASHBOARD ANALYTICS — Tables
     * ================================================================
     * Tables:
     *   - loto_procedures          (prosedur LOTO)
     *   - loto_points              (titik isolasi energi)
     *   - loto_locks               (penguncian aktif)
     *   - loto_verifications       (verifikasi isolasi)
     *   - safety_indicators        (indikator keselamatan/leading indicators)
     *   - dashboard_widgets        (konfigurasi widget dashboard)
     *   - report_exports           (log ekspor laporan)
     *   - audit_trails             (jejak audit untuk seluruh modul)
     * ================================================================
     */
    public function up(): void
    {
        // ========================
        // LOTO PROCEDURES
        // ========================
        Schema::create('loto_procedures', function (Blueprint $table) {
            $table->id();
            $table->string('procedure_number')->unique();
            $table->string('title');
            $table->text('description')->nullable();
            $table->foreignId('work_area_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('work_permit_id')->nullable()->constrained()->nullOnDelete();
            $table->string('machine_equipment'); // nama mesin/peralatan
            $table->json('energy_sources'); // listrik, pneumatik, hidrolik, gravitasi, termal, kimia
            $table->json('isolation_steps'); // langkah-langkah isolasi berurut
            $table->json('restoration_steps')->nullable(); // langkah pemulihan
            $table->string('prepared_by');
            $table->string('reviewed_by')->nullable();
            $table->string('approved_by')->nullable();
            $table->enum('status', ['draft', 'active', 'under_review', 'archived'])->default('draft');
            $table->date('effective_date')->nullable();
            $table->date('review_date')->nullable();
            $table->string('document_path')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });

        // ========================
        // LOTO POINTS (Titik Isolasi)
        // ========================
        Schema::create('loto_points', function (Blueprint $table) {
            $table->id();
            $table->foreignId('loto_procedure_id')->constrained()->cascadeOnDelete();
            $table->integer('sequence_order');
            $table->string('point_name');
            $table->string('energy_type'); // electrical, pneumatic, hydraulic, gravity, thermal, chemical, mechanical
            $table->string('location_description');
            $table->string('isolation_device'); // breaker, valve, blind, etc.
            $table->string('isolation_method'); // lock, tag, block, blank
            $table->string('verification_method'); // try start, pressure gauge, voltage test
            $table->string('qr_code')->nullable();
            $table->string('nfc_tag_id')->nullable();
            $table->string('photo_path')->nullable();
            $table->boolean('requires_double_isolation')->default(false);
            $table->timestamps();
        });

        // ========================
        // LOTO LOCKS (Penguncian Aktif)
        // ========================
        Schema::create('loto_locks', function (Blueprint $table) {
            $table->id();
            $table->foreignId('loto_procedure_id')->constrained()->cascadeOnDelete();
            $table->foreignId('loto_point_id')->constrained()->cascadeOnDelete();
            $table->foreignId('work_permit_id')->nullable()->constrained()->nullOnDelete();
            $table->string('lock_number');
            $table->string('tag_number');
            $table->foreignId('locked_by_id')->constrained('personnel')->restrictOnDelete();
            $table->string('locked_by_name');
            $table->dateTime('locked_at');
            $table->dateTime('unlocked_at')->nullable();
            $table->string('unlocked_by_name')->nullable();
            $table->foreignId('unlocked_by_id')->nullable()->constrained('personnel')->nullOnDelete();
            $table->enum('status', ['locked', 'unlocked', 'force_removed'])->default('locked');
            $table->text('force_remove_reason')->nullable();
            $table->string('force_remove_authorized_by')->nullable();
            $table->timestamps();

            $table->index(['status', 'locked_at']);
        });

        // ========================
        // LOTO VERIFICATIONS
        // ========================
        Schema::create('loto_verifications', function (Blueprint $table) {
            $table->id();
            $table->foreignId('loto_procedure_id')->constrained()->cascadeOnDelete();
            $table->foreignId('loto_point_id')->constrained()->cascadeOnDelete();
            $table->foreignId('work_permit_id')->nullable()->constrained()->nullOnDelete();
            $table->string('verified_by_name');
            $table->foreignId('verified_by_id')->nullable()->constrained('personnel')->nullOnDelete();
            $table->dateTime('verified_at');
            $table->enum('verification_result', ['isolated', 'not_isolated', 'partial'])->default('isolated');
            $table->text('remarks')->nullable();
            $table->string('method_used'); // try_start, gauge_reading, voltage_test
            $table->json('readings')->nullable(); // bacaan pengujian
            $table->string('photo_evidence_path')->nullable();
            $table->timestamps();
        });

        // ========================
        // SAFETY INDICATORS (Leading & Lagging)
        // ========================
        Schema::create('safety_indicators', function (Blueprint $table) {
            $table->id();
            $table->string('indicator_code')->unique();
            $table->string('name');
            $table->enum('type', ['leading', 'lagging']);
            $table->string('category'); // permit_compliance, training, inspection, incident_rate, etc.
            $table->text('description')->nullable();
            $table->string('unit'); // percentage, count, rate, hours
            $table->decimal('target_value', 10, 2)->nullable();
            $table->decimal('threshold_warning', 10, 2)->nullable(); // ambang peringatan
            $table->decimal('threshold_critical', 10, 2)->nullable(); // ambang kritis
            $table->string('calculation_formula')->nullable(); // formula perhitungan
            $table->json('data_sources')->nullable(); // tabel sumber data
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        // ========================
        // DASHBOARD WIDGETS
        // ========================
        Schema::create('dashboard_widgets', function (Blueprint $table) {
            $table->id();
            $table->string('widget_key')->unique();
            $table->string('title');
            $table->string('widget_type'); // chart_bar, chart_line, chart_pie, stat_card, table, map, gauge
            $table->string('data_source'); // API endpoint / query identifier
            $table->json('config')->nullable(); // konfigurasi visual (warna, label, kolom)
            $table->integer('grid_x')->default(0); // posisi grid
            $table->integer('grid_y')->default(0);
            $table->integer('grid_w')->default(6); // lebar grid (dari 12 kolom)
            $table->integer('grid_h')->default(4); // tinggi grid
            $table->json('filters')->nullable(); // filter default
            $table->json('permissions')->nullable(); // role yang dapat akses
            $table->boolean('is_active')->default(true);
            $table->integer('sort_order')->default(0);
            $table->timestamps();
        });

        // ========================
        // REPORT EXPORTS
        // ========================
        Schema::create('report_exports', function (Blueprint $table) {
            $table->id();
            $table->string('report_type'); // permit_summary, incident_log, safety_stats, toolbox_meeting, etc.
            $table->enum('format', ['pdf', 'excel', 'csv'])->default('pdf');
            $table->json('parameters')->nullable(); // parameter filter yang digunakan
            $table->string('file_path')->nullable();
            $table->string('file_name')->nullable();
            $table->integer('file_size')->nullable();
            $table->enum('status', ['queued', 'processing', 'completed', 'failed'])->default('queued');
            $table->string('requested_by')->nullable();
            $table->text('error_message')->nullable();
            $table->dateTime('completed_at')->nullable();
            $table->timestamps();
        });

        // ========================
        // AUDIT TRAILS
        // ========================
        Schema::create('audit_trails', function (Blueprint $table) {
            $table->id();
            $table->string('module'); // work_permit, hse, loto, incident
            $table->morphs('auditable');
            $table->string('action'); // created, updated, deleted, status_changed, approved, rejected
            $table->string('performed_by');
            $table->foreignId('performed_by_id')->nullable()->constrained('personnel')->nullOnDelete();
            $table->json('old_values')->nullable();
            $table->json('new_values')->nullable();
            $table->string('ip_address')->nullable();
            $table->string('user_agent')->nullable();
            $table->text('remarks')->nullable();
            $table->timestamps();

            $table->index(['module', 'created_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('audit_trails');
        Schema::dropIfExists('report_exports');
        Schema::dropIfExists('dashboard_widgets');
        Schema::dropIfExists('safety_indicators');
        Schema::dropIfExists('loto_verifications');
        Schema::dropIfExists('loto_locks');
        Schema::dropIfExists('loto_points');
        Schema::dropIfExists('loto_procedures');
    }
};
