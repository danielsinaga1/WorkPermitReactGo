import React from "react";
import { PageHeroBanner } from "../../../components/shared/PageHeroBanner";
import data from "./naskahKerjaSama.json";
import { LawNaskahTable } from "../../../components/produkcomponents/LawNaskahTable";
import "../../profil-ppid.css";
import "../../berita-publikasi.css";

const NaskahKerjaSama: React.FC = () => {
  const handleDownload = (id: string) => {
    const row = (data as Array<{ id: number; fileUrl?: string }>).find((r) => String(r.id) === id);
    if (row?.fileUrl) window.open(row.fileUrl, "_blank");
  };

  return (
    <div className="pp-page-content" style={{ minHeight: "100vh", background: "#f8fafc" }}>
      <PageHeroBanner
        title="Naskah Kerja Sama"
        subtitle="Informasi Naskah Kerja Sama"
        icon="pi pi-file-edit"
        tag="PRODUK HUKUM"
        breadcrumbItems={[{ label: "Beranda", url: "/" }, { label: "Produk Hukum" }, { label: "Naskah Kerja Sama" }]}
      />
      <div className="bp-content-section">
        <LawNaskahTable data={data as any} onDownload={handleDownload} />
      </div>
    </div>
  );
};

export default NaskahKerjaSama;