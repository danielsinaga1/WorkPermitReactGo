export const TabelSasaranIndikator = () => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border border-gray-300 text-sm text-left">
        <thead className="bg-gray-100">
          <tr>
            <th className="border border-gray-300 px-4 py-2 w-1/3">Sasaran</th>
            <th className="border border-gray-300 px-4 py-2">Indikator</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td rowSpan={3} className="border border-gray-300 px-4 py-2 align-top font-medium">Birokrasi yang bersih dan akuntabel</td>
            <td className="border border-gray-300 px-4 py-2">Persentase kementerian/lembaga/pemerintah daerah dengan <span className="font-semibold">Indeks Perilaku Anti Korupsi</span> minimal <span className="font-semibold">Baik</span></td>
          </tr>
          <tr>
            <td className="border border-gray-300 px-4 py-2">Persentase kementerian/lembaga/pemerintah daerah dengan predikat <span className="font-semibold">SAKIP</span> minimal <span className="font-semibold">B</span></td>
          </tr>
          <tr>
            <td className="border border-gray-300 px-4 py-2">Persentase kementerian/lembaga/pemerintah daerah dengan <span className="font-semibold">Opini BPK</span> minimal <span className="font-semibold">WTP</span></td>
          </tr>
          <tr>
            <td rowSpan={3} className="border border-gray-300 px-4 py-2 align-top font-medium">Birokrasi yang kapabel</td>
            <td className="border border-gray-300 px-4 py-2">Persentase kementerian/lembaga/pemerintah daerah dengan <span className="font-semibold">Indeks Kelembagaan</span> minimal <span className="font-semibold">Baik</span></td>
          </tr>
          <tr>
            <td className="border border-gray-300 px-4 py-2">Persentase kementerian/lembaga/pemerintah daerah dengan predikat penilaian <span className="font-semibold">SPBE</span> minimal <span className="font-semibold">Baik</span> (indeks SPBE &gt; 2,6)</td>
          </tr>
          <tr>
            <td className="border border-gray-300 px-4 py-2">Nilai <span className="font-semibold">Indeks Profesionalitas ASN</span> 100</td>
          </tr>
          <tr>
            <td className="border border-gray-300 px-4 py-2 font-medium">Pelayanan Publik yang Prima</td>
            <td className="border border-gray-300 px-4 py-2">Persentase kementerian/lembaga/pemerintah daerah dengan <span className="font-semibold">Indeks Pelayanan Publik</span> yang <span className="font-semibold">Baik</span></td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};
