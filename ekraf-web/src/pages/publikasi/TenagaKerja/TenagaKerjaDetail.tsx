import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { PageHeroBanner } from "../../../components/shared/PageHeroBanner";
import { Button } from "primereact/button";
import { Tag } from "primereact/tag";
import tenagakerjadata from "./TenangaKerja.json";
import "../../profil-ppid.css";
import "../../berita-publikasi.css";

type Attachment = { name: string; url: string; type: string };
type TenagaKerjaItem = {
  id: number;
  title: string;
  content: string;
  date: string;
  thumbnail?: string;
  attachments?: Attachment[];
};

const TenagaKerjaDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [tenagaKerja, setTenagaKerja] = useState<TenagaKerjaItem | null>(null);

  useEffect(() => {
    const found = (tenagakerjadata as unknown as TenagaKerjaItem[]).find((item) => item.id === Number(id));
    setTenagaKerja(found || null);
  }, [id]);

  if (!tenagaKerja) {
    return (
      <div className="pp-page-content">
        <PageHeroBanner title="Tenaga Kerja" subtitle="Detail Tenaga Kerja" icon="pi pi-users" />
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
        title="Detail Tenaga Kerja"
        subtitle={tenagaKerja.title}
        icon="pi pi-users"
        tag="TENAGA KERJA"
        breadcrumbItems={[{ label: "Beranda", url: "/" }, { label: "Publikasi" }, { label: "Tenaga Kerja", url: "/publisher/tenaga-kerja" }, { label: "Detail" }]}
      />

      <div className="bp-detail-article">
        <Button label="Kembali" icon="pi pi-arrow-left" className="p-button-text" onClick={() => navigate(-1)} style={{ marginBottom: 20, color: "#4338ca", fontWeight: 600 }} />

        <div className="bp-detail-content">
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16, flexWrap: "wrap" }}>
            <Tag value="Tenaga Kerja" style={{ background: "#f97316", color: "#fff" }} />
            <span style={{ color: "#6b7280", fontSize: "0.85rem", display: "flex", alignItems: "center", gap: 6 }}>
              <i className="pi pi-calendar" />{tenagaKerja.date}
            </span>
          </div>

          <h1 style={{ fontSize: "1.75rem", fontWeight: 700, color: "#1e1b4b", marginBottom: 20, lineHeight: 1.3 }}>
            {tenagaKerja.title}
          </h1>

          {tenagaKerja.thumbnail && (
            <img src={tenagaKerja.thumbnail} alt="Thumbnail" className="detail-hero-img" />
          )}

          <div className="pp-divider" />

          <div className="detail-text">
            <p><strong>{tenagaKerja.date}</strong> â€“ {tenagaKerja.content}</p>
          </div>

          {tenagaKerja.attachments && tenagaKerja.attachments.length > 0 && (
            <div style={{ marginTop: 32 }}>
              <h2 className="pp-section-title" style={{ fontSize: "1.15rem", marginBottom: 20, display: "block", textAlign: "center" }}>Lampiran</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {tenagaKerja.attachments.map((file, index) => (
                  <div key={index} className="pp-attachment">
                    <div style={{ display: "flex", alignItems: "center", gap: 16, flex: 1, minWidth: 0 }}>
                      <i className={`pi ${file.type === "pdf" ? "pi-file-pdf" : "pi-file"}`} style={{ fontSize: "2rem", color: file.type === "pdf" ? "#ef4444" : "#3b82f6" }} />
                      <div style={{ minWidth: 0 }}>
                        <p style={{ fontWeight: 600, margin: 0, fontSize: "0.9rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{file.name}</p>
                        <p style={{ fontSize: "0.78rem", color: "#9ca3af", margin: 0 }}>{tenagaKerja.date}</p>
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

export default TenagaKerjaDetail;