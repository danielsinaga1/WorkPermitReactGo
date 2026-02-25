import React from "react";
import { PageHeroBanner } from "../../../components/shared/PageHeroBanner";
import data from "./RancanganProduk.json";
import { LawRancanganTable } from "../../../components/produkcomponents/LawRancanganTable";
import "../../profil-ppid.css";
import "../../berita-publikasi.css";

const RancanganProdukHukum: React.FC = () => {
  const handleDownload = (id: string) => {
    const row = (data as Array<{ id: number; fileUrl?: string }>).find((r) => String(r.id) === id);
    if (row?.fileUrl) window.open(row.fileUrl, "_blank");
  };

  return (
    <div className="pp-page-content" style={{ minHeight: "100vh", background: "#f8fafc" }}>
      <PageHeroBanner
        title="Rancangan Produk Hukum"
        subtitle="Informasi Rancangan Produk Hukum"
        icon="pi pi-file-edit"
        tag="PRODUK HUKUM"
        breadcrumbItems={[{ label: "Beranda", url: "/" }, { label: "Produk Hukum" }, { label: "Rancangan Produk Hukum" }]}
      />
      <div className="bp-content-section">
        <LawRancanganTable data={data as any} onDownload={handleDownload} />
      </div>
    </div>
  );
};

export default RancanganProdukHukum;