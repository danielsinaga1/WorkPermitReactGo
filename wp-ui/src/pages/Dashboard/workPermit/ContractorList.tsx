import { useState, useEffect, useCallback, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Tag } from 'primereact/tag';
import { Toast } from 'primereact/toast';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Calendar } from 'primereact/calendar';
import { Dropdown } from 'primereact/dropdown';
import { PageHeader, TableCard, FilterBar } from '../../../components/ui';
import { contractorService } from '../../../services/extendedHseService';
import type { ContractorCompany, CreateContractorPayload, ComplianceStatus } from '../../../types/workPermitTypes';

const STATUS_OPTIONS = [
  { label: 'Semua Status', value: '' },
  { label: 'Compliant', value: 'compliant' },
  { label: 'Warning', value: 'warning' },
  { label: 'Non-Compliant', value: 'non_compliant' },
  { label: 'Blacklisted', value: 'blacklisted' },
];

const complianceColor = (s: ComplianceStatus) => {
  switch (s) {
    case 'compliant': return 'success';
    case 'warning': return 'warning';
    case 'non_compliant': return 'danger';
    case 'blacklisted': return 'danger';
    default: return 'info';
  }
};

const emptyForm: CreateContractorPayload = {
  name: '',
  registration_number: '',
  contact_person: '',
  phone: '',
  email: '',
  address: '',
};

const ContractorList = () => {
  const toast = useRef<Toast>(null);
  const [data, setData] = useState<ContractorCompany[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalRecords, setTotalRecords] = useState(0);
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');
  const [showDialog, setShowDialog] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState<CreateContractorPayload>({ ...emptyForm });
  const [hseCertDate, setHseCertDate] = useState<Date | null>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const resp = await contractorService.list({ compliance_status: statusFilter || undefined, per_page: 15, page });
      setData(resp.data);
      setTotalRecords(resp.total);
    } catch {
      toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Gagal memuat data kontraktor' });
    } finally {
      setLoading(false);
    }
  }, [statusFilter, page]);

  useEffect(() => { loadData(); }, [loadData]);

  const openCreate = () => {
    setEditId(null);
    setForm({ ...emptyForm });
    setHseCertDate(null);
    setShowDialog(true);
  };

  const openEdit = (row: ContractorCompany) => {
    setEditId(row.id);
    setForm({
      name: row.name,
      registration_number: row.registration_number,
      contact_person: row.contact_person ?? '',
      phone: row.phone ?? '',
      email: row.email ?? '',
      address: row.address ?? '',
    });
    setHseCertDate(row.hse_certificate_expiry ? new Date(row.hse_certificate_expiry) : null);
    setShowDialog(true);
  };

  const handleSave = async () => {
    if (!form.name.trim() || !form.registration_number.trim()) {
      toast.current?.show({ severity: 'warn', summary: 'Validasi', detail: 'Nama dan nomor registrasi wajib diisi' });
      return;
    }
    const payload: CreateContractorPayload = {
      ...form,
      hse_certificate_expiry: hseCertDate ? hseCertDate.toISOString().split('T')[0] : undefined,
    };
    try {
      if (editId) {
        await contractorService.update(editId, payload);
        toast.current?.show({ severity: 'success', summary: 'Diperbarui', detail: 'Data kontraktor diperbarui' });
      } else {
        await contractorService.create(payload);
        toast.current?.show({ severity: 'success', summary: 'Tersimpan', detail: 'Kontraktor berhasil ditambahkan' });
      }
      setShowDialog(false);
      loadData();
    } catch {
      toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Gagal menyimpan' });
    }
  };

  const isExpiring = (dateStr?: string | null) => {
    if (!dateStr) return false;
    const diff = new Date(dateStr).getTime() - Date.now();
    return diff > 0 && diff < 30 * 24 * 60 * 60 * 1000;
  };

  const isExpired = (dateStr?: string | null) => {
    if (!dateStr) return false;
    return new Date(dateStr).getTime() < Date.now();
  };

  const expiryTemplate = (dateStr?: string | null) => {
    if (!dateStr) return <span style={{ color: '#94a3b8' }}>—</span>;
    if (isExpired(dateStr)) return <Tag value={new Date(dateStr).toLocaleDateString('id-ID')} severity="danger" />;
    if (isExpiring(dateStr)) return <Tag value={new Date(dateStr).toLocaleDateString('id-ID')} severity="warning" />;
    return <span style={{ fontSize: 13 }}>{new Date(dateStr).toLocaleDateString('id-ID')}</span>;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <Toast ref={toast} />

      <PageHeader
        title="Contractor Companies"
        subtitle="Kelola data perusahaan kontraktor, status kepatuhan, dan sertifikasi HSE"
        icon="pi pi-building"
        accentGradient="linear-gradient(135deg, #0ea5e9, #0284c7)"
        actions={
          <Button
            label="Tambah Kontraktor"
            icon="pi pi-plus"
            style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.3)', color: '#fff' }}
            onClick={openCreate}
          />
        }
      />

      <TableCard>
        <FilterBar>
          <Dropdown value={statusFilter} options={STATUS_OPTIONS} onChange={(e) => { setStatusFilter(e.value); setPage(1); }} className="w-14rem" />
          <Button icon="pi pi-refresh" text rounded severity="secondary" onClick={loadData} loading={loading} tooltip="Refresh" />
        </FilterBar>

        <div style={{ padding: '0 4px' }}>
          <DataTable
            value={data} loading={loading} lazy paginator rows={15}
            totalRecords={totalRecords} first={(page - 1) * 15}
            onPage={(e) => setPage((e.first ?? 0) / 15 + 1)}
            stripedRows size="small" emptyMessage="Belum ada data kontraktor."
            style={{ border: 'none' }}
          >
            <Column field="name" header="Nama Perusahaan" style={{ width: '20%' }}
              body={(r: ContractorCompany) => <span style={{ fontWeight: 600, fontSize: 13 }}>{r.name}</span>} />
            <Column field="registration_number" header="No. Registrasi" style={{ width: '12%', fontFamily: 'monospace', fontSize: 12 }} />
            <Column field="contact_person" header="Kontak" style={{ width: '12%' }} />
            <Column field="email" header="Email" style={{ width: '16%' }} />
            <Column field="compliance_status" header="Kepatuhan"
              body={(r: ContractorCompany) => (
                <Tag value={r.compliance_status.replace(/_/g, ' ')} severity={complianceColor(r.compliance_status)} />
              )} style={{ width: '11%' }} />
            <Column header="HSE Cert Expiry"
              body={(r: ContractorCompany) => expiryTemplate(r.hse_certificate_expiry)}
              style={{ width: '12%' }} />
            <Column header="" style={{ width: '6%' }} body={(r: ContractorCompany) => (
              <Button icon="pi pi-pencil" rounded text size="small" onClick={() => openEdit(r)} tooltip="Edit" />
            )} />
          </DataTable>
        </div>
      </TableCard>

      <Dialog
        header={
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: 'linear-gradient(135deg,#0ea5e9,#0284c7)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <i className="pi pi-building" style={{ color: '#fff', fontSize: 14 }} />
            </div>
            <span>{editId ? 'Edit Kontraktor' : 'Tambah Kontraktor'}</span>
          </div>
        }
        visible={showDialog}
        onHide={() => setShowDialog(false)}
        style={{ width: '36rem' }}
        footer={
          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
            <Button label="Batal" severity="secondary" text onClick={() => setShowDialog(false)} />
            <Button label={editId ? 'Update' : 'Simpan'} icon="pi pi-check" onClick={handleSave} />
          </div>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <label style={{ display: 'block', marginBottom: 6, fontWeight: 600, fontSize: 13 }}>Nama Perusahaan *</label>
            <InputText value={form.name} onChange={(e) => setForm(p => ({ ...p, name: e.target.value }))} className="w-full" />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: 6, fontWeight: 600, fontSize: 13 }}>Nomor Registrasi *</label>
            <InputText value={form.registration_number} onChange={(e) => setForm(p => ({ ...p, registration_number: e.target.value }))} className="w-full" />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={{ display: 'block', marginBottom: 6, fontWeight: 600, fontSize: 13 }}>Kontak Person</label>
              <InputText value={form.contact_person} onChange={(e) => setForm(p => ({ ...p, contact_person: e.target.value }))} className="w-full" />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: 6, fontWeight: 600, fontSize: 13 }}>Telepon</label>
              <InputText value={form.phone} onChange={(e) => setForm(p => ({ ...p, phone: e.target.value }))} className="w-full" />
            </div>
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: 6, fontWeight: 600, fontSize: 13 }}>Email</label>
            <InputText value={form.email} onChange={(e) => setForm(p => ({ ...p, email: e.target.value }))} className="w-full" />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: 6, fontWeight: 600, fontSize: 13 }}>Alamat</label>
            <InputTextarea value={form.address} onChange={(e) => setForm(p => ({ ...p, address: e.target.value }))} rows={2} className="w-full" />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: 6, fontWeight: 600, fontSize: 13 }}>Masa Berlaku Sertifikat HSE</label>
            <Calendar value={hseCertDate} onChange={(e) => setHseCertDate(e.value as Date | null)} className="w-full" dateFormat="yy-mm-dd" />
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default ContractorList;
