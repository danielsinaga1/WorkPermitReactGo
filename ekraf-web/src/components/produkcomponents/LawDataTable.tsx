import { useMemo, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { Tag } from "primereact/tag";
import "../../pages/berita-publikasi.css";

type LawRow = { id: number | string; title: string; author?: string; date: string; hits?: number; fileUrl: string };
type Props = { data?: LawRow[]; onDownload?: (id: string) => void };

const sortOptions = [
  { label: "Terbaru", value: "newest", icon: "pi pi-calendar" },
  { label: "Terlama", value: "oldest", icon: "pi pi-history" },
  { label: "Terpopuler", value: "hits", icon: "pi pi-chart-bar" },
];

export const LawDataTable = ({ data = [], onDownload = (id) => console.log("download", id) }: Props) => {
  const [globalFilter, setGlobalFilter] = useState("");
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "hits">("newest");

  const sortedData = useMemo(() => {
    const sorted = [...data];
    if (sortBy === "newest") sorted.sort((a, b) => +new Date(b.date) - +new Date(a.date));
    else if (sortBy === "oldest") sorted.sort((a, b) => +new Date(a.date) - +new Date(b.date));
    else if (sortBy === "hits") sorted.sort((a, b) => (b.hits ?? 0) - (a.hits ?? 0));
    return sorted;
  }, [data, sortBy]);

  const filteredData = useMemo(() => {
    if (!globalFilter) return sortedData;
    const q = globalFilter.toLowerCase();
    return sortedData.filter(
      (row) =>
        row.title.toLowerCase().includes(q) ||
        row.author?.toLowerCase().includes(q) ||
        new Date(row.date).toLocaleDateString().includes(q)
    );
  }, [sortedData, globalFilter]);

  const titleTemplate = (rowData: LawRow) => (
    <div style={{ fontWeight: 600, color: "#1e1b4b", lineHeight: 1.4 }}>
      {rowData.title}
    </div>
  );

  const dateTemplate = (rowData: LawRow) => (
    <span style={{ color: "#6b7280", fontSize: "0.85rem" }}>
      {new Date(rowData.date).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
    </span>
  );

  const hitsTemplate = (rowData: LawRow) => (
    <Tag
      value={String(rowData.hits ?? 0)}
      icon="pi pi-eye"
      severity="info"
      style={{ fontSize: "0.75rem" }}
    />
  );

  const actionTemplate = (rowData: LawRow) => (
    <Button
      label="Unduh"
      icon="pi pi-download"
      className="p-button-sm"
      style={{ fontSize: "0.8rem" }}
      onClick={() => {
        onDownload(String(rowData.id));
        if (rowData.fileUrl) window.open(rowData.fileUrl, "_blank");
      }}
    />
  );

  const header = (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 12, alignItems: "center", justifyContent: "space-between" }}>
      <span className="p-input-icon-left" style={{ flex: "1 1 300px", maxWidth: 400 }}>
        <i className="pi pi-search" />
        <InputText
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          placeholder="Cari judul, penulis, atau tanggal..."
          style={{ width: "100%", borderRadius: 10, paddingLeft: 38 }}
        />
      </span>
      <Dropdown
        value={sortBy}
        options={sortOptions}
        onChange={(e) => setSortBy(e.value)}
        style={{ minWidth: 180, borderRadius: 10 }}
      />
    </div>
  );

  return (
    <div className="bp-law-table-wrapper">
      <DataTable
        value={filteredData}
        paginator
        rows={8}
        header={header}
        emptyMessage="Tidak ada data ditemukan."
        stripedRows
        responsiveLayout="scroll"
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport"
        currentPageReportTemplate="Menampilkan {first} - {last} dari {totalRecords}"
        style={{ borderRadius: 12, overflow: "hidden" }}
      >
        <Column field="title" header="Judul" body={titleTemplate} style={{ minWidth: "300px" }} />
        <Column field="author" header="Penulis" style={{ minWidth: "150px" }} className="hidden sm:table-cell" />
        <Column field="date" header="Tanggal" body={dateTemplate} style={{ minWidth: "130px" }} sortable />
        <Column field="hits" header="Hit" body={hitsTemplate} style={{ minWidth: "80px", textAlign: "center" }} className="hidden md:table-cell" />
        <Column header="Aksi" body={actionTemplate} style={{ minWidth: "120px", textAlign: "center" }} />
      </DataTable>
    </div>
  );
};