import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { BreadCrumb } from 'primereact/breadcrumb';
import { Divider } from 'primereact/divider';
import { Message } from 'primereact/message';

/* ============================================================
   OPTIONS
   ============================================================ */
const SUBSEKTOR_OPTIONS = [
  { label: 'Kuliner', value: 'kuliner' },
  { label: 'Fashion', value: 'fashion' },
  { label: 'Kriya', value: 'kriya' },
  { label: 'Musik', value: 'musik' },
  { label: 'Film & Animasi', value: 'film' },
  { label: 'Desain Produk', value: 'desain' },
  { label: 'Arsitektur', value: 'arsitektur' },
  { label: 'Fotografi', value: 'fotografi' },
  { label: 'Seni Rupa', value: 'seni_rupa' },
];

const SKALA_OPTIONS = [
  { label: 'Mikro', value: 'mikro' },
  { label: 'Kecil', value: 'kecil' },
  { label: 'Menengah', value: 'menengah' },
  { label: 'Besar', value: 'besar' },
];

/* ============================================================
   COMPONENT
   ============================================================ */
const PelakuEkrafTambah = () => {
  const navigate = useNavigate();
  const [submitted, setSubmitted] = useState(false);
  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState({
    nama: '',
    nik: '',
    email: '',
    telepon: '',
    alamat: '',
    subsektor: '',
    skala_usaha: '',
    nama_usaha: '',
    deskripsi: '',
  });

  const breadcrumbHome = { icon: 'pi pi-home', command: () => navigate('/dashboard') };
  const breadcrumbItems = [
    { label: 'Pelaku DISPOPAR', command: () => navigate('/dashboard/pelaku-ekraf') },
    { label: 'Tambah' },
  ];

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);

    if (!form.nama || !form.nik || !form.subsektor || !form.skala_usaha || !form.nama_usaha) return;

    // TODO: API call
    setSuccess(true);
    setTimeout(() => navigate('/dashboard/pelaku-ekraf'), 1500);
  };

  const isInvalid = (field: string) => submitted && !form[field as keyof typeof form];

  /* ---- Styles ---- */
  const labelStyle: React.CSSProperties = {
    display: 'block',
    marginBottom: '6px',
    fontSize: '0.875rem',
    fontWeight: 600,
    color: '#334155',
  };

  const fieldGroup: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <BreadCrumb model={breadcrumbItems} home={breadcrumbHome} />

      {success && (
        <Message
          severity="success"
          text="Data pelaku DISPOPAR berhasil ditambahkan! Mengalihkan..."
          style={{ width: '100%' }}
        />
      )}

      <Card>
        <div style={{ marginBottom: '20px' }}>
          <h2 style={{ margin: 0, fontWeight: 700, fontSize: '1.25rem', color: '#1e293b' }}>
            <i className="pi pi-user-plus" style={{ marginRight: '8px', color: '#6366f1' }} />
            Form Tambah Pelaku DISPOPAR
          </h2>
          <p style={{ margin: '4px 0 0', fontSize: '0.875rem', color: '#64748b' }}>
            Lengkapi data pelaku ekonomi kreatif di bawah ini
          </p>
        </div>

        <Divider />

        <form onSubmit={handleSubmit}>
          {/* Section: Data Pribadi */}
          <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#475569', marginBottom: '16px' }}>
            <i className="pi pi-id-card" style={{ marginRight: '8px' }} />
            Data Pribadi
          </h3>
          <div className="grid" style={{ marginBottom: '24px' }}>
            <div className="col-12 md:col-6" style={fieldGroup}>
              <label style={labelStyle}>Nama Lengkap <span style={{ color: '#ef4444' }}>*</span></label>
              <InputText
                value={form.nama}
                onChange={(e) => handleChange('nama', e.target.value)}
                placeholder="Masukkan nama lengkap"
                className={isInvalid('nama') ? 'p-invalid' : ''}
              />
              {isInvalid('nama') && <small style={{ color: '#ef4444' }}>Nama wajib diisi</small>}
            </div>
            <div className="col-12 md:col-6" style={fieldGroup}>
              <label style={labelStyle}>NIK <span style={{ color: '#ef4444' }}>*</span></label>
              <InputText
                value={form.nik}
                onChange={(e) => handleChange('nik', e.target.value)}
                placeholder="Masukkan NIK (16 digit)"
                keyfilter="int"
                maxLength={16}
                className={isInvalid('nik') ? 'p-invalid' : ''}
              />
              {isInvalid('nik') && <small style={{ color: '#ef4444' }}>NIK wajib diisi</small>}
            </div>
            <div className="col-12 md:col-6" style={fieldGroup}>
              <label style={labelStyle}>Email</label>
              <InputText
                value={form.email}
                onChange={(e) => handleChange('email', e.target.value)}
                placeholder="Masukkan email"
                type="email"
              />
            </div>
            <div className="col-12 md:col-6" style={fieldGroup}>
              <label style={labelStyle}>No. Telepon</label>
              <InputText
                value={form.telepon}
                onChange={(e) => handleChange('telepon', e.target.value)}
                placeholder="Masukkan no. telepon"
                keyfilter="int"
              />
            </div>
            <div className="col-12" style={fieldGroup}>
              <label style={labelStyle}>Alamat</label>
              <InputTextarea
                value={form.alamat}
                onChange={(e) => handleChange('alamat', e.target.value)}
                placeholder="Masukkan alamat lengkap"
                rows={3}
                autoResize
              />
            </div>
          </div>

          {/* Section: Data Usaha */}
          <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#475569', marginBottom: '16px' }}>
            <i className="pi pi-briefcase" style={{ marginRight: '8px' }} />
            Data Usaha
          </h3>
          <div className="grid" style={{ marginBottom: '24px' }}>
            <div className="col-12 md:col-6" style={fieldGroup}>
              <label style={labelStyle}>Nama Usaha <span style={{ color: '#ef4444' }}>*</span></label>
              <InputText
                value={form.nama_usaha}
                onChange={(e) => handleChange('nama_usaha', e.target.value)}
                placeholder="Masukkan nama usaha"
                className={isInvalid('nama_usaha') ? 'p-invalid' : ''}
              />
              {isInvalid('nama_usaha') && <small style={{ color: '#ef4444' }}>Nama usaha wajib diisi</small>}
            </div>
            <div className="col-12 md:col-6" style={fieldGroup}>
              <label style={labelStyle}>Subsektor <span style={{ color: '#ef4444' }}>*</span></label>
              <Dropdown
                value={form.subsektor}
                options={SUBSEKTOR_OPTIONS}
                onChange={(e) => handleChange('subsektor', e.value)}
                placeholder="Pilih Subsektor"
                className={isInvalid('subsektor') ? 'p-invalid' : ''}
              />
              {isInvalid('subsektor') && <small style={{ color: '#ef4444' }}>Subsektor wajib dipilih</small>}
            </div>
            <div className="col-12 md:col-6" style={fieldGroup}>
              <label style={labelStyle}>Skala Usaha <span style={{ color: '#ef4444' }}>*</span></label>
              <Dropdown
                value={form.skala_usaha}
                options={SKALA_OPTIONS}
                onChange={(e) => handleChange('skala_usaha', e.value)}
                placeholder="Pilih Skala Usaha"
                className={isInvalid('skala_usaha') ? 'p-invalid' : ''}
              />
              {isInvalid('skala_usaha') && <small style={{ color: '#ef4444' }}>Skala usaha wajib dipilih</small>}
            </div>
            <div className="col-12" style={fieldGroup}>
              <label style={labelStyle}>Deskripsi Usaha</label>
              <InputTextarea
                value={form.deskripsi}
                onChange={(e) => handleChange('deskripsi', e.target.value)}
                placeholder="Deskripsi singkat mengenai usaha"
                rows={4}
                autoResize
              />
            </div>
          </div>

          <Divider />

          {/* Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'flex-end' }}>
            <Button
              label="Batal"
              icon="pi pi-times"
              severity="secondary"
              outlined
              type="button"
              onClick={() => navigate('/dashboard/pelaku-ekraf')}
            />
            <Button
              label="Simpan Data"
              icon="pi pi-check"
              raised
              type="submit"
              loading={success}
            />
          </div>
        </form>
      </Card>
    </div>
  );
};

export default PelakuEkrafTambah;
