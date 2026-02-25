import { Search } from "lucide-react";
import React from "react";

const PotensiEkonomi: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Berita */}
      <section className="w-full bg-gradient-to-br from-[#004E7E] to-[#008DE4] pt-10 pb-6 shadow-sm">
        <div className="max-w-[1280px] mx-auto flex flex-col items-center gap-3 px-4">
          {/* Judul */}
          <h1 className="text-3xl font-bold text-white">POTENSI EKONOMI KREATIF BONTANG</h1>
          {/* Subjudul */}
          <p className="text-[15px] text-white text-center">
            Data Ini Diolah Berdasarkan Data Potensi Desa BPS
          </p>
          {/* Search bar */}
          <div className="w-full max-w-[600px] relative">
            <input
              type="text"
              placeholder="Cari berita..."
              className="w-full h-10 pl-10 pr-4 text-sm text-gray-700 bg-white border border-gray-300 rounded-full shadow-sm outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
            />
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>
        </div>
      </section>
    </div>
  );
};

export default PotensiEkonomi;
