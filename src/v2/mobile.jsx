// Mobile companion — iOS frame for desktop preview, full-screen shell on phones.
function Mobile({ state, setState, theme, onToggleTheme, framed = true }) {
  const [tab, setTab] = React.useState('home');
  const [sheet, setSheet] = React.useState(null);
  const IOSDevice = window.IOSDevice;
  const contentPadding = framed ? '64px 16px 90px' : 'calc(16px + env(safe-area-inset-top)) 16px calc(90px + env(safe-area-inset-bottom))';
  const fabBottom = framed ? 96 : 'calc(88px + env(safe-area-inset-bottom))';

  const content = (
    <div style={{ height: '100%', minHeight: framed ? undefined : '100dvh', display: 'flex', flexDirection: 'column', background: 'var(--bg-primary)', color: 'var(--text-primary)', position: 'relative' }}>
          <div style={{ flex: 1, overflow: 'auto', padding: contentPadding }}>
            {tab === 'home' && <MobileHome state={state} setState={setState} />}
            {tab === 'tasks' && <MobileTasks state={state} setState={setState} onEdit={(t) => setSheet({ type: 'task', item: t })} />}
            {tab === 'finance' && <MobileFinance state={state} setState={setState}
              onAdd={() => setSheet({ type: 'expense' })}
              onEdit={(e) => setSheet({ type: 'expense', item: e })}
              onIncome={(i) => setSheet({ type: 'income', item: i })}
              onSavingsTx={(tx) => setSheet({ type: 'savingsTx', item: tx })}
              onFamilyEdit={(entry) => setSheet({ type: 'family', item: entry })} />}
            {tab === 'family' && <MobileFamily state={state} setState={setState} onAdd={() => setSheet({ type: 'family' })} onEdit={(entry) => setSheet({ type: 'family', item: entry })} />}
            {tab === 'learn' && <MobileLearn state={state} />}
          </div>

          {/* FAB */}
          <button onClick={() => setSheet({ type: tab === 'finance' ? 'expense' : tab === 'family' ? 'family' : 'task' })} style={{
            position: 'absolute',
            bottom: fabBottom, right: 18,
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
          <BottomSheet open={sheet?.type === 'expense'} onClose={() => setSheet(null)} title={sheet?.item ? 'Edit expense' : 'Log expense'}>
            <MobileExpenseForm initial={sheet?.item} onSubmit={(x) => {
              setState(s => ({
                ...s,
                expenses: sheet?.item
                  ? s.expenses.map(e => e.id === x.id ? x : e)
                  : [x, ...s.expenses]
              }));
              setSheet(null);
            }} />
          </BottomSheet>
          <BottomSheet open={sheet?.type === 'family'} onClose={() => setSheet(null)} title="Family entry">
            <MobileFamilyForm initial={sheet?.item} onSubmit={(x) => {
              setState(s => ({
                ...s,
                family: {
                  ...s.family,
                  transactions: sheet?.item
                    ? s.family.transactions.map(t => t.id === x.id ? x : t)
                    : [x, ...s.family.transactions]
                }
              }));
              setSheet(null);
            }} />
          </BottomSheet>
          <BottomSheet open={sheet?.type === 'income'} onClose={() => setSheet(null)} title={sheet?.item ? 'Edit income' : 'Log income'}>
            <MobileIncomeForm initial={sheet?.item} onSubmit={(x) => {
              setState(s => ({
                ...s,
                income: sheet?.item ? s.income.map(i => i.id === x.id ? x : i) : [x, ...s.income]
              }));
              setSheet(null);
            }} />
          </BottomSheet>
          <BottomSheet open={sheet?.type === 'savingsTx'} onClose={() => setSheet(null)} title={sheet?.item ? 'Edit movement' : 'Savings movement'}>
            <MobileSavingsTxForm initial={sheet?.item} accounts={state.savings.accounts} onSubmit={(x) => {
              setState(s => ({
                ...s,
                savings: {
                  ...s.savings,
                  transactions: sheet?.item
                    ? s.savings.transactions.map(t => t.id === x.id ? x : t)
                    : [x, ...s.savings.transactions]
                }
              }));
              setSheet(null);
            }} />
          </BottomSheet>
          <BottomSheet open={sheet?.type === 'task'} onClose={() => setSheet(null)} title={sheet?.item ? 'Edit task' : 'New task'}>
            <MobileTaskForm initial={sheet?.item} onSubmit={(x) => {
              setState(s => ({
                ...s,
                tasks: sheet?.item
                  ? s.tasks.map(t => t.id === x.id ? x : t)
                  : [x, ...s.tasks]
              }));
              setSheet(null);
            }} />
          </BottomSheet>
    </div>
  );

  if (!framed) {
    return (
      <div data-screen-label="atelier-mobile-main" style={{ height: '100dvh', minHeight: '100dvh', overflow: 'hidden', background: 'var(--bg-primary)' }}>
        {content}
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'center' }}>
      <div className="caps" style={{ alignSelf: 'flex-start' }}>Mobile</div>
      <IOSDevice dark={theme === 'dark'} width={380} height={780}>
        {content}
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

function MobileTasks({ state, setState, onEdit }) {
  const todayISO = window.iso(new Date());
  const open = state.tasks.filter(t => t.status !== 'done').slice(0, 12);
  const toggle = (id) => setState(s => ({ ...s, tasks: s.tasks.map(t => t.id === id ? { ...t, status: t.status === 'done' ? 'todo' : 'done' } : t) }));
  const remove = (id) => {
    if (!window.confirm('Delete this task?')) return;
    setState(s => ({ ...s, tasks: s.tasks.filter(t => t.id !== id) }));
  };
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
              <div style={{ display: 'flex', gap: 2 }}>
                <button onClick={() => onEdit(t)} title="Edit" style={mobileIconButtonStyle}><Icon name="edit" size={14} /></button>
                <button onClick={() => remove(t.id)} title="Delete" style={{ ...mobileIconButtonStyle, color: 'var(--danger)' }}><Icon name="trash" size={14} /></button>
              </div>
            </div>
          );
        })}
      </Card>
    </div>
  );
}

function MobileFinance({ state, setState, onAdd, onEdit, onIncome, onSavingsTx, onFamilyEdit }) {
  const [financeTab, setFinanceTab] = React.useState('overview');
  const ym = window.iso(new Date()).slice(0, 7);
  const monthSpend = state.expenses.filter(e => e.date.startsWith(ym)).reduce((a,b) => a+b.amount, 0);
  const monthIncome = state.income.filter(e => e.date.startsWith(ym)).reduce((a,b) => a+b.amount, 0);
  const totalSavings = state.savings.accounts.reduce((sum, acc) => {
    const txs = state.savings.transactions.filter(t => t.account_id === acc.id);
    return sum + txs.reduce((s, t) => s + (t.transaction_type === 'deposit' ? t.amount : -t.amount), 0);
  }, 0);
  const removeExpense = (id) => {
    if (!window.confirm('Delete this expense?')) return;
    setState(s => ({ ...s, expenses: s.expenses.filter(e => e.id !== id) }));
  };
  const removeIncome = (id) => {
    if (!window.confirm('Delete this income entry?')) return;
    setState(s => ({ ...s, income: s.income.filter(i => i.id !== id) }));
  };
  const removeSavingsTx = (id) => {
    if (!window.confirm('Delete this savings movement?')) return;
    setState(s => ({ ...s, savings: { ...s.savings, transactions: s.savings.transactions.filter(t => t.id !== id) } }));
  };
  return (
    <div>
      <h1 className="serif" style={{ margin: '4px 0 16px', fontSize: 24, fontWeight: 500, letterSpacing: '-0.01em' }}>Finance</h1>
      <Segmented
        value={financeTab}
        onChange={setFinanceTab}
        options={[
          { value: 'overview', label: 'Overview' },
          { value: 'expenses', label: 'Expenses' },
          { value: 'income', label: 'Income' },
          { value: 'savings', label: 'Savings' },
          { value: 'family', label: 'Family' },
        ]}
        style={{ width: '100%', display: 'flex', overflowX: 'auto', marginBottom: 14 }}
      />

      {financeTab === 'overview' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <Card padding="20px">
            <div className="caps" style={{ marginBottom: 8 }}>This month</div>
            <Amount value={monthSpend} size="xxl" />
          </Card>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <Card padding="14px"><div className="caps" style={{ fontSize: 10 }}>Income</div><Amount value={monthIncome} size="lg" tone="income" /></Card>
            <Card padding="14px"><div className="caps" style={{ fontSize: 10 }}>Savings</div><Amount value={totalSavings} size="lg" tone="accent" /></Card>
          </div>
        </div>
      )}

      {financeTab === 'expenses' && (
        <>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 10 }}><Button size="sm" icon="plus" onClick={onAdd}>Expense</Button></div>
        <Card padding="0">
          {state.expenses.slice(0, 20).map((e, i) => (
            <div key={e.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 14px', borderBottom: '1px solid var(--border-soft)' }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13 }}>{e.source}</div>
                <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 2 }}>{e.tag} · {e.date}</div>
              </div>
              <Amount value={-e.amount} size="sm" tone="expense" />
              <button onClick={() => onEdit(e)} title="Edit" style={mobileIconButtonStyle}><Icon name="edit" size={14} /></button>
              <button onClick={() => removeExpense(e.id)} title="Delete" style={{ ...mobileIconButtonStyle, color: 'var(--danger)' }}><Icon name="trash" size={14} /></button>
            </div>
          ))}
        </Card>
        </>
      )}

      {financeTab === 'income' && (
        <>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 10 }}><Button size="sm" icon="plus" onClick={() => onIncome(null)}>Income</Button></div>
        <Card padding="0">
          {state.income.map((e, i) => (
            <div key={e.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 14px', borderBottom: '1px solid var(--border-soft)' }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13 }}>{e.source}</div>
                <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 2 }}>{e.tag} · {e.date}</div>
              </div>
              <Amount value={e.amount} size="sm" tone="income" />
              <button onClick={() => onIncome(e)} title="Edit" style={mobileIconButtonStyle}><Icon name="edit" size={14} /></button>
              <button onClick={() => removeIncome(e.id)} title="Delete" style={{ ...mobileIconButtonStyle, color: 'var(--danger)' }}><Icon name="trash" size={14} /></button>
            </div>
          ))}
        </Card>
        </>
      )}

      {financeTab === 'savings' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}><Button size="sm" icon="plus" onClick={() => onSavingsTx(null)}>Movement</Button></div>
          {state.savings.accounts.map(acc => {
            const txs = state.savings.transactions.filter(t => t.account_id === acc.id);
            const balance = txs.reduce((s, t) => s + (t.transaction_type === 'deposit' ? t.amount : -t.amount), 0);
            return (
              <Card key={acc.id} padding="14px">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <div className="serif" style={{ fontSize: 15 }}>{acc.name}</div>
                  <Amount value={balance} size="lg" tone="accent" />
                </div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>Target <Amount value={acc.target_amount} size="sm" tone="muted" /></div>
                {txs.slice(0, 3).map(tx => (
                  <div key={tx.id} style={{ display: 'flex', alignItems: 'center', gap: 8, paddingTop: 10, marginTop: 10, borderTop: '1px solid var(--border-soft)' }}>
                    <div style={{ flex: 1, minWidth: 0, fontSize: 11, color: 'var(--text-secondary)' }}>{tx.notes || tx.transaction_type} <span className="mono" style={{ color: 'var(--text-muted)' }}>{tx.date}</span></div>
                    <Amount value={tx.transaction_type === 'deposit' ? tx.amount : -tx.amount} size="sm" tone={tx.transaction_type === 'deposit' ? 'income' : 'expense'} />
                    <button onClick={() => onSavingsTx(tx)} title="Edit" style={mobileIconButtonStyle}><Icon name="edit" size={14} /></button>
                    <button onClick={() => removeSavingsTx(tx.id)} title="Delete" style={{ ...mobileIconButtonStyle, color: 'var(--danger)' }}><Icon name="trash" size={14} /></button>
                  </div>
                ))}
              </Card>
            );
          })}
        </div>
      )}

      {financeTab === 'family' && <MobileFamily state={state} setState={setState} onEdit={onFamilyEdit} />}
    </div>
  );
}

function MobileFamily({ state, setState, onEdit }) {
  const txs = state.family.transactions;
  const expense = txs.filter(t => t.transaction_type === 'expense').reduce((a,b) => a+b.amount, 0);
  const income = txs.filter(t => t.transaction_type === 'income').reduce((a,b) => a+b.amount, 0);
  const net = income - expense;
  const remove = (id) => {
    if (!window.confirm('Delete this family entry?')) return;
    setState(s => ({ ...s, family: { ...s.family, transactions: s.family.transactions.filter(t => t.id !== id) } }));
  };
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
            {onEdit && <button onClick={() => onEdit(t)} title="Edit" style={mobileIconButtonStyle}><Icon name="edit" size={14} /></button>}
            {onEdit && <button onClick={() => remove(t.id)} title="Delete" style={{ ...mobileIconButtonStyle, color: 'var(--danger)' }}><Icon name="trash" size={14} /></button>}
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

const mobileIconButtonStyle = {
  width: 32,
  height: 32,
  borderRadius: 'var(--radius-md)',
  display: 'grid',
  placeItems: 'center',
  color: 'var(--text-muted)',
  flexShrink: 0,
};

function MobileExpenseForm({ onSubmit, initial }) {
  const [src, setSrc] = React.useState(initial?.source || '');
  const [amt, setAmt] = React.useState(initial ? String(initial.amount) : '');
  const [tag, setTag] = React.useState(initial?.tag || 'Groceries');
  const [date, setDate] = React.useState(initial?.date || window.iso(new Date()));
  React.useEffect(() => {
    setSrc(initial?.source || '');
    setAmt(initial ? String(initial.amount) : '');
    setTag(initial?.tag || 'Groceries');
    setDate(initial?.date || window.iso(new Date()));
  }, [initial]);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <Field label="Source"><Input autoFocus value={src} onChange={e => setSrc(e.target.value)} placeholder="Carrefour" /></Field>
      <Field label="Amount"><Input value={amt} onChange={e => setAmt(e.target.value)} placeholder="0.00" inputMode="decimal" /></Field>
      <Field label="Date"><Input type="date" value={date} onChange={e => setDate(e.target.value)} /></Field>
      <Field label="Tag"><Select value={tag} onChange={e => setTag(e.target.value)}>{['Groceries','Dining Out','Transportation','Healthcare','Other'].map(t => <option key={t}>{t}</option>)}</Select></Field>
      <Button onClick={() => { if (src && parseFloat(amt)) onSubmit({ ...(initial || { id: 'e' + Date.now(), notes: '' }), source: src, amount: parseFloat(amt), tag, date }); }}>{initial ? 'Save changes' : 'Log'}</Button>
    </div>
  );
}

function MobileIncomeForm({ onSubmit, initial }) {
  const [source, setSource] = React.useState(initial?.source || '');
  const [amount, setAmount] = React.useState(initial ? String(initial.amount) : '');
  const [tag, setTag] = React.useState(initial?.tag || 'Salary');
  const [date, setDate] = React.useState(initial?.date || window.iso(new Date()));
  React.useEffect(() => {
    setSource(initial?.source || '');
    setAmount(initial ? String(initial.amount) : '');
    setTag(initial?.tag || 'Salary');
    setDate(initial?.date || window.iso(new Date()));
  }, [initial]);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <Field label="Source"><Input autoFocus value={source} onChange={e => setSource(e.target.value)} /></Field>
      <Field label="Amount"><Input value={amount} onChange={e => setAmount(e.target.value)} inputMode="decimal" /></Field>
      <Field label="Date"><Input type="date" value={date} onChange={e => setDate(e.target.value)} /></Field>
      <Field label="Tag"><Input value={tag} onChange={e => setTag(e.target.value)} /></Field>
      <Button onClick={() => { if (source && parseFloat(amount)) onSubmit({ ...(initial || { id: 'i' + Date.now(), notes: '' }), source, amount: parseFloat(amount), tag, date }); }}>{initial ? 'Save changes' : 'Log income'}</Button>
    </div>
  );
}

function MobileSavingsTxForm({ onSubmit, accounts, initial }) {
  const [accountId, setAccountId] = React.useState(initial?.account_id || accounts?.[0]?.id || '');
  const [amount, setAmount] = React.useState(initial ? String(initial.amount) : '');
  const [type, setType] = React.useState(initial?.transaction_type || 'deposit');
  const [date, setDate] = React.useState(initial?.date || window.iso(new Date()));
  const [notes, setNotes] = React.useState(initial?.notes || '');
  React.useEffect(() => {
    setAccountId(initial?.account_id || accounts?.[0]?.id || '');
    setAmount(initial ? String(initial.amount) : '');
    setType(initial?.transaction_type || 'deposit');
    setDate(initial?.date || window.iso(new Date()));
    setNotes(initial?.notes || '');
  }, [initial, accounts]);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <Segmented value={type} onChange={setType} options={[{value:'deposit',label:'Deposit'},{value:'withdrawal',label:'Withdraw'}]} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }} />
      <Field label="Account"><Select value={accountId} onChange={e => setAccountId(e.target.value)}>{accounts.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}</Select></Field>
      <Field label="Amount"><Input value={amount} onChange={e => setAmount(e.target.value)} inputMode="decimal" /></Field>
      <Field label="Date"><Input type="date" value={date} onChange={e => setDate(e.target.value)} /></Field>
      <Field label="Notes"><Input value={notes} onChange={e => setNotes(e.target.value)} /></Field>
      <Button onClick={() => { if (accountId && parseFloat(amount)) onSubmit({ ...(initial || { id: 'st' + Date.now() }), account_id: accountId, amount: parseFloat(amount), transaction_type: type, date, notes }); }}>{initial ? 'Save changes' : 'Save movement'}</Button>
    </div>
  );
}

function MobileFamilyForm({ onSubmit, initial }) {
  const [d, setD] = React.useState(initial?.description || '');
  const [a, setA] = React.useState(initial ? String(initial.amount) : '');
  const [type, setType] = React.useState(initial?.transaction_type || 'expense');
  React.useEffect(() => {
    setD(initial?.description || '');
    setA(initial ? String(initial.amount) : '');
    setType(initial?.transaction_type || 'expense');
  }, [initial]);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <Segmented value={type} onChange={setType} options={[{value:'expense',label:'Spent'},{value:'income',label:'Received'}]} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }} />
      <Field label="Description"><Input autoFocus value={d} onChange={e => setD(e.target.value)} /></Field>
      <Field label="Amount"><Input value={a} onChange={e => setA(e.target.value)} inputMode="decimal" /></Field>
      <Button onClick={() => { if (d && parseFloat(a)) onSubmit({ ...(initial || { id: 'ft' + Date.now(), tag: 'Other', payment_method: 'cash', person: 'brother', notes: '', date: window.iso(new Date()) }), description: d, amount: parseFloat(a), transaction_type: type }); }}>{initial ? 'Save changes' : 'Save'}</Button>
    </div>
  );
}

function MobileTaskForm({ onSubmit, initial }) {
  const [t, setT] = React.useState(initial?.title || '');
  const [type, setType] = React.useState(initial?.type || 'work');
  const [priority, setPriority] = React.useState(initial?.priority || 'p2');
  const [status, setStatus] = React.useState(initial?.status || 'todo');
  const [due, setDue] = React.useState(initial?.due_date || window.iso(new Date()));
  React.useEffect(() => {
    setT(initial?.title || '');
    setType(initial?.type || 'work');
    setPriority(initial?.priority || 'p2');
    setStatus(initial?.status || 'todo');
    setDue(initial?.due_date || window.iso(new Date()));
  }, [initial]);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <Field label="Title"><Input autoFocus value={t} onChange={e => setT(e.target.value)} /></Field>
      <Field label="Type"><Select value={type} onChange={e => setType(e.target.value)}><option value="work">Work</option><option value="personal">Personal</option></Select></Field>
      <Field label="Priority"><Select value={priority} onChange={e => setPriority(e.target.value)}><option value="p0">P0</option><option value="p1">P1</option><option value="p2">P2</option><option value="p3">P3</option></Select></Field>
      <Field label="Status"><Select value={status} onChange={e => setStatus(e.target.value)}><option value="todo">To do</option><option value="in_progress">In progress</option><option value="blocked">Blocked</option><option value="done">Done</option></Select></Field>
      <Field label="Due"><Input type="date" value={due} onChange={e => setDue(e.target.value)} /></Field>
      <Button onClick={() => { if (t) onSubmit({ ...(initial || { id: 'tk' + Date.now() }), title: t, type, priority, status, due_date: due }); }}>{initial ? 'Save changes' : 'Add'}</Button>
    </div>
  );
}

Object.assign(window, { Mobile });
