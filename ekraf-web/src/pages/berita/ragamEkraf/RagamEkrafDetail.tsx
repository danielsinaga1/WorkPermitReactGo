import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { PageHeroBanner } from "../../../components/shared/PageHeroBanner";
import { Button } from "primereact/button";
import { Tag } from "primereact/tag";
import ragamEkrafData from "./ragamEkraf.json";
import "../../profil-ppid.css";
import "../../berita-publikasi.css";

type RagamDetail = {
  id: number;
  title: string;
  date: string;
  thumbnail?: string;
  images: string[];
  descriptions: string[];
};

const RagamEkrafDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [ragamEkraf, setRagamEkraf] = useState<RagamDetail | null>(null);

  useEffect(() => {
    const found = (ragamEkrafData as RagamDetail[]).find((item) => item.id === Number(id));
    setRagamEkraf(found || null);
  }, [id]);

  if (!ragamEkraf) {
    return (
      <div className="pp-page-content">
        <PageHeroBanner title="Ragam Ekraf" subtitle="Detail Ragam Ekraf" icon="pi pi-palette" />
        <div className="bp-empty-state">
          <div className="empty-icon"><i className="pi pi-exclamation-circle" style={{ fontSize: "2rem", color: "#6366f1" }} /></div>
          <p style={{ color: "#6b7280" }}>Data tidak ditemukan</p>
          <Button label="Kembali" icon="pi pi-arrow-left" className="p-button-outlined" onClick={() => navigate(-1)} />
        </div>
      </div>
    );
  }

  return (
    <div className="pp-page-content" style={{ minHeight: "100vh", background: "#f8fafc" }}>
      <PageHeroBanner
        title="Detail Ragam Ekraf"
        subtitle={ragamEkraf.title}
        icon="pi pi-palette"
        tag="RAGAM EKRAF"
        breadcrumbItems={[{ label: "Beranda", url: "/" }, { label: "Berita" }, { label: "Ragam Ekraf", url: "/ragam-ekraf" }, { label: "Detail" }]}
      />

      <div className="bp-detail-article">
        <Button label="Kembali" icon="pi pi-arrow-left" className="p-button-text" onClick={() => navigate(-1)} style={{ marginBottom: 20, color: "#4338ca", fontWeight: 600 }} />

        <div className="bp-detail-content">
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16, flexWrap: "wrap" }}>
            <Tag value="Ragam Ekraf" style={{ background: "#10b981", color: "#fff" }} />
            <span style={{ color: "#6b7280", fontSize: "0.85rem", display: "flex", alignItems: "center", gap: 6 }}>
              <i className="pi pi-calendar" />{ragamEkraf.date}
            </span>
          </div>

          <h1 style={{ fontSize: "1.75rem", fontWeight: 700, color: "#1e1b4b", marginBottom: 20, lineHeight: 1.3 }}>
            {ragamEkraf.title}
          </h1>

          {ragamEkraf.thumbnail && (
            <img src={ragamEkraf.thumbnail} alt="Thumbnail" className="detail-hero-img" />
          )}

          <div className="pp-divider" />

          <div className="detail-text">
            {ragamEkraf.descriptions?.map((desc, i) => (
              <div key={i} style={{ marginBottom: 28 }}>
                <p style={{ margin: 0 }}>
                  {i === 0 && <strong>{ragamEkraf.date} â€“ </strong>}
                  {desc}
                </p>
                {ragamEkraf.images?.[i] && (
                  <img src={ragamEkraf.images[i]} alt={`Gambar ${i + 1}`} className="detail-inline-img" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RagamEkrafDetail;