import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../core/theme/app_colors.dart';
import 'screens/home/home_screen.dart';
import 'screens/permit/permit_list_screen.dart';
import 'screens/incident/incident_list_screen.dart';
import 'screens/bsharp/bsharp_list_screen.dart';
import 'screens/profile/profile_screen.dart';

class MainWrapper extends StatefulWidget {
  const MainWrapper({super.key});

  @override
  State<MainWrapper> createState() => _MainWrapperState();
}

class _MainWrapperState extends State<MainWrapper> {
  int _currentIndex = 0;

  final List<Widget> _screens = const [
    HomeScreen(),
    PermitListScreen(),
    IncidentListScreen(),
    BSharpListScreen(),
    ProfileScreen(),
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: IndexedStack(index: _currentIndex, children: _screens),
      bottomNavigationBar: _buildBottomNav(),
      floatingActionButton: _buildCenterFab(),
      floatingActionButtonLocation: FloatingActionButtonLocation.centerDocked,
    );
  }

  Widget _buildCenterFab() {
    return GestureDetector(
      onTap: () => _showQuickCreateSheet(context),
      child: Container(
        width: 58,
        height: 58,
        decoration: BoxDecoration(
          gradient: AppColors.primaryGradient,
          shape: BoxShape.circle,
          boxShadow: [
            BoxShadow(
              color: AppColors.primary.withValues(alpha: 0.35),
              blurRadius: 12,
              offset: const Offset(0, 4),
            ),
          ],
        ),
        child: const Icon(Icons.shield_rounded, color: Colors.white, size: 28),
      ),
    );
  }

  Widget _buildBottomNav() {
    return Container(
      decoration: BoxDecoration(
        color: Colors.white,
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.08),
            blurRadius: 16,
            offset: const Offset(0, -4),
          ),
        ],
      ),
      child: BottomAppBar(
        height: 64,
        padding: EdgeInsets.zero,
        notchMargin: 8,
        shape: const CircularNotchedRectangle(),
        color: Colors.white,
        elevation: 0,
        child: Row(
          children: [
            _NavItem(icon: Icons.home_rounded, label: 'Beranda', index: 0, current: _currentIndex, onTap: _onTap),
            _NavItem(icon: Icons.assignment_rounded, label: 'Permit', index: 1, current: _currentIndex, onTap: _onTap),
            const SizedBox(width: 60),
            _NavItem(icon: Icons.warning_amber_rounded, label: 'Insiden', index: 2, current: _currentIndex, onTap: _onTap),
            _NavItem(icon: Icons.person_rounded, label: 'Akun', index: 4, current: _currentIndex, onTap: _onTap),
          ],
        ),
      ),
    );
  }

  void _onTap(int index) => setState(() => _currentIndex = index);

  void _showQuickCreateSheet(BuildContext context) {
    showModalBottomSheet(
      context: context,
      shape: const RoundedRectangleBorder(
          borderRadius: BorderRadius.vertical(top: Radius.circular(20))),
      builder: (_) => const _QuickCreateSheet(),
    );
  }
}

class _NavItem extends StatelessWidget {
  final IconData icon;
  final String label;
  final int index;
  final int current;
  final ValueChanged<int> onTap;

  const _NavItem({
    required this.icon, required this.label,
    required this.index, required this.current, required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    final selected = index == current;
    return Expanded(
      child: InkWell(
        onTap: () => onTap(index),
        borderRadius: BorderRadius.circular(8),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(icon, color: selected ? AppColors.primary : AppColors.textSecondary, size: 24),
            const SizedBox(height: 2),
            Text(
              label,
              style: GoogleFonts.plusJakartaSans(
                fontSize: 11,
                fontWeight: selected ? FontWeight.w600 : FontWeight.w400,
                color: selected ? AppColors.primary : AppColors.textSecondary,
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _QuickCreateSheet extends StatelessWidget {
  const _QuickCreateSheet();

  @override
  Widget build(BuildContext context) {
    final items = [
      (Icons.assignment_add, 'Buat Permit Baru', AppColors.secondary),
      (Icons.warning_amber_rounded, 'Lapor Insiden', AppColors.danger),
      (Icons.visibility_rounded, 'Observasi B-Sharp', AppColors.primary),
      (Icons.lock_rounded, 'Prosedur LOTO', AppColors.accent),
      (Icons.checklist_rounded, 'Toolbox Meeting', AppColors.info),
    ];
    return Container(
      padding: const EdgeInsets.fromLTRB(16, 12, 16, 24),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          Container(
            width: 40, height: 4,
            margin: const EdgeInsets.only(bottom: 16),
            decoration: BoxDecoration(
              color: AppColors.border,
              borderRadius: BorderRadius.circular(2),
            ),
          ),
          Text('Buat Laporan Baru',
              style: Theme.of(context).textTheme.titleMedium),
          const SizedBox(height: 16),
          ...items.map((item) => ListTile(
                leading: Container(
                  width: 44, height: 44,
                  decoration: BoxDecoration(
                    color: item.$3.withValues(alpha: 0.1),
                    borderRadius: BorderRadius.circular(10),
                  ),
                  child: Icon(item.$1, color: item.$3, size: 22),
                ),
                title: Text(item.$2,
                    style: Theme.of(context).textTheme.titleSmall),
                trailing: const Icon(Icons.chevron_right_rounded,
                    color: AppColors.textSecondary),
                onTap: () => Navigator.pop(context),
              )),
        ],
      ),
    );
  }
}
