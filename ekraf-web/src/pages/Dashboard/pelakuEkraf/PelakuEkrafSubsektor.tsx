import { useNavigate } from 'react-router-dom';
import { Card } from 'primereact/card';
import { BreadCrumb } from 'primereact/breadcrumb';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Tag } from 'primereact/tag';
import { ProgressBar } from 'primereact/progressbar';

/* ============================================================
   DEMO DATA
   ============================================================ */
const subsektors = [
  { nama: 'Kuliner', pelaku: 3567, pertumbuhan: 8.3, icon: 'pi pi-shopping-bag', color: '#f59e0b' },
  { nama: 'Fashion', pelaku: 2134, pertumbuhan: 6.7, icon: 'pi pi-tag', color: '#ec4899' },
  { nama: 'Kriya', pelaku: 1456, pertumbuhan: 4.8, icon: 'pi pi-palette', color: '#8b5cf6' },
  { nama: 'Film & Animasi', pelaku: 1245, pertumbuhan: 12.5, icon: 'pi pi-video', color: '#3b82f6' },
  { nama: 'Musik', pelaku: 987, pertumbuhan: 15.2, icon: 'pi pi-volume-up', color: '#06b6d4' },
  { nama: 'Desain Produk', pelaku: 876, pertumbuhan: 9.1, icon: 'pi pi-pencil', color: '#10b981' },
  { nama: 'Arsitektur', pelaku: 543, pertumbuhan: 3.4, icon: 'pi pi-building', color: '#64748b' },
  { nama: 'Fotografi', pelaku: 432, pertumbuhan: 7.8, icon: 'pi pi-camera', color: '#f97316' },
  { nama: 'Seni Rupa', pelaku: 321, pertumbuhan: 5.6, icon: 'pi pi-image', color: '#ef4444' },
];

const totalPelaku = subsektors.reduce((acc, s) => acc + s.pelaku, 0);
const maxPelaku = Math.max(...subsektors.map((s) => s.pelaku));

/* ============================================================
   COMPONENT
   ============================================================ */
const PelakuEkrafSubsektor = () => {
  const navigate = useNavigate();

  const breadcrumbHome = { icon: 'pi pi-home', command: () => navigate('/dashboard') };
  const breadcrumbItems = [
    { label: 'Pelaku DISPOPAR', command: () => navigate('/dashboard/pelaku-ekraf') },
    { label: 'Sub-sektor' },
  ];

  /* ---- Card grid ---- */
  const cardGrid = (
    <div className="grid">
      {subsektors.map((item, idx) => {
        const pct = Math.round((item.pelaku / maxPelaku) * 100);
        return (
          <div className="col-12 md:col-6 lg:col-4" key={idx}>
            <Card
              style={{
                borderTop: `3px solid ${item.color}`,
                cursor: 'pointer',
                transition: 'box-shadow 0.2s',
              }}
              className="hover:shadow-4"
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <div style={{
                  width: '44px', height: '44px', borderRadius: '12px',
                  backgroundColor: `${item.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <i className={item.icon} style={{ fontSize: '1.2rem', color: item.color }} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, color: '#1e293b', fontSize: '0.95rem' }}>{item.nama}</div>
                </div>
                <Tag
                  value={`+${item.pertumbuhan}%`}
                  severity="success"
                  style={{ fontSize: '0.75rem' }}
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '8px' }}>
                <span style={{ fontSize: '1.5rem', fontWeight: 700, color: item.color }}>
                  {item.pelaku.toLocaleString('id-ID')}
                </span>
                <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>pelaku terdaftar</span>
              </div>

              <ProgressBar
                value={pct}
                showValue={false}
                style={{ height: '6px', borderRadius: '3px' }}
                color={item.color}
              />
            </Card>
          </div>
        );
      })}
    </div>
  );

  /* ---- Summary row ---- */
  const summaryKPI = (
    <div className="grid">
      <div className="col-12 md:col-4">
        <Card>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{
              width: '48px', height: '48px', borderRadius: '12px',
              backgroundColor: '#eef2ff', display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <i className="pi pi-th-large" style={{ fontSize: '1.25rem', color: '#6366f1' }} />
            </div>
            <div>
              <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1e293b' }}>{subsektors.length}</div>
              <div style={{ fontSize: '0.85rem', color: '#64748b' }}>Total Sub‑sektor</div>
            </div>
          </div>
        </Card>
      </div>
      <div className="col-12 md:col-4">
        <Card>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{
              width: '48px', height: '48px', borderRadius: '12px',
              backgroundColor: '#ecfdf5', display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <i className="pi pi-users" style={{ fontSize: '1.25rem', color: '#22c55e' }} />
            </div>
            <div>
              <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1e293b' }}>
                {totalPelaku.toLocaleString('id-ID')}
              </div>
              <div style={{ fontSize: '0.85rem', color: '#64748b' }}>Total Pelaku</div>
            </div>
          </div>
        </Card>
      </div>
      <div className="col-12 md:col-4">
        <Card>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{
              width: '48px', height: '48px', borderRadius: '12px',
              backgroundColor: '#fff7ed', display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <i className="pi pi-chart-line" style={{ fontSize: '1.25rem', color: '#f59e0b' }} />
            </div>
            <div>
              <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1e293b' }}>
                +{(subsektors.reduce((a, s) => a + s.pertumbuhan, 0) / subsektors.length).toFixed(1)}%
              </div>
              <div style={{ fontSize: '0.85rem', color: '#64748b' }}>Rata‑rata Pertumbuhan</div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );

  /* ---- Table view ---- */
  const namaTemplate = (row: typeof subsektors[0]) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
      <div style={{
        width: '32px', height: '32px', borderRadius: '8px',
        backgroundColor: `${row.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <i className={row.icon} style={{ fontSize: '0.9rem', color: row.color }} />
      </div>
      <span style={{ fontWeight: 600, color: '#1e293b' }}>{row.nama}</span>
    </div>
  );

  const pelakuTemplate = (row: typeof subsektors[0]) => (
    <span style={{ fontWeight: 700, color: '#334155' }}>{row.pelaku.toLocaleString('id-ID')}</span>
  );

  const pertumbuhanTemplate = (row: typeof subsektors[0]) => (
    <Tag value={`+${row.pertumbuhan}%`} severity="success" icon="pi pi-arrow-up" />
  );

  const kontribusiTemplate = (row: typeof subsektors[0]) => {
    const pct = ((row.pelaku / totalPelaku) * 100).toFixed(1);
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: '120px' }}>
        <ProgressBar value={Number(pct)} showValue={false} style={{ height: '6px', flex: 1 }} color={row.color} />
        <span style={{ fontSize: '0.8rem', color: '#64748b', whiteSpace: 'nowrap' }}>{pct}%</span>
      </div>
    );
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <BreadCrumb model={breadcrumbItems} home={breadcrumbHome} />

      {/* KPIs */}
      {summaryKPI}

      {/* Cards Grid */}
      {cardGrid}

      {/* Table Detail */}
      <Card>
        <DataTable
          value={subsektors}
          header={
            <h3 style={{ margin: 0, fontWeight: 600, color: '#1e293b', fontSize: '1rem' }}>
              <i className="pi pi-table" style={{ marginRight: '8px' }} />
              Detail Per Sub-sektor
            </h3>
          }
          stripedRows
          removableSort
          responsiveLayout="scroll"
        >
          <Column header="No" body={(_r, opts) => (opts.rowIndex ?? 0) + 1} style={{ width: '50px' }} />
          <Column header="Sub-sektor" body={namaTemplate} sortable sortField="nama" />
          <Column header="Jumlah Pelaku" body={pelakuTemplate} sortable sortField="pelaku" />
          <Column header="Pertumbuhan" body={pertumbuhanTemplate} sortable sortField="pertumbuhan" />
          <Column header="Kontribusi" body={kontribusiTemplate} />
        </DataTable>
      </Card>
    </div>
  );
};

export default PelakuEkrafSubsektor;
