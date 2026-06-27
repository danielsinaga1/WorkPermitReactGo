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
import { PageHeader, TableCard, FilterBar } from '../../../components/ui';
import { documentService, type DocumentItem } from '../../../services/arsheService';

const fileIcon = (type: string | null) => {
  if (!type) return 'pi-file';
  const t = type.toLowerCase();
  if (t === 'pdf') return 'pi-file-pdf';
  if (['xls', 'xlsx', 'csv'].includes(t)) return 'pi-file-excel';
  if (['doc', 'docx'].includes(t)) return 'pi-file-word';
  return 'pi-file';
};

const fileColor = (type: string | null) => {
  if (!type) return '#64748b';
  const t = type.toLowerCase();
  if (t === 'pdf') return '#dc2626';
  if (['xls', 'xlsx', 'csv'].includes(t)) return '#16a34a';
  if (['doc', 'docx'].includes(t)) return '#2563eb';
  return '#64748b';
};

const fileBg = (type: string | null) => {
  if (!type) return '#f1f5f9';
  const t = type.toLowerCase();
  if (t === 'pdf') return '#fef2f2';
  if (['xls', 'xlsx', 'csv'].includes(t)) return '#f0fdf4';
  if (['doc', 'docx'].includes(t)) return '#eff6ff';
  return '#f8fafc';
};

const DocumentList = () => {
  const navigate = useNavigate();
  const toast = useRef<Toast>(null);

  const [docs, setDocs] = useState<DocumentItem[]>([]);
  const [categories, setCategories] = useState<Array<{ code: string; name: string }>>([]);
  const [loading, setLoading] = useState(false);
  const [totalRecords, setTotalRecords] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState('');

  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({
    title: '', category: 'sop', version: '1.0', description: '',
    file_path: '', file_type: '', uploaded_by_name: 'Admin',
    effective_date: null as Date | null, expiry_date: null as Date | null,
  });

  const loadDocs = useCallback(async () => {
    setLoading(true);
    try {
      const resp = await documentService.list({ search: search || undefined, category: catFilter || undefined, page, per_page: 15 });
      setDocs(resp.data);
      setTotalRecords(resp.total);
    } catch {
      toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Gagal memuat dokumen' });
    } finally {
      setLoading(false);
    }
  }, [search, catFilter, page]);

  useEffect(() => { loadDocs(); }, [loadDocs]);
  useEffect(() => {
    documentService.categories().then(setCategories).catch(() => setCategories([]));
  }, []);

  const handleCreate = async () => {
    if (!form.title || !form.file_path) {
      toast.current?.show({ severity: 'warn', summary: 'Validasi', detail: 'Title & file path wajib diisi' });
      return;
    }
    try {
      await documentService.create({
        ...form,
        effective_date: form.effective_date ? form.effective_date.toISOString().split('T')[0] : undefined,
        expiry_date: form.expiry_date ? form.expiry_date.toISOString().split('T')[0] : undefined,
      });
      toast.current?.show({ severity: 'success', summary: 'Tersimpan', detail: 'Dokumen berhasil ditambahkan' });
      setShowCreate(false);
      setForm((p) => ({ ...p, title: '', file_path: '', description: '' }));
      loadDocs();
    } catch {
      toast.current?.show({ severity: 'error', summary: 'Error' });
    }
  };

  const handleDownload = async (doc: DocumentItem) => {
    try {
      await documentService.download(doc.id);
      if (doc.file_path) window.open(doc.file_path, '_blank');
    } catch {
      toast.current?.show({ severity: 'error', summary: 'Error' });
    }
  };

  const handleDelete = async (doc: DocumentItem) => {
    if (!confirm(`Hapus dokumen "${doc.title}"?`)) return;
    try {
      await documentService.destroy(doc.id);
      toast.current?.show({ severity: 'success', summary: 'Dihapus' });
      loadDocs();
    } catch {
      toast.current?.show({ severity: 'error', summary: 'Error' });
    }
  };

  const categoryOptions = [
    { label: 'Semua Kategori', value: '' },
    ...categories.map((c) => ({ label: c.name, value: c.code })),
  ];

  const catTagStyle = (cat: string): React.CSSProperties => {
    const colors: Record<string, string> = {
      sop: '#dbeafe', plan: '#e0e7ff', risk_assessment: '#fef3c7',
      report: '#dcfce7', procedure: '#fce7f3', form: '#f3e8ff',
    };
    const textColors: Record<string, string> = {
      sop: '#1e40af', plan: '#3730a3', risk_assessment: '#92400e',
      report: '#166534', procedure: '#831843', form: '#6b21a8',
    };
    return {
      background: colors[cat] ?? '#f1f5f9',
      color: textColors[cat] ?? '#334155',
      borderRadius: 6, padding: '2px 8px', fontSize: 11, fontWeight: 700,
      letterSpacing: '0.04em', textTransform: 'uppercase',
    };
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <Toast ref={toast} />

      <PageHeader
        title="Document Repository"
        subtitle="Manajemen dokumen HSE — SOP, rencana, risk assessment, prosedur, dan laporan"
        icon="pi pi-folder-open"
        accentGradient="linear-gradient(135deg, #14b8a6, #0d9488)"
        actions={
          <>
            <Button
              label="Upload Dokumen"
              icon="pi pi-upload"
              style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.3)', color: '#fff' }}
              onClick={() => setShowCreate(true)}
            />
          </>
        }
      />

      <TableCard>
        <FilterBar>
          <span className="p-input-icon-left" style={{ flex: '1 1 220px', maxWidth: 320 }}>
            <i className="pi pi-search" />
            <InputText
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder="Cari dokumen..."
              className="w-full"
            />
          </span>
          <Dropdown
            value={catFilter}
            options={categoryOptions}
            onChange={(e) => { setCatFilter(e.value); setPage(1); }}
            className="w-13rem"
          />
          <Button icon="pi pi-refresh" text rounded severity="secondary" onClick={loadDocs} loading={loading} tooltip="Refresh" />
        </FilterBar>

        <div style={{ padding: '0 4px' }}>
          <DataTable
            value={docs}
            loading={loading}
            lazy paginator rows={15} totalRecords={totalRecords}
            first={(page - 1) * 15}
            onPage={(e) => setPage((e.first ?? 0) / 15 + 1)}
            stripedRows size="small"
            emptyMessage="Belum ada dokumen."
            style={{ border: 'none' }}
          >
            <Column
              header=""
              style={{ width: '5%' }}
              body={(r) => (
                <div style={{
                  width: 34, height: 34, borderRadius: 8,
                  background: fileBg(r.file_type),
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <i className={`pi ${fileIcon(r.file_type)}`} style={{ color: fileColor(r.file_type), fontSize: 16 }} />
                </div>
              )}
            />
            <Column
              field="title"
              header="Nama Dokumen"
              style={{ width: '30%' }}
              body={(r) => (
                <div>
                  <div style={{ fontWeight: 600, fontSize: 13, color: '#0f172a' }}>{r.title}</div>
                  {r.document_number && <div style={{ fontSize: 11, color: '#94a3b8' }}>{r.document_number}</div>}
                </div>
              )}
            />
            <Column
              header="Kategori"
              body={(r) => <span style={catTagStyle(r.category)}>{r.category.replace(/_/g, ' ')}</span>}
              style={{ width: '13%' }}
            />
            <Column
              field="version"
              header="Versi"
              style={{ width: '7%' }}
              body={(r) => <span style={{ fontFamily: 'monospace', fontSize: 12 }}>v{r.version}</span>}
            />
            <Column
              header="Tgl. Efektif"
              body={(r) => r.effective_date
                ? new Date(r.effective_date).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })
                : <span style={{ color: '#94a3b8' }}>—</span>
              }
              style={{ width: '13%' }}
            />
            <Column field="uploaded_by_name" header="Uploaded By" style={{ width: '13%' }} />
            <Column
              header=""
              style={{ width: '10%' }}
              body={(r) => (
                <div style={{ display: 'flex', gap: 4 }}>
                  <Button icon="pi pi-download" rounded text size="small" severity="info" onClick={() => handleDownload(r)} tooltip="Download" />
                  <Button icon="pi pi-trash" rounded text size="small" severity="danger" onClick={() => handleDelete(r)} tooltip="Hapus" />
                </div>
              )}
            />
          </DataTable>
        </div>
      </TableCard>

      <Dialog
        header={
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: 'linear-gradient(135deg,#14b8a6,#0d9488)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <i className="pi pi-upload" style={{ color: '#fff', fontSize: 14 }} />
            </div>
            <span>Upload Dokumen</span>
          </div>
        }
        visible={showCreate}
        onHide={() => setShowCreate(false)}
        style={{ width: '40rem' }}
        footer={(
          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
            <Button label="Batal" severity="secondary" text onClick={() => setShowCreate(false)} />
            <Button label="Simpan" icon="pi pi-check" onClick={handleCreate} />
          </div>
        )}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <label style={{ display: 'block', marginBottom: 6, fontWeight: 600, fontSize: 13 }}>Judul Dokumen</label>
            <InputText value={form.title} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))} className="w-full" />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 12 }}>
            <div>
              <label style={{ display: 'block', marginBottom: 6, fontWeight: 600, fontSize: 13 }}>Kategori</label>
              <Dropdown
                value={form.category}
                options={categories.length ? categories.map((c) => ({ label: c.name, value: c.code })) : [{ label: 'SOP', value: 'sop' }]}
                onChange={(e) => setForm((p) => ({ ...p, category: e.value }))}
                className="w-full"
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: 6, fontWeight: 600, fontSize: 13 }}>Versi</label>
              <InputText value={form.version} onChange={(e) => setForm((p) => ({ ...p, version: e.target.value }))} className="w-full" placeholder="1.0" />
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '3fr 1fr', gap: 12 }}>
            <div>
              <label style={{ display: 'block', marginBottom: 6, fontWeight: 600, fontSize: 13 }}>File Path / URL</label>
              <InputText value={form.file_path} onChange={(e) => setForm((p) => ({ ...p, file_path: e.target.value }))} className="w-full" placeholder="/uploads/dokumen.pdf" />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: 6, fontWeight: 600, fontSize: 13 }}>Tipe File</label>
              <InputText value={form.file_type} onChange={(e) => setForm((p) => ({ ...p, file_type: e.target.value }))} className="w-full" placeholder="pdf" />
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={{ display: 'block', marginBottom: 6, fontWeight: 600, fontSize: 13 }}>Tanggal Efektif</label>
              <Calendar value={form.effective_date} onChange={(e) => setForm((p) => ({ ...p, effective_date: e.value as Date }))} dateFormat="yy-mm-dd" className="w-full" />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: 6, fontWeight: 600, fontSize: 13 }}>Tanggal Kadaluarsa</label>
              <Calendar value={form.expiry_date} onChange={(e) => setForm((p) => ({ ...p, expiry_date: e.value as Date }))} dateFormat="yy-mm-dd" className="w-full" />
            </div>
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: 6, fontWeight: 600, fontSize: 13 }}>Deskripsi</label>
            <InputTextarea rows={2} value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} className="w-full" />
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default DocumentList;
