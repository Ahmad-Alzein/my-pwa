// Refined Atelier primitives — cards, buttons, fields, amounts
const primStyles = {
  card: {
    background: 'var(--bg-secondary)',
    border: '1px solid var(--border-soft)',
    borderRadius: 'var(--radius-lg)',
    padding: 'var(--space-lg)',
    boxShadow: 'var(--shadow-sm)',
    transition: 'box-shadow 0.25s var(--ease)',
  },
  cardRaised: {
    background: 'var(--bg-raised)',
    border: '1px solid var(--border-soft)',
    borderRadius: 'var(--radius-lg)',
    padding: 'var(--space-lg)',
    boxShadow: 'var(--shadow-sm)',
  },
};

function Card({ children, style, padding, onClick, hoverable }) {
  const [hover, setHover] = React.useState(false);
  const s = {
    ...primStyles.card,
    ...(padding !== undefined ? { padding } : {}),
    ...(hover && hoverable ? { boxShadow: 'var(--shadow-md)' } : {}),
    ...(onClick ? { cursor: 'pointer' } : {}),
    ...style,
  };
  return (
    <div
      style={s}
      onMouseEnter={() => hoverable && setHover(true)}
      onMouseLeave={() => hoverable && setHover(false)}
      onClick={onClick}
    >
      {children}
    </div>
  );
}

function SectionTitle({ children, style, eyebrow, right }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 'var(--space-md)', marginBottom: 'var(--space-lg)', ...style }}>
      <div>
        {eyebrow && <div className="caps" style={{ marginBottom: 6 }}>{eyebrow}</div>}
        <h2 className="serif" style={{ margin: 0, fontSize: 20, fontWeight: 500, color: 'var(--text-primary)', letterSpacing: '-0.01em' }}>{children}</h2>
      </div>
      {right}
    </div>
  );
}

function PageTitle({ children, eyebrow, right }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 'var(--space-md)', marginBottom: 'var(--space-xl)' }}>
      <div>
        {eyebrow && <div className="caps" style={{ marginBottom: 8 }}>{eyebrow}</div>}
        <h1 className="serif" style={{ margin: 0, fontSize: 32, fontWeight: 500, color: 'var(--text-primary)', letterSpacing: '-0.02em', lineHeight: 1.1 }}>{children}</h1>
      </div>
      {right && <div style={{ paddingBottom: 4 }}>{right}</div>}
    </div>
  );
}

function Button({ children, variant = 'primary', size = 'md', onClick, icon, disabled, style, type = 'button' }) {
  const [hover, setHover] = React.useState(false);
  const base = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    fontFamily: 'inherit',
    fontWeight: 500,
    letterSpacing: '0.01em',
    borderRadius: 'var(--radius-md)',
    transition: 'all 0.15s var(--ease)',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.5 : 1,
    whiteSpace: 'nowrap',
    userSelect: 'none',
  };
  const sizes = {
    sm: { padding: '7px 14px', fontSize: 13 },
    md: { padding: '10px 20px', fontSize: 14 },
    lg: { padding: '13px 24px', fontSize: 15 },
  };
  const variants = {
    primary: {
      background: hover ? 'var(--accent-hover)' : 'var(--accent)',
      color: '#fff',
      border: '1px solid transparent',
    },
    secondary: {
      background: 'transparent',
      color: 'var(--accent)',
      border: '1px solid var(--border)',
      ...(hover ? { background: 'var(--accent-soft)' } : {}),
    },
    ghost: {
      background: hover ? 'var(--bg-tertiary)' : 'transparent',
      color: 'var(--text-secondary)',
      border: '1px solid transparent',
    },
    danger: {
      background: hover ? 'var(--danger)' : 'transparent',
      color: hover ? '#fff' : 'var(--danger)',
      border: '1px solid var(--border)',
    },
  };
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{ ...base, ...sizes[size], ...variants[variant], ...style }}
    >
      {icon && <Icon name={icon} size={size === 'sm' ? 14 : 16} />}
      {children}
    </button>
  );
}

function Dot({ color = 'var(--text-muted)', size = 6, style }) {
  return <span style={{ display: 'inline-block', width: size, height: size, borderRadius: '50%', background: color, flexShrink: 0, ...style }} />;
}

function Amount({ value, currency = '€', tone, size = 'md', style }) {
  const sizes = { sm: 13, md: 14, lg: 20, xl: 28, xxl: 40 };
  const tones = {
    income: 'var(--success)',
    expense: 'var(--danger)',
    neutral: 'var(--text-primary)',
    muted: 'var(--text-secondary)',
    accent: 'var(--accent)',
  };
  const sign = value > 0 && tone === 'income' ? '+' : value < 0 ? '−' : '';
  const abs = Math.abs(value);
  const formatted = abs.toLocaleString('fr-FR', { minimumFractionDigits: abs % 1 === 0 ? 0 : 2, maximumFractionDigits: 2 });
  return (
    <span className="mono" style={{ fontSize: sizes[size], fontWeight: size === 'xxl' ? 500 : size === 'xl' ? 500 : 500, color: tones[tone] || tones.neutral, letterSpacing: '-0.01em', ...style }}>
      {sign}{currency}{formatted}
    </span>
  );
}

function Field({ label, children, hint }) {
  return (
    <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      {label && <span className="caps">{label}</span>}
      {children}
      {hint && <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{hint}</span>}
    </label>
  );
}

function Input(props) {
  const [focus, setFocus] = React.useState(false);
  return (
    <input
      {...props}
      onFocus={(e) => { setFocus(true); props.onFocus?.(e); }}
      onBlur={(e) => { setFocus(false); props.onBlur?.(e); }}
      style={{
        height: 44,
        padding: '0 14px',
        background: 'var(--bg-primary)',
        border: `1px solid ${focus ? 'var(--accent)' : 'var(--border)'}`,
        borderRadius: 'var(--radius-md)',
        color: 'var(--text-primary)',
        fontSize: 14,
        outline: 'none',
        transition: 'border-color 0.15s var(--ease), box-shadow 0.15s var(--ease)',
        boxShadow: focus ? `0 0 0 3px var(--accent-soft)` : 'none',
        ...props.style,
      }}
    />
  );
}

function Select(props) {
  return (
    <select
      {...props}
      style={{
        height: 44,
        padding: '0 14px',
        background: 'var(--bg-primary)',
        border: `1px solid var(--border)`,
        borderRadius: 'var(--radius-md)',
        color: 'var(--text-primary)',
        fontSize: 14,
        outline: 'none',
        cursor: 'pointer',
        appearance: 'none',
        backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23A39E96' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><polyline points='6 9 12 15 18 9'/></svg>")`,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'right 12px center',
        paddingRight: 36,
        ...props.style,
      }}
    />
  );
}

function Textarea(props) {
  const [focus, setFocus] = React.useState(false);
  return (
    <textarea
      {...props}
      onFocus={(e) => { setFocus(true); props.onFocus?.(e); }}
      onBlur={(e) => { setFocus(false); props.onBlur?.(e); }}
      style={{
        minHeight: 80,
        padding: '12px 14px',
        background: 'var(--bg-primary)',
        border: `1px solid ${focus ? 'var(--accent)' : 'var(--border)'}`,
        borderRadius: 'var(--radius-md)',
        color: 'var(--text-primary)',
        fontSize: 14,
        fontFamily: 'inherit',
        outline: 'none',
        resize: 'vertical',
        transition: 'border-color 0.15s var(--ease)',
        boxShadow: focus ? `0 0 0 3px var(--accent-soft)` : 'none',
        ...props.style,
      }}
    />
  );
}

// Segmented control
function Segmented({ value, options, onChange, style }) {
  return (
    <div style={{
      display: 'inline-flex',
      background: 'var(--bg-tertiary)',
      borderRadius: 'var(--radius-md)',
      padding: 3,
      gap: 2,
      ...style,
    }}>
      {options.map(opt => {
        const v = typeof opt === 'string' ? opt : opt.value;
        const label = typeof opt === 'string' ? opt : opt.label;
        const active = value === v;
        return (
          <button key={v} onClick={() => onChange(v)} style={{
            padding: '6px 14px',
            borderRadius: 'calc(var(--radius-md) - 2px)',
            fontSize: 13,
            fontWeight: active ? 500 : 400,
            color: active ? 'var(--text-primary)' : 'var(--text-secondary)',
            background: active ? 'var(--bg-raised)' : 'transparent',
            boxShadow: active ? 'var(--shadow-sm)' : 'none',
            transition: 'all 0.15s var(--ease)',
          }}>{label}</button>
        );
      })}
    </div>
  );
}

// Status text with colored dot
function Status({ label, tone }) {
  const colors = {
    success: 'var(--success)',
    warning: 'var(--warning)',
    danger: 'var(--danger)',
    info: 'var(--info)',
    muted: 'var(--text-muted)',
    accent: 'var(--accent)',
  };
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: colors[tone] || 'var(--text-secondary)', fontSize: 13 }}>
      <Dot color={colors[tone] || 'var(--text-muted)'} />
      {label}
    </span>
  );
}

// Modal wrapper
function Modal({ open, onClose, children, title, eyebrow, width = 480 }) {
  React.useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === 'Escape' && onClose?.();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 100,
      background: 'rgba(20, 19, 18, 0.4)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 'var(--space-lg)',
      animation: 'atelier-fade-in 0.2s var(--ease)',
      backdropFilter: 'blur(4px)',
    }} onClick={onClose}>
      <div style={{
        width: '100%', maxWidth: width,
        background: 'var(--bg-raised)',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border-soft)',
        boxShadow: 'var(--shadow-lg)',
        padding: 'var(--space-xl)',
        animation: 'atelier-slide-up 0.25s var(--ease)',
      }} onClick={e => e.stopPropagation()}>
        {(title || eyebrow) && (
          <div style={{ marginBottom: 'var(--space-lg)' }}>
            {eyebrow && <div className="caps" style={{ marginBottom: 6 }}>{eyebrow}</div>}
            {title && <h2 className="serif" style={{ margin: 0, fontSize: 22, fontWeight: 500, letterSpacing: '-0.01em' }}>{title}</h2>}
          </div>
        )}
        {children}
      </div>
    </div>
  );
}

// Bottom sheet for mobile
function BottomSheet({ open, onClose, children, title }) {
  if (!open) return null;
  return (
    <div style={{
      position: 'absolute', inset: 0, zIndex: 50,
      background: 'rgba(20, 19, 18, 0.3)',
      display: 'flex', alignItems: 'flex-end',
    }} onClick={onClose}>
      <div style={{
        width: '100%',
        background: 'var(--bg-raised)',
        borderTopLeftRadius: 'var(--radius-xl)',
        borderTopRightRadius: 'var(--radius-xl)',
        padding: 'var(--space-lg)',
        paddingBottom: 'calc(var(--space-lg) + env(safe-area-inset-bottom))',
        animation: 'atelier-slide-up 0.25s var(--ease)',
        boxShadow: 'var(--shadow-lg)',
      }} onClick={e => e.stopPropagation()}>
        <div style={{ width: 36, height: 4, background: 'var(--border)', borderRadius: 2, margin: '0 auto 16px' }} />
        {title && <h3 className="serif" style={{ margin: '0 0 16px', fontSize: 20, fontWeight: 500 }}>{title}</h3>}
        {children}
      </div>
    </div>
  );
}

// Inject keyframes once
(function injectPrimKeyframes() {
  const s = document.createElement('style');
  s.textContent = `
    @keyframes atelier-fade-in { from { opacity: 0; } to { opacity: 1; } }
    @keyframes atelier-slide-up { from { transform: translateY(12px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
    @keyframes atelier-pulse { 0%, 100% { opacity: 0.5; } 50% { opacity: 1; } }
    .atelier-skeleton {
      background: linear-gradient(90deg, var(--bg-tertiary) 0%, var(--bg-secondary) 50%, var(--bg-tertiary) 100%);
      background-size: 200% 100%;
      animation: atelier-shimmer 2s linear infinite;
      border-radius: var(--radius-sm);
    }
    @keyframes atelier-shimmer { from { background-position: 200% 0; } to { background-position: -200% 0; } }
  `;
  document.head.appendChild(s);
})();

Object.assign(window, {
  Card, SectionTitle, PageTitle, Button, Dot, Amount,
  Field, Input, Select, Textarea, Segmented, Status,
  Modal, BottomSheet,
});
