import React from "react";
import { Link } from "react-router-dom";

export interface CardAgendaKegiatanPimpinanProps {
  id: string | number;
  title: string;
  content: string;
  date: string;
  image: string;
}

export const CardAgendaKegiatanPimpinan: React.FC<CardAgendaKegiatanPimpinanProps> = ({ id, title, content, date, image }) => {
  return (
    <div className="w-full h-auto max-w-sm p-6 bg-white rounded-xl shadow-md border border-gray-200 flex flex-col gap-4 hover:shadow-lg transition overflow-hidden">
      <div className="h-48 w-full bg-gray-200 rounded-xl overflow-hidden">
        <img src={image} alt={title} className="w-full h-full object-cover" />
      </div>
      <div className="flex flex-col gap-3">
        <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">{title}</h3>
        <p className="text-sm text-gray-600 line-clamp-3">{content}</p>
        <p className="text-sm text-gray-500">{date}</p>
      </div>
      <Link to={`/profil/agenda-kegiatan-pimpinan/${id}`} className="w-fit px-5 py-2 bg-gray-800 text-white text-xs rounded-lg hover:bg-gray-700 transition">
        Baca Selengkapnya
      </Link>
    </div>
  );
};

export default CardAgendaKegiatanPimpinan;
