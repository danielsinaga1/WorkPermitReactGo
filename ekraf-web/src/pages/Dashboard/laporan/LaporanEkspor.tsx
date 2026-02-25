import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Tag } from 'primereact/tag';
import { Card } from 'primereact/card';
import { BreadCrumb } from 'primereact/breadcrumb';
import { Dropdown } from 'primereact/dropdown';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { ProgressBar } from 'primereact/progressbar';

const EXPORT_MODULES = [
  { id: 1, title: 'Data Pelaku DISPOPAR', desc: 'Export seluruh data pelaku ekonomi kreatif', format: 'Excel, CSV', icon: 'pi pi-users', color: '#3B82F6', records: 10450, lastExport: '2025-06-25 10:30' },
  { id: 2, title: 'Data Produk', desc: 'Export katalog dan data produk unggulan', format: 'Excel, CSV', icon: 'pi pi-box', color: '#10B981', records: 3280, lastExport: '2025-06-24 14:15' },
  { id: 3, title: 'Data Event & Pelatihan', desc: 'Export data event, pelatihan, dan peserta', format: 'Excel, PDF', icon: 'pi pi-calendar', color: '#F59E0B', records: 156, lastExport: '2025-06-20 09:00' },
  { id: 4, title: 'Laporan Omzet', desc: 'Export laporan omzet pelaku per subsektor', format: 'Excel, PDF', icon: 'pi pi-chart-line', color: '#6366F1', records: 8920, lastExport: '2025-06-23 16:45' },
  { id: 5, title: 'Data Bantuan & Hibah', desc: 'Export data penerima bantuan alat & modal', format: 'Excel, CSV', icon: 'pi pi-gift', color: '#EF4444', records: 534, lastExport: '2025-06-18 11:20' },
  { id: 6, title: 'Statistik Subsektor', desc: 'Export statistik per subsektor DISPOPAR', format: 'Excel, PDF', icon: 'pi pi-chart-bar', color: '#8B5CF6', records: 17, lastExport: '2025-06-22 08:30' },
];

const EXPORT_HISTORY = [
  { id: 1, modul: 'Data Pelaku DISPOPAR', format: 'Excel', ukuran: '12.4 MB', waktu: '2025-06-25 10:30:00', user: 'Admin Utama', status: 'selesai' },
  { id: 2, modul: 'Laporan Omzet', format: 'PDF', ukuran: '3.2 MB', waktu: '2025-06-23 16:45:00', user: 'Admin Utama', status: 'selesai' },
  { id: 3, modul: 'Data Produk', format: 'CSV', ukuran: '8.1 MB', waktu: '2025-06-24 14:15:00', user: 'Editor Konten', status: 'selesai' },
  { id: 4, modul: 'Data Event & Pelatihan', format: 'Excel', ukuran: '1.5 MB', waktu: '2025-06-20 09:00:00', user: 'Admin Utama', status: 'selesai' },
  { id: 5, modul: 'Statistik Subsektor', format: 'PDF', ukuran: '2.8 MB', waktu: '2025-06-22 08:30:00', user: 'Admin Utama', status: 'gagal' },
  { id: 6, modul: 'Data Bantuan & Hibah', format: 'Excel', ukuran: '4.6 MB', waktu: '2025-06-18 11:20:00', user: 'Pengelola', status: 'selesai' },
];

const FORMAT_OPTIONS = [
  { label: 'Semua Format', value: '' },
  { label: 'Excel (.xlsx)', value: 'Excel' },
  { label: 'CSV (.csv)', value: 'CSV' },
  { label: 'PDF (.pdf)', value: 'PDF' },
];

const LaporanEkspor = () => {
  const navigate = useNavigate();
  const [globalFilter, setGlobalFilter] = useState('');
  const [formatFilter, setFormatFilter] = useState('');
  const [history] = useState(EXPORT_HISTORY);

  const breadcrumbHome = { icon: 'pi pi-home', command: () => navigate('/dashboard') };
  const breadcrumbItems = [{ label: 'Laporan & Ekspor' }, { label: 'Ekspor Data' }];

  const filteredHistory = history.filter((h) => {
    const matchSearch = h.modul.toLowerCase().includes(globalFilter.toLowerCase());
    const matchFormat = !formatFilter || h.format === formatFilter;
    return matchSearch && matchFormat;
  });

  const totalRecords = EXPORT_MODULES.reduce((a, b) => a + b.records, 0);

  /* ---------- KPI Cards ---------- */
  const kpiCards = [
    { label: 'Modul Tersedia', value: EXPORT_MODULES.length, icon: 'pi pi-th-large', color: '#3B82F6' },
    { label: 'Total Record', value: totalRecords.toLocaleString(), icon: 'pi pi-database', color: '#10B981' },
    { label: 'Riwayat Export', value: history.length, icon: 'pi pi-history', color: '#F59E0B' },
    { label: 'Export Gagal', value: history.filter((h) => h.status === 'gagal').length, icon: 'pi pi-exclamation-circle', color: '#EF4444' },
  ];

  /* ---------- History Column Templates ---------- */
  const waktuHistoryTemplate = (row: (typeof EXPORT_HISTORY)[0]) => (
    <div>
      <div style={{ fontWeight: 500, fontSize: '0.85rem' }}>{new Date(row.waktu).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
      <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>{row.waktu.split(' ')[1]}</div>
    </div>
  );

  const formatTagTemplate = (row: (typeof EXPORT_HISTORY)[0]) => {
    const colors: Record<string, string> = { Excel: '#10B981', CSV: '#3B82F6', PDF: '#EF4444' };
    return <Tag value={row.format} rounded style={{ background: `${colors[row.format]}20`, color: colors[row.format], fontWeight: 600 }} />;
  };

  const statusHistoryTemplate = (row: (typeof EXPORT_HISTORY)[0]) => (
    <Tag value={row.status === 'selesai' ? 'Selesai' : 'Gagal'} severity={row.status === 'selesai' ? 'success' : 'danger'} rounded />
  );

  const actionHistoryTemplate = (row: (typeof EXPORT_HISTORY)[0]) => (
    <Button icon="pi pi-download" rounded text severity="info" tooltip="Download Ulang" tooltipOptions={{ position: 'top' }} disabled={row.status === 'gagal'} />
  );

  const historyHeader = (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center', justifyContent: 'space-between' }}>
      <span className="p-input-icon-left">
        <i className="pi pi-search" />
        <InputText placeholder="Cari riwayat..." value={globalFilter} onChange={(e) => setGlobalFilter(e.target.value)} style={{ width: 240 }} />
      </span>
      <Dropdown value={formatFilter} options={FORMAT_OPTIONS} onChange={(e) => setFormatFilter(e.value)} placeholder="Filter Format" style={{ width: 180 }} />
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <ConfirmDialog />

      <BreadCrumb model={breadcrumbItems} home={breadcrumbHome} />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
        <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 700 }}>Ekspor Data</h2>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
        {kpiCards.map((kpi) => (
          <Card key={kpi.label} style={{ flex: '1 1 180px', borderLeft: `4px solid ${kpi.color}` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <i className={kpi.icon} style={{ fontSize: '1.8rem', color: kpi.color }} />
              <div>
                <div style={{ fontSize: '1.6rem', fontWeight: 700 }}>{kpi.value}</div>
                <div style={{ color: '#6b7280', fontSize: '0.85rem' }}>{kpi.label}</div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Export Module Cards */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
        {EXPORT_MODULES.map((mod) => (
          <Card key={mod.id} style={{ flex: '1 1 320px', borderLeft: `4px solid ${mod.color}` }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                <i className={mod.icon} style={{ fontSize: '2rem', color: mod.color, marginTop: 2 }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: '1.05rem' }}>{mod.title}</div>
                  <div style={{ fontSize: '0.85rem', color: '#6b7280', marginTop: 4 }}>{mod.desc}</div>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#9ca3af' }}>
                <span><i className="pi pi-database" style={{ marginRight: 4 }} />{mod.records.toLocaleString()} record</span>
                <span>Format: {mod.format}</span>
              </div>

              <ProgressBar value={100} showValue={false} style={{ height: 4 }} color={mod.color} />

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.75rem', color: '#9ca3af' }}>
                  Terakhir: {new Date(mod.lastExport).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                </span>
                <div style={{ display: 'flex', gap: 6 }}>
                  <Button icon="pi pi-file-excel" size="small" severity="success" outlined tooltip="Export Excel" tooltipOptions={{ position: 'top' }} onClick={() => confirmDialog({ message: `Export ${mod.title} ke format Excel?`, header: 'Konfirmasi Export', icon: 'pi pi-download', accept: () => {} })} />
                  <Button icon="pi pi-file-pdf" size="small" severity="danger" outlined tooltip="Export PDF" tooltipOptions={{ position: 'top' }} onClick={() => confirmDialog({ message: `Export ${mod.title} ke format PDF?`, header: 'Konfirmasi Export', icon: 'pi pi-download', accept: () => {} })} />
                  <Button icon="pi pi-file" size="small" severity="info" outlined tooltip="Export CSV" tooltipOptions={{ position: 'top' }} onClick={() => confirmDialog({ message: `Export ${mod.title} ke format CSV?`, header: 'Konfirmasi Export', icon: 'pi pi-download', accept: () => {} })} />
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Export History Table */}
      <Card>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
          <i className="pi pi-history" style={{ fontSize: '1.2rem', color: '#6366F1' }} />
          <span style={{ fontSize: '1.1rem', fontWeight: 700 }}>Riwayat Export</span>
        </div>

        <DataTable value={filteredHistory} paginator rows={10} header={historyHeader} emptyMessage="Belum ada riwayat export" stripedRows removableSort dataKey="id" rowHover>
          <Column header="Waktu" body={waktuHistoryTemplate} sortable sortField="waktu" style={{ minWidth: 130 }} />
          <Column field="modul" header="Modul" sortable style={{ minWidth: 200 }} />
          <Column header="Format" body={formatTagTemplate} sortable sortField="format" style={{ minWidth: 100 }} />
          <Column field="ukuran" header="Ukuran" sortable style={{ minWidth: 100 }} />
          <Column field="user" header="User" sortable style={{ minWidth: 140 }} />
          <Column header="Status" body={statusHistoryTemplate} sortable sortField="status" style={{ minWidth: 100 }} />
          <Column header="Aksi" body={actionHistoryTemplate} style={{ minWidth: 80 }} />
        </DataTable>
      </Card>
    </div>
  );
};

export default LaporanEkspor;
