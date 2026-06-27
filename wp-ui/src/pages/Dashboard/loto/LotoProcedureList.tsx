import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { Tag } from 'primereact/tag';
import { Toast } from 'primereact/toast';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { TabView, TabPanel } from 'primereact/tabview';
import { PageHeader, TableCard, FilterBar } from '../../../components/ui';
import { lotoService } from '../../../services/lotoService';
import type { LotoProcedure, HseFilters } from '../../../types/workPermitTypes';

const STATUS_OPTIONS = [
  { label: 'Semua Status', value: '' },
  { label: 'Draft', value: 'draft' },
  { label: 'Active', value: 'active' },
  { label: 'Under Review', value: 'under_review' },
  { label: 'Archived', value: 'archived' },
];

const LotoProcedureList = () => {
  const navigate = useNavigate();
  const toast = useRef<Toast>(null);
  const [data, setData] = useState<LotoProcedure[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalRecords, setTotalRecords] = useState(0);
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');
  const [selected, setSelected] = useState<LotoProcedure | null>(null);
  const [showScan, setShowScan] = useState(false);
  const [scanCode, setScanCode] = useState('');
  const [scanType, setScanType] = useState<'qr' | 'nfc'>('qr');

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const filters: HseFilters = { status: statusFilter || undefined, page, per_page: 15 };
      const resp = await lotoService.list(filters);
      setData(resp.data);
      setTotalRecords(resp.total);
    } catch {
      toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Gagal memuat prosedur LOTO' });
    } finally {
      setLoading(false);
    }
  }, [statusFilter, page]);

  useEffect(() => { loadData(); }, [loadData]);

  const handleViewDetail = async (id: number) => {
    try {
      const detail = await lotoService.detail(id);
      setSelected(detail);
    } catch {
      toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Gagal memuat prosedur' });
    }
  };

  const handleScan = async () => {
    if (!scanCode) return;
    try {
      const point = scanType === 'qr' ? await lotoService.scanQr(scanCode) : await lotoService.scanNfc(scanCode);
      toast.current?.show({ severity: 'success', summary: 'Ditemukan', detail: `LOTO Point: ${point.point_name}` });
      setShowScan(false);
      setScanCode('');
    } catch {
      toast.current?.show({ severity: 'error', summary: 'Tidak Ditemukan', detail: 'Tidak ada LOTO point yang cocok' });
    }
  };

  const statusSev = (s: string) => {
    switch (s) { case 'draft': return 'secondary'; case 'active': return 'success'; case 'under_review': return 'warning'; case 'archived': return 'info'; default: return 'info'; }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <Toast ref={toast} />

      <PageHeader
        title="LOTO Procedures"
        subtitle="Lockout/Tagout — prosedur isolasi energi berbahaya untuk keselamatan perawatan mesin dan peralatan"
        icon="pi pi-lock"
        accentGradient="linear-gradient(135deg, #14b8a6, #0f766e)"
        actions={
          <div style={{ display: 'flex', gap: 8 }}>
            <Button
              label="Scan QR/NFC"
              icon="pi pi-qrcode"
              style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.25)', color: '#fff' }}
              onClick={() => setShowScan(true)}
            />
            <Button
              label="Prosedur Baru"
              icon="pi pi-plus"
              style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.3)', color: '#fff' }}
              onClick={() => navigate('/dashboard/loto/create')}
            />
          </div>
        }
      />

      <TableCard>
        <FilterBar>
          <Dropdown value={statusFilter} options={STATUS_OPTIONS} onChange={(e) => { setStatusFilter(e.value); setPage(1); }} className="w-12rem" />
          <Button icon="pi pi-refresh" text rounded severity="secondary" onClick={loadData} loading={loading} tooltip="Refresh" />
        </FilterBar>

        <div style={{ padding: '0 4px' }}>
          <DataTable
            value={data}
            loading={loading}
            lazy paginator rows={15} totalRecords={totalRecords}
            first={(page - 1) * 15}
            onPage={(e) => setPage((e.first ?? 0) / 15 + 1)}
            stripedRows size="small"
            emptyMessage="Belum ada prosedur LOTO."
            style={{ border: 'none' }}
          >
            <Column field="procedure_number" header="No. Prosedur" sortable style={{ width: '13%', fontFamily: 'monospace', fontSize: 12 }} />
            <Column field="title" header="Judul" style={{ width: '22%' }} />
            <Column field="machine_equipment" header="Mesin / Peralatan" style={{ width: '18%' }} />
            <Column
              field="energy_sources"
              header="Sumber Energi"
              body={(r) => (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                  {(r.energy_sources || []).map((e: string, i: number) => (
                    <Tag key={i} value={e} severity="info" />
                  ))}
                </div>
              )}
              style={{ width: '18%' }}
            />
            <Column
              field="status"
              header="Status"
              body={(r) => <Tag value={r.status.replace(/_/g, ' ')} severity={statusSev(r.status) as any} />}
              style={{ width: '10%' }}
            />
            <Column
              header="Terkunci"
              body={(r) =>
                r.is_fully_locked
                  ? <span style={{ color: '#10b981', fontWeight: 600, fontSize: 13 }}>🔒 Terkunci</span>
                  : <span style={{ color: '#ef4444', fontSize: 13 }}>🔓 Terbuka</span>
              }
              style={{ width: '10%' }}
            />
            <Column
              header=""
              style={{ width: '9%' }}
              body={(r: LotoProcedure) => (
                <Button icon="pi pi-eye" rounded text size="small" onClick={() => handleViewDetail(r.id)} tooltip="Lihat detail" />
              )}
            />
          </DataTable>
        </div>
      </TableCard>

      {/* Detail Dialog */}
      <Dialog
        header={
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: 'linear-gradient(135deg,#14b8a6,#0f766e)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <i className="pi pi-lock" style={{ color: '#fff', fontSize: 14 }} />
            </div>
            <span>{selected?.procedure_number ?? 'Detail Prosedur LOTO'}</span>
          </div>
        }
        visible={!!selected}
        onHide={() => setSelected(null)}
        style={{ width: '52rem' }}
        maximizable
      >
        {selected && (
          <TabView>
            <TabPanel header="Overview">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, background: '#f8fafc', padding: 16, borderRadius: 10 }}>
                <div><span style={{ fontSize: 11, color: '#64748b', display: 'block', marginBottom: 2 }}>JUDUL</span><strong style={{ fontSize: 13 }}>{selected.title}</strong></div>
                <div><span style={{ fontSize: 11, color: '#64748b', display: 'block', marginBottom: 2 }}>MESIN / PERALATAN</span><strong style={{ fontSize: 13 }}>{selected.machine_equipment}</strong></div>
                <div><span style={{ fontSize: 11, color: '#64748b', display: 'block', marginBottom: 2 }}>DISIAPKAN OLEH</span><strong style={{ fontSize: 13 }}>{selected.prepared_by}</strong></div>
                <div><span style={{ fontSize: 11, color: '#64748b', display: 'block', marginBottom: 2 }}>STATUS</span><Tag value={selected.status} severity={statusSev(selected.status) as any} /></div>
                <div style={{ gridColumn: '1 / -1' }}>
                  <span style={{ fontSize: 11, color: '#64748b', display: 'block', marginBottom: 4 }}>SUMBER ENERGI</span>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                    {(selected.energy_sources || []).map((e, i) => <Tag key={i} value={e} severity="info" />)}
                  </div>
                </div>
                {selected.description && (
                  <div style={{ gridColumn: '1 / -1' }}>
                    <span style={{ fontSize: 11, color: '#64748b', display: 'block', marginBottom: 2 }}>DESKRIPSI</span>
                    <p style={{ fontSize: 13, margin: 0, lineHeight: 1.6 }}>{selected.description}</p>
                  </div>
                )}
              </div>
            </TabPanel>
            <TabPanel header="Titik Isolasi">
              <DataTable value={selected.points || []} emptyMessage="Belum ada titik isolasi." stripedRows size="small">
                <Column field="sequence_order" header="#" style={{ width: '5%' }} />
                <Column field="point_name" header="Nama Titik" />
                <Column field="energy_type" header="Energi" body={(r) => <Tag value={r.energy_type} severity="info" />} />
                <Column field="isolation_device" header="Perangkat" />
                <Column field="isolation_method" header="Metode" />
                <Column header="Status" body={(r) =>
                  r.active_lock
                    ? <Tag value="TERKUNCI" severity="success" icon="pi pi-lock" />
                    : <Tag value="TERBUKA" severity="danger" icon="pi pi-lock-open" />
                } />
              </DataTable>
            </TabPanel>
            <TabPanel header="Langkah Isolasi">
              <ol style={{ paddingLeft: 20 }}>
                {(selected.isolation_steps || []).map((step: Record<string, unknown>, i: number) => (
                  <li key={i} style={{ paddingBottom: 10 }}>
                    <strong style={{ fontSize: 13 }}>{String(step.action || step.step || `Langkah ${i + 1}`)}</strong>
                    {step.description && <p style={{ fontSize: 12, color: '#64748b', marginTop: 2, marginBottom: 0 }}>{String(step.description)}</p>}
                  </li>
                ))}
              </ol>
            </TabPanel>
          </TabView>
        )}
      </Dialog>

      {/* Scan Dialog */}
      <Dialog
        header="Scan QR Code / NFC Tag"
        visible={showScan}
        onHide={() => setShowScan(false)}
        style={{ width: '26rem' }}
        footer={(
          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
            <Button label="Batal" severity="secondary" text onClick={() => setShowScan(false)} />
            <Button label="Cari" icon="pi pi-search" onClick={handleScan} />
          </div>
        )}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <label style={{ display: 'block', marginBottom: 6, fontWeight: 600, fontSize: 13 }}>Tipe Scan</label>
            <Dropdown value={scanType} options={[{ label: 'QR Code', value: 'qr' }, { label: 'NFC Tag', value: 'nfc' }]} onChange={(e) => setScanType(e.value)} className="w-full" />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: 6, fontWeight: 600, fontSize: 13 }}>{scanType === 'qr' ? 'QR Code' : 'NFC Tag ID'}</label>
            <InputText value={scanCode} onChange={(e) => setScanCode(e.target.value)} className="w-full" placeholder={scanType === 'qr' ? 'Masukkan atau scan QR code...' : 'Tap atau masukkan NFC tag ID...'} autoFocus />
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default LotoProcedureList;
