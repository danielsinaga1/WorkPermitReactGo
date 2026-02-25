import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { PageHeroBanner } from "../../../components/shared/PageHeroBanner";
import { Button } from "primereact/button";
import { Tag } from "primereact/tag";
import newsData from "./berita.json";
import "../../profil-ppid.css";
import "../../berita-publikasi.css";

type NewsItem = {
  id: number;
  title: string;
  date: string;
  thumbnail?: string;
  images: string[];
  descriptions: string[];
};

const BeritaDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [news, setNews] = useState<NewsItem | null>(null);

  useEffect(() => {
    const found = (newsData as NewsItem[]).find((item) => item.id === Number(id));
    setNews(found || null);
  }, [id]);

  if (!news) {
    return (
      <div className="pp-page-content">
        <PageHeroBanner title="Berita" subtitle="Detail Berita" icon="pi pi-megaphone" />
        <div className="bp-empty-state">
          <div className="empty-icon"><i className="pi pi-exclamation-circle" style={{ fontSize: "2rem", color: "#6366f1" }} /></div>
          <p style={{ color: "#6b7280" }}>Berita tidak ditemukan</p>
          <Button label="Kembali" icon="pi pi-arrow-left" className="p-button-outlined" onClick={() => navigate(-1)} />
        </div>
      </div>
    );
  }

  return (
    <div className="pp-page-content" style={{ minHeight: "100vh", background: "#f8fafc" }}>
      <PageHeroBanner
        title="Detail Berita"
        subtitle={news.title}
        icon="pi pi-megaphone"
        tag="BERITA"
        breadcrumbItems={[{ label: "Beranda", url: "/" }, { label: "Berita", url: "/news" }, { label: "Detail" }]}
      />

      <div className="bp-detail-article">
        <Button label="Kembali" icon="pi pi-arrow-left" className="p-button-text" onClick={() => navigate(-1)} style={{ marginBottom: 20, color: "#4338ca", fontWeight: 600 }} />

        <div className="bp-detail-content">
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16, flexWrap: "wrap" }}>
            <Tag value="Berita" severity="info" />
            <span style={{ color: "#6b7280", fontSize: "0.85rem", display: "flex", alignItems: "center", gap: 6 }}>
              <i className="pi pi-calendar" />{news.date}
            </span>
          </div>

          <h1 style={{ fontSize: "1.75rem", fontWeight: 700, color: "#1e1b4b", marginBottom: 20, lineHeight: 1.3 }}>
            {news.title}
          </h1>

          {news.thumbnail && (
            <img src={news.thumbnail} alt="Thumbnail" className="detail-hero-img" />
          )}

          <div className="pp-divider" />

          <div className="detail-text">
            {news.descriptions?.map((desc, i) => (
              <div key={i} style={{ marginBottom: 28 }}>
                <p style={{ margin: 0 }}>
                  {i === 0 && <strong>{news.date} â€“ </strong>}
                  {desc}
                </p>
                {news.images?.[i] && (
                  <img src={news.images[i]} alt={`Gambar ${i + 1}`} className="detail-inline-img" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BeritaDetail;