// Atelier primitives — Card, Button, Input, Select, Segmented, Amount, Pill, Modal
const kitStyles = {
  card: { background: 'var(--bg-secondary)', border: '1px solid var(--border-soft)', borderRadius: 'var(--radius-lg)', padding: 24, boxShadow: 'var(--shadow-sm)' },
  cardRaised: { background: 'var(--bg-raised)' },
};

function Card({ children, raised, padding, style, onClick }) {
  return <div style={{ ...kitStyles.card, ...(raised ? kitStyles.cardRaised : {}), ...(padding !== undefined ? { padding } : {}), ...(onClick ? { cursor: 'pointer' } : {}), ...style }} onClick={onClick}>{children}</div>;
}

function Button({ children, variant = 'primary', size = 'md', onClick, icon, style }) {
  const [h, sH] = React.useState(false);
  const sz = { sm: { padding: '7px 14px', fontSize: 13 }, md: { padding: '10px 20px', fontSize: 14 } };
  const v = {
    primary: { background: h ? 'var(--accent-hover)' : 'var(--accent)', color: '#fff', border: '1px solid transparent' },
    secondary: { background: h ? 'var(--accent-soft)' : 'transparent', color: 'var(--accent)', border: '1px solid var(--border)' },
    ghost: { background: h ? 'var(--bg-tertiary)' : 'transparent', color: 'var(--text-secondary)', border: '1px solid transparent' },
    danger: { background: h ? 'var(--danger)' : 'transparent', color: h ? '#fff' : 'var(--danger)', border: '1px solid var(--border)' },
  };
  return (
    <button onClick={onClick} onMouseEnter={() => sH(true)} onMouseLeave={() => sH(false)}
      style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontFamily: 'inherit', fontWeight: 500, letterSpacing: '0.01em',
        borderRadius: 'var(--radius-md)', transition: 'all 0.15s var(--ease)', cursor: 'pointer', whiteSpace: 'nowrap',
        ...sz[size], ...v[variant], ...style }}>
      {icon && <Icon name={icon} size={size === 'sm' ? 14 : 16} />}{children}
    </button>
  );
}

function Input(props) {
  const [f, sF] = React.useState(false);
  return <input {...props} onFocus={(e) => { sF(true); props.onFocus?.(e); }} onBlur={(e) => { sF(false); props.onBlur?.(e); }}
    style={{ height: 38, padding: '0 12px', background: 'var(--bg-primary)',
      border: `1px solid ${f ? 'var(--accent)' : 'var(--border)'}`, borderRadius: 'var(--radius-md)',
      color: 'var(--text-primary)', fontSize: 13, outline: 'none',
      boxShadow: f ? '0 0 0 3px var(--accent-soft)' : 'none', transition: 'border-color 0.15s, box-shadow 0.15s',
      ...props.style }} />;
}

function Select(props) {
  return <select {...props} style={{ height: 38, padding: '0 36px 0 12px', background: 'var(--bg-primary)',
    border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', color: 'var(--text-primary)',
    fontSize: 13, outline: 'none', cursor: 'pointer', appearance: 'none',
    backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%238E97A8' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><polyline points='6 9 12 15 18 9'/></svg>")`,
    backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center', ...props.style }} />;
}

function Segmented({ value, options, onChange, style }) {
  return (
    <div style={{ display: 'inline-flex', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)', padding: 3, gap: 2, ...style }}>
      {options.map(o => {
        const v = typeof o === 'string' ? o : o.value;
        const l = typeof o === 'string' ? o : o.label;
        const a = value === v;
        return <button key={v} onClick={() => onChange(v)} style={{
          padding: '6px 14px', borderRadius: 6, fontSize: 13, fontWeight: a ? 500 : 400,
          color: a ? 'var(--text-primary)' : 'var(--text-secondary)',
          background: a ? 'var(--bg-raised)' : 'transparent',
          boxShadow: a ? 'var(--shadow-sm)' : 'none', transition: 'all 0.15s var(--ease)' }}>{l}</button>;
      })}
    </div>
  );
}

function Amount({ value, currency = '€', tone, size = 'md', style }) {
  const sizes = { sm: 13, md: 14, lg: 20, xl: 28, xxl: 40 };
  const tones = { income: 'var(--success)', expense: 'var(--danger)', neutral: 'var(--text-primary)', muted: 'var(--text-secondary)', accent: 'var(--accent)' };
  const sign = tone === 'income' && value > 0 ? '+' : value < 0 ? '−' : '';
  const abs = Math.abs(value);
  const formatted = abs.toLocaleString('en-GB', { minimumFractionDigits: abs % 1 === 0 ? 0 : 2, maximumFractionDigits: 2 });
  return <span className="mono" style={{ fontSize: sizes[size], fontWeight: 500, color: tones[tone] || tones.neutral, letterSpacing: '-0.01em', ...style }}>{sign}{currency}{formatted}</span>;
}

function Dot({ color = 'var(--text-muted)', size = 6, style }) {
  return <span style={{ display: 'inline-block', width: size, height: size, borderRadius: '50%', background: color, flexShrink: 0, ...style }} />;
}

function Pill({ children, tone = 'muted' }) {
  const tones = {
    p0: { c: 'var(--danger)', b: 'var(--danger-soft)' },
    p1: { c: 'var(--warning)', b: 'var(--warning-soft)' },
    p2: { c: 'var(--info)', b: 'var(--info-soft)' },
    p3: { c: 'var(--text-secondary)', b: 'var(--bg-tertiary)' },
    accent: { c: 'var(--accent)', b: 'var(--accent-soft)' },
    muted: { c: 'var(--text-secondary)', b: 'var(--bg-tertiary)' },
    success: { c: 'var(--success)', b: 'var(--success-soft)' },
  };
  const t = tones[tone] || tones.muted;
  return <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 10px', borderRadius: 'var(--radius-sm)',
    fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 500, color: t.c, background: t.b,
    textTransform: 'uppercase', letterSpacing: '0.04em' }}>{children}</span>;
}

function Caps({ children, style }) {
  return <div style={{ textTransform: 'uppercase', letterSpacing: '0.08em', fontSize: 11, fontWeight: 500, color: 'var(--text-muted)', ...style }}>{children}</div>;
}

function PageTitle({ children, eyebrow, right }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 16, marginBottom: 32 }}>
      <div>{eyebrow && <Caps style={{ marginBottom: 8 }}>{eyebrow}</Caps>}
        <h1 className="serif" style={{ margin: 0, fontSize: 32, fontWeight: 500, color: 'var(--text-primary)', letterSpacing: '-0.02em', lineHeight: 1.1 }}>{children}</h1></div>
      {right && <div style={{ paddingBottom: 4 }}>{right}</div>}
    </div>
  );
}

function SectionTitle({ children, eyebrow, right }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 16, marginBottom: 18 }}>
      <div>{eyebrow && <Caps style={{ marginBottom: 6 }}>{eyebrow}</Caps>}
        <h2 className="serif" style={{ margin: 0, fontSize: 20, fontWeight: 500, color: 'var(--text-primary)', letterSpacing: '-0.01em' }}>{children}</h2></div>
      {right}
    </div>
  );
}

function Modal({ open, onClose, title, eyebrow, children, width = 480 }) {
  React.useEffect(() => {
    if (!open) return;
    const k = (e) => e.key === 'Escape' && onClose?.();
    window.addEventListener('keydown', k); return () => window.removeEventListener('keydown', k);
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 100, background: 'rgba(14,26,43,0.4)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, backdropFilter: 'blur(4px)', animation: 'fadeIn 200ms var(--ease)' }}>
      <div onClick={e => e.stopPropagation()} style={{ width: '100%', maxWidth: width, background: 'var(--bg-raised)',
        borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-soft)', boxShadow: 'var(--shadow-lg)', padding: 32, animation: 'slideUp 250ms var(--ease)' }}>
        {(title || eyebrow) && (
          <div style={{ marginBottom: 20 }}>{eyebrow && <Caps style={{ marginBottom: 6 }}>{eyebrow}</Caps>}
            {title && <h2 className="serif" style={{ margin: 0, fontSize: 22, fontWeight: 500, letterSpacing: '-0.01em' }}>{title}</h2>}</div>
        )}
        {children}
      </div>
    </div>
  );
}

Object.assign(window, { Card, Button, Input, Select, Segmented, Amount, Dot, Pill, Caps, PageTitle, SectionTitle, Modal });
