import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Tag } from 'primereact/tag';
import { Toast } from 'primereact/toast';
import { PageHeader, TableCard, FilterBar } from '../../../components/ui';
import { workPermitService } from '../../../services/workPermitService';
import type { WorkPermit, PermitStatus, PermitPriority, PermitFilters } from '../../../types/workPermitTypes';

const STATUS_OPTIONS = [
  { label: 'Semua Status', value: '' },
  { label: 'Draft', value: 'draft' },
  { label: 'Submitted', value: 'submitted' },
  { label: 'Under Review', value: 'under_review' },
  { label: 'Pending Approval', value: 'pending_approval' },
  { label: 'Approved', value: 'approved' },
  { label: 'Active', value: 'active' },
  { label: 'Suspended', value: 'suspended' },
  { label: 'Completed', value: 'completed' },
  { label: 'Closed', value: 'closed' },
  { label: 'Rejected', value: 'rejected' },
  { label: 'Expired', value: 'expired' },
];

const PRIORITY_OPTIONS = [
  { label: 'Semua Prioritas', value: '' },
  { label: 'Low', value: 'low' },
  { label: 'Medium', value: 'medium' },
  { label: 'High', value: 'high' },
  { label: 'Critical', value: 'critical' },
];

const statusSev = (status: PermitStatus) => {
  switch (status) {
    case 'draft': return 'secondary';
    case 'submitted': case 'under_review': case 'pending_approval': return 'info';
    case 'approved': case 'active': return 'success';
    case 'suspended': case 'expired': return 'warning';
    case 'completed': case 'closed': return null;
    case 'rejected': case 'cancelled': return 'danger';
    default: return 'info';
  }
};

const prioritySev = (p: PermitPriority) => {
  switch (p) {
    case 'low': return 'success';
    case 'medium': return 'warning';
    case 'high': case 'critical': return 'danger';
    default: return 'info';
  }
};

const PermitList = () => {
  const navigate = useNavigate();
  const toast = useRef<Toast>(null);
  const [data, setData] = useState<WorkPermit[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalRecords, setTotalRecords] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const filters: PermitFilters = {
        search: search || undefined,
        status: (statusFilter as PermitStatus) || undefined,
        priority: (priorityFilter as PermitPriority) || undefined,
        page,
        per_page: 15,
      };
      const resp = await workPermitService.list(filters);
      setData(resp.data);
      setTotalRecords(resp.total);
    } catch {
      toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Gagal memuat permit' });
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter, priorityFilter, page]);

  useEffect(() => { loadData(); }, [loadData]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <Toast ref={toast} />

      <PageHeader
        title="Work Permits"
        subtitle="Pengelolaan izin kerja — pembuatan, persetujuan, dan pemantauan status permit"
        icon="pi pi-file-edit"
        accentGradient="linear-gradient(135deg, #3b82f6, #2563eb)"
        actions={
          <>
            <Button
              icon="pi pi-refresh"
              text
              style={{ color: 'rgba(255,255,255,0.7)', border: 'none' }}
              onClick={loadData}
              loading={loading}
              tooltip="Refresh"
            />
            <Button
              label="Buat Permit"
              icon="pi pi-plus"
              style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.3)', color: '#fff' }}
              onClick={() => navigate('/dashboard/work-permits/create')}
            />
          </>
        }
      />

      <TableCard>
        <FilterBar>
          <span className="p-input-icon-left" style={{ flex: '1 1 200px', maxWidth: 280 }}>
            <i className="pi pi-search" />
            <InputText
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder="Cari permit..."
              className="w-full"
            />
          </span>
          <Dropdown value={statusFilter} options={STATUS_OPTIONS} onChange={(e) => { setStatusFilter(e.value); setPage(1); }} className="w-12rem" />
          <Dropdown value={priorityFilter} options={PRIORITY_OPTIONS} onChange={(e) => { setPriorityFilter(e.value); setPage(1); }} className="w-10rem" />
        </FilterBar>

        <div style={{ padding: '0 4px' }}>
          <DataTable
            value={data}
            loading={loading}
            lazy paginator rows={15} totalRecords={totalRecords}
            first={(page - 1) * 15}
            onPage={(e) => setPage((e.first ?? 0) / 15 + 1)}
            stripedRows size="small"
            emptyMessage="Tidak ada permit ditemukan."
            sortField="created_at"
            sortOrder={-1}
            style={{ border: 'none' }}
          >
            <Column
              field="permit_number"
              header="Permit #"
              sortable
              style={{ width: '11%', fontFamily: 'monospace', fontSize: 12 }}
            />
            <Column
              header=""
              style={{ width: '3%' }}
              body={(r: WorkPermit) =>
                r.has_clash
                  ? <i className="pi pi-exclamation-triangle" style={{ color: '#f97316', fontSize: 14 }} title="Clash terdeteksi" />
                  : null
              }
            />
            <Column field="title" header="Judul Pekerjaan" sortable style={{ width: '22%' }} />
            <Column
              header="Periode"
              body={(r: WorkPermit) => (
                <span style={{ fontSize: 12 }}>
                  {new Date(r.planned_start).toLocaleDateString('id-ID', { day: '2-digit', month: 'short' })}
                  {' — '}
                  {new Date(r.planned_end).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
                </span>
              )}
              style={{ width: '15%' }}
            />
            <Column
              header="Prioritas"
              body={(r: WorkPermit) => (
                <Tag value={r.priority.toUpperCase()} severity={prioritySev(r.priority) as any} />
              )}
              style={{ width: '9%' }}
            />
            <Column
              header="Status"
              body={(r: WorkPermit) => (
                <Tag value={r.status.replace(/_/g, ' ').toUpperCase()} severity={statusSev(r.status) as any} />
              )}
              style={{ width: '13%' }}
            />
            <Column field="work_area.name" header="Area Kerja" style={{ width: '12%' }} />
            <Column field="permit_type.name" header="Tipe" style={{ width: '9%' }} />
            <Column
              header=""
              style={{ width: '6%' }}
              body={(r: WorkPermit) => (
                <div style={{ display: 'flex', gap: 2 }}>
                  <Button
                    icon="pi pi-eye"
                    rounded text size="small"
                    onClick={() => navigate(`/dashboard/work-permits/${r.id}`)}
                    tooltip="Lihat detail"
                  />
                  {r.status === 'draft' && (
                    <Button
                      icon="pi pi-pencil"
                      rounded text severity="info" size="small"
                      onClick={() => navigate(`/dashboard/work-permits/${r.id}/edit`)}
                      tooltip="Edit"
                    />
                  )}
                </div>
              )}
            />
          </DataTable>
        </div>
      </TableCard>
    </div>
  );
};

export default PermitList;
