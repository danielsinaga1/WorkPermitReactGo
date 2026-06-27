<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class SafetyObservationSeeder extends Seeder
{
    public function run(): void
    {
        $now = Carbon::now();

        $workAreaIds  = DB::table('work_areas')->pluck('id', 'code');
        $personnelIds = DB::table('personnel')->pluck('id', 'employee_id');

        $observations = [
            [
                'observation_number' => 'OBS-2026-03-001',
                'type'               => 'observation',
                'category'           => 'unsafe_act',
                'work_area_id'       => $workAreaIds['WA-WKS-01'],
                'work_permit_id'     => null,
                'reported_by_name'   => 'Andi Setiawan',
                'reported_by_id'     => $personnelIds['EMP-002'],
                'observed_at'        => Carbon::today()->subDays(1)->setHour(10),
                'description'        => 'Pekerja menggunakan gerinda tanpa face shield. Hanya memakai kacamata safety biasa. Percikan gerinda mengarah ke wajah.',
                'exact_location'     => 'Workshop Mekanik, meja kerja #3',
                'severity'           => 'high',
                'status'             => 'action_assigned',
                'requires_immediate_action' => true,
                'immediate_action_taken'    => 'Pekerjaan dihentikan. Pekerja diinstruksikan menggunakan face shield sebelum melanjutkan.',
            ],
            [
                'observation_number' => 'OBS-2026-03-002',
                'type'               => 'observation',
                'category'           => 'unsafe_condition',
                'work_area_id'       => $workAreaIds['WA-PRC-01'],
                'work_permit_id'     => null,
                'reported_by_name'   => 'Fitri Handayani',
                'reported_by_id'     => $personnelIds['EMP-010'],
                'observed_at'        => Carbon::today()->subDays(2)->setHour(14),
                'description'        => 'Grating di pipe rack koridor bagian selatan berlubang (±30cm x 20cm). Potensi kaki terperosok.',
                'exact_location'     => 'Pipe Rack Corridor, section S-12, elevation +6m',
                'severity'           => 'critical',
                'status'             => 'in_progress',
                'requires_immediate_action' => true,
                'immediate_action_taken'    => 'Area ditutup dengan barricade tape dan warning sign terpasang. Temporary cover dipasang.',
            ],
            [
                'observation_number' => 'OBS-2026-03-003',
                'type'               => 'observation',
                'category'           => 'positive_observation',
                'work_area_id'       => $workAreaIds['WA-FUR-01'],
                'work_permit_id'     => null,
                'reported_by_name'   => 'Budi Hartono',
                'reported_by_id'     => $personnelIds['EMP-001'],
                'observed_at'        => Carbon::today()->setHour(8),
                'description'        => 'Tim pengelasan melakukan toolbox meeting lengkap sebelum kerja, semua APD dipakai dengan benar, dan fire watcher aktif memantau sepanjang waktu.',
                'exact_location'     => 'Furnace Area Unit 1, area pipe steam SL-1021',
                'severity'           => 'low',
                'status'             => 'closed',
                'requires_immediate_action' => false,
                'immediate_action_taken'    => null,
            ],
            [
                'observation_number' => 'OBS-2026-03-004',
                'type'               => 'inspection',
                'category'           => 'housekeeping',
                'work_area_id'       => $workAreaIds['WA-TNK-01'],
                'work_permit_id'     => null,
                'reported_by_name'   => 'Andi Setiawan',
                'reported_by_id'     => $personnelIds['EMP-002'],
                'observed_at'        => Carbon::today()->subDays(3)->setHour(9),
                'description'        => 'Area sekitar Tangki TK-103 banyak drum bekas oli terbuka dan tumpahan minyak di tanah. Potensi slip dan pencemaran.',
                'exact_location'     => 'Tank Farm, area belakang TK-103',
                'severity'           => 'medium',
                'status'             => 'action_assigned',
                'requires_immediate_action' => false,
                'immediate_action_taken'    => null,
            ],
            [
                'observation_number' => 'OBS-2026-02-021',
                'type'               => 'observation',
                'category'           => 'ppe_compliance',
                'work_area_id'       => $workAreaIds['WA-JTY-01'],
                'work_permit_id'     => null,
                'reported_by_name'   => 'Dewi Anggraini',
                'reported_by_id'     => $personnelIds['EMP-007'],
                'observed_at'        => Carbon::today()->subDays(8)->setHour(11),
                'description'        => 'Tiga orang pekerja jetty tidak memakai life jacket saat bekerja di tepi dermaga. Sudah ditegur dalam safety patrol.',
                'exact_location'     => 'Jetty Loading Arm #2',
                'severity'           => 'high',
                'status'             => 'closed',
                'requires_immediate_action' => true,
                'immediate_action_taken'    => 'Pekerjaan dihentikan, pekerja diminta mengambil life jacket sebelum lanjut. Briefing ulang oleh supervisor.',
            ],
            [
                'observation_number' => 'OBS-2026-03-005',
                'type'               => 'observation',
                'category'           => 'near_miss',
                'work_area_id'       => $workAreaIds['WA-CLT-01'],
                'work_permit_id'     => null,
                'reported_by_name'   => 'Heri Susanto',
                'reported_by_id'     => $personnelIds['EMP-008'],
                'observed_at'        => Carbon::today()->subDays(1)->setHour(15),
                'description'        => 'Kunci pas 18mm terjatuh dari elevasi +8m scaffolding. Tidak ada orang di bawah. Tool tether tidak digunakan.',
                'exact_location'     => 'Cooling Tower CT-01, sisi barat',
                'severity'           => 'high',
                'status'             => 'open',
                'requires_immediate_action' => true,
                'immediate_action_taken'    => 'Area bawah diberi barricade. Semua pekerja diingatkan wajib tool tether.',
            ],
        ];

        foreach ($observations as $o) {
            DB::table('safety_observations')->insert(array_merge($o, [
                'gps_latitude'      => null,
                'gps_longitude'     => null,
                'is_mobile_report'  => false,
                'created_at'        => $now,
                'updated_at'        => $now,
            ]));
        }
    }
}
