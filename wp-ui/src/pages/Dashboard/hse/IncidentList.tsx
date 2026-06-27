import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Tag } from 'primereact/tag';
import { Toast } from 'primereact/toast';
import { Dialog } from 'primereact/dialog';
import { InputTextarea } from 'primereact/inputtextarea';
import { Calendar } from 'primereact/calendar';
import { PageHeader, TableCard, FilterBar } from '../../../components/ui';
import { incidentService } from '../../../services/hseService';
import type { Incident, IncidentType, IncidentSeverity, HseFilters } from '../../../types/workPermitTypes';

const TYPE_OPTIONS = [
  { label: 'Semua Tipe', value: '' },
  { label: 'Near Miss', value: 'near_miss' },
  { label: 'First Aid', value: 'first_aid' },
  { label: 'Medical Treatment', value: 'medical_treatment' },
  { label: 'Lost Time Injury', value: 'lost_time_injury' },
  { label: 'Restricted Work', value: 'restricted_work' },
  { label: 'Fatality', value: 'fatality' },
  { label: 'Property Damage', value: 'property_damage' },
  { label: 'Environmental', value: 'environmental' },
  { label: 'Fire', value: 'fire' },
  { label: 'Spill', value: 'spill' },
];

const SEVERITY_OPTIONS = [
  { label: 'Semua Severity', value: '' },
  { label: 'Minor', value: 'minor' },
  { label: 'Moderate', value: 'moderate' },
  { label: 'Major', value: 'major' },
  { label: 'Catastrophic', value: 'catastrophic' },
];

const STATUS_OPTIONS = [
  { label: 'Semua Status', value: '' },
  { label: 'Reported', value: 'reported' },
  { label: 'Under Investigation', value: 'under_investigation' },
  { label: 'RCA in Progress', value: 'rca_in_progress' },
  { label: 'Actions Assigned', value: 'actions_assigned' },
  { label: 'Actions in Progress', value: 'actions_in_progress' },
  { label: 'Closed', value: 'closed' },
];

const severitySev = (s: IncidentSeverity) => {
  switch (s) {
    case 'minor': return 'success';
    case 'moderate': return 'warning';
    case 'major': return 'danger';
    case 'catastrophic': return 'danger';
    default: return 'info';
  }
};

const statusSev = (s: string) => {
  if (s === 'closed') return 'success';
  if (['under_investigation', 'rca_in_progress'].includes(s)) return 'warning';
  if (s === 'reported') return 'danger';
  return 'info';
};

const IncidentList = () => {
  const navigate = useNavigate();
  const toast = useRef<Toast>(null);
  const [data, setData] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalRecords, setTotalRecords] = useState(0);
  const [page, setPage] = useState(1);
  const [typeFilter, setTypeFilter] = useState('');
  const [severityFilter, setSeverityFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [search, setSearch] = useState('');
  const [showDialog, setShowDialog] = useState(false);

  const [newIncident, setNewIncident] = useState({
    type: 'near_miss' as IncidentType,
    severity: 'minor' as IncidentSeverity,
    description: '',
    exact_location: '',
    reported_by_name: '',
    incident_date: new Date(),
  });

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const filters: HseFilters = {
        type: typeFilter || undefined,
        severity: severityFilter || undefined,
        status: statusFilter || undefined,
        page,
        per_page: 15,
      };
      const resp = await incidentService.list(filters);
      setData(resp.data);
      setTotalRecords(resp.total);
    } catch {
      toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Gagal memuat insiden' });
    } finally {
      setLoading(false);
    }
  }, [typeFilter, severityFilter, statusFilter, page]);

  useEffect(() => { loadData(); }, [loadData]);

  const handleCreate = async () => {
    if (!newIncident.reported_by_name || !newIncident.description) {
      toast.current?.show({ severity: 'warn', summary: 'Validasi', detail: 'Reporter & deskripsi wajib diisi' });
      return;
    }
    try {
      const created = await incidentService.create({
        ...newIncident,
        incident_date: (newIncident.incident_date as Date).toISOString(),
        reported_date: new Date().toISOString(),
      } as Partial<Incident>);
      toast.current?.show({ severity: 'success', summary: 'Dilaporkan', detail: `Insiden ${created.incident_number} dicatat` });
      setShowDialog(false);
      loadData();
    } catch {
      toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Gagal membuat laporan' });
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <Toast ref={toast} />

      <PageHeader
        title="Incident Register"
        subtitle="Pelaporan dan investigasi insiden, near miss, dan kejadian berbahaya di area kerja"
        icon="pi pi-exclamation-triangle"
        accentGradient="linear-gradient(135deg, #ef4444, #dc2626)"
        actions={
          <Button
            label="Laporkan Insiden"
            icon="pi pi-plus"
            style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.3)', color: '#fff' }}
            onClick={() => setShowDialog(true)}
          />
        }
      />

      <TableCard>
        <FilterBar>
          <span className="p-input-icon-left" style={{ flex: '1 1 200px', maxWidth: 280 }}>
            <i className="pi pi-search" />
            <InputText
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder="Cari insiden..."
              className="w-full"
            />
          </span>
          <Dropdown value={typeFilter} options={TYPE_OPTIONS} onChange={(e) => { setTypeFilter(e.value); setPage(1); }} className="w-12rem" />
          <Dropdown value={severityFilter} options={SEVERITY_OPTIONS} onChange={(e) => { setSeverityFilter(e.value); setPage(1); }} className="w-10rem" />
          <Dropdown value={statusFilter} options={STATUS_OPTIONS} onChange={(e) => { setStatusFilter(e.value); setPage(1); }} className="w-13rem" />
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
            emptyMessage="Tidak ada insiden ditemukan."
            style={{ border: 'none' }}
          >
            <Column
              field="incident_number"
              header="Insiden #"
              sortable
              style={{ width: '10%', fontFamily: 'monospace', fontSize: 12 }}
            />
            <Column
              field="type"
              header="Tipe"
              body={(r) => <Tag value={r.type.replace(/_/g, ' ')} />}
              style={{ width: '13%' }}
            />
            <Column
              field="severity"
              header="Severity"
              body={(r) => <Tag value={r.severity} severity={severitySev(r.severity) as any} />}
              style={{ width: '9%' }}
            />
            <Column
              field="description"
              header="Deskripsi"
              style={{ width: '27%' }}
              body={(r) => <span style={{ fontSize: 12, color: '#334155' }}>{r.description}</span>}
            />
            <Column
              field="incident_date"
              header="Tanggal"
              body={(r) => new Date(r.incident_date).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
              style={{ width: '11%' }}
            />
            <Column field="reported_by_name" header="Dilaporkan Oleh" style={{ width: '12%' }} />
            <Column
              field="status"
              header="Status"
              body={(r) => <Tag value={r.status.replace(/_/g, ' ')} severity={statusSev(r.status) as any} />}
              style={{ width: '11%' }}
            />
            <Column
              header=""
              style={{ width: '7%' }}
              body={(r) => (
                <Button
                  icon="pi pi-eye"
                  rounded text size="small"
                  onClick={() => navigate(`/dashboard/hse/incidents/${r.id}`)}
                  tooltip="Lihat detail"
                />
              )}
            />
          </DataTable>
        </div>
      </TableCard>

      <Dialog
        header={
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: 'linear-gradient(135deg,#ef4444,#dc2626)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <i className="pi pi-exclamation-triangle" style={{ color: '#fff', fontSize: 14 }} />
            </div>
            <span>Laporan Insiden Baru</span>
          </div>
        }
        visible={showDialog}
        onHide={() => setShowDialog(false)}
        style={{ width: '38rem' }}
        footer={(
          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
            <Button label="Batal" severity="secondary" text onClick={() => setShowDialog(false)} />
            <Button label="Laporkan" icon="pi pi-check" severity="danger" onClick={handleCreate} />
          </div>
        )}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={{ display: 'block', marginBottom: 6, fontWeight: 600, fontSize: 13 }}>Tipe Insiden</label>
              <Dropdown value={newIncident.type} options={TYPE_OPTIONS.slice(1)} onChange={(e) => setNewIncident(p => ({ ...p, type: e.value }))} className="w-full" />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: 6, fontWeight: 600, fontSize: 13 }}>Severity</label>
              <Dropdown value={newIncident.severity} options={SEVERITY_OPTIONS.slice(1)} onChange={(e) => setNewIncident(p => ({ ...p, severity: e.value }))} className="w-full" />
            </div>
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: 6, fontWeight: 600, fontSize: 13 }}>Tanggal & Waktu Kejadian</label>
            <Calendar value={newIncident.incident_date} onChange={(e) => setNewIncident(p => ({ ...p, incident_date: e.value as Date }))} showTime hourFormat="24" className="w-full" />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={{ display: 'block', marginBottom: 6, fontWeight: 600, fontSize: 13 }}>Dilaporkan Oleh</label>
              <InputText value={newIncident.reported_by_name} onChange={(e) => setNewIncident(p => ({ ...p, reported_by_name: e.target.value }))} className="w-full" />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: 6, fontWeight: 600, fontSize: 13 }}>Lokasi</label>
              <InputText value={newIncident.exact_location} onChange={(e) => setNewIncident(p => ({ ...p, exact_location: e.target.value }))} className="w-full" />
            </div>
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: 6, fontWeight: 600, fontSize: 13 }}>Deskripsi Kejadian</label>
            <InputTextarea value={newIncident.description} onChange={(e) => setNewIncident(p => ({ ...p, description: e.target.value }))} rows={4} className="w-full" placeholder="Jelaskan apa yang terjadi secara singkat dan jelas..." />
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default IncidentList;
