import React from "react";
import { PageHeroBanner } from "../../../components/shared/PageHeroBanner";
import { LawMentriTable } from "../../../components/produkcomponents/LawMentriTable";
import permendata from "./peraturanMen.json";
import "../../profil-ppid.css";
import "../../berita-publikasi.css";

const PeraturanMentri: React.FC = () => {
  const handleDownload = (id: string) => {
    const row = (permendata as Array<{ id: number; fileUrl?: string }>).find((r) => String(r.id) === id);
    if (row?.fileUrl) window.open(row.fileUrl, "_blank");
  };

  return (
    <div className="pp-page-content" style={{ minHeight: "100vh", background: "#f8fafc" }}>
      <PageHeroBanner
        title="Peraturan Mentri"
        subtitle="Informasi Peraturan Mentri Dinas DISPOPAR Bontang"
        icon="pi pi-bookmark"
        tag="PRODUK HUKUM"
        breadcrumbItems={[{ label: "Beranda", url: "/" }, { label: "Produk Hukum" }, { label: "Peraturan Mentri" }]}
      />
      <div className="bp-content-section">
        <LawMentriTable data={permendata as any} onDownload={handleDownload} />
      </div>
    </div>
  );
};

export default PeraturanMentri;