<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class WpToolboxMeetingSeeder extends Seeder
{
    public function run(): void
    {
        $now = Carbon::now();

        $workAreaIds   = DB::table('work_areas')->pluck('id', 'code');
        $personnelIds  = DB::table('personnel')->pluck('id', 'employee_id');
        $permitIds     = DB::table('work_permits')->pluck('id', 'permit_number');

        $meetings = [
            [
                'meeting_number'    => 'TBM-2026-03-001',
                'title'             => 'Safety Briefing - Pengelasan Pipa Furnace Area',
                'topic'             => 'Bahaya pekerjaan pengelasan di area process, prosedur hot work permit, penggunaan APD las, fire prevention, dan emergency response.',
                'work_area_id'      => $workAreaIds['WA-FUR-01'],
                'work_permit_id'    => $permitIds['WP-2026-03-0001'],
                'conducted_by'      => 'Budi Hartono',
                'conductor_id'      => $personnelIds['EMP-001'],
                'meeting_date'      => Carbon::today()->setHour(6)->setMinute(30),
                'duration_minutes'  => 20,
                'weather_condition' => 'Cerah, suhu 32°C',
                'key_points'        => json_encode([
                    'Pastikan gas test clear sebelum mulai',
                    'Fire watcher wajib hadir selama kerja las',
                    'Gunakan welding screen untuk lindungi orang di sekitar',
                    'APAR terdekat dicek & siap pakai',
                ]),
                'hazards_discussed' => json_encode([
                    'Percikan api → kebakaran',
                    'Welding fume → gangguan pernapasan',
                    'UV radiation → luka bakar kulit & mata',
                    'Sengatan listrik',
                ]),
                'additional_notes'  => 'Semua pekerja diminta untuk saling mengingatkan jika ada unsafe act.',
                'status'            => 'completed',
            ],
            [
                'meeting_number'    => 'TBM-2026-03-002',
                'title'             => 'Pre-Job Safety Talk - Inspeksi Vessel V-101',
                'topic'             => 'Bahaya ruang terbatas, prosedur confined space entry, peran standby man, dan emergency rescue plan.',
                'work_area_id'      => $workAreaIds['WA-CSV-01'],
                'work_permit_id'    => $permitIds['WP-2026-03-0002'],
                'conducted_by'      => 'Fitri Handayani',
                'conductor_id'      => $personnelIds['EMP-010'],
                'meeting_date'      => Carbon::tomorrow()->setHour(6)->setMinute(30),
                'duration_minutes'  => 25,
                'weather_condition' => null,
                'key_points'        => json_encode([
                    'Gas test wajib sebelum masuk',
                    'Ventilasi mekanis harus terus jalan',
                    'Standby man tidak boleh meninggalkan pos',
                    'Rotasi pekerja setiap 2 jam',
                    'Rescue plan & drill sebelum start',
                ]),
                'hazards_discussed' => json_encode([
                    'Kekurangan oksigen',
                    'Paparan gas H2S residual',
                    'Terjebak di dalam vessel',
                    'Jatuh melalui manhole',
                ]),
                'additional_notes'  => 'Rescue drill akan dilaksanakan sebelum entry pertama.',
                'status'            => 'planned',
            ],
            [
                'meeting_number'    => 'TBM-2026-03-003',
                'title'             => 'Daily Safety Briefing - Maintenance Workshop',
                'topic'             => 'Housekeeping area kerja, penggunaan APD, dan pelaporan near miss.',
                'work_area_id'      => $workAreaIds['WA-WKS-01'],
                'work_permit_id'    => null,
                'conducted_by'      => 'Rudi Irawan',
                'conductor_id'      => $personnelIds['EMP-012'],
                'meeting_date'      => Carbon::today()->setHour(7)->setMinute(0),
                'duration_minutes'  => 15,
                'weather_condition' => 'Cerah',
                'key_points'        => json_encode([
                    'Jaga kebersihan area kerja',
                    'Kembalikan tools ke tempatnya',
                    'Laporkan near miss / unsafe condition',
                    'Cek APD sebelum mulai kerja',
                ]),
                'hazards_discussed' => json_encode([
                    'Slip/trip dari lantai kotor',
                    'Cedera tangan dari alat tajam',
                ]),
                'additional_notes'  => null,
                'status'            => 'completed',
            ],
            [
                'meeting_number'    => 'TBM-2026-02-015',
                'title'             => 'Safety Briefing - PM Compressor C-301',
                'topic'             => 'Prosedur LOTO untuk isolasi energi, bahaya tekanan dan rotasi, tugas-tugas PM compressor.',
                'work_area_id'      => $workAreaIds['WA-CMP-01'],
                'work_permit_id'    => $permitIds['WP-2026-02-0015'],
                'conducted_by'      => 'Rudi Irawan',
                'conductor_id'      => $personnelIds['EMP-012'],
                'meeting_date'      => Carbon::today()->subDays(5)->setHour(6)->setMinute(30),
                'duration_minutes'  => 15,
                'weather_condition' => 'Cerah, suhu 30°C',
                'key_points'        => json_encode([
                    'LOTO selesai & diverifikasi sebelum kerja',
                    'Jangan lepas lock tanpa otorisasi',
                    'Cek zero energy pada semua titik',
                ]),
                'hazards_discussed' => json_encode([
                    'Stored pressure',
                    'Rotating equipment',
                    'Electrical energy',
                ]),
                'additional_notes'  => null,
                'status'            => 'completed',
            ],
            [
                'meeting_number'    => 'TBM-2026-03-004',
                'title'             => 'Safety Talk - Scaffolding Erection Cooling Tower',
                'topic'             => 'Prosedur kerja di ketinggian, penggunaan harness & double lanyard, inspeksi scaffolding, cuaca.',
                'work_area_id'      => $workAreaIds['WA-CLT-01'],
                'work_permit_id'    => $permitIds['WP-2026-03-0004'],
                'conducted_by'      => 'Andi Setiawan',
                'conductor_id'      => $personnelIds['EMP-002'],
                'meeting_date'      => Carbon::today()->addDays(2)->setHour(6)->setMinute(0),
                'duration_minutes'  => 20,
                'weather_condition' => null,
                'key_points'        => json_encode([
                    'Cek harness & lanyard sebelum pakai',
                    '100% tie-off setiap saat',
                    'Stop kerja jika angin > 40 km/h',
                    'Tool tether wajib',
                ]),
                'hazards_discussed' => json_encode([
                    'Jatuh dari ketinggian',
                    'Material jatuh menimpa orang bawah',
                    'Angin kencang',
                ]),
                'additional_notes'  => null,
                'status'            => 'planned',
            ],
        ];

        foreach ($meetings as $m) {
            DB::table('toolbox_meetings')->insert(array_merge($m, [
                'briefing_template'  => null,
                'pdf_report_path'    => null,
                'created_at'         => $now,
                'updated_at'         => $now,
            ]));
        }

        // ── Attendees for completed TBMs ──
        $tbmIds = DB::table('toolbox_meetings')->pluck('id', 'meeting_number');

        $attendees = [
            // TBM-2026-03-001 (Hot Work)
            ['tbm' => 'TBM-2026-03-001', 'emp' => 'EMP-001', 'company' => 'PT Industri Bontang',  'position' => 'Supervisor Operasi'],
            ['tbm' => 'TBM-2026-03-001', 'emp' => 'EMP-002', 'company' => 'PT Industri Bontang',  'position' => 'Safety Officer'],
            ['tbm' => 'TBM-2026-03-001', 'emp' => 'EMP-004', 'company' => 'PT Kontraktor Andalan', 'position' => 'Foreman'],
            ['tbm' => 'TBM-2026-03-001', 'emp' => 'EMP-005', 'company' => 'PT Kontraktor Andalan', 'position' => 'Welder'],
            ['tbm' => 'TBM-2026-03-001', 'emp' => 'EMP-006', 'company' => 'PT Industri Bontang',  'position' => 'Gas Tester'],
            ['tbm' => 'TBM-2026-03-001', 'emp' => 'EMP-011', 'company' => 'PT Kontraktor Andalan', 'position' => 'Rigger (Fire Watcher)'],

            // TBM-2026-03-003 (Workshop)
            ['tbm' => 'TBM-2026-03-003', 'emp' => 'EMP-012', 'company' => 'PT Industri Bontang',  'position' => 'Supervisor Mekanik'],
            ['tbm' => 'TBM-2026-03-003', 'emp' => 'EMP-003', 'company' => 'PT Industri Bontang',  'position' => 'Maintenance Planner'],
            ['tbm' => 'TBM-2026-03-003', 'emp' => 'EMP-009', 'company' => 'PT Industri Bontang',  'position' => 'Operator Panel'],

            // TBM-2026-02-015 (PM Compressor)
            ['tbm' => 'TBM-2026-02-015', 'emp' => 'EMP-012', 'company' => 'PT Industri Bontang',  'position' => 'Supervisor Mekanik'],
            ['tbm' => 'TBM-2026-02-015', 'emp' => 'EMP-003', 'company' => 'PT Industri Bontang',  'position' => 'Maintenance Planner'],
            ['tbm' => 'TBM-2026-02-015', 'emp' => 'EMP-002', 'company' => 'PT Industri Bontang',  'position' => 'Safety Officer'],
        ];

        foreach ($attendees as $att) {
            $tbmId = $tbmIds[$att['tbm']] ?? null;
            $pId   = $personnelIds[$att['emp']] ?? null;
            if (!$tbmId) continue;

            $name = DB::table('personnel')->where('employee_id', $att['emp'])->value('name');

            DB::table('toolbox_attendees')->insert([
                'toolbox_meeting_id' => $tbmId,
                'personnel_id'       => $pId,
                'attendee_name'      => $name ?? $att['emp'],
                'company'            => $att['company'],
                'position'           => $att['position'],
                'signature_path'     => null,
                'is_present'         => true,
                'signed_at'          => $now->copy()->subHours(rand(1, 4)),
                'created_at'         => $now,
                'updated_at'         => $now,
            ]);
        }
    }
}
