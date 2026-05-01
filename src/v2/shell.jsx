// Desktop shell — 240px sidebar, generous whitespace
function Sidebar({ route, onRoute, onQuickAdd, theme, onToggleTheme, collapsed, onToggleCollapse }) {
  const sections = [
    {
      label: 'Workspace',
      items: [
        { id: 'home', label: 'Home', icon: 'home' },
        { id: 'tasks', label: 'Tasks', icon: 'tasks' },
      ],
    },
    {
      label: 'Money',
      items: [
        { id: 'finance', label: 'Finance', icon: 'wallet' },
        { id: 'finance/family', label: 'Family', icon: 'users', sub: true },
      ],
    },
    {
      label: 'Growth',
      items: [
        { id: 'learn', label: 'Learn', icon: 'book' },
      ],
    },
  ];
  const W = collapsed ? 68 : 240;
  return (
    <aside style={{
      width: W,
      flexShrink: 0,
      height: '100vh',
      background: 'var(--bg-secondary)',
      borderRight: '1px solid var(--border-soft)',
      display: 'flex',
      flexDirection: 'column',
      padding: collapsed ? '24px 10px' : '24px 18px',
      transition: 'width 0.25s var(--ease), padding 0.25s var(--ease)',
      position: 'sticky', top: 0,
    }}>
      {/* Brand */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: collapsed ? '0 4px' : '0 6px', marginBottom: 36 }}>
        <div style={{
          width: 32, height: 32, borderRadius: 8,
          background: 'var(--accent)',
          display: 'grid', placeItems: 'center',
          color: '#fff',
          fontFamily: 'Playfair Display, serif',
          fontSize: 18, fontWeight: 600, letterSpacing: '-0.02em',
          flexShrink: 0,
        }}>A</div>
        {!collapsed && (
          <div>
            <div className="serif" style={{ fontSize: 16, fontWeight: 600, letterSpacing: '-0.01em', color: 'var(--text-primary)', lineHeight: 1 }}>Atelier</div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>Ahmad's Life OS</div>
          </div>
        )}
      </div>

      {/* Quick action */}
      {!collapsed ? (
        <button onClick={onQuickAdd} style={{
          display: 'flex', alignItems: 'center', gap: 10,
          padding: '10px 14px',
          background: 'var(--bg-raised)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-md)',
          color: 'var(--text-secondary)',
          fontSize: 13, fontWeight: 400,
          cursor: 'pointer',
          marginBottom: 28,
          textAlign: 'left',
        }}>
          <Icon name="plus" size={14} />
          <span>Quick add</span>
          <span style={{ marginLeft: 'auto', fontSize: 11, color: 'var(--text-muted)', fontFamily: 'IBM Plex Mono, monospace' }}>N</span>
        </button>
      ) : (
        <button onClick={onQuickAdd} title="Quick add" style={{
          display: 'grid', placeItems: 'center',
          width: 40, height: 40, margin: '0 auto 28px',
          background: 'var(--bg-raised)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-md)',
          color: 'var(--text-secondary)',
        }}>
          <Icon name="plus" size={16} />
        </button>
      )}

      {/* Nav */}
      <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 22, overflow: 'auto' }}>
        {sections.map((s, i) => (
          <div key={i}>
            {!collapsed && <div style={{ padding: '0 10px', marginBottom: 8 }} className="caps">{s.label}</div>}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {s.items.map(it => {
                const active = route === it.id || (it.id === 'finance' && route.startsWith('finance') && route !== 'finance/family');
                return (
                  <button key={it.id} onClick={() => onRoute(it.id)} title={collapsed ? it.label : undefined} style={{
                    display: 'flex', alignItems: 'center',
                    gap: 12,
                    padding: collapsed ? '10px' : '9px 12px',
                    paddingLeft: collapsed ? '10px' : (it.sub ? 24 : 12),
                    justifyContent: collapsed ? 'center' : 'flex-start',
                    borderRadius: 'var(--radius-md)',
                    background: active ? 'var(--bg-tertiary)' : 'transparent',
                    color: active ? 'var(--text-primary)' : 'var(--text-secondary)',
                    fontSize: 14, fontWeight: active ? 500 : 400,
                    position: 'relative',
                    transition: 'all 0.15s var(--ease)',
                    textAlign: 'left',
                  }}>
                    {active && !collapsed && <span style={{ position: 'absolute', left: -4, top: 8, bottom: 8, width: 2, background: 'var(--accent)', borderRadius: 2 }} />}
                    <Icon name={it.icon} size={collapsed ? 18 : 16} />
                    {!collapsed && <span>{it.label}</span>}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, paddingTop: 16, borderTop: '1px solid var(--border-soft)' }}>
        <button onClick={onToggleTheme} title="Toggle theme" style={{
          display: 'grid', placeItems: 'center',
          width: 36, height: 36,
          borderRadius: 'var(--radius-md)',
          color: 'var(--text-secondary)',
          transition: 'all 0.15s var(--ease)',
        }} onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-tertiary)'}
           onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
          <Icon name={theme === 'light' ? 'moon' : 'sun'} size={16} />
        </button>
        {!collapsed && (
          <>
            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{theme === 'light' ? 'Light' : 'Dark'}</div>
            <button onClick={onToggleCollapse} title="Collapse" style={{
              marginLeft: 'auto',
              display: 'grid', placeItems: 'center',
              width: 28, height: 28,
              borderRadius: 'var(--radius-sm)',
              color: 'var(--text-muted)',
            }}><Icon name="chevronRight" size={14} style={{ transform: 'rotate(180deg)' }} /></button>
          </>
        )}
        {collapsed && (
          <button onClick={onToggleCollapse} title="Expand" style={{
            display: 'grid', placeItems: 'center',
            width: 36, height: 36,
            borderRadius: 'var(--radius-md)',
            color: 'var(--text-muted)',
          }}><Icon name="chevronRight" size={14} /></button>
        )}
      </div>
    </aside>
  );
}

function PageContainer({ children, maxWidth = 1280 }) {
  return (
    <div style={{
      flex: 1,
      minWidth: 0,
      padding: 'var(--space-2xl)',
      overflow: 'auto',
      minHeight: '100vh',
    }}>
      <div style={{ maxWidth, margin: '0 auto' }}>
        {children}
      </div>
    </div>
  );
}

Object.assign(window, { Sidebar, PageContainer });
