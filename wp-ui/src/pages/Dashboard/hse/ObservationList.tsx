import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { Tag } from 'primereact/tag';
import { Toast } from 'primereact/toast';
import { Dialog } from 'primereact/dialog';
import { InputTextarea } from 'primereact/inputtextarea';
import { InputText } from 'primereact/inputtext';
import { Calendar } from 'primereact/calendar';
import { PageHeader, TableCard, FilterBar } from '../../../components/ui';
import { safetyObservationService } from '../../../services/hseService';
import type { SafetyObservation, ObservationCategory, SeverityLevel, HseFilters } from '../../../types/workPermitTypes';

const CATEGORY_OPTIONS = [
  { label: 'Semua Kategori', value: '' },
  { label: 'Unsafe Act', value: 'unsafe_act' },
  { label: 'Unsafe Condition', value: 'unsafe_condition' },
  { label: 'Near Miss', value: 'near_miss' },
  { label: 'Positive Observation', value: 'positive_observation' },
  { label: 'Environmental', value: 'environmental' },
  { label: 'Housekeeping', value: 'housekeeping' },
  { label: 'PPE Compliance', value: 'ppe_compliance' },
  { label: 'Procedure Compliance', value: 'procedure_compliance' },
];

const SEVERITY_OPTIONS = [
  { label: 'Semua Severity', value: '' },
  { label: 'Low', value: 'low' },
  { label: 'Medium', value: 'medium' },
  { label: 'High', value: 'high' },
  { label: 'Critical', value: 'critical' },
];

const catColor = (cat: string): React.CSSProperties => {
  const map: Record<string, { bg: string; color: string }> = {
    unsafe_act: { bg: '#fef3c7', color: '#92400e' },
    unsafe_condition: { bg: '#fee2e2', color: '#991b1b' },
    near_miss: { bg: '#fce7f3', color: '#831843' },
    positive_observation: { bg: '#dcfce7', color: '#166534' },
    environmental: { bg: '#dbeafe', color: '#1e40af' },
    housekeeping: { bg: '#e0e7ff', color: '#3730a3' },
    ppe_compliance: { bg: '#f3e8ff', color: '#6b21a8' },
    procedure_compliance: { bg: '#ccfbf1', color: '#134e4a' },
  };
  const m = map[cat] ?? { bg: '#f1f5f9', color: '#334155' };
  return { background: m.bg, color: m.color, borderRadius: 6, padding: '2px 8px', fontSize: 11, fontWeight: 600 };
};

const ObservationList = () => {
  const navigate = useNavigate();
  const toast = useRef<Toast>(null);
  const [data, setData] = useState<SafetyObservation[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalRecords, setTotalRecords] = useState(0);
  const [page, setPage] = useState(1);
  const [catFilter, setCatFilter] = useState('');
  const [sevFilter, setSevFilter] = useState('');
  const [showDialog, setShowDialog] = useState(false);
  const [newObs, setNewObs] = useState({
    category: 'unsafe_act' as ObservationCategory,
    severity: 'medium' as SeverityLevel,
    description: '',
    reported_by_name: '',
    exact_location: '',
    observed_at: new Date(),
  });

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const filters: HseFilters = {
        category: catFilter || undefined,
        severity: sevFilter || undefined,
        page,
        per_page: 15,
      };
      const resp = await safetyObservationService.list(filters);
      setData(resp.data);
      setTotalRecords(resp.total);
    } catch {
      toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Gagal memuat observasi' });
    } finally {
      setLoading(false);
    }
  }, [catFilter, sevFilter, page]);

  useEffect(() => { loadData(); }, [loadData]);

  const handleCreate = async () => {
    if (!newObs.reported_by_name || !newObs.description) {
      toast.current?.show({ severity: 'warn', summary: 'Validasi', detail: 'Observer & deskripsi wajib diisi' });
      return;
    }
    try {
      const created = await safetyObservationService.create({
        ...newObs,
        type: 'observation',
        observed_at: (newObs.observed_at as Date).toISOString(),
      } as Partial<SafetyObservation>);
      toast.current?.show({ severity: 'success', summary: 'Tersimpan', detail: `Observasi ${created.observation_number} dicatat` });
      setShowDialog(false);
      loadData();
    } catch {
      toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Gagal menyimpan' });
    }
  };

  const sevSeverity = (s: SeverityLevel) => {
    switch (s) { case 'low': return 'success'; case 'medium': return 'warning'; case 'high': return 'danger'; case 'critical': return 'danger'; default: return 'info'; }
  };

  const statusSev = (s: string) => {
    if (['closed', 'verified'].includes(s)) return 'success';
    return 'info';
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <Toast ref={toast} />

      <PageHeader
        title="Safety Observations"
        subtitle="Pelaporan observasi keselamatan — unsafe act, unsafe condition, near miss, dan observasi positif"
        icon="pi pi-eye"
        accentGradient="linear-gradient(135deg, #f97316, #ea580c)"
        actions={
          <Button
            label="Catat Observasi"
            icon="pi pi-plus"
            style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.3)', color: '#fff' }}
            onClick={() => setShowDialog(true)}
          />
        }
      />

      <TableCard>
        <FilterBar>
          <Dropdown value={catFilter} options={CATEGORY_OPTIONS} onChange={(e) => { setCatFilter(e.value); setPage(1); }} className="w-14rem" placeholder="Semua Kategori" />
          <Dropdown value={sevFilter} options={SEVERITY_OPTIONS} onChange={(e) => { setSevFilter(e.value); setPage(1); }} className="w-10rem" placeholder="Semua Severity" />
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
            emptyMessage="Tidak ada observasi ditemukan."
            style={{ border: 'none' }}
          >
            <Column field="observation_number" header="Obs #" sortable style={{ width: '10%', fontFamily: 'monospace', fontSize: 12 }} />
            <Column
              field="category"
              header="Kategori"
              body={(r) => <span style={catColor(r.category)}>{r.category.replace(/_/g, ' ')}</span>}
              style={{ width: '16%' }}
            />
            <Column
              field="severity"
              header="Severity"
              body={(r) => <Tag value={r.severity} severity={sevSeverity(r.severity) as any} />}
              style={{ width: '9%' }}
            />
            <Column
              field="description"
              header="Deskripsi"
              body={(r) => <span style={{ fontSize: 12, color: '#334155' }}>{r.description}</span>}
              style={{ width: '26%' }}
            />
            <Column
              field="observed_at"
              header="Waktu"
              body={(r) => new Date(r.observed_at).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
              style={{ width: '11%' }}
            />
            <Column field="reported_by_name" header="Observer" style={{ width: '12%' }} />
            <Column
              field="status"
              header="Status"
              body={(r) => <Tag value={r.status.replace(/_/g, ' ')} severity={statusSev(r.status) as any} />}
              style={{ width: '10%' }}
            />
            <Column
              header=""
              style={{ width: '6%' }}
              body={(r) => (
                <Button icon="pi pi-eye" rounded text size="small" onClick={() => navigate(`/dashboard/hse/observations/${r.id}`)} tooltip="Lihat detail" />
              )}
            />
          </DataTable>
        </div>
      </TableCard>

      <Dialog
        header={
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: 'linear-gradient(135deg,#f97316,#ea580c)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <i className="pi pi-eye" style={{ color: '#fff', fontSize: 14 }} />
            </div>
            <span>Observasi Keselamatan Baru</span>
          </div>
        }
        visible={showDialog}
        onHide={() => setShowDialog(false)}
        style={{ width: '38rem' }}
        footer={(
          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
            <Button label="Batal" severity="secondary" text onClick={() => setShowDialog(false)} />
            <Button label="Simpan" icon="pi pi-check" onClick={handleCreate} />
          </div>
        )}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={{ display: 'block', marginBottom: 6, fontWeight: 600, fontSize: 13 }}>Kategori</label>
              <Dropdown value={newObs.category} options={CATEGORY_OPTIONS.slice(1)} onChange={(e) => setNewObs(p => ({ ...p, category: e.value }))} className="w-full" />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: 6, fontWeight: 600, fontSize: 13 }}>Severity</label>
              <Dropdown value={newObs.severity} options={SEVERITY_OPTIONS.slice(1)} onChange={(e) => setNewObs(p => ({ ...p, severity: e.value }))} className="w-full" />
            </div>
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: 6, fontWeight: 600, fontSize: 13 }}>Waktu Observasi</label>
            <Calendar value={newObs.observed_at} onChange={(e) => setNewObs(p => ({ ...p, observed_at: e.value as Date }))} showTime hourFormat="24" className="w-full" />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={{ display: 'block', marginBottom: 6, fontWeight: 600, fontSize: 13 }}>Observer</label>
              <InputText value={newObs.reported_by_name} onChange={(e) => setNewObs(p => ({ ...p, reported_by_name: e.target.value }))} className="w-full" />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: 6, fontWeight: 600, fontSize: 13 }}>Lokasi</label>
              <InputText value={newObs.exact_location} onChange={(e) => setNewObs(p => ({ ...p, exact_location: e.target.value }))} className="w-full" />
            </div>
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: 6, fontWeight: 600, fontSize: 13 }}>Deskripsi Observasi</label>
            <InputTextarea value={newObs.description} onChange={(e) => setNewObs(p => ({ ...p, description: e.target.value }))} rows={4} className="w-full" placeholder="Jelaskan apa yang Anda amati..." />
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default ObservationList;
