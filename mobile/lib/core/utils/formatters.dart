import 'package:intl/intl.dart';

String formatDate(DateTime date) => DateFormat('dd MMM yyyy', 'id').format(date);
String formatDateShort(DateTime date) => DateFormat('dd MMM', 'id').format(date);
String formatDateTime(DateTime date) => DateFormat('dd MMM yyyy, HH:mm', 'id').format(date);
String formatCurrency(num amount) =>
    NumberFormat.currency(locale: 'id_ID', symbol: 'Rp ', decimalDigits: 0).format(amount);

String severityLabel(String s) {
  switch (s) {
    case 'I': return 'Kelas I';
    case 'II': return 'Kelas II';
    case 'III': return 'Kelas III';
    case 'IV': return 'Kelas IV';
    default: return s;
  }
}

String statusLabel(String s) {
  final labels = {
    'draft': 'Draft', 'submitted': 'Diajukan', 'approved': 'Disetujui',
    'active': 'Aktif', 'closed': 'Selesai', 'rejected': 'Ditolak',
    'revoked': 'Dicabut', 'expired': 'Kedaluwarsa',
    'open': 'Terbuka', 'investigating': 'Investigasi',
    'safe': 'Aman', 'at_risk': 'Berisiko',
  };
  return labels[s] ?? s;
}
