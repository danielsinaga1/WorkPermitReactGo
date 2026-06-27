<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            // ── Work Permit & HSE ────────────────────────
            WpUserSeeder::class,
            WorkAreaSeeder::class,
            PersonnelSeeder::class,
            PersonnelQualificationSeeder::class,
            EquipmentSeeder::class,
            EquipmentCertificationSeeder::class,
            PermitTypeSeeder::class,
            WorkPermitSeeder::class,
            PermitApprovalSeeder::class,
            PermitRiskAssessmentSeeder::class,
            WpToolboxMeetingSeeder::class,
            SafetyObservationSeeder::class,
            WpIncidentSeeder::class,
            CorrectiveActionSeeder::class,
            LotoProcedureSeeder::class,
            SafetyIndicatorSeeder::class,
            DashboardWidgetSeeder::class,
            GapFeaturesSeeder::class,
            ArsheGapSeeder::class,
        ]);
    }
}
