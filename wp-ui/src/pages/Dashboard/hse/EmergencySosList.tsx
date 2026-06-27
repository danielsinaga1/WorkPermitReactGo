import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Tag } from 'primereact/tag';
import { Toast } from 'primereact/toast';
import { Dialog } from 'primereact/dialog';
import { InputTextarea } from 'primereact/inputtextarea';
import { Dropdown } from 'primereact/dropdown';
import { PageHeader, TableCard, FilterBar } from '../../../components/ui';
import { sosService } from '../../../services/extendedHseService';
import type { EmergencySosAlert, SosAlertStatus } from '../../../types/workPermitTypes';

const STATUS_OPTIONS = [
  { label: 'Semua Status', value: '' },
  { label: '🔴 Triggered', value: 'triggered' },
  { label: 'Acknowledged', value: 'acknowledged' },
  { label: 'Responding', value: 'responding' },
  { label: 'Resolved', value: 'resolved' },
  { label: 'False Alarm', value: 'false_alarm' },
];

const statusSeverity = (s: SosAlertStatus) => {
  switch (s) {
    case 'triggered': return 'danger';
    case 'acknowledged': return 'warning';
    case 'responding': return 'info';
    case 'resolved': return 'success';
    case 'false_alarm': return 'secondary';
    default: return 'info';
  }
};

const EmergencySosList = () => {
  const navigate = useNavigate();
  const toast = useRef<Toast>(null);
  const [data, setData] = useState<EmergencySosAlert[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalRecords, setTotalRecords] = useState(0);
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');

  const [resolveTarget, setResolveTarget] = useState<EmergencySosAlert | null>(null);
  const [resolveNotes, setResolveNotes] = useState('');
  const [processing, setProcessing] = useState(false);

  const triggeredCount = data.filter((d) => d.status === 'triggered').length;

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const activeOnly = statusFilter === '' ? undefined : statusFilter === 'triggered';
      const resp = await sosService.list({ active_only: activeOnly, per_page: 15, page });
      const filtered = statusFilter && statusFilter !== 'triggered'
        ? { ...resp, data: resp.data.filter((a) => a.status === statusFilter) }
        : resp;
      setData(filtered.data);
      setTotalRecords(filtered.total ?? filtered.data.length);
    } catch {
      toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Gagal memuat SOS alerts' });
    } finally {
      setLoading(false);
    }
  }, [statusFilter, page]);

  useEffect(() => { loadData(); }, [loadData]);

  const handleAcknowledge = async (alert: EmergencySosAlert) => {
    setProcessing(true);
    try {
      await sosService.acknowledge(alert.id);
      toast.current?.show({ severity: 'success', summary: 'Acknowledged', detail: `SOS #${alert.id} diakui` });
      loadData();
    } catch {
      toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Gagal' });
    } finally {
      setProcessing(false);
    }
  };

  const handleResolve = async () => {
    if (!resolveTarget) return;
    setProcessing(true);
    try {
      await sosService.resolve(resolveTarget.id, undefined, resolveNotes);
      toast.current?.show({ severity: 'success', summary: 'Resolved', detail: `SOS #${resolveTarget.id} diselesaikan` });
      setResolveTarget(null);
      setResolveNotes('');
      loadData();
    } catch {
      toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Gagal' });
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <Toast ref={toast} />

      <PageHeader
        title="Emergency SOS Dashboard"
        subtitle={triggeredCount > 0
          ? `⚠️ ${triggeredCount} alert aktif memerlukan tindakan segera`
          : 'Monitoring dan respons darurat real-time'}
        icon="pi pi-megaphone"
        accentGradient="linear-gradient(135deg, #ef4444, #b91c1c)"
        style={triggeredCount > 0
          ? { background: 'linear-gradient(135deg, #7f1d1d 0%, #991b1b 100%)' }
          : undefined
        }
        actions={
          <Button
            icon="pi pi-refresh"
            label="Refresh"
            style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.3)', color: '#fff' }}
            onClick={loadData}
            loading={loading}
          />
        }
      />

      {triggeredCount > 0 && (
        <div style={{
          background: '#fef2f2',
          border: '2px solid #fca5a5',
          borderRadius: 12,
          padding: '14px 20px',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
        }}>
          <div style={{
            width: 40, height: 40, borderRadius: 10,
            background: 'linear-gradient(135deg,#ef4444,#dc2626)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
            animation: 'pulse 1.5s infinite',
          }}>
            <i className="pi pi-exclamation-triangle" style={{ color: '#fff', fontSize: 18 }} />
          </div>
          <div>
            <div style={{ fontWeight: 700, color: '#991b1b', fontSize: 14 }}>
              {triggeredCount} ALERT DARURAT AKTIF
            </div>
            <div style={{ fontSize: 12, color: '#dc2626' }}>Segera respond dan selesaikan SOS yang aktif.</div>
          </div>
        </div>
      )}

      <TableCard>
        <FilterBar>
          <Dropdown
            value={statusFilter}
            options={STATUS_OPTIONS}
            onChange={(e) => { setStatusFilter(e.value); setPage(1); }}
            className="w-12rem"
          />
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
            emptyMessage="Tidak ada SOS alert."
            style={{ border: 'none' }}
            rowClassName={(r) => ({ 'bg-red-50': r.status === 'triggered' })}
          >
            <Column field="id" header="ID" style={{ width: '6%' }} />
            <Column field="triggered_by_name" header="Dipicu Oleh" style={{ width: '15%' }} />
            <Column
              field="status"
              header="Status"
              body={(r: EmergencySosAlert) => (
                <Tag value={r.status.replace(/_/g, ' ')} severity={statusSeverity(r.status)} />
              )}
              style={{ width: '12%' }}
            />
            <Column
              field="description"
              header="Deskripsi"
              body={(r: EmergencySosAlert) => (
                <span style={{ fontSize: 12, color: '#334155' }}>{r.description || '—'}</span>
              )}
              style={{ width: '22%' }}
            />
            <Column
              header="Lokasi GPS"
              body={(r: EmergencySosAlert) =>
                r.gps_latitude
                  ? <span style={{ fontFamily: 'monospace', fontSize: 11 }}>{Number(r.gps_latitude).toFixed(5)}, {Number(r.gps_longitude).toFixed(5)}</span>
                  : <span style={{ color: '#94a3b8' }}>—</span>
              }
              style={{ width: '15%' }}
            />
            <Column
              field="triggered_at"
              header="Waktu"
              body={(r: EmergencySosAlert) => new Date(r.triggered_at).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
              style={{ width: '13%' }}
            />
            <Column
              header="Respons"
              body={(r: EmergencySosAlert) =>
                r.response_time_minutes
                  ? <span style={{ fontWeight: 600, color: r.response_time_minutes > 10 ? '#ef4444' : '#10b981' }}>{r.response_time_minutes} mnt</span>
                  : <span style={{ color: '#94a3b8' }}>—</span>
              }
              style={{ width: '10%' }}
            />
            <Column
              header=""
              style={{ width: '7%' }}
              body={(row: EmergencySosAlert) => (
                <div style={{ display: 'flex', gap: 4 }}>
                  {row.status === 'triggered' && (
                    <Button
                      icon="pi pi-check"
                      rounded text severity="warning" size="small"
                      tooltip="Acknowledge"
                      onClick={() => handleAcknowledge(row)}
                      disabled={processing}
                    />
                  )}
                  {['triggered', 'acknowledged', 'responding'].includes(row.status) && (
                    <Button
                      icon="pi pi-check-circle"
                      rounded text severity="success" size="small"
                      tooltip="Resolve"
                      onClick={() => { setResolveTarget(row); setResolveNotes(''); }}
                      disabled={processing}
                    />
                  )}
                </div>
              )}
            />
          </DataTable>
        </div>
      </TableCard>

      <Dialog
        header={
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: 'linear-gradient(135deg,#10b981,#059669)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <i className="pi pi-check-circle" style={{ color: '#fff', fontSize: 14 }} />
            </div>
            <span>Selesaikan SOS #{resolveTarget?.id}</span>
          </div>
        }
        visible={!!resolveTarget}
        onHide={() => setResolveTarget(null)}
        style={{ width: '32rem' }}
        footer={(
          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
            <Button label="Batal" severity="secondary" text onClick={() => setResolveTarget(null)} />
            <Button label="Selesaikan Darurat" icon="pi pi-check" severity="success" onClick={handleResolve} loading={processing} />
          </div>
        )}
      >
        <div>
          <label style={{ display: 'block', marginBottom: 6, fontWeight: 600, fontSize: 13 }}>Catatan Penyelesaian</label>
          <InputTextarea
            value={resolveNotes}
            onChange={(e) => setResolveNotes(e.target.value)}
            rows={4}
            className="w-full"
            placeholder="Jelaskan bagaimana kondisi darurat diselesaikan..."
          />
        </div>
      </Dialog>
    </div>
  );
};

export default EmergencySosList;
