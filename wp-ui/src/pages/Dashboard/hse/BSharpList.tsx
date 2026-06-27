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
import { PageHeader, MetricCard, MetricsGrid, TableCard, FilterBar } from '../../../components/ui';
import {
  bsharpService,
  type BSharpObservation,
  type BSharpSummary,
  type BehaviorCategory,
} from '../../../services/arsheService';

const BEHAVIOR_OPTIONS = [
  { label: 'Semua Perilaku', value: '' },
  { label: '✓ Aman', value: 'safe' },
  { label: '⚠ Berisiko', value: 'at_risk' },
];

const STATUS_OPTIONS = [
  { label: 'Semua Status', value: '' },
  { label: 'Open', value: 'open' },
  { label: 'Tindak Lanjut', value: 'follow_up' },
  { label: 'Selesai', value: 'completed' },
];

const BSharpList = () => {
  const navigate = useNavigate();
  const toast = useRef<Toast>(null);

  const [data, setData] = useState<BSharpObservation[]>([]);
  const [summary, setSummary] = useState<BSharpSummary | null>(null);
  const [loading, setLoading] = useState(false);
  const [totalRecords, setTotalRecords] = useState(0);
  const [page, setPage] = useState(1);

  const [behaviorFilter, setBehaviorFilter] = useState<'' | BehaviorCategory>('');
  const [statusFilter, setStatusFilter] = useState('');
  const [search, setSearch] = useState('');

  const [showDialog, setShowDialog] = useState(false);
  const [showDetail, setShowDetail] = useState<BSharpObservation | null>(null);

  const [form, setForm] = useState({
    observed_at: new Date(),
    title: '',
    description: '',
    behavior_category: 'safe' as BehaviorCategory,
    observer_name: '',
    observed_subject_name: '',
    recommended_action: '',
    followup_pic_name: '',
    followup_plan: '',
    followup_target_date: null as Date | null,
  });

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const resp = await bsharpService.list({
        behavior_category: behaviorFilter || undefined,
        status: statusFilter || undefined,
        search: search || undefined,
        page,
        per_page: 15,
      });
      setData(resp.data);
      setTotalRecords(resp.total);
    } catch {
      toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Gagal memuat observasi' });
    } finally {
      setLoading(false);
    }
  }, [behaviorFilter, statusFilter, search, page]);

  const loadSummary = useCallback(async () => {
    try { setSummary(await bsharpService.summary()); } catch { /* noop */ }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);
  useEffect(() => { loadSummary(); }, [loadSummary]);

  const handleCreate = async () => {
    if (!form.title || !form.description || !form.observer_name) {
      toast.current?.show({ severity: 'warn', summary: 'Validasi', detail: 'Judul, deskripsi & observer wajib diisi' });
      return;
    }
    try {
      const created = await bsharpService.create({
        ...form,
        observed_at: form.observed_at.toISOString(),
        followup_target_date: form.followup_target_date ? form.followup_target_date.toISOString().split('T')[0] : undefined,
      });
      toast.current?.show({ severity: 'success', summary: 'Tersimpan', detail: `Observasi ${created.observation_number} dicatat` });
      setShowDialog(false);
      setForm((p) => ({ ...p, title: '', description: '', recommended_action: '', followup_plan: '', followup_target_date: null }));
      loadData(); loadSummary();
    } catch {
      toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Gagal menyimpan' });
    }
  };

  const handleComplete = async (row: BSharpObservation) => {
    try {
      await bsharpService.complete(row.id);
      toast.current?.show({ severity: 'success', summary: 'Updated', detail: 'Tindak lanjut diselesaikan' });
      loadData();
    } catch {
      toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Gagal' });
    }
  };

  const behaviorTag = (cat: BehaviorCategory) =>
    cat === 'safe'
      ? <Tag value="Aman" style={{ background: '#dcfce7', color: '#166534', fontWeight: 600 }} />
      : <Tag value="Berisiko" style={{ background: '#fef3c7', color: '#92400e', fontWeight: 600 }} />;

  const statusTag = (status: string) => {
    switch (status) {
      case 'completed': return <Tag value="Selesai" severity="success" />;
      case 'follow_up': return <Tag value="Tindak Lanjut" severity="warning" />;
      default:          return <Tag value="Open" severity="info" />;
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <Toast ref={toast} />

      <PageHeader
        title="B-Sharp BBS"
        subtitle="Behavior Based Safety — pemantauan perilaku untuk meningkatkan budaya keselamatan kerja"
        icon="pi pi-users"
        accentGradient="linear-gradient(135deg, #6366f1, #4f46e5)"
        actions={
          <Button
            label="Buat Observasi"
            icon="pi pi-plus"
            style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.3)', color: '#fff' }}
            onClick={() => setShowDialog(true)}
          />
        }
      />

      <MetricsGrid>
        <MetricCard
          label="Total Observasi"
          value={summary?.total_observations ?? '-'}
          icon="pi-eye"
          gradient="linear-gradient(135deg, #6366f1, #4f46e5)"
        />
        <MetricCard
          label="Perilaku Aman"
          value={summary?.safe_behavior ?? '-'}
          sub={summary ? `${summary.safe_percent}% dari total` : ''}
          icon="pi-check-circle"
          gradient="linear-gradient(135deg, #10b981, #059669)"
        />
        <MetricCard
          label="Perilaku Berisiko"
          value={summary?.at_risk_behavior ?? '-'}
          sub={summary ? `${summary.at_risk_percent}% dari total` : ''}
          icon="pi-exclamation-triangle"
          gradient="linear-gradient(135deg, #f97316, #ea580c)"
        />
        <MetricCard
          label="Observer Aktif"
          value={summary?.active_observers ?? '-'}
          icon="pi-id-card"
          gradient="linear-gradient(135deg, #3b82f6, #2563eb)"
        />
      </MetricsGrid>

      <TableCard>
        <FilterBar>
          <span className="p-input-icon-left" style={{ flex: '1 1 220px', maxWidth: 300 }}>
            <i className="pi pi-search" />
            <InputText
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder="Cari judul / observer..."
              className="w-full"
            />
          </span>
          <Dropdown
            value={behaviorFilter}
            options={BEHAVIOR_OPTIONS}
            onChange={(e) => { setBehaviorFilter(e.value); setPage(1); }}
            className="w-11rem"
          />
          <Dropdown
            value={statusFilter}
            options={STATUS_OPTIONS}
            onChange={(e) => { setStatusFilter(e.value); setPage(1); }}
            className="w-11rem"
          />
          <Button
            icon="pi pi-refresh"
            text
            rounded
            severity="secondary"
            onClick={loadData}
            loading={loading}
            tooltip="Refresh"
          />
        </FilterBar>

        <div style={{ padding: '0 4px' }}>
          <DataTable
            value={data}
            loading={loading}
            lazy paginator rows={15} totalRecords={totalRecords}
            first={(page - 1) * 15}
            onPage={(e) => setPage((e.first ?? 0) / 15 + 1)}
            stripedRows size="small"
            emptyMessage="Belum ada observasi B-Sharp."
            style={{ border: 'none' }}
          >
            <Column field="observation_number" header="ID" style={{ width: '11%', fontFamily: 'monospace', fontSize: 12 }} />
            <Column header="Tanggal" body={(r) => new Date(r.observed_at).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })} style={{ width: '13%' }} />
            <Column field="title" header="Judul Observasi" style={{ width: '24%' }} />
            <Column header="Lokasi" body={(r) => r.work_area?.name ?? <span style={{ color: '#94a3b8' }}>—</span>} style={{ width: '11%' }} />
            <Column field="observer_name" header="Observer" style={{ width: '12%' }} />
            <Column header="Perilaku" body={(r) => behaviorTag(r.behavior_category)} style={{ width: '10%' }} />
            <Column header="Status" body={(r) => statusTag(r.status)} style={{ width: '10%' }} />
            <Column header="" style={{ width: '9%' }} body={(r) => (
              <div style={{ display: 'flex', gap: 4 }}>
                <Button icon="pi pi-eye" rounded text size="small" onClick={() => setShowDetail(r)} tooltip="Lihat detail" />
                {r.status !== 'completed' && (
                  <Button icon="pi pi-check" rounded text size="small" severity="success" onClick={() => handleComplete(r)} tooltip="Selesaikan" />
                )}
              </div>
            )} />
          </DataTable>
        </div>
      </TableCard>

      {/* Create dialog */}
      <Dialog
        header={
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: 'linear-gradient(135deg,#6366f1,#4f46e5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <i className="pi pi-plus" style={{ color: '#fff', fontSize: 14 }} />
            </div>
            <span>Buat Observasi B-Sharp</span>
          </div>
        }
        visible={showDialog}
        onHide={() => setShowDialog(false)}
        style={{ width: '42rem' }}
        footer={(
          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
            <Button label="Batal" severity="secondary" text onClick={() => setShowDialog(false)} />
            <Button label="Simpan Observasi" icon="pi pi-check" onClick={handleCreate} />
          </div>
        )}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={{ display: 'block', marginBottom: 6, fontWeight: 600, fontSize: 13 }}>Kategori Perilaku</label>
            <div style={{ display: 'flex', gap: 10 }}>
              {(['safe', 'at_risk'] as BehaviorCategory[]).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setForm((p) => ({ ...p, behavior_category: cat }))}
                  style={{
                    flex: 1, padding: '10px 16px', borderRadius: 10, border: '2px solid',
                    borderColor: form.behavior_category === cat ? (cat === 'safe' ? '#10b981' : '#f97316') : '#e2e8f0',
                    background: form.behavior_category === cat ? (cat === 'safe' ? '#f0fdf4' : '#fff7ed') : '#fff',
                    cursor: 'pointer', fontWeight: 600, fontSize: 14,
                    color: form.behavior_category === cat ? (cat === 'safe' ? '#15803d' : '#c2410c') : '#64748b',
                    transition: 'all 0.15s',
                  }}
                >
                  {cat === 'safe' ? '✓ Aman (Safe)' : '⚠ Berisiko (At Risk)'}
                </button>
              ))}
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={{ display: 'block', marginBottom: 6, fontWeight: 600, fontSize: 13 }}>Tanggal & Waktu</label>
              <Calendar value={form.observed_at} onChange={(e) => setForm((p) => ({ ...p, observed_at: e.value as Date }))} showTime hourFormat="24" className="w-full" />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: 6, fontWeight: 600, fontSize: 13 }}>Observer</label>
              <InputText value={form.observer_name} onChange={(e) => setForm((p) => ({ ...p, observer_name: e.target.value }))} className="w-full" />
            </div>
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: 6, fontWeight: 600, fontSize: 13 }}>Judul Observasi</label>
            <InputText value={form.title} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))} className="w-full" placeholder="Singkat dan deskriptif..." />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: 6, fontWeight: 600, fontSize: 13 }}>Deskripsi</label>
            <InputTextarea rows={3} value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} className="w-full" />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: 6, fontWeight: 600, fontSize: 13 }}>Tindakan yang Disarankan</label>
            <InputTextarea rows={2} value={form.recommended_action} onChange={(e) => setForm((p) => ({ ...p, recommended_action: e.target.value }))} className="w-full" />
          </div>

          {form.behavior_category === 'at_risk' && (
            <div style={{ background: '#fff7ed', padding: '14px 16px', borderRadius: 10, border: '1px solid #fed7aa' }}>
              <div style={{ fontWeight: 700, marginBottom: 10, color: '#9a3412', fontSize: 13, display: 'flex', alignItems: 'center', gap: 6 }}>
                <i className="pi pi-exclamation-triangle" style={{ fontSize: 14 }} />
                Tindak Lanjut Diperlukan
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <div>
                  <label style={{ display: 'block', marginBottom: 4, fontSize: 12, fontWeight: 600 }}>PIC</label>
                  <InputText value={form.followup_pic_name} onChange={(e) => setForm((p) => ({ ...p, followup_pic_name: e.target.value }))} className="w-full" />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: 4, fontSize: 12, fontWeight: 600 }}>Target Selesai</label>
                  <Calendar value={form.followup_target_date} onChange={(e) => setForm((p) => ({ ...p, followup_target_date: e.value as Date }))} dateFormat="yy-mm-dd" className="w-full" />
                </div>
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={{ display: 'block', marginBottom: 4, fontSize: 12, fontWeight: 600 }}>Rencana Tindakan</label>
                  <InputTextarea rows={2} value={form.followup_plan} onChange={(e) => setForm((p) => ({ ...p, followup_plan: e.target.value }))} className="w-full" />
                </div>
              </div>
            </div>
          )}
        </div>
      </Dialog>

      {/* Detail dialog */}
      <Dialog
        header={showDetail ? `Detail B-Sharp — ${showDetail.observation_number}` : ''}
        visible={!!showDetail}
        onHide={() => setShowDetail(null)}
        style={{ width: '42rem' }}
      >
        {showDetail && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ display: 'flex', gap: 8 }}>
              {statusTag(showDetail.status)}
              {behaviorTag(showDetail.behavior_category)}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, background: '#f8fafc', padding: 14, borderRadius: 10 }}>
              <div><span style={{ fontSize: 11, color: '#64748b', display: 'block', marginBottom: 2 }}>TANGGAL</span><strong style={{ fontSize: 13 }}>{new Date(showDetail.observed_at).toLocaleString('id-ID')}</strong></div>
              <div><span style={{ fontSize: 11, color: '#64748b', display: 'block', marginBottom: 2 }}>LOKASI</span><strong style={{ fontSize: 13 }}>{showDetail.work_area?.name ?? '—'}</strong></div>
              <div><span style={{ fontSize: 11, color: '#64748b', display: 'block', marginBottom: 2 }}>OBSERVER</span><strong style={{ fontSize: 13 }}>{showDetail.observer_name}</strong></div>
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 4 }}>{showDetail.title}</div>
              <div style={{ fontSize: 13, color: '#334155', lineHeight: 1.6 }}>{showDetail.description}</div>
            </div>
            {showDetail.recommended_action && (
              <div style={{ background: '#f0fdf4', padding: 12, borderRadius: 8, border: '1px solid #bbf7d0' }}>
                <div style={{ fontWeight: 600, fontSize: 12, color: '#15803d', marginBottom: 4 }}>TINDAKAN DISARANKAN</div>
                <div style={{ fontSize: 13 }}>{showDetail.recommended_action}</div>
              </div>
            )}
            {showDetail.followup_plan && (
              <div style={{ background: '#fff7ed', padding: 12, borderRadius: 8, border: '1px solid #fed7aa' }}>
                <div style={{ fontWeight: 700, marginBottom: 8, color: '#92400e', fontSize: 12 }}>TINDAK LANJUT</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, fontSize: 13 }}>
                  <div><span style={{ color: '#64748b' }}>PIC:</span> {showDetail.followup_pic_name ?? '—'}</div>
                  <div><span style={{ color: '#64748b' }}>Target:</span> {showDetail.followup_target_date ?? '—'}</div>
                  <div style={{ gridColumn: '1 / -1' }}><span style={{ color: '#64748b' }}>Rencana:</span> {showDetail.followup_plan}</div>
                  {showDetail.followup_completed_at && (
                    <div style={{ gridColumn: '1 / -1', color: '#15803d' }}>✓ Diselesaikan: {new Date(showDetail.followup_completed_at).toLocaleString('id-ID')}</div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </Dialog>
    </div>
  );
};

export default BSharpList;
