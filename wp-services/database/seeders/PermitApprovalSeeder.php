<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class PermitApprovalSeeder extends Seeder
{
    public function run(): void
    {
        $now = Carbon::now();

        $permitIds    = DB::table('work_permits')->pluck('id', 'permit_number');
        $personnelIds = DB::table('personnel')->pluck('id', 'employee_id');

        // ── Hot Work WP-2026-03-0001 (active — all approved) ──
        $hwPermit = $permitIds['WP-2026-03-0001'];
        $hwStages = [
            ['stage' => 1, 'name' => 'Gas Test Initial',          'type' => 'verification', 'role' => 'gas_tester',         'approver' => 'EMP-006', 'decision' => 'approved', 'remarks' => 'LEL 0%, O2 20.9%, H2S 0 ppm. Area aman untuk hot work.'],
            ['stage' => 2, 'name' => 'Review Supervisor',         'type' => 'review',       'role' => 'supervisor',          'approver' => 'EMP-001', 'decision' => 'approved', 'remarks' => 'Prosedur las sesuai WPS. Lanjut.'],
            ['stage' => 3, 'name' => 'Approval Safety Officer',   'type' => 'approval',     'role' => 'safety_officer',      'approver' => 'EMP-002', 'decision' => 'approved', 'remarks' => 'APD & fire prevention OK.'],
            ['stage' => 4, 'name' => 'Approval Area Authority',   'type' => 'approval',     'role' => 'area_authority',      'approver' => 'EMP-001', 'decision' => 'approved', 'remarks' => 'Area cleared.'],
            ['stage' => 5, 'name' => 'Sign-off Operations Mgr',   'type' => 'sign_off',     'role' => 'operations_manager',  'approver' => 'EMP-010', 'decision' => 'approved', 'remarks' => 'Disetujui. Pastikan monitoring gas test kontinyu.'],
        ];

        foreach ($hwStages as $s) {
            DB::table('permit_approvals')->insert([
                'work_permit_id' => $hwPermit,
                'stage_order'    => $s['stage'],
                'stage_name'     => $s['name'],
                'stage_type'     => $s['type'],
                'approver_role'  => $s['role'],
                'approver_id'    => $personnelIds[$s['approver']] ?? null,
                'approver_name'  => DB::table('personnel')->where('employee_id', $s['approver'])->value('name'),
                'decision'       => $s['decision'],
                'remarks'        => $s['remarks'],
                'conditions'     => null,
                'signature_path' => null,
                'decided_at'     => Carbon::today()->subHours(rand(2, 8)),
                'deadline_at'    => null,
                'created_at'     => $now,
                'updated_at'     => $now,
            ]);
        }

        // ── Confined Space WP-2026-03-0002 (approved — all approved) ──
        $csPermit = $permitIds['WP-2026-03-0002'];
        $csStages = [
            ['stage' => 1, 'name' => 'Gas Test Initial',          'type' => 'verification', 'role' => 'gas_tester',        'approver' => 'EMP-006', 'decision' => 'approved', 'remarks' => 'O2 20.9%, LEL 0%, H2S 0, CO 2 ppm. Aman.'],
            ['stage' => 2, 'name' => 'Review Supervisor',         'type' => 'review',       'role' => 'supervisor',         'approver' => 'EMP-001', 'decision' => 'approved', 'remarks' => 'Vessel sudah di-blind. Ventilasi 48 jam.'],
            ['stage' => 3, 'name' => 'Approval Safety Officer',   'type' => 'approval',     'role' => 'safety_officer',     'approver' => 'EMP-002', 'decision' => 'approved', 'remarks' => 'Rescue plan adequate.'],
            ['stage' => 4, 'name' => 'Approval Area Authority',   'type' => 'approval',     'role' => 'area_authority',     'approver' => 'EMP-001', 'decision' => 'approved', 'remarks' => 'Cleared.'],
            ['stage' => 5, 'name' => 'Approval Ops Manager',      'type' => 'approval',     'role' => 'operations_manager', 'approver' => 'EMP-010', 'decision' => 'approved', 'remarks' => 'OK.'],
            ['stage' => 6, 'name' => 'Sign-off Plant Manager',    'type' => 'sign_off',     'role' => 'plant_manager',      'approver' => 'EMP-010', 'decision' => 'approved', 'remarks' => 'Disetujui. Maksimal 2 orang di dalam.'],
        ];

        foreach ($csStages as $s) {
            DB::table('permit_approvals')->insert([
                'work_permit_id' => $csPermit,
                'stage_order'    => $s['stage'],
                'stage_name'     => $s['name'],
                'stage_type'     => $s['type'],
                'approver_role'  => $s['role'],
                'approver_id'    => $personnelIds[$s['approver']] ?? null,
                'approver_name'  => DB::table('personnel')->where('employee_id', $s['approver'])->value('name'),
                'decision'       => $s['decision'],
                'remarks'        => $s['remarks'],
                'conditions'     => null,
                'signature_path' => null,
                'decided_at'     => Carbon::yesterday()->subHours(rand(1, 8)),
                'deadline_at'    => null,
                'created_at'     => $now,
                'updated_at'     => $now,
            ]);
        }

        // ── Submitted Work at Height WP-2026-03-0004 (stage 1 pending) ──
        $wahPermit = $permitIds['WP-2026-03-0004'];
        $wahStages = [
            ['stage' => 1, 'name' => 'Scaffold Inspection',       'type' => 'verification', 'role' => 'scaffold_inspector', 'decision' => 'pending', 'remarks' => null],
            ['stage' => 2, 'name' => 'Review Supervisor',         'type' => 'review',       'role' => 'supervisor',          'decision' => 'pending', 'remarks' => null],
            ['stage' => 3, 'name' => 'Approval Safety Officer',   'type' => 'approval',     'role' => 'safety_officer',      'decision' => 'pending', 'remarks' => null],
            ['stage' => 4, 'name' => 'Sign-off Area Authority',   'type' => 'sign_off',     'role' => 'area_authority',      'decision' => 'pending', 'remarks' => null],
        ];

        foreach ($wahStages as $s) {
            DB::table('permit_approvals')->insert([
                'work_permit_id' => $wahPermit,
                'stage_order'    => $s['stage'],
                'stage_name'     => $s['name'],
                'stage_type'     => $s['type'],
                'approver_role'  => $s['role'],
                'approver_id'    => null,
                'approver_name'  => null,
                'decision'       => $s['decision'],
                'remarks'        => $s['remarks'],
                'conditions'     => null,
                'signature_path' => null,
                'decided_at'     => null,
                'deadline_at'    => null,
                'created_at'     => $now,
                'updated_at'     => $now,
            ]);
        }

        // ── Rejected Hot Work WP-2026-02-0020 (rejected at stage 3) ──
        $rejPermit = $permitIds['WP-2026-02-0020'];
        $rejStages = [
            ['stage' => 1, 'name' => 'Gas Test Initial',          'type' => 'verification', 'role' => 'gas_tester',     'approver' => 'EMP-006', 'decision' => 'approved', 'remarks' => 'LEL 5%. Marginal tapi masih di bawah 10%.'],
            ['stage' => 2, 'name' => 'Review Supervisor',         'type' => 'review',       'role' => 'supervisor',      'approver' => 'EMP-001', 'decision' => 'approved', 'remarks' => 'Conditional. LEL harus monitor ketat.'],
            ['stage' => 3, 'name' => 'Approval Safety Officer',   'type' => 'approval',     'role' => 'safety_officer',  'approver' => 'EMP-002', 'decision' => 'rejected', 'remarks' => 'DITOLAK. Area tangki masih operasional. Terlalu berisiko untuk hot work.'],
        ];

        foreach ($rejStages as $s) {
            DB::table('permit_approvals')->insert([
                'work_permit_id' => $rejPermit,
                'stage_order'    => $s['stage'],
                'stage_name'     => $s['name'],
                'stage_type'     => $s['type'],
                'approver_role'  => $s['role'],
                'approver_id'    => $personnelIds[$s['approver']] ?? null,
                'approver_name'  => DB::table('personnel')->where('employee_id', $s['approver'])->value('name'),
                'decision'       => $s['decision'],
                'remarks'        => $s['remarks'],
                'conditions'     => null,
                'signature_path' => null,
                'decided_at'     => Carbon::today()->subDays(3)->subHours(rand(1, 6)),
                'deadline_at'    => null,
                'created_at'     => $now,
                'updated_at'     => $now,
            ]);
        }
    }
}
