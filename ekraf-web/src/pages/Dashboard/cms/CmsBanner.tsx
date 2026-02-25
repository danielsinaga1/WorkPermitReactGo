import { useState, useEffect, useCallback } from 'react';
import { bannerService } from '../../../services';
import type { Banner } from '../../../types';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { InputNumber } from 'primereact/inputnumber';
import { Dropdown } from 'primereact/dropdown';
import { Dialog } from 'primereact/dialog';
import { Tag } from 'primereact/tag';
import { Card } from 'primereact/card';
import { BreadCrumb } from 'primereact/breadcrumb';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { Message } from 'primereact/message';
import { ProgressSpinner } from 'primereact/progressspinner';

const CmsBanner = () => {
  const [items, setItems] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState<Banner | null>(null);
  const [form, setForm] = useState({ title: '', description: '', image_url: '', link_url: '', order: 0, is_active: true });
  const [submitting, setSubmitting] = useState(false);

  const breadcrumbItems = [{ label: 'CMS' }, { label: 'Banner' }];
  const breadcrumbHome = { icon: 'pi pi-home', url: '/dashboard' };

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await bannerService.list({ all: 'true' });
      setItems(data);
    } catch {
      setError('Gagal memuat data banner');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const openCreate = () => {
    setEditItem(null);
    setForm({ title: '', description: '', image_url: '', link_url: '', order: items.length + 1, is_active: true });
    setShowModal(true);
  };

  const openEdit = (item: Banner) => {
    setEditItem(item);
    setForm({
      title: item.title,
      description: item.description || '',
      image_url: item.image_url,
      link_url: item.link_url || '',
      order: item.order ?? 0,
      is_active: item.is_active,
    });
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editItem) {
        await bannerService.update(editItem.id, form);
      } else {
        await bannerService.create(form);
      }
      setShowModal(false);
      fetchData();
    } catch {
      alert('Gagal menyimpan banner');
    } finally {
      setSubmitting(false);
    }
  };

  const confirmDelete = (id: number) => {
    confirmDialog({
      message: 'Apakah Anda yakin ingin menghapus banner ini?',
      header: 'Konfirmasi Hapus',
      icon: 'pi pi-exclamation-triangle',
      acceptClassName: 'p-button-danger',
      acceptLabel: 'Hapus',
      rejectLabel: 'Batal',
      accept: async () => {
        try {
          await bannerService.destroy(id);
          fetchData();
        } catch {
          alert('Gagal menghapus banner');
        }
      },
    });
  };

  const dialogFooter = (
    <div className="flex justify-content-end gap-2 pt-2">
      <Button label="Batal" icon="pi pi-times" severity="secondary" outlined onClick={() => setShowModal(false)} />
      <Button label={submitting ? 'Menyimpan...' : 'Simpan'} icon="pi pi-check" loading={submitting} onClick={() => document.getElementById('banner-form')?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))} />
    </div>
  );

  return (
    <div className="flex flex-column gap-4">
      <ConfirmDialog />

      {/* Header */}
      <div className="flex align-items-center justify-content-between flex-wrap gap-3">
        <div>
          <h2 className="text-2xl font-bold text-800 m-0">Slider / Banner</h2>
          <BreadCrumb model={breadcrumbItems} home={breadcrumbHome} className="surface-ground border-none p-0 mt-2" />
        </div>
        <Button label="Tambah Banner" icon="pi pi-plus" className="border-round-xl" onClick={openCreate} />
      </div>

      {error && <Message severity="error" text={error} className="w-full" />}

      {/* Banner Grid */}
      {loading ? (
        <div className="flex align-items-center justify-content-center py-8">
          <ProgressSpinner style={{ width: '50px', height: '50px' }} />
        </div>
      ) : items.length === 0 ? (
        <Card className="shadow-1 border-round-xl">
          <div className="flex flex-column align-items-center justify-content-center py-6">
            <i className="pi pi-images text-4xl text-300 mb-3" />
            <p className="text-lg font-medium text-500 m-0">Belum ada banner</p>
            <p className="text-sm text-400 mt-1">Upload gambar banner untuk ditampilkan di slider</p>
          </div>
        </Card>
      ) : (
        <div className="grid">
          {items.map((item) => (
            <div key={item.id} className="col-12 md:col-6 xl:col-4">
              <div className="surface-card border-round-xl shadow-1 overflow-hidden h-full flex flex-column">
                {/* Image */}
                <div className="relative" style={{ paddingTop: '56.25%' }}>
                  {item.image_url ? (
                    <img
                      src={item.image_url}
                      alt={item.title}
                      className="absolute top-0 left-0 w-full h-full"
                      style={{ objectFit: 'cover' }}
                    />
                  ) : (
                    <div className="absolute top-0 left-0 w-full h-full flex align-items-center justify-content-center surface-100">
                      <i className="pi pi-image text-4xl text-300" />
                    </div>
                  )}
                  <Tag
                    value={item.is_active ? 'Aktif' : 'Nonaktif'}
                    severity={item.is_active ? 'success' : 'warning'}
                    className="absolute"
                    style={{ top: '0.75rem', right: '0.75rem' }}
                  />
                </div>

                {/* Content */}
                <div className="p-4 flex flex-column flex-1">
                  <h4 className="text-lg font-semibold text-800 m-0">{item.title}</h4>
                  {item.description && (
                    <p className="text-sm text-500 mt-1 mb-0 line-height-3" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {item.description}
                    </p>
                  )}

                  <div className="flex align-items-center justify-content-between mt-auto pt-3 border-top-1 surface-border">
                    <span className="text-xs text-400">
                      <i className="pi pi-sort-alt mr-1" />
                      Urutan: {item.order}
                    </span>
                    <div className="flex gap-1">
                      <Button icon="pi pi-pencil" text rounded size="small" severity="info" onClick={() => openEdit(item)} tooltip="Edit" tooltipOptions={{ position: 'top' }} />
                      <Button icon="pi pi-trash" text rounded size="small" severity="danger" onClick={() => confirmDelete(item.id)} tooltip="Hapus" tooltipOptions={{ position: 'top' }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Dialog Create/Edit */}
      <Dialog visible={showModal} onHide={() => setShowModal(false)} header={editItem ? 'Edit Banner' : 'Tambah Banner Baru'} footer={dialogFooter} style={{ width: '540px' }} modal className="border-round-xl" draggable={false}>
        <form id="banner-form" onSubmit={handleSubmit} className="flex flex-column gap-3 pt-2">
          <div className="flex flex-column gap-2">
            <label className="font-medium text-sm text-800">Judul</label>
            <InputText value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required className="border-round-lg" />
          </div>
          <div className="flex flex-column gap-2">
            <label className="font-medium text-sm text-800">Deskripsi</label>
            <InputTextarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={3} className="border-round-lg" autoResize />
          </div>
          <div className="flex flex-column gap-2">
            <label className="font-medium text-sm text-800">URL Gambar</label>
            <InputText value={form.image_url} onChange={e => setForm({ ...form, image_url: e.target.value })} required className="border-round-lg" placeholder="https://..." />
          </div>
          <div className="flex flex-column gap-2">
            <label className="font-medium text-sm text-800">URL Link (opsional)</label>
            <InputText value={form.link_url} onChange={e => setForm({ ...form, link_url: e.target.value })} className="border-round-lg" placeholder="https://..." />
          </div>
          <div className="grid">
            <div className="col-6 flex flex-column gap-2">
              <label className="font-medium text-sm text-800">Urutan</label>
              <InputNumber value={form.order} onValueChange={e => setForm({ ...form, order: e.value ?? 0 })} className="border-round-lg" showButtons />
            </div>
            <div className="col-6 flex flex-column gap-2">
              <label className="font-medium text-sm text-800">Status</label>
              <Dropdown value={form.is_active} options={[{ label: 'Aktif', value: true }, { label: 'Nonaktif', value: false }]} onChange={e => setForm({ ...form, is_active: e.value })} className="border-round-lg" />
            </div>
          </div>
        </form>
      </Dialog>
    </div>
  );
};

export default CmsBanner;
