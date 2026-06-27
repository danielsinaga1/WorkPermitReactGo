import { Link } from "react-router-dom";
import { Button } from "primereact/button";
import { Tag } from "primereact/tag";
import "../../../pages/berita-publikasi.css";

type CardPromosiProps = {
  id: string;
  title: string;
  date: string;
  content: string;
  thumbnail?: string;
};

export const CardPromosi = ({ id, title, date, content, thumbnail }: CardPromosiProps) => {
  return (
    <div className="bp-promo-card">
      <div className="promo-img-wrapper">
        {thumbnail ? (
          <img src={thumbnail} alt={title} />
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', background: '#f3f4f6', color: '#9ca3af' }}>
            <i className="pi pi-image" style={{ fontSize: '3rem' }} />
          </div>
        )}
        <div className="promo-overlay-title">
          <Tag value="Promosi" style={{ fontSize: '0.7rem', background: 'rgba(255,255,255,0.2)', color: '#fff', backdropFilter: 'blur(4px)', marginBottom: 8 }} />
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0, lineHeight: 1.3, textShadow: '0 1px 4px rgba(0,0,0,0.3)' }}>{title}</h3>
        </div>
      </div>
      <div className="promo-body">
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, color: '#6b7280', fontSize: '0.8rem' }}>
          <i className="pi pi-calendar" />
          <span>{date}</span>
        </div>
        <p style={{ fontSize: '0.85rem', color: '#6b7280', lineHeight: 1.6, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' as any, overflow: 'hidden', margin: 0 }}>{content}</p>
        <div style={{ marginTop: 12 }}>
          <Link to={`/promosi/${id}`}>
            <Button label="Selengkapnya" icon="pi pi-arrow-right" iconPos="right" className="p-button-sm p-button-text" style={{ fontSize: '0.8rem', fontWeight: 600, color: '#4338ca', padding: 0 }} />
          </Link>
        </div>
      </div>
    </div>
  );
};