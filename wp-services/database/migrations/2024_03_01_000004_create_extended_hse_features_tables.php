<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * ================================================================
     * EXTENDED HSE FEATURES — Gas Testing, SOS, Lessons Learned,
     * e-Signatures, Geofencing, Notifications, JSA, Contractor Compliance
     * ================================================================
     */
    public function up(): void
    {
        // ========================
        // GAS TEST LOGS (Feature #12 — Blue Form mandatory)
        // Periodic O2, LEL, H2S, CO readings for confined space entry.
        // ========================
        Schema::create('gas_test_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('work_permit_id')->constrained()->cascadeOnDelete();
            $table->foreignId('tested_by_id')->nullable()->constrained('personnel')->nullOnDelete();
            $table->string('tested_by_name');
            $table->dateTime('tested_at');
            $table->decimal('o2_level', 5, 2);       // Oxygen % (safe: 19.5-23.5)
            $table->decimal('lel_level', 5, 2);       // Lower Explosive Limit % (safe: <10)
            $table->decimal('h2s_level', 6, 2);       // H2S ppm (safe: <10)
            $table->decimal('co_level', 6, 2);        // CO ppm (safe: <25)
            $table->string('equipment_serial')->nullable(); // gas detector serial
            $table->boolean('is_safe')->default(false);
            $table->text('remarks')->nullable();
            $table->decimal('gps_latitude', 10, 7)->nullable();
            $table->decimal('gps_longitude', 10, 7)->nullable();
            $table->timestamps();

            $table->index(['work_permit_id', 'tested_at']);
        });

        // ========================
        // EMERGENCY SOS ALERTS (Feature #16 — crucial for Blue Form)
        // Instant alert to ERT with GPS coordinates.
        // ========================
        Schema::create('emergency_sos_alerts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('work_permit_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('triggered_by_id')->nullable()->constrained('personnel')->nullOnDelete();
            $table->string('triggered_by_name');
            $table->dateTime('triggered_at');
            $table->decimal('gps_latitude', 10, 7)->nullable();
            $table->decimal('gps_longitude', 10, 7)->nullable();
            $table->string('alert_type')->default('sos'); // sos, medical, fire, gas_leak, entrapment
            $table->text('description')->nullable();
            $table->enum('status', ['triggered', 'acknowledged', 'responding', 'resolved', 'false_alarm'])->default('triggered');
            $table->string('acknowledged_by')->nullable();
            $table->dateTime('acknowledged_at')->nullable();
            $table->string('resolved_by')->nullable();
            $table->dateTime('resolved_at')->nullable();
            $table->text('resolution_notes')->nullable();
            $table->integer('response_time_minutes')->nullable();
            $table->timestamps();

            $table->index(['status', 'triggered_at']);
        });

        // ========================
        // LESSON LEARNED REPOSITORY (Feature #20 — pop-up before Red Forms)
        // Past incident summaries that must be acknowledged before starting hot work.
        // ========================
        Schema::create('lessons_learned', function (Blueprint $table) {
            $table->id();
            $table->foreignId('incident_id')->nullable()->constrained()->nullOnDelete();
            $table->string('title');
            $table->text('summary');
            $table->text('root_cause_summary')->nullable();
            $table->text('preventive_measures');
            $table->json('applicable_permit_types')->nullable(); // ['HOT_WORK','CONFINED_SPACE']
            $table->json('applicable_work_areas')->nullable();
            $table->string('severity_level')->default('medium');
            $table->boolean('is_mandatory_reading')->default(true);
            $table->boolean('is_active')->default(true);
            $table->string('created_by')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });

        // ========================
        // LESSON LEARNED ACKNOWLEDGEMENTS
        // Track who has read each lesson before permit issuance.
        // ========================
        Schema::create('lesson_acknowledgements', function (Blueprint $table) {
            $table->id();
            $table->foreignId('lesson_id')->constrained('lessons_learned')->cascadeOnDelete();
            $table->foreignId('personnel_id')->constrained('personnel')->cascadeOnDelete();
            $table->foreignId('work_permit_id')->nullable()->constrained()->nullOnDelete();
            $table->dateTime('acknowledged_at');
            $table->timestamps();

            $table->unique(['lesson_id', 'personnel_id', 'work_permit_id'], 'lesson_ack_unique');
        });

        // ========================
        // E-SIGNATURES (Feature #6 — timestamped digital signatures)
        // Polymorphic: can sign permits, approvals, toolbox meetings, etc.
        // ========================
        Schema::create('e_signatures', function (Blueprint $table) {
            $table->id();
            $table->morphs('signable'); // work_permits, permit_approvals, toolbox_attendees
            $table->foreignId('signer_id')->nullable()->constrained('personnel')->nullOnDelete();
            $table->string('signer_name');
            $table->string('signer_role')->nullable();
            $table->string('signature_image_path'); // base64 canvas stored as PNG
            $table->string('signature_hash');        // SHA-256 integrity check
            $table->dateTime('signed_at');
            $table->string('ip_address')->nullable();
            $table->string('device_info')->nullable();
            $table->decimal('gps_latitude', 10, 7)->nullable();
            $table->decimal('gps_longitude', 10, 7)->nullable();
            $table->timestamps();
        });

        // ========================
        // GEOFENCE LOGS (Feature #3 — GPS validation)
        // Logs GPS check-in/check-out to validate worker presence on-site.
        // ========================
        Schema::create('geofence_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('work_permit_id')->constrained()->cascadeOnDelete();
            $table->foreignId('personnel_id')->nullable()->constrained('personnel')->nullOnDelete();
            $table->string('personnel_name');
            $table->decimal('latitude', 10, 7);
            $table->decimal('longitude', 10, 7);
            $table->decimal('distance_from_center', 8, 2); // meters from work area center
            $table->boolean('is_within_geofence');
            $table->string('event_type')->default('check_in'); // check_in, check_out, periodic, violation
            $table->timestamps();

            $table->index(['work_permit_id', 'created_at']);
        });

        // ========================
        // NOTIFICATIONS (Feature #5 — real-time push notifications)
        // Persistent notification records for audit & offline sync.
        // ========================
        Schema::create('notifications', function (Blueprint $table) {
            $table->id();
            $table->foreignUuid('user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('personnel_id')->nullable()->constrained('personnel')->nullOnDelete();
            $table->string('type'); // approval_required, permit_approved, permit_rejected, permit_expiring, sos_alert, gas_test_due
            $table->string('title');
            $table->text('body');
            $table->json('data')->nullable(); // payload (permit_id, url, etc.)
            $table->string('channel')->default('in_app'); // in_app, push, email, sms
            $table->boolean('is_read')->default(false);
            $table->dateTime('read_at')->nullable();
            $table->timestamps();

            $table->index(['user_id', 'is_read', 'created_at']);
            $table->index(['personnel_id', 'is_read', 'created_at']);
        });

        // ========================
        // JSA TEMPLATES (Feature #1 — Digital Job Safety Analysis)
        // Auto-generated hazard analysis based on permit type & work area.
        // ========================
        Schema::create('jsa_templates', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('applicable_permit_type')->nullable(); // HOT_WORK, CONFINED_SPACE, etc.
            $table->string('applicable_zone_type')->nullable();   // hazardous, confined, elevated
            $table->json('steps'); // [{step, hazards: [{hazard, risk_level, controls: []}]}]
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        // ========================
        // JSA RECORDS (per permit — auto-populated from template, editable)
        // ========================
        Schema::create('jsa_records', function (Blueprint $table) {
            $table->id();
            $table->foreignId('work_permit_id')->constrained()->cascadeOnDelete();
            $table->foreignId('jsa_template_id')->nullable()->constrained()->nullOnDelete();
            $table->json('steps'); // editable copy from template
            $table->string('prepared_by')->nullable();
            $table->string('reviewed_by')->nullable();
            $table->enum('status', ['draft', 'reviewed', 'approved'])->default('draft');
            $table->dateTime('approved_at')->nullable();
            $table->timestamps();
        });

        // ========================
        // CONTRACTOR COMPLIANCE (Feature #14 — vendor HSE tracking)
        // ========================
        Schema::create('contractor_companies', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('registration_number')->unique();
            $table->string('contact_person')->nullable();
            $table->string('phone')->nullable();
            $table->string('email')->nullable();
            $table->text('address')->nullable();
            $table->date('hse_certificate_expiry')->nullable();
            $table->string('hse_certificate_path')->nullable();
            $table->decimal('safety_score', 5, 2)->default(100);
            $table->integer('total_violations')->default(0);
            $table->integer('total_incidents')->default(0);
            $table->enum('compliance_status', ['compliant', 'warning', 'non_compliant', 'blacklisted'])->default('compliant');
            $table->boolean('is_active')->default(true);
            $table->timestamps();
            $table->softDeletes();
        });

        // ========================
        // OFFLINE SYNC QUEUE (Feature #11 — offline mode support)
        // ========================
        Schema::create('offline_sync_queue', function (Blueprint $table) {
            $table->id();
            $table->string('entity_type'); // work_permit, gas_test_log, observation
            $table->string('action'); // create, update
            $table->json('payload');
            $table->string('device_id')->nullable();
            $table->foreignId('synced_by_id')->nullable()->constrained('personnel')->nullOnDelete();
            $table->string('client_timestamp')->nullable();
            $table->enum('sync_status', ['pending', 'synced', 'conflict', 'failed'])->default('pending');
            $table->text('sync_error')->nullable();
            $table->dateTime('synced_at')->nullable();
            $table->timestamps();

            $table->index(['sync_status', 'created_at']);
        });

        // ========================
        // PHOTO EVIDENCE (Feature #9 — before/after for permit closing)
        // ========================
        Schema::create('permit_photos', function (Blueprint $table) {
            $table->id();
            $table->foreignId('work_permit_id')->constrained()->cascadeOnDelete();
            $table->string('photo_path');
            $table->string('thumbnail_path')->nullable();
            $table->enum('photo_type', ['before', 'during', 'after'])->default('before');
            $table->text('caption')->nullable();
            $table->string('uploaded_by_name')->nullable();
            $table->foreignId('uploaded_by_id')->nullable()->constrained('personnel')->nullOnDelete();
            $table->decimal('gps_latitude', 10, 7)->nullable();
            $table->decimal('gps_longitude', 10, 7)->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('permit_photos');
        Schema::dropIfExists('offline_sync_queue');
        Schema::dropIfExists('contractor_companies');
        Schema::dropIfExists('jsa_records');
        Schema::dropIfExists('jsa_templates');
        Schema::dropIfExists('notifications');
        Schema::dropIfExists('geofence_logs');
        Schema::dropIfExists('e_signatures');
        Schema::dropIfExists('lesson_acknowledgements');
        Schema::dropIfExists('lessons_learned');
        Schema::dropIfExists('emergency_sos_alerts');
        Schema::dropIfExists('gas_test_logs');
    }
};
