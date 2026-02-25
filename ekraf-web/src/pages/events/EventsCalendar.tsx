import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tag } from 'primereact/tag';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { Paginator } from 'primereact/paginator';
import { PageHeroBanner } from '../../components/shared/PageHeroBanner';
import { eventFestivalService } from '../../services';
import type { EventFestival, EventFilters, KategoriEvent } from '../../types';

const KATEGORI_OPTIONS = [
  { label: 'Semua Kategori', value: '' },
  { label: 'Festival', value: 'festival' },
  { label: 'Pameran', value: 'pameran' },
  { label: 'Lomba', value: 'lomba' },
  { label: 'Seminar', value: 'seminar' },
  { label: 'Workshop', value: 'workshop' },
  { label: 'Pertunjukan', value: 'pertunjukan' },
  { label: 'Lainnya', value: 'lainnya' },
];

const KATEGORI_COLORS: Record<string, string> = {
  festival: '#ef4444', pameran: '#f59e0b', lomba: '#22c55e',
  seminar: '#6366f1', workshop: '#06b6d4', pertunjukan: '#ec4899', lainnya: '#64748b',
};

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Ags', 'Sep', 'Okt', 'Nov', 'Des'];

function formatDate(dateStr: string): { day: string; month: string; year: string; full: string } {
  const d = new Date(dateStr);
  return {
    day: d.getDate().toString().padStart(2, '0'),
    month: MONTHS[d.getMonth()],
    year: d.getFullYear().toString(),
    full: d.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
  };
}

function formatRange(start: string, end?: string | null): string {
  const s = formatDate(start);
  if (!end) return s.full;
  const e = formatDate(end);
  if (s.full === e.full) return s.full;
  return `${s.full} – ${e.full}`;
}

const EventsCalendar = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState<EventFestival[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [first, setFirst] = useState(0);
  const [rows] = useState(9);
  const [search, setSearch] = useState('');
  const [kategori, setKategori] = useState<KategoriEvent | ''>('');
  const [showUpcoming, setShowUpcoming] = useState(true);

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    try {
      const filters: EventFilters = {
        page: Math.floor(first / rows) + 1,
        per_page: rows,
      };
      if (search) filters.search = search;
      if (kategori) filters.kategori = kategori;
      if (showUpcoming) filters.upcoming = true;

      const resp = await eventFestivalService.list(filters);
      setEvents(resp.data);
      setTotal(resp.meta.total);
    } catch {
      console.error('Gagal memuat data event');
    } finally {
      setLoading(false);
    }
  }, [first, rows, search, kategori, showUpcoming]);

  useEffect(() => { fetchEvents(); }, [fetchEvents]);

  return (
    <div>
      <PageHeroBanner title="Calendar of Events" subtitle="Jadwal festival, acara budaya, dan kegiatan wisata di Kota Bontang" />

      <section className="bp-content-section">
        <div className="container mx-auto px-4 py-6">
          {/* Filter Bar */}
          <div className="flex flex-wrap gap-3 mb-5 align-items-center justify-content-between">
            <div className="flex flex-wrap gap-3 align-items-center">
              <span className="p-input-icon-left">
                <i className="pi pi-search" />
                <InputText
                  value={search}
                  onChange={(e) => { setSearch(e.target.value); setFirst(0); }}
                  placeholder="Cari event..."
                  className="border-round-xl w-18rem"
                />
              </span>
              <Dropdown
                value={kategori}
                options={KATEGORI_OPTIONS}
                onChange={(e) => { setKategori(e.value); setFirst(0); }}
                className="border-round-xl w-14rem"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => { setShowUpcoming(true); setFirst(0); }}
                className={`border-round-xl px-3 py-2 text-sm font-medium cursor-pointer transition-all border-1 ${showUpcoming ? 'bg-primary text-white border-primary' : 'surface-card text-700 surface-border'}`}
              >
                <i className="pi pi-calendar mr-2" />Mendatang
              </button>
              <button
                onClick={() => { setShowUpcoming(false); setFirst(0); }}
                className={`border-round-xl px-3 py-2 text-sm font-medium cursor-pointer transition-all border-1 ${!showUpcoming ? 'bg-primary text-white border-primary' : 'surface-card text-700 surface-border'}`}
              >
                <i className="pi pi-list mr-2" />Semua
              </button>
            </div>
          </div>

          {/* Event Grid */}
          {loading ? (
            <div className="flex py-8 align-items-center justify-content-center">
              <i className="pi pi-spin pi-spinner text-4xl text-primary" />
            </div>
          ) : events.length === 0 ? (
            <div className="text-center py-8">
              <i className="pi pi-calendar text-6xl text-300 mb-3" style={{ display: 'block' }} />
              <p className="text-xl text-500">Belum ada event{showUpcoming ? ' mendatang' : ''}</p>
            </div>
          ) : (
            <div className="grid">
              {events.map((evt) => {
                const start = formatDate(evt.tanggal_mulai);
                return (
                  <div key={evt.id} className="col-12 md:col-6 lg:col-4">
                    <div
                      className="surface-card border-round-xl shadow-1 overflow-hidden cursor-pointer transition-all hover:shadow-3"
                      style={{ height: '100%' }}
                      onClick={() => navigate(`/events/${evt.id}`)}
                    >
                      {/* Image / Date Block */}
                      <div className="relative" style={{ height: 200 }}>
                        {evt.thumbnail ? (
                          <img src={evt.thumbnail} alt={evt.nama} className="w-full h-full" style={{ objectFit: 'cover' }} />
                        ) : (
                          <div className="w-full h-full flex align-items-center justify-content-center" style={{ background: `linear-gradient(135deg, ${KATEGORI_COLORS[evt.kategori]}22, ${KATEGORI_COLORS[evt.kategori]}44)` }}>
                            <i className="pi pi-calendar text-6xl" style={{ color: KATEGORI_COLORS[evt.kategori] }} />
                          </div>
                        )}
                        {/* Date badge */}
                        <div className="absolute" style={{ top: 12, left: 12 }}>
                          <div className="surface-card border-round-lg shadow-2 text-center px-3 py-2" style={{ minWidth: 60 }}>
                            <div className="text-2xl font-bold text-800 line-height-1">{start.day}</div>
                            <div className="text-xs font-semibold text-primary mt-1">{start.month}</div>
                            <div className="text-xs text-500">{start.year}</div>
                          </div>
                        </div>
                        {/* Category badge */}
                        <div className="absolute" style={{ top: 12, right: 12 }}>
                          <Tag value={evt.kategori} style={{ background: KATEGORI_COLORS[evt.kategori], color: '#fff', textTransform: 'capitalize', fontSize: '0.7rem' }} />
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-3">
                        <h3 className="text-lg font-bold text-800 m-0 mb-2 line-clamp-2" style={{ lineClamp: 2, WebkitLineClamp: 2, display: '-webkit-box', WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                          {evt.nama}
                        </h3>

                        <div className="flex flex-column gap-2 text-sm text-600">
                          <div className="flex gap-2 align-items-center">
                            <i className="pi pi-calendar text-primary" style={{ fontSize: '0.85rem' }} />
                            <span>{formatRange(evt.tanggal_mulai, evt.tanggal_selesai)}</span>
                          </div>
                          {evt.lokasi && (
                            <div className="flex gap-2 align-items-center">
                              <i className="pi pi-map-marker text-primary" style={{ fontSize: '0.85rem' }} />
                              <span>{evt.lokasi}</span>
                            </div>
                          )}
                          {evt.penyelenggara && (
                            <div className="flex gap-2 align-items-center">
                              <i className="pi pi-building text-primary" style={{ fontSize: '0.85rem' }} />
                              <span>{evt.penyelenggara}</span>
                            </div>
                          )}
                        </div>

                        {/* Price */}
                        <div className="flex mt-3 pt-3 align-items-center justify-content-between border-top-1 surface-border">
                          <span className="font-semibold text-primary">
                            {evt.harga_tiket ? `Rp ${evt.harga_tiket.toLocaleString('id-ID')}` : 'Gratis'}
                          </span>
                          <span className="text-xs text-primary font-medium">
                            Lihat Detail <i className="pi pi-arrow-right ml-1" style={{ fontSize: '0.7rem' }} />
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {total > rows && (
            <div className="flex pt-4 justify-content-center">
              <Paginator first={first} rows={rows} totalRecords={total} onPageChange={(e) => setFirst(e.first)} className="border-round-xl" />
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default EventsCalendar;
