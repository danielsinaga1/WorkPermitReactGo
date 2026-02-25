import React from "react";

export interface ProvinceStat {
  code: string | number;
  name: string;
  percentBTS: number;
}

export interface CardStatistikProps {
  provinces: ProvinceStat[];
  nationalCoverage: number;
  totalVillages: number | string;
  updatedAt: string;
  note?: string;
  yearOptions: number[];
  initialYear: number;
  onYearChange: (year: number) => void;
}

export const CardStatistik: React.FC<CardStatistikProps> = ({
  provinces,
  nationalCoverage,
  totalVillages,
  updatedAt,
  note,
  yearOptions,
  initialYear,
  onYearChange,
}) => {
  return (
    <div className="w-full p-6 bg-white shadow-md rounded-2xl">
      <div className="flex flex-col mb-6 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-xl font-semibold text-gray-800">
          Persentase Keberadaan BTS per Desa/Kelurahan
        </h2>
        <select
          defaultValue={initialYear}
          onChange={(e) => onYearChange(Number(e.target.value))}
          className="px-3 py-1 text-sm border rounded-lg"
        >
          {yearOptions.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
      </div>
      <div className="grid grid-cols-1 gap-4 mb-6 sm:grid-cols-3">
        <div className="p-4 text-center bg-blue-50 rounded-xl">
          <p className="text-sm text-gray-600">Cakupan Nasional</p>
          <p className="text-lg font-bold text-blue-600">{nationalCoverage}%</p>
        </div>
        <div className="p-4 text-center bg-green-50 rounded-xl">
          <p className="text-sm text-gray-600">Total Desa/Kelurahan</p>
          <p className="text-lg font-bold text-green-600">{totalVillages}</p>
        </div>
        <div className="p-4 text-center bg-gray-50 rounded-xl">
          <p className="text-sm text-gray-600">Update Terakhir</p>
          <p className="text-lg font-bold text-gray-800">{updatedAt}</p>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm border">
          <thead className="text-gray-700 bg-gray-100">
            <tr>
              <th className="px-3 py-2 border">Kode</th>
              <th className="px-3 py-2 border">Provinsi</th>
              <th className="px-3 py-2 border">% BTS</th>
            </tr>
          </thead>
          <tbody>
            {provinces.map((prov) => (
              <tr key={prov.code} className="hover:bg-gray-50">
                <td className="px-3 py-2 text-center border">{prov.code}</td>
                <td className="px-3 py-2 border">{prov.name}</td>
                <td className="px-3 py-2 text-center border">{prov.percentBTS}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {note && <p className="mt-4 text-xs text-gray-500">{note}</p>}
    </div>
  );
};

export default CardStatistik;
