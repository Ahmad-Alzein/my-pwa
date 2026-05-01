// Top-level app — shell, routing, state, reducer

function reducer(state, action) {
  switch (action.type) {
    case 'toggle_task': {
      const tasks = state.tasks.map(t => t.id === action.id ? { ...t, status: t.status === 'done' ? 'todo' : 'done' } : t);
      const t = state.tasks.find(x => x.id === action.id);
      const activity = [{ id: 'a' + Date.now(), module: 'tasks', action: t.status === 'done' ? 'updated' : 'completed',
        summary: (t.status === 'done' ? 'Reopened: ' : 'Completed task: ') + t.title, when: new Date().toISOString() }, ...state.activity].slice(0, 20);
      return { ...state, tasks, activity };
    }
    case 'set_task_status': {
      const tasks = state.tasks.map(t => t.id === action.id ? { ...t, status: action.status } : t);
      return { ...state, tasks };
    }
    case 'add_task': {
      const activity = [{ id: 'a' + Date.now(), module: 'tasks', action: 'created', summary: 'New task: ' + action.task.title, when: new Date().toISOString() }, ...state.activity].slice(0, 20);
      return { ...state, tasks: [action.task, ...state.tasks], activity };
    }
    case 'add_expense': {
      const activity = [{ id: 'a' + Date.now(), module: 'expenses', action: 'created', summary: '+ ' + action.expense.source + ' — ' + action.expense.amount + '€ (' + action.expense.tag + ')', when: new Date().toISOString() }, ...state.activity].slice(0, 20);
      return { ...state, expenses: [action.expense, ...state.expenses], activity };
    }
    case 'delete_expense': {
      return { ...state, expenses: state.expenses.filter(e => e.id !== action.id) };
    }
    case 'add_income': {
      return { ...state, income: [action.income, ...state.income] };
    }
    case 'add_deposit': {
      return { ...state, savings_tx: [action.tx, ...state.savings_tx] };
    }
    case 'add_session': {
      const learning = state.learning.map(d => d.id === action.session.domain_id
        ? { ...d, sessions_minutes_per_day: [...(d.sessions_minutes_per_day || []).slice(1), (d.sessions_minutes_per_day?.slice(-1)[0] || 0) + action.session.duration_minutes] }
        : d);
      const dom = state.learning.find(d => d.id === action.session.domain_id);
      const activity = [{ id: 'a' + Date.now(), module: 'learning', action: 'updated', summary: 'Learning session: ' + (dom?.title || '') + ' — ' + action.session.duration_minutes + 'min', when: new Date().toISOString() }, ...state.activity].slice(0, 20);
      return { ...state, learning, activity };
    }
    case 'toggle_milestone': {
      const learning = state.learning.map(d => d.id === action.domainId
        ? { ...d, milestones: d.milestones.map((m, i) => i === action.index ? { ...m, done: !m.done } : m) }
        : d);
      return { ...state, learning };
    }
    default: return state;
  }
}

function App() {
  const [state, dispatch] = React.useReducer(reducer, null, () => {
    try {
      const raw = localStorage.getItem('lifeos_state_v1');
      if (raw) return JSON.parse(raw);
    } catch {}
    return {
      tasks: SEED_TASKS,
      expenses: SEED_EXPENSES,
      income: SEED_INCOME,
      savings_accounts: SEED_SAVINGS_ACCOUNTS,
      savings_tx: SEED_SAVINGS_TX,
      learning: SEED_LEARNING,
      activity: SEED_ACTIVITY,
    };
  });

  React.useEffect(() => { try { localStorage.setItem('lifeos_state_v1', JSON.stringify(state)); } catch {} }, [state]);

  const [route, setRoute] = useLocal('route', 'home');
  const [mobileScreen, setMobileScreen] = useLocal('m_screen', 'home');
  const [quick, setQuick] = React.useState(null);
  const [mobileSheet, setMobileSheet] = React.useState(null);

  const [tweaks, setTweaks] = React.useState(TWEAK_DEFAULTS);
  const [tweaksOpen, setTweaksOpen] = React.useState(false);

  React.useEffect(() => { applyTweaks(tweaks); }, [tweaks]);

  // Edit mode hookup
  React.useEffect(() => {
    const onMsg = (e) => {
      if (e.data?.type === '__activate_edit_mode') setTweaksOpen(true);
      if (e.data?.type === '__deactivate_edit_mode') setTweaksOpen(false);
    };
    window.addEventListener('message', onMsg);
    window.parent.postMessage({ type: '__edit_mode_available' }, '*');
    return () => window.removeEventListener('message', onMsg);
  }, []);

  // Keyboard shortcuts
  React.useEffect(() => {
    const onKey = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      if (e.key === 'n') { e.preventDefault(); setQuick('task'); }
      if (e.key === 'e') { e.preventDefault(); setQuick('expense'); }
      if (e.metaKey && e.key === 'k') { e.preventDefault(); /* cmd palette */ }
      if (e.key === '1') setRoute('home');
      if (e.key === '2') setRoute('tasks');
      if (e.key === '3') setRoute('finance');
      if (e.key === '4') setRoute('learn');
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const openQuick = (kind) => {
    if (kind === 'session') setQuick('session');
    else setQuick(kind);
  };
  const openMobileSheet = (kind) => {
    if (kind === 'expense') setMobileSheet('expense');
    else setQuick(kind);
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', color: 'var(--text-1)' }} data-screen-label="01 Life OS">
      <Sidebar route={route} setRoute={setRoute} state={state}/>
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
        <TopHUD route={route} state={state}/>
        <div style={{ flex: 1, display: 'grid', gridTemplateColumns: tweaks.showMobileAlongside ? 'minmax(0, 1fr) auto' : '1fr', minHeight: 0 }}>
          <div style={{ minWidth: 0, overflow: 'auto' }}>
            {route === 'home' && <HomeView state={state} dispatch={dispatch} openQuick={openQuick}/>}
            {route === 'tasks' && <TasksView state={state} dispatch={dispatch} openQuick={openQuick}/>}
            {route === 'finance' && <FinanceView state={state} dispatch={dispatch} openQuick={openQuick}/>}
            {route === 'learn' && <LearnView state={state} dispatch={dispatch} openQuick={openQuick}/>}
          </div>
          {tweaks.showMobileAlongside && (
            <div style={{ borderLeft: '1px solid var(--border)', padding: '24px 20px 20px', background: 'linear-gradient(180deg, var(--bg-1), var(--bg-0))', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, minWidth: 440 }}>
              <div className="sec-label" style={{ alignSelf: 'flex-start' }}>COMPANION · IOS</div>
              <MobileShell state={state} dispatch={dispatch}
                screen={mobileScreen} setScreen={setMobileScreen}
                openQuick={openMobileSheet}/>
              {mobileSheet === 'expense' && (
                <div style={{ position: 'absolute' }}>
                  {/* Sheet is rendered inside IOSDevice scope by moving state */}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Desktop modals */}
      {quick === 'task' && <TaskQuickAdd onClose={() => setQuick(null)} onSave={t => dispatch({ type: 'add_task', task: t })}/>}
      {quick === 'expense' && <ExpenseQuickAdd onClose={() => setQuick(null)} onSave={e => dispatch({ type: 'add_expense', expense: e })}/>}
      {quick === 'income' && <TaskIncomeAdd onClose={() => setQuick(null)} onSave={i => dispatch({ type: 'add_income', income: i })}/>}
      {quick === 'deposit' && <DepositAdd state={state} onClose={() => setQuick(null)} onSave={tx => dispatch({ type: 'add_deposit', tx })}/>}
      {quick === 'session' && <SessionQuickAdd domains={state.learning} onClose={() => setQuick(null)} onSave={s => dispatch({ type: 'add_session', session: s })}/>}

      {/* Mobile sheet (stylistic — shows next to device) */}
      {mobileSheet === 'expense' && (
        <MobileSheetWrapper>
          <MobileExpenseSheet onClose={() => setMobileSheet(null)} onSave={e => dispatch({ type: 'add_expense', expense: e })}/>
        </MobileSheetWrapper>
      )}

      <TweaksPanel open={tweaksOpen} tweaks={tweaks} setTweaks={setTweaks}/>

      {/* Toggle for tweaks even without host */}
      <button onClick={() => setTweaksOpen(o => !o)}
        style={{ position: 'fixed', bottom: 16, left: 16, zIndex: 80,
          background: 'var(--bg-3)', border: '1px solid var(--border-2)', borderRadius: 6,
          padding: '6px 10px', color: 'var(--text-2)', fontSize: 11, fontFamily: 'var(--ff-mono)',
          display: 'flex', alignItems: 'center', gap: 6 }}>
        <Icon.Settings size={12}/> TWEAKS
      </button>
    </div>
  );
}

function MobileSheetWrapper({ children }) {
  // Floating overlay for mobile sheet — positions over the iOS device
  return <div style={{ position: 'fixed', right: 24, bottom: 24, width: 390, height: 844, pointerEvents: 'none', zIndex: 200 }}>
    <div style={{ position: 'relative', width: '100%', height: '100%', pointerEvents: 'auto' }}>
      {children}
    </div>
  </div>;
}

function Sidebar({ route, setRoute, state }) {
  const items = [
    { id: 'home', label: 'Home', Ic: Icon.Home, key: '1' },
    { id: 'tasks', label: 'Tasks', Ic: Icon.Tasks, key: '2', badge: state.tasks.filter(t => t.status !== 'done').length },
    { id: 'finance', label: 'Finance', Ic: Icon.Wallet, key: '3' },
    { id: 'learn', label: 'Learn', Ic: Icon.Book, key: '4' },
  ];
  return (
    <aside style={{
      width: 200, background: 'var(--bg-1)', borderRight: '1px solid var(--border)',
      display: 'flex', flexDirection: 'column', padding: 14, flex: '0 0 auto',
      position: 'sticky', top: 0, height: '100vh',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '4px 8px 20px', borderBottom: '1px solid var(--border)', marginBottom: 14 }}>
        <div style={{ width: 28, height: 28, borderRadius: 6, background: 'linear-gradient(135deg, var(--blue), var(--cyan))',
          display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000', fontWeight: 700, fontSize: 13, fontFamily: 'var(--ff-mono)' }}>A</div>
        <div>
          <div style={{ fontSize: 13, fontWeight: 600, letterSpacing: '-0.01em' }}>Life OS</div>
          <div className="mono t-10" style={{ color: 'var(--text-3)' }}>v0.1 · AHMAD</div>
        </div>
      </div>
      {items.map(i => {
        const active = route === i.id;
        return (
          <button key={i.id} onClick={() => setRoute(i.id)}
            style={{
              display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px',
              borderRadius: 6, marginBottom: 2, textAlign: 'left',
              background: active ? 'rgba(59,130,246,0.12)' : 'transparent',
              color: active ? 'var(--blue)' : 'var(--text-2)',
              borderLeft: active ? '2px solid var(--blue)' : '2px solid transparent',
            }}>
            <i.Ic size={15}/>
            <span className="t-13" style={{ flex: 1 }}>{i.label}</span>
            {i.badge > 0 && <span className="mono t-11" style={{ color: 'var(--text-3)' }}>{i.badge}</span>}
            <span className="mono t-10" style={{ color: 'var(--text-5)' }}>{i.key}</span>
          </button>
        );
      })}

      <div style={{ flex: 1 }}/>

      <div style={{ padding: 10, background: 'var(--bg-2)', borderRadius: 6, fontSize: 11 }}>
        <div className="sec-label" style={{ marginBottom: 6 }}>SYSTEM</div>
        <div className="mono" style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-3)', marginBottom: 2 }}>
          <span>sync</span><span style={{ color: 'var(--green)' }}><span className="live-dot">●</span> ok</span>
        </div>
        <div className="mono" style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-3)', marginBottom: 2 }}>
          <span>records</span><span style={{ color: 'var(--text-1)' }}>{state.tasks.length + state.expenses.length}</span>
        </div>
        <div className="mono" style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-3)' }}>
          <span>locale</span><span style={{ color: 'var(--text-1)' }}>fr · en</span>
        </div>
      </div>
    </aside>
  );
}

function TopHUD({ route, state }) {
  const [now, setNow] = React.useState(new Date());
  React.useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  const todayStr = iso(now);
  const overdue = state.tasks.filter(t => t.status !== 'done' && t.due_date && t.due_date < todayStr).length;
  const ym = todayStr.slice(0, 7);
  const spentToday = state.expenses.filter(e => e.date === todayStr).reduce((s, e) => s + e.amount, 0);
  const spentMonth = state.expenses.filter(e => e.date.startsWith(ym)).reduce((s, e) => s + e.amount, 0);
  return (
    <div style={{
      height: 42, background: 'var(--bg-1)', borderBottom: '1px solid var(--border)',
      display: 'flex', alignItems: 'center', padding: '0 16px', gap: 20, flex: '0 0 auto',
      fontSize: 11, fontFamily: 'var(--ff-mono)', color: 'var(--text-3)',
    }}>
      <span style={{ color: 'var(--green)' }}><span className="live-dot">●</span> LIVE</span>
      <span>{now.toLocaleTimeString('en-GB')} CEST</span>
      <span style={{ color: 'var(--text-5)' }}>│</span>
      <span>ROUTE /<span style={{ color: 'var(--text-1)' }}>{route}</span></span>
      <span style={{ color: 'var(--text-5)' }}>│</span>
      <span>TASKS · <span style={{ color: 'var(--text-1)' }}>{state.tasks.filter(t => t.status !== 'done').length}</span> open{overdue > 0 ? <> · <span style={{ color: 'var(--red)' }}>{overdue} overdue</span></> : null}</span>
      <span style={{ color: 'var(--text-5)' }}>│</span>
      <span>BURN · <span style={{ color: 'var(--red)' }}>{fmtEUR(spentToday)}</span> today / <span style={{ color: 'var(--text-1)' }}>{fmtEURshort(spentMonth)}</span> mtd</span>
      <span style={{ flex: 1 }}/>
      <span>⌘K palette</span>
      <span style={{ color: 'var(--text-5)' }}>│</span>
      <span><kbd style={kbd}>N</kbd> task <kbd style={kbd}>E</kbd> expense</span>
    </div>
  );
}
const kbd = { background: 'var(--bg-3)', border: '1px solid var(--border-2)', borderRadius: 3, padding: '1px 5px', margin: '0 3px', color: 'var(--text-2)' };

function TaskIncomeAdd({ onClose, onSave }) {
  const [amount, setAmount] = React.useState('');
  const [source, setSource] = React.useState('');
  const [tag, setTag] = React.useState('Salary');
  const [date, setDate] = React.useState(iso(new Date()));
  const submit = () => {
    const a = parseFloat(amount);
    if (!a || !source.trim()) return;
    onSave({ id: 'i' + Date.now(), amount: a, source, tag, date });
    onClose();
  };
  return (
    <ModalShell title="Log Income" onClose={onClose} footer={
      <>
        <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
        <button className="btn btn-primary" onClick={submit}>Log Income</button>
      </>
    }>
      <div style={{ display: 'grid', gridTemplateColumns: '160px 1fr', gap: 12, marginBottom: 12 }}>
        <Field label="Amount (€)">
          <input className="input mono" inputMode="decimal" value={amount} onChange={e => setAmount(e.target.value)}
            style={{ fontSize: 18, fontWeight: 600 }} placeholder="0.00"/>
        </Field>
        <Field label="Source">
          <input className="input" value={source} onChange={e => setSource(e.target.value)} placeholder="AcuSurgical, Freelance…"/>
        </Field>
      </div>
      <Field label="Tag">
        <Select value={tag} onChange={setTag} options={
          ['Salary','Bonus','Freelance','Dividends','Interest','Side Hustle','refund','saving'].map(t => ({ value: t, label: t }))
        }/>
      </Field>
      <Field label="Date"><input type="date" className="input mono" value={date} onChange={e => setDate(e.target.value)}/></Field>
    </ModalShell>
  );
}

function DepositAdd({ state, onClose, onSave }) {
  const [accountId, setAccountId] = React.useState(state.savings_accounts[0]?.id);
  const [amount, setAmount] = React.useState('');
  const [type, setType] = React.useState('deposit');
  const [notes, setNotes] = React.useState('');
  const submit = () => {
    const a = parseFloat(amount);
    if (!a) return;
    onSave({ id: 'st' + Date.now(), account_id: accountId, transaction_type: type, amount: a, date: iso(new Date()), notes });
    onClose();
  };
  return (
    <ModalShell title="Savings Transaction" onClose={onClose} footer={
      <>
        <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
        <button className="btn btn-primary" onClick={submit}>Record</button>
      </>
    }>
      <Field label="Account">
        <Select value={accountId} onChange={setAccountId} options={state.savings_accounts.map(a => ({ value: a.id, label: a.name }))}/>
      </Field>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <Field label="Type">
          <Select value={type} onChange={setType} options={[{value:'deposit',label:'Deposit'},{value:'withdrawal',label:'Withdrawal'}]}/>
        </Field>
        <Field label="Amount (€)">
          <input className="input mono" inputMode="decimal" value={amount} onChange={e => setAmount(e.target.value)} placeholder="0.00"/>
        </Field>
      </div>
      <Field label="Notes"><input className="input" value={notes} onChange={e => setNotes(e.target.value)}/></Field>
    </ModalShell>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App/>);
