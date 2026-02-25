import React, { useState } from "react";
import { PageHeroBanner } from "../../../components/shared/PageHeroBanner";
import { InputText } from "primereact/inputtext";
import { CardNewsletter } from "../../../components/publikasicomponents/newslettercomponents/CardNewsletter";
import newsletterData from "./newsletter.json";
import "../../profil-ppid.css";
import "../../berita-publikasi.css";

type NewsletterItem = {
  id: number;
  title: string;
  content: string;
  date: string;
  thumbnail?: string;
};

const Newsletter: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const allData = newsletterData as NewsletterItem[];
  const filtered = allData.filter((item) =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="pp-page-content" style={{ minHeight: "100vh", background: "#f8fafc" }}>
      <PageHeroBanner
        title="Newsletter"
        subtitle="Informasi Newsletter Dinas DISPOPAR Bontang"
        icon="pi pi-envelope"
        tag="PUBLIKASI"
        breadcrumbItems={[{ label: "Beranda", url: "/" }, { label: "Publikasi" }, { label: "Newsletter" }]}
      />

      <div className="bp-content-section">
        <div className="bp-search-wrapper">
          <span className="p-input-icon-left" style={{ width: "100%", maxWidth: 500 }}>
            <i className="pi pi-search" />
            <InputText
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari newsletter..."
              style={{ width: "100%", borderRadius: 25, paddingLeft: 42 }}
            />
          </span>
        </div>

        {filtered.length > 0 ? (
          <div className="bp-grid-3">
            {filtered.map((item) => (
              <CardNewsletter
                key={item.id}
                id={item.id}
                title={item.title}
                content={item.content}
                date={item.date}
                image={item.thumbnail || ""}
              />
            ))}
          </div>
        ) : (
          <div className="bp-empty-state">
            <div className="empty-icon">
              <i className="pi pi-inbox" style={{ fontSize: "2rem", color: "#6366f1" }} />
            </div>
            <p style={{ color: "#6b7280", fontSize: "0.95rem" }}>Belum ada newsletter tersedia.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Newsletter;