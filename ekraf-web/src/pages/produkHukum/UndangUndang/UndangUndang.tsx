import React from "react";
import { PageHeroBanner } from "../../../components/shared/PageHeroBanner";
import { LawTable } from "../../../components/produkcomponents/LawTable";
import uuddata from "./uud.json";
import "../../profil-ppid.css";
import "../../berita-publikasi.css";

const UndangUndang: React.FC = () => {
  const handleDownload = (id: string) => {
    const row = (uuddata as Array<{ id: number; fileUrl?: string }>).find((r) => String(r.id) === id);
    if (row?.fileUrl) window.open(row.fileUrl, "_blank");
  };

  return (
    <div className="pp-page-content" style={{ minHeight: "100vh", background: "#f8fafc" }}>
      <PageHeroBanner
        title="Undang-Undang"
        subtitle="Informasi Undang-Undang Dinas DISPOPAR Bontang"
        icon="pi pi-book"
        tag="PRODUK HUKUM"
        breadcrumbItems={[{ label: "Beranda", url: "/" }, { label: "Produk Hukum" }, { label: "Undang-Undang" }]}
      />
      <div className="bp-content-section">
        <LawTable data={uuddata as any} onDownload={handleDownload} />
      </div>
    </div>
  );
};

export default UndangUndang;