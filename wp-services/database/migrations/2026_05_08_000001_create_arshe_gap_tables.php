<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * ================================================================
     * ArSHE GAP CLOSURE — Tables & Columns
     * ----------------------------------------------------------------
     * Adds: severity_class on incidents, B-Sharp BBS, Audit module,
     * Document Repository, Balanced Scorecard.
     * ================================================================
     */
    public function up(): void
    {
        // ----------------------------------------------------------------
        // 1. INCIDENT SEVERITY CLASS (Kelas I-IV)
        // ----------------------------------------------------------------
        if (!Schema::hasColumn('incidents', 'severity_class')) {
            Schema::table('incidents', function (Blueprint $table) {
                $table->enum('severity_class', ['I', 'II', 'III', 'IV'])->nullable()->after('severity');
                $table->index('severity_class');
            });
        }

        // ----------------------------------------------------------------
        // 2. B-SHARP — Behavior Based Safety (BBS) Observations
        // ----------------------------------------------------------------
        if (!Schema::hasTable('bsharp_observations'))
        Schema::create('bsharp_observations', function (Blueprint $table) {
            $table->id();
            $table->string('observation_number')->unique();
            $table->dateTime('observed_at');
            $table->foreignId('work_area_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('observer_id')->nullable()->constrained('personnel')->nullOnDelete();
            $table->string('observer_name');
            $table->string('observed_subject_name')->nullable();
            $table->string('title');
            $table->text('description');
            $table->enum('behavior_category', ['safe', 'at_risk']);
            $table->json('behavior_tags')->nullable(); // e.g. ['ppe', 'lifting', 'housekeeping']
            $table->text('recommended_action')->nullable();
            $table->enum('status', ['open', 'follow_up', 'completed'])->default('open');
            // Inline follow-up
            $table->string('followup_pic_name')->nullable();
            $table->foreignId('followup_pic_id')->nullable()->constrained('personnel')->nullOnDelete();
            $table->text('followup_plan')->nullable();
            $table->date('followup_target_date')->nullable();
            $table->dateTime('followup_completed_at')->nullable();
            // Attachments
            $table->json('photos')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->index(['behavior_category', 'observed_at']);
            $table->index(['status']);
            $table->index(['work_area_id', 'observed_at']);
        });

        // ----------------------------------------------------------------
        // 3. AUDIT MODULE
        // ----------------------------------------------------------------
        if (!Schema::hasTable('audit_plans'))
        Schema::create('audit_plans', function (Blueprint $table) {
            $table->id();
            $table->string('audit_number')->unique();
            $table->string('title');
            $table->enum('audit_type', [
                'internal', 'external', 'iso_45001', 'iso_14001',
                'iso_9001', 'compliance', 'management', 'process'
            ])->default('internal');
            $table->string('scope')->nullable();
            $table->foreignId('work_area_id')->nullable()->constrained()->nullOnDelete();
            $table->date('planned_start');
            $table->date('planned_end');
            $table->string('lead_auditor_name');
            $table->foreignId('lead_auditor_id')->nullable()->constrained('personnel')->nullOnDelete();
            $table->json('auditee_list')->nullable();
            $table->json('checklist')->nullable(); // [{ clause, requirement, evidence_required }]
            $table->enum('status', [
                'planned', 'scheduled', 'in_progress',
                'reporting', 'closed', 'cancelled'
            ])->default('planned');
            $table->integer('total_findings')->default(0);
            $table->integer('total_critical')->default(0);
            $table->integer('total_major')->default(0);
            $table->integer('total_minor')->default(0);
            $table->decimal('compliance_score', 5, 2)->nullable(); // 0-100
            $table->text('summary')->nullable();
            $table->string('report_path')->nullable();
            $table->dateTime('closed_at')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->index(['status', 'planned_start']);
            $table->index(['audit_type']);
        });

        if (!Schema::hasTable('audit_findings'))
        Schema::create('audit_findings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('audit_plan_id')->constrained()->cascadeOnDelete();
            $table->string('finding_number');
            $table->enum('severity', ['critical', 'major', 'minor', 'observation', 'opportunity']);
            $table->string('clause_reference')->nullable();
            $table->string('title');
            $table->text('description');
            $table->text('evidence')->nullable();
            $table->string('responsible_pic_name')->nullable();
            $table->foreignId('responsible_pic_id')->nullable()->constrained('personnel')->nullOnDelete();
            $table->date('target_close_date')->nullable();
            $table->enum('status', ['open', 'in_progress', 'closed', 'verified'])->default('open');
            $table->text('corrective_action')->nullable();
            $table->dateTime('closed_at')->nullable();
            $table->json('photos')->nullable();
            $table->timestamps();

            $table->unique(['audit_plan_id', 'finding_number']);
            $table->index(['severity', 'status']);
        });

        // ----------------------------------------------------------------
        // 4. DOCUMENT REPOSITORY
        // ----------------------------------------------------------------
        if (!Schema::hasTable('documents'))
        Schema::create('documents', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('category'); // SOP, Plan, Risk Assessment, Report, Procedure, Form
            $table->string('document_number')->nullable();
            $table->string('version')->default('1.0');
            $table->text('description')->nullable();
            $table->string('file_path');
            $table->string('file_type')->nullable(); // pdf, docx, xlsx, etc.
            $table->bigInteger('file_size')->nullable(); // bytes
            $table->date('effective_date')->nullable();
            $table->date('expiry_date')->nullable();
            $table->json('allowed_roles')->nullable(); // null = public to all authenticated users
            $table->string('uploaded_by_name');
            $table->uuid('uploaded_by_id')->nullable();
            $table->foreign('uploaded_by_id')->references('id')->on('users')->nullOnDelete();
            $table->integer('download_count')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
            $table->softDeletes();

            $table->index(['category', 'is_active']);
            $table->index(['expiry_date']);
        });

        // ----------------------------------------------------------------
        // 5. BALANCED SCORECARD — Perspectives & KPI Mapping
        // ----------------------------------------------------------------
        if (!Schema::hasTable('scorecard_perspectives'))
        Schema::create('scorecard_perspectives', function (Blueprint $table) {
            $table->id();
            $table->string('code')->unique();
            $table->string('name'); // Safety Leadership, Employee Engagement, ...
            $table->text('description')->nullable();
            $table->decimal('weight', 5, 2)->default(0); // 0-100, sum should be 100
            $table->integer('display_order')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        if (!Schema::hasTable('scorecard_kpis'))
        Schema::create('scorecard_kpis', function (Blueprint $table) {
            $table->id();
            $table->foreignId('scorecard_perspective_id')->constrained()->cascadeOnDelete();
            $table->foreignId('hse_kpi_metric_id')->nullable()->constrained()->nullOnDelete();
            $table->string('label')->nullable(); // override metric name if needed
            $table->decimal('weight', 5, 2)->default(0); // weight within perspective
            $table->integer('display_order')->default(0);
            $table->timestamps();

            $table->index(['scorecard_perspective_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('scorecard_kpis');
        Schema::dropIfExists('scorecard_perspectives');
        Schema::dropIfExists('documents');
        Schema::dropIfExists('audit_findings');
        Schema::dropIfExists('audit_plans');
        Schema::dropIfExists('bsharp_observations');

        Schema::table('incidents', function (Blueprint $table) {
            $table->dropIndex(['severity_class']);
            $table->dropColumn('severity_class');
        });
    }
};
