import React, { useState } from "react";
import { PageHeroBanner } from "../../../components/shared/PageHeroBanner";
import { Paginator } from "primereact/paginator";
import { CardPromosi } from "../../../components/beritacomponents/promosicomponents/CardPromosi";
import promosiData from "./promosi.json";
import "../../profil-ppid.css";
import "../../berita-publikasi.css";

const ITEMS_PER_PAGE = 6;

const Promosi: React.FC = () => {
  const [first, setFirst] = useState(0);
  const currentData = promosiData.slice(first, first + ITEMS_PER_PAGE);

  return (
    <div className="pp-page-content" style={{ minHeight: "100vh", background: "#f8fafc" }}>
      <PageHeroBanner
        title="Promosi"
        subtitle="Informasi Promosi Ekraf Bontang / Bekraf Republik Indonesia"
        icon="pi pi-star"
        tag="PROMOSI"
        breadcrumbItems={[{ label: "Beranda", url: "/" }, { label: "Berita" }, { label: "Promosi" }]}
      />

      <div className="bp-content-section">
        {currentData.length > 0 ? (
          <div className="bp-grid-3">
            {currentData.map((promo: any) => (
              <CardPromosi
                key={promo.id}
                id={promo.id}
                title={promo.title}
                content={promo.content}
                date={promo.date}
                thumbnail={promo.thumbnail}
              />
            ))}
          </div>
        ) : (
          <div className="bp-empty-state">
            <div className="empty-icon">
              <i className="pi pi-inbox" style={{ fontSize: "2rem", color: "#6366f1" }} />
            </div>
            <p style={{ color: "#6b7280", fontSize: "0.95rem" }}>Belum ada promosi tersedia.</p>
          </div>
        )}

        {promosiData.length > ITEMS_PER_PAGE && (
          <div className="bp-paginator" style={{ marginTop: 32, display: "flex", justifyContent: "center" }}>
            <Paginator
              first={first}
              rows={ITEMS_PER_PAGE}
              totalRecords={promosiData.length}
              onPageChange={(e) => { setFirst(e.first); window.scrollTo({ top: 0, behavior: "smooth" }); }}
              template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Promosi;