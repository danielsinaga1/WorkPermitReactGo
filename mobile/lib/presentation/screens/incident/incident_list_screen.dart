import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../../core/theme/app_colors.dart';
import '../../widgets/status_badge.dart';

class IncidentListScreen extends StatefulWidget {
  const IncidentListScreen({super.key});

  @override
  State<IncidentListScreen> createState() => _IncidentListScreenState();
}

class _IncidentListScreenState extends State<IncidentListScreen> {
  final _incidents = [
    _IncidentData('INC-017', 'Near Miss – Terpeleset di Area Tangga',
        'Gudang Material', 'II', 'open', '08 Mei 2026'),
    _IncidentData('INC-016', 'Luka Ringan – Operator Mesin Press',
        'Area Produksi', 'III', 'investigating', '06 Mei 2026'),
    _IncidentData('INC-015', 'Kerusakan Alat Berat – Forklift',
        'Loading Dock', 'II', 'closed', '03 Mei 2026'),
    _IncidentData('INC-014', 'Near Miss – Kebocoran Kecil Pipa Gas',
        'Ruang Kompressor', 'I', 'closed', '28 Apr 2026'),
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(title: const Text('Incident Report')),
      body: Column(
        children: [
          _buildSummaryRow(),
          Expanded(
            child: ListView.separated(
              padding: const EdgeInsets.fromLTRB(16, 8, 16, 80),
              itemCount: _incidents.length,
              separatorBuilder: (_, _) => const SizedBox(height: 10),
              itemBuilder: (_, i) => _IncidentCard(incident: _incidents[i]),
            ),
          ),
        ],
      ),
      floatingActionButton: FloatingActionButton.extended(
        onPressed: () {},
        backgroundColor: AppColors.danger,
        icon: const Icon(Icons.add_rounded, color: Colors.white),
        label: Text('Lapor Insiden',
            style: GoogleFonts.plusJakartaSans(
                fontSize: 13, fontWeight: FontWeight.w700, color: Colors.white)),
      ),
    );
  }

  Widget _buildSummaryRow() {
    return Container(
      margin: const EdgeInsets.fromLTRB(16, 12, 16, 4),
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12),
        boxShadow: [
          BoxShadow(color: Colors.black.withValues(alpha: 0.05),
              blurRadius: 6, offset: const Offset(0, 2)),
        ],
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceAround,
        children: [
          _SumItem('Terbuka', '3', AppColors.danger),
          _divider(),
          _SumItem('Investigasi', '1', AppColors.warning),
          _divider(),
          _SumItem('Selesai', '12', AppColors.success),
          _divider(),
          _SumItem('Bulan Ini', '16', AppColors.secondary),
        ],
      ),
    );
  }

  Widget _divider() =>
      Container(width: 1, height: 36, color: AppColors.border);
}

class _SumItem extends StatelessWidget {
  final String label, value;
  final Color color;
  const _SumItem(this.label, this.value, this.color);

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Text(value,
            style: GoogleFonts.plusJakartaSans(
                fontSize: 18, fontWeight: FontWeight.w800, color: color)),
        Text(label,
            style: GoogleFonts.plusJakartaSans(
                fontSize: 10, color: AppColors.textSecondary)),
      ],
    );
  }
}

class _IncidentData {
  final String id, title, location, severity, status, date;
  const _IncidentData(this.id, this.title, this.location, this.severity, this.status, this.date);
}

class _IncidentCard extends StatelessWidget {
  final _IncidentData incident;
  const _IncidentCard({required this.incident});

  static final _severityColor = {
    'I': AppColors.danger,
    'II': AppColors.warning,
    'III': AppColors.accent,
    'IV': AppColors.info,
  };

  @override
  Widget build(BuildContext context) {
    final sc = _severityColor[incident.severity] ?? AppColors.textSecondary;

    return Container(
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12),
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
                  color: sc.withValues(alpha: 0.1),
                  borderRadius: BorderRadius.circular(10),
                ),
                child: Stack(
                  alignment: Alignment.center,
                  children: [
                    Icon(Icons.warning_amber_rounded, color: sc, size: 24),
                    Positioned(
                      bottom: 2, right: 2,
                      child: Container(
                        width: 16, height: 16,
                        decoration: BoxDecoration(color: sc, shape: BoxShape.circle),
                        child: Center(
                          child: Text(incident.severity,
                              style: const TextStyle(color: Colors.white,
                                  fontSize: 9, fontWeight: FontWeight.w800)),
                        ),
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        Text(incident.id,
                            style: GoogleFonts.plusJakartaSans(
                                fontSize: 11, fontWeight: FontWeight.w700,
                                color: AppColors.primary)),
                        const SizedBox(width: 8),
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 7, vertical: 2),
                          decoration: BoxDecoration(
                            color: sc.withValues(alpha: 0.1),
                            borderRadius: BorderRadius.circular(8),
                          ),
                          child: Text('Kelas ${incident.severity}',
                              style: GoogleFonts.plusJakartaSans(
                                  fontSize: 10, fontWeight: FontWeight.w700, color: sc)),
                        ),
                        const Spacer(),
                        StatusBadge(status: incident.status),
                      ],
                    ),
                    const SizedBox(height: 3),
                    Text(incident.title,
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
                        Text(incident.location,
                            style: GoogleFonts.plusJakartaSans(
                                fontSize: 11, color: AppColors.textSecondary)),
                        const Spacer(),
                        Text(incident.date,
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
