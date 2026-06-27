import { useState, useEffect, useCallback, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Tag } from 'primereact/tag';
import { Toast } from 'primereact/toast';
import { Dialog } from 'primereact/dialog';
import { PageHeader, TableCard, FilterBar } from '../../../components/ui';
import { personnelService } from '../../../services/workPermitService';
import type { Personnel } from '../../../types/workPermitTypes';

const PersonnelList = () => {
  const toast = useRef<Toast>(null);
  const [data, setData] = useState<Personnel[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalRecords, setTotalRecords] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [company, setCompany] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ employee_id: '', name: '', email: '', phone: '', company: '', department: '', position: '' });

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const resp = await personnelService.list({ search: search || undefined, company: company || undefined, page, per_page: 15 });
      setData(resp.data);
      setTotalRecords(resp.total);
    } catch {
      toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Failed to load personnel' });
    } finally {
      setLoading(false);
    }
  }, [search, company, page]);

  useEffect(() => { loadData(); }, [loadData]);

  const handleCreate = async () => {
    try {
      await personnelService.create(form as Partial<Personnel>);
      toast.current?.show({ severity: 'success', summary: 'Tersimpan', detail: 'Personel berhasil ditambahkan' });
      setShowCreate(false);
      loadData();
    } catch {
      toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Gagal menyimpan personel' });
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <Toast ref={toast} />

      <PageHeader
        title="Personnel Management"
        subtitle="Kelola data personel, sertifikasi, dan tag QR/NFC untuk akses sistem work permit"
        icon="pi pi-users"
        accentGradient="linear-gradient(135deg, #6366f1, #4f46e5)"
        actions={
          <Button
            label="Tambah Personel"
            icon="pi pi-user-plus"
            style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.3)', color: '#fff' }}
            onClick={() => setShowCreate(true)}
          />
        }
      />

      <TableCard>
        <FilterBar>
          <span className="p-input-icon-left">
            <i className="pi pi-search" />
            <InputText value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} placeholder="Cari nama atau ID…" className="w-15rem" />
          </span>
          <InputText value={company} onChange={(e) => { setCompany(e.target.value); setPage(1); }} placeholder="Filter perusahaan…" className="w-12rem" />
          <Button icon="pi pi-refresh" text rounded severity="secondary" onClick={loadData} loading={loading} tooltip="Refresh" />
        </FilterBar>

        <div style={{ padding: '0 4px' }}>
          <DataTable
            value={data} loading={loading} lazy paginator rows={15} totalRecords={totalRecords}
            first={(page - 1) * 15} onPage={(e) => setPage((e.first ?? 0) / 15 + 1)}
            stripedRows size="small" emptyMessage="Belum ada data personel."
            style={{ border: 'none' }}
          >
            <Column field="employee_id" header="Employee ID" sortable style={{ width: '10%', fontFamily: 'monospace', fontSize: 12 }} />
            <Column field="name" header="Nama" sortable style={{ width: '18%' }} />
            <Column field="company" header="Perusahaan" style={{ width: '14%' }} />
            <Column field="department" header="Departemen" style={{ width: '12%' }} />
            <Column field="position" header="Jabatan" style={{ width: '12%' }} />
            <Column field="email" header="Email" style={{ width: '14%' }} />
            <Column header="QR" body={(r) => r.qr_code ? <i className="pi pi-qrcode" style={{ color: '#6366f1' }} /> : <span style={{ color: '#94a3b8' }}>—</span>} style={{ width: '5%' }} />
            <Column header="NFC" body={(r) => r.nfc_tag_id ? <i className="pi pi-wifi" style={{ color: '#10b981' }} /> : <span style={{ color: '#94a3b8' }}>—</span>} style={{ width: '5%' }} />
            <Column field="is_active" header="Status" body={(r) => <Tag value={r.is_active ? 'Aktif' : 'Nonaktif'} severity={r.is_active ? 'success' : 'danger'} />} style={{ width: '8%' }} />
          </DataTable>
        </div>
      </TableCard>

      <Dialog
        header={
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: 'linear-gradient(135deg,#6366f1,#4f46e5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <i className="pi pi-user-plus" style={{ color: '#fff', fontSize: 14 }} />
            </div>
            <span>Tambah Personel</span>
          </div>
        }
        visible={showCreate}
        onHide={() => setShowCreate(false)}
        style={{ width: '35rem' }}
        footer={
          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
            <Button label="Batal" severity="secondary" text onClick={() => setShowCreate(false)} />
            <Button label="Simpan" icon="pi pi-check" onClick={handleCreate} />
          </div>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {(['employee_id', 'name', 'email', 'phone', 'company', 'department', 'position'] as const).map((f) => (
            <div key={f}>
              <label style={{ display: 'block', marginBottom: 6, fontWeight: 600, fontSize: 13 }}>
                {f.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
              </label>
              <InputText value={(form as Record<string, string>)[f]} onChange={(e) => setForm(p => ({ ...p, [f]: e.target.value }))} className="w-full" />
            </div>
          ))}
        </div>
      </Dialog>
    </div>
  );
};

export default PersonnelList;
