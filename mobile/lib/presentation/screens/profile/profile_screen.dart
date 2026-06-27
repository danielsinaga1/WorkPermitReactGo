import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../../core/theme/app_colors.dart';

class ProfileScreen extends StatelessWidget {
  const ProfileScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      body: CustomScrollView(
        slivers: [
          _buildProfileHeader(),
          SliverToBoxAdapter(
            child: Column(
              children: [
                const SizedBox(height: 16),
                _buildMenuSection(context, 'Akun', [
                  _MenuItem(Icons.person_outline_rounded, 'Edit Profil', () {}),
                  _MenuItem(Icons.lock_outline_rounded, 'Ganti Password', () {}),
                  _MenuItem(Icons.notifications_outlined, 'Notifikasi', () {}),
                ]),
                const SizedBox(height: 12),
                _buildMenuSection(context, 'Informasi', [
                  _MenuItem(Icons.info_outline_rounded, 'Tentang Aplikasi', () {}),
                  _MenuItem(Icons.help_outline_rounded, 'Bantuan', () {}),
                  _MenuItem(Icons.privacy_tip_outlined, 'Kebijakan Privasi', () {}),
                ]),
                const SizedBox(height: 12),
                _buildLogoutButton(context),
                const SizedBox(height: 32),
                Text('ArSHE v1.0.0',
                    style: GoogleFonts.plusJakartaSans(
                        fontSize: 11, color: AppColors.textHint)),
                const SizedBox(height: 20),
              ],
            ),
          ),
        ],
      ),
    );
  }

  SliverToBoxAdapter _buildProfileHeader() {
    return SliverToBoxAdapter(
      child: Container(
        decoration: const BoxDecoration(
          gradient: AppColors.primaryGradient,
          borderRadius: BorderRadius.vertical(bottom: Radius.circular(28)),
        ),
        padding: const EdgeInsets.fromLTRB(20, 60, 20, 30),
        child: Column(
          children: [
            Stack(
              children: [
                Container(
                  width: 88, height: 88,
                  decoration: BoxDecoration(
                    color: Colors.white.withValues(alpha: 0.2),
                    shape: BoxShape.circle,
                    border: Border.all(color: Colors.white, width: 3),
                  ),
                  child: const Icon(Icons.person_rounded,
                      color: Colors.white, size: 48),
                ),
                Positioned(
                  right: 0, bottom: 0,
                  child: Container(
                    width: 28, height: 28,
                    decoration: const BoxDecoration(
                        color: Colors.white, shape: BoxShape.circle),
                    child: const Icon(Icons.camera_alt_rounded,
                        color: AppColors.primary, size: 16),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 12),
            Text('Daniel Sinaga',
                style: GoogleFonts.plusJakartaSans(
                    fontSize: 18, fontWeight: FontWeight.w800,
                    color: Colors.white)),
            const SizedBox(height: 4),
            Text('HSE Supervisor',
                style: GoogleFonts.plusJakartaSans(
                    fontSize: 13, color: Colors.white.withValues(alpha: 0.85))),
            const SizedBox(height: 14),
            Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                _statChip('42', 'Permit'),
                const SizedBox(width: 12),
                _statChip('8', 'Insiden'),
                const SizedBox(width: 12),
                _statChip('27', 'Observasi'),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _statChip(String value, String label) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      decoration: BoxDecoration(
        color: Colors.white.withValues(alpha: 0.2),
        borderRadius: BorderRadius.circular(20),
      ),
      child: Column(
        children: [
          Text(value,
              style: GoogleFonts.plusJakartaSans(
                  fontSize: 16, fontWeight: FontWeight.w800, color: Colors.white)),
          Text(label,
              style: GoogleFonts.plusJakartaSans(
                  fontSize: 10, color: Colors.white.withValues(alpha: 0.8))),
        ],
      ),
    );
  }

  Widget _buildMenuSection(BuildContext context, String title, List<_MenuItem> items) {
    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(14),
        boxShadow: [
          BoxShadow(color: Colors.black.withValues(alpha: 0.05),
              blurRadius: 8, offset: const Offset(0, 2)),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Padding(
            padding: const EdgeInsets.fromLTRB(16, 14, 16, 8),
            child: Text(title,
                style: GoogleFonts.plusJakartaSans(
                    fontSize: 11, fontWeight: FontWeight.w700,
                    color: AppColors.textSecondary,
                    letterSpacing: 0.5)),
          ),
          ...items.asMap().entries.map((e) {
            final isLast = e.key == items.length - 1;
            return Column(
              children: [
                ListTile(
                  leading: Container(
                    width: 38, height: 38,
                    decoration: BoxDecoration(
                      color: AppColors.primary.withValues(alpha: 0.08),
                      borderRadius: BorderRadius.circular(10),
                    ),
                    child: Icon(e.value.icon, color: AppColors.primary, size: 20),
                  ),
                  title: Text(e.value.label,
                      style: GoogleFonts.plusJakartaSans(
                          fontSize: 14, fontWeight: FontWeight.w500,
                          color: AppColors.textPrimary)),
                  trailing: const Icon(Icons.chevron_right_rounded,
                      color: AppColors.textSecondary, size: 20),
                  onTap: e.value.onTap,
                  contentPadding: const EdgeInsets.symmetric(horizontal: 16),
                  dense: true,
                ),
                if (!isLast)
                  const Divider(height: 1, indent: 70),
              ],
            );
          }),
        ],
      ),
    );
  }

  Widget _buildLogoutButton(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16),
      child: SizedBox(
        width: double.infinity,
        child: OutlinedButton.icon(
          onPressed: () {},
          icon: const Icon(Icons.logout_rounded, color: AppColors.danger, size: 18),
          label: Text('Keluar',
              style: GoogleFonts.plusJakartaSans(
                  fontSize: 14, fontWeight: FontWeight.w600,
                  color: AppColors.danger)),
          style: OutlinedButton.styleFrom(
            side: const BorderSide(color: AppColors.danger),
            padding: const EdgeInsets.symmetric(vertical: 14),
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
          ),
        ),
      ),
    );
  }
}

class _MenuItem {
  final IconData icon;
  final String label;
  final VoidCallback onTap;
  const _MenuItem(this.icon, this.label, this.onTap);
}
