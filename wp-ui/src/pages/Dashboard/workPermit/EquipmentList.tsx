import { useState, useEffect, useCallback, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Tag } from 'primereact/tag';
import { Toast } from 'primereact/toast';
import { Dialog } from 'primereact/dialog';
import { PageHeader, TableCard, FilterBar } from '../../../components/ui';
import { equipmentService } from '../../../services/workPermitService';
import type { Equipment, EquipmentCondition } from '../../../types/workPermitTypes';

const CONDITION_OPTIONS = [
  { label: 'Semua Kondisi', value: '' },
  { label: 'Good', value: 'good' },
  { label: 'Fair', value: 'fair' },
  { label: 'Poor', value: 'poor' },
  { label: 'Out of Service', value: 'out_of_service' },
];

const conditionSev = (c: EquipmentCondition) => {
  switch (c) { case 'good': return 'success'; case 'fair': return 'warning'; case 'poor': return 'danger'; case 'out_of_service': return 'danger'; default: return 'info'; }
};

const EquipmentList = () => {
  const toast = useRef<Toast>(null);
  const [data, setData] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalRecords, setTotalRecords] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [conditionFilter, setConditionFilter] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ equipment_id: '', name: '', type: '', brand: '', model: '', serial_number: '', owner_company: '' });

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const resp = await equipmentService.list({ search: search || undefined, condition: conditionFilter || undefined, page, per_page: 15 });
      setData(resp.data);
      setTotalRecords(resp.total);
    } catch {
      toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Gagal memuat peralatan' });
    } finally {
      setLoading(false);
    }
  }, [search, conditionFilter, page]);

  useEffect(() => { loadData(); }, [loadData]);

  const handleCreate = async () => {
    try {
      await equipmentService.create(form as Partial<Equipment>);
      toast.current?.show({ severity: 'success', summary: 'Tersimpan', detail: 'Peralatan berhasil ditambahkan' });
      setShowCreate(false);
      loadData();
    } catch {
      toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Gagal menyimpan peralatan' });
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <Toast ref={toast} />

      <PageHeader
        title="Equipment Management"
        subtitle="Kelola inventaris peralatan, kondisi, sertifikasi inspeksi, dan tag QR untuk tracking"
        icon="pi pi-wrench"
        accentGradient="linear-gradient(135deg, #f59e0b, #d97706)"
        actions={
          <Button
            label="Tambah Peralatan"
            icon="pi pi-plus"
            style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.3)', color: '#fff' }}
            onClick={() => setShowCreate(true)}
          />
        }
      />

      <TableCard>
        <FilterBar>
          <span className="p-input-icon-left">
            <i className="pi pi-search" />
            <InputText value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} placeholder="Cari peralatan…" className="w-15rem" />
          </span>
          <Dropdown value={conditionFilter} options={CONDITION_OPTIONS} onChange={(e) => { setConditionFilter(e.value); setPage(1); }} className="w-12rem" />
          <Button icon="pi pi-refresh" text rounded severity="secondary" onClick={loadData} loading={loading} tooltip="Refresh" />
        </FilterBar>

        <div style={{ padding: '0 4px' }}>
          <DataTable
            value={data} loading={loading} lazy paginator rows={15} totalRecords={totalRecords}
            first={(page - 1) * 15} onPage={(e) => setPage((e.first ?? 0) / 15 + 1)}
            stripedRows size="small" emptyMessage="Belum ada data peralatan."
            style={{ border: 'none' }}
          >
            <Column field="equipment_id" header="Equipment ID" sortable style={{ width: '10%', fontFamily: 'monospace', fontSize: 12 }} />
            <Column field="name" header="Nama" sortable style={{ width: '18%' }} />
            <Column field="type" header="Tipe" style={{ width: '10%' }} />
            <Column field="brand" header="Merek" style={{ width: '10%' }} />
            <Column field="model" header="Model" style={{ width: '10%' }} />
            <Column field="owner_company" header="Pemilik" style={{ width: '12%' }} />
            <Column field="condition" header="Kondisi" body={(r) => <Tag value={r.condition.replace(/_/g, ' ')} severity={conditionSev(r.condition)} />} style={{ width: '10%' }} />
            <Column
              field="next_inspection_date"
              header="Inspeksi Berikutnya"
              body={(r) => r.next_inspection_date ? new Date(r.next_inspection_date).toLocaleDateString('id-ID') : <span style={{ color: '#94a3b8' }}>—</span>}
              style={{ width: '12%' }}
            />
            <Column header="QR" body={(r) => r.qr_code ? <i className="pi pi-qrcode" style={{ color: '#6366f1' }} /> : <span style={{ color: '#94a3b8' }}>—</span>} style={{ width: '5%' }} />
          </DataTable>
        </div>
      </TableCard>

      <Dialog
        header={
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: 'linear-gradient(135deg,#f59e0b,#d97706)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <i className="pi pi-wrench" style={{ color: '#fff', fontSize: 14 }} />
            </div>
            <span>Tambah Peralatan</span>
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
          {(['equipment_id', 'name', 'type', 'brand', 'model', 'serial_number', 'owner_company'] as const).map((f) => (
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

export default EquipmentList;
