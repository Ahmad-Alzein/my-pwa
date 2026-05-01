// Reusable primitives: Sparkline, Donut, BarChart, HUD tick, Corner brackets, etc.

function Sparkline({ data, stroke = 'var(--cyan)', fill = 'rgba(6,182,212,0.15)', width = 100, height = 28, strokeWidth = 1.25 }) {
  if (!data || data.length === 0) return null;
  const max = Math.max(...data, 1);
  const min = Math.min(...data, 0);
  const range = max - min || 1;
  const step = width / (data.length - 1 || 1);
  const pts = data.map((v, i) => [i * step, height - ((v - min) / range) * (height - 4) - 2]);
  const path = pts.map((p, i) => (i === 0 ? 'M' : 'L') + p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join(' ');
  const area = path + ` L${width} ${height} L0 ${height} Z`;
  return (
    <svg width={width} height={height} style={{ display: 'block' }}>
      <path d={area} fill={fill} />
      <path d={path} fill="none" stroke={stroke} strokeWidth={strokeWidth} strokeLinejoin="round" strokeLinecap="round"/>
      <circle cx={pts[pts.length-1][0]} cy={pts[pts.length-1][1]} r="2" fill={stroke}/>
    </svg>
  );
}

function BarMini({ data, height = 28, width = 100, color = 'var(--blue)' }) {
  const max = Math.max(...data, 1);
  const barW = width / data.length - 2;
  return (
    <svg width={width} height={height} style={{ display: 'block' }}>
      {data.map((v, i) => {
        const h = (v / max) * (height - 2);
        return <rect key={i} x={i * (barW + 2)} y={height - h} width={barW} height={h} rx="1" fill={color} opacity={0.4 + 0.6 * (v / max)} />;
      })}
    </svg>
  );
}

function Donut({ data, size = 160, thickness = 16, onHover }) {
  // data: [{label, value, color}]
  const total = data.reduce((s, d) => s + d.value, 0) || 1;
  const r = (size - thickness) / 2;
  const cx = size / 2, cy = size / 2;
  const circ = 2 * Math.PI * r;
  let acc = 0;
  return (
    <svg width={size} height={size}>
      <circle cx={cx} cy={cy} r={r} stroke="var(--bg-3)" strokeWidth={thickness} fill="none"/>
      {data.map((d, i) => {
        const frac = d.value / total;
        const len = frac * circ;
        const dashArray = `${len} ${circ - len}`;
        const dashOffset = -acc * circ;
        acc += frac;
        return (
          <circle key={i}
            cx={cx} cy={cy} r={r}
            stroke={d.color} strokeWidth={thickness} fill="none"
            strokeDasharray={dashArray} strokeDashoffset={dashOffset}
            transform={`rotate(-90 ${cx} ${cy})`}
            strokeLinecap="butt"
            onMouseEnter={() => onHover && onHover(d)}
          />
        );
      })}
    </svg>
  );
}

function BarChart({ data, height = 120, labels = true }) {
  // data: [{label, income, expense}]
  const max = Math.max(1, ...data.flatMap(d => [d.income, d.expense]));
  const barW = 12, gap = 3, groupW = barW * 2 + gap;
  const chartW = data.length * (groupW + 20);
  return (
    <svg width="100%" viewBox={`0 0 ${chartW} ${height + 20}`} preserveAspectRatio="none" style={{ display: 'block' }}>
      {/* gridlines */}
      {[0, 0.25, 0.5, 0.75, 1].map(t => (
        <line key={t} x1="0" x2={chartW} y1={height * (1 - t)} y2={height * (1 - t)}
              stroke="rgba(255,255,255,0.04)" strokeDasharray={t === 0 || t === 1 ? '' : '2 3'}/>
      ))}
      {data.map((d, i) => {
        const ih = (d.income / max) * height;
        const eh = (d.expense / max) * height;
        const x = i * (groupW + 20) + 10;
        return (
          <g key={i}>
            <rect x={x} y={height - ih} width={barW} height={ih} fill="var(--green)" opacity="0.85" rx="1"/>
            <rect x={x + barW + gap} y={height - eh} width={barW} height={eh} fill="var(--red)" opacity="0.75" rx="1"/>
            {labels && <text x={x + barW + gap/2} y={height + 14} textAnchor="middle"
                             fontSize="10" fill="var(--text-3)" fontFamily="var(--ff-mono)">{d.label}</text>}
          </g>
        );
      })}
    </svg>
  );
}

// Corner brackets overlay (HUD)
function HUDBrackets({ color = 'rgba(59,130,246,0.45)', size = 10, inset = -1 }) {
  const s = { position: 'absolute', width: size, height: size, borderColor: color, pointerEvents: 'none' };
  return (
    <>
      <div style={{ ...s, top: inset, left: inset, borderTop: '1px solid', borderLeft: '1px solid' }}/>
      <div style={{ ...s, top: inset, right: inset, borderTop: '1px solid', borderRight: '1px solid' }}/>
      <div style={{ ...s, bottom: inset, left: inset, borderBottom: '1px solid', borderLeft: '1px solid' }}/>
      <div style={{ ...s, bottom: inset, right: inset, borderBottom: '1px solid', borderRight: '1px solid' }}/>
    </>
  );
}

// Horizontal progress bar
function Progress({ value, max = 100, color, label, showPct = true, height = 6 }) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));
  return (
    <div>
      {label && (
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
          <span className="t-12" style={{ color: 'var(--text-2)' }}>{label}</span>
          {showPct && <span className="mono t-12" style={{ color: 'var(--text-1)' }}>{pct.toFixed(0)}%</span>}
        </div>
      )}
      <div className="bar" style={{ height }}>
        <i style={{ width: pct + '%', background: color || 'var(--blue)' }}/>
      </div>
    </div>
  );
}

// Status pill with dot
function StatusPill({ status }) {
  const map = {
    todo:        { label: 'To Do',       cls: 'pill-todo',    dot: 'dot-todo' },
    in_progress: { label: 'In Progress', cls: 'pill-doing',   dot: 'dot-doing' },
    done:        { label: 'Done',        cls: 'pill-done',    dot: 'dot-done' },
    blocked:     { label: 'Blocked',     cls: 'pill-blocked', dot: 'dot-blocked' },
    not_started: { label: 'Not Started', cls: 'pill-todo',    dot: 'dot-todo' },
    completed:   { label: 'Completed',   cls: 'pill-done',    dot: 'dot-done' },
    paused:      { label: 'Paused',      cls: 'pill-blocked', dot: 'dot-blocked' },
    to_read:     { label: 'To Read',     cls: 'pill-todo',    dot: 'dot-todo' },
  };
  const s = map[status] || { label: status, cls: 'pill', dot: 'dot-todo' };
  return (
    <span className={'pill ' + s.cls}>
      <span className={'dot ' + s.dot}/> {s.label}
    </span>
  );
}

function PriorityPill({ priority }) {
  return <span className={'pill pill-' + priority}>{priority.toUpperCase()}</span>;
}

// Stream: a live telemetry-style scrolling text
function TelemetryStream({ lines }) {
  const [tick, setTick] = React.useState(0);
  React.useEffect(() => {
    const t = setInterval(() => setTick(x => x + 1), 2400);
    return () => clearInterval(t);
  }, []);
  return (
    <div style={{ fontFamily: 'var(--ff-mono)', fontSize: 10, color: 'var(--text-3)', lineHeight: 1.6, overflow: 'hidden', maxHeight: 56 }}>
      {lines.slice(tick % lines.length).concat(lines.slice(0, tick % lines.length)).slice(0, 3).map((l, i) => (
        <div key={tick + '-' + i} style={{ opacity: 1 - i * 0.35 }}>
          <span style={{ color: 'var(--cyan)' }}>›</span> {l}
        </div>
      ))}
    </div>
  );
}

// useLocal: persistent state
function useLocal(key, initial) {
  const [v, setV] = React.useState(() => {
    try {
      const raw = localStorage.getItem(key);
      return raw !== null ? JSON.parse(raw) : initial;
    } catch { return initial; }
  });
  React.useEffect(() => {
    try { localStorage.setItem(key, JSON.stringify(v)); } catch {}
  }, [key, v]);
  return [v, setV];
}

// Format helpers
const fmtEUR = (n) => (n < 0 ? '-' : '') + '€' + Math.abs(n).toLocaleString('fr-FR', { minimumFractionDigits: Math.abs(n) < 10 ? 2 : 0, maximumFractionDigits: 2 });
const fmtEURshort = (n) => '€' + (Math.abs(n) >= 1000 ? (n/1000).toFixed(1) + 'k' : Math.round(n));
const fmtDate = (d) => {
  if (!d) return '';
  const dt = typeof d === 'string' ? new Date(d) : d;
  return dt.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
};
const fmtDateFull = (d) => {
  if (!d) return '';
  const dt = typeof d === 'string' ? new Date(d) : d;
  return dt.toLocaleDateString('en-GB', { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' });
};
const relativeDay = (dateStr) => {
  if (!dateStr) return '';
  const now = new Date(); now.setHours(0,0,0,0);
  const d = new Date(dateStr); d.setHours(0,0,0,0);
  const diff = Math.round((d - now) / (1000 * 60 * 60 * 24));
  if (diff === 0) return 'Today';
  if (diff === 1) return 'Tomorrow';
  if (diff === -1) return 'Yesterday';
  if (diff < 0) return Math.abs(diff) + 'd overdue';
  if (diff < 7) return 'in ' + diff + 'd';
  return fmtDate(dateStr);
};

// Tag color mapping
const TAG_COLORS = {
  'Rent/Mortgage': '#EF4444',
  'Utilities':     '#F59E0B',
  'Groceries':     '#22C55E',
  'Dining Out':    '#F97316',
  'Healthcare':    '#06B6D4',
  'Transportation':'#3B82F6',
  'Insurance':     '#A78BFA',
  'Entertainment': '#EC4899',
  'Retail':        '#14B8A6',
  'Shopping':      '#8B5CF6',
  'Trading':       '#F59E0B',
  'Tabac':         '#64748B',
  'Iphone':        '#E4E4E7',
  'once':          '#71717A',
};
const tagColor = (t) => TAG_COLORS[t] || '#71717A';

const CATEGORY_COLORS = {
  Admin: '#A78BFA', Health: '#22C55E', Finance: '#F59E0B',
  Social: '#EC4899', Home: '#06B6D4', 'Side Project': '#3B82F6',
};

Object.assign(window, {
  Sparkline, BarMini, Donut, BarChart, HUDBrackets, Progress,
  StatusPill, PriorityPill, TelemetryStream, useLocal,
  fmtEUR, fmtEURshort, fmtDate, fmtDateFull, relativeDay,
  TAG_COLORS, tagColor, CATEGORY_COLORS,
});
