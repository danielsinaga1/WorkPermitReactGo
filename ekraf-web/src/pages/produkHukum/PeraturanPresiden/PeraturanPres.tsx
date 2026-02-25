import React from "react";
import { PageHeroBanner } from "../../../components/shared/PageHeroBanner";
import uupres from "./uupres.json";
import { LawPresTable } from "../../../components/produkcomponents/LawPresTable";
import "../../profil-ppid.css";
import "../../berita-publikasi.css";

const PeraturanPres: React.FC = () => {
  const handleDownload = (id: string) => {
    const row = (uupres as Array<{ id: number; fileUrl?: string }>).find((r) => String(r.id) === id);
    if (row?.fileUrl) window.open(row.fileUrl, "_blank");
  };

  return (
    <div className="pp-page-content" style={{ minHeight: "100vh", background: "#f8fafc" }}>
      <PageHeroBanner
        title="Peraturan Presiden"
        subtitle="Informasi Peraturan Presiden Dinas DISPOPAR Bontang"
        icon="pi pi-bookmark"
        tag="PRODUK HUKUM"
        breadcrumbItems={[{ label: "Beranda", url: "/" }, { label: "Produk Hukum" }, { label: "Peraturan Presiden" }]}
      />
      <div className="bp-content-section">
        <LawPresTable data={uupres as any} onDownload={handleDownload} />
      </div>
    </div>
  );
};

export default PeraturanPres;