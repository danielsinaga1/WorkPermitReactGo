import { ArrowLeft } from "lucide-react";
import React, { useEffect, useState } from "react";
import { CardStatistik } from "../../../components/cardcomponents/CardStatistik";
import dataset from "./potensiEkonomi.json";

type Province = {
  kode_provinsi: string | number;
  nama_provinsi: string;
  persentase_bts: number;
};

type StatProvince = {
  code: string | number;
  name: string;
  percentBTS: number;
};

const PotensiEkonomiDetail: React.FC = () => {
  const [data, setData] = useState<StatProvince[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const mapped = (dataset as Province[]).map((item) => ({
      code: item.kode_provinsi,
      name: item.nama_provinsi,
      percentBTS: item.persentase_bts,
    }));
    setData(mapped);
    setLoading(false);
  }, []);

  return (
    <div className="w-full bg-white">
      {/* Header Back + Breadcrumb */}
      <div className="max-w-[1240px] mx-auto flex flex-col md:flex-row justify-between items-start md:items-center px-4 md:px-6 py-6 gap-4 border-b">
        <button className="flex items-center gap-2 text-gray-700 hover:text-black transition">
          <ArrowLeft size={20} strokeWidth={2} />
          <span className="text-sm sm:text-base">Back</span>
        </button>

        <div className="flex flex-wrap items-center text-sm sm:text-base text-gray-700">
          <span>Pengumuman</span>
          <span className="mx-2">/</span>
          <span className="truncate max-w-[200px] sm:max-w-[300px] font-medium"></span>
          <span className="mx-2">/</span>
          <span className="font-semibold text-black">Detail</span>
        </div>
      </div>

      {/* Konten Detail */}
      <div className="max-w-[1240px] mx-auto px-4 md:px-6 py-6">
        {loading ? (
          <p className="text-gray-500">Loading data...</p>
        ) : (
          <CardStatistik
            provinces={data}
            nationalCoverage={91.8}
            totalVillages={83821}
            updatedAt="Mei 2025"
            note="Data simulasi (contoh), bukan data resmi BPS"
            yearOptions={[2022, 2023, 2024, 2025]}
            initialYear={2025}
            onYearChange={(y) => console.log("fetch data for:", y)}
          />
        )}
      </div>
    </div>
  );
};

export default PotensiEkonomiDetail;
