import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Tag } from 'primereact/tag';
import { Card } from 'primereact/card';
import { BreadCrumb } from 'primereact/breadcrumb';
import { Toast } from 'primereact/toast';
import { adminTurnamenService } from '../../../services/newFeaturesService';
import type { PesertaTurnamen } from '../../../types';

const TurnamenPeserta = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const toast = useRef<Toast>(null);
  const [data, setData] = useState<PesertaTurnamen[]>([]);
  const [loading, setLoading] = useState(false);

  const breadcrumbHome = { icon: 'pi pi-home', command: () => navigate('/dashboard') };
  const breadcrumbItems = [
    { label: 'Olahraga' },
    { label: 'Turnamen', command: () => navigate('/dashboard/turnamen') },
    { label: 'Peserta' },
  ];

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    adminTurnamenService.peserta(Number(id))
      .then(setData)
      .catch(() => toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Gagal memuat data peserta' }))
      .finally(() => setLoading(false));
  }, [id]);

  const statusTemplate = (row: PesertaTurnamen) => {
    const colors: Record<string, 'info' | 'success' | 'danger'> = {
      terdaftar: 'info', terverifikasi: 'success', didiskualifikasi: 'danger',
    };
    return <Tag value={row.status} severity={colors[row.status] || 'info'} className="text-xs" />;
  };

  return (
    <div className="flex flex-column gap-4">
      <Toast ref={toast} />
      <BreadCrumb model={breadcrumbItems} home={breadcrumbHome} className="surface-ground border-none px-0" />

      <div className="flex align-items-center justify-content-between flex-wrap gap-3">
        <div>
          <h2 className="text-2xl font-bold text-800 m-0">Peserta Turnamen</h2>
          <p className="text-sm text-500 mt-1 mb-0">Daftar peserta yang terdaftar pada turnamen ini</p>
        </div>
        <Button label="Kembali" icon="pi pi-arrow-left" severity="secondary" outlined className="border-round-xl" onClick={() => navigate('/dashboard/turnamen')} />
      </div>

      <Card className="shadow-1 border-round-xl">
        <DataTable value={data} loading={loading} size="small" stripedRows responsiveLayout="scroll" emptyMessage="Belum ada peserta terdaftar">
          <Column field="nama_peserta" header="Nama Peserta" className="font-medium" />
          <Column field="nama_tim" header="Tim" />
          <Column field="no_telp" header="No. Telp" />
          <Column field="email" header="Email" />
          <Column header="Status" body={statusTemplate} alignHeader="center" bodyClassName="text-center" />
        </DataTable>
      </Card>
    </div>
  );
};

export default TurnamenPeserta;
