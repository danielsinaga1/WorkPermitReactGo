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
import { InputTextarea } from 'primereact/inputtextarea';
import { Calendar } from 'primereact/calendar';
import { PageHeader, TableCard, FilterBar } from '../../../components/ui';
import { safetyObservationService } from '../../../services/hseService';
import type { SafetyObservation, SeverityLevel } from '../../../types/workPermitTypes';

const HAZARD_CATEGORIES = [
  { label: 'Semua Hazard', value: '' },
  { label: 'Unsafe Condition', value: 'unsafe_condition' },
  { label: 'Near Miss', value: 'near_miss' },
  { label: 'Environmental', value: 'environmental' },
  { label: 'Housekeeping', value: 'housekeeping' },
];

const SEVERITY_OPTIONS = [
  { label: 'Semua Severity', value: '' },
  { label: 'Low', value: 'low' },
  { label: 'Medium', value: 'medium' },
  { label: 'High', value: 'high' },
  { label: 'Critical', value: 'critical' },
];

const HAZARD_CATEGORY_LIST = ['unsafe_condition', 'near_miss', 'environmental', 'housekeeping'];

const catStyle = (cat: string): React.CSSProperties => {
  const map: Record<string, { bg: string; color: string }> = {
    unsafe_condition: { bg: '#fee2e2', color: '#991b1b' },
    near_miss: { bg: '#fce7f3', color: '#831843' },
    environmental: { bg: '#dbeafe', color: '#1e40af' },
    housekeeping: { bg: '#e0e7ff', color: '#3730a3' },
  };
  const m = map[cat] ?? { bg: '#f1f5f9', color: '#334155' };
  return { background: m.bg, color: m.color, borderRadius: 6, padding: '2px 8px', fontSize: 11, fontWeight: 600 };
};

const HazardObservationList = () => {
  const navigate = useNavigate();
  const toast = useRef<Toast>(null);

  const [data, setData] = useState<SafetyObservation[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalRecords, setTotalRecords] = useState(0);
  const [page, setPage] = useState(1);
  const [catFilter, setCatFilter] = useState('');
  const [sevFilter, setSevFilter] = useState('');

  const [showDialog, setShowDialog] = useState(false);
  const [form, setForm] = useState({
    category: 'unsafe_condition' as 'unsafe_condition' | 'near_miss' | 'environmental' | 'housekeeping',
    severity: 'medium' as SeverityLevel,
    description: '',
    reported_by_name: '',
    exact_location: '',
    observed_at: new Date(),
  });

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const resp = await safetyObservationService.list({
        category: catFilter || undefined,
        severity: sevFilter || undefined,
        page,
        per_page: 30,
      });
      const filtered = resp.data.filter((o) =>
        catFilter ? o.category === catFilter : HAZARD_CATEGORY_LIST.includes(o.category)
      );
      setData(filtered);
      setTotalRecords(filtered.length === resp.data.length ? resp.total : filtered.length);
    } catch {
      toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Gagal memuat hazard observations' });
    } finally {
      setLoading(false);
    }
  }, [catFilter, sevFilter, page]);

  useEffect(() => { loadData(); }, [loadData]);

  const handleCreate = async () => {
    if (!form.reported_by_name || !form.description) {
      toast.current?.show({ severity: 'warn', summary: 'Validasi', detail: 'Pelapor & deskripsi wajib diisi' });
      return;
    }
    try {
      const created = await safetyObservationService.create({
        ...form,
        type: 'observation',
        observed_at: form.observed_at.toISOString(),
      } as Partial<SafetyObservation>);
      toast.current?.show({ severity: 'success', summary: 'Tersimpan', detail: `Hazard ${created.observation_number} dicatat` });
      setShowDialog(false);
      loadData();
    } catch {
      toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Gagal menyimpan' });
    }
  };

  const sevSeverity = (s: SeverityLevel) => {
    switch (s) { case 'low': return 'success'; case 'medium': return 'warning'; case 'high': return 'danger'; case 'critical': return 'danger'; default: return 'info'; }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <Toast ref={toast} />

      <PageHeader
        title="Hazard Observation"
        subtitle="Pelaporan kondisi tidak aman, near miss, dan temuan lingkungan kerja yang berpotensi menimbulkan bahaya"
        icon="pi pi-flag-fill"
        accentGradient="linear-gradient(135deg, #ef4444, #f97316)"
        actions={
          <Button
            label="Laporkan Hazard"
            icon="pi pi-plus"
            style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.3)', color: '#fff' }}
            onClick={() => setShowDialog(true)}
          />
        }
      />

      <TableCard>
        <FilterBar>
          <Dropdown value={catFilter} options={HAZARD_CATEGORIES} onChange={(e) => { setCatFilter(e.value); setPage(1); }} className="w-14rem" />
          <Dropdown value={sevFilter} options={SEVERITY_OPTIONS} onChange={(e) => { setSevFilter(e.value); setPage(1); }} className="w-12rem" />
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
            emptyMessage="Belum ada hazard observation."
            style={{ border: 'none' }}
          >
            <Column field="observation_number" header="No." style={{ width: '10%', fontFamily: 'monospace', fontSize: 12 }} />
            <Column
              header="Kategori"
              body={(r) => <span style={catStyle(r.category)}>{r.category.replace(/_/g, ' ')}</span>}
              style={{ width: '14%' }}
            />
            <Column
              header="Severity"
              body={(r) => <Tag value={r.severity} severity={sevSeverity(r.severity) as any} />}
              style={{ width: '9%' }}
            />
            <Column
              field="description"
              header="Deskripsi"
              body={(r) => <span style={{ fontSize: 12, color: '#334155' }}>{r.description}</span>}
              style={{ width: '27%' }}
            />
            <Column
              header="Lokasi"
              body={(r) => r.exact_location ?? <span style={{ color: '#94a3b8' }}>—</span>}
              style={{ width: '13%' }}
            />
            <Column
              header="Tanggal"
              body={(r) => new Date(r.observed_at).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
              style={{ width: '11%' }}
            />
            <Column field="reported_by_name" header="Pelapor" style={{ width: '10%' }} />
            <Column
              header="Status"
              body={(r) => (
                <Tag
                  value={r.status.replace(/_/g, ' ')}
                  severity={['closed', 'verified'].includes(r.status) ? 'success' : 'info'}
                />
              )}
              style={{ width: '6%' }}
            />
          </DataTable>
        </div>
      </TableCard>

      <Dialog
        header={
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: 'linear-gradient(135deg,#ef4444,#f97316)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <i className="pi pi-flag-fill" style={{ color: '#fff', fontSize: 14 }} />
            </div>
            <span>Laporkan Hazard / Unsafe Condition</span>
          </div>
        }
        visible={showDialog}
        onHide={() => setShowDialog(false)}
        style={{ width: '38rem' }}
        footer={(
          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
            <Button label="Batal" severity="secondary" text onClick={() => setShowDialog(false)} />
            <Button label="Simpan Laporan" icon="pi pi-check" onClick={handleCreate} />
          </div>
        )}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={{ display: 'block', marginBottom: 6, fontWeight: 600, fontSize: 13 }}>Kategori Hazard</label>
              <Dropdown value={form.category} options={HAZARD_CATEGORIES.slice(1)} onChange={(e) => setForm((p) => ({ ...p, category: e.value }))} className="w-full" />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: 6, fontWeight: 600, fontSize: 13 }}>Tingkat Severity</label>
              <Dropdown value={form.severity} options={SEVERITY_OPTIONS.slice(1)} onChange={(e) => setForm((p) => ({ ...p, severity: e.value }))} className="w-full" />
            </div>
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: 6, fontWeight: 600, fontSize: 13 }}>Tanggal & Waktu Ditemukan</label>
            <Calendar value={form.observed_at} onChange={(e) => setForm((p) => ({ ...p, observed_at: e.value as Date }))} showTime hourFormat="24" className="w-full" />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={{ display: 'block', marginBottom: 6, fontWeight: 600, fontSize: 13 }}>Pelapor</label>
              <InputText value={form.reported_by_name} onChange={(e) => setForm((p) => ({ ...p, reported_by_name: e.target.value }))} className="w-full" />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: 6, fontWeight: 600, fontSize: 13 }}>Lokasi Bahaya</label>
              <InputText value={form.exact_location} onChange={(e) => setForm((p) => ({ ...p, exact_location: e.target.value }))} className="w-full" />
            </div>
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: 6, fontWeight: 600, fontSize: 13 }}>Deskripsi Bahaya</label>
            <InputTextarea rows={4} value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} className="w-full" placeholder="Jelaskan kondisi berbahaya yang ditemukan..." />
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default HazardObservationList;
