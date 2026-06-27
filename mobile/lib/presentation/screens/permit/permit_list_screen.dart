import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../../core/theme/app_colors.dart';
import '../../widgets/status_badge.dart';

class PermitListScreen extends StatefulWidget {
  const PermitListScreen({super.key});

  @override
  State<PermitListScreen> createState() => _PermitListScreenState();
}

class _PermitListScreenState extends State<PermitListScreen>
    with SingleTickerProviderStateMixin {
  late final TabController _tabController;
  final _searchController = TextEditingController();

  static const _tabs = ['Semua', 'Draft', 'Aktif', 'Selesai'];

  final _permits = [
    _PermitData('WP-0042', 'Hot Work di Area Boiler', 'Area Boiler Utama',
        'active', 'HOT_WORK', '08 Mei 2026'),
    _PermitData('WP-0041', 'Confined Space Entry – Tank A',
        'Unit Tangki Penyimpanan', 'submitted', 'CONFINED_SPACE', '07 Mei 2026'),
    _PermitData('WP-0040', 'Electrical Maintenance Panel B',
        'Panel Room 2', 'approved', 'ELECTRICAL', '07 Mei 2026'),
    _PermitData('WP-0039', 'Perbaikan Pipa Steam',
        'Area Produksi', 'closed', 'PLANT', '05 Mei 2026'),
    _PermitData('WP-0038', 'Pengelasan di Ketinggian',
        'Atap Gedung C', 'draft', 'HOT_WORK', '04 Mei 2026'),
  ];

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: _tabs.length, vsync: this);
  }

  @override
  void dispose() {
    _tabController.dispose();
    _searchController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        title: const Text('Work Permit'),
        centerTitle: false,
        bottom: PreferredSize(
          preferredSize: const Size.fromHeight(48),
          child: TabBar(
            controller: _tabController,
            labelColor: AppColors.primary,
            unselectedLabelColor: AppColors.textSecondary,
            indicatorColor: AppColors.primary,
            indicatorWeight: 2.5,
            labelStyle: GoogleFonts.plusJakartaSans(
                fontSize: 13, fontWeight: FontWeight.w600),
            tabs: _tabs.map((t) => Tab(text: t)).toList(),
          ),
        ),
      ),
      body: Column(
        children: [
          _buildSearchBar(),
          Expanded(
            child: TabBarView(
              controller: _tabController,
              children: _tabs.map((_) => _buildPermitList()).toList(),
            ),
          ),
        ],
      ),
      floatingActionButton: FloatingActionButton.extended(
        onPressed: () {},
        backgroundColor: AppColors.primary,
        icon: const Icon(Icons.add_rounded, color: Colors.white),
        label: Text('Buat Permit',
            style: GoogleFonts.plusJakartaSans(
                fontSize: 13, fontWeight: FontWeight.w700, color: Colors.white)),
      ),
    );
  }

  Widget _buildSearchBar() {
    return Padding(
      padding: const EdgeInsets.fromLTRB(16, 12, 16, 8),
      child: TextField(
        controller: _searchController,
        decoration: InputDecoration(
          hintText: 'Cari nomor / judul permit...',
          prefixIcon: const Icon(Icons.search_rounded, color: AppColors.textSecondary),
          suffixIcon: IconButton(
            icon: const Icon(Icons.tune_rounded, color: AppColors.textSecondary),
            onPressed: () {},
          ),
        ),
      ),
    );
  }

  Widget _buildPermitList() {
    return ListView.separated(
      padding: const EdgeInsets.fromLTRB(16, 8, 16, 80),
      itemCount: _permits.length,
      separatorBuilder: (_, _) => const SizedBox(height: 10),
      itemBuilder: (_, i) => _PermitCard(permit: _permits[i]),
    );
  }
}

class _PermitData {
  final String number, title, location, status, type, date;
  const _PermitData(this.number, this.title, this.location, this.status, this.type, this.date);
}

class _PermitCard extends StatelessWidget {
  final _PermitData permit;
  const _PermitCard({required this.permit});

  static const _typeIcon = {
    'HOT_WORK': (Icons.local_fire_department_rounded, AppColors.danger),
    'CONFINED_SPACE': (Icons.crop_square_rounded, AppColors.secondary),
    'ELECTRICAL': (Icons.electric_bolt_rounded, AppColors.accent),
    'PLANT': (Icons.precision_manufacturing_rounded, AppColors.primary),
  };

  @override
  Widget build(BuildContext context) {
    final icon = _typeIcon[permit.type] ??
        (Icons.assignment_rounded, AppColors.textSecondary);

    return Container(
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.06),
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
                width: 46, height: 46,
                decoration: BoxDecoration(
                  color: icon.$2.withValues(alpha: 0.1),
                  borderRadius: BorderRadius.circular(10),
                ),
                child: Icon(icon.$1, color: icon.$2, size: 22),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        Text(permit.number,
                            style: GoogleFonts.plusJakartaSans(
                                fontSize: 11, fontWeight: FontWeight.w700,
                                color: AppColors.primary)),
                        const Spacer(),
                        StatusBadge(status: permit.status),
                      ],
                    ),
                    const SizedBox(height: 3),
                    Text(permit.title,
                        style: GoogleFonts.plusJakartaSans(
                            fontSize: 13, fontWeight: FontWeight.w600,
                            color: AppColors.textPrimary),
                        maxLines: 1, overflow: TextOverflow.ellipsis),
                    const SizedBox(height: 3),
                    Row(
                      children: [
                        const Icon(Icons.location_on_rounded,
                            size: 12, color: AppColors.textSecondary),
                        const SizedBox(width: 3),
                        Expanded(
                          child: Text(permit.location,
                              style: GoogleFonts.plusJakartaSans(
                                  fontSize: 11, color: AppColors.textSecondary),
                              maxLines: 1, overflow: TextOverflow.ellipsis),
                        ),
                        const SizedBox(width: 8),
                        const Icon(Icons.calendar_today_rounded,
                            size: 11, color: AppColors.textSecondary),
                        const SizedBox(width: 3),
                        Text(permit.date,
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
