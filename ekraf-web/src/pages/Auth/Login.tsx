import { useState, useEffect, type FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';
import { Checkbox } from 'primereact/checkbox';
import { Message } from 'primereact/message';
import { Ripple } from 'primereact/ripple';
import LogoEkraf from '../../assets/logoekraf.png';

const FEATURES = [
  { icon: 'pi pi-chart-bar', title: 'Dashboard Analitik', desc: 'Pantau statistik ekonomi kreatif secara real-time' },
  { icon: 'pi pi-users', title: 'Manajemen Pelaku', desc: 'Kelola data pelaku UMKM dan ekonomi kreatif' },
  { icon: 'pi pi-calendar', title: 'Event & Pelatihan', desc: 'Atur jadwal kegiatan dan program pelatihan' },
  { icon: 'pi pi-file', title: 'Laporan & Ekspor', desc: 'Generate laporan komprehensif dalam berbagai format' },
];

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 992);

  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const onResize = () => setIsDesktop(window.innerWidth >= 992);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    if (!email || !password) {
      setError('Email dan password harus diisi!');
      setIsSubmitting(false);
      return;
    }

    const result = await login(email, password);

    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.message);
    }

    setIsSubmitting(false);
  };

  /* ======== LEFT PANEL (desktop only) ======== */
  const leftPanel = (
    <div
      style={{
        flex: '1 1 50%',
        background: 'linear-gradient(160deg, #1e1b4b 0%, #3730a3 40%, #4f46e5 100%)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '60px 48px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Decorative circles */}
      <div style={{ position: 'absolute', top: -80, right: -80, width: 260, height: 260, borderRadius: '50%', background: 'rgba(255,255,255,0.04)' }} />
      <div style={{ position: 'absolute', bottom: -60, left: -60, width: 200, height: 200, borderRadius: '50%', background: 'rgba(255,255,255,0.03)' }} />
      <div style={{ position: 'absolute', top: '40%', right: 40, width: 120, height: 120, borderRadius: '50%', background: 'rgba(255,255,255,0.025)' }} />

      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 40, position: 'relative', zIndex: 1 }}>
        <img src={LogoEkraf} alt="DISPOPAR" style={{ height: 52, filter: 'brightness(0) invert(1) drop-shadow(0 2px 4px rgba(0,0,0,0.2))' }} />
        <div>
          <div style={{ color: '#fff', fontSize: '1.5rem', fontWeight: 800, letterSpacing: 1 }}>DISPOPAR</div>
          <div style={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.75rem', letterSpacing: 0.5 }}>Kota Bontang</div>
        </div>
      </div>

      {/* Tagline */}
      <div style={{ position: 'relative', zIndex: 1, marginBottom: 36 }}>
        <h1 style={{ color: '#fff', fontSize: '2rem', fontWeight: 700, lineHeight: 1.3, margin: 0 }}>
          Sistem Informasi<br />Ekonomi Kreatif
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.95rem', marginTop: 12, lineHeight: 1.6, maxWidth: 380 }}>
          Platform digital untuk pengelolaan data dan pengembangan sektor ekonomi kreatif Kota Bontang.
        </p>
      </div>

      {/* Features */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, position: 'relative', zIndex: 1 }}>
        {FEATURES.map((f) => (
          <div key={f.title} style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
            <div
              style={{
                width: 40, height: 40, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: 'rgba(255,255,255,0.12)', flexShrink: 0,
              }}
            >
              <i className={f.icon} style={{ color: '#c7d2fe', fontSize: '1.1rem' }} />
            </div>
            <div>
              <div style={{ color: '#e0e7ff', fontWeight: 600, fontSize: '0.9rem' }}>{f.title}</div>
              <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem', marginTop: 2 }}>{f.desc}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div style={{ position: 'relative', zIndex: 1, marginTop: 'auto', paddingTop: 40 }}>
        <div style={{ height: 1, background: 'rgba(255,255,255,0.1)', marginBottom: 16 }} />
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem', margin: 0 }}>
          © 2026 Dinas Pariwisata &amp; Olahraga Kota Bontang
        </p>
      </div>
    </div>
  );

  /* ======== RIGHT PANEL (form) ======== */
  const rightPanel = (
    <div
      style={{
        flex: isDesktop ? '1 1 50%' : '1 1 100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: isDesktop ? '48px 56px' : '32px 20px',
        background: '#fff',
        minHeight: isDesktop ? undefined : '100vh',
      }}
    >
      <div style={{ width: '100%', maxWidth: 420 }}>
        {/* Mobile logo */}
        {!isDesktop && (
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <Link to="/" style={{ textDecoration: 'none' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, marginBottom: 8 }}>
                <img src={LogoEkraf} alt="DISPOPAR" style={{ height: 44 }} />
                <span style={{ fontSize: '1.4rem', fontWeight: 800, color: '#1e1b4b', letterSpacing: 0.5 }}>DISPOPAR</span>
              </div>
            </Link>
          </div>
        )}

        {/* Greeting */}
        <div style={{ marginBottom: 32 }}>
          <h2 style={{ margin: 0, fontSize: '1.6rem', fontWeight: 700, color: '#1e1b4b' }}>Selamat Datang 👋</h2>
          <p style={{ margin: '8px 0 0', color: '#6b7280', fontSize: '0.9rem' }}>Masuk ke dashboard administrasi DISPOPAR</p>
        </div>

        {/* Error */}
        {error && (
          <div style={{ marginBottom: 20 }}>
            <Message severity="error" text={error} style={{ width: '100%' }} />
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Email */}
          <div style={{ marginBottom: 20 }}>
            <label htmlFor="email" style={{ display: 'block', fontWeight: 600, fontSize: '0.85rem', color: '#374151', marginBottom: 8 }}>
              Email
            </label>
            <span className="p-input-icon-left" style={{ width: '100%' }}>
              <i className="pi pi-envelope" />
              <InputText
                id="email"
                type="email"
                placeholder="nama@dispopar.go.id"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ width: '100%', padding: '12px 12px 12px 40px' }}
              />
            </span>
          </div>

          {/* Password */}
          <div style={{ marginBottom: 20 }}>
            <label htmlFor="password" style={{ display: 'block', fontWeight: 600, fontSize: '0.85rem', color: '#374151', marginBottom: 8 }}>
              Password
            </label>
            <Password
              id="password"
              placeholder="Masukkan password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              toggleMask
              feedback={false}
              inputStyle={{ width: '100%', padding: '12px' }}
              style={{ width: '100%' }}
              pt={{ root: { style: { width: '100%' } }, input: { style: { width: '100%' } } }}
            />
          </div>

          {/* Remember & Forgot */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Checkbox
                inputId="rememberMe"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.checked ?? false)}
              />
              <label htmlFor="rememberMe" style={{ color: '#6b7280', fontSize: '0.85rem', cursor: 'pointer' }}>
                Ingat saya
              </label>
            </div>
            <a href="#" style={{ color: '#4338ca', fontSize: '0.85rem', fontWeight: 600, textDecoration: 'none' }}>
              Lupa password?
            </a>
          </div>

          {/* Submit */}
          <Button
            type="submit"
            label={isSubmitting ? 'Memproses...' : 'Masuk ke Dashboard'}
            icon={isSubmitting ? 'pi pi-spin pi-spinner' : 'pi pi-sign-in'}
            iconPos="right"
            loading={isSubmitting}
            style={{
              width: '100%',
              padding: '14px 24px',
              background: 'linear-gradient(135deg, #4338ca 0%, #6366f1 100%)',
              border: 'none',
              fontSize: '0.95rem',
              fontWeight: 600,
              borderRadius: 10,
              letterSpacing: 0.3,
            }}
          >
            <Ripple />
          </Button>
        </form>

        {/* Divider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '24px 0' }}>
          <div style={{ flex: 1, height: 1, background: '#e5e7eb' }} />
          <span style={{ color: '#9CA3AF', fontSize: '0.8rem' }}>atau</span>
          <div style={{ flex: 1, height: 1, background: '#e5e7eb' }} />
        </div>

        {/* Back to Home */}
        <Link to="/" style={{ textDecoration: 'none' }}>
          <Button
            label="Kembali ke Beranda"
            icon="pi pi-arrow-left"
            outlined
            type="button"
            style={{
              width: '100%',
              padding: '12px 24px',
              color: '#4338ca',
              borderColor: '#c7d2fe',
              borderRadius: 10,
              fontSize: '0.9rem',
              fontWeight: 600,
            }}
          />
        </Link>

        {/* Demo Accounts */}
        <div
          style={{
            marginTop: 24,
            padding: 16,
            borderRadius: 12,
            background: '#f8fafc',
            border: '1px solid #e5e7eb',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <i className="pi pi-info-circle" style={{ color: '#4338ca', fontSize: '0.9rem' }} />
            <span style={{ fontWeight: 700, fontSize: '0.8rem', color: '#374151', textTransform: 'uppercase', letterSpacing: 0.5 }}>Akun Demo</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[
              { role: 'Admin', email: 'admin@dispopar.go.id', pw: 'admin123', color: '#4338ca' },
              { role: 'User', email: 'user@dispopar.go.id', pw: 'user123', color: '#10B981' },
            ].map((acc) => (
              <div
                key={acc.role}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '8px 12px',
                  borderRadius: 8,
                  background: '#fff',
                  border: '1px solid #f3f4f6',
                  cursor: 'pointer',
                  transition: 'border-color 0.2s',
                }}
                onClick={() => { setEmail(acc.email); setPassword(acc.pw); }}
                title="Klik untuk mengisi otomatis"
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div
                    style={{
                      width: 28, height: 28, borderRadius: 8,
                      background: acc.color, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}
                  >
                    <i className="pi pi-user" style={{ color: '#fff', fontSize: '0.7rem' }} />
                  </div>
                  <span style={{ fontWeight: 600, fontSize: '0.8rem', color: '#374151' }}>{acc.role}</span>
                </div>
                <code
                  style={{
                    fontSize: '0.72rem',
                    color: '#6b7280',
                    background: '#f9fafb',
                    padding: '3px 8px',
                    borderRadius: 6,
                    fontFamily: 'monospace',
                  }}
                >
                  {acc.email}
                </code>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile footer */}
        {!isDesktop && (
          <p style={{ textAlign: 'center', color: '#9CA3AF', fontSize: '0.75rem', marginTop: 24 }}>
            © 2026 Dinas DISPOPAR Kota Bontang
          </p>
        )}
      </div>
    </div>
  );

  return (
    <div
      style={{
        display: 'flex',
        minHeight: '100vh',
        flexDirection: isDesktop ? 'row' : 'column',
      }}
    >
      {isDesktop && leftPanel}
      {rightPanel}
    </div>
  );
};

export default Login;
