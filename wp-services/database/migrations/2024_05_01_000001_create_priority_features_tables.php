<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * ================================================================
     * PRIORITY FEATURES MIGRATION
     * - Multi-Level Approval Matrix
     * - Training & Certification Management
     * - Advanced HSE KPI
     * - Scheduled Inspection
     * - Multi-channel Notification
     * - Role/Permission Management
     * - Permit Templates
     * ================================================================
     */
    public function up(): void
    {
        // ================================================================
        // 1. MULTI-LEVEL APPROVAL MATRIX
        // ================================================================
        Schema::create('approval_matrices', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->unsignedBigInteger('permit_type_id')->nullable();
            $table->enum('risk_level', ['low', 'medium', 'high', 'extreme'])->nullable();
            $table->enum('approval_mode', ['sequential', 'parallel'])->default('sequential');
            $table->boolean('is_active')->default(true);
            $table->text('description')->nullable();
            $table->timestamps();

            $table->foreign('permit_type_id')->references('id')->on('permit_types')->cascadeOnDelete();
            $table->index(['permit_type_id', 'risk_level', 'is_active']);
        });

        Schema::create('approval_matrix_stages', function (Blueprint $table) {
            $table->id();
            $table->foreignId('approval_matrix_id')->constrained('approval_matrices')->cascadeOnDelete();
            $table->integer('stage_order');
            $table->string('stage_name');
            $table->string('stage_type')->default('approval');
            $table->string('approver_role');
            $table->unsignedBigInteger('default_approver_id')->nullable();
            $table->integer('sla_hours')->default(24);
            $table->boolean('can_delegate')->default(true);
            $table->boolean('escalation_enabled')->default(true);
            $table->integer('escalation_after_hours')->nullable();
            $table->string('escalation_role')->nullable();
            $table->json('conditions')->nullable();
            $table->timestamps();

            $table->foreign('default_approver_id')->references('id')->on('personnel')->nullOnDelete();
            $table->index(['approval_matrix_id', 'stage_order']);
        });

        Schema::create('approval_delegations', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('delegator_id');
            $table->unsignedBigInteger('delegatee_id');
            $table->dateTime('start_date');
            $table->dateTime('end_date');
            $table->string('reason');
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            $table->foreign('delegator_id')->references('id')->on('personnel')->cascadeOnDelete();
            $table->foreign('delegatee_id')->references('id')->on('personnel')->cascadeOnDelete();
            $table->index(['delegator_id', 'is_active', 'start_date', 'end_date'], 'idx_approval_delegations_active');
        });

        // ================================================================
        // 2. TRAINING & CERTIFICATION MANAGEMENT
        // ================================================================
        Schema::create('training_programs', function (Blueprint $table) {
            $table->id();
            $table->string('code')->unique();
            $table->string('name');
            $table->text('description')->nullable();
            $table->string('category');
            $table->boolean('is_mandatory')->default(false);
            $table->integer('validity_months')->default(12);
            $table->integer('duration_hours')->default(8);
            $table->json('target_roles')->nullable();
            $table->json('prerequisite_trainings')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        Schema::create('training_sessions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('training_program_id')->constrained()->cascadeOnDelete();
            $table->string('session_code')->unique();
            $table->dateTime('scheduled_start');
            $table->dateTime('scheduled_end');
            $table->string('venue')->nullable();
            $table->string('trainer_name');
            $table->string('trainer_company')->nullable();
            $table->integer('max_participants')->default(20);
            $table->enum('status', ['scheduled', 'ongoing', 'completed', 'cancelled'])->default('scheduled');
            $table->text('notes')->nullable();
            $table->timestamps();
        });

        Schema::create('training_records', function (Blueprint $table) {
            $table->id();
            $table->foreignId('training_session_id')->constrained()->cascadeOnDelete();
            $table->unsignedBigInteger('personnel_id');
            $table->date('completion_date')->nullable();
            $table->date('expiry_date')->nullable();
            $table->decimal('score', 5, 2)->nullable();
            $table->enum('result', ['pass', 'fail', 'pending'])->default('pending');
            $table->string('certificate_path')->nullable();
            $table->string('certificate_number')->nullable();
            $table->text('remarks')->nullable();
            $table->timestamps();

            $table->foreign('personnel_id')->references('id')->on('personnel')->cascadeOnDelete();
            $table->index(['personnel_id', 'expiry_date']);
        });

        Schema::create('training_matrices', function (Blueprint $table) {
            $table->id();
            $table->string('role_or_position');
            $table->foreignId('training_program_id')->constrained()->cascadeOnDelete();
            $table->boolean('is_required')->default(true);
            $table->integer('refresh_months')->nullable();
            $table->timestamps();

            $table->unique(['role_or_position', 'training_program_id'], 'training_matrix_unique');
        });

        Schema::create('certification_reminders', function (Blueprint $table) {
            $table->id();
            $table->string('source_type'); // qualification, equipment_cert, training
            $table->unsignedBigInteger('source_id');
            $table->unsignedBigInteger('personnel_id')->nullable();
            $table->date('expiry_date');
            $table->integer('days_before')->default(30);
            $table->dateTime('notify_at');
            $table->boolean('is_sent')->default(false);
            $table->dateTime('sent_at')->nullable();
            $table->string('channel')->default('in_app'); // in_app, email, sms, whatsapp
            $table->timestamps();

            $table->index(['source_type', 'source_id']);
            $table->index(['notify_at', 'is_sent']);
        });

        // ================================================================
        // 3. ADVANCED HSE KPI
        // ================================================================
        Schema::create('hse_kpi_metrics', function (Blueprint $table) {
            $table->id();
            $table->string('metric_code')->unique(); // LTIFR, TRIFR, NEAR_MISS_RATE, SAFETY_MANHOURS
            $table->string('metric_name');
            $table->text('description')->nullable();
            $table->string('formula')->nullable();
            $table->string('unit')->nullable();
            $table->decimal('target_value', 12, 4)->nullable();
            $table->string('target_period')->default('monthly'); // daily, weekly, monthly, yearly
            $table->boolean('lower_is_better')->default(true);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        Schema::create('hse_kpi_records', function (Blueprint $table) {
            $table->id();
            $table->foreignId('hse_kpi_metric_id')->constrained()->cascadeOnDelete();
            $table->date('period_start');
            $table->date('period_end');
            $table->decimal('value', 18, 6);
            $table->decimal('target_value', 18, 6)->nullable();
            $table->json('breakdown')->nullable();
            $table->text('remarks')->nullable();
            $table->string('calculated_by')->nullable();
            $table->dateTime('calculated_at');
            $table->timestamps();

            $table->index(['hse_kpi_metric_id', 'period_start', 'period_end']);
        });

        Schema::create('safety_manhours_logs', function (Blueprint $table) {
            $table->id();
            $table->date('log_date');
            $table->string('site')->nullable();
            $table->string('contractor')->nullable();
            $table->integer('total_personnel');
            $table->decimal('total_hours', 12, 2);
            $table->boolean('incident_free')->default(true);
            $table->text('notes')->nullable();
            $table->timestamps();

            $table->index('log_date');
        });

        // ================================================================
        // 4. SCHEDULED INSPECTION
        // ================================================================
        Schema::create('inspection_templates', function (Blueprint $table) {
            $table->id();
            $table->string('code')->unique();
            $table->string('name');
            $table->text('description')->nullable();
            $table->string('category'); // area, equipment, ppe, fire_safety, electrical
            $table->string('frequency'); // daily, weekly, monthly, quarterly, yearly
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        Schema::create('inspection_template_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('inspection_template_id')->constrained()->cascadeOnDelete();
            $table->integer('item_order')->default(0);
            $table->string('item_text');
            $table->string('item_type')->default('checkbox'); // checkbox, rating, text, photo
            $table->boolean('is_critical')->default(false);
            $table->text('guidance')->nullable();
            $table->timestamps();
        });

        Schema::create('inspection_schedules', function (Blueprint $table) {
            $table->id();
            $table->foreignId('inspection_template_id')->constrained()->cascadeOnDelete();
            $table->string('title');
            $table->unsignedBigInteger('work_area_id')->nullable();
            $table->unsignedBigInteger('equipment_id')->nullable();
            $table->unsignedBigInteger('assigned_to')->nullable();
            $table->date('scheduled_date');
            $table->time('scheduled_time')->nullable();
            $table->enum('status', ['scheduled', 'in_progress', 'completed', 'overdue', 'cancelled'])->default('scheduled');
            $table->string('frequency')->nullable();
            $table->date('next_occurrence')->nullable();
            $table->timestamps();

            $table->foreign('work_area_id')->references('id')->on('work_areas')->nullOnDelete();
            $table->foreign('equipment_id')->references('id')->on('equipment')->nullOnDelete();
            $table->foreign('assigned_to')->references('id')->on('personnel')->nullOnDelete();
            $table->index(['scheduled_date', 'status']);
        });

        Schema::create('inspection_results', function (Blueprint $table) {
            $table->id();
            $table->foreignId('inspection_schedule_id')->constrained()->cascadeOnDelete();
            $table->unsignedBigInteger('inspector_id');
            $table->dateTime('inspected_at');
            $table->enum('overall_result', ['pass', 'pass_with_findings', 'fail'])->default('pass');
            $table->integer('total_items');
            $table->integer('passed_items')->default(0);
            $table->integer('failed_items')->default(0);
            $table->text('summary')->nullable();
            $table->string('signature_path')->nullable();
            $table->timestamps();

            $table->foreign('inspector_id')->references('id')->on('personnel')->cascadeOnDelete();
        });

        Schema::create('inspection_findings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('inspection_result_id')->constrained()->cascadeOnDelete();
            $table->foreignId('inspection_template_item_id')->nullable()->constrained('inspection_template_items')->nullOnDelete();
            $table->string('item_text');
            $table->enum('status', ['pass', 'fail', 'na'])->default('pass');
            $table->enum('severity', ['low', 'medium', 'high', 'critical'])->nullable();
            $table->text('remarks')->nullable();
            $table->string('photo_path')->nullable();
            $table->unsignedBigInteger('corrective_action_id')->nullable();
            $table->timestamps();

            $table->foreign('corrective_action_id')->references('id')->on('corrective_actions')->nullOnDelete();
        });

        // ================================================================
        // 5. MULTI-CHANNEL NOTIFICATIONS
        // ================================================================
        Schema::create('notification_templates', function (Blueprint $table) {
            $table->id();
            $table->string('code')->unique();
            $table->string('name');
            $table->string('event'); // permit_submitted, permit_approved, sos, expiry, etc.
            $table->json('channels'); // ['email','sms','whatsapp','push','in_app']
            $table->string('subject_template')->nullable();
            $table->text('body_template');
            $table->json('variables')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        Schema::create('notification_subscriptions', function (Blueprint $table) {
            $table->id();
            $table->uuid('user_id');
            $table->string('event');
            $table->json('channels');
            $table->boolean('is_enabled')->default(true);
            $table->timestamps();

            $table->foreign('user_id')->references('id')->on('users')->cascadeOnDelete();
            $table->unique(['user_id', 'event'], 'notif_sub_unique');
        });

        Schema::create('notification_dispatches', function (Blueprint $table) {
            $table->id();
            $table->string('event');
            $table->string('channel'); // email, sms, whatsapp, push, in_app
            $table->string('recipient');
            $table->uuid('recipient_user_id')->nullable();
            $table->string('subject')->nullable();
            $table->text('body');
            $table->enum('status', ['queued', 'sent', 'failed', 'delivered', 'read'])->default('queued');
            $table->integer('attempts')->default(0);
            $table->text('error_message')->nullable();
            $table->dateTime('sent_at')->nullable();
            $table->dateTime('delivered_at')->nullable();
            $table->timestamps();

            $table->index(['event', 'channel', 'status']);
        });

        // ================================================================
        // 6. ROLE / PERMISSION MANAGEMENT (RBAC)
        // ================================================================
        Schema::create('roles', function (Blueprint $table) {
            $table->id();
            $table->string('code')->unique();
            $table->string('name');
            $table->text('description')->nullable();
            $table->boolean('is_system')->default(false);
            $table->timestamps();
        });

        Schema::create('permissions', function (Blueprint $table) {
            $table->id();
            $table->string('code')->unique(); // permits.create, permits.approve, hse.incident.close
            $table->string('name');
            $table->string('module');
            $table->text('description')->nullable();
            $table->timestamps();
        });

        Schema::create('role_permissions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('role_id')->constrained('roles')->cascadeOnDelete();
            $table->foreignId('permission_id')->constrained('permissions')->cascadeOnDelete();
            $table->timestamps();

            $table->unique(['role_id', 'permission_id']);
        });

        Schema::create('user_roles', function (Blueprint $table) {
            $table->id();
            $table->uuid('user_id');
            $table->foreignId('role_id')->constrained('roles')->cascadeOnDelete();
            $table->unsignedBigInteger('work_area_id')->nullable();
            $table->dateTime('assigned_at')->nullable();
            $table->dateTime('expires_at')->nullable();
            $table->timestamps();

            $table->foreign('user_id')->references('id')->on('users')->cascadeOnDelete();
            $table->foreign('work_area_id')->references('id')->on('work_areas')->nullOnDelete();
            $table->unique(['user_id', 'role_id', 'work_area_id'], 'user_role_unique');
        });

        // ================================================================
        // 7. PERMIT TEMPLATES
        // ================================================================
        Schema::create('permit_templates', function (Blueprint $table) {
            $table->id();
            $table->string('code')->unique();
            $table->string('name');
            $table->text('description')->nullable();
            $table->foreignId('permit_type_id')->constrained()->cascadeOnDelete();
            $table->unsignedBigInteger('default_work_area_id')->nullable();
            $table->json('default_safety_precautions')->nullable();
            $table->json('default_ppe_requirements')->nullable();
            $table->json('default_hazards')->nullable();
            $table->integer('default_duration_hours')->default(8);
            $table->json('default_personnel_roles')->nullable();
            $table->json('default_equipment_types')->nullable();
            $table->boolean('is_active')->default(true);
            $table->integer('usage_count')->default(0);
            $table->string('created_by')->nullable();
            $table->timestamps();

            $table->foreign('default_work_area_id')->references('id')->on('work_areas')->nullOnDelete();
        });

        // Add reference column on work_permits to track template
        Schema::table('work_permits', function (Blueprint $table) {
            $table->unsignedBigInteger('permit_template_id')->nullable()->after('permit_type_id');
            $table->foreign('permit_template_id')->references('id')->on('permit_templates')->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('work_permits', function (Blueprint $table) {
            $table->dropForeign(['permit_template_id']);
            $table->dropColumn('permit_template_id');
        });

        Schema::dropIfExists('permit_templates');
        Schema::dropIfExists('user_roles');
        Schema::dropIfExists('role_permissions');
        Schema::dropIfExists('permissions');
        Schema::dropIfExists('roles');
        Schema::dropIfExists('notification_dispatches');
        Schema::dropIfExists('notification_subscriptions');
        Schema::dropIfExists('notification_templates');
        Schema::dropIfExists('inspection_findings');
        Schema::dropIfExists('inspection_results');
        Schema::dropIfExists('inspection_schedules');
        Schema::dropIfExists('inspection_template_items');
        Schema::dropIfExists('inspection_templates');
        Schema::dropIfExists('safety_manhours_logs');
        Schema::dropIfExists('hse_kpi_records');
        Schema::dropIfExists('hse_kpi_metrics');
        Schema::dropIfExists('certification_reminders');
        Schema::dropIfExists('training_matrices');
        Schema::dropIfExists('training_records');
        Schema::dropIfExists('training_sessions');
        Schema::dropIfExists('training_programs');
        Schema::dropIfExists('approval_delegations');
        Schema::dropIfExists('approval_matrix_stages');
        Schema::dropIfExists('approval_matrices');
    }
};
