<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * ================================================================
     * HSE OPERATIONAL SUITE — Tables
     * ================================================================
     * Tables:
     *   - toolbox_meetings         (Safety Toolbox Meetings)
     *   - toolbox_attendees        (Kehadiran toolbox)
     *   - safety_observations      (Observasi dan inspeksi keselamatan)
     *   - observation_photos       (Foto anotasi temuan)
     *   - corrective_actions       (Tindakan perbaikan)
     *   - incidents                (Insiden & Near-Miss)
     *   - incident_witnesses       (Saksi insiden)
     *   - incident_root_causes     (Analisis Akar Penyebab)
     *   - incident_attachments     (Lampiran insiden)
     * ================================================================
     */
    public function up(): void
    {
        // ========================
        // TOOLBOX MEETINGS
        // ========================
        Schema::create('toolbox_meetings', function (Blueprint $table) {
            $table->id();
            $table->string('meeting_number')->unique();
            $table->string('title');
            $table->text('topic');
            $table->foreignId('work_area_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('work_permit_id')->nullable()->constrained()->nullOnDelete();
            $table->string('conducted_by'); // nama pemimpin TBM
            $table->foreignId('conductor_id')->nullable()->constrained('personnel')->nullOnDelete();
            $table->dateTime('meeting_date');
            $table->integer('duration_minutes')->default(15);
            $table->string('weather_condition')->nullable();
            $table->json('briefing_template')->nullable(); // template briefing yang digunakan
            $table->json('key_points')->nullable(); // poin-poin penting
            $table->json('hazards_discussed')->nullable();
            $table->text('additional_notes')->nullable();
            $table->string('pdf_report_path')->nullable(); // path laporan PDF otomatis
            $table->enum('status', ['planned', 'in_progress', 'completed', 'cancelled'])->default('planned');
            $table->timestamps();
            $table->softDeletes();
        });

        // ========================
        // TOOLBOX ATTENDEES
        // ========================
        Schema::create('toolbox_attendees', function (Blueprint $table) {
            $table->id();
            $table->foreignId('toolbox_meeting_id')->constrained()->cascadeOnDelete();
            $table->foreignId('personnel_id')->nullable()->constrained('personnel')->nullOnDelete();
            $table->string('attendee_name');
            $table->string('company')->nullable();
            $table->string('position')->nullable();
            $table->string('signature_path')->nullable();
            $table->boolean('is_present')->default(true);
            $table->dateTime('signed_at')->nullable();
            $table->timestamps();

            $table->unique(['toolbox_meeting_id', 'personnel_id']);
        });

        // ========================
        // SAFETY OBSERVATIONS
        // ========================
        Schema::create('safety_observations', function (Blueprint $table) {
            $table->id();
            $table->string('observation_number')->unique();
            $table->enum('type', ['observation', 'inspection', 'audit'])->default('observation');
            $table->enum('category', [
                'unsafe_act',
                'unsafe_condition',
                'near_miss',
                'positive_observation',
                'environmental',
                'housekeeping',
                'ppe_compliance',
                'procedure_compliance'
            ]);
            $table->foreignId('work_area_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('work_permit_id')->nullable()->constrained()->nullOnDelete();
            $table->string('reported_by_name');
            $table->foreignId('reported_by_id')->nullable()->constrained('personnel')->nullOnDelete();
            $table->dateTime('observed_at');
            $table->text('description');
            $table->string('exact_location')->nullable();
            $table->decimal('gps_latitude', 10, 7)->nullable();
            $table->decimal('gps_longitude', 10, 7)->nullable();
            $table->enum('severity', ['low', 'medium', 'high', 'critical'])->default('medium');
            $table->enum('status', ['open', 'action_assigned', 'in_progress', 'closed', 'verified'])->default('open');
            $table->boolean('requires_immediate_action')->default(false);
            $table->text('immediate_action_taken')->nullable();
            $table->boolean('is_mobile_report')->default(false); // dari perangkat mobile
            $table->timestamps();
            $table->softDeletes();

            $table->index(['status', 'severity']);
        });

        // ========================
        // OBSERVATION PHOTOS
        // ========================
        Schema::create('observation_photos', function (Blueprint $table) {
            $table->id();
            $table->foreignId('safety_observation_id')->constrained()->cascadeOnDelete();
            $table->string('photo_path');
            $table->string('thumbnail_path')->nullable();
            $table->text('caption')->nullable();
            $table->json('annotations')->nullable(); // anotasi foto (koordinat, label, teks)
            $table->enum('photo_type', ['before', 'during', 'after'])->default('before');
            $table->integer('sort_order')->default(0);
            $table->timestamps();
        });

        // ========================
        // CORRECTIVE ACTIONS
        // ========================
        Schema::create('corrective_actions', function (Blueprint $table) {
            $table->id();
            $table->string('action_number')->unique();
            $table->morphs('actionable'); // polymorphic: safety_observations, incidents
            $table->text('description');
            $table->enum('priority', ['low', 'medium', 'high', 'critical'])->default('medium');
            $table->string('assigned_to_name');
            $table->foreignId('assigned_to_id')->nullable()->constrained('personnel')->nullOnDelete();
            $table->string('assigned_by_name')->nullable();
            $table->date('due_date');
            $table->date('completed_date')->nullable();
            $table->enum('status', ['open', 'in_progress', 'completed', 'verified', 'overdue', 'cancelled'])->default('open');
            $table->text('completion_notes')->nullable();
            $table->string('evidence_path')->nullable(); // bukti penyelesaian
            $table->string('verified_by_name')->nullable();
            $table->dateTime('verified_at')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->index(['status', 'due_date']);
        });

        // ========================
        // INCIDENTS
        // ========================
        Schema::create('incidents', function (Blueprint $table) {
            $table->id();
            $table->string('incident_number')->unique();
            $table->enum('type', [
                'near_miss',
                'first_aid',
                'medical_treatment',
                'lost_time_injury',
                'restricted_work',
                'fatality',
                'property_damage',
                'environmental',
                'fire',
                'spill'
            ]);
            $table->enum('severity', ['minor', 'moderate', 'major', 'catastrophic'])->default('minor');
            $table->foreignId('work_area_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('work_permit_id')->nullable()->constrained()->nullOnDelete();
            $table->string('reported_by_name');
            $table->foreignId('reported_by_id')->nullable()->constrained('personnel')->nullOnDelete();
            $table->dateTime('incident_date');
            $table->dateTime('reported_date');
            $table->string('exact_location')->nullable();
            $table->text('description');
            $table->text('immediate_actions_taken')->nullable();
            $table->string('injured_person_name')->nullable();
            $table->string('injured_person_company')->nullable();
            $table->string('injury_type')->nullable(); // laceration, fracture, burn, etc.
            $table->string('body_part_affected')->nullable();
            $table->integer('lost_days')->default(0);
            $table->json('environmental_impact')->nullable();
            $table->decimal('property_damage_cost', 15, 2)->default(0);
            $table->enum('status', [
                'reported',
                'under_investigation',
                'rca_in_progress',
                'actions_assigned',
                'actions_in_progress',
                'closed',
                'reopened'
            ])->default('reported');
            $table->string('investigation_lead')->nullable();
            $table->text('investigation_summary')->nullable();
            $table->text('lessons_learned')->nullable();
            $table->string('pdf_report_path')->nullable();
            $table->dateTime('closed_at')->nullable();
            $table->string('closed_by')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->index(['type', 'severity', 'incident_date']);
        });

        // ========================
        // INCIDENT WITNESSES
        // ========================
        Schema::create('incident_witnesses', function (Blueprint $table) {
            $table->id();
            $table->foreignId('incident_id')->constrained()->cascadeOnDelete();
            $table->foreignId('personnel_id')->nullable()->constrained('personnel')->nullOnDelete();
            $table->string('witness_name');
            $table->string('company')->nullable();
            $table->text('statement')->nullable();
            $table->dateTime('statement_date')->nullable();
            $table->string('signature_path')->nullable();
            $table->timestamps();
        });

        // ========================
        // INCIDENT ROOT CAUSES (RCA)
        // ========================
        Schema::create('incident_root_causes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('incident_id')->constrained()->cascadeOnDelete();
            $table->enum('rca_method', ['5_why', 'fishbone', 'fault_tree', 'taproot', 'bowtie'])->default('5_why');
            $table->json('analysis_data'); // data analisis (tree nodes, why steps, etc.)
            $table->text('direct_cause')->nullable();
            $table->text('contributing_factors')->nullable();
            $table->text('root_cause');
            $table->text('systemic_issues')->nullable();
            $table->string('analyzed_by');
            $table->dateTime('analyzed_at');
            $table->enum('status', ['draft', 'review', 'approved'])->default('draft');
            $table->timestamps();
        });

        // ========================
        // INCIDENT ATTACHMENTS
        // ========================
        Schema::create('incident_attachments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('incident_id')->constrained()->cascadeOnDelete();
            $table->string('file_name');
            $table->string('file_path');
            $table->string('file_type');
            $table->integer('file_size')->nullable();
            $table->string('category')->default('general'); // photo, sketch, medical_report, witness_statement
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('incident_attachments');
        Schema::dropIfExists('incident_root_causes');
        Schema::dropIfExists('incident_witnesses');
        Schema::dropIfExists('incidents');
        Schema::dropIfExists('corrective_actions');
        Schema::dropIfExists('observation_photos');
        Schema::dropIfExists('safety_observations');
        Schema::dropIfExists('toolbox_attendees');
        Schema::dropIfExists('toolbox_meetings');
    }
};
