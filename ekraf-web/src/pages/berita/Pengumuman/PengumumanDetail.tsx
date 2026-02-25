import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { PageHeroBanner } from "../../../components/shared/PageHeroBanner";
import { Button } from "primereact/button";
import { Tag } from "primereact/tag";
import announcementData from "./pengumuman.json";
import "../../profil-ppid.css";
import "../../berita-publikasi.css";

type Attachment = { name: string; url: string; type: string };
type Announcement = {
  id: number;
  title: string;
  date: string;
  content: string;
  thumbnail?: string;
  attachments?: Attachment[];
};

const PengumumanDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [announcement, setAnnouncement] = useState<Announcement | null>(null);

  useEffect(() => {
    const found = (announcementData as Announcement[]).find((item) => item.id === Number(id));
    setAnnouncement(found || null);
  }, [id]);

  if (!announcement) {
    return (
      <div className="pp-page-content">
        <PageHeroBanner title="Pengumuman" subtitle="Detail Pengumuman" icon="pi pi-bell" />
        <div className="bp-empty-state">
          <div className="empty-icon"><i className="pi pi-exclamation-circle" style={{ fontSize: "2rem", color: "#6366f1" }} /></div>
          <p style={{ color: "#6b7280" }}>Pengumuman tidak ditemukan</p>
          <Button label="Kembali" icon="pi pi-arrow-left" className="p-button-outlined" onClick={() => navigate(-1)} />
        </div>
      </div>
    );
  }

  return (
    <div className="pp-page-content" style={{ minHeight: "100vh", background: "#f8fafc" }}>
      <PageHeroBanner
        title="Detail Pengumuman"
        subtitle={announcement.title}
        icon="pi pi-bell"
        tag="PENGUMUMAN"
        breadcrumbItems={[{ label: "Beranda", url: "/" }, { label: "Berita" }, { label: "Pengumuman", url: "/announcement" }, { label: "Detail" }]}
      />

      <div className="bp-detail-article">
        <Button label="Kembali" icon="pi pi-arrow-left" className="p-button-text" onClick={() => navigate(-1)} style={{ marginBottom: 20, color: "#4338ca", fontWeight: 600 }} />

        <div className="bp-detail-content">
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16, flexWrap: "wrap" }}>
            <Tag value="Pengumuman" style={{ background: "#f59e0b", color: "#fff" }} />
            <span style={{ color: "#6b7280", fontSize: "0.85rem", display: "flex", alignItems: "center", gap: 6 }}>
              <i className="pi pi-calendar" />{announcement.date}
            </span>
          </div>

          <h1 style={{ fontSize: "1.75rem", fontWeight: 700, color: "#1e1b4b", marginBottom: 20, lineHeight: 1.3 }}>
            {announcement.title}
          </h1>

          {announcement.thumbnail && (
            <img src={announcement.thumbnail} alt="Thumbnail" className="detail-hero-img" />
          )}

          <div className="pp-divider" />

          <div className="detail-text">
            <p><strong>{announcement.date}</strong> â€“ {announcement.content}</p>
          </div>

          {announcement.attachments && announcement.attachments.length > 0 && (
            <div style={{ marginTop: 32 }}>
              <h2 className="pp-section-title" style={{ fontSize: "1.15rem", marginBottom: 20, display: "block", textAlign: "center" }}>Lampiran</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {announcement.attachments.map((file, index) => (
                  <div key={index} className="pp-attachment">
                    <div style={{ display: "flex", alignItems: "center", gap: 16, flex: 1, minWidth: 0 }}>
                      <i className={`pi ${file.type === "pdf" ? "pi-file-pdf" : "pi-file"}`} style={{ fontSize: "2rem", color: file.type === "pdf" ? "#ef4444" : "#3b82f6" }} />
                      <div style={{ minWidth: 0 }}>
                        <p style={{ fontWeight: 600, margin: 0, fontSize: "0.9rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{file.name}</p>
                        <p style={{ fontSize: "0.78rem", color: "#9ca3af", margin: 0 }}>{announcement.date}</p>
                      </div>
                    </div>
                    <Button label="Unduh" icon="pi pi-download" className="p-button-sm" style={{ flexShrink: 0 }} onClick={() => window.open(file.url, "_blank")} />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PengumumanDetail;