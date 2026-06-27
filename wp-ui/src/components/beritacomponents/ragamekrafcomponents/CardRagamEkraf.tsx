import { Link } from "react-router-dom";
import { Button } from "primereact/button";
import { Tag } from "primereact/tag";
import "../../../pages/berita-publikasi.css";

type CardRagamEkrafProps = {
  id: string | number;
  thumbnail: string;
  title: string;
  content: string;
  date: string;
};

export const CardRagamEkraf = ({ id, thumbnail, title, content, date }: CardRagamEkrafProps) => {
  return (
    <div className="bp-ragam-card">
      <div style={{ overflow: 'hidden', flexShrink: 0 }}>
        <img src={thumbnail} alt={title} className="ragam-img" />
      </div>
      <div className="ragam-body">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <Tag value="Ragam Ekraf" style={{ fontSize: '0.68rem', background: '#10b981', color: '#fff' }} />
          </div>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#1e1b4b', lineHeight: 1.4, margin: '0 0 8px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' as any, overflow: 'hidden' }}>{title}</h3>
          <p style={{ fontSize: '0.85rem', color: '#6b7280', lineHeight: 1.6, margin: 0, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' as any, overflow: 'hidden' }}>{content}</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto', paddingTop: 12 }}>
          <span style={{ color: '#9ca3af', fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: 6 }}>
            <i className="pi pi-calendar" />{date}
          </span>
          <Link to={`/ragam-ekraf/${String(id)}`}>
            <Button label="Selengkapnya" icon="pi pi-arrow-right" iconPos="right" className="p-button-sm p-button-text" style={{ fontSize: '0.8rem', fontWeight: 600, color: '#4338ca' }} />
          </Link>
        </div>
      </div>
    </div>
  );
};