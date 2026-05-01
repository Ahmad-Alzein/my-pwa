// Mobile companion — iOS frame, 5-tab nav including Family
function Mobile({ state, setState, theme, onToggleTheme }) {
  const [tab, setTab] = React.useState('home');
  const [sheet, setSheet] = React.useState(null);
  const IOSDevice = window.IOSDevice;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'center' }}>
      <div className="caps" style={{ alignSelf: 'flex-start' }}>Mobile</div>
      <IOSDevice dark={theme === 'dark'} width={380} height={780}>
        <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: 'var(--bg-primary)', position: 'relative' }}>
          <div style={{ flex: 1, overflow: 'auto', padding: '64px 16px 90px' }}>
            {tab === 'home' && <MobileHome state={state} setState={setState} />}
            {tab === 'tasks' && <MobileTasks state={state} setState={setState} />}
            {tab === 'finance' && <MobileFinance state={state} setState={setState} onAdd={() => setSheet('expense')} />}
            {tab === 'family' && <MobileFamily state={state} setState={setState} onAdd={() => setSheet('family')} />}
            {tab === 'learn' && <MobileLearn state={state} />}
          </div>

          {/* FAB */}
          <button onClick={() => setSheet(tab === 'finance' ? 'expense' : tab === 'family' ? 'family' : 'task')} style={{
            position: 'absolute',
            bottom: 96, right: 18,
            width: 52, height: 52,
            borderRadius: '50%',
            background: 'var(--accent)',
            color: '#fff',
            display: 'grid', placeItems: 'center',
            boxShadow: '0 6px 16px rgba(193, 127, 89, 0.4)',
            zIndex: 30,
          }}><Icon name="plus" size={20} stroke={2} /></button>

          {/* Bottom nav */}
          <div style={{
            position: 'absolute', left: 0, right: 0, bottom: 0,
            background: 'var(--bg-raised)',
            borderTop: '1px solid var(--border-soft)',
            paddingBottom: 'env(safe-area-inset-bottom)',
            display: 'grid',
            gridTemplateColumns: 'repeat(5, 1fr)',
          }}>
            {[
              { id: 'home', label: 'Home', icon: 'home' },
              { id: 'tasks', label: 'Tasks', icon: 'tasks' },
              { id: 'finance', label: 'Finance', icon: 'wallet' },
              { id: 'family', label: 'Family', icon: 'users' },
              { id: 'learn', label: 'Learn', icon: 'book' },
            ].map(t => (
              <button key={t.id} onClick={() => setTab(t.id)} style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
                padding: '10px 4px 12px',
                color: tab === t.id ? 'var(--accent)' : 'var(--text-muted)',
              }}>
                <Icon name={t.icon} size={18} stroke={tab === t.id ? 2 : 1.5} />
                <span style={{ fontSize: 10, fontWeight: tab === t.id ? 500 : 400 }}>{t.label}</span>
              </button>
            ))}
          </div>

          {/* Sheets */}
          <BottomSheet open={sheet === 'expense'} onClose={() => setSheet(null)} title="Log expense">
            <MobileExpenseForm onSubmit={(x) => { setState(s => ({ ...s, expenses: [x, ...s.expenses] })); setSheet(null); }} />
          </BottomSheet>
          <BottomSheet open={sheet === 'family'} onClose={() => setSheet(null)} title="Family entry">
            <MobileFamilyForm onSubmit={(x) => { setState(s => ({ ...s, family: { ...s.family, transactions: [x, ...s.family.transactions] }})); setSheet(null); }} />
          </BottomSheet>
          <BottomSheet open={sheet === 'task'} onClose={() => setSheet(null)} title="New task">
            <MobileTaskForm onSubmit={(x) => { setState(s => ({ ...s, tasks: [x, ...s.tasks] })); setSheet(null); }} />
          </BottomSheet>
        </div>
      </IOSDevice>
      <button onClick={onToggleTheme} style={{ fontSize: 11, color: 'var(--text-muted)', padding: 6 }}>
        Toggle {theme === 'light' ? 'dark' : 'light'}
      </button>
    </div>
  );
}

function MobileHome({ state }) {
  const today = new Date();
  const ym = window.iso(today).slice(0, 7);
  const monthSpend = state.expenses.filter(e => e.date.startsWith(ym)).reduce((a,b) => a+b.amount, 0);
  const todayISO = window.iso(today);
  const todays = state.tasks.filter(t => t.status !== 'done' && t.due_date <= todayISO);
  const famNet = state.family.transactions.reduce((a,t) => a + (t.transaction_type === 'income' ? t.amount : -t.amount), 0);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ marginTop: 4 }}>
        <div className="caps" style={{ marginBottom: 4 }}>{today.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })}</div>
        <h1 className="serif" style={{ margin: 0, fontSize: 24, fontWeight: 500, letterSpacing: '-0.01em' }}>Good afternoon, Ahmad.</h1>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        <Card padding="14px"><div className="caps" style={{ fontSize: 10 }}>Spend</div><Amount value={monthSpend} size="lg" /></Card>
        <Card padding="14px"><div className="caps" style={{ fontSize: 10 }}>Tasks</div><span className="mono" style={{ fontSize: 20 }}>{todays.length}</span></Card>
      </div>
      <Card padding="16px">
        <div className="caps" style={{ marginBottom: 10 }}>Family · Mohtadi</div>
        <Amount value={Math.abs(famNet)} size="xl" tone="accent" />
        <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>{famNet >= 0 ? 'They owe you' : 'You owe them'}</div>
      </Card>
      <Card padding="16px">
        <div className="caps" style={{ marginBottom: 10 }}>Today</div>
        {todays.slice(0, 4).map(t => (
          <div key={t.id} style={{ padding: '8px 0', borderBottom: '1px solid var(--border-soft)', fontSize: 13 }}>{t.title}</div>
        ))}
      </Card>
    </div>
  );
}

function MobileTasks({ state, setState }) {
  const todayISO = window.iso(new Date());
  const open = state.tasks.filter(t => t.status !== 'done').slice(0, 12);
  const toggle = (id) => setState(s => ({ ...s, tasks: s.tasks.map(t => t.id === id ? { ...t, status: t.status === 'done' ? 'todo' : 'done' } : t) }));
  return (
    <div>
      <h1 className="serif" style={{ margin: '4px 0 16px', fontSize: 24, fontWeight: 500, letterSpacing: '-0.01em' }}>Tasks</h1>
      <Card padding="0">
        {open.map((t, i) => {
          const overdue = t.due_date < todayISO;
          return (
            <div key={t.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', borderBottom: i < open.length - 1 ? '1px solid var(--border-soft)' : 'none' }}>
              <button onClick={() => toggle(t.id)} style={{
                width: 18, height: 18,
                border: '1.5px solid var(--border)',
                borderRadius: '50%', flexShrink: 0,
              }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, color: 'var(--text-primary)' }}>{t.title}</div>
                <div style={{ fontSize: 10, color: overdue ? 'var(--danger)' : 'var(--text-muted)', marginTop: 3 }}>{t.priority.toUpperCase()} · {window.relativeDate(t.due_date)}</div>
              </div>
            </div>
          );
        })}
      </Card>
    </div>
  );
}

function MobileFinance({ state, onAdd }) {
  const ym = window.iso(new Date()).slice(0, 7);
  const monthSpend = state.expenses.filter(e => e.date.startsWith(ym)).reduce((a,b) => a+b.amount, 0);
  return (
    <div>
      <h1 className="serif" style={{ margin: '4px 0 16px', fontSize: 24, fontWeight: 500, letterSpacing: '-0.01em' }}>Finance</h1>
      <Card padding="20px" style={{ marginBottom: 14 }}>
        <div className="caps" style={{ marginBottom: 8 }}>This month</div>
        <Amount value={monthSpend} size="xxl" />
      </Card>
      <Card padding="0">
        {state.expenses.slice(0, 12).map((e, i) => (
          <div key={e.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 14px', borderBottom: '1px solid var(--border-soft)' }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13 }}>{e.source}</div>
              <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 2 }}>{e.tag} · {e.date}</div>
            </div>
            <Amount value={-e.amount} size="sm" tone="expense" />
          </div>
        ))}
      </Card>
    </div>
  );
}

function MobileFamily({ state }) {
  const txs = state.family.transactions;
  const expense = txs.filter(t => t.transaction_type === 'expense').reduce((a,b) => a+b.amount, 0);
  const income = txs.filter(t => t.transaction_type === 'income').reduce((a,b) => a+b.amount, 0);
  const net = income - expense;
  return (
    <div>
      <h1 className="serif" style={{ margin: '4px 0 16px', fontSize: 24, fontWeight: 500, letterSpacing: '-0.01em' }}>Family</h1>
      <Card padding="20px" style={{ marginBottom: 14 }}>
        <div className="caps" style={{ marginBottom: 8 }}>Net with Mohtadi</div>
        <Amount value={Math.abs(net)} size="xxl" tone={net >= 0 ? 'accent' : 'expense'} />
        <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>{net >= 0 ? 'They owe you' : 'You owe them'}</div>
      </Card>
      <Card padding="0">
        {txs.slice(0, 10).map((t, i) => (
          <div key={t.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 14px', borderBottom: '1px solid var(--border-soft)' }}>
            <div style={{
              width: 28, height: 28, borderRadius: '50%',
              background: t.transaction_type === 'income' ? 'var(--success-soft)' : 'var(--danger-soft)',
              color: t.transaction_type === 'income' ? 'var(--success)' : 'var(--danger)',
              display: 'grid', placeItems: 'center', flexShrink: 0,
            }}>
              <Icon name={t.transaction_type === 'income' ? 'arrowDown' : 'arrowUp'} size={12} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 12, lineHeight: 1.3 }}>{t.description}</div>
              <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 2 }}>{t.tag} · {t.date}</div>
            </div>
            <Amount value={t.transaction_type === 'income' ? t.amount : -t.amount} size="sm" tone={t.transaction_type === 'income' ? 'income' : 'expense'} />
          </div>
        ))}
      </Card>
    </div>
  );
}

function MobileLearn({ state }) {
  return (
    <div>
      <h1 className="serif" style={{ margin: '4px 0 16px', fontSize: 24, fontWeight: 500, letterSpacing: '-0.01em' }}>Learn</h1>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {state.learning.filter(l => l.status === 'in_progress').map(l => (
          <Card key={l.id} padding="14px">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <div className="serif" style={{ fontSize: 14, fontWeight: 500 }}>{l.title}</div>
              <span className="mono" style={{ fontSize: 11, color: 'var(--text-muted)' }}>{l.progress}%</span>
            </div>
            <div style={{ height: 3, background: 'var(--bg-tertiary)', borderRadius: 2, overflow: 'hidden' }}>
              <div style={{ width: `${l.progress}%`, height: '100%', background: 'var(--accent)' }} />
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

function MobileExpenseForm({ onSubmit }) {
  const [src, setSrc] = React.useState(''); const [amt, setAmt] = React.useState(''); const [tag, setTag] = React.useState('Groceries');
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <Field label="Source"><Input autoFocus value={src} onChange={e => setSrc(e.target.value)} placeholder="Carrefour" /></Field>
      <Field label="Amount"><Input value={amt} onChange={e => setAmt(e.target.value)} placeholder="0.00" inputMode="decimal" /></Field>
      <Field label="Tag"><Select value={tag} onChange={e => setTag(e.target.value)}>{['Groceries','Dining Out','Transportation','Healthcare','Other'].map(t => <option key={t}>{t}</option>)}</Select></Field>
      <Button onClick={() => { if (src && parseFloat(amt)) onSubmit({ id: 'e' + Date.now(), source: src, amount: parseFloat(amt), tag, date: window.iso(new Date()), notes: '' }); }}>Log</Button>
    </div>
  );
}

function MobileFamilyForm({ onSubmit }) {
  const [d, setD] = React.useState(''); const [a, setA] = React.useState('');
  const [type, setType] = React.useState('expense');
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <Segmented value={type} onChange={setType} options={[{value:'expense',label:'Spent'},{value:'income',label:'Received'}]} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }} />
      <Field label="Description"><Input autoFocus value={d} onChange={e => setD(e.target.value)} /></Field>
      <Field label="Amount"><Input value={a} onChange={e => setA(e.target.value)} inputMode="decimal" /></Field>
      <Button onClick={() => { if (d && parseFloat(a)) onSubmit({ id: 'ft' + Date.now(), description: d, amount: parseFloat(a), transaction_type: type, date: window.iso(new Date()), tag: 'Other', payment_method: 'cash', person: 'brother', notes: '' }); }}>Save</Button>
    </div>
  );
}

function MobileTaskForm({ onSubmit }) {
  const [t, setT] = React.useState('');
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <Field label="Title"><Input autoFocus value={t} onChange={e => setT(e.target.value)} /></Field>
      <Button onClick={() => { if (t) onSubmit({ id: 'tk' + Date.now(), title: t, type: 'work', priority: 'p2', status: 'todo', due_date: window.iso(new Date()) }); }}>Add</Button>
    </div>
  );
}

Object.assign(window, { Mobile });
