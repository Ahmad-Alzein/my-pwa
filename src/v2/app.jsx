// Atelier app shell — wires everything together with localStorage persistence
const STORAGE_KEY = 'lifeos.v2.state';

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "accent": "terracotta",
  "showMobile": true,
  "grain": false,
  "collapsed": false
}/*EDITMODE-END*/;

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  return {
    tasks: window.SEED_TASKS || [],
    expenses: window.SEED_EXPENSES || [],
    income: window.SEED_INCOME || [],
    savings: window.SEED_SAVINGS || { accounts: [], transactions: [] },
    learning: window.SEED_LEARNING || [],
    family: {
      transactions: window.SEED_FAMILY_TX || [],
      snapshots: window.SEED_FAMILY_SNAPSHOTS || [],
      notes: window.SEED_FAMILY_NOTES || [],
    },
  };
}

function isMobileLikeViewport(breakpoint = 760) {
  const viewportWidth = window.visualViewport?.width || window.innerWidth || document.documentElement.clientWidth || 0;
  const narrowViewport = viewportWidth <= breakpoint;
  if (!window.matchMedia) return narrowViewport;

  const narrowLayout = window.matchMedia(`(max-width: ${breakpoint}px)`).matches;
  const coarsePhone = window.matchMedia('(pointer: coarse) and (max-width: 1024px)').matches;
  const touchPhone = window.matchMedia('(hover: none) and (max-width: 1024px)').matches;
  const handheldUA = /Android|iPhone|iPod|Mobile/i.test(navigator.userAgent);

  return narrowViewport || narrowLayout || coarsePhone || touchPhone || handheldUA;
}

function useIsMobileViewport(breakpoint = 760) {
  const getMatches = () => isMobileLikeViewport(breakpoint);
  const [isMobile, setIsMobile] = React.useState(getMatches);

  React.useEffect(() => {
    const queries = window.matchMedia ? [
      window.matchMedia(`(max-width: ${breakpoint}px)`),
      window.matchMedia('(pointer: coarse) and (max-width: 1024px)'),
      window.matchMedia('(hover: none) and (max-width: 1024px)'),
    ] : [];
    const onChange = () => setIsMobile(isMobileLikeViewport(breakpoint));
    onChange();
    queries.forEach((query) => {
      if (query.addEventListener) query.addEventListener('change', onChange);
      else query.addListener(onChange);
    });
    window.addEventListener('resize', onChange);
    window.addEventListener('orientationchange', onChange);
    window.visualViewport?.addEventListener('resize', onChange);
    return () => {
      queries.forEach((query) => {
        if (query.removeEventListener) query.removeEventListener('change', onChange);
        else query.removeListener(onChange);
      });
      window.removeEventListener('resize', onChange);
      window.removeEventListener('orientationchange', onChange);
      window.visualViewport?.removeEventListener('resize', onChange);
    };
  }, [breakpoint]);

  return isMobile;
}

function App() {
  const [state, setState] = React.useState(loadState);
  const [route, setRoute] = React.useState('home');
  const [theme, toggleTheme] = window.useTheme();
  const [settings, setSettings] = React.useState(TWEAK_DEFAULTS);
  const [tweaksOpen, setTweaksOpen] = React.useState(false);
  const [quickAddOpen, setQuickAddOpen] = React.useState(false);
  const isMobile = useIsMobileViewport();

  // Persist
  React.useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch (e) {}
  }, [state]);

  // Edit mode protocol
  React.useEffect(() => {
    const onMsg = (e) => {
      if (e.data?.type === '__activate_edit_mode') setTweaksOpen(true);
      if (e.data?.type === '__deactivate_edit_mode') setTweaksOpen(false);
    };
    window.addEventListener('message', onMsg);
    window.parent.postMessage({ type: '__edit_mode_available' }, '*');
    return () => window.removeEventListener('message', onMsg);
  }, []);

  // Route event from Home
  React.useEffect(() => {
    const onRoute = (e) => setRoute(e.detail);
    window.addEventListener('atelier:route', onRoute);
    return () => window.removeEventListener('atelier:route', onRoute);
  }, []);

  // Keyboard
  React.useEffect(() => {
    const onKey = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT') return;
      if (e.key === 'n' || e.key === 'N') { e.preventDefault(); setQuickAddOpen(true); }
      if (e.key === '1') setRoute('home');
      if (e.key === '2') setRoute('tasks');
      if (e.key === '3') setRoute('finance');
      if (e.key === '4') setRoute('finance/family');
      if (e.key === '5') setRoute('learn');
      if (e.key === 'd' || e.key === 'D') toggleTheme();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [toggleTheme]);

  // Re-apply accent on theme change
  React.useEffect(() => {
    const accents = {
      terracotta: { light: '#C17F59', dark: '#D4956F' },
      sage: { light: '#5A8A6C', dark: '#7AAF8E' },
      steel: { light: '#5B7FA5', dark: '#7A9FC5' },
      plum: { light: '#8E5C7A', dark: '#B083A0' },
    };
    const a = accents[settings.accent];
    if (a) {
      document.documentElement.style.setProperty('--accent', theme === 'dark' ? a.dark : a.light);
    }
  }, [theme, settings.accent]);

  if (isMobile) {
    return (
      <div style={{ minHeight: '100dvh', background: 'var(--bg-primary)' }} data-screen-label="atelier-mobile-shell">
        <Mobile state={state} setState={setState} theme={theme} onToggleTheme={toggleTheme} framed={false} />
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-primary)' }} data-screen-label="atelier-shell">
      <Sidebar
        route={route}
        onRoute={setRoute}
        onQuickAdd={() => setQuickAddOpen(true)}
        theme={theme}
        onToggleTheme={toggleTheme}
        collapsed={settings.collapsed}
        onToggleCollapse={() => setSettings(s => ({ ...s, collapsed: !s.collapsed }))}
      />
      <div style={{ flex: 1, minWidth: 0, display: 'flex' }}>
        <div style={{ flex: 1, minWidth: 0, position: 'relative' }}>
          {route === 'home' && <Home state={state} setState={setState} openModal={() => setQuickAddOpen(true)} />}
          {route === 'tasks' && <Tasks state={state} setState={setState} />}
          {(route === 'finance' || route.startsWith('finance/')) && <Finance state={state} setState={setState} route={route} onRoute={setRoute} />}
          {route === 'learn' && <Learn state={state} setState={setState} />}
        </div>

        {false && settings.showMobile && (
          <aside className="atelier-mobile-aside" style={{
            width: 440,
            flexShrink: 0,
            padding: '32px 24px',
            borderLeft: '1px solid var(--border-soft)',
            background: 'var(--bg-secondary)',
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            position: 'sticky', top: 0, height: '100vh', overflow: 'auto',
          }}>
            <Mobile state={state} setState={setState} theme={theme} onToggleTheme={toggleTheme} />
          </aside>
        )}
      </div>

      <TweaksPanel
        open={tweaksOpen}
        onClose={() => { setTweaksOpen(false); window.parent.postMessage({ type: '__edit_mode_dismissed' }, '*'); }}
        settings={settings}
        setSettings={setSettings}
      />

      <QuickTaskModal open={quickAddOpen} onClose={() => setQuickAddOpen(false)} onSave={(t) => setState(s => ({ ...s, tasks: [t, ...s.tasks] }))} />
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
