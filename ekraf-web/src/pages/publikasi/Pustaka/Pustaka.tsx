import React, { useState } from "react";
import { PageHeroBanner } from "../../../components/shared/PageHeroBanner";
import { InputText } from "primereact/inputtext";
import { Paginator } from "primereact/paginator";
import { CardPustaka } from "../../../components/publikasicomponents/pustakacomponents/CardPustaka";
import pustakaData from "./pustaka.json";
import "../../profil-ppid.css";
import "../../berita-publikasi.css";

type PustakaItem = {
  id: number;
  title: string;
  content: string;
  date: string;
  thumbnail: string;
};

const ITEMS_PER_PAGE = 6;

const Pustaka: React.FC = () => {
  const [first, setFirst] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");

  const allData = pustakaData as unknown as PustakaItem[];
  const filtered = allData.filter((item) =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const currentData = filtered.slice(first, first + ITEMS_PER_PAGE);

  return (
    <div className="pp-page-content" style={{ minHeight: "100vh", background: "#f8fafc" }}>
      <PageHeroBanner
        title="Pustaka"
        subtitle="Seputar Informasi Pustaka Dinas DISPOPAR Bontang"
        icon="pi pi-book"
        tag="PUBLIKASI"
        breadcrumbItems={[{ label: "Beranda", url: "/" }, { label: "Publikasi" }, { label: "Pustaka" }]}
      />

      <div className="bp-content-section">
        <div className="bp-search-wrapper">
          <span className="p-input-icon-left" style={{ width: "100%", maxWidth: 500 }}>
            <i className="pi pi-search" />
            <InputText
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setFirst(0); }}
              placeholder="Cari pustaka..."
              style={{ width: "100%", borderRadius: 25, paddingLeft: 42 }}
            />
          </span>
        </div>

        {currentData.length > 0 ? (
          <div className="bp-grid-3">
            {currentData.map((item) => (
              <CardPustaka
                key={item.id}
                id={item.id}
                title={item.title}
                content={item.content}
                date={item.date}
                image={item.thumbnail}
              />
            ))}
          </div>
        ) : (
          <div className="bp-empty-state">
            <div className="empty-icon">
              <i className="pi pi-inbox" style={{ fontSize: "2rem", color: "#6366f1" }} />
            </div>
            <p style={{ color: "#6b7280", fontSize: "0.95rem" }}>Belum ada pustaka tersedia.</p>
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

export default Pustaka;