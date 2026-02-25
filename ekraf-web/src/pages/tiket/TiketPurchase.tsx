import { useState, useEffect, useCallback, useRef } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { InputNumber } from 'primereact/inputnumber';
import { Calendar } from 'primereact/calendar';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { Tag } from 'primereact/tag';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { TabView, TabPanel } from 'primereact/tabview';
import { PageHeroBanner } from '../../components/shared/PageHeroBanner';
import { destinasiWisataService, tiketWisataService } from '../../services';
import type { DestinasiWisata, TiketWisata, TiketPayload, StatusTiket } from '../../types';

const STATUS_COLOR: Record<StatusTiket, 'success' | 'warning' | 'info' | 'danger' | undefined> = {
  menunggu_bayar: 'warning',
  terbayar: 'success',
  digunakan: 'info',
  dibatalkan: 'danger',
  kadaluarsa: undefined,
};

const STATUS_LABEL: Record<StatusTiket, string> = {
  menunggu_bayar: 'Menunggu Bayar',
  terbayar: 'Terbayar',
  digunakan: 'Sudah Digunakan',
  dibatalkan: 'Dibatalkan',
  kadaluarsa: 'Kadaluarsa',
};

const TiketPurchase = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const toast = useRef<Toast>(null);
  const [activeTab, setActiveTab] = useState(0);

  // Purchase form
  const [destinations, setDestinations] = useState<DestinasiWisata[]>([]);
  const [selectedDest, setSelectedDest] = useState<number | null>(null);
  const [jumlah, setJumlah] = useState<number>(1);
  const [tanggal, setTanggal] = useState<Date | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [loadingDest, setLoadingDest] = useState(true);

  // History
  const [tickets, setTickets] = useState<TiketWisata[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  // Load ticketed destinations
  useEffect(() => {
    const load = async () => {
      setLoadingDest(true);
      try {
        const resp = await destinasiWisataService.list({ per_page: 100 });
        const ticketed = resp.data.filter(d => d.is_ticketed && d.is_active);
        setDestinations(ticketed);

        const destParam = searchParams.get('destinasi');
        if (destParam) {
          const id = parseInt(destParam);
          if (ticketed.some(d => d.id === id)) setSelectedDest(id);
        }
      } catch {
        console.error('Gagal memuat destinasi');
      } finally {
        setLoadingDest(false);
      }
    };
    load();
  }, [searchParams]);

  // Load ticket history
  const fetchHistory = useCallback(async () => {
    setLoadingHistory(true);
    try {
      const resp = await tiketWisataService.riwayat({ per_page: 50 });
      setTickets(resp.data);
    } catch {
      // User might not be logged in
      setTickets([]);
    } finally {
      setLoadingHistory(false);
    }
  }, []);

  useEffect(() => {
    if (activeTab === 1) fetchHistory();
  }, [activeTab, fetchHistory]);

  const selectedDestination = destinations.find(d => d.id === selectedDest);
  const hargaSatuan = selectedDestination?.harga_tiket ?? 0;
  const totalHarga = hargaSatuan * jumlah;

  const handlePurchase = async () => {
    if (!selectedDest || !tanggal) {
      toast.current?.show({ severity: 'warn', summary: 'Peringatan', detail: 'Lengkapi semua data pembelian' });
      return;
    }
    setSubmitting(true);
    try {
      const payload: TiketPayload = {
        destinasi_id: selectedDest,
        jumlah_tiket: jumlah,
        tanggal_kunjungan: tanggal.toISOString().split('T')[0],
      };
      await tiketWisataService.buy(payload);
      toast.current?.show({ severity: 'success', summary: 'Berhasil!', detail: 'Tiket berhasil dipesan. Silakan lakukan pembayaran.', life: 5000 });
      setJumlah(1);
      setTanggal(null);
      setActiveTab(1);
      fetchHistory();
    } catch {
      toast.current?.show({ severity: 'error', summary: 'Gagal', detail: 'Gagal memesan tiket. Pastikan Anda sudah login.' });
    } finally {
      setSubmitting(false);
    }
  };

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  return (
    <div>
      <Toast ref={toast} />
      <PageHeroBanner title="E-Ticketing Wisata" subtitle="Pesan tiket wisata Kota Bontang secara online — mudah, cepat, dan praktis" />

      <section className="bp-content-section">
        <div className="container mx-auto px-4 py-6" style={{ maxWidth: 960 }}>
          <TabView activeIndex={activeTab} onTabChange={(e) => setActiveTab(e.index)}>
            {/* ---- TAB: Beli Tiket ---- */}
            <TabPanel header="Beli Tiket" leftIcon="pi pi-ticket mr-2">
              <div className="grid mt-3">
                {/* Form Column */}
                <div className="col-12 lg:col-7">
                  <Card className="shadow-1 border-round-xl">
                    <h3 className="text-xl font-bold text-800 mt-0 mb-4">
                      <i className="pi pi-shopping-cart mr-2 text-primary" />Formulir Pembelian
                    </h3>

                    <div className="flex flex-column gap-4">
                      <div className="flex flex-column gap-2">
                        <label className="text-sm font-medium text-800">Destinasi Wisata</label>
                        <Dropdown
                          value={selectedDest}
                          options={destinations.map(d => ({ label: `${d.nama} — Rp ${(d.harga_tiket ?? 0).toLocaleString('id-ID')}`, value: d.id }))}
                          onChange={(e) => setSelectedDest(e.value)}
                          placeholder="Pilih destinasi..."
                          className="border-round-lg w-full"
                          loading={loadingDest}
                          filter
                        />
                      </div>

                      <div className="flex flex-column gap-2">
                        <label className="text-sm font-medium text-800">Tanggal Kunjungan</label>
                        <Calendar
                          value={tanggal}
                          onChange={(e) => setTanggal(e.value as Date | null)}
                          minDate={tomorrow}
                          dateFormat="dd MM yy"
                          showIcon
                          className="border-round-lg w-full"
                          placeholder="Pilih tanggal..."
                        />
                      </div>

                      <div className="flex flex-column gap-2">
                        <label className="text-sm font-medium text-800">Jumlah Tiket</label>
                        <InputNumber
                          value={jumlah}
                          onValueChange={(e) => setJumlah(e.value ?? 1)}
                          min={1}
                          max={20}
                          showButtons
                          className="border-round-lg"
                        />
                      </div>
                    </div>
                  </Card>
                </div>

                {/* Summary Column */}
                <div className="col-12 lg:col-5">
                  <Card className="shadow-1 border-round-xl">
                    <h3 className="text-xl font-bold text-800 mt-0 mb-4">
                      <i className="pi pi-receipt mr-2 text-primary" />Ringkasan
                    </h3>

                    {selectedDestination ? (
                      <div className="flex flex-column gap-3">
                        {selectedDestination.thumbnail && (
                          <img
                            src={selectedDestination.thumbnail}
                            alt={selectedDestination.nama}
                            className="w-full border-round-lg"
                            style={{ height: 140, objectFit: 'cover' }}
                          />
                        )}
                        <div className="font-semibold text-800">{selectedDestination.nama}</div>
                        <div className="text-sm text-500">{selectedDestination.alamat}</div>

                        <div className="flex flex-column gap-2 pt-2 border-top-1 surface-border">
                          <div className="flex justify-content-between text-sm">
                            <span className="text-500">Harga per tiket</span>
                            <span className="text-700">Rp {hargaSatuan.toLocaleString('id-ID')}</span>
                          </div>
                          <div className="flex justify-content-between text-sm">
                            <span className="text-500">Jumlah</span>
                            <span className="text-700">{jumlah} tiket</span>
                          </div>
                          {tanggal && (
                            <div className="flex justify-content-between text-sm">
                              <span className="text-500">Tanggal</span>
                              <span className="text-700">{tanggal.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                            </div>
                          )}
                        </div>

                        <div className="flex pt-3 mt-2 justify-content-between align-items-center border-top-1 surface-border">
                          <span className="font-bold text-800">Total</span>
                          <span className="text-2xl font-bold text-primary">Rp {totalHarga.toLocaleString('id-ID')}</span>
                        </div>

                        <Button
                          label={submitting ? 'Memproses...' : 'Pesan Sekarang'}
                          icon="pi pi-shopping-cart"
                          className="w-full border-round-xl mt-2"
                          loading={submitting}
                          disabled={!tanggal || jumlah < 1}
                          onClick={handlePurchase}
                        />
                      </div>
                    ) : (
                      <div className="text-center py-6">
                        <i className="pi pi-ticket text-5xl text-300 mb-3" style={{ display: 'block' }} />
                        <p className="text-500 m-0">Pilih destinasi untuk melihat ringkasan</p>
                      </div>
                    )}
                  </Card>
                </div>
              </div>
            </TabPanel>

            {/* ---- TAB: Riwayat Tiket ---- */}
            <TabPanel header="Riwayat Tiket" leftIcon="pi pi-history mr-2">
              <div className="mt-3">
                <Card className="shadow-1 border-round-xl">
                  <DataTable
                    value={tickets}
                    loading={loadingHistory}
                    size="small"
                    stripedRows
                    responsiveLayout="scroll"
                    emptyMessage="Belum ada riwayat tiket"
                  >
                    <Column field="kode_tiket" header="Kode Tiket" style={{ minWidth: '140px' }}
                      body={(row: TiketWisata) => <span className="font-mono font-semibold text-primary">{row.kode_tiket}</span>} />
                    <Column header="Destinasi" style={{ minWidth: '180px' }}
                      body={(row: TiketWisata) => row.destinasi?.nama || `#${row.destinasi_id}`} />
                    <Column header="Tanggal" style={{ width: '130px' }}
                      body={(row: TiketWisata) => new Date(row.tanggal_kunjungan).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })} />
                    <Column field="jumlah_tiket" header="Qty" alignHeader="center" bodyClassName="text-center" style={{ width: '70px' }} />
                    <Column header="Total" style={{ width: '130px' }}
                      body={(row: TiketWisata) => <span className="font-medium">Rp {row.total_harga.toLocaleString('id-ID')}</span>} />
                    <Column header="Status" bodyClassName="text-center" alignHeader="center" style={{ width: '140px' }}
                      body={(row: TiketWisata) => <Tag value={STATUS_LABEL[row.status]} severity={STATUS_COLOR[row.status]} className="text-xs" />} />
                    <Column header="" style={{ width: '60px' }}
                      body={(row: TiketWisata) => row.qr_code ? (
                        <Button icon="pi pi-qrcode" text rounded severity="info" onClick={() => navigate(`/tiket/${row.id}`)}/>
                      ) : null} />
                  </DataTable>
                </Card>
              </div>
            </TabPanel>
          </TabView>

          {/* Info Banner */}
          <div className="mt-5 p-4 border-round-xl surface-100 flex gap-3 align-items-start">
            <i className="pi pi-info-circle text-primary text-xl mt-1" />
            <div className="text-sm text-700">
              <p className="m-0 mb-2 font-semibold">Informasi E-Ticketing:</p>
              <ul className="m-0 pl-4">
                <li>Tiket berlaku sesuai tanggal kunjungan yang dipilih</li>
                <li>Tunjukkan QR Code tiket di loket masuk destinasi wisata</li>
                <li>Tiket tidak dapat direfund setelah pembayaran dikonfirmasi</li>
              </ul>
              <p className="m-0 mt-2">
                Jelajahi destinasi wisata kami di <Link to="/wisata" className="text-primary font-semibold">Direktori Wisata</Link>
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default TiketPurchase;
