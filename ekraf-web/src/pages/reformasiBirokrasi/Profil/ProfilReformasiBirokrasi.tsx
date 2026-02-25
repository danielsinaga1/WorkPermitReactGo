import React from "react";
import { TabelSasaranIndikator } from "../../../components/reformasicomponents/TabelSasaranIndikator";
import sasaranimg from "../../../assets/sasaran.png";
import roadmapimg from "../../../assets/roadmap.png";
import perioderoadmapimg from "../../../assets/perioderoadmap.png";
import nasdaninstaimg from "../../../assets/nasdaninsta.png";

const ProfilReformasiBirokrasi: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      <section className="w-full bg-gradient-to-br from-[#004E7E] to-[#008DE4] py-12 shadow-sm">
        <div className="max-w-[1280px] mx-auto px-6 text-center text-white">
          <h1 className="text-3xl font-bold mb-2">PROFIL REFORMASI BIROKRASI</h1>
          <p className="text-[15px]">Informasi Pengumuman Profil Reformasi Birokrasi</p>
        </div>
      </section>

      <section className="max-w-[1200px] mx-auto px-6 py-12 space-y-16 text-gray-800">
        <div className="bg-gray-50 p-6 rounded-2xl shadow-md hover:shadow-lg transition">
          <h2 className="text-xl font-semibold mb-4 text-[#004E7E]">Pendahuluan</h2>
          <p className="leading-relaxed text-justify">
            Reformasi birokrasi merupakan kebutuhan penting dalam memastikan tata kelola
            pemerintahan yang baik. Tata kelola yang berkualitas sangat memengaruhi keberhasilan
            pembangunan nasional, sehingga perbaikan birokrasi adalah prasyarat utama dalam
            mendorong percepatan pembangunan.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-[#004E7E]">
              Grand Design Reformasi Birokrasi
            </h2>
            <p className="leading-relaxed text-justify">
              Pemerintah menetapkan Peraturan Presiden No. 81 Tahun 2020 tentang Grand Design
              Reformasi Birokrasi 2010–2025. Dokumen ini menjadi pedoman bersama untuk memastikan
              efektivitas pelaksanaan reformasi birokrasi nasional.
            </p>
          </div>
          <img
            src={perioderoadmapimg}
            alt="Grand Design Reformasi Birokrasi"
            className="rounded-2xl shadow-md"
          />
        </div>

        <div className="bg-gradient-to-br from-[#f9fafb] to-[#f3f4f6] p-6 rounded-2xl shadow-sm">
          <h2 className="text-xl font-semibold mb-4 text-[#004E7E]">
            Roadmap Reformasi Birokrasi 2020–2024
          </h2>
          <p className="leading-relaxed text-justify mb-4">
            Roadmap Reformasi Birokrasi 2020–2024 menjadi langkah operasionalisasi Grand Design
            untuk menghasilkan birokrasi berkelas dunia, dengan pelayanan publik yang berkualitas,
            efektif, dan efisien.
          </p>
          <img src={roadmapimg} alt="Roadmap Reformasi" className="rounded-2xl shadow-md mx-auto" />
        </div>

        <div className="grid lg:grid-cols-2 gap-8 items-center">
          <img
            src={sasaranimg}
            alt="Sasaran Reformasi Birokrasi"
            className="rounded-2xl shadow-md"
          />
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-[#004E7E]">Sasaran Reformasi Birokrasi</h2>
            <ul className="list-disc pl-6 space-y-2 text-justify">
              <li>Birokrasi yang Bersih dan Akuntabel</li>
              <li>Birokrasi yang Kapabel</li>
              <li>Pelayanan Publik yang Prima</li>
            </ul>
            <p className="text-sm text-gray-600">
              Sasaran ini diselaraskan dengan RPJMN 2020–2024 untuk mewujudkan pemerintahan bersih
              dan responsif.
            </p>
          </div>
        </div>

        <div className="bg-white border rounded-2xl p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-4 text-[#004E7E]">Indikator Keberhasilan</h2>
          <p className="mb-6 text-justify">
            Keberhasilan reformasi birokrasi 2020–2024 diukur melalui indikator global:
          </p>
          <ul className="list-disc pl-6 space-y-2 mb-6">
            <li>Ease of Doing Business – World Bank</li>
            <li>Corruption Perceptions Index – Transparency International</li>
            <li>Government Effectiveness Index – World Bank</li>
            <li>Trust Barometer – Edelmen</li>
          </ul>
          <TabelSasaranIndikator />
        </div>

        <div className="grid lg:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="text-xl font-semibold mb-4 text-[#004E7E]">Tingkat Pelaksanaan</h2>
            <p className="text-justify mb-3">
              Pelaksanaan reformasi birokrasi dibagi ke dalam dua tingkat:
            </p>
            <p>
              <span className="font-bold">Nasional</span> – mencakup kebijakan makro, monitoring,
              dan koordinasi antar instansi.
            </p>
            <p>
              <span className="font-bold">Instansional</span> – implementasi langsung pada
              kementerian/lembaga/daerah.
            </p>
          </div>
          <img src={nasdaninstaimg} alt="Pelaksanaan Reformasi" className="rounded-2xl shadow-md" />
        </div>
      </section>
    </div>
  );
};

export default ProfilReformasiBirokrasi;
