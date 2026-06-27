import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../../core/theme/app_colors.dart';
import '../../widgets/status_badge.dart';

class BSharpListScreen extends StatefulWidget {
  const BSharpListScreen({super.key});

  @override
  State<BSharpListScreen> createState() => _BSharpListScreenState();
}

class _BSharpListScreenState extends State<BSharpListScreen> {
  String _filter = 'all';

  final _observations = [
    _BSharpData('BS-055', 'Pemakaian APD Lengkap saat Bekerja',
        'Line Produksi', 'Agus R.', 'safe', '08 Mei 2026'),
    _BSharpData('BS-054', 'Tidak Memakai Harness di Ketinggian',
        'Atap Gedung C', 'Budi S.', 'at_risk', '07 Mei 2026'),
    _BSharpData('BS-053', 'Prosedur Lockout Tagout Diikuti',
        'Panel Room 1', 'Citra M.', 'safe', '07 Mei 2026'),
    _BSharpData('BS-052', 'Berjalan di Jalur Forklift',
        'Loading Dock', 'Doni P.', 'at_risk', '06 Mei 2026'),
    _BSharpData('BS-051', 'House Keeping Area Produksi Baik',
        'Area Produksi', 'Eko W.', 'safe', '05 Mei 2026'),
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(title: const Text('B-Sharp Observation')),
      body: Column(
        children: [
          _buildSummaryCards(),
          _buildFilterChips(),
          Expanded(
            child: ListView.separated(
              padding: const EdgeInsets.fromLTRB(16, 8, 16, 80),
              itemCount: _observations.length,
              separatorBuilder: (_, _) => const SizedBox(height: 10),
              itemBuilder: (_, i) => _BSharpCard(obs: _observations[i]),
            ),
          ),
        ],
      ),
      floatingActionButton: FloatingActionButton.extended(
        onPressed: () {},
        backgroundColor: AppColors.primary,
        icon: const Icon(Icons.add_rounded, color: Colors.white),
        label: Text('Tambah Observasi',
            style: GoogleFonts.plusJakartaSans(
                fontSize: 13, fontWeight: FontWeight.w700, color: Colors.white)),
      ),
    );
  }

  Widget _buildSummaryCards() {
    return Container(
      height: 90,
      margin: const EdgeInsets.fromLTRB(16, 12, 16, 0),
      child: Row(
        children: [
          _SummaryCard('Total', '55', AppColors.secondary),
          const SizedBox(width: 10),
          _SummaryCard('Aman', '38', AppColors.primary),
          const SizedBox(width: 10),
          _SummaryCard('Berisiko', '17', AppColors.danger),
          const SizedBox(width: 10),
          _SummaryCard('Observer', '12', AppColors.accent),
        ],
      ),
    );
  }

  Widget _buildFilterChips() {
    const filters = [
      ('all', 'Semua'),
      ('safe', 'Aman'),
      ('at_risk', 'Berisiko'),
    ];
    return SingleChildScrollView(
      scrollDirection: Axis.horizontal,
      padding: const EdgeInsets.fromLTRB(16, 10, 16, 6),
      child: Row(
        children: filters.map((f) {
          final selected = _filter == f.$1;
          return Padding(
            padding: const EdgeInsets.only(right: 8),
            child: ChoiceChip(
              label: Text(f.$2),
              selected: selected,
              selectedColor: AppColors.primary.withValues(alpha: 0.15),
              labelStyle: GoogleFonts.plusJakartaSans(
                fontSize: 12, fontWeight: FontWeight.w500,
                color: selected ? AppColors.primary : AppColors.textSecondary),
              side: BorderSide(
                  color: selected ? AppColors.primary : AppColors.border),
              onSelected: (_) => setState(() => _filter = f.$1),
            ),
          );
        }).toList(),
      ),
    );
  }
}

class _SummaryCard extends StatelessWidget {
  final String label, value;
  final Color color;
  const _SummaryCard(this.label, this.value, this.color);

  @override
  Widget build(BuildContext context) {
    return Expanded(
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 14),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(12),
          boxShadow: [
            BoxShadow(color: Colors.black.withValues(alpha: 0.05),
                blurRadius: 6, offset: const Offset(0, 2)),
          ],
        ),
        child: Column(
          children: [
            Text(value,
                style: GoogleFonts.plusJakartaSans(
                    fontSize: 20, fontWeight: FontWeight.w800, color: color)),
            Text(label,
                style: GoogleFonts.plusJakartaSans(
                    fontSize: 10, color: AppColors.textSecondary)),
          ],
        ),
      ),
    );
  }
}

class _BSharpData {
  final String id, title, location, observer, behavior, date;
  const _BSharpData(this.id, this.title, this.location, this.observer, this.behavior, this.date);
}

class _BSharpCard extends StatelessWidget {
  final _BSharpData obs;
  const _BSharpCard({required this.obs});

  @override
  Widget build(BuildContext context) {
    final isSafe = obs.behavior == 'safe';
    final color = isSafe ? AppColors.primary : AppColors.danger;

    return Container(
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12),
        border: Border(left: BorderSide(color: color, width: 3.5)),
        boxShadow: [
          BoxShadow(color: Colors.black.withValues(alpha: 0.06),
              blurRadius: 8, offset: const Offset(0, 2)),
        ],
      ),
      child: InkWell(
        onTap: () {},
        borderRadius: BorderRadius.circular(12),
        child: Padding(
          padding: const EdgeInsets.all(14),
          child: Row(
            children: [
              Container(
                width: 44, height: 44,
                decoration: BoxDecoration(
                  color: color.withValues(alpha: 0.1),
                  borderRadius: BorderRadius.circular(10),
                ),
                child: Icon(
                  isSafe ? Icons.check_circle_rounded : Icons.cancel_rounded,
                  color: color, size: 24),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        Text(obs.id,
                            style: GoogleFonts.plusJakartaSans(
                                fontSize: 11, fontWeight: FontWeight.w700,
                                color: AppColors.primary)),
                        const Spacer(),
                        StatusBadge(status: obs.behavior),
                      ],
                    ),
                    const SizedBox(height: 3),
                    Text(obs.title,
                        style: GoogleFonts.plusJakartaSans(
                            fontSize: 13, fontWeight: FontWeight.w600,
                            color: AppColors.textPrimary),
                        maxLines: 2, overflow: TextOverflow.ellipsis),
                    const SizedBox(height: 3),
                    Row(
                      children: [
                        const Icon(Icons.location_on_rounded,
                            size: 12, color: AppColors.textSecondary),
                        const SizedBox(width: 3),
                        Text(obs.location,
                            style: GoogleFonts.plusJakartaSans(
                                fontSize: 11, color: AppColors.textSecondary)),
                        const SizedBox(width: 12),
                        const Icon(Icons.person_rounded,
                            size: 12, color: AppColors.textSecondary),
                        const SizedBox(width: 3),
                        Text(obs.observer,
                            style: GoogleFonts.plusJakartaSans(
                                fontSize: 11, color: AppColors.textSecondary)),
                      ],
                    ),
                  ],
                ),
              ),
              const SizedBox(width: 8),
              const Icon(Icons.chevron_right_rounded,
                  color: AppColors.textSecondary, size: 20),
            ],
          ),
        ),
      ),
    );
  }
}
