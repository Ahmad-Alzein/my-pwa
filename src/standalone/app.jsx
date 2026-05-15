// Bottom nav for mobile
function BottomNav({ active, onNav }) {
  const items = [
    { id: 'home',    label: 'Today',   icon: 'home' },
    { id: 'tasks',   label: 'Tasks',   icon: 'tasks' },
    { id: 'finance', label: 'Finance', icon: 'wallet' },
    { id: 'family',  label: 'Family',  icon: 'users' },
    { id: 'library', label: 'Library', icon: 'book' },
  ];
  return (
    <nav className="bottom-nav">
      {items.map(it => {
        const isActive = active === it.id || active.startsWith(it.id + '/');
        return (
          <button key={it.id} onClick={() => onNav(it.id)} style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
            padding: '0 12px', color: isActive ? 'var(--accent)' : 'var(--text-muted)',
            fontSize: 10, fontWeight: isActive ? 500 : 400,
            textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            <Icon name={it.icon} size={20} stroke={isActive ? 2 : 1.5} />
            <span>{it.label}</span>
          </button>
        );
      })}
    </nav>
  );
}

// App — state manager + router
const STORAGE_KEY = 'lifeos.atelier.v1';

function getInitial() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch(e) {}
  return {
    tasks: SEED_TASKS,
    expenses: SEED_EXPENSES,
    income: SEED_INCOME,
    family: {
      tx: SEED_FAMILY,
      notes: SEED_FAMILY_NOTES,
      snapshots: SEED_SNAPSHOTS,
    },
  };
}

function App() {
  const [route, setRoute] = React.useState('home');
  const [state, setState] = React.useState(getInitial);

  React.useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch(e) {}
  }, [state]);

  const setTasks    = (tasks)    => setState(s => ({ ...s, tasks }));
  const setExpenses = (expenses) => setState(s => ({ ...s, expenses }));
  const setIncome   = (income)   => setState(s => ({ ...s, income }));
  const setFamilyTx    = (tx)    => setState(s => ({ ...s, family: { ...s.family, tx } }));
  const setFamilyNotes = (notes) => setState(s => ({ ...s, family: { ...s.family, notes } }));

  const main = route === 'finance/statements' ? 'finance' : route;

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-primary)' }}>
      <Sidebar active={main} onNav={setRoute} />
      <main className="main-content" style={{ flex: 1, padding: '40px 56px', maxWidth: 1280, overflow: 'auto', minHeight: '100vh' }}>
        {main === 'home' && (
          <Home tasks={state.tasks} expenses={state.expenses} income={state.income} family={state.family} />
        )}
        {main === 'finance' && (
          <Finance
            subroute={route === 'finance/statements' ? 'statements' : 'overview'}
            onSubroute={setRoute}
            expenses={state.expenses} setExpenses={setExpenses}
            income={state.income} setIncome={setIncome}
          />
        )}
        {main === 'family' && (
          <Family
            tx={state.family.tx} setTx={setFamilyTx}
            notes={state.family.notes} setNotes={setFamilyNotes}
            snapshots={state.family.snapshots}
          />
        )}
        {main === 'tasks' && (
          <Tasks tasks={state.tasks} setTasks={setTasks} />
        )}
        {main === 'library' && <Library />}
      </main>
      <BottomNav active={main} onNav={setRoute} />
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
