import { useState, useEffect, useCallback, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Tag } from 'primereact/tag';
import { Toast } from 'primereact/toast';
import { Dialog } from 'primereact/dialog';
import { Calendar } from 'primereact/calendar';
import { PageHeader, TableCard, FilterBar } from '../../../components/ui';
import { auditTrailService } from '../../../services/extendedHseService';

interface AuditTrail {
  id: number;
  module: string;
  auditable_type: string;
  auditable_id: number | null;
  action: string;
  performed_by: string;
  performed_by_id: number | null;
  old_values: Record<string, unknown> | null;
  new_values: Record<string, unknown> | null;
  ip_address: string | null;
  user_agent: string | null;
  remarks: string | null;
  created_at: string;
  performer?: { id: number; name: string } | null;
}

const actionOptions = [
  { label: 'Semua Aksi', value: '' },
  { label: 'Create', value: 'create' },
  { label: 'Update', value: 'update' },
  { label: 'Delete', value: 'delete' },
  { label: 'Approve', value: 'approve' },
  { label: 'Reject', value: 'reject' },
  { label: 'Login', value: 'login' },
  { label: 'Logout', value: 'logout' },
];

const actionSeverity: Record<string, 'success' | 'info' | 'warning' | 'danger' | undefined> = {
  create: 'success',
  update: 'info',
  delete: 'danger',
  approve: 'success',
  reject: 'warning',
  login: undefined,
  logout: undefined,
};

const AuditTrailList = () => {
  const toast = useRef<Toast>(null);
  const [data, setData] = useState<AuditTrail[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalRecords, setTotalRecords] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [actionFilter, setActionFilter] = useState('');
  const [dateRange, setDateRange] = useState<Date[] | null>(null);
  const [detailItem, setDetailItem] = useState<AuditTrail | null>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, unknown> = { page, per_page: 20 };
      if (search) params.search = search;
      if (actionFilter) params.action = actionFilter;
      if (dateRange && dateRange[0]) params.date_from = dateRange[0].toISOString().split('T')[0];
      if (dateRange && dateRange[1]) params.date_to = dateRange[1].toISOString().split('T')[0];
      const resp = await auditTrailService.list(params);
      setData(resp.data as unknown as AuditTrail[]);
      setTotalRecords(resp.total);
    } catch {
      toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Gagal memuat audit trail' });
    } finally {
      setLoading(false);
    }
  }, [search, actionFilter, dateRange, page]);

  useEffect(() => { loadData(); }, [loadData]);

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleString('id-ID', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' });

  const extractModelName = (type: string) => {
    if (!type) return '—';
    const parts = type.split('\\');
    return parts[parts.length - 1];
  };

  const renderChanges = (old_values: Record<string, unknown> | null, new_values: Record<string, unknown> | null) => {
    const allKeys = new Set([...Object.keys(old_values || {}), ...Object.keys(new_values || {})]);
    if (allKeys.size === 0) return <p style={{ color: '#94a3b8', fontSize: 13 }}>Tidak ada perubahan tercatat</p>;
    return (
      <div style={{ overflowX: 'auto', maxHeight: 400 }}>
        <table style={{ width: '100%', fontSize: 13, borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
              <th style={{ padding: '8px 12px', textAlign: 'left', color: '#64748b', fontWeight: 600 }}>Field</th>
              <th style={{ padding: '8px 12px', textAlign: 'left', color: '#64748b', fontWeight: 600 }}>Nilai Lama</th>
              <th style={{ padding: '8px 12px', textAlign: 'left', color: '#64748b', fontWeight: 600 }}>Nilai Baru</th>
            </tr>
          </thead>
          <tbody>
            {Array.from(allKeys).map((key) => (
              <tr key={key} style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '7px 12px', fontWeight: 600, color: '#334155' }}>{key}</td>
                <td style={{ padding: '7px 12px', color: '#ef4444', fontFamily: 'monospace', fontSize: 12 }}>{JSON.stringify(old_values?.[key] ?? '—')}</td>
                <td style={{ padding: '7px 12px', color: '#10b981', fontFamily: 'monospace', fontSize: 12 }}>{JSON.stringify(new_values?.[key] ?? '—')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <Toast ref={toast} />

      <PageHeader
        title="Audit Trail"
        subtitle="Rekam jejak semua aktivitas sistem — pembuatan, perubahan, penghapusan, dan akses pengguna"
        icon="pi pi-history"
        accentGradient="linear-gradient(135deg, #6d28d9, #5b21b6)"
        actions={
          <Button
            label="Refresh"
            icon="pi pi-refresh"
            style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.3)', color: '#fff' }}
            onClick={loadData}
            loading={loading}
          />
        }
      />

      <TableCard>
        <FilterBar>
          <span className="p-input-icon-left">
            <i className="pi pi-search" />
            <InputText value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} placeholder="Cari pengguna atau model…" className="w-15rem" />
          </span>
          <Dropdown value={actionFilter} options={actionOptions} onChange={(e) => { setActionFilter(e.value); setPage(1); }} placeholder="Aksi" className="w-10rem" />
          <Calendar
            value={dateRange as Date[] | undefined}
            onChange={(e) => { setDateRange(e.value as Date[] | null); setPage(1); }}
            selectionMode="range" placeholder="Rentang tanggal" className="w-14rem" dateFormat="yy-mm-dd" showIcon
          />
          <Button icon="pi pi-refresh" text rounded severity="secondary" onClick={loadData} loading={loading} tooltip="Refresh" />
        </FilterBar>

        <div style={{ padding: '0 4px' }}>
          <DataTable
            value={data} loading={loading} lazy paginator rows={20} totalRecords={totalRecords}
            first={(page - 1) * 20} onPage={(e) => setPage((e.first ?? 0) / 20 + 1)}
            stripedRows size="small" emptyMessage="Tidak ada rekaman audit."
            style={{ border: 'none' }}
            rowClassName={(r) => ({ 'bg-red-50': r.action === 'delete' })}
          >
            <Column field="created_at" header="Timestamp" body={(r) => (
              <span style={{ fontSize: 12, fontFamily: 'monospace' }}>{formatDate(r.created_at)}</span>
            )} sortable style={{ width: '16%' }} />
            <Column header="Pengguna" body={(r) => (
              <div>
                <div style={{ fontWeight: 600, fontSize: 13 }}>{r.performed_by || '—'}</div>
                {r.module && <div style={{ fontSize: 11, color: '#94a3b8' }}>{r.module}</div>}
              </div>
            )} style={{ width: '16%' }} />
            <Column field="action" header="Aksi" body={(r) => (
              <Tag value={r.action.toUpperCase()} severity={actionSeverity[r.action]} />
            )} style={{ width: '10%' }} />
            <Column field="auditable_type" header="Model" body={(r) => (
              <span style={{ fontSize: 13, fontWeight: 500 }}>{extractModelName(r.auditable_type)}</span>
            )} style={{ width: '13%' }} />
            <Column field="auditable_id" header="Record ID" style={{ width: '8%' }} body={(r) => (
              <span style={{ fontSize: 12, fontFamily: 'monospace', color: '#64748b' }}>{r.auditable_id || '—'}</span>
            )} />
            <Column field="ip_address" header="IP Address" style={{ width: '12%' }} body={(r) => (
              <span style={{ fontSize: 12, fontFamily: 'monospace', color: '#64748b' }}>{r.ip_address || '—'}</span>
            )} />
            <Column header="" body={(r) => (
              <Button icon="pi pi-eye" severity="info" text size="small" onClick={() => setDetailItem(r)} tooltip="Lihat perubahan" />
            )} style={{ width: '8%' }} />
          </DataTable>
        </div>
      </TableCard>

      <Dialog
        header={
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: 'linear-gradient(135deg,#6d28d9,#5b21b6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <i className="pi pi-history" style={{ color: '#fff', fontSize: 14 }} />
            </div>
            <span>Detail Audit</span>
          </div>
        }
        visible={!!detailItem}
        onHide={() => setDetailItem(null)}
        style={{ width: '52rem' }}
        maximizable
      >
        {detailItem && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, background: '#f8fafc', padding: 16, borderRadius: 10 }}>
              <div>
                <span style={{ fontSize: 11, color: '#64748b', display: 'block', marginBottom: 2 }}>TIMESTAMP</span>
                <strong style={{ fontSize: 12, fontFamily: 'monospace' }}>{formatDate(detailItem.created_at)}</strong>
              </div>
              <div>
                <span style={{ fontSize: 11, color: '#64748b', display: 'block', marginBottom: 2 }}>PENGGUNA</span>
                <strong style={{ fontSize: 13 }}>{detailItem.performed_by || '—'}</strong>
              </div>
              <div>
                <span style={{ fontSize: 11, color: '#64748b', display: 'block', marginBottom: 4 }}>AKSI</span>
                <Tag value={detailItem.action.toUpperCase()} severity={actionSeverity[detailItem.action]} />
              </div>
              <div>
                <span style={{ fontSize: 11, color: '#64748b', display: 'block', marginBottom: 2 }}>MODEL</span>
                <strong style={{ fontSize: 13 }}>{extractModelName(detailItem.auditable_type)}</strong>
              </div>
              <div>
                <span style={{ fontSize: 11, color: '#64748b', display: 'block', marginBottom: 2 }}>RECORD ID</span>
                <strong style={{ fontSize: 13, fontFamily: 'monospace' }}>{detailItem.auditable_id || '—'}</strong>
              </div>
              <div>
                <span style={{ fontSize: 11, color: '#64748b', display: 'block', marginBottom: 2 }}>IP ADDRESS</span>
                <strong style={{ fontSize: 13, fontFamily: 'monospace' }}>{detailItem.ip_address || '—'}</strong>
              </div>
            </div>
            {detailItem.user_agent && (
              <div>
                <span style={{ fontSize: 11, color: '#64748b', display: 'block', marginBottom: 4 }}>USER AGENT</span>
                <span style={{ fontSize: 11, color: '#64748b' }}>{detailItem.user_agent}</span>
              </div>
            )}
            <div>
              <span style={{ fontSize: 13, fontWeight: 700, display: 'block', marginBottom: 10 }}>Perubahan Data</span>
              {renderChanges(detailItem.old_values, detailItem.new_values)}
            </div>
          </div>
        )}
      </Dialog>
    </div>
  );
};

export default AuditTrailList;
