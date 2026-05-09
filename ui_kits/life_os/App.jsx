function App() {
  const [route, setRoute] = React.useState('home');
  const main = (route === 'finance/statements' ? 'finance' : route);
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-primary)' }}>
      <Sidebar active={route} onNav={setRoute} />
      <main style={{ flex: 1, padding: '40px 56px', maxWidth: 1280, width: '100%' }}>
        {main === 'home' && <Home />}
        {main === 'finance' && <Finance subroute={route === 'finance/statements' ? 'statements' : 'overview'} onSubroute={setRoute} />}
        {main === 'family' && <Family />}
        {main === 'tasks' && <Tasks />}
        {main === 'learn' && <Library />}
      </main>
    </div>
  );
}

function Placeholder({ title }) {
  return (
    <div className="fade-in">
      <PageTitle eyebrow="Life OS">{title}</PageTitle>
      <Card raised style={{ padding: 60, textAlign: 'center' }}>
        <Caps style={{ marginBottom: 10 }}>Existing surface</Caps>
        <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: 14, maxWidth: 460, marginInline: 'auto', lineHeight: 1.6 }}>
          This module exists in the v2 codebase and is preserved unchanged. The new design system applies the navy + paper palette across it; no behaviour changes were requested for this surface.
        </p>
      </Card>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
