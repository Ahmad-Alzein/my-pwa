// Mobile views — iOS frames for Home, Tasks, Expense quick-add, Learning

function MobileShell({ state, dispatch, screen, setScreen, openQuick }) {
  return (
    <IOSDevice dark={true} width={390} height={844}>
      <div style={{
        height: '100%', background: 'var(--bg-0)',
        display: 'flex', flexDirection: 'column', color: 'var(--text-1)',
        fontFamily: 'var(--ff-sans)',
      }}>
        <div style={{ flex: 1, overflow: 'auto', paddingTop: 48 }}>
          {screen === 'home' && <MobileHome state={state} dispatch={dispatch} openQuick={openQuick}/>}
          {screen === 'tasks' && <MobileTasks state={state} dispatch={dispatch}/>}
          {screen === 'finance' && <MobileFinance state={state} dispatch={dispatch} openQuick={openQuick}/>}
          {screen === 'learn' && <MobileLearn state={state} dispatch={dispatch}/>}
        </div>
        <MobileFAB openQuick={openQuick} screen={screen}/>
        <MobileTabBar screen={screen} setScreen={setScreen}/>
      </div>
    </IOSDevice>
  );
}

function MobileTabBar({ screen, setScreen }) {
  const tabs = [
    { id: 'home', label: 'Home', Ic: Icon.Home },
    { id: 'tasks', label: 'Tasks', Ic: Icon.Tasks },
    { id: 'finance', label: 'Finance', Ic: Icon.Wallet },
    { id: 'learn', label: 'Learn', Ic: Icon.Book },
  ];
  return (
    <div style={{
      display: 'flex', justifyContent: 'space-around', alignItems: 'center',
      padding: '8px 0 30px', background: 'rgba(10,10,15,0.95)',
      backdropFilter: 'blur(16px)', borderTop: '1px solid var(--border)',
    }}>
      {tabs.map(t => (
        <button key={t.id} onClick={() => setScreen(t.id)}
          style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
            color: screen === t.id ? 'var(--blue)' : 'var(--text-3)', padding: '6px 12px',
          }}>
          <t.Ic size={22}/>
          <span className="t-10" style={{ fontWeight: 500 }}>{t.label}</span>
        </button>
      ))}
    </div>
  );
}

function MobileFAB({ openQuick, screen }) {
  const action = screen === 'tasks' ? 'task' : screen === 'learn' ? 'session' : 'expense';
  const label = { task: 'Task', expense: 'Expense', session: 'Session' }[action];
  return (
    <button onClick={() => openQuick(action)}
      style={{
        position: 'absolute', bottom: 90, right: 18,
        width: 56, height: 56, borderRadius: 28,
        background: 'var(--blue)', color: 'white',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: '0 8px 24px rgba(59,130,246,0.4), 0 0 0 1px rgba(59,130,246,0.5)',
        zIndex: 30,
      }} title={'+ ' + label}>
      <Icon.Plus size={22} strokeWidth={2.5}/>
    </button>
  );
}

function MobileHome({ state, dispatch, openQuick }) {
  const todayStr = iso(new Date());
  const todayTasks = state.tasks.filter(t => t.status !== 'done' && (t.due_date === todayStr || t.due_date < todayStr))
    .sort((a, b) => a.priority.localeCompare(b.priority)).slice(0, 3);
  const ym = todayStr.slice(0, 7);
  const monthExp = state.expenses.filter(e => e.date.startsWith(ym)).reduce((s, e) => s + e.amount, 0);
  const monthInc = state.income.filter(e => e.date.startsWith(ym)).reduce((s, e) => s + e.amount, 0);
  const net = monthInc - monthExp;
  const now = new Date();
  const greeting = now.getHours() < 12 ? 'Good morning' : now.getHours() < 18 ? 'Good afternoon' : 'Bonsoir';

  return (
    <div style={{ padding: '8px 16px 12px' }}>
      <div className="sec-label" style={{ marginBottom: 4 }}>{fmtDateFull(now).toUpperCase()}</div>
      <h1 style={{ fontSize: 28, margin: '6px 0 4px', fontWeight: 600, letterSpacing: '-0.02em' }}>
        {greeting}, Ahmad<span style={{ color: 'var(--cyan)' }}>.</span>
      </h1>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, margin: '14px 0' }}>
        <div className="card hud card-tight">
          <HUDBrackets/>
          <div className="sec-label">NET · MONTH</div>
          <div className="mono" style={{ fontSize: 20, fontWeight: 600, color: net >= 0 ? 'var(--green)' : 'var(--red)', marginTop: 6 }}>{fmtEUR(net)}</div>
          <div className="mono t-11" style={{ color: 'var(--text-3)', marginTop: 2 }}>{fmtEURshort(monthExp)} out</div>
        </div>
        <div className="card hud card-tight">
          <HUDBrackets/>
          <div className="sec-label">OPEN</div>
          <div className="mono" style={{ fontSize: 20, fontWeight: 600, marginTop: 6 }}>{state.tasks.filter(t => t.status !== 'done').length}</div>
          <div className="mono t-11" style={{ color: 'var(--text-3)', marginTop: 2 }}>{todayTasks.length} due today</div>
        </div>
      </div>

      <div className="sec-label" style={{ margin: '12px 0 8px' }}>TODAY FOCUS</div>
      <div className="card hud" style={{ padding: 12 }}>
        <HUDBrackets/>
        {todayTasks.length === 0 && <div className="t-12" style={{ color: 'var(--text-3)', padding: '8px 0' }}>Clear. Breathe.</div>}
        {todayTasks.map((t, i) => (
          <div key={t.id} style={{ display: 'flex', gap: 10, alignItems: 'center', padding: '8px 0', borderBottom: i < todayTasks.length - 1 ? '1px solid var(--border)' : 0 }}>
            <button onClick={() => dispatch({ type: 'toggle_task', id: t.id })}
              style={{ width: 18, height: 18, borderRadius: 4, border: '1.5px solid var(--border-2)', flex: '0 0 auto' }}/>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div className="t-13" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{t.title}</div>
              <div style={{ display: 'flex', gap: 6, marginTop: 2 }}>
                <PriorityPill priority={t.priority}/>
                {t.jira_ref && <span className="mono t-11" style={{ color: 'var(--cyan)' }}>{t.jira_ref}</span>}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="sec-label" style={{ margin: '14px 0 8px' }}>QUICK LOG</div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
        <QuickTile icon={<Icon.Wallet size={16}/>} label="Expense" color="var(--red)" onClick={() => openQuick('expense')}/>
        <QuickTile icon={<Icon.Check size={16}/>} label="Task" color="var(--blue)" onClick={() => openQuick('task')}/>
        <QuickTile icon={<Icon.Clock size={16}/>} label="Session" color="var(--amber)" onClick={() => openQuick('session')}/>
      </div>

      <div className="sec-label" style={{ margin: '14px 0 8px' }}><span className="live-dot" style={{ color: 'var(--green)' }}>●</span> RECENT</div>
      <div className="card hud" style={{ padding: 12 }}>
        <HUDBrackets/>
        {state.activity.slice(0, 4).map(a => <ActivityRow key={a.id} a={a}/>)}
      </div>
    </div>
  );
}

function QuickTile({ icon, label, color, onClick }) {
  return (
    <button onClick={onClick} className="card hud" style={{ padding: 12, textAlign: 'center', color }}>
      <HUDBrackets/>
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 4 }}>{icon}</div>
      <div className="t-12" style={{ color: 'var(--text-1)' }}>{label}</div>
    </button>
  );
}

function MobileTasks({ state, dispatch }) {
  const [tab, setTab] = React.useState('work');
  const todayStr = iso(new Date());
  const tasks = state.tasks.filter(t => t.type === tab && t.status !== 'done')
    .sort((a, b) => a.priority.localeCompare(b.priority));
  return (
    <div style={{ padding: '8px 16px 12px' }}>
      <h1 style={{ fontSize: 24, margin: '6px 0', fontWeight: 600 }}>Tasks</h1>
      <div style={{ display: 'flex', gap: 4, background: 'var(--bg-3)', padding: 3, borderRadius: 8, marginBottom: 14 }}>
        {[{v:'work',l:'Work'},{v:'personal',l:'Personal'}].map(t => (
          <button key={t.v} onClick={() => setTab(t.v)}
            style={{ flex: 1, padding: 8, borderRadius: 6, fontSize: 13, fontWeight: 500,
              background: tab === t.v ? 'var(--bg-1)' : 'transparent',
              color: tab === t.v ? 'var(--text-0)' : 'var(--text-3)' }}>{t.l}</button>
        ))}
      </div>
      <div className="card hud" style={{ padding: 4 }}>
        <HUDBrackets/>
        {tasks.map((t, i) => (
          <div key={t.id} style={{ display: 'flex', gap: 10, padding: 10, alignItems: 'center', borderBottom: i < tasks.length - 1 ? '1px solid var(--border)' : 0 }}>
            <button onClick={() => dispatch({ type: 'toggle_task', id: t.id })}
              style={{ width: 18, height: 18, borderRadius: 4, border: '1.5px solid var(--border-2)', flex: '0 0 auto' }}/>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div className="t-13">{t.title}</div>
              <div style={{ display: 'flex', gap: 6, marginTop: 3, alignItems: 'center' }}>
                <PriorityPill priority={t.priority}/>
                <span className="mono t-11" style={{ color: 'var(--text-3)' }}>{t.type === 'work' ? t.project : t.category}</span>
              </div>
            </div>
            <span className="mono t-11" style={{ color: t.due_date < todayStr ? 'var(--red)' : 'var(--text-3)' }}>{relativeDay(t.due_date)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function MobileFinance({ state, dispatch, openQuick }) {
  const ym = iso(new Date()).slice(0, 7);
  const exp = state.expenses.filter(e => e.date.startsWith(ym));
  const total = exp.reduce((s, e) => s + e.amount, 0);
  const byTag = {};
  exp.forEach(e => { byTag[e.tag] = (byTag[e.tag] || 0) + e.amount; });
  const donutData = Object.entries(byTag).sort((a,b)=>b[1]-a[1]).map(([t,v]) => ({ label: t, value: v, color: tagColor(t) }));

  return (
    <div style={{ padding: '8px 16px 12px' }}>
      <h1 style={{ fontSize: 24, margin: '6px 0 4px', fontWeight: 600 }}>Finance</h1>
      <div className="mono t-11" style={{ color: 'var(--text-3)', marginBottom: 14 }}>{new Date().toLocaleDateString('en', {month:'long', year:'numeric'})}</div>

      <div className="card hud card-pad" style={{ marginBottom: 14 }}>
        <HUDBrackets/>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ position: 'relative', width: 110, height: 110, flex: '0 0 auto' }}>
            <Donut data={donutData} size={110} thickness={11}/>
            <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <div className="mono t-10" style={{ color: 'var(--text-3)' }}>SPENT</div>
              <div className="mono" style={{ fontSize: 15, fontWeight: 600 }}>{fmtEURshort(total)}</div>
            </div>
          </div>
          <div style={{ flex: 1 }}>
            {donutData.slice(0, 4).map(d => (
              <div key={d.label} style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                <span className="dot" style={{ background: d.color }}/>
                <span className="t-11" style={{ flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{d.label}</span>
                <span className="mono t-11" style={{ color: 'var(--text-2)' }}>{fmtEURshort(d.value)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="sec-label" style={{ margin: '10px 0 8px' }}>RECENT</div>
      <div className="card hud" style={{ padding: 0, overflow: 'hidden' }}>
        <HUDBrackets/>
        {exp.slice(0, 8).map((e, i) => (
          <div key={e.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderBottom: i < 7 ? '1px solid var(--border)' : 0 }}>
            <span className="dot" style={{ background: tagColor(e.tag), width: 8, height: 8 }}/>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div className="t-13" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{e.source}</div>
              <div className="mono t-11" style={{ color: 'var(--text-3)', marginTop: 2 }}>{e.tag} · {fmtDate(e.date)}</div>
            </div>
            <span className="mono t-13" style={{ fontWeight: 600, color: 'var(--red)' }}>-{fmtEUR(e.amount)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function MobileLearn({ state, dispatch }) {
  return (
    <div style={{ padding: '8px 16px 12px' }}>
      <h1 style={{ fontSize: 24, margin: '6px 0 12px', fontWeight: 600 }}>Learning</h1>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {state.learning.slice(0, 5).map(d => (
          <div key={d.id} className="card hud card-pad">
            <HUDBrackets/>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
              <span className="t-13" style={{ fontWeight: 600 }}>{d.title}</span>
              <span className="mono t-12" style={{ color: 'var(--amber)', fontWeight: 600 }}>{d.progress}%</span>
            </div>
            <div className="mono t-11" style={{ color: 'var(--text-3)', marginBottom: 8 }}>{d.status.replace('_',' ')}</div>
            <Progress value={d.progress} color="var(--amber)" showPct={false} height={4}/>
          </div>
        ))}
      </div>
    </div>
  );
}

// Mobile expense quick-add — sheet style
function MobileExpenseSheet({ onClose, onSave }) {
  const [amount, setAmount] = React.useState('');
  const [source, setSource] = React.useState('');
  const [tag, setTag] = React.useState('Groceries');
  const amtRef = React.useRef();
  React.useEffect(() => { setTimeout(() => amtRef.current?.focus(), 50); }, []);
  const submit = () => {
    const a = parseFloat(amount);
    if (!a || !source.trim()) return;
    onSave({ id: 'e' + Date.now(), amount: a, source: source.trim(), tag, date: iso(new Date()), notes: '' });
    onClose();
  };
  const tags = ['Groceries','Dining Out','Transportation','Utilities','Entertainment','Shopping','Tabac','Healthcare','Insurance','Trading','Iphone','Rent/Mortgage'];
  return (
    <div onClick={onClose} style={{
      position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)',
      backdropFilter: 'blur(8px)', zIndex: 100,
      display: 'flex', alignItems: 'flex-end',
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        background: 'var(--bg-2)', borderTopLeftRadius: 24, borderTopRightRadius: 24,
        padding: 20, width: '100%', animation: 'slideUp 280ms cubic-bezier(0.16, 1, 0.3, 1)',
        borderTop: '1px solid var(--border-2)',
      }}>
        <div style={{ width: 36, height: 4, background: 'var(--text-4)', borderRadius: 2, margin: '0 auto 16px' }}/>
        <div className="sec-label" style={{ marginBottom: 4 }}>QUICK ADD</div>
        <div style={{ fontSize: 20, fontWeight: 600, marginBottom: 16 }}>Log Expense</div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 20 }}>
          <span className="mono" style={{ fontSize: 32, color: 'var(--text-3)' }}>€</span>
          <input ref={amtRef} inputMode="decimal" className="mono"
            value={amount} onChange={e => setAmount(e.target.value)}
            style={{ fontSize: 48, fontWeight: 600, background: 'transparent', border: 0, color: 'var(--text-0)', width: '100%', outline: 'none' }}
            placeholder="0.00"/>
        </div>
        <input className="input" placeholder="Source (Carrefour, Uber…)"
          value={source} onChange={e => setSource(e.target.value)} style={{ marginBottom: 14 }}/>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 20 }}>
          {tags.map(t => (
            <button key={t} onClick={() => setTag(t)} className="btn btn-sm"
              style={{
                background: tag === t ? tagColor(t) + '20' : 'var(--bg-3)',
                borderColor: tag === t ? tagColor(t) : 'var(--border-2)',
                color: tag === t ? tagColor(t) : 'var(--text-2)',
              }}>
              <span className="dot" style={{ background: tagColor(t) }}/> {t}
            </button>
          ))}
        </div>
        <button onClick={submit} className="btn btn-primary" style={{ width: '100%', padding: 14, fontSize: 15, justifyContent: 'center' }}>
          Log €{amount || '0.00'}
        </button>
      </div>
    </div>
  );
}

Object.assign(window, { MobileShell, MobileExpenseSheet });
