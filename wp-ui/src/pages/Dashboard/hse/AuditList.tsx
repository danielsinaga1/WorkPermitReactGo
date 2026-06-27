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
import { ProgressBar } from 'primereact/progressbar';
import { PageHeader, MetricCard, MetricsGrid, TableCard, FilterBar } from '../../../components/ui';
import {
  auditService,
  type AuditPlan,
  type AuditFinding,
  type AuditType,
  type AuditStatus,
  type FindingSeverity,
  type AuditSummary,
} from '../../../services/arsheService';

const AUDIT_TYPE_OPTIONS = [
  { label: 'Internal', value: 'internal' },
  { label: 'External', value: 'external' },
  { label: 'ISO 45001', value: 'iso_45001' },
  { label: 'ISO 14001', value: 'iso_14001' },
  { label: 'ISO 9001', value: 'iso_9001' },
  { label: 'Compliance', value: 'compliance' },
  { label: 'Management', value: 'management' },
  { label: 'Process', value: 'process' },
];

const STATUS_FILTER_OPTIONS = [
  { label: 'Semua Status', value: '' },
  { label: 'Planned', value: 'planned' },
  { label: 'Scheduled', value: 'scheduled' },
  { label: 'In Progress', value: 'in_progress' },
  { label: 'Reporting', value: 'reporting' },
  { label: 'Closed', value: 'closed' },
  { label: 'Cancelled', value: 'cancelled' },
];

const SEVERITY_OPTIONS = [
  { label: 'Critical', value: 'critical' },
  { label: 'Major', value: 'major' },
  { label: 'Minor', value: 'minor' },
  { label: 'Observation', value: 'observation' },
  { label: 'Opportunity', value: 'opportunity' },
];

const AuditList = () => {
  const navigate = useNavigate();
  const toast = useRef<Toast>(null);

  const [audits, setAudits] = useState<AuditPlan[]>([]);
  const [summary, setSummary] = useState<AuditSummary | null>(null);
  const [loading, setLoading] = useState(false);
  const [totalRecords, setTotalRecords] = useState(0);
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');

  const [showCreate, setShowCreate] = useState(false);
  const [createForm, setCreateForm] = useState({
    title: '',
    audit_type: 'internal' as AuditType,
    scope: '',
    planned_start: new Date(),
    planned_end: new Date(Date.now() + 86400000),
    lead_auditor_name: '',
  });

  const [detail, setDetail] = useState<AuditPlan | null>(null);
  const [findings, setFindings] = useState<AuditFinding[]>([]);
  const [showAddFinding, setShowAddFinding] = useState(false);
  const [findingForm, setFindingForm] = useState({
    severity: 'minor' as FindingSeverity,
    title: '',
    description: '',
    clause_reference: '',
    evidence: '',
    responsible_pic_name: '',
    target_close_date: null as Date | null,
  });

  const loadAudits = useCallback(async () => {
    setLoading(true);
    try {
      const resp = await auditService.list({ status: statusFilter || undefined, page, per_page: 15 });
      setAudits(resp.data);
      setTotalRecords(resp.total);
    } catch {
      toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Gagal memuat audit' });
    } finally {
      setLoading(false);
    }
  }, [statusFilter, page]);

  const loadSummary = useCallback(async () => {
    try { setSummary(await auditService.summary()); } catch { /* noop */ }
  }, []);

  useEffect(() => { loadAudits(); }, [loadAudits]);
  useEffect(() => { loadSummary(); }, [loadSummary]);

  const handleCreate = async () => {
    if (!createForm.title || !createForm.lead_auditor_name) {
      toast.current?.show({ severity: 'warn', summary: 'Validasi', detail: 'Title & Lead Auditor wajib diisi' });
      return;
    }
    try {
      const created = await auditService.create({
        ...createForm,
        planned_start: createForm.planned_start.toISOString().split('T')[0],
        planned_end: createForm.planned_end.toISOString().split('T')[0],
      });
      toast.current?.show({ severity: 'success', summary: 'Tersimpan', detail: `Audit ${created.audit_number} dibuat` });
      setShowCreate(false);
      loadAudits(); loadSummary();
    } catch {
      toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Gagal menyimpan' });
    }
  };

  const openDetail = async (a: AuditPlan) => {
    setDetail(a);
    try { setFindings(await auditService.findings(a.id)); } catch { setFindings([]); }
  };

  const handleAddFinding = async () => {
    if (!detail) return;
    if (!findingForm.title || !findingForm.description) {
      toast.current?.show({ severity: 'warn', summary: 'Validasi', detail: 'Judul & deskripsi wajib' });
      return;
    }
    try {
      await auditService.addFinding(detail.id, {
        ...findingForm,
        target_close_date: findingForm.target_close_date ? findingForm.target_close_date.toISOString().split('T')[0] : null,
      });
      toast.current?.show({ severity: 'success', summary: 'Finding ditambahkan' });
      setShowAddFinding(false);
      setFindingForm({ severity: 'minor', title: '', description: '', clause_reference: '', evidence: '', responsible_pic_name: '', target_close_date: null });
      const refreshed = await auditService.show(detail.id);
      setDetail(refreshed);
      setFindings(await auditService.findings(detail.id));
      loadAudits();
    } catch {
      toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Gagal' });
    }
  };

  const handleClose = async () => {
    if (!detail) return;
    try {
      const closed = await auditService.close(detail.id);
      toast.current?.show({ severity: 'success', summary: 'Audit ditutup' });
      setDetail(closed);
      loadAudits(); loadSummary();
    } catch {
      toast.current?.show({ severity: 'error', summary: 'Error' });
    }
  };

  const statusTag = (s: AuditStatus) => {
    const map: Record<AuditStatus, { sev: 'success' | 'info' | 'warning' | 'danger' | undefined; label: string }> = {
      planned: { sev: 'info', label: 'Planned' },
      scheduled: { sev: 'info', label: 'Scheduled' },
      in_progress: { sev: 'warning', label: 'In Progress' },
      reporting: { sev: 'warning', label: 'Reporting' },
      closed: { sev: 'success', label: 'Closed' },
      cancelled: { sev: 'danger', label: 'Cancelled' },
    };
    const m = map[s];
    return <Tag value={m.label} severity={m.sev} />;
  };

  const sevColor = (sev: FindingSeverity): { sev: 'danger' | 'warning' | 'info' | 'success' | undefined; label: string } => {
    switch (sev) {
      case 'critical':    return { sev: 'danger',  label: 'Critical' };
      case 'major':       return { sev: 'warning', label: 'Major' };
      case 'minor':       return { sev: 'info',    label: 'Minor' };
      case 'observation': return { sev: undefined, label: 'Observation' };
      case 'opportunity': return { sev: 'success', label: 'Opportunity' };
    }
  };

  const complianceColor = (score: number) =>
    score >= 90 ? '#10b981' : score >= 70 ? '#f59e0b' : '#ef4444';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <Toast ref={toast} />

      <PageHeader
        title="Audit Management"
        subtitle="Perencanaan, pelaksanaan, dan tindak lanjut audit HSE internal maupun eksternal"
        icon="pi pi-shield"
        accentGradient="linear-gradient(135deg, #8b5cf6, #7c3aed)"
        actions={
          <Button
            label="Buat Audit"
            icon="pi pi-plus"
            style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.3)', color: '#fff' }}
            onClick={() => setShowCreate(true)}
          />
        }
      />

      <MetricsGrid>
        <MetricCard label="Total Audit" value={summary?.total_audits ?? '-'} icon="pi-shield" gradient="linear-gradient(135deg,#8b5cf6,#7c3aed)" />
        <MetricCard label="Total Findings" value={summary?.total_findings ?? '-'} icon="pi-list" gradient="linear-gradient(135deg,#3b82f6,#2563eb)" />
        <MetricCard label="Open Findings" value={summary?.open_findings ?? '-'} icon="pi-clock" gradient="linear-gradient(135deg,#f59e0b,#d97706)" />
        <MetricCard label="Overdue" value={summary?.overdue_findings ?? '-'} icon="pi-exclamation-triangle" gradient="linear-gradient(135deg,#ef4444,#dc2626)" />
        <MetricCard
          label="Avg. Compliance"
          value={summary?.avg_compliance_score != null ? `${summary.avg_compliance_score}%` : '-'}
          icon="pi-chart-bar"
          gradient="linear-gradient(135deg,#10b981,#059669)"
        />
      </MetricsGrid>

      <TableCard>
        <FilterBar>
          <Dropdown
            value={statusFilter}
            options={STATUS_FILTER_OPTIONS}
            onChange={(e) => { setStatusFilter(e.value); setPage(1); }}
            className="w-12rem"
          />
          <Button icon="pi pi-refresh" text rounded severity="secondary" onClick={loadAudits} loading={loading} tooltip="Refresh" />
        </FilterBar>

        <div style={{ padding: '0 4px' }}>
          <DataTable
            value={audits}
            loading={loading}
            lazy paginator rows={15} totalRecords={totalRecords}
            first={(page - 1) * 15}
            onPage={(e) => setPage((e.first ?? 0) / 15 + 1)}
            stripedRows size="small"
            emptyMessage="Belum ada audit."
            style={{ border: 'none' }}
          >
            <Column field="audit_number" header="No." style={{ width: '11%', fontFamily: 'monospace', fontSize: 12 }} />
            <Column field="title" header="Judul" style={{ width: '22%' }} />
            <Column header="Tipe" body={(r) => <Tag value={r.audit_type.replace(/_/g, ' ').toUpperCase()} />} style={{ width: '11%' }} />
            <Column header="Periode" body={(r) => (
              <span style={{ fontSize: 12 }}>{r.planned_start} — {r.planned_end}</span>
            )} style={{ width: '16%' }} />
            <Column field="lead_auditor_name" header="Lead Auditor" style={{ width: '13%' }} />
            <Column header="Findings" body={(r) => (
              <span style={{ fontSize: 12 }}>
                {r.total_findings}
                {r.total_critical > 0 && <span style={{ color: '#ef4444', fontWeight: 700 }}> • {r.total_critical}C</span>}
                {r.total_major > 0 && <span style={{ color: '#f59e0b', fontWeight: 600 }}> {r.total_major}M</span>}
              </span>
            )} style={{ width: '10%' }} />
            <Column header="Score" body={(r) => r.compliance_score != null
              ? <span style={{ fontWeight: 700, color: complianceColor(r.compliance_score) }}>{r.compliance_score}%</span>
              : <span style={{ color: '#94a3b8' }}>—</span>
            } style={{ width: '8%' }} />
            <Column header="Status" body={(r) => statusTag(r.status)} style={{ width: '9%' }} />
            <Column header="" style={{ width: '3%' }} body={(r) => (
              <Button icon="pi pi-eye" rounded text size="small" onClick={() => openDetail(r)} tooltip="Lihat detail" />
            )} />
          </DataTable>
        </div>
      </TableCard>

      {/* Create Dialog */}
      <Dialog
        header={
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: 'linear-gradient(135deg,#8b5cf6,#7c3aed)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <i className="pi pi-plus" style={{ color: '#fff', fontSize: 14 }} />
            </div>
            <span>Buat Rencana Audit</span>
          </div>
        }
        visible={showCreate}
        onHide={() => setShowCreate(false)}
        style={{ width: '40rem' }}
        footer={(
          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
            <Button label="Batal" severity="secondary" text onClick={() => setShowCreate(false)} />
            <Button label="Simpan Audit" icon="pi pi-check" onClick={handleCreate} />
          </div>
        )}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <label style={{ display: 'block', marginBottom: 6, fontWeight: 600, fontSize: 13 }}>Judul Audit</label>
            <InputText value={createForm.title} onChange={(e) => setCreateForm((p) => ({ ...p, title: e.target.value }))} className="w-full" />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: 6, fontWeight: 600, fontSize: 13 }}>Tipe Audit</label>
            <Dropdown value={createForm.audit_type} options={AUDIT_TYPE_OPTIONS} onChange={(e) => setCreateForm((p) => ({ ...p, audit_type: e.value }))} className="w-full" />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={{ display: 'block', marginBottom: 6, fontWeight: 600, fontSize: 13 }}>Mulai</label>
              <Calendar value={createForm.planned_start} onChange={(e) => setCreateForm((p) => ({ ...p, planned_start: e.value as Date }))} dateFormat="yy-mm-dd" className="w-full" />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: 6, fontWeight: 600, fontSize: 13 }}>Selesai</label>
              <Calendar value={createForm.planned_end} onChange={(e) => setCreateForm((p) => ({ ...p, planned_end: e.value as Date }))} dateFormat="yy-mm-dd" className="w-full" />
            </div>
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: 6, fontWeight: 600, fontSize: 13 }}>Lead Auditor</label>
            <InputText value={createForm.lead_auditor_name} onChange={(e) => setCreateForm((p) => ({ ...p, lead_auditor_name: e.target.value }))} className="w-full" />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: 6, fontWeight: 600, fontSize: 13 }}>Scope Audit</label>
            <InputTextarea rows={2} value={createForm.scope} onChange={(e) => setCreateForm((p) => ({ ...p, scope: e.target.value }))} className="w-full" />
          </div>
        </div>
      </Dialog>

      {/* Detail Dialog */}
      <Dialog
        header={detail ? `Detail Audit — ${detail.audit_number}` : ''}
        visible={!!detail}
        onHide={() => { setDetail(null); setFindings([]); }}
        style={{ width: '62rem' }}
      >
        {detail && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
              {statusTag(detail.status)}
              <Tag value={detail.audit_type.replace(/_/g, ' ').toUpperCase()} />
              {detail.compliance_score != null && (
                <span style={{ fontSize: 13, fontWeight: 600, color: complianceColor(detail.compliance_score) }}>
                  Compliance Score: {detail.compliance_score}%
                </span>
              )}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, background: '#f8fafc', padding: 14, borderRadius: 10 }}>
              <div><span style={{ fontSize: 11, color: '#64748b', display: 'block', marginBottom: 2 }}>JUDUL</span><strong style={{ fontSize: 13 }}>{detail.title}</strong></div>
              <div><span style={{ fontSize: 11, color: '#64748b', display: 'block', marginBottom: 2 }}>LEAD AUDITOR</span><strong style={{ fontSize: 13 }}>{detail.lead_auditor_name}</strong></div>
              <div><span style={{ fontSize: 11, color: '#64748b', display: 'block', marginBottom: 2 }}>PERIODE</span><strong style={{ fontSize: 13 }}>{detail.planned_start} — {detail.planned_end}</strong></div>
              {detail.scope && <div><span style={{ fontSize: 11, color: '#64748b', display: 'block', marginBottom: 2 }}>SCOPE</span><strong style={{ fontSize: 13 }}>{detail.scope}</strong></div>}
            </div>

            {detail.compliance_score != null && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: 13 }}>
                  <span style={{ fontWeight: 600 }}>Compliance Score</span>
                  <span style={{ fontWeight: 700, color: complianceColor(detail.compliance_score) }}>{detail.compliance_score}%</span>
                </div>
                <ProgressBar
                  value={detail.compliance_score}
                  showValue={false}
                  style={{ height: 10, borderRadius: 5 }}
                  color={complianceColor(detail.compliance_score)}
                />
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h4 style={{ margin: 0, fontSize: 14, fontWeight: 700 }}>
                Findings ({findings.length})
                {detail.total_critical > 0 && <span style={{ marginLeft: 8, fontSize: 12, color: '#ef4444' }}>{detail.total_critical} Critical</span>}
                {detail.total_major > 0 && <span style={{ marginLeft: 6, fontSize: 12, color: '#f59e0b' }}>{detail.total_major} Major</span>}
              </h4>
              <div style={{ display: 'flex', gap: 8 }}>
                <Button label="Tambah Finding" icon="pi pi-plus" size="small" outlined onClick={() => setShowAddFinding(true)} disabled={detail.status === 'closed'} />
                {detail.status !== 'closed' && (
                  <Button label="Tutup Audit" icon="pi pi-check" size="small" severity="success" onClick={handleClose} />
                )}
              </div>
            </div>

            <DataTable value={findings} stripedRows size="small" emptyMessage="Belum ada finding." style={{ border: '1px solid #e2e8f0', borderRadius: 8, overflow: 'hidden' }}>
              <Column field="finding_number" header="No." style={{ width: '12%' }} />
              <Column header="Severity" body={(r) => { const sc = sevColor(r.severity); return <Tag value={sc.label} severity={sc.sev} />; }} style={{ width: '10%' }} />
              <Column field="title" header="Judul" style={{ width: '26%' }} />
              <Column field="description" header="Deskripsi" body={(r) => <span style={{ fontSize: 12, color: '#334155' }}>{r.description}</span>} style={{ width: '26%' }} />
              <Column field="responsible_pic_name" header="PIC" style={{ width: '13%' }} />
              <Column field="target_close_date" header="Target" style={{ width: '13%' }} />
            </DataTable>
          </div>
        )}
      </Dialog>

      {/* Add Finding Dialog */}
      <Dialog
        header="Tambah Audit Finding"
        visible={showAddFinding}
        onHide={() => setShowAddFinding(false)}
        style={{ width: '38rem' }}
        footer={(
          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
            <Button label="Batal" severity="secondary" text onClick={() => setShowAddFinding(false)} />
            <Button label="Simpan Finding" icon="pi pi-check" onClick={handleAddFinding} />
          </div>
        )}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <label style={{ display: 'block', marginBottom: 6, fontWeight: 600, fontSize: 13 }}>Severity</label>
            <Dropdown value={findingForm.severity} options={SEVERITY_OPTIONS} onChange={(e) => setFindingForm((p) => ({ ...p, severity: e.value }))} className="w-full" />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: 6, fontWeight: 600, fontSize: 13 }}>Judul Finding</label>
            <InputText value={findingForm.title} onChange={(e) => setFindingForm((p) => ({ ...p, title: e.target.value }))} className="w-full" />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: 6, fontWeight: 600, fontSize: 13 }}>Deskripsi</label>
            <InputTextarea rows={3} value={findingForm.description} onChange={(e) => setFindingForm((p) => ({ ...p, description: e.target.value }))} className="w-full" />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: 6, fontWeight: 600, fontSize: 13 }}>Klausul Referensi</label>
            <InputText value={findingForm.clause_reference} onChange={(e) => setFindingForm((p) => ({ ...p, clause_reference: e.target.value }))} className="w-full" placeholder="mis. ISO 45001:4.3.1" />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: 6, fontWeight: 600, fontSize: 13 }}>Evidence</label>
            <InputTextarea rows={2} value={findingForm.evidence} onChange={(e) => setFindingForm((p) => ({ ...p, evidence: e.target.value }))} className="w-full" />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={{ display: 'block', marginBottom: 6, fontWeight: 600, fontSize: 13 }}>PIC</label>
              <InputText value={findingForm.responsible_pic_name} onChange={(e) => setFindingForm((p) => ({ ...p, responsible_pic_name: e.target.value }))} className="w-full" />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: 6, fontWeight: 600, fontSize: 13 }}>Target Tutup</label>
              <Calendar value={findingForm.target_close_date} onChange={(e) => setFindingForm((p) => ({ ...p, target_close_date: e.value as Date }))} dateFormat="yy-mm-dd" className="w-full" />
            </div>
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default AuditList;
