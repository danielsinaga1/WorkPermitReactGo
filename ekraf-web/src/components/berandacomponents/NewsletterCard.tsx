import { Card } from 'primereact/card';
import { Tag } from 'primereact/tag';

type NewsletterCardProps = {
  title: string;
  date: string;
  thumbnail: string;
};

export const NewsletterCard = ({ title, date, thumbnail }: NewsletterCardProps) => {
  const header = (
    <div style={{ overflow: 'hidden', height: 190, position: 'relative' }}>
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
          background: 'linear-gradient(to top, rgba(30,27,75,0.4) 0%, transparent 50%)',
          opacity: 0,
          transition: 'opacity 0.4s',
        }}
        className="newsletter-overlay"
      />
      <Tag
        value="Newsletter"
        icon="pi pi-envelope"
        style={{
          position: 'absolute',
          top: 12,
          right: 12,
          background: 'rgba(99, 102, 241, 0.9)',
          backdropFilter: 'blur(8px)',
          fontSize: '0.65rem',
          padding: '3px 10px',
          borderRadius: 8,
        }}
      />
    </div>
  );

  return (
    <Card
      header={header}
      className="newsletter-card-enhanced"
      style={{ overflow: 'hidden', cursor: 'pointer' }}
    >
      <h3 style={{
        margin: '0 0 10px',
        fontSize: '0.95rem',
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
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#9CA3AF', fontSize: '0.8rem' }}>
        <div
          style={{
            width: 28,
            height: 28,
            borderRadius: 8,
            background: '#f1f5f9',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <i className="pi pi-calendar" style={{ fontSize: '0.7rem', color: '#6b7280' }} />
        </div>
        <span style={{ fontWeight: 500 }}>{date}</span>
      </div>
    </Card>
  );
};
