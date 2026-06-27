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
import { Chips } from 'primereact/chips';
import { PageHeader, TableCard, FilterBar } from '../../../components/ui';
import { toolboxMeetingService } from '../../../services/hseService';
import type { ToolboxMeeting, HseFilters } from '../../../types/workPermitTypes';

const STATUS_OPTIONS = [
  { label: 'Semua Status', value: '' },
  { label: 'Planned', value: 'planned' },
  { label: 'In Progress', value: 'in_progress' },
  { label: 'Completed', value: 'completed' },
  { label: 'Cancelled', value: 'cancelled' },
];

const ToolboxMeetingList = () => {
  const navigate = useNavigate();
  const toast = useRef<Toast>(null);
  const [data, setData] = useState<ToolboxMeeting[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalRecords, setTotalRecords] = useState(0);
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');

  const [showDialog, setShowDialog] = useState(false);
  const [newMeeting, setNewMeeting] = useState({
    title: '',
    topic: '',
    conducted_by: '',
    meeting_date: new Date(),
    duration_minutes: 15,
    key_points: [] as string[],
    hazards_discussed: [] as string[],
  });

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const filters: HseFilters = { status: statusFilter || undefined, page, per_page: 15 };
      const resp = await toolboxMeetingService.list(filters);
      setData(resp.data);
      setTotalRecords(resp.total);
    } catch {
      toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Gagal memuat TBM' });
    } finally {
      setLoading(false);
    }
  }, [statusFilter, page]);

  useEffect(() => { loadData(); }, [loadData]);

  const handleCreate = async () => {
    if (!newMeeting.title || !newMeeting.conducted_by) {
      toast.current?.show({ severity: 'warn', summary: 'Validasi', detail: 'Judul & conductor wajib diisi' });
      return;
    }
    try {
      const created = await toolboxMeetingService.create({
        ...newMeeting,
        meeting_date: (newMeeting.meeting_date as Date).toISOString(),
        status: 'planned',
      } as Partial<ToolboxMeeting>);
      toast.current?.show({ severity: 'success', summary: 'Dijadwalkan', detail: `TBM ${created.meeting_number} dibuat` });
      setShowDialog(false);
      loadData();
    } catch {
      toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Gagal membuat TBM' });
    }
  };

  const handleComplete = async (id: number) => {
    try {
      await toolboxMeetingService.complete(id);
      toast.current?.show({ severity: 'success', summary: 'Selesai', detail: 'TBM ditandai selesai' });
      loadData();
    } catch {
      toast.current?.show({ severity: 'error', summary: 'Error' });
    }
  };

  const statusSev = (s: string) => {
    switch (s) { case 'planned': return 'info'; case 'in_progress': return 'warning'; case 'completed': return 'success'; case 'cancelled': return 'danger'; default: return 'info'; }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <Toast ref={toast} />

      <PageHeader
        title="Toolbox Meetings (TBM)"
        subtitle="Jadwal dan catatan safety briefing harian — diskusi bahaya, prosedur, dan poin keselamatan"
        icon="pi pi-users"
        accentGradient="linear-gradient(135deg, #8b5cf6, #7c3aed)"
        actions={
          <Button
            label="Jadwalkan TBM"
            icon="pi pi-plus"
            style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.3)', color: '#fff' }}
            onClick={() => setShowDialog(true)}
          />
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
            emptyMessage="Tidak ada TBM ditemukan."
            style={{ border: 'none' }}
          >
            <Column field="meeting_number" header="Meeting #" sortable style={{ width: '10%', fontFamily: 'monospace', fontSize: 12 }} />
            <Column field="title" header="Judul" style={{ width: '20%' }} />
            <Column field="topic" header="Topik" style={{ width: '18%' }} body={(r) => <span style={{ fontSize: 12, color: '#334155' }}>{r.topic}</span>} />
            <Column field="conducted_by" header="Conductor" style={{ width: '13%' }} />
            <Column
              field="meeting_date"
              header="Tanggal"
              body={(r) => new Date(r.meeting_date).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
              style={{ width: '14%' }}
            />
            <Column
              field="duration_minutes"
              header="Durasi"
              body={(r) => <span style={{ fontSize: 12 }}>{r.duration_minutes} menit</span>}
              style={{ width: '8%' }}
            />
            <Column
              field="status"
              header="Status"
              body={(r) => <Tag value={r.status.replace(/_/g, ' ')} severity={statusSev(r.status) as any} />}
              style={{ width: '10%' }}
            />
            <Column
              header=""
              style={{ width: '7%' }}
              body={(r: ToolboxMeeting) =>
                r.status !== 'completed' && r.status !== 'cancelled' ? (
                  <Button
                    icon="pi pi-check"
                    rounded text severity="success" size="small"
                    tooltip="Tandai selesai"
                    onClick={() => handleComplete(r.id)}
                  />
                ) : (
                  r.status === 'completed'
                    ? <i className="pi pi-check-circle" style={{ color: '#10b981', fontSize: 16 }} />
                    : null
                )
              }
            />
          </DataTable>
        </div>
      </TableCard>

      <Dialog
        header={
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: 'linear-gradient(135deg,#8b5cf6,#7c3aed)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <i className="pi pi-users" style={{ color: '#fff', fontSize: 14 }} />
            </div>
            <span>Jadwalkan Toolbox Meeting</span>
          </div>
        }
        visible={showDialog}
        onHide={() => setShowDialog(false)}
        style={{ width: '38rem' }}
        footer={(
          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
            <Button label="Batal" severity="secondary" text onClick={() => setShowDialog(false)} />
            <Button label="Jadwalkan" icon="pi pi-check" onClick={handleCreate} />
          </div>
        )}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <label style={{ display: 'block', marginBottom: 6, fontWeight: 600, fontSize: 13 }}>Judul Meeting</label>
            <InputText value={newMeeting.title} onChange={(e) => setNewMeeting(p => ({ ...p, title: e.target.value }))} className="w-full" />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: 6, fontWeight: 600, fontSize: 13 }}>Topik Utama</label>
            <InputTextarea value={newMeeting.topic} onChange={(e) => setNewMeeting(p => ({ ...p, topic: e.target.value }))} rows={2} className="w-full" />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={{ display: 'block', marginBottom: 6, fontWeight: 600, fontSize: 13 }}>Dipimpin Oleh</label>
              <InputText value={newMeeting.conducted_by} onChange={(e) => setNewMeeting(p => ({ ...p, conducted_by: e.target.value }))} className="w-full" />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: 6, fontWeight: 600, fontSize: 13 }}>Durasi (menit)</label>
              <InputText
                type="number"
                value={String(newMeeting.duration_minutes)}
                onChange={(e) => setNewMeeting(p => ({ ...p, duration_minutes: parseInt(e.target.value) || 15 }))}
                className="w-full"
              />
            </div>
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: 6, fontWeight: 600, fontSize: 13 }}>Tanggal & Waktu</label>
            <Calendar value={newMeeting.meeting_date} onChange={(e) => setNewMeeting(p => ({ ...p, meeting_date: e.value as Date }))} showTime hourFormat="24" className="w-full" />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: 6, fontWeight: 600, fontSize: 13 }}>Poin Kunci (tekan Enter)</label>
            <Chips value={newMeeting.key_points} onChange={(e) => setNewMeeting(p => ({ ...p, key_points: e.value || [] }))} className="w-full" />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: 6, fontWeight: 600, fontSize: 13 }}>Bahaya yang Dibahas (tekan Enter)</label>
            <Chips value={newMeeting.hazards_discussed} onChange={(e) => setNewMeeting(p => ({ ...p, hazards_discussed: e.value || [] }))} className="w-full" />
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default ToolboxMeetingList;
