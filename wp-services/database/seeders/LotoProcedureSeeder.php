<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class LotoProcedureSeeder extends Seeder
{
    public function run(): void
    {
        $now = Carbon::now();

        $workAreaIds  = DB::table('work_areas')->pluck('id', 'code');
        $personnelIds = DB::table('personnel')->pluck('id', 'employee_id');
        $permitIds    = DB::table('work_permits')->pluck('id', 'permit_number');

        $procedures = [
            [
                'procedure_number' => 'LOTO-2026-001',
                'title'            => 'LOTO Compressor C-301 - Preventive Maintenance',
                'description'      => 'Prosedur Lock-Out Tag-Out untuk isolasi energi compressor C-301 saat PM 6 bulanan. Meliputi isolasi listrik, pneumatik, dan residual pressure.',
                'work_area_id'     => $workAreaIds['WA-CMP-01'],
                'work_permit_id'   => $permitIds['WP-2026-02-0015'],
                'machine_equipment'=> 'Compressor C-301 (Atlas Copco GA-110)',
                'energy_sources'   => json_encode(['electrical', 'pneumatic']),
                'isolation_steps'  => json_encode([
                    ['step' => 1, 'desc' => 'Matikan compressor dari DCS/panel kontrol'],
                    ['step' => 2, 'desc' => 'Buka & kunci breaker MC-C301 di MCC Room'],
                    ['step' => 3, 'desc' => 'Tutup valve udara outlet V-C301-01 & pasang lock'],
                    ['step' => 4, 'desc' => 'Bleed sisa tekanan melalui drain valve DV-C301'],
                    ['step' => 5, 'desc' => 'Verifikasi zero energy: coba start dari panel (harus gagal)'],
                    ['step' => 6, 'desc' => 'Cek pressure gauge: harus 0 bar'],
                ]),
                'restoration_steps'=> json_encode([
                    ['step' => 1, 'desc' => 'Pastikan semua pekerja keluar dari area compressor'],
                    ['step' => 2, 'desc' => 'Lepas lock dari drain valve DV-C301, tutup valve'],
                    ['step' => 3, 'desc' => 'Lepas lock dari valve V-C301-01, buka valve'],
                    ['step' => 4, 'desc' => 'Lepas lock dari breaker MC-C301, ON-kan breaker'],
                    ['step' => 5, 'desc' => 'Start compressor dari DCS, monitor 30 menit'],
                ]),
                'prepared_by'  => 'Rudi Irawan',
                'reviewed_by'  => 'Andi Setiawan',
                'approved_by'  => 'Fitri Handayani',
                'status'       => 'active',
                'effective_date'=> '2026-02-25',
                'review_date'  => '2027-02-25',
            ],
            [
                'procedure_number' => 'LOTO-2026-002',
                'title'            => 'LOTO Electrical Substation - Transformer Maintenance',
                'description'      => 'Prosedur LOTO untuk isolasi transformer utama 20kV/380V di Electrical Substation untuk kegiatan thermography dan tightening connection.',
                'work_area_id'     => $workAreaIds['WA-ELS-01'],
                'work_permit_id'   => null,
                'machine_equipment'=> 'Transformer TR-01 (20kV/380V, 1000kVA)',
                'energy_sources'   => json_encode(['electrical']),
                'isolation_steps'  => json_encode([
                    ['step' => 1, 'desc' => 'Koordinasi dengan dispatcher PLN untuk de-energize incoming 20kV'],
                    ['step' => 2, 'desc' => 'Buka circuit breaker CB-01 di incoming panel 20kV'],
                    ['step' => 3, 'desc' => 'Pasang lock & tag pada CB-01'],
                    ['step' => 4, 'desc' => 'Verifikasi dead: test dengan voltage detector ≤ 50V'],
                    ['step' => 5, 'desc' => 'Pasang grounding set pada busbar sisi 20kV & 380V'],
                ]),
                'restoration_steps'=> json_encode([
                    ['step' => 1, 'desc' => 'Lepas grounding set'],
                    ['step' => 2, 'desc' => 'Lepas lock & tag dari CB-01'],
                    ['step' => 3, 'desc' => 'Tutup CB-01'],
                    ['step' => 4, 'desc' => 'Koordinasi dengan PLN untuk re-energize'],
                    ['step' => 5, 'desc' => 'Monitor transformer 1 jam: suhu, suara, beban'],
                ]),
                'prepared_by'  => 'Dewi Anggraini',
                'reviewed_by'  => 'Rudi Irawan',
                'approved_by'  => null,
                'status'       => 'under_review',
                'effective_date'=> null,
                'review_date'  => null,
            ],
            [
                'procedure_number' => 'LOTO-2026-003',
                'title'            => 'LOTO Hydraulic Press HP-01 - Seal Replacement',
                'description'      => 'Prosedur LOTO untuk isolasi mesin hydraulic press HP-01 saat penggantian seal cylinder.',
                'work_area_id'     => $workAreaIds['WA-WKS-01'],
                'work_permit_id'   => null,
                'machine_equipment'=> 'Hydraulic Press HP-01 (100 Ton)',
                'energy_sources'   => json_encode(['electrical', 'hydraulic']),
                'isolation_steps'  => json_encode([
                    ['step' => 1, 'desc' => 'Matikan mesin dari panel lokal'],
                    ['step' => 2, 'desc' => 'Buka & kunci breaker MC-HP01 di panel distribusi'],
                    ['step' => 3, 'desc' => 'Tutup valve supply hydraulic oil V-HP01-01 & pasang lock'],
                    ['step' => 4, 'desc' => 'Bleed tekanan hydraulic melalui needle valve NV-HP01'],
                    ['step' => 5, 'desc' => 'Block ram dengan mechanical block/stand'],
                    ['step' => 6, 'desc' => 'Verifikasi: coba start dari panel, cek pressure gauge 0'],
                ]),
                'restoration_steps'=> null,
                'prepared_by'  => 'Rudi Irawan',
                'reviewed_by'  => null,
                'approved_by'  => null,
                'status'       => 'draft',
                'effective_date'=> null,
                'review_date'  => null,
            ],
        ];

        foreach ($procedures as $p) {
            DB::table('loto_procedures')->insert(array_merge($p, [
                'document_path' => null,
                'created_at'    => $now,
                'updated_at'    => $now,
            ]));
        }

        // ── LOTO Points for active procedure LOTO-2026-001 ──
        $procIds = DB::table('loto_procedures')->pluck('id', 'procedure_number');
        $procId  = $procIds['LOTO-2026-001'];

        $points = [
            [
                'sequence_order'           => 1,
                'point_name'               => 'Breaker MC-C301 (MCC Room)',
                'energy_type'              => 'electrical',
                'location_description'     => 'MCC Room, Panel B, Row 3, Slot 12',
                'isolation_device'         => 'Circuit breaker',
                'isolation_method'         => 'lock',
                'verification_method'      => 'Try start dari panel',
                'qr_code'                  => 'QR-LOTO-C301-PT01',
                'nfc_tag_id'               => 'NFC-LOTO-C301-PT01',
                'requires_double_isolation'=> false,
            ],
            [
                'sequence_order'           => 2,
                'point_name'               => 'Valve V-C301-01 (Outlet Air)',
                'energy_type'              => 'pneumatic',
                'location_description'     => 'Compressor C-301, outlet header, elevation +2m',
                'isolation_device'         => 'Ball valve 2"',
                'isolation_method'         => 'lock',
                'verification_method'      => 'Pressure gauge reading',
                'qr_code'                  => 'QR-LOTO-C301-PT02',
                'nfc_tag_id'               => 'NFC-LOTO-C301-PT02',
                'requires_double_isolation'=> false,
            ],
            [
                'sequence_order'           => 3,
                'point_name'               => 'Drain Valve DV-C301 (Pressure Bleed)',
                'energy_type'              => 'pneumatic',
                'location_description'     => 'Compressor C-301, bottom drain, elevation 0m',
                'isolation_device'         => 'Needle valve 1/2"',
                'isolation_method'         => 'tag',
                'verification_method'      => 'Pressure gauge zero',
                'qr_code'                  => 'QR-LOTO-C301-PT03',
                'nfc_tag_id'               => null,
                'requires_double_isolation'=> false,
            ],
        ];

        foreach ($points as $pt) {
            DB::table('loto_points')->insert(array_merge($pt, [
                'loto_procedure_id' => $procId,
                'photo_path'        => null,
                'created_at'        => $now,
                'updated_at'        => $now,
            ]));
        }

        // ── LOTO Points for LOTO-2026-002 (Electrical Substation) ──
        $procId2 = $procIds['LOTO-2026-002'];

        $points2 = [
            [
                'sequence_order'           => 1,
                'point_name'               => 'Circuit Breaker CB-01 (Incoming 20kV)',
                'energy_type'              => 'electrical',
                'location_description'     => 'Electrical Substation, incoming panel 20kV',
                'isolation_device'         => 'VCB 20kV',
                'isolation_method'         => 'lock',
                'verification_method'      => 'Voltage detector test',
                'qr_code'                  => 'QR-LOTO-TR01-PT01',
                'nfc_tag_id'               => 'NFC-LOTO-TR01-PT01',
                'requires_double_isolation'=> true,
            ],
            [
                'sequence_order'           => 2,
                'point_name'               => 'Grounding Set Sisi 20kV',
                'energy_type'              => 'electrical',
                'location_description'     => 'Electrical Substation, busbar 20kV',
                'isolation_device'         => 'Portable grounding set',
                'isolation_method'         => 'block',
                'verification_method'      => 'Visual inspection & voltage test',
                'qr_code'                  => 'QR-LOTO-TR01-PT02',
                'nfc_tag_id'               => null,
                'requires_double_isolation'=> false,
            ],
        ];

        foreach ($points2 as $pt) {
            DB::table('loto_points')->insert(array_merge($pt, [
                'loto_procedure_id' => $procId2,
                'photo_path'        => null,
                'created_at'        => $now,
                'updated_at'        => $now,
            ]));
        }

        // ── LOTO Locks for active procedure LOTO-2026-001 (all locked — PM completed, then unlocked) ──
        $pointIds = DB::table('loto_points')
            ->where('loto_procedure_id', $procId)
            ->pluck('id', 'point_name');

        $locks = [
            [
                'point_name'    => 'Breaker MC-C301 (MCC Room)',
                'lock_number'   => 'LCK-RED-001',
                'tag_number'    => 'TAG-C301-001',
                'locked_by'     => 'EMP-012',
                'locked_at'     => Carbon::today()->subDays(5)->setHour(6)->setMinute(45),
                'unlocked_at'   => Carbon::today()->subDays(5)->setHour(16)->setMinute(0),
                'unlocked_by'   => 'EMP-012',
                'status'        => 'unlocked',
            ],
            [
                'point_name'    => 'Valve V-C301-01 (Outlet Air)',
                'lock_number'   => 'LCK-RED-002',
                'tag_number'    => 'TAG-C301-002',
                'locked_by'     => 'EMP-012',
                'locked_at'     => Carbon::today()->subDays(5)->setHour(6)->setMinute(50),
                'unlocked_at'   => Carbon::today()->subDays(5)->setHour(16)->setMinute(5),
                'unlocked_by'   => 'EMP-012',
                'status'        => 'unlocked',
            ],
            [
                'point_name'    => 'Drain Valve DV-C301 (Pressure Bleed)',
                'lock_number'   => 'LCK-RED-003',
                'tag_number'    => 'TAG-C301-003',
                'locked_by'     => 'EMP-012',
                'locked_at'     => Carbon::today()->subDays(5)->setHour(6)->setMinute(55),
                'unlocked_at'   => Carbon::today()->subDays(5)->setHour(16)->setMinute(10),
                'unlocked_by'   => 'EMP-012',
                'status'        => 'unlocked',
            ],
        ];

        foreach ($locks as $lk) {
            $ptId = $pointIds[$lk['point_name']] ?? null;
            if (!$ptId) continue;

            $lockedById   = $personnelIds[$lk['locked_by']] ?? null;
            $unlockedById = $personnelIds[$lk['unlocked_by']] ?? null;

            DB::table('loto_locks')->insert([
                'loto_procedure_id'     => $procId,
                'loto_point_id'         => $ptId,
                'work_permit_id'        => $permitIds['WP-2026-02-0015'],
                'lock_number'           => $lk['lock_number'],
                'tag_number'            => $lk['tag_number'],
                'locked_by_id'          => $lockedById,
                'locked_by_name'        => DB::table('personnel')->where('employee_id', $lk['locked_by'])->value('name') ?? '',
                'locked_at'             => $lk['locked_at'],
                'unlocked_at'           => $lk['unlocked_at'],
                'unlocked_by_name'      => $lk['unlocked_by'] ? (DB::table('personnel')->where('employee_id', $lk['unlocked_by'])->value('name')) : null,
                'unlocked_by_id'        => $unlockedById,
                'status'                => $lk['status'],
                'force_remove_reason'   => null,
                'force_remove_authorized_by' => null,
                'created_at'            => $now,
                'updated_at'            => $now,
            ]);
        }

        // ── LOTO Verifications ──
        foreach ($locks as $lk) {
            $ptId = $pointIds[$lk['point_name']] ?? null;
            if (!$ptId) continue;

            DB::table('loto_verifications')->insert([
                'loto_procedure_id' => $procId,
                'loto_point_id'     => $ptId,
                'work_permit_id'    => $permitIds['WP-2026-02-0015'],
                'verified_by_name'  => 'Andi Setiawan',
                'verified_by_id'    => $personnelIds['EMP-002'],
                'verified_at'       => $lk['locked_at']->copy()->addMinutes(15),
                'verification_result'=> 'isolated',
                'remarks'           => 'Zero energy confirmed.',
                'method_used'       => $lk['point_name'] === 'Breaker MC-C301 (MCC Room)' ? 'try_start' : 'gauge_reading',
                'readings'          => json_encode($lk['point_name'] === 'Breaker MC-C301 (MCC Room)' ? ['result' => 'Motor did not start'] : ['pressure' => '0 bar']),
                'photo_evidence_path'=> null,
                'created_at'        => $now,
                'updated_at'        => $now,
            ]);
        }
    }
}
