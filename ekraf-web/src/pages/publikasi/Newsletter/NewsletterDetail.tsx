import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { PageHeroBanner } from "../../../components/shared/PageHeroBanner";
import { Button } from "primereact/button";
import { Tag } from "primereact/tag";
import newsletterData from "./newsletter.json";
import "../../profil-ppid.css";
import "../../berita-publikasi.css";

type NewsletterItem = {
  id: number;
  title: string;
  content: string;
  date: string;
  thumbnail: string;
  pdf: string;
};

const NewsletterDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [newsletter, setNewsletter] = useState<NewsletterItem | null>(null);

  useEffect(() => {
    const found = (newsletterData as unknown as NewsletterItem[]).find((item) => item.id === Number(id));
    setNewsletter(found || null);
  }, [id]);

  if (!newsletter) {
    return (
      <div className="pp-page-content">
        <PageHeroBanner title="Newsletter" subtitle="Detail Newsletter" icon="pi pi-envelope" />
        <div className="bp-empty-state">
          <div className="empty-icon"><i className="pi pi-exclamation-circle" style={{ fontSize: "2rem", color: "#6366f1" }} /></div>
          <p style={{ color: "#6b7280" }}>Newsletter tidak ditemukan</p>
          <Button label="Kembali" icon="pi pi-arrow-left" className="p-button-outlined" onClick={() => navigate(-1)} />
        </div>
      </div>
    );
  }

  return (
    <div className="pp-page-content" style={{ minHeight: "100vh", background: "#f8fafc" }}>
      <PageHeroBanner
        title="Detail Newsletter"
        subtitle={newsletter.title}
        icon="pi pi-envelope"
        tag="NEWSLETTER"
        breadcrumbItems={[{ label: "Beranda", url: "/" }, { label: "Publikasi" }, { label: "Newsletter", url: "/publisher/newsletter" }, { label: "Detail" }]}
      />

      <div className="bp-detail-article">
        <Button label="Kembali" icon="pi pi-arrow-left" className="p-button-text" onClick={() => navigate(-1)} style={{ marginBottom: 20, color: "#4338ca", fontWeight: 600 }} />

        <div className="bp-detail-content">
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16, flexWrap: "wrap" }}>
            <Tag value="Newsletter" style={{ background: "#8b5cf6", color: "#fff" }} />
            <span style={{ color: "#6b7280", fontSize: "0.85rem", display: "flex", alignItems: "center", gap: 6 }}>
              <i className="pi pi-calendar" />{newsletter.date}
            </span>
          </div>

          <h1 style={{ fontSize: "1.75rem", fontWeight: 700, color: "#1e1b4b", marginBottom: 20, lineHeight: 1.3 }}>
            {newsletter.title}
          </h1>

          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            {newsletter.thumbnail && (
              <img src={newsletter.thumbnail} alt={newsletter.title} style={{ width: "100%", maxWidth: 350, height: "auto", objectFit: "cover", borderRadius: 12, boxShadow: "0 8px 24px rgba(0,0,0,0.08)" }} />
            )}
            <div className="detail-text">
              <p style={{ margin: 0 }}>{newsletter.content}</p>
            </div>
          </div>

          {newsletter.pdf && (
            <div style={{ marginTop: 32 }}>
              <h2 className="pp-section-title" style={{ fontSize: "1.15rem", marginBottom: 20, display: "block", textAlign: "center" }}>Lampiran</h2>
              <div className="pp-attachment">
                <div style={{ display: "flex", alignItems: "center", gap: 16, flex: 1, minWidth: 0 }}>
                  <i className="pi pi-file-pdf" style={{ fontSize: "2rem", color: "#ef4444" }} />
                  <div style={{ minWidth: 0 }}>
                    <p style={{ fontWeight: 600, margin: 0, fontSize: "0.9rem" }}>{newsletter.title}</p>
                    <p style={{ fontSize: "0.78rem", color: "#9ca3af", margin: 0 }}>{newsletter.date}</p>
                  </div>
                </div>
                <Button label="Unduh" icon="pi pi-download" className="p-button-sm" onClick={() => window.open(newsletter.pdf, "_blank")} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NewsletterDetail;