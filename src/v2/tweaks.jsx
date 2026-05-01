// Tweaks panel — theme, accent, density, mobile vis
function TweaksPanel({ open, onClose, settings, setSettings }) {
  if (!open) return null;
  const accents = [
    { id: 'terracotta', name: 'Terracotta', light: '#C17F59', dark: '#D4956F' },
    { id: 'sage', name: 'Sage', light: '#5A8A6C', dark: '#7AAF8E' },
    { id: 'steel', name: 'Steel', light: '#5B7FA5', dark: '#7A9FC5' },
    { id: 'plum', name: 'Plum', light: '#8E5C7A', dark: '#B083A0' },
  ];
  const setAccent = (a) => {
    setSettings(s => ({ ...s, accent: a.id }));
    document.documentElement.style.setProperty('--accent', document.documentElement.getAttribute('data-theme') === 'dark' ? a.dark : a.light);
    document.documentElement.style.setProperty('--accent-hover', a.dark);
  };
  return (
    <div style={{
      position: 'fixed', right: 24, bottom: 24, zIndex: 90,
      width: 320,
      background: 'var(--bg-raised)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius-lg)',
      boxShadow: 'var(--shadow-lg)',
      overflow: 'hidden',
      animation: 'atelier-slide-up 0.25s var(--ease)',
    }}>
      <div style={{ padding: '14px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-soft)' }}>
        <h3 className="serif" style={{ margin: 0, fontSize: 16, fontWeight: 500 }}>Tweaks</h3>
        <button onClick={onClose} style={{ color: 'var(--text-muted)', padding: 4 }}><Icon name="x" size={14} /></button>
      </div>
      <div style={{ padding: '18px', display: 'flex', flexDirection: 'column', gap: 18 }}>
        <div>
          <div className="caps" style={{ marginBottom: 10 }}>Accent</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
            {accents.map(a => (
              <button key={a.id} onClick={() => setAccent(a)} style={{
                padding: 10,
                background: settings.accent === a.id ? 'var(--bg-tertiary)' : 'var(--bg-secondary)',
                border: `1px solid ${settings.accent === a.id ? a.light : 'var(--border-soft)'}`,
                borderRadius: 'var(--radius-md)',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
              }}>
                <div style={{ width: 22, height: 22, borderRadius: '50%', background: a.light }} />
                <span style={{ fontSize: 10, color: 'var(--text-secondary)' }}>{a.name}</span>
              </button>
            ))}
          </div>
        </div>
        <div>
          <div className="caps" style={{ marginBottom: 10 }}>Surfaces</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <Toggle label="Show mobile companion" value={settings.showMobile} onChange={v => setSettings(s => ({ ...s, showMobile: v }))} />
            <Toggle label="Paper grain" value={settings.grain} onChange={v => {
              setSettings(s => ({ ...s, grain: v }));
              document.body.style.backgroundImage = v ? 'var(--paper-grain)' : '';
            }} />
            <Toggle label="Sidebar collapsed" value={settings.collapsed} onChange={v => setSettings(s => ({ ...s, collapsed: v }))} />
          </div>
        </div>
      </div>
    </div>
  );
}

function Toggle({ label, value, onChange }) {
  return (
    <button onClick={() => onChange(!value)} style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '8px 4px',
      width: '100%',
    }}>
      <span style={{ fontSize: 13, color: 'var(--text-primary)' }}>{label}</span>
      <span style={{
        width: 32, height: 18,
        background: value ? 'var(--accent)' : 'var(--bg-tertiary)',
        borderRadius: 10,
        position: 'relative',
        transition: 'background 0.15s var(--ease)',
      }}>
        <span style={{
          position: 'absolute',
          top: 2, left: value ? 16 : 2,
          width: 14, height: 14,
          background: '#fff',
          borderRadius: '50%',
          transition: 'left 0.15s var(--ease)',
          boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
        }} />
      </span>
    </button>
  );
}

Object.assign(window, { TweaksPanel });
