import { Link } from "react-router-dom";
import { Button } from "primereact/button";
import { Tag } from "primereact/tag";
import "../../../pages/berita-publikasi.css";

type CardPustakaProps = {
  id: string | number;
  title: string;
  content: string;
  date: string;
  image: string;
};

export const CardPustaka = ({ id, title, content, date, image }: CardPustakaProps) => {
  return (
    <div className="bp-article-card">
      <div className="article-img-wrapper">
        <img src={image} alt={title} />
        <div className="article-date-badge">
          <i className="pi pi-calendar" />
          {date}
        </div>
      </div>
      <div className="article-body">
        <h3>{title}</h3>
        <p className="article-excerpt">{content}</p>
        <div className="article-footer">
          <Tag value="Pustaka" style={{ fontSize: '0.7rem', background: '#0ea5e9', color: '#fff' }} />
          <Link to={`/publisher/pustaka/${String(id)}`}>
            <Button label="Selengkapnya" icon="pi pi-arrow-right" iconPos="right" className="p-button-sm p-button-text" style={{ fontSize: '0.8rem', fontWeight: 600, color: '#4338ca' }} />
          </Link>
        </div>
      </div>
    </div>
  );
};