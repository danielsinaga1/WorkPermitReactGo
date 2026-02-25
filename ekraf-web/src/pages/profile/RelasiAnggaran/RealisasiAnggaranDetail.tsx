import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { BreadCrumb } from 'primereact/breadcrumb';
import { Button } from 'primereact/button';
import { Tag } from 'primereact/tag';
import { Card } from 'primereact/card';
import realisasiData from './RealisasiAnggaran.json';
import '../../profil-ppid.css';
import type { MenuItem } from 'primereact/menuitem';

type Attachment = {
  type: string;
  name: string;
  url: string;
};

type RealisasiItem = {
  id: number | string;
  title: string;
  content: string;
  date: string;
  thumbnail?: string;
  attachments?: Attachment[];
};

const RealisasiAnggaranDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [item, setItem] = useState<RealisasiItem | null>(null);

  useEffect(() => {
    const found = (realisasiData as RealisasiItem[]).find((d) => String(d.id) === String(id));
    setItem(found || null);
  }, [id]);

  if (!item)
    return (
      <div className="pp-placeholder" style={{ minHeight: '60vh' }}>
        <div className="placeholder-icon">
          <i className="pi pi-exclamation-circle" style={{ fontSize: '2rem', color: '#ef4444' }} />
        </div>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1e293b' }}>Data tidak ditemukan</h3>
        <Button label="Kembali" icon="pi pi-arrow-left" onClick={() => navigate(-1)} outlined />
      </div>
    );

  const home: MenuItem = { icon: 'pi pi-home', command: () => navigate('/') };
  const breadcrumbItems: MenuItem[] = [
    { label: 'Realisasi Anggaran', command: () => navigate('/profil/realisasi-anggaran') },
    { label: 'Detail' },
  ];

  const getFileIcon = (type: string) => {
    if (type === 'pdf') return { icon: 'pi pi-file-pdf', color: '#ef4444' };
    if (type === 'docx') return { icon: 'pi pi-file-word', color: '#3b82f6' };
    return { icon: 'pi pi-file', color: '#64748b' };
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
      {/* Top bar */}
      <div
        style={{
          maxWidth: 1200,
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '16px 24px',
          flexWrap: 'wrap',
          gap: 12,
          borderBottom: '1px solid rgba(0,0,0,.06)',
        }}
      >
        <Button
          label="Kembali"
          icon="pi pi-arrow-left"
          text
          onClick={() => navigate(-1)}
          style={{ color: '#475569', fontWeight: 600, fontSize: '0.85rem' }}
        />
        <BreadCrumb
          model={breadcrumbItems}
          home={home}
          style={{ background: 'transparent', border: 'none', padding: 0, fontSize: '0.82rem' }}
        />
      </div>

      {/* Content */}
      <article style={{ maxWidth: 900, margin: '0 auto', padding: '40px 24px 64px' }} className="pp-page-content">
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <Tag
            value="REALISASI ANGGARAN"
            style={{
              background: 'linear-gradient(135deg, #6366f1, #818cf8)',
              color: '#fff',
              fontSize: '0.65rem',
              padding: '4px 12px',
              borderRadius: 16,
              letterSpacing: 1,
              fontWeight: 700,
              marginBottom: 12,
            }}
          />
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#1e293b', lineHeight: 1.3, margin: '12px 0 8px', letterSpacing: '-0.01em' }}>
            {item.title}
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, color: '#94a3b8', fontSize: '0.82rem' }}>
            <i className="pi pi-calendar" style={{ fontSize: '0.78rem' }} />
            {item.date}
          </div>
        </div>

        {item.thumbnail && (
          <div style={{ borderRadius: 16, overflow: 'hidden', marginBottom: 32, boxShadow: '0 8px 32px rgba(0,0,0,.08)' }}>
            <img
              src={item.thumbnail}
              alt="Thumbnail"
              style={{ width: '100%', height: 'auto', maxHeight: 420, objectFit: 'cover', display: 'block' }}
            />
          </div>
        )}

        <div style={{ color: '#475569', fontSize: '0.95rem', lineHeight: 1.9, textAlign: 'justify' }}>
          <p>{item.content}</p>
        </div>

        <hr className="pp-divider" />

        {/* Attachments */}
        {item.attachments && item.attachments.length > 0 && (
          <section>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#1e293b', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
              <i className="pi pi-paperclip" style={{ color: '#6366f1' }} />
              Lampiran
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {item.attachments.map((file, index) => {
                const fi = getFileIcon(file.type);
                return (
                  <div key={index} className="pp-attachment">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                      <div
                        style={{
                          width: 48,
                          height: 48,
                          borderRadius: 12,
                          background: '#f8fafc',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          border: '1px solid rgba(0,0,0,.06)',
                        }}
                      >
                        <i className={fi.icon} style={{ fontSize: '1.3rem', color: fi.color }} />
                      </div>
                      <div>
                        <p style={{ fontSize: '0.78rem', color: '#94a3b8', margin: '0 0 2px' }}>{item.date}</p>
                        <p style={{ fontSize: '0.9rem', fontWeight: 600, color: '#1e293b', margin: 0 }}>{file.name}</p>
                      </div>
                    </div>
                    <a href={file.url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                      <Button
                        label="Unduh"
                        icon="pi pi-download"
                        size="small"
                        style={{
                          background: 'linear-gradient(135deg, #1e1b4b, #4338ca)',
                          border: 'none',
                          borderRadius: 10,
                          fontSize: '0.78rem',
                          padding: '8px 16px',
                          fontWeight: 600,
                        }}
                      />
                    </a>
                  </div>
                );
              })}
            </div>
          </section>
        )}
      </article>
    </div>
  );
};

export default RealisasiAnggaranDetail;
