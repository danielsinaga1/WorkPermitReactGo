<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class CorrectiveActionSeeder extends Seeder
{
    public function run(): void
    {
        $now = Carbon::now();

        $personnelIds    = DB::table('personnel')->pluck('id', 'employee_id');
        $observationIds  = DB::table('safety_observations')->pluck('id', 'observation_number');
        $incidentIds     = DB::table('incidents')->pluck('id', 'incident_number');

        $actions = [
            // From observation OBS-2026-03-001 (Grinding tanpa face shield)
            [
                'action_number'     => 'CA-2026-03-001',
                'actionable_type'   => 'App\\Models\\SafetyObservation',
                'actionable_id'     => $observationIds['OBS-2026-03-001'],
                'description'       => 'Adakan safety talk khusus tentang APD wajib saat grinding. Pasang poster visual APD di setiap mesin gerinda.',
                'priority'          => 'high',
                'assigned_to_name'  => 'Rudi Irawan',
                'assigned_to_id'    => $personnelIds['EMP-012'],
                'assigned_by_name'  => 'Andi Setiawan',
                'due_date'          => Carbon::today()->addDays(3)->toDateString(),
                'completed_date'    => null,
                'status'            => 'in_progress',
                'completion_notes'  => null,
                'evidence_path'     => null,
                'verified_by_name'  => null,
                'verified_at'       => null,
            ],
            // From observation OBS-2026-03-002 (Grating bolong di pipe rack)
            [
                'action_number'     => 'CA-2026-03-002',
                'actionable_type'   => 'App\\Models\\SafetyObservation',
                'actionable_id'     => $observationIds['OBS-2026-03-002'],
                'description'       => 'Penggantian grating yang rusak di Pipe Rack Corridor section S-12. Pesan material dan jadwalkan pekerjaan.',
                'priority'          => 'critical',
                'assigned_to_name'  => 'Dian Permata',
                'assigned_to_id'    => $personnelIds['EMP-003'],
                'assigned_by_name'  => 'Fitri Handayani',
                'due_date'          => Carbon::today()->addDays(5)->toDateString(),
                'completed_date'    => null,
                'status'            => 'open',
                'completion_notes'  => null,
                'evidence_path'     => null,
                'verified_by_name'  => null,
                'verified_at'       => null,
            ],
            // From observation OBS-2026-03-004 (Housekeeping tank farm)
            [
                'action_number'     => 'CA-2026-03-003',
                'actionable_type'   => 'App\\Models\\SafetyObservation',
                'actionable_id'     => $observationIds['OBS-2026-03-004'],
                'description'       => 'Bersihkan area TK-103 dari drum bekas, tumpahan minyak, dan material liar. Pasang spill containment tray.',
                'priority'          => 'medium',
                'assigned_to_name'  => 'Rizal Pratama',
                'assigned_to_id'    => $personnelIds['EMP-004'],
                'assigned_by_name'  => 'Andi Setiawan',
                'due_date'          => Carbon::today()->addDays(7)->toDateString(),
                'completed_date'    => null,
                'status'            => 'open',
                'completion_notes'  => null,
                'evidence_path'     => null,
                'verified_by_name'  => null,
                'verified_at'       => null,
            ],
            // From incident INC-2026-02-001 (First aid - lathe)
            [
                'action_number'     => 'CA-2026-02-001',
                'actionable_type'   => 'App\\Models\\Incident',
                'actionable_id'     => $incidentIds['INC-2026-02-001'],
                'description'       => 'Update SOP mesin bubut: tambahkan detail APD spesifik (cut-resistant gloves level 5) dan ceklis machine guard sebelum operasi.',
                'priority'          => 'high',
                'assigned_to_name'  => 'Rudi Irawan',
                'assigned_to_id'    => $personnelIds['EMP-012'],
                'assigned_by_name'  => 'Fitri Handayani',
                'due_date'          => Carbon::today()->subDays(5)->toDateString(),
                'completed_date'    => Carbon::today()->subDays(6)->toDateString(),
                'status'            => 'verified',
                'completion_notes'  => 'SOP revisi 3 telah diterbitkan dan disosialisasikan ke seluruh personel workshop.',
                'evidence_path'     => null,
                'verified_by_name'  => 'Fitri Handayani',
                'verified_at'       => Carbon::today()->subDays(5),
            ],
            // From incident INC-2026-02-001 (First aid - lathe) - second action
            [
                'action_number'     => 'CA-2026-02-002',
                'actionable_type'   => 'App\\Models\\Incident',
                'actionable_id'     => $incidentIds['INC-2026-02-001'],
                'description'       => 'Pengadaan cut-resistant gloves Level 5 sebanyak 20 pasang untuk workshop.',
                'priority'          => 'medium',
                'assigned_to_name'  => 'Dian Permata',
                'assigned_to_id'    => $personnelIds['EMP-003'],
                'assigned_by_name'  => 'Fitri Handayani',
                'due_date'          => Carbon::today()->subDays(8)->toDateString(),
                'completed_date'    => Carbon::today()->subDays(9)->toDateString(),
                'status'            => 'completed',
                'completion_notes'  => 'Sudah diterima 20 pasang dari vendor. Didistribusikan ke gudang APD workshop.',
                'evidence_path'     => null,
                'verified_by_name'  => null,
                'verified_at'       => null,
            ],
            // From incident INC-2026-01-003 (Cooling tower sprain)
            [
                'action_number'     => 'CA-2026-01-001',
                'actionable_type'   => 'App\\Models\\Incident',
                'actionable_id'     => $incidentIds['INC-2026-01-003'],
                'description'       => 'Pasang anti-slip tape baru di semua tangga area cooling tower. Jadwalkan inspeksi 3 bulanan.',
                'priority'          => 'high',
                'assigned_to_name'  => 'Dian Permata',
                'assigned_to_id'    => $personnelIds['EMP-003'],
                'assigned_by_name'  => 'Andi Setiawan',
                'due_date'          => Carbon::today()->subDays(25)->toDateString(),
                'completed_date'    => Carbon::today()->subDays(28)->toDateString(),
                'status'            => 'verified',
                'completion_notes'  => 'Anti-slip tape 3M terpasang di 12 tangga. Jadwal inspeksi 3 bulanan sudah masuk CMMS.',
                'evidence_path'     => null,
                'verified_by_name'  => 'Fitri Handayani',
                'verified_at'       => Carbon::today()->subDays(24),
            ],
            // Overdue example
            [
                'action_number'     => 'CA-2026-02-010',
                'actionable_type'   => 'App\\Models\\SafetyObservation',
                'actionable_id'     => $observationIds['OBS-2026-02-021'],
                'description'       => 'Pengadaan life jacket tambahan (10 unit) dan pasang life jacket station di 3 titik jetty.',
                'priority'          => 'high',
                'assigned_to_name'  => 'Dian Permata',
                'assigned_to_id'    => $personnelIds['EMP-003'],
                'assigned_by_name'  => 'Fitri Handayani',
                'due_date'          => Carbon::today()->subDays(2)->toDateString(),
                'completed_date'    => null,
                'status'            => 'overdue',
                'completion_notes'  => null,
                'evidence_path'     => null,
                'verified_by_name'  => null,
                'verified_at'       => null,
            ],
        ];

        foreach ($actions as $a) {
            DB::table('corrective_actions')->insert(array_merge($a, [
                'created_at' => $now,
                'updated_at' => $now,
            ]));
        }
    }
}
