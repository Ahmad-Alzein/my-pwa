// Sidebar — left nav with active gutter mark
function Sidebar({ active, onNav }) {
  const items = [
    { id: 'home', label: 'Today', icon: 'home' },
    { id: 'tasks', label: 'Tasks', icon: 'tasks' },
    { id: 'finance', label: 'Finance', icon: 'wallet', sub: [
      { id: 'finance', label: 'Overview' },
      { id: 'finance/statements', label: 'Statements' },
    ]},
    { id: 'family', label: 'Family', icon: 'users' },
    { id: 'learn', label: 'Library', icon: 'book' },
  ];
  return (
    <aside style={{ width: 248, flexShrink: 0, height: '100vh', position: 'sticky', top: 0,
      background: 'var(--bg-secondary)', borderRight: '1px solid var(--border-soft)',
      padding: '28px 16px', display: 'flex', flexDirection: 'column', gap: 4 }}>
      <div style={{ padding: '0 12px 24px', display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--accent)', color: '#fff',
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-serif)',
          fontSize: 18, fontWeight: 500, fontStyle: 'italic' }}>L</div>
        <div>
          <div className="serif" style={{ fontSize: 15, fontWeight: 500, letterSpacing: '-0.01em' }}>Life OS</div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Atelier</div>
        </div>
      </div>
      {items.map(it => {
        const isActive = active === it.id || active.startsWith(it.id + '/');
        return (
          <div key={it.id}>
            <button onClick={() => onNav(it.id)} style={{
              width: '100%', display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px',
              borderRadius: 'var(--radius-md)', position: 'relative', transition: 'all 0.15s var(--ease)',
              background: isActive ? 'var(--accent-soft)' : 'transparent',
              color: isActive ? 'var(--accent)' : 'var(--text-secondary)',
              fontSize: 14, fontWeight: isActive ? 500 : 400, textAlign: 'left' }}>
              {isActive && <span style={{ position: 'absolute', left: 0, top: 8, bottom: 8, width: 2, background: 'var(--accent)', borderRadius: 2 }} />}
              <Icon name={it.icon} size={18} stroke={1.5} />
              <span>{it.label}</span>
            </button>
            {isActive && it.sub && (
              <div style={{ paddingLeft: 38, marginTop: 2, marginBottom: 6, display: 'flex', flexDirection: 'column', gap: 1 }}>
                {it.sub.map(s => {
                  const sa = active === s.id;
                  return <button key={s.id} onClick={(e) => { e.stopPropagation(); onNav(s.id); }} style={{
                    textAlign: 'left', padding: '6px 10px', fontSize: 13, borderRadius: 6,
                    color: sa ? 'var(--text-primary)' : 'var(--text-secondary)',
                    background: sa ? 'var(--bg-tertiary)' : 'transparent',
                    fontWeight: sa ? 500 : 400 }}>{s.label}</button>;
                })}
              </div>
            )}
          </div>
        );
      })}
      <div style={{ marginTop: 'auto', padding: '12px', borderTop: '1px solid var(--border-soft)', display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--accent-soft)', color: 'var(--accent)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 500 }}>AZ</div>
        <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Ahmad</div>
      </div>
    </aside>
  );
}
window.Sidebar = Sidebar;
