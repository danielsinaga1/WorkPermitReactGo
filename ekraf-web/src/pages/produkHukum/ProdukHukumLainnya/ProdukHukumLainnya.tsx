import React from "react";
import { PageHeroBanner } from "../../../components/shared/PageHeroBanner";
import { LawProdukTable } from "../../../components/produkcomponents/LawProdukTable";
import phldata from "./produkHukumLainnya.json";
import "../../profil-ppid.css";
import "../../berita-publikasi.css";

const ProdukHukumLainnya: React.FC = () => {
  const handleDownload = (id: string) => {
    const row = (phldata as Array<{ id: number; fileUrl?: string }>).find((r) => String(r.id) === id);
    if (row?.fileUrl) window.open(row.fileUrl, "_blank");
  };

  return (
    <div className="pp-page-content" style={{ minHeight: "100vh", background: "#f8fafc" }}>
      <PageHeroBanner
        title="Produk Hukum Lainnya"
        subtitle="Informasi Produk Hukum Lainnya Dinas DISPOPAR Bontang"
        icon="pi pi-file"
        tag="PRODUK HUKUM"
        breadcrumbItems={[{ label: "Beranda", url: "/" }, { label: "Produk Hukum" }, { label: "Produk Hukum Lainnya" }]}
      />
      <div className="bp-content-section">
        <LawProdukTable data={phldata as any} onDownload={handleDownload} />
      </div>
    </div>
  );
};

export default ProdukHukumLainnya;