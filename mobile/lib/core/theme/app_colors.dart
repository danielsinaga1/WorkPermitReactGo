import 'package:flutter/material.dart';

class AppColors {
  static const primary = Color(0xFF00A651);
  static const primaryDark = Color(0xFF007A3D);
  static const secondary = Color(0xFF1A3C5E);
  static const accent = Color(0xFFF5A623);
  static const danger = Color(0xFFE53935);
  static const warning = Color(0xFFFFA726);
  static const info = Color(0xFF1E88E5);
  static const success = Color(0xFF43A047);

  static const background = Color(0xFFF4F6F9);
  static const card = Color(0xFFFFFFFF);
  static const border = Color(0xFFE5E7EB);
  static const divider = Color(0xFFF0F0F0);

  static const textPrimary = Color(0xFF1A1A2E);
  static const textSecondary = Color(0xFF6B7280);
  static const textHint = Color(0xFF9CA3AF);
  static const textOnPrimary = Color(0xFFFFFFFF);

  static const shimmerBase = Color(0xFFE0E0E0);
  static const shimmerHighlight = Color(0xFFF5F5F5);

  // Status colors
  static const statusOpen = Color(0xFF9E9E9E);
  static const statusActive = Color(0xFF00A651);
  static const statusDanger = Color(0xFFE53935);
  static const statusCompleted = Color(0xFF1E88E5);
  static const statusWarning = Color(0xFFF5A623);

  static const LinearGradient primaryGradient = LinearGradient(
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
    colors: [Color(0xFF00A651), Color(0xFF1A3C5E)],
  );

  static const LinearGradient heroGradient = LinearGradient(
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
    colors: [Color(0xFF00C461), Color(0xFF00A651), Color(0xFF1A3C5E)],
    stops: [0.0, 0.5, 1.0],
  );
}
