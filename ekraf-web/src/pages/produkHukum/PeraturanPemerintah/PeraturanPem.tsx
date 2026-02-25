import React from "react";
import { PageHeroBanner } from "../../../components/shared/PageHeroBanner";
import uupem from "./uupem.json";
import { LawPemTable } from "../../../components/produkcomponents/LawPemTable";
import "../../profil-ppid.css";
import "../../berita-publikasi.css";

const PeraturanPem: React.FC = () => {
  const handleDownload = (id: string) => {
    const row = (uupem as Array<{ id: number; fileUrl?: string }>).find((r) => String(r.id) === id);
    if (row?.fileUrl) window.open(row.fileUrl, "_blank");
  };

  return (
    <div className="pp-page-content" style={{ minHeight: "100vh", background: "#f8fafc" }}>
      <PageHeroBanner
        title="Peraturan Pemerintah"
        subtitle="Informasi Peraturan Pemerintah Dinas DISPOPAR Bontang"
        icon="pi pi-bookmark"
        tag="PRODUK HUKUM"
        breadcrumbItems={[{ label: "Beranda", url: "/" }, { label: "Produk Hukum" }, { label: "Peraturan Pemerintah" }]}
      />
      <div className="bp-content-section">
        <LawPemTable data={uupem as any} onDownload={handleDownload} />
      </div>
    </div>
  );
};

export default PeraturanPem;