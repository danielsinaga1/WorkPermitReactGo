<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * ================================================================
     * WORK PERMIT & HSE SYSTEM — Core Tables
     * ================================================================
     * Tables:
     *   - work_areas               (lokasi/area kerja)
     *   - personnel                (data personel/pekerja)
     *   - personnel_qualifications (sertifikasi & kualifikasi personel)
     *   - equipment                (data alat/equipment)
     *   - equipment_certifications (sertifikasi alat)
     *   - permit_types             (tipe izin kerja)
     *   - work_permits             (izin kerja utama)
     *   - permit_approvals         (tahapan persetujuan)
     *   - permit_risk_assessments  (risk assessment per izin)
     *   - permit_personnel         (pivot: personel terkait izin)
     *   - permit_equipment         (pivot: alat terkait izin)
     *   - permit_attachments       (lampiran dokumen izin)
     *   - permit_extensions        (perpanjangan izin)
     *   - clash_detections         (hasil deteksi konflik)
     * ================================================================
     */
    public function up(): void
    {
        // ========================
        // WORK AREAS
        // ========================
        Schema::create('work_areas', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('code')->unique();
            $table->text('description')->nullable();
            $table->string('zone_type')->default('general'); // general, hazardous, confined, elevated
            $table->decimal('latitude', 10, 7)->nullable();
            $table->decimal('longitude', 10, 7)->nullable();
            $table->decimal('radius_meters', 8, 2)->default(50);
            $table->string('plant_unit')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
            $table->softDeletes();
        });

        // ========================
        // PERSONNEL
        // ========================
        Schema::create('personnel', function (Blueprint $table) {
            $table->id();
            $table->string('employee_id')->unique();
            $table->string('name');
            $table->string('email')->nullable();
            $table->string('phone')->nullable();
            $table->string('company'); // kontraktor / internal
            $table->string('department')->nullable();
            $table->string('position')->nullable();
            $table->string('photo')->nullable();
            $table->string('qr_code')->nullable();
            $table->string('nfc_tag_id')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
            $table->softDeletes();
        });

        // ========================
        // PERSONNEL QUALIFICATIONS
        // ========================
        Schema::create('personnel_qualifications', function (Blueprint $table) {
            $table->id();
            $table->foreignId('personnel_id')->constrained('personnel')->cascadeOnDelete();
            $table->string('qualification_type'); // safety_induction, K3, confined_space_entry, working_at_height, etc.
            $table->string('certificate_number')->nullable();
            $table->string('issuing_body')->nullable();
            $table->date('issued_date');
            $table->date('expiry_date');
            $table->string('document_path')->nullable();
            $table->enum('status', ['valid', 'expired', 'revoked'])->default('valid');
            $table->timestamps();
        });

        // ========================
        // EQUIPMENT
        // ========================
        Schema::create('equipment', function (Blueprint $table) {
            $table->id();
            $table->string('equipment_id')->unique();
            $table->string('name');
            $table->string('type'); // crane, excavator, scaffolding, gas_detector, etc.
            $table->string('brand')->nullable();
            $table->string('model')->nullable();
            $table->string('serial_number')->nullable();
            $table->string('owner_company')->nullable();
            $table->string('qr_code')->nullable();
            $table->string('nfc_tag_id')->nullable();
            $table->date('last_inspection_date')->nullable();
            $table->date('next_inspection_date')->nullable();
            $table->enum('condition', ['good', 'fair', 'poor', 'out_of_service'])->default('good');
            $table->boolean('is_active')->default(true);
            $table->timestamps();
            $table->softDeletes();
        });

        // ========================
        // EQUIPMENT CERTIFICATIONS
        // ========================
        Schema::create('equipment_certifications', function (Blueprint $table) {
            $table->id();
            $table->foreignId('equipment_id')->constrained()->cascadeOnDelete();
            $table->string('certification_type'); // SIA, SIO, load_test, calibration
            $table->string('certificate_number')->nullable();
            $table->string('issuing_body')->nullable();
            $table->date('issued_date');
            $table->date('expiry_date');
            $table->string('document_path')->nullable();
            $table->enum('status', ['valid', 'expired', 'revoked'])->default('valid');
            $table->timestamps();
        });

        // ========================
        // PERMIT TYPES
        // ========================
        Schema::create('permit_types', function (Blueprint $table) {
            $table->id();
            $table->string('code')->unique(); // PLANT, NON_PLANT, HOT_WORK, CONFINED_SPACE, EXCAVATION, DIVING, LIFTING, WORK_AT_HEIGHT
            $table->string('name');
            $table->text('description')->nullable();
            $table->json('required_qualifications')->nullable(); // daftar kualifikasi wajib
            $table->json('required_equipment_certs')->nullable(); // daftar sertifikasi alat wajib
            $table->json('risk_checklist_template')->nullable(); // template checklist risiko
            $table->json('workflow_stages')->nullable(); // template tahapan approval
            $table->integer('max_duration_hours')->default(8);
            $table->string('color_code')->default('#3B82F6'); // untuk UI
            $table->string('icon')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        // ========================
        // WORK PERMITS
        // ========================
        Schema::create('work_permits', function (Blueprint $table) {
            $table->id();
            $table->string('permit_number')->unique();
            $table->foreignId('permit_type_id')->constrained()->restrictOnDelete();
            $table->foreignId('work_area_id')->constrained()->restrictOnDelete();
            $table->foreignId('requested_by')->constrained('personnel')->restrictOnDelete();
            $table->string('title');
            $table->text('work_description');
            $table->dateTime('planned_start');
            $table->dateTime('planned_end');
            $table->dateTime('actual_start')->nullable();
            $table->dateTime('actual_end')->nullable();
            $table->enum('priority', ['low', 'medium', 'high', 'critical'])->default('medium');
            $table->enum('status', [
                'draft',
                'submitted',
                'under_review',
                'risk_assessment',
                'pending_approval',
                'approved',
                'active',
                'suspended',
                'completed',
                'closed',
                'rejected',
                'cancelled',
                'expired'
            ])->default('draft');
            $table->integer('current_approval_stage')->default(0);
            $table->json('safety_precautions')->nullable();
            $table->json('ppe_requirements')->nullable(); // APD yang dibutuhkan
            $table->json('gas_test_results')->nullable();
            $table->json('isolation_details')->nullable(); // detail isolasi energi
            $table->text('special_conditions')->nullable();
            $table->text('rejection_reason')->nullable();
            $table->text('suspension_reason')->nullable();
            $table->text('closure_remarks')->nullable();
            $table->string('closed_by_name')->nullable();
            $table->dateTime('closed_at')->nullable();
            $table->boolean('has_clash')->default(false);
            $table->timestamps();
            $table->softDeletes();

            $table->index(['status', 'planned_start']);
            $table->index(['work_area_id', 'planned_start', 'planned_end']);
        });

        // ========================
        // PERMIT APPROVALS (Workflow Engine)
        // ========================
        Schema::create('permit_approvals', function (Blueprint $table) {
            $table->id();
            $table->foreignId('work_permit_id')->constrained()->cascadeOnDelete();
            $table->integer('stage_order'); // urutan tahapan (1-200)
            $table->string('stage_name');
            $table->string('stage_type')->default('approval'); // approval, verification, review, sign_off
            $table->string('approver_role')->nullable(); // role yang dibutuhkan
            $table->foreignId('approver_id')->nullable()->constrained('personnel')->nullOnDelete();
            $table->string('approver_name')->nullable();
            $table->enum('decision', ['pending', 'approved', 'rejected', 'returned', 'skipped'])->default('pending');
            $table->text('remarks')->nullable();
            $table->json('conditions')->nullable(); // kondisi khusus untuk tahapan ini
            $table->string('signature_path')->nullable();
            $table->dateTime('decided_at')->nullable();
            $table->dateTime('deadline_at')->nullable();
            $table->timestamps();

            $table->index(['work_permit_id', 'stage_order']);
        });

        // ========================
        // PERMIT RISK ASSESSMENTS
        // ========================
        Schema::create('permit_risk_assessments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('work_permit_id')->constrained()->cascadeOnDelete();
            $table->string('hazard_description');
            $table->string('hazard_category'); // chemical, physical, biological, ergonomic, mechanical
            $table->integer('likelihood')->default(1); // 1-5
            $table->integer('severity')->default(1); // 1-5
            $table->integer('risk_score')->virtualAs('likelihood * severity');
            $table->enum('risk_level', ['low', 'medium', 'high', 'extreme']); // calculated
            $table->text('control_measures');
            $table->text('residual_risk')->nullable();
            $table->string('assessed_by')->nullable();
            $table->dateTime('assessed_at')->nullable();
            $table->timestamps();
        });

        // ========================
        // PERMIT-PERSONNEL PIVOT
        // ========================
        Schema::create('permit_personnel', function (Blueprint $table) {
            $table->id();
            $table->foreignId('work_permit_id')->constrained()->cascadeOnDelete();
            $table->foreignId('personnel_id')->constrained('personnel')->cascadeOnDelete();
            $table->string('role_in_permit'); // supervisor, worker, safety_officer, gas_tester
            $table->boolean('qualification_verified')->default(false);
            $table->text('verification_notes')->nullable();
            $table->timestamps();

            $table->unique(['work_permit_id', 'personnel_id']);
        });

        // ========================
        // PERMIT-EQUIPMENT PIVOT
        // ========================
        Schema::create('permit_equipment', function (Blueprint $table) {
            $table->id();
            $table->foreignId('work_permit_id')->constrained()->cascadeOnDelete();
            $table->foreignId('equipment_id')->constrained()->cascadeOnDelete();
            $table->boolean('certification_verified')->default(false);
            $table->text('verification_notes')->nullable();
            $table->timestamps();

            $table->unique(['work_permit_id', 'equipment_id']);
        });

        // ========================
        // PERMIT ATTACHMENTS
        // ========================
        Schema::create('permit_attachments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('work_permit_id')->constrained()->cascadeOnDelete();
            $table->string('file_name');
            $table->string('file_path');
            $table->string('file_type'); // pdf, image, doc
            $table->integer('file_size')->nullable();
            $table->string('category')->default('general'); // risk_assessment, gas_test, method_statement, jsa
            $table->string('uploaded_by')->nullable();
            $table->timestamps();
        });

        // ========================
        // PERMIT EXTENSIONS
        // ========================
        Schema::create('permit_extensions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('work_permit_id')->constrained()->cascadeOnDelete();
            $table->dateTime('original_end');
            $table->dateTime('extended_end');
            $table->text('reason');
            $table->enum('status', ['pending', 'approved', 'rejected'])->default('pending');
            $table->string('requested_by')->nullable();
            $table->string('approved_by')->nullable();
            $table->dateTime('decided_at')->nullable();
            $table->timestamps();
        });

        // ========================
        // CLASH DETECTIONS
        // ========================
        Schema::create('clash_detections', function (Blueprint $table) {
            $table->id();
            $table->foreignId('permit_a_id')->constrained('work_permits')->cascadeOnDelete();
            $table->foreignId('permit_b_id')->constrained('work_permits')->cascadeOnDelete();
            $table->enum('clash_type', ['location', 'time', 'resource', 'isolation'])->default('location');
            $table->text('description');
            $table->enum('severity', ['warning', 'critical'])->default('warning');
            $table->enum('resolution_status', ['unresolved', 'acknowledged', 'resolved'])->default('unresolved');
            $table->text('resolution_notes')->nullable();
            $table->string('resolved_by')->nullable();
            $table->dateTime('resolved_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('clash_detections');
        Schema::dropIfExists('permit_extensions');
        Schema::dropIfExists('permit_attachments');
        Schema::dropIfExists('permit_equipment');
        Schema::dropIfExists('permit_personnel');
        Schema::dropIfExists('permit_risk_assessments');
        Schema::dropIfExists('permit_approvals');
        Schema::dropIfExists('work_permits');
        Schema::dropIfExists('permit_types');
        Schema::dropIfExists('equipment_certifications');
        Schema::dropIfExists('equipment');
        Schema::dropIfExists('personnel_qualifications');
        Schema::dropIfExists('personnel');
        Schema::dropIfExists('work_areas');
    }
};
