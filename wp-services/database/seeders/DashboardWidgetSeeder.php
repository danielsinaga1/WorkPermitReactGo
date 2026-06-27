<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class DashboardWidgetSeeder extends Seeder
{
    public function run(): void
    {
        $now = Carbon::now();

        $widgets = [
            // ── Row 1: Stat cards ──
            [
                'widget_key'  => 'stat_active_permits',
                'title'       => 'Work Permit Aktif',
                'widget_type' => 'stat_card',
                'data_source' => '/api/wp/dashboard/stats/active-permits',
                'config'      => json_encode([
                    'icon'   => 'ClipboardDocumentCheckIcon',
                    'color'  => '#2563EB',
                    'suffix' => 'permits',
                ]),
                'grid_x'      => 0,
                'grid_y'      => 0,
                'grid_w'      => 3,
                'grid_h'      => 2,
                'filters'     => null,
                'permissions' => json_encode(['admin', 'safety_officer', 'supervisor']),
                'sort_order'  => 1,
            ],
            [
                'widget_key'  => 'stat_open_observations',
                'title'       => 'Open Observations',
                'widget_type' => 'stat_card',
                'data_source' => '/api/wp/dashboard/stats/open-observations',
                'config'      => json_encode([
                    'icon'   => 'EyeIcon',
                    'color'  => '#F59E0B',
                    'suffix' => 'observations',
                ]),
                'grid_x'      => 3,
                'grid_y'      => 0,
                'grid_w'      => 3,
                'grid_h'      => 2,
                'filters'     => null,
                'permissions' => json_encode(['admin', 'safety_officer', 'supervisor']),
                'sort_order'  => 2,
            ],
            [
                'widget_key'  => 'stat_safe_manhours',
                'title'       => 'Safe Man-Hours',
                'widget_type' => 'stat_card',
                'data_source' => '/api/wp/dashboard/stats/safe-manhours',
                'config'      => json_encode([
                    'icon'   => 'ShieldCheckIcon',
                    'color'  => '#10B981',
                    'format' => 'number',
                ]),
                'grid_x'      => 6,
                'grid_y'      => 0,
                'grid_w'      => 3,
                'grid_h'      => 2,
                'filters'     => null,
                'permissions' => json_encode(['admin', 'safety_officer']),
                'sort_order'  => 3,
            ],
            [
                'widget_key'  => 'stat_overdue_actions',
                'title'       => 'Overdue Corrective Actions',
                'widget_type' => 'stat_card',
                'data_source' => '/api/wp/dashboard/stats/overdue-ca',
                'config'      => json_encode([
                    'icon'   => 'ExclamationTriangleIcon',
                    'color'  => '#EF4444',
                    'suffix' => 'overdue',
                ]),
                'grid_x'      => 9,
                'grid_y'      => 0,
                'grid_w'      => 3,
                'grid_h'      => 2,
                'filters'     => null,
                'permissions' => json_encode(['admin', 'safety_officer', 'supervisor']),
                'sort_order'  => 4,
            ],

            // ── Row 2: Charts ──
            [
                'widget_key'  => 'chart_permit_trend',
                'title'       => 'Tren Work Permit (30 Hari)',
                'widget_type' => 'chart_line',
                'data_source' => '/api/wp/dashboard/charts/permit-trend',
                'config'      => json_encode([
                    'xAxis'   => 'date',
                    'yAxis'   => 'count',
                    'series'  => [
                        ['key' => 'issued',  'label' => 'Issued',  'color' => '#3B82F6'],
                        ['key' => 'closed',  'label' => 'Closed',  'color' => '#10B981'],
                        ['key' => 'expired', 'label' => 'Expired', 'color' => '#EF4444'],
                    ],
                ]),
                'grid_x'      => 0,
                'grid_y'      => 2,
                'grid_w'      => 6,
                'grid_h'      => 4,
                'filters'     => json_encode(['period' => '30d']),
                'permissions' => json_encode(['admin', 'safety_officer']),
                'sort_order'  => 5,
            ],
            [
                'widget_key'  => 'chart_incident_by_type',
                'title'       => 'Insiden per Kategori (YTD)',
                'widget_type' => 'chart_bar',
                'data_source' => '/api/wp/dashboard/charts/incident-by-type',
                'config'      => json_encode([
                    'xAxis'      => 'type',
                    'yAxis'      => 'count',
                    'horizontal' => true,
                    'color'      => '#F97316',
                    'labels'     => [
                        'near_miss'       => 'Near Miss',
                        'first_aid'       => 'First Aid',
                        'medical_treatment'=> 'MTC',
                        'property_damage' => 'Property Damage',
                    ],
                ]),
                'grid_x'      => 6,
                'grid_y'      => 2,
                'grid_w'      => 6,
                'grid_h'      => 4,
                'filters'     => json_encode(['period' => 'ytd']),
                'permissions' => json_encode(['admin', 'safety_officer']),
                'sort_order'  => 6,
            ],

            // ── Row 3: Map & Pie ──
            [
                'widget_key'  => 'map_active_permits',
                'title'       => 'Peta Work Permit Aktif',
                'widget_type' => 'map',
                'data_source' => '/api/wp/dashboard/map/active-permits',
                'config'      => json_encode([
                    'center'   => ['lat' => 0.1000, 'lng' => 117.4900],
                    'zoom'     => 15,
                    'markerColor' => ['active' => '#22C55E', 'suspended' => '#F59E0B', 'expired' => '#EF4444'],
                ]),
                'grid_x'      => 0,
                'grid_y'      => 6,
                'grid_w'      => 8,
                'grid_h'      => 5,
                'filters'     => null,
                'permissions' => json_encode(['admin', 'safety_officer', 'supervisor']),
                'sort_order'  => 7,
            ],
            [
                'widget_key'  => 'chart_observation_severity',
                'title'       => 'Observasi per Severity',
                'widget_type' => 'chart_pie',
                'data_source' => '/api/wp/dashboard/charts/observation-severity',
                'config'      => json_encode([
                    'slices' => [
                        ['key' => 'critical', 'color' => '#EF4444'],
                        ['key' => 'high',     'color' => '#F97316'],
                        ['key' => 'medium',   'color' => '#F59E0B'],
                        ['key' => 'low',      'color' => '#10B981'],
                    ],
                    'showLegend'  => true,
                    'showPercent' => true,
                ]),
                'grid_x'      => 8,
                'grid_y'      => 6,
                'grid_w'      => 4,
                'grid_h'      => 5,
                'filters'     => null,
                'permissions' => json_encode(['admin', 'safety_officer']),
                'sort_order'  => 8,
            ],

            // ── Row 4: Gauge & Table ──
            [
                'widget_key'  => 'gauge_ltifr',
                'title'       => 'LTIFR (YTD)',
                'widget_type' => 'gauge',
                'data_source' => '/api/wp/dashboard/kpi/ltifr',
                'config'      => json_encode([
                    'min'      => 0,
                    'max'      => 5,
                    'zones'    => [
                        ['from' => 0, 'to' => 1, 'color' => '#10B981'],
                        ['from' => 1, 'to' => 3, 'color' => '#F59E0B'],
                        ['from' => 3, 'to' => 5, 'color' => '#EF4444'],
                    ],
                    'unit'     => 'per 1M man-hours',
                ]),
                'grid_x'      => 0,
                'grid_y'      => 11,
                'grid_w'      => 4,
                'grid_h'      => 4,
                'filters'     => null,
                'permissions' => json_encode(['admin', 'safety_officer']),
                'sort_order'  => 9,
            ],
            [
                'widget_key'  => 'table_upcoming_expirations',
                'title'       => 'Sertifikasi Akan Expired (30 Hari)',
                'widget_type' => 'table',
                'data_source' => '/api/wp/dashboard/tables/upcoming-expirations',
                'config'      => json_encode([
                    'columns' => [
                        ['key' => 'personnel_name',  'label' => 'Nama'],
                        ['key' => 'qualification',   'label' => 'Sertifikasi'],
                        ['key' => 'expiry_date',     'label' => 'Tanggal Expired'],
                        ['key' => 'days_remaining',  'label' => 'Sisa Hari'],
                    ],
                    'pageSize'  => 5,
                    'rowColor'  => ['urgent' => '#FEE2E2', 'warning' => '#FFF7ED'],
                ]),
                'grid_x'      => 4,
                'grid_y'      => 11,
                'grid_w'      => 8,
                'grid_h'      => 4,
                'filters'     => json_encode(['days_ahead' => 30]),
                'permissions' => json_encode(['admin', 'safety_officer', 'supervisor']),
                'sort_order'  => 10,
            ],
        ];

        foreach ($widgets as $w) {
            DB::table('dashboard_widgets')->insert(array_merge($w, [
                'is_active'  => true,
                'created_at' => $now,
                'updated_at' => $now,
            ]));
        }
    }
}
