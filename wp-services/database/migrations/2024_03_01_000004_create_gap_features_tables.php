<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * ================================================================
     * GAP ANALYSIS FEATURES — PPE Checklist, Permit Transfer, Permit
     * Revoke, Night Work, Closure Checklist, Audit Module, Email Notif
     * ================================================================
     */
    public function up(): void
    {
        // ========================
        // ADD NIGHT WORK & REVOKE TO work_permits
        // ========================
        Schema::table('work_permits', function (Blueprint $table) {
            $table->boolean('is_night_work')->default(false)->after('special_conditions');
            $table->string('night_work_justification')->nullable()->after('is_night_work');
            $table->string('revoked_by')->nullable()->after('suspension_reason');
            $table->timestamp('revoked_at')->nullable()->after('revoked_by');
            $table->string('revoke_reason')->nullable()->after('revoked_at');
        });

        // ========================
        // PPE CHECKLISTS
        // ========================
        Schema::create('ppe_checklists', function (Blueprint $table) {
            $table->id();
            $table->foreignId('work_permit_id')->constrained('work_permits')->cascadeOnDelete();
            $table->string('checked_by_name');
            $table->unsignedBigInteger('checked_by_id')->nullable();
            $table->timestamp('checked_at')->nullable();
            $table->boolean('is_compliant')->default(false);
            $table->text('remarks')->nullable();
            $table->timestamps();

            $table->foreign('checked_by_id')->references('id')->on('personnel')->nullOnDelete();
        });

        Schema::create('ppe_checklist_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('ppe_checklist_id')->constrained('ppe_checklists')->cascadeOnDelete();
            $table->string('ppe_item'); // hard_hat, safety_glasses, gloves, etc.
            $table->boolean('is_required')->default(true);
            $table->boolean('is_available')->default(false);
            $table->boolean('is_condition_ok')->default(false);
            $table->text('remarks')->nullable();
            $table->timestamps();
        });

        // ========================
        // PERMIT TRANSFERS
        // ========================
        Schema::create('permit_transfers', function (Blueprint $table) {
            $table->id();
            $table->foreignId('work_permit_id')->constrained('work_permits')->cascadeOnDelete();
            $table->unsignedBigInteger('from_personnel_id');
            $table->unsignedBigInteger('to_personnel_id');
            $table->string('from_role')->nullable(); // role in permit context
            $table->string('to_role')->nullable();
            $table->text('reason');
            $table->string('status')->default('pending'); // pending, approved, rejected
            $table->string('requested_by')->nullable();
            $table->string('approved_by')->nullable();
            $table->timestamp('approved_at')->nullable();
            $table->text('approval_remarks')->nullable();
            $table->timestamps();

            $table->foreign('from_personnel_id')->references('id')->on('personnel');
            $table->foreign('to_personnel_id')->references('id')->on('personnel');
        });

        // ========================
        // CLOSURE CHECKLISTS
        // ========================
        Schema::create('closure_checklists', function (Blueprint $table) {
            $table->id();
            $table->foreignId('work_permit_id')->constrained('work_permits')->cascadeOnDelete();
            $table->string('completed_by_name');
            $table->unsignedBigInteger('completed_by_id')->nullable();
            $table->timestamp('completed_at')->nullable();
            $table->boolean('all_items_checked')->default(false);
            $table->text('remarks')->nullable();
            $table->timestamps();

            $table->foreign('completed_by_id')->references('id')->on('personnel')->nullOnDelete();
        });

        Schema::create('closure_checklist_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('closure_checklist_id')->constrained('closure_checklists')->cascadeOnDelete();
            $table->string('item_description');
            $table->boolean('is_checked')->default(false);
            $table->string('checked_by')->nullable();
            $table->timestamp('checked_at')->nullable();
            $table->text('remarks')->nullable();
            $table->timestamps();
        });

        // ========================
        // EMAIL NOTIFICATION LOG
        // ========================
        Schema::create('email_notifications', function (Blueprint $table) {
            $table->id();
            $table->string('recipient_email');
            $table->string('recipient_name')->nullable();
            $table->string('subject');
            $table->text('body');
            $table->string('template'); // permit_approval, sos_alert, gas_unsafe, permit_expiring
            $table->json('template_data')->nullable();
            $table->string('status')->default('queued'); // queued, sent, failed
            $table->text('error_message')->nullable();
            $table->timestamp('sent_at')->nullable();
            $table->timestamps();
        });

        // ========================
        // DYNAMIC FORM FIELD CONFIGURATION
        // ========================
        Schema::create('form_field_configs', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('permit_type_id')->nullable();
            $table->string('section'); // general, ppe, risk, gas_test, closure
            $table->string('field_name');
            $table->string('field_label');
            $table->string('field_type')->default('text'); // text, checkbox, select, textarea, number
            $table->json('options')->nullable(); // for select/checkbox fields
            $table->boolean('is_mandatory')->default(false);
            $table->boolean('is_active')->default(true);
            $table->integer('sort_order')->default(0);
            $table->text('instruction')->nullable(); // instruction embedding
            $table->text('tooltip')->nullable();
            $table->timestamps();

            $table->foreign('permit_type_id')->references('id')->on('permit_types')->cascadeOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('form_field_configs');
        Schema::dropIfExists('email_notifications');
        Schema::dropIfExists('closure_checklist_items');
        Schema::dropIfExists('closure_checklists');
        Schema::dropIfExists('permit_transfers');
        Schema::dropIfExists('ppe_checklist_items');
        Schema::dropIfExists('ppe_checklists');

        Schema::table('work_permits', function (Blueprint $table) {
            $table->dropColumn([
                'is_night_work', 'night_work_justification',
                'revoked_by', 'revoked_at', 'revoke_reason',
            ]);
        });
    }
};
