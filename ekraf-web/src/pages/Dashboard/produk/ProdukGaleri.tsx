import { Link } from 'react-router-dom';

const ProdukGaleri = () => {
  return (
    <>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-title-md2 font-semibold text-black dark:text-white">Galeri Produk</h2>
          <nav className="mt-2">
            <ol className="flex items-center gap-2 text-sm">
              <li><Link to="/dashboard" className="text-primary">Dashboard</Link></li>
              <li className="text-gray-400">/</li>
              <li className="text-gray-500">Galeri Produk</li>
            </ol>
          </nav>
        </div>
        <button className="inline-flex items-center gap-2 rounded-lg bg-primary py-2.5 px-5 font-medium text-white hover:bg-opacity-90">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          Upload Produk
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {/* Empty State */}
        <div className="col-span-full flex flex-col items-center justify-center py-20 rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <svg className="w-16 h-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p className="text-lg font-medium text-gray-500">Galeri masih kosong</p>
          <p className="text-sm text-gray-400 mt-1">Upload produk untuk memulai</p>
        </div>
      </div>
    </>
  );
};

export default ProdukGaleri;
