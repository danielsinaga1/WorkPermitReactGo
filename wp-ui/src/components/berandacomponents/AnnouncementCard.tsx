import { useNavigate } from 'react-router-dom';
import { Ripple } from 'primereact/ripple';

type AnnouncementCardProps = {
  id: string;
  title: string;
  date: string;
};

export const AnnouncementCard = ({ id, title, date }: AnnouncementCardProps) => {
  const navigate = useNavigate();

  return (
    <div
      className="announcement-item p-ripple"
      onClick={() => navigate(`/announcement/${id}`)}
    >
      <Ripple />
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: 10,
            background: 'linear-gradient(135deg, #EEF2FF, #E0E7FF)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <i className="pi pi-megaphone" style={{ color: '#6366f1', fontSize: '1rem' }} />
        </div>
        <div style={{ minWidth: 0, flex: 1 }}>
          <p style={{
            margin: '0 0 8px',
            fontWeight: 600,
            fontSize: '0.88rem',
            color: '#1e1b4b',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            lineHeight: 1.5,
          }}>
            {title}
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <i className="pi pi-calendar" style={{ fontSize: '0.7rem', color: '#a5b4fc' }} />
            <span style={{ fontSize: '0.75rem', color: '#9CA3AF', fontWeight: 500 }}>{date}</span>
          </div>
        </div>
        <i className="pi pi-chevron-right" style={{ color: '#d1d5db', fontSize: '0.7rem', marginTop: 4, flexShrink: 0 }} />
      </div>
    </div>
  );
};
