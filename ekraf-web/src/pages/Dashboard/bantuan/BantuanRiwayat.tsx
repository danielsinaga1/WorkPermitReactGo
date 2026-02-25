import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Tag } from 'primereact/tag';
import { Card } from 'primereact/card';
import { BreadCrumb } from 'primereact/breadcrumb';
import { Avatar } from 'primereact/avatar';

const DEMO_DATA = [
  { id: 1, nama: 'Siti Rahayu', jenis: 'Bantuan Alat', nilai: 5000000, tanggal: '2025-05-20', status: 'diterima', subsektor: 'Fashion' },
  { id: 2, nama: 'Ahmad Bakri', jenis: 'Bantuan Modal', nilai: 15000000, tanggal: '2025-04-10', status: 'diterima', subsektor: 'Kuliner' },
  { id: 3, nama: 'Dian Permata', jenis: 'Bantuan Alat', nilai: 8000000, tanggal: '2025-06-15', status: 'proses', subsektor: 'Fotografi' },
  { id: 4, nama: 'Bambang Sutrisno', jenis: 'Bantuan Modal', nilai: 20000000, tanggal: '2025-03-05', status: 'diterima', subsektor: 'Kriya' },
  { id: 5, nama: 'Wati Kurniasih', jenis: 'Bantuan Alat', nilai: 12000000, tanggal: '2025-07-01', status: 'ditolak', subsektor: 'Desain' },
  { id: 6, nama: 'Rudi Hermawan', jenis: 'Bantuan Modal', nilai: 10000000, tanggal: '2025-02-14', status: 'diterima', subsektor: 'Musik' },
  { id: 7, nama: 'Maya Pertiwi', jenis: 'Bantuan Alat', nilai: 7500000, tanggal: '2025-01-20', status: 'diterima', subsektor: 'Kuliner' },
];

const STATUS_MAP: Record<string, { severity: 'success' | 'warning' | 'danger'; label: string }> = {
  diterima: { severity: 'success', label: 'Diterima' },
  proses: { severity: 'warning', label: 'Dalam Proses' },
  ditolak: { severity: 'danger', label: 'Ditolak' },
};

const JENIS_OPTIONS = [
  { label: 'Semua Jenis', value: '' },
  { label: 'Bantuan Modal', value: 'Bantuan Modal' },
  { label: 'Bantuan Alat', value: 'Bantuan Alat' },
];

const TAHUN_OPTIONS = [
  { label: 'Semua Tahun', value: '' },
  { label: '2025', value: '2025' },
  { label: '2024', value: '2024' },
];

const BantuanRiwayat = () => {
  const navigate = useNavigate();
  const [data] = useState(DEMO_DATA);
  const [globalFilter, setGlobalFilter] = useState('');
  const [jenisFilter, setJenisFilter] = useState('');
  const [tahunFilter, setTahunFilter] = useState('');

  const breadcrumbHome = { icon: 'pi pi-home', command: () => navigate('/dashboard') };
  const breadcrumbItems = [
    { label: 'Bantuan & Hibah' },
    { label: 'Riwayat Penerima' },
  ];

  let filtered = data;
  if (jenisFilter) filtered = filtered.filter(d => d.jenis === jenisFilter);
  if (tahunFilter) filtered = filtered.filter(d => d.tanggal.startsWith(tahunFilter));

  const totalNilai = data.filter(d => d.status === 'diterima').reduce((a, d) => a + d.nilai, 0);
  const stats = [
    { label: 'Total Penerima', value: data.filter(d => d.status === 'diterima').length, icon: 'pi pi-users', color: '#6366f1', bg: '#eef2ff' },
    { label: 'Total Tersalurkan', value: `Rp ${(totalNilai / 1e6).toFixed(0)}jt`, icon: 'pi pi-wallet', color: '#22c55e', bg: '#ecfdf5' },
    { label: 'Dalam Proses', value: data.filter(d => d.status === 'proses').length, icon: 'pi pi-clock', color: '#f59e0b', bg: '#fffbeb' },
    { label: 'Ditolak', value: data.filter(d => d.status === 'ditolak').length, icon: 'pi pi-times-circle', color: '#ef4444', bg: '#fef2f2' },
  ];

  const namaTemplate = (row: typeof DEMO_DATA[0]) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
      <Avatar label={row.nama.charAt(0)} shape="circle" style={{ backgroundColor: '#6366f1', color: '#fff' }} />
      <div>
        <div style={{ fontWeight: 600, color: '#1e293b' }}>{row.nama}</div>
        <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{row.subsektor}</div>
      </div>
    </div>
  );

  const jenisTemplate = (row: typeof DEMO_DATA[0]) => (
    <Tag value={row.jenis} severity={row.jenis === 'Bantuan Modal' ? 'info' : 'warning'} />
  );

  const nilaiTemplate = (row: typeof DEMO_DATA[0]) => (
    <span style={{ fontWeight: 600, color: '#334155' }}>Rp {row.nilai.toLocaleString('id-ID')}</span>
  );

  const statusTemplate = (row: typeof DEMO_DATA[0]) => {
    const s = STATUS_MAP[row.status] || { severity: 'info' as const, label: row.status };
    return <Tag value={s.label} severity={s.severity} />;
  };

  const tanggalTemplate = (row: typeof DEMO_DATA[0]) =>
    new Date(row.tanggal).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });

  const aksiTemplate = () => (
    <div style={{ display: 'flex', gap: '4px' }}>
      <Button icon="pi pi-eye" rounded text severity="info" tooltip="Detail" tooltipOptions={{ position: 'top' }} />
      <Button icon="pi pi-file-export" rounded text severity="success" tooltip="Export" tooltipOptions={{ position: 'top' }} />
    </div>
  );

  const tableHeader = (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
      <h3 style={{ margin: 0, fontWeight: 600, color: '#1e293b', fontSize: '1rem' }}>
        <i className="pi pi-history" style={{ marginRight: '8px' }} />Riwayat Penerima Bantuan
      </h3>
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
        <span className="p-input-icon-left">
          <i className="pi pi-search" />
          <InputText placeholder="Cari penerima..." value={globalFilter} onChange={(e) => setGlobalFilter(e.target.value)} style={{ width: '200px' }} />
        </span>
        <Dropdown value={jenisFilter} options={JENIS_OPTIONS} onChange={(e) => setJenisFilter(e.value)} style={{ width: '160px' }} />
        <Dropdown value={tahunFilter} options={TAHUN_OPTIONS} onChange={(e) => setTahunFilter(e.value)} style={{ width: '140px' }} />
      </div>
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <BreadCrumb model={breadcrumbItems} home={breadcrumbHome} />

      <div className="grid">
        {stats.map((s, i) => (
          <div className="col-12 md:col-6 lg:col-3" key={i}>
            <Card style={{ borderLeft: `4px solid ${s.color}` }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{ width: 48, height: 48, borderRadius: 12, backgroundColor: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <i className={s.icon} style={{ fontSize: '1.25rem', color: s.color }} />
                </div>
                <div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1e293b' }}>{s.value}</div>
                  <div style={{ fontSize: '0.85rem', color: '#64748b' }}>{s.label}</div>
                </div>
              </div>
            </Card>
          </div>
        ))}
      </div>

      <Card>
        <DataTable value={filtered} header={tableHeader} globalFilter={globalFilter} paginator rows={10} rowsPerPageOptions={[5, 10, 25]} stripedRows removableSort responsiveLayout="scroll" emptyMessage="Belum ada riwayat penerima bantuan">
          <Column header="No" body={(_r, o) => (o.rowIndex ?? 0) + 1} style={{ width: '50px' }} />
          <Column header="Nama Penerima" body={namaTemplate} sortable sortField="nama" />
          <Column header="Jenis Bantuan" body={jenisTemplate} sortable sortField="jenis" style={{ width: '150px' }} />
          <Column header="Nilai" body={nilaiTemplate} sortable sortField="nilai" />
          <Column header="Tanggal" body={tanggalTemplate} sortable sortField="tanggal" />
          <Column header="Status" body={statusTemplate} sortable sortField="status" style={{ width: '130px' }} />
          <Column header="Aksi" body={aksiTemplate} style={{ width: '100px' }} />
        </DataTable>
      </Card>
    </div>
  );
};

export default BantuanRiwayat;
