import React from 'react';
import { Tag } from 'primereact/tag';
import '../../../pages/profil-ppid.css';

type Props = {
  img: string;
  name: string;
  role: string;
};

export const CardProfilPimpinan: React.FC<Props> = ({ img, name, role }) => (
  <div className="pp-leader-card">
    <div className="leader-img-wrapper" style={{ height: 320 }}>
      <img
        src={img}
        alt={name}
        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
      />
    </div>
    <div style={{ padding: '20px 20px 24px', textAlign: 'center' }}>
      <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#1e293b', margin: '0 0 6px', lineHeight: 1.3 }}>
        {name}
      </h3>
      <Tag
        value={role}
        style={{
          background: 'linear-gradient(135deg, #eef2ff, #e0e7ff)',
          color: '#6366f1',
          fontSize: '0.72rem',
          padding: '4px 12px',
          borderRadius: 8,
          fontWeight: 600,
          maxWidth: '100%',
          whiteSpace: 'normal',
          lineHeight: 1.4,
        }}
      />
    </div>
  </div>
);

export default CardProfilPimpinan;
