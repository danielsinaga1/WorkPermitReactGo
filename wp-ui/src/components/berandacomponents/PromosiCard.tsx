import { useNavigate } from 'react-router-dom';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { Tag } from 'primereact/tag';

export type PromosiCardProps = {
  id: string;
  title: string;
  date: string;
  content: string;
  thumbnail?: string;
};

export const PromosiCard = ({ id, title, date, content, thumbnail }: PromosiCardProps) => {
  const navigate = useNavigate();

  const header = thumbnail ? (
    <div style={{ overflow: 'hidden', height: 220, position: 'relative' }}>
      <img
        src={thumbnail}
        alt={title}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          display: 'block',
          transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to top, rgba(30,27,75,0.5) 0%, transparent 60%)',
          opacity: 0,
          transition: 'opacity 0.4s',
        }}
        className="promosi-overlay"
      />
      <Tag
        value="Promo"
        icon="pi pi-tag"
        severity="danger"
        style={{
          position: 'absolute',
          top: 14,
          left: 14,
          fontSize: '0.68rem',
          padding: '3px 10px',
          borderRadius: 8,
        }}
      />
    </div>
  ) : (
    <div style={{
      height: 220,
      background: 'linear-gradient(135deg, #f3f4f6, #e5e7eb)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
    }}>
      <i className="pi pi-image" style={{ fontSize: '2.5rem', color: '#d1d5db' }} />
      <Tag
        value="Promo"
        icon="pi pi-tag"
        severity="danger"
        style={{
          position: 'absolute',
          top: 14,
          left: 14,
          fontSize: '0.68rem',
          padding: '3px 10px',
          borderRadius: 8,
        }}
      />
    </div>
  );

  return (
    <Card
      header={header}
      className="promosi-card-enhanced"
      style={{ overflow: 'hidden', cursor: 'pointer' }}
      onClick={() => navigate(`/promosi/${id}`)}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
        <div style={{
          width: 36,
          height: 36,
          borderRadius: 10,
          background: 'linear-gradient(135deg, #6366f1, #818cf8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}>
          <i className="pi pi-tags" style={{ color: '#fff', fontSize: '0.85rem' }} />
        </div>
        <div style={{ minWidth: 0 }}>
          <div style={{
            fontWeight: 700,
            fontSize: '1rem',
            color: '#1e1b4b',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}>
            {title}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 2 }}>
            <i className="pi pi-calendar" style={{ fontSize: '0.65rem', color: '#a5b4fc' }} />
            <span style={{ fontSize: '0.75rem', color: '#9CA3AF', fontWeight: 500 }}>{date}</span>
          </div>
        </div>
      </div>
      <p style={{
        margin: '0 0 16px',
        fontSize: '0.85rem',
        color: '#6b7280',
        display: '-webkit-box',
        WebkitLineClamp: 2,
        WebkitBoxOrient: 'vertical',
        overflow: 'hidden',
        lineHeight: 1.6,
      }}>
        {content}
      </p>
      <Button
        label="Selengkapnya"
        icon="pi pi-arrow-right"
        iconPos="right"
        text
        size="small"
        style={{ padding: 0, color: '#4338ca', fontWeight: 600, fontSize: '0.82rem' }}
      />
    </Card>
  );
};
