import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Card } from 'primereact/card';
import { BreadCrumb } from 'primereact/breadcrumb';
import { Divider } from 'primereact/divider';
import { InputSwitch } from 'primereact/inputswitch';
import { Message } from 'primereact/message';

const SettingsGeneral = () => {
  const navigate = useNavigate();
  const [settings, setSettings] = useState({
    siteName: 'DISPOPAR Kota Bontang',
    siteDesc: 'Portal Dinas DISPOPAR Kota Bontang',
    email: 'dispopar@bontangkota.go.id',
    phone: '(0548) 123456',
    address: 'Jl. Awang Long No. 1, Bontang',
  });
  const [maintenance, setMaintenance] = useState(false);
  const [saved, setSaved] = useState(false);

  const breadcrumbHome = { icon: 'pi pi-home', command: () => navigate('/dashboard') };
  const breadcrumbItems = [{ label: 'Sistem' }, { label: 'Pengaturan Umum' }];

  const handleChange = (field: string, value: string) => {
    setSettings({ ...settings, [field]: value });
    setSaved(false);
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <BreadCrumb model={breadcrumbItems} home={breadcrumbHome} />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
        <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 700 }}>Pengaturan Umum</h2>
      </div>

      {saved && <Message severity="success" text="Pengaturan berhasil disimpan!" style={{ width: '100%' }} />}

      {/* Informasi Website */}
      <Card>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
          <i className="pi pi-globe" style={{ fontSize: '1.3rem', color: '#3B82F6' }} />
          <span style={{ fontSize: '1.1rem', fontWeight: 700 }}>Informasi Website</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={{ display: 'block', marginBottom: 6, fontWeight: 600, fontSize: '0.9rem' }}>Nama Website</label>
            <InputText value={settings.siteName} onChange={(e) => handleChange('siteName', e.target.value)} style={{ width: '100%' }} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: 6, fontWeight: 600, fontSize: '0.9rem' }}>Deskripsi</label>
            <InputTextarea value={settings.siteDesc} onChange={(e) => handleChange('siteDesc', e.target.value)} rows={3} style={{ width: '100%' }} />
          </div>
        </div>
      </Card>

      {/* Kontak */}
      <Card>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
          <i className="pi pi-phone" style={{ fontSize: '1.3rem', color: '#10B981' }} />
          <span style={{ fontSize: '1.1rem', fontWeight: 700 }}>Informasi Kontak</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
            <div style={{ flex: '1 1 250px' }}>
              <label style={{ display: 'block', marginBottom: 6, fontWeight: 600, fontSize: '0.9rem' }}>Email</label>
              <InputText value={settings.email} onChange={(e) => handleChange('email', e.target.value)} style={{ width: '100%' }} />
            </div>
            <div style={{ flex: '1 1 250px' }}>
              <label style={{ display: 'block', marginBottom: 6, fontWeight: 600, fontSize: '0.9rem' }}>Telepon</label>
              <InputText value={settings.phone} onChange={(e) => handleChange('phone', e.target.value)} style={{ width: '100%' }} />
            </div>
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: 6, fontWeight: 600, fontSize: '0.9rem' }}>Alamat</label>
            <InputTextarea value={settings.address} onChange={(e) => handleChange('address', e.target.value)} rows={2} style={{ width: '100%' }} />
          </div>
        </div>
      </Card>

      {/* Mode Maintenance */}
      <Card>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
          <i className="pi pi-wrench" style={{ fontSize: '1.3rem', color: '#F59E0B' }} />
          <span style={{ fontSize: '1.1rem', fontWeight: 700 }}>Mode Maintenance</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <div style={{ fontWeight: 500 }}>Aktifkan Mode Maintenance</div>
            <div style={{ fontSize: '0.85rem', color: '#6b7280' }}>Website akan menampilkan halaman maintenance kepada pengunjung</div>
          </div>
          <InputSwitch checked={maintenance} onChange={(e) => setMaintenance(e.value ?? false)} />
        </div>

        {maintenance && (
          <>
            <Divider />
            <Message severity="warn" text="Mode maintenance aktif. Website tidak dapat diakses oleh publik." style={{ width: '100%' }} />
          </>
        )}
      </Card>

      {/* Save Button */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
        <Button label="Reset" icon="pi pi-refresh" severity="secondary" outlined />
        <Button label="Simpan Pengaturan" icon="pi pi-check" onClick={handleSave} />
      </div>
    </div>
  );
};

export default SettingsGeneral;
