<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class PermitRiskAssessmentSeeder extends Seeder
{
    public function run(): void
    {
        $now = Carbon::now();

        $permitIds    = DB::table('work_permits')->pluck('id', 'permit_number');
        $personnelIds = DB::table('personnel')->pluck('id', 'employee_id');

        $assessments = [
            // ── Hot Work WP-2026-03-0001 ──
            ['permit' => 'WP-2026-03-0001', 'hazard' => 'Percikan api mengenai material mudah terbakar',     'cat' => 'physical',    'L' => 3, 'S' => 5, 'level' => 'high',    'control' => 'Fire blanket, fire watcher, APAR 5m, hapus combustible material dalam radius 10m.',       'by' => 'Andi Setiawan'],
            ['permit' => 'WP-2026-03-0001', 'hazard' => 'Paparan asap las (welding fume)',                   'cat' => 'chemical',    'L' => 4, 'S' => 3, 'level' => 'high',    'control' => 'Ventilasi mekanis lokal (LEV), masker respirator dengan filter P3.',                       'by' => 'Andi Setiawan'],
            ['permit' => 'WP-2026-03-0001', 'hazard' => 'Sengatan listrik dari mesin las',                   'cat' => 'physical',    'L' => 2, 'S' => 4, 'level' => 'medium',  'control' => 'Grounding proper, kabel isolasi baik, sarung tangan kulit kering.',                        'by' => 'Andi Setiawan'],
            ['permit' => 'WP-2026-03-0001', 'hazard' => 'Radiasi UV dari busur las',                        'cat' => 'physical',    'L' => 4, 'S' => 2, 'level' => 'medium',  'control' => 'Kacamata las DIN 11, welding screen, warning sign.',                                       'by' => 'Andi Setiawan'],

            // ── Confined Space WP-2026-03-0002 ──
            ['permit' => 'WP-2026-03-0002', 'hazard' => 'Kekurangan oksigen di dalam vessel',                'cat' => 'chemical',    'L' => 3, 'S' => 5, 'level' => 'high',    'control' => 'Continuous O2 monitoring, ventilasi mekanis, SCBA standby.',                               'by' => 'Fitri Handayani'],
            ['permit' => 'WP-2026-03-0002', 'hazard' => 'Terjebak di ruang terbatas (engulfment)',           'cat' => 'physical',    'L' => 2, 'S' => 5, 'level' => 'high',    'control' => 'Standby man, rescue tripod & winch, harness & lifeline.',                                  'by' => 'Fitri Handayani'],
            ['permit' => 'WP-2026-03-0002', 'hazard' => 'Paparan gas beracun H2S residual',                  'cat' => 'chemical',    'L' => 2, 'S' => 5, 'level' => 'high',    'control' => 'Gas test H2S < 10ppm, personal gas monitor, SCBA ready.',                                  'by' => 'Fitri Handayani'],
            ['permit' => 'WP-2026-03-0002', 'hazard' => 'Jatuh saat masuk/keluar manhole',                   'cat' => 'ergonomic',   'L' => 3, 'S' => 3, 'level' => 'medium',  'control' => 'Tangga internal, handrail, harness attached.',                                              'by' => 'Fitri Handayani'],

            // ── Lifting WP-2026-03-0003 ──
            ['permit' => 'WP-2026-03-0003', 'hazard' => 'Beban jatuh saat lifting',                         'cat' => 'mechanical',  'L' => 2, 'S' => 5, 'level' => 'high',    'control' => 'Sling/shackle inspected, load chart verified, exclusion zone 15m, rigger certified.',       'by' => 'Andi Setiawan'],
            ['permit' => 'WP-2026-03-0003', 'hazard' => 'Crane terbalik (overturning)',                     'cat' => 'mechanical',  'L' => 1, 'S' => 5, 'level' => 'medium',  'control' => 'Ground bearing capacity checked, outrigger pads, no lift > 80% SWL.',                       'by' => 'Andi Setiawan'],

            // ── Work at Height WP-2026-03-0004 ──
            ['permit' => 'WP-2026-03-0004', 'hazard' => 'Jatuh dari ketinggian saat erection scaffolding', 'cat' => 'physical',    'L' => 3, 'S' => 5, 'level' => 'high',    'control' => 'Full body harness, double lanyard, scaffolder certified, toeboard & guardrail.',            'by' => 'Andi Setiawan'],
            ['permit' => 'WP-2026-03-0004', 'hazard' => 'Material scaffolding jatuh menimpa pekerja',      'cat' => 'mechanical',  'L' => 3, 'S' => 4, 'level' => 'high',    'control' => 'Exclusion zone bawah, tool tether, barricade, spotter.',                                    'by' => 'Andi Setiawan'],
        ];

        foreach ($assessments as $a) {
            $pid = $permitIds[$a['permit']] ?? null;
            if (!$pid) continue;

            DB::table('permit_risk_assessments')->insert([
                'work_permit_id'     => $pid,
                'hazard_description' => $a['hazard'],
                'hazard_category'    => $a['cat'],
                'likelihood'         => $a['L'],
                'severity'           => $a['S'],
                // risk_score is virtual: L * S
                'risk_level'         => $a['level'],
                'control_measures'   => $a['control'],
                'residual_risk'      => null,
                'assessed_by'        => $a['by'],
                'assessed_at'        => $now->copy()->subDays(rand(1, 5)),
                'created_at'         => $now,
                'updated_at'         => $now,
            ]);
        }
    }
}
