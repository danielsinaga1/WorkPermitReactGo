import { useState, useEffect, useCallback, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Tag } from 'primereact/tag';
import { Toast } from 'primereact/toast';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Dropdown } from 'primereact/dropdown';
import { Checkbox } from 'primereact/checkbox';
import { PageHeader, TableCard, FilterBar } from '../../../components/ui';
import { lessonService } from '../../../services/extendedHseService';
import type { LessonLearned, CreateLessonPayload } from '../../../types/workPermitTypes';

const SEVERITY_OPTIONS = [
  { label: 'Low', value: 'low' },
  { label: 'Medium', value: 'medium' },
  { label: 'High', value: 'high' },
  { label: 'Critical', value: 'critical' },
];

const PERMIT_TYPE_OPTS = [
  { label: 'RED — Hot Work', value: 'RED' },
  { label: 'BLUE — Confined Space', value: 'BLUE' },
  { label: 'GREEN — General', value: 'GREEN' },
];

const emptyLesson: CreateLessonPayload = {
  title: '',
  summary: '',
  preventive_measures: '',
  incident_id: undefined,
  root_cause_summary: '',
  applicable_permit_types: [],
  severity_level: 'medium',
  is_mandatory_reading: false,
};

const severityColor = (s: string) => {
  switch (s) { case 'low': return 'success'; case 'medium': return 'warning'; case 'high': return 'danger'; case 'critical': return 'danger'; default: return 'info'; }
};

const LessonLearnedList = () => {
  const toast = useRef<Toast>(null);
  const [data, setData] = useState<LessonLearned[]>([]);
  const [loading, setLoading] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [form, setForm] = useState<CreateLessonPayload>({ ...emptyLesson });
  const [typeFilter, setTypeFilter] = useState('');

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const lessons = await lessonService.list(typeFilter || undefined);
      setData(lessons);
    } catch {
      toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Gagal memuat lessons learned' });
    } finally {
      setLoading(false);
    }
  }, [typeFilter]);

  useEffect(() => { loadData(); }, [loadData]);

  const handleCreate = async () => {
    if (!form.title.trim() || !form.summary.trim() || !form.preventive_measures.trim()) {
      toast.current?.show({ severity: 'warn', summary: 'Validasi', detail: 'Judul, ringkasan & tindakan pencegahan wajib diisi' });
      return;
    }
    try {
      await lessonService.create(form);
      toast.current?.show({ severity: 'success', summary: 'Tersimpan', detail: 'Lesson learned berhasil dicatat' });
      setShowDialog(false);
      setForm({ ...emptyLesson });
      loadData();
    } catch {
      toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Gagal menyimpan' });
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <Toast ref={toast} />

      <PageHeader
        title="Lessons Learned"
        subtitle="Dokumentasi pelajaran dari insiden dan near miss untuk mencegah kejadian serupa di masa depan"
        icon="pi pi-book"
        accentGradient="linear-gradient(135deg, #06b6d4, #0891b2)"
        actions={
          <Button
            label="Tambah Lesson"
            icon="pi pi-plus"
            style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.3)', color: '#fff' }}
            onClick={() => setShowDialog(true)}
          />
        }
      />

      <TableCard>
        <FilterBar>
          <Dropdown
            value={typeFilter}
            options={[{ label: 'Semua Tipe Permit', value: '' }, ...PERMIT_TYPE_OPTS]}
            onChange={(e) => setTypeFilter(e.value)}
            className="w-14rem"
          />
          <Button icon="pi pi-refresh" text rounded severity="secondary" onClick={loadData} loading={loading} tooltip="Refresh" />
        </FilterBar>

        <div style={{ padding: '0 4px' }}>
          <DataTable
            value={data}
            loading={loading}
            stripedRows size="small"
            paginator rows={15}
            emptyMessage="Belum ada lessons learned."
            style={{ border: 'none' }}
          >
            <Column
              field="title"
              header="Judul"
              style={{ width: '22%' }}
              body={(r: LessonLearned) => <span style={{ fontWeight: 600, fontSize: 13 }}>{r.title}</span>}
            />
            <Column
              field="severity_level"
              header="Severity"
              body={(r: LessonLearned) => <Tag value={r.severity_level} severity={severityColor(r.severity_level) as any} />}
              style={{ width: '8%' }}
            />
            <Column
              field="summary"
              header="Ringkasan"
              body={(r: LessonLearned) => <span style={{ fontSize: 12, color: '#334155' }}>{r.summary}</span>}
              style={{ width: '26%' }}
            />
            <Column
              field="preventive_measures"
              header="Tindakan Pencegahan"
              body={(r: LessonLearned) => <span style={{ fontSize: 12, color: '#334155' }}>{r.preventive_measures}</span>}
              style={{ width: '22%' }}
            />
            <Column
              header="Tipe Permit"
              body={(r: LessonLearned) => (r.applicable_permit_types || []).map((t) => (
                <Tag key={t} value={t} className="mr-1" severity={t === 'RED' ? 'danger' : t === 'BLUE' ? 'info' : 'success'} />
              ))}
              style={{ width: '12%' }}
            />
            <Column
              field="is_mandatory_reading"
              header="Wajib"
              body={(r: LessonLearned) =>
                r.is_mandatory_reading
                  ? <span style={{ background: '#fee2e2', color: '#991b1b', borderRadius: 6, padding: '2px 8px', fontSize: 11, fontWeight: 700 }}>Wajib</span>
                  : <span style={{ color: '#94a3b8', fontSize: 12 }}>—</span>
              }
              style={{ width: '7%' }}
            />
            <Column
              field="created_at"
              header="Tanggal"
              body={(r: LessonLearned) => new Date(r.created_at).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
              style={{ width: '10%' }}
            />
          </DataTable>
        </div>
      </TableCard>

      <Dialog
        header={
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: 'linear-gradient(135deg,#06b6d4,#0891b2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <i className="pi pi-book" style={{ color: '#fff', fontSize: 14 }} />
            </div>
            <span>Tambah Lesson Learned</span>
          </div>
        }
        visible={showDialog}
        onHide={() => setShowDialog(false)}
        style={{ width: '42rem' }}
        footer={(
          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
            <Button label="Batal" severity="secondary" text onClick={() => setShowDialog(false)} />
            <Button label="Simpan" icon="pi pi-check" severity="info" onClick={handleCreate} />
          </div>
        )}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <label style={{ display: 'block', marginBottom: 6, fontWeight: 600, fontSize: 13 }}>Judul</label>
            <InputText value={form.title} onChange={(e) => setForm(p => ({ ...p, title: e.target.value }))} className="w-full" />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={{ display: 'block', marginBottom: 6, fontWeight: 600, fontSize: 13 }}>Incident ID (opsional)</label>
              <InputText value={form.incident_id?.toString() ?? ''} onChange={(e) => setForm(p => ({ ...p, incident_id: e.target.value ? Number(e.target.value) : undefined }))} className="w-full" placeholder="ID insiden" keyfilter="pint" />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: 6, fontWeight: 600, fontSize: 13 }}>Severity</label>
              <Dropdown value={form.severity_level} options={SEVERITY_OPTIONS} onChange={(e) => setForm(p => ({ ...p, severity_level: e.value }))} className="w-full" />
            </div>
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: 6, fontWeight: 600, fontSize: 13 }}>Berlaku untuk Tipe Permit</label>
            <div style={{ display: 'flex', gap: 16 }}>
              {PERMIT_TYPE_OPTS.map((opt) => (
                <div key={opt.value} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Checkbox
                    checked={(form.applicable_permit_types || []).includes(opt.value)}
                    onChange={(e) => {
                      const types = [...(form.applicable_permit_types || [])];
                      if (e.checked) types.push(opt.value);
                      else { const idx = types.indexOf(opt.value); if (idx >= 0) types.splice(idx, 1); }
                      setForm(p => ({ ...p, applicable_permit_types: types }));
                    }}
                  />
                  <label style={{ fontSize: 13 }}>{opt.label}</label>
                </div>
              ))}
            </div>
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: 6, fontWeight: 600, fontSize: 13 }}>Ringkasan Kejadian</label>
            <InputTextarea value={form.summary} onChange={(e) => setForm(p => ({ ...p, summary: e.target.value }))} rows={3} className="w-full" />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: 6, fontWeight: 600, fontSize: 13 }}>Ringkasan Akar Masalah</label>
            <InputTextarea value={form.root_cause_summary} onChange={(e) => setForm(p => ({ ...p, root_cause_summary: e.target.value }))} rows={2} className="w-full" />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: 6, fontWeight: 600, fontSize: 13 }}>Tindakan Pencegahan</label>
            <InputTextarea value={form.preventive_measures} onChange={(e) => setForm(p => ({ ...p, preventive_measures: e.target.value }))} rows={3} className="w-full" />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 12px', background: '#fef3c7', borderRadius: 8, border: '1px solid #fde68a' }}>
            <Checkbox checked={form.is_mandatory_reading ?? false} onChange={(e) => setForm(p => ({ ...p, is_mandatory_reading: !!e.checked }))} />
            <label style={{ fontWeight: 600, fontSize: 13, color: '#92400e' }}>Wajib dibaca oleh semua pemegang permit terkait</label>
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default LessonLearnedList;
