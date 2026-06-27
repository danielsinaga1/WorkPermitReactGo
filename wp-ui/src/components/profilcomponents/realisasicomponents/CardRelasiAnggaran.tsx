import React from 'react';
import { Link } from 'react-router-dom';
import { Tag } from 'primereact/tag';
import { Button } from 'primereact/button';
import '../../../pages/profil-ppid.css';

export interface CardRelasiAnggaranProps {
  id: string | number;
  title: string;
  content: string;
  date: string;
  image: string;
}

export const CardRelasiAnggaran: React.FC<CardRelasiAnggaranProps> = ({ id, title, content, date, image }) => {
  return (
    <div className="pp-budget-card">
      <div style={{ height: 200, overflow: 'hidden', position: 'relative' }}>
        <img
          src={image}
          alt={title}
          className="budget-img"
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
        />
        <Tag
          value="ANGGARAN"
          style={{
            position: 'absolute',
            top: 12,
            left: 12,
            background: 'rgba(99,102,241,0.9)',
            color: '#fff',
            fontSize: '0.65rem',
            padding: '3px 10px',
            borderRadius: 6,
            fontWeight: 700,
            letterSpacing: 0.5,
            backdropFilter: 'blur(4px)',
          }}
        />
      </div>
      <div style={{ padding: '20px 20px 24px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        <h3
          style={{
            fontSize: '1rem',
            fontWeight: 700,
            color: '#1e293b',
            margin: 0,
            lineHeight: 1.4,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {title}
        </h3>
        <p
          style={{
            fontSize: '0.85rem',
            color: '#64748b',
            margin: 0,
            lineHeight: 1.6,
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {content}
        </p>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#94a3b8', fontSize: '0.78rem' }}>
          <i className="pi pi-calendar" style={{ fontSize: '0.75rem' }} />
          {date}
        </div>
        <Link to={`/profil/realisasi-anggaran/${id}`} style={{ textDecoration: 'none' }}>
          <Button
            label="Baca Selengkapnya"
            icon="pi pi-arrow-right"
            iconPos="right"
            text
            style={{
              padding: '8px 0',
              fontSize: '0.82rem',
              fontWeight: 600,
              color: '#6366f1',
            }}
          />
        </Link>
      </div>
    </div>
  );
};

export default CardRelasiAnggaran;
