import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:intl/intl.dart';
import '../../../core/theme/app_colors.dart';
import '../../widgets/status_badge.dart';
import '../../widgets/section_header.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  // Dummy data — ganti dengan BLoC + repository nanti
  final _userName = 'Daniel';
  final _unreadCount = 3;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      body: RefreshIndicator(
        color: AppColors.primary,
        onRefresh: () async => await Future.delayed(const Duration(seconds: 1)),
        child: CustomScrollView(
          slivers: [
            _buildAppBar(),
            SliverToBoxAdapter(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  _HeroBanner(userName: _userName),
                  const SizedBox(height: 16),
                  _QuickStatsCard(),
                  const SizedBox(height: 16),
                  _ModuleGrid(),
                  const SizedBox(height: 16),
                  _RecentActivitiesSection(),
                  const SizedBox(height: 16),
                  _TrustBanner(),
                  const SizedBox(height: 16),
                  _PremiumBanner(),
                  const SizedBox(height: 90),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  SliverAppBar _buildAppBar() {
    return SliverAppBar(
      pinned: true,
      floating: true,
      backgroundColor: Colors.white,
      elevation: 0,
      scrolledUnderElevation: 0.5,
      shadowColor: AppColors.border,
      title: Row(
        children: [
          Container(
            width: 32, height: 32,
            decoration: const BoxDecoration(
              gradient: AppColors.primaryGradient,
              shape: BoxShape.circle,
            ),
            child: const Icon(Icons.shield_rounded, color: Colors.white, size: 18),
          ),
          const SizedBox(width: 8),
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text('ArSHE',
                  style: GoogleFonts.plusJakartaSans(
                      fontSize: 16, fontWeight: FontWeight.w800,
                      color: AppColors.primary)),
              Text('Safety Management',
                  style: GoogleFonts.plusJakartaSans(
                      fontSize: 9, fontWeight: FontWeight.w500,
                      color: AppColors.textSecondary)),
            ],
          ),
        ],
      ),
      actions: [
        Stack(
          children: [
            IconButton(
              icon: const Icon(Icons.notifications_rounded,
                  color: AppColors.textPrimary, size: 26),
              onPressed: () {},
            ),
            if (_unreadCount > 0)
              Positioned(
                right: 8, top: 8,
                child: Container(
                  width: 18, height: 18,
                  decoration: const BoxDecoration(
                      color: AppColors.danger, shape: BoxShape.circle),
                  child: Center(
                    child: Text('$_unreadCount',
                        style: const TextStyle(
                            color: Colors.white, fontSize: 10,
                            fontWeight: FontWeight.w700)),
                  ),
                ),
              ),
          ],
        ),
        const SizedBox(width: 4),
      ],
    );
  }
}

// ─────────────────────────────────────────
// HERO BANNER (seperti banner PIDO)
// ─────────────────────────────────────────
class _HeroBanner extends StatelessWidget {
  final String userName;
  const _HeroBanner({required this.userName});

  @override
  Widget build(BuildContext context) {
    final now = DateTime.now();
    final greeting = now.hour < 12 ? 'pagi' : now.hour < 17 ? 'siang' : 'malam';
    final dateStr = DateFormat('EEEE, d MMMM yyyy', 'id').format(now);

    return Container(
      margin: const EdgeInsets.fromLTRB(16, 8, 16, 0),
      height: 160,
      decoration: BoxDecoration(
        gradient: AppColors.heroGradient,
        borderRadius: BorderRadius.circular(16),
        boxShadow: [
          BoxShadow(
            color: AppColors.primary.withValues(alpha: 0.3),
            blurRadius: 16, offset: const Offset(0, 6)),
        ],
      ),
      clipBehavior: Clip.antiAlias,
      child: Stack(
        children: [
          // Decorative circles
          Positioned(
            right: -30, top: -30,
            child: Container(
              width: 140, height: 140,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                color: Colors.white.withValues(alpha: 0.06),
              ),
            ),
          ),
          Positioned(
            right: 40, bottom: -40,
            child: Container(
              width: 100, height: 100,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                color: Colors.white.withValues(alpha: 0.06),
              ),
            ),
          ),
          // Safety icon illustration area
          Positioned(
            right: 12, top: 0, bottom: 0,
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Container(
                  width: 80, height: 80,
                  decoration: BoxDecoration(
                    color: Colors.white.withValues(alpha: 0.15),
                    shape: BoxShape.circle,
                  ),
                  child: const Icon(Icons.health_and_safety_rounded,
                      color: Colors.white, size: 44),
                ),
              ],
            ),
          ),
          // Content
          Padding(
            padding: const EdgeInsets.fromLTRB(20, 20, 100, 20),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Text('Selamat $greeting, $userName!',
                    style: GoogleFonts.plusJakartaSans(
                        fontSize: 16, fontWeight: FontWeight.w700,
                        color: Colors.white)),
                const SizedBox(height: 4),
                Text(dateStr,
                    style: GoogleFonts.plusJakartaSans(
                        fontSize: 11, color: Colors.white.withValues(alpha: 0.8))),
                const SizedBox(height: 10),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                  decoration: BoxDecoration(
                    color: Colors.white.withValues(alpha: 0.2),
                    borderRadius: BorderRadius.circular(20),
                  ),
                  child: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Container(
                        width: 7, height: 7,
                        decoration: const BoxDecoration(
                            color: Color(0xFF76FF03), shape: BoxShape.circle),
                      ),
                      const SizedBox(width: 5),
                      Text('Semua Sistem Normal',
                          style: GoogleFonts.plusJakartaSans(
                              fontSize: 11, fontWeight: FontWeight.w600,
                              color: Colors.white)),
                    ],
                  ),
                ),
                const SizedBox(height: 12),
                GestureDetector(
                  onTap: () {},
                  child: Container(
                    padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(20),
                    ),
                    child: Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Text('Buat Laporan',
                            style: GoogleFonts.plusJakartaSans(
                                fontSize: 12, fontWeight: FontWeight.w700,
                                color: AppColors.primary)),
                        const SizedBox(width: 4),
                        const Icon(Icons.arrow_forward_rounded,
                            color: AppColors.primary, size: 14),
                      ],
                    ),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

// ─────────────────────────────────────────
// QUICK STATS CARD (seperti saldo PIDO)
// ─────────────────────────────────────────
class _QuickStatsCard extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 16),
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(14),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.06),
            blurRadius: 10, offset: const Offset(0, 3)),
        ],
      ),
      child: Row(
        children: [
          // Izin Aktif (seperti saldo)
          Expanded(
            flex: 2,
            child: GestureDetector(
              onTap: () {},
              child: Row(
                children: [
                  Container(
                    width: 38, height: 38,
                    decoration: BoxDecoration(
                      color: AppColors.primary.withValues(alpha: 0.1),
                      borderRadius: BorderRadius.circular(10),
                    ),
                    child: const Icon(Icons.assignment_rounded,
                        color: AppColors.primary, size: 20),
                  ),
                  const SizedBox(width: 10),
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text('Izin Aktif',
                          style: GoogleFonts.plusJakartaSans(
                              fontSize: 11, color: AppColors.textSecondary)),
                      Row(
                        children: [
                          Text('12',
                              style: GoogleFonts.plusJakartaSans(
                                  fontSize: 18, fontWeight: FontWeight.w800,
                                  color: AppColors.textPrimary)),
                          const SizedBox(width: 4),
                          const Icon(Icons.chevron_right_rounded,
                              color: AppColors.textSecondary, size: 16),
                        ],
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ),
          Container(width: 1, height: 40, color: AppColors.border),
          // Quick actions
          Expanded(
            flex: 3,
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceEvenly,
              children: [
                _QuickAction(icon: Icons.add_circle_rounded,
                    label: 'Permit', color: AppColors.secondary),
                _QuickAction(icon: Icons.bar_chart_rounded,
                    label: 'KPI', color: AppColors.primary),
                _QuickAction(icon: Icons.warning_amber_rounded,
                    label: 'Insiden', color: AppColors.danger),
                _QuickAction(icon: Icons.visibility_rounded,
                    label: 'B-Sharp', color: AppColors.accent),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class _QuickAction extends StatelessWidget {
  final IconData icon;
  final String label;
  final Color color;
  const _QuickAction({required this.icon, required this.label, required this.color});

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: () {},
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          Container(
            width: 40, height: 40,
            decoration: BoxDecoration(
              color: color.withValues(alpha: 0.1),
              borderRadius: BorderRadius.circular(10),
            ),
            child: Icon(icon, color: color, size: 20),
          ),
          const SizedBox(height: 4),
          Text(label,
              style: GoogleFonts.plusJakartaSans(
                  fontSize: 10, fontWeight: FontWeight.w500,
                  color: AppColors.textSecondary)),
        ],
      ),
    );
  }
}

// ─────────────────────────────────────────
// MODULE GRID (seperti kategori layanan PIDO)
// ─────────────────────────────────────────
class _ModuleGrid extends StatelessWidget {
  static const _modules = [
    (Icons.assignment_rounded, 'Work\nPermit', AppColors.secondary),
    (Icons.warning_amber_rounded, 'Insiden', AppColors.danger),
    (Icons.visibility_rounded, 'B-Sharp', AppColors.primary),
    (Icons.lock_rounded, 'LOTO', AppColors.accent),
    (Icons.search_rounded, 'Observasi', Color(0xFF7B1FA2)),
    (Icons.groups_rounded, 'Toolbox', Color(0xFF0097A7)),
    (Icons.fact_check_rounded, 'Audit', Color(0xFF388E3C)),
    (Icons.folder_rounded, 'Dokumen', Color(0xFFE64A19)),
    (Icons.person_rounded, 'Personel', Color(0xFF1565C0)),
    (Icons.more_horiz_rounded, 'Lainnya', AppColors.textSecondary),
  ];

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 16),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(14),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.06),
            blurRadius: 10, offset: const Offset(0, 3)),
        ],
      ),
      child: GridView.builder(
        shrinkWrap: true,
        physics: const NeverScrollableScrollPhysics(),
        gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
          crossAxisCount: 5,
          mainAxisSpacing: 16,
          crossAxisSpacing: 4,
          childAspectRatio: 0.85,
        ),
        itemCount: _modules.length,
        itemBuilder: (_, i) {
          final m = _modules[i];
          return _ModuleItem(icon: m.$1, label: m.$2, color: m.$3);
        },
      ),
    );
  }
}

class _ModuleItem extends StatelessWidget {
  final IconData icon;
  final String label;
  final Color color;
  const _ModuleItem({required this.icon, required this.label, required this.color});

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: () {},
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          Container(
            width: 48, height: 48,
            decoration: BoxDecoration(
              color: color.withValues(alpha: 0.1),
              borderRadius: BorderRadius.circular(12),
            ),
            child: Icon(icon, color: color, size: 24),
          ),
          const SizedBox(height: 6),
          Text(label,
              textAlign: TextAlign.center,
              maxLines: 2,
              style: GoogleFonts.plusJakartaSans(
                  fontSize: 10, fontWeight: FontWeight.w500,
                  color: AppColors.textPrimary,
                  height: 1.2)),
        ],
      ),
    );
  }
}

// ─────────────────────────────────────────
// RECENT ACTIVITIES (seperti "Rekomendasi" PIDO)
// ─────────────────────────────────────────
class _RecentActivitiesSection extends StatelessWidget {
  static final _items = [
    _ActivityItem(
      title: 'Permit Hot Work #WP-0042',
      subtitle: 'Area Boiler – Aktif',
      type: 'permit',
      status: 'active',
      tag: 'Hari Ini',
    ),
    _ActivityItem(
      title: 'Insiden Near Miss #INC-017',
      subtitle: 'Gudang Material',
      type: 'incident',
      status: 'open',
      tag: 'Kelas II',
    ),
    _ActivityItem(
      title: 'Observasi B-Sharp #BS-055',
      subtitle: 'Produksi – Aman',
      type: 'bsharp',
      status: 'safe',
      tag: 'Selesai',
    ),
    _ActivityItem(
      title: 'Toolbox Meeting – K3',
      subtitle: 'Tim Maintenance',
      type: 'toolbox',
      status: 'active',
      tag: 'Pagi Ini',
    ),
  ];

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 16),
          child: SectionHeader(
            title: 'Aktivitas Terbaru',
            onSeeAll: () {},
          ),
        ),
        const SizedBox(height: 10),
        SizedBox(
          height: 155,
          child: ListView.separated(
            scrollDirection: Axis.horizontal,
            padding: const EdgeInsets.symmetric(horizontal: 16),
            itemCount: _items.length,
            separatorBuilder: (_, _) => const SizedBox(width: 12),
            itemBuilder: (_, i) => _ActivityCard(item: _items[i]),
          ),
        ),
      ],
    );
  }
}

class _ActivityItem {
  final String title, subtitle, type, status, tag;
  const _ActivityItem(
      {required this.title, required this.subtitle, required this.type,
        required this.status, required this.tag});
}

class _ActivityCard extends StatelessWidget {
  final _ActivityItem item;
  const _ActivityCard({required this.item});

  static const _iconMap = {
    'permit': (Icons.assignment_rounded, AppColors.secondary),
    'incident': (Icons.warning_amber_rounded, AppColors.danger),
    'bsharp': (Icons.visibility_rounded, AppColors.primary),
    'toolbox': (Icons.groups_rounded, Color(0xFF0097A7)),
  };

  @override
  Widget build(BuildContext context) {
    final iconData = _iconMap[item.type] ?? (Icons.info_rounded, AppColors.textSecondary);

    return GestureDetector(
      onTap: () {},
      child: Container(
        width: 155,
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(14),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withValues(alpha: 0.07),
              blurRadius: 8, offset: const Offset(0, 3)),
          ],
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Icon area
            Container(
              height: 72,
              decoration: BoxDecoration(
                color: iconData.$2.withValues(alpha: 0.1),
                borderRadius: const BorderRadius.vertical(top: Radius.circular(14)),
              ),
              child: Stack(
                children: [
                  Center(child: Icon(iconData.$1, color: iconData.$2, size: 36)),
                  Positioned(
                    top: 8, left: 8,
                    child: Container(
                      padding: const EdgeInsets.symmetric(horizontal: 7, vertical: 3),
                      decoration: BoxDecoration(
                        color: iconData.$2,
                        borderRadius: BorderRadius.circular(8),
                      ),
                      child: Text(item.tag,
                          style: GoogleFonts.plusJakartaSans(
                              fontSize: 9, fontWeight: FontWeight.w700,
                              color: Colors.white)),
                    ),
                  ),
                ],
              ),
            ),
            Padding(
              padding: const EdgeInsets.fromLTRB(10, 8, 10, 8),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(item.title,
                      maxLines: 2,
                      overflow: TextOverflow.ellipsis,
                      style: GoogleFonts.plusJakartaSans(
                          fontSize: 11, fontWeight: FontWeight.w600,
                          color: AppColors.textPrimary, height: 1.3)),
                  const SizedBox(height: 4),
                  Row(
                    children: [
                      Expanded(
                        child: Text(item.subtitle,
                            overflow: TextOverflow.ellipsis,
                            style: GoogleFonts.plusJakartaSans(
                                fontSize: 10, color: AppColors.textSecondary)),
                      ),
                    ],
                  ),
                  const SizedBox(height: 6),
                  StatusBadge(status: item.status),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}

// ─────────────────────────────────────────
// TRUST BANNER (seperti "Aman & Terpercaya" PIDO)
// ─────────────────────────────────────────
class _TrustBanner extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 16),
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(14),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.06),
            blurRadius: 10, offset: const Offset(0, 3)),
        ],
      ),
      child: Row(
        children: [
          Container(
            width: 44, height: 44,
            decoration: BoxDecoration(
              color: AppColors.primary.withValues(alpha: 0.1),
              shape: BoxShape.circle,
            ),
            child: const Icon(Icons.verified_rounded,
                color: AppColors.primary, size: 24),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text('Sistem Terverifikasi',
                    style: GoogleFonts.plusJakartaSans(
                        fontSize: 13, fontWeight: FontWeight.w700,
                        color: AppColors.primary)),
                Text('ISO 45001:2018 · OHSAS 18001 · Teraudit',
                    style: GoogleFonts.plusJakartaSans(
                        fontSize: 11, color: AppColors.textSecondary)),
              ],
            ),
          ),
          const Icon(Icons.shield_rounded, color: AppColors.primary, size: 36),
        ],
      ),
    );
  }
}

// ─────────────────────────────────────────
// PREMIUM BANNER (seperti "PIDO PLUS")
// ─────────────────────────────────────────
class _PremiumBanner extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 16),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        gradient: const LinearGradient(
          colors: [Color(0xFF1A3C5E), Color(0xFF0D2137)],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        borderRadius: BorderRadius.circular(14),
        boxShadow: [
          BoxShadow(
            color: AppColors.secondary.withValues(alpha: 0.4),
            blurRadius: 12, offset: const Offset(0, 4)),
        ],
      ),
      child: Row(
        children: [
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    Text('ArSHE Analytics',
                        style: GoogleFonts.plusJakartaSans(
                            fontSize: 15, fontWeight: FontWeight.w800,
                            color: Colors.white)),
                    const SizedBox(width: 6),
                    const Text('👑', style: TextStyle(fontSize: 14)),
                  ],
                ),
                const SizedBox(height: 4),
                Text('Akses dashboard AI, prediksi risiko,\ndan laporan otomatis.',
                    style: GoogleFonts.plusJakartaSans(
                        fontSize: 11, color: Colors.white.withValues(alpha: 0.7),
                        height: 1.4)),
              ],
            ),
          ),
          const SizedBox(width: 12),
          GestureDetector(
            onTap: () {},
            child: Container(
              padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(20),
              ),
              child: Row(
                children: [
                  Text('Aktifkan',
                      style: GoogleFonts.plusJakartaSans(
                          fontSize: 12, fontWeight: FontWeight.w700,
                          color: AppColors.secondary)),
                  const SizedBox(width: 4),
                  const Icon(Icons.chevron_right_rounded,
                      color: AppColors.secondary, size: 16),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}
