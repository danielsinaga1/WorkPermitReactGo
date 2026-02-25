import { useNavigate } from 'react-router-dom';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { Tag } from 'primereact/tag';

type NewsCardProps = {
  id: string;
  title: string;
  subtitle?: string;
  content?: string;
  thumbnail: string;
};

export const NewsCard = ({ id, title, subtitle, content, thumbnail }: NewsCardProps) => {
  const navigate = useNavigate();

  const header = (
    <div className="news-image-wrapper" style={{ overflow: 'hidden', height: 210, position: 'relative' }}>
      <img
        src={thumbnail}
        alt={title}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          display: 'block',
        }}
      />
      <div className="news-overlay" />
      <Tag
        value="Berita"
        icon="pi pi-file"
        style={{
          position: 'absolute',
          top: 14,
          left: 14,
          background: 'rgba(67, 56, 202, 0.9)',
          backdropFilter: 'blur(8px)',
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
      className="news-card-enhanced"
      style={{ overflow: 'hidden', cursor: 'pointer' }}
      onClick={() => navigate(`/news/${id}`)}
    >
      <h3 style={{
        margin: '0 0 10px',
        fontSize: '1.05rem',
        fontWeight: 700,
        color: '#1e1b4b',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        display: '-webkit-box',
        WebkitLineClamp: 2,
        WebkitBoxOrient: 'vertical',
        lineHeight: 1.5,
      }}>
        {title}
      </h3>
      {subtitle && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
          <i className="pi pi-calendar" style={{ fontSize: '0.75rem', color: '#9CA3AF' }} />
          <span style={{ color: '#9CA3AF', fontSize: '0.8rem' }}>{subtitle}</span>
        </div>
      )}
      {content && (
        <p style={{
          color: '#6b7280',
          fontSize: '0.85rem',
          margin: '0 0 16px',
          display: '-webkit-box',
          WebkitLineClamp: 3,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          lineHeight: 1.6,
        }}>
          {content}
        </p>
      )}
      <Button
        label="Baca Selengkapnya"
        icon="pi pi-arrow-right"
        iconPos="right"
        text
        size="small"
        style={{ padding: 0, color: '#4338ca', fontWeight: 600, fontSize: '0.82rem' }}
      />
    </Card>
  );
};
