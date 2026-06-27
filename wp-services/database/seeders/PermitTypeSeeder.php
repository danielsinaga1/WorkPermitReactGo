<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class PermitTypeSeeder extends Seeder
{
    public function run(): void
    {
        $now = Carbon::now();

        $types = [
            [
                'code'                      => 'PLANT',
                'name'                      => 'Plant Work Permit',
                'description'               => 'Izin kerja umum di area plant/proses. Berlaku untuk kegiatan perawatan rutin, inspeksi, dan pekerjaan umum di dalam area operasi.',
                'required_qualifications'   => json_encode(['safety_induction']),
                'required_equipment_certs'  => json_encode([]),
                'risk_checklist_template'   => json_encode([
                    'Area aman dari sumber ignisi',
                    'APD lengkap sesuai risiko',
                    'Pekerja memahami prosedur darurat',
                    'Jalur evakuasi teridentifikasi',
                ]),
                'workflow_stages'           => json_encode([
                    ['stage_order' => 1, 'stage_name' => 'Review Supervisor', 'stage_type' => 'review', 'approver_role' => 'supervisor'],
                    ['stage_order' => 2, 'stage_name' => 'Approval Safety Officer', 'stage_type' => 'approval', 'approver_role' => 'safety_officer'],
                    ['stage_order' => 3, 'stage_name' => 'Sign-off Area Authority', 'stage_type' => 'sign_off', 'approver_role' => 'area_authority'],
                ]),
                'max_duration_hours'        => 12,
                'color_code'                => '#3B82F6',
                'icon'                      => 'pi-wrench',
                'is_active'                 => true,
            ],
            [
                'code'                      => 'NON_PLANT',
                'name'                      => 'Non-Plant Work Permit',
                'description'               => 'Izin kerja di luar area proses/plant, seperti area gudang, kantor, atau area terbuka.',
                'required_qualifications'   => json_encode(['safety_induction']),
                'required_equipment_certs'  => json_encode([]),
                'risk_checklist_template'   => json_encode([
                    'Area kerja dipasang barikade',
                    'APD minimum digunakan',
                    'Pekerja telah safety induction',
                ]),
                'workflow_stages'           => json_encode([
                    ['stage_order' => 1, 'stage_name' => 'Review Supervisor', 'stage_type' => 'review', 'approver_role' => 'supervisor'],
                    ['stage_order' => 2, 'stage_name' => 'Approval HSE', 'stage_type' => 'approval', 'approver_role' => 'safety_officer'],
                ]),
                'max_duration_hours'        => 24,
                'color_code'                => '#10B981',
                'icon'                      => 'pi-building',
                'is_active'                 => true,
            ],
            [
                'code'                      => 'HOT_WORK',
                'name'                      => 'Hot Work Permit',
                'description'               => 'Izin kerja panas: pengelasan, pemotongan, grinding, atau kegiatan yang menghasilkan percikan api.',
                'required_qualifications'   => json_encode(['safety_induction', 'hot_work']),
                'required_equipment_certs'  => json_encode(['SIO']),
                'risk_checklist_template'   => json_encode([
                    'Gas test sebelum kerja: LEL < 10%',
                    'Fire blanket/screen terpasang',
                    'APAR tersedia dalam jangkauan 10m',
                    'Fire watcher ditunjuk',
                    'Material mudah terbakar di-cover/dipindahkan',
                    'Gas test kontinyu selama kerja',
                    'Monitoring 30 menit setelah selesai',
                ]),
                'workflow_stages'           => json_encode([
                    ['stage_order' => 1, 'stage_name' => 'Gas Test Initial', 'stage_type' => 'verification', 'approver_role' => 'gas_tester'],
                    ['stage_order' => 2, 'stage_name' => 'Review Supervisor', 'stage_type' => 'review', 'approver_role' => 'supervisor'],
                    ['stage_order' => 3, 'stage_name' => 'Approval Safety Officer', 'stage_type' => 'approval', 'approver_role' => 'safety_officer'],
                    ['stage_order' => 4, 'stage_name' => 'Approval Area Authority', 'stage_type' => 'approval', 'approver_role' => 'area_authority'],
                    ['stage_order' => 5, 'stage_name' => 'Sign-off Operations Mgr', 'stage_type' => 'sign_off', 'approver_role' => 'operations_manager'],
                ]),
                'max_duration_hours'        => 8,
                'color_code'                => '#EF4444',
                'icon'                      => 'pi-bolt',
                'is_active'                 => true,
            ],
            [
                'code'                      => 'CONFINED_SPACE',
                'name'                      => 'Confined Space Entry Permit',
                'description'               => 'Izin masuk ruang terbatas: vessel, tangki, silo, manhole, atau ruang dengan ventilasi terbatas.',
                'required_qualifications'   => json_encode(['safety_induction', 'confined_space_entry', 'gas_tester']),
                'required_equipment_certs'  => json_encode(['calibration']),
                'risk_checklist_template'   => json_encode([
                    'Gas test: O2 19.5%-23.5%, LEL < 10%, H2S < 10ppm, CO < 25ppm',
                    'Ventilasi mekanis terpasang & berjalan',
                    'Standby man ditunjuk',
                    'Alat komunikasi tersedia',
                    'Rescue equipment siap di entry point',
                    'Entrant menggunakan harness & lifeline',
                    'Gas test kontinyu selama kerja',
                    'Emergency rescue plan reviewed',
                ]),
                'workflow_stages'           => json_encode([
                    ['stage_order' => 1, 'stage_name' => 'Gas Test Initial', 'stage_type' => 'verification', 'approver_role' => 'gas_tester'],
                    ['stage_order' => 2, 'stage_name' => 'Review Supervisor', 'stage_type' => 'review', 'approver_role' => 'supervisor'],
                    ['stage_order' => 3, 'stage_name' => 'Approval Safety Officer', 'stage_type' => 'approval', 'approver_role' => 'safety_officer'],
                    ['stage_order' => 4, 'stage_name' => 'Approval Area Authority', 'stage_type' => 'approval', 'approver_role' => 'area_authority'],
                    ['stage_order' => 5, 'stage_name' => 'Approval Ops Manager', 'stage_type' => 'approval', 'approver_role' => 'operations_manager'],
                    ['stage_order' => 6, 'stage_name' => 'Sign-off Plant Manager', 'stage_type' => 'sign_off', 'approver_role' => 'plant_manager'],
                ]),
                'max_duration_hours'        => 8,
                'color_code'                => '#F59E0B',
                'icon'                      => 'pi-box',
                'is_active'                 => true,
            ],
            [
                'code'                      => 'EXCAVATION',
                'name'                      => 'Excavation Permit',
                'description'               => 'Izin penggalian tanah/beton. Wajib verifikasi underground utility sebelum penggalian.',
                'required_qualifications'   => json_encode(['safety_induction']),
                'required_equipment_certs'  => json_encode(['SIA']),
                'risk_checklist_template'   => json_encode([
                    'Underground utility survey selesai',
                    'Marking area gali terpasang',
                    'Barikade pengaman terpasang',
                    'Shoring/sloping sesuai kedalaman',
                    'Access/egress aman tersedia',
                    'Penangkal petir untuk kedalaman > 1.5m',
                ]),
                'workflow_stages'           => json_encode([
                    ['stage_order' => 1, 'stage_name' => 'Utility Survey', 'stage_type' => 'verification', 'approver_role' => 'engineer'],
                    ['stage_order' => 2, 'stage_name' => 'Review Supervisor', 'stage_type' => 'review', 'approver_role' => 'supervisor'],
                    ['stage_order' => 3, 'stage_name' => 'Approval Safety Officer', 'stage_type' => 'approval', 'approver_role' => 'safety_officer'],
                    ['stage_order' => 4, 'stage_name' => 'Approval Area Authority', 'stage_type' => 'approval', 'approver_role' => 'area_authority'],
                ]),
                'max_duration_hours'        => 24,
                'color_code'                => '#8B5CF6',
                'icon'                      => 'pi-map',
                'is_active'                 => true,
            ],
            [
                'code'                      => 'DIVING',
                'name'                      => 'Diving Operations Permit',
                'description'               => 'Izin operasi penyelaman untuk inspeksi bawah air, perbaikan jetty, atau kegiatan konstruksi bawah air.',
                'required_qualifications'   => json_encode(['safety_induction', 'diving_cert']),
                'required_equipment_certs'  => json_encode([]),
                'risk_checklist_template'   => json_encode([
                    'Diving medical check valid',
                    'Emergency decompression plan',
                    'Communication system tested',
                    'Standby diver ready',
                    'Weather & sea condition checked',
                ]),
                'workflow_stages'           => json_encode([
                    ['stage_order' => 1, 'stage_name' => 'Medical Check', 'stage_type' => 'verification', 'approver_role' => 'medic'],
                    ['stage_order' => 2, 'stage_name' => 'Review Dive Supervisor', 'stage_type' => 'review', 'approver_role' => 'dive_supervisor'],
                    ['stage_order' => 3, 'stage_name' => 'Approval HSE', 'stage_type' => 'approval', 'approver_role' => 'safety_officer'],
                    ['stage_order' => 4, 'stage_name' => 'Sign-off Marine Ops Mgr', 'stage_type' => 'sign_off', 'approver_role' => 'marine_manager'],
                ]),
                'max_duration_hours'        => 8,
                'color_code'                => '#06B6D4',
                'icon'                      => 'pi-compass',
                'is_active'                 => true,
            ],
            [
                'code'                      => 'LIFTING',
                'name'                      => 'Lifting Operations Permit',
                'description'               => 'Izin operasi pengangkatan menggunakan crane, chain block, atau alat angkat lainnya.',
                'required_qualifications'   => json_encode(['safety_induction', 'rigging_cert']),
                'required_equipment_certs'  => json_encode(['SIA', 'load_test']),
                'risk_checklist_template'   => json_encode([
                    'Lifting plan tersedia & disetujui',
                    'Load chart diverifikasi',
                    'Sling/shackle inspected',
                    'Area di bawah load diberi barikade',
                    'Wind speed < 30 km/h',
                    'Operator memiliki SIO valid',
                    'Rigger bersertifikat tersedia',
                ]),
                'workflow_stages'           => json_encode([
                    ['stage_order' => 1, 'stage_name' => 'Equipment Inspection', 'stage_type' => 'verification', 'approver_role' => 'inspector'],
                    ['stage_order' => 2, 'stage_name' => 'Review Lifting Supervisor', 'stage_type' => 'review', 'approver_role' => 'supervisor'],
                    ['stage_order' => 3, 'stage_name' => 'Approval Safety Officer', 'stage_type' => 'approval', 'approver_role' => 'safety_officer'],
                    ['stage_order' => 4, 'stage_name' => 'Approval Area Authority', 'stage_type' => 'approval', 'approver_role' => 'area_authority'],
                ]),
                'max_duration_hours'        => 12,
                'color_code'                => '#F97316',
                'icon'                      => 'pi-arrows-v',
                'is_active'                 => true,
            ],
            [
                'code'                      => 'WORK_AT_HEIGHT',
                'name'                      => 'Work at Height Permit',
                'description'               => 'Izin kerja di ketinggian > 1.8 meter dari permukaan dasar. Termasuk scaffolding, atap, dan struktur tinggi.',
                'required_qualifications'   => json_encode(['safety_induction', 'working_at_height']),
                'required_equipment_certs'  => json_encode([]),
                'risk_checklist_template'   => json_encode([
                    'Fall protection system terpasang (harness, lifeline)',
                    'Scaffolding telah di-inspect & ber-tag hijau',
                    'Guardrails/toe boards terpasang',
                    'Weather check: angin < 40 km/h',
                    'Tool tether digunakan',
                    'Rescue plan tersedia',
                    'Pekerja fit to work (tidak pusing/mabuk)',
                ]),
                'workflow_stages'           => json_encode([
                    ['stage_order' => 1, 'stage_name' => 'Scaffold Inspection', 'stage_type' => 'verification', 'approver_role' => 'scaffold_inspector'],
                    ['stage_order' => 2, 'stage_name' => 'Review Supervisor', 'stage_type' => 'review', 'approver_role' => 'supervisor'],
                    ['stage_order' => 3, 'stage_name' => 'Approval Safety Officer', 'stage_type' => 'approval', 'approver_role' => 'safety_officer'],
                    ['stage_order' => 4, 'stage_name' => 'Sign-off Area Authority', 'stage_type' => 'sign_off', 'approver_role' => 'area_authority'],
                ]),
                'max_duration_hours'        => 8,
                'color_code'                => '#EC4899',
                'icon'                      => 'pi-arrow-up',
                'is_active'                 => true,
            ],
        ];

        foreach ($types as $type) {
            DB::table('permit_types')->insert(array_merge($type, [
                'created_at' => $now,
                'updated_at' => $now,
            ]));
        }
    }
}
