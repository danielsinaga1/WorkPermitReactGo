import React, { useState } from "react";
import { PageHeroBanner } from "../../../components/shared/PageHeroBanner";
import { InputText } from "primereact/inputtext";
import { Paginator } from "primereact/paginator";
import { CardRagamEkraf } from "../../../components/beritacomponents/ragamekrafcomponents/CardRagamEkraf";
import ragamEkrafData from "./ragamEkraf.json";
import "../../profil-ppid.css";
import "../../berita-publikasi.css";

type RagamItem = {
  id: number;
  title: string;
  content: string;
  date: string;
  thumbnail?: string;
};

const ITEMS_PER_PAGE = 6;

const RagamEkraf: React.FC = () => {
  const [first, setFirst] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");

  const allData = ragamEkrafData as RagamItem[];
  const filtered = allData.filter((item) =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const currentData = filtered.slice(first, first + ITEMS_PER_PAGE);

  return (
    <div className="pp-page-content" style={{ minHeight: "100vh", background: "#f8fafc" }}>
      <PageHeroBanner
        title="Ragam Ekraf Bontang"
        subtitle="Informasi Ragam Ekraf Kemenekraf / Bekraf Republik Indonesia"
        icon="pi pi-palette"
        tag="RAGAM EKRAF"
        breadcrumbItems={[{ label: "Beranda", url: "/" }, { label: "Berita" }, { label: "Ragam Ekraf" }]}
      />

      <div className="bp-content-section">
        <div className="bp-search-wrapper">
          <span className="p-input-icon-left" style={{ width: "100%", maxWidth: 500 }}>
            <i className="pi pi-search" />
            <InputText
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setFirst(0); }}
              placeholder="Cari ragam ekraf..."
              style={{ width: "100%", borderRadius: 25, paddingLeft: 42 }}
            />
          </span>
        </div>

        {currentData.length > 0 ? (
          <div className="bp-grid-2">
            {currentData.map((item) => (
              <CardRagamEkraf
                key={item.id}
                id={item.id}
                thumbnail={item.thumbnail || ""}
                title={item.title}
                content={item.content}
                date={item.date}
              />
            ))}
          </div>
        ) : (
          <div className="bp-empty-state">
            <div className="empty-icon">
              <i className="pi pi-inbox" style={{ fontSize: "2rem", color: "#6366f1" }} />
            </div>
            <p style={{ color: "#6b7280", fontSize: "0.95rem" }}>Belum ada data tersedia.</p>
          </div>
        )}

        {filtered.length > ITEMS_PER_PAGE && (
          <div className="bp-paginator" style={{ marginTop: 32, display: "flex", justifyContent: "center" }}>
            <Paginator
              first={first}
              rows={ITEMS_PER_PAGE}
              totalRecords={filtered.length}
              onPageChange={(e) => { setFirst(e.first); window.scrollTo({ top: 0, behavior: "smooth" }); }}
              template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default RagamEkraf;