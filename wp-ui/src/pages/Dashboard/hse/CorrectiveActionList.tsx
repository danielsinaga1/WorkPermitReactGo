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
import { PageHeader, TableCard, FilterBar } from '../../../components/ui';
import { correctiveActionService } from '../../../services/hseService';
import type { CorrectiveAction, CaStatus, HseFilters } from '../../../types/workPermitTypes';

const STATUS_OPTIONS = [
  { label: 'Semua Status', value: '' },
  { label: 'Open', value: 'open' },
  { label: 'In Progress', value: 'in_progress' },
  { label: 'Completed', value: 'completed' },
  { label: 'Verified', value: 'verified' },
  { label: 'Overdue', value: 'overdue' },
  { label: 'Cancelled', value: 'cancelled' },
];

const CorrectiveActionList = () => {
  const navigate = useNavigate();
  const toast = useRef<Toast>(null);
  const [data, setData] = useState<CorrectiveAction[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalRecords, setTotalRecords] = useState(0);
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');

  const [showComplete, setShowComplete] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [completionNotes, setCompletionNotes] = useState('');

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const filters: HseFilters = {
        status: statusFilter || undefined,
        page,
        per_page: 15,
      };
      const resp = await correctiveActionService.list(filters);
      setData(resp.data);
      setTotalRecords(resp.total);
    } catch {
      toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Gagal memuat corrective actions' });
    } finally {
      setLoading(false);
    }
  }, [statusFilter, page]);

  useEffect(() => { loadData(); }, [loadData]);

  const handleComplete = async () => {
    if (!selectedId) return;
    try {
      await correctiveActionService.complete(selectedId, { completion_notes: completionNotes });
      toast.current?.show({ severity: 'success', summary: 'Diselesaikan', detail: 'Corrective action berhasil ditutup' });
      setShowComplete(false);
      setCompletionNotes('');
      loadData();
    } catch {
      toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Gagal menyelesaikan action' });
    }
  };

  const statusSev = (s: CaStatus) => {
    switch (s) {
      case 'open': return 'info';
      case 'in_progress': return 'warning';
      case 'completed': case 'verified': return 'success';
      case 'overdue': return 'danger';
      case 'cancelled': return 'secondary';
      default: return 'info';
    }
  };

  const prioritySev = (p: string) => {
    if (['critical', 'high'].includes(p)) return 'danger';
    if (p === 'medium') return 'warning';
    return 'success';
  };

  const isOverdue = (row: CorrectiveAction) => {
    if (['completed', 'verified', 'cancelled'].includes(row.status)) return false;
    return new Date(row.due_date) < new Date();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <Toast ref={toast} />

      <PageHeader
        title="Corrective Actions"
        subtitle="Pelacakan dan penyelesaian tindakan korektif dari insiden, observasi, dan audit HSE"
        icon="pi pi-check-square"
        accentGradient="linear-gradient(135deg, #f59e0b, #d97706)"
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

      <TableCard>
        <FilterBar>
          <Dropdown
            value={statusFilter}
            options={STATUS_OPTIONS}
            onChange={(e) => { setStatusFilter(e.value); setPage(1); }}
            className="w-12rem"
            placeholder="Semua Status"
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
            emptyMessage="Tidak ada corrective action."
            style={{ border: 'none' }}
            rowClassName={(r) => ({ 'surface-ground': isOverdue(r) })}
          >
            <Column
              field="action_number"
              header="Action #"
              sortable
              style={{ width: '10%', fontFamily: 'monospace', fontSize: 12 }}
            />
            <Column
              field="description"
              header="Deskripsi"
              body={(r) => (
                <div>
                  <div style={{ fontSize: 13, color: '#0f172a', fontWeight: isOverdue(r) ? 600 : 400 }}>{r.description}</div>
                  {isOverdue(r) && (
                    <span style={{ fontSize: 11, color: '#dc2626', fontWeight: 700 }}>⚠ OVERDUE</span>
                  )}
                </div>
              )}
              style={{ width: '26%' }}
            />
            <Column
              field="priority"
              header="Prioritas"
              body={(r) => <Tag value={r.priority.toUpperCase()} severity={prioritySev(r.priority) as any} />}
              style={{ width: '9%' }}
            />
            <Column field="assigned_to_name" header="Ditugaskan Ke" style={{ width: '13%' }} />
            <Column
              field="due_date"
              header="Tenggat"
              body={(r) => (
                <span style={{
                  fontSize: 12,
                  fontWeight: isOverdue(r) ? 700 : 400,
                  color: isOverdue(r) ? '#dc2626' : '#334155',
                }}>
                  {new Date(r.due_date).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
                </span>
              )}
              style={{ width: '11%' }}
            />
            <Column
              field="status"
              header="Status"
              body={(r) => <Tag value={r.status.replace(/_/g, ' ')} severity={statusSev(r.status) as any} />}
              style={{ width: '11%' }}
            />
            <Column
              field="actionable_type"
              header="Sumber"
              body={(r) => (
                <span style={{ fontSize: 11, color: '#64748b' }}>
                  {r.actionable_type?.split('\\').pop()}
                </span>
              )}
              style={{ width: '12%' }}
            />
            <Column
              header=""
              style={{ width: '8%' }}
              body={(r: CorrectiveAction) =>
                !['completed', 'verified', 'cancelled'].includes(r.status) ? (
                  <Button
                    icon="pi pi-check"
                    rounded text severity="success" size="small"
                    tooltip="Selesaikan"
                    onClick={() => { setSelectedId(r.id); setShowComplete(true); }}
                  />
                ) : (
                  <i className="pi pi-check-circle" style={{ color: '#10b981', fontSize: 16 }} />
                )
              }
            />
          </DataTable>
        </div>
      </TableCard>

      <Dialog
        header={
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: 'linear-gradient(135deg,#10b981,#059669)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <i className="pi pi-check" style={{ color: '#fff', fontSize: 14 }} />
            </div>
            <span>Selesaikan Corrective Action</span>
          </div>
        }
        visible={showComplete}
        onHide={() => setShowComplete(false)}
        style={{ width: '32rem' }}
        footer={(
          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
            <Button label="Batal" severity="secondary" text onClick={() => setShowComplete(false)} />
            <Button label="Tandai Selesai" icon="pi pi-check" severity="success" onClick={handleComplete} />
          </div>
        )}
      >
        <div>
          <label style={{ display: 'block', marginBottom: 6, fontWeight: 600, fontSize: 13 }}>Catatan Penyelesaian</label>
          <InputTextarea
            value={completionNotes}
            onChange={(e) => setCompletionNotes(e.target.value)}
            rows={4}
            className="w-full"
            placeholder="Jelaskan tindakan yang telah dilakukan..."
          />
        </div>
      </Dialog>
    </div>
  );
};

export default CorrectiveActionList;
