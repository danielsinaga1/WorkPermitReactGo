import { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Tag } from 'primereact/tag';
import { Toast } from 'primereact/toast';
import { Dialog } from 'primereact/dialog';
import { PageHeader, TableCard } from '../../../components/ui';
import { jsaService } from '../../../services/extendedHseService';
import type { JsaTemplate } from '../../../types/workPermitTypes';

const JsaTemplateList = () => {
  const toast = useRef<Toast>(null);
  const [data, setData] = useState<JsaTemplate[]>([]);
  const [loading, setLoading] = useState(false);
  const [detailTarget, setDetailTarget] = useState<JsaTemplate | null>(null);

  useEffect(() => {
    setLoading(true);
    jsaService.listTemplates()
      .then(setData)
      .catch(() => toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Gagal memuat JSA template' }))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <Toast ref={toast} />

      <PageHeader
        title="Job Safety Analysis Templates"
        subtitle="Template analisis keselamatan kerja (JSA) untuk identifikasi bahaya dan tindakan pengendalian sebelum pekerjaan dimulai"
        icon="pi pi-list-check"
        accentGradient="linear-gradient(135deg, #8b5cf6, #7c3aed)"
      />

      <TableCard>
        <div style={{ padding: '0 4px' }}>
          <DataTable
            value={data} loading={loading} stripedRows size="small"
            paginator rows={15} emptyMessage="Belum ada JSA template."
            style={{ border: 'none' }}
          >
            <Column field="name" header="Nama Template" style={{ width: '30%' }}
              body={(r: JsaTemplate) => <span style={{ fontWeight: 600, fontSize: 13 }}>{r.name}</span>} />
            <Column field="applicable_permit_type" header="Tipe Permit"
              body={(r: JsaTemplate) => r.applicable_permit_type
                ? <Tag value={r.applicable_permit_type}
                    severity={r.applicable_permit_type === 'RED' ? 'danger' : r.applicable_permit_type === 'BLUE' ? 'info' : 'success'} />
                : <span style={{ color: '#94a3b8', fontSize: 12 }}>Semua</span>
              } style={{ width: '14%' }} />
            <Column header="Langkah" body={(r: JsaTemplate) => (
              <span style={{
                background: '#ede9fe', color: '#5b21b6', borderRadius: 6,
                padding: '2px 10px', fontSize: 12, fontWeight: 600,
              }}>{(r.steps || []).length} langkah</span>
            )} style={{ width: '12%' }} />
            <Column field="is_active" header="Status"
              body={(r: JsaTemplate) => <Tag value={r.is_active ? 'Aktif' : 'Nonaktif'} severity={r.is_active ? 'success' : 'secondary'} />}
              style={{ width: '10%' }} />
            <Column header="" style={{ width: '8%' }} body={(r: JsaTemplate) => (
              <Button icon="pi pi-eye" rounded text size="small" severity="secondary" tooltip="Lihat Langkah"
                onClick={() => setDetailTarget(r)} />
            )} />
          </DataTable>
        </div>
      </TableCard>

      <Dialog
        header={
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: 'linear-gradient(135deg,#8b5cf6,#7c3aed)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <i className="pi pi-list-check" style={{ color: '#fff', fontSize: 14 }} />
            </div>
            <span>JSA: {detailTarget?.name || ''}</span>
          </div>
        }
        visible={!!detailTarget}
        onHide={() => setDetailTarget(null)}
        style={{ width: '52rem' }}
        maximizable
      >
        {detailTarget && (
          <DataTable value={detailTarget.steps || []} stripedRows size="small" emptyMessage="Belum ada langkah yang didefinisikan.">
            <Column field="step" header="Langkah / Aktivitas" style={{ width: '30%' }} />
            <Column field="hazard" header="Bahaya" style={{ width: '35%' }} />
            <Column field="control" header="Tindakan Pengendalian" style={{ width: '35%' }} />
          </DataTable>
        )}
      </Dialog>
    </div>
  );
};

export default JsaTemplateList;
