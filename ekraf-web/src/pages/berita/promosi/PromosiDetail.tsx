import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { PageHeroBanner } from "../../../components/shared/PageHeroBanner";
import { Button } from "primereact/button";
import { Tag } from "primereact/tag";
import promosiData from "./promosi.json";
import "../../profil-ppid.css";
import "../../berita-publikasi.css";

interface PromoItem {
  id: number;
  title: string;
  content: string;
  date: string;
  thumbnail?: string;
}

const PromosiDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [promotion, setPromotion] = useState<PromoItem | null>(null);

  useEffect(() => {
    const found = (promosiData as PromoItem[]).find((item) => item.id === Number(id));
    setPromotion(found || null);
  }, [id]);

  if (!promotion) {
    return (
      <div className="pp-page-content">
        <PageHeroBanner title="Promosi" subtitle="Detail Promosi" icon="pi pi-star" />
        <div className="bp-empty-state">
          <div className="empty-icon"><i className="pi pi-exclamation-circle" style={{ fontSize: "2rem", color: "#6366f1" }} /></div>
          <p style={{ color: "#6b7280" }}>Promosi tidak ditemukan</p>
          <Button label="Kembali" icon="pi pi-arrow-left" className="p-button-outlined" onClick={() => navigate(-1)} />
        </div>
      </div>
    );
  }

  return (
    <div className="pp-page-content" style={{ minHeight: "100vh", background: "#f8fafc" }}>
      <PageHeroBanner
        title="Detail Promosi"
        subtitle={promotion.title}
        icon="pi pi-star"
        tag="PROMOSI"
        breadcrumbItems={[{ label: "Beranda", url: "/" }, { label: "Berita" }, { label: "Promosi", url: "/promosi" }, { label: "Detail" }]}
      />

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 24px" }}>
        <Button label="Kembali" icon="pi pi-arrow-left" className="p-button-text" onClick={() => navigate(-1)} style={{ marginBottom: 20, color: "#4338ca", fontWeight: 600 }} />

        <div className="bp-detail-content">
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16, flexWrap: "wrap" }}>
            <Tag value="Promosi" style={{ background: "#10b981", color: "#fff" }} />
            <span style={{ color: "#6b7280", fontSize: "0.85rem", display: "flex", alignItems: "center", gap: 6 }}>
              <i className="pi pi-calendar" />{promotion.date}
            </span>
          </div>

          <h1 style={{ fontSize: "1.75rem", fontWeight: 700, color: "#1e1b4b", marginBottom: 24, lineHeight: 1.3, textAlign: "center" }}>
            {promotion.title}
          </h1>

          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 24 }} className="promo-detail-layout">
              {promotion.thumbnail && (
                <div style={{ flexShrink: 0 }}>
                  <img src={promotion.thumbnail} alt={promotion.title} style={{ width: "100%", maxWidth: 450, height: "auto", maxHeight: 600, objectFit: "cover", borderRadius: 14, boxShadow: "0 8px 24px rgba(0,0,0,0.08)", margin: "0 auto", display: "block" }} />
                </div>
              )}

              <div className="pp-divider" />

              <div className="detail-text">
                <p style={{ margin: 0 }}>{promotion.content}</p>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 12, paddingTop: 16, borderTop: "1px solid rgba(0,0,0,0.06)" }}>
              <span style={{ color: "#6b7280", fontSize: "0.9rem", fontWeight: 600 }}>Bagikan:</span>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="bp-social-link" style={{ background: "linear-gradient(135deg, #f58529, #dd2a7b, #8134af)" }}>
                <i className="pi pi-instagram" />
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="bp-social-link" style={{ background: "#1877f2" }}>
                <i className="pi pi-facebook" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PromosiDetail;