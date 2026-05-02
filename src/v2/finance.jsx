// Finance module — Overview, Expenses, Income, Savings, Family tabs
function Finance({ state, setState, route, onRoute }) {
  const tab = route === 'finance/family' ? 'family' : (route.split('/')[1] || 'overview');
  const setTab = (t) => onRoute(t === 'overview' ? 'finance' : `finance/${t}`);

  const today = new Date();
  const ym = window.iso(today).slice(0, 7);
  const monthExpenses = state.expenses.filter(e => e.date.startsWith(ym));
  const monthSpend = monthExpenses.reduce((a,b) => a + b.amount, 0);
  const monthIncome = state.income.filter(i => i.date.startsWith(ym)).reduce((a,b) => a + b.amount, 0);

  // Savings totals
  const savingsByAccount = state.savings.accounts.map(acc => {
    const txs = state.savings.transactions.filter(t => t.account_id === acc.id);
    const balance = txs.reduce((s, t) => s + (t.transaction_type === 'deposit' ? t.amount : -t.amount), 0);
    return { ...acc, balance };
  });
  const totalSavings = savingsByAccount.reduce((a,b) => a + b.balance, 0);

  return (
    <PageContainer>
      <PageTitle eyebrow="Finance">
        {tab === 'family' ? 'Family ledger' :
         tab === 'expenses' ? 'Expenses' :
         tab === 'income' ? 'Income' :
         tab === 'savings' ? 'Savings' :
         'Overview'}
      </PageTitle>

      <div style={{ marginBottom: 28 }}>
        <Segmented
          value={tab}
          onChange={setTab}
          options={[
            { value: 'overview', label: 'Overview' },
            { value: 'expenses', label: 'Expenses' },
            { value: 'income', label: 'Income' },
            { value: 'savings', label: 'Savings' },
            { value: 'family', label: 'Family' },
          ]}
        />
      </div>

      {tab === 'overview' && <FinanceOverview state={state} monthSpend={monthSpend} monthIncome={monthIncome} totalSavings={totalSavings} savingsByAccount={savingsByAccount} />}
      {tab === 'expenses' && <ExpensesTab state={state} setState={setState} />}
      {tab === 'income' && <IncomeTab state={state} setState={setState} />}
      {tab === 'savings' && <SavingsTab state={state} setState={setState} savingsByAccount={savingsByAccount} />}
      {tab === 'family' && <window.FamilyLedger state={state} setState={setState} />}
    </PageContainer>
  );
}

function FinanceOverview({ state, monthSpend, monthIncome, totalSavings, savingsByAccount }) {
  const today = new Date();
  // 6-month history
  const months = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
    const ym = window.iso(d).slice(0, 7);
    const spend = state.expenses.filter(e => e.date.startsWith(ym)).reduce((a,b) => a+b.amount, 0);
    const inc = state.income.filter(e => e.date.startsWith(ym)).reduce((a,b) => a+b.amount, 0);
    months.push({ label: d.toLocaleDateString('en-GB', { month: 'short' }), spend, inc });
  }

  // Expense by tag
  const ym = window.iso(today).slice(0, 7);
  const byTag = {};
  state.expenses.filter(e => e.date.startsWith(ym)).forEach(e => { byTag[e.tag] = (byTag[e.tag] || 0) + e.amount; });
  const tagRows = Object.entries(byTag).sort((a,b) => b[1] - a[1]);
  const tagColors = ['var(--accent)', 'var(--info)', 'var(--warning)', 'var(--success)', 'var(--danger)', '#8B7355', '#9B8B7E', '#6B5E54'];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 20 }}>
        <StatCard label="Month spend" value={<Amount value={monthSpend} size="xl" />} hint="Current month" />
        <StatCard label="Month income" value={<Amount value={monthIncome} size="xl" tone="neutral" />} hint="Current month" />
        <StatCard label="Net" value={<Amount value={monthIncome - monthSpend} size="xl" tone={monthIncome > monthSpend ? 'income' : 'expense'} />} hint="Saved this month" />
        <StatCard label="Total savings" value={<Amount value={totalSavings} size="xl" tone="accent" />} hint={`${state.savings.accounts.length} accounts`} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 24 }}>
        <Card padding="var(--space-xl)">
          <SectionTitle eyebrow="Flow">6-month trend</SectionTitle>
          <MonthBars months={months} />
        </Card>
        <Card padding="var(--space-xl)">
          <SectionTitle eyebrow="This month">By category</SectionTitle>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 4 }}>
            {tagRows.slice(0, 8).map(([tag, amt], i) => {
              const pct = (amt / monthSpend) * 100;
              return (
                <div key={tag}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5, fontSize: 13 }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                      <Dot color={tagColors[i % tagColors.length]} />
                      <span style={{ color: 'var(--text-primary)' }}>{tag}</span>
                    </span>
                    <Amount value={amt} size="sm" tone="muted" />
                  </div>
                  <div style={{ height: 3, background: 'var(--bg-tertiary)', borderRadius: 2, overflow: 'hidden' }}>
                    <div style={{ width: `${pct}%`, height: '100%', background: tagColors[i % tagColors.length], transition: 'width 0.5s var(--ease)' }} />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      <Card padding="var(--space-xl)">
        <SectionTitle eyebrow="Reserves">Savings accounts</SectionTitle>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
          {savingsByAccount.map(acc => {
            const pct = Math.min((acc.balance / acc.target_amount) * 100, 100);
            return (
              <div key={acc.id} style={{ padding: 16, border: '1px solid var(--border-soft)', borderRadius: 'var(--radius-md)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 10 }}>
                  <div>
                    <div style={{ fontSize: 13, color: 'var(--text-primary)', fontWeight: 500 }}>{acc.name}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 3 }}>Target <Amount value={acc.target_amount} size="sm" tone="muted" /></div>
                  </div>
                  <Amount value={acc.balance} size="lg" tone="accent" />
                </div>
                <div style={{ height: 4, background: 'var(--bg-tertiary)', borderRadius: 2, overflow: 'hidden' }}>
                  <div style={{ width: `${pct}%`, height: '100%', background: 'var(--accent)' }} />
                </div>
                <div className="mono" style={{ marginTop: 6, fontSize: 10, color: 'var(--text-muted)', textAlign: 'right' }}>{pct.toFixed(0)}%</div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}

function MonthBars({ months }) {
  const max = Math.max(...months.flatMap(m => [m.spend, m.inc]), 100);
  return (
    <div style={{ display: 'grid', gridTemplateColumns: `repeat(${months.length}, 1fr)`, gap: 16, alignItems: 'end', height: 220 }}>
      {months.map((m, i) => (
        <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
          <div style={{ display: 'flex', gap: 4, alignItems: 'end', height: 180 }}>
            <div style={{ width: 14, height: `${(m.inc / max) * 100}%`, background: 'var(--success)', borderRadius: '3px 3px 0 0', minHeight: 2 }} title={`Income ${m.inc}€`} />
            <div style={{ width: 14, height: `${(m.spend / max) * 100}%`, background: 'var(--danger)', borderRadius: '3px 3px 0 0', minHeight: 2 }} title={`Spend ${m.spend}€`} />
          </div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{m.label}</div>
        </div>
      ))}
    </div>
  );
}

function ExpensesTab({ state, setState }) {
  const [tagFilter, setTagFilter] = React.useState('all');
  const [search, setSearch] = React.useState('');
  const [addOpen, setAddOpen] = React.useState(false);
  const [editingExpense, setEditingExpense] = React.useState(null);
  const tags = ['all', ...Array.from(new Set(state.expenses.map(e => e.tag)))];
  const rows = state.expenses
    .filter(e => tagFilter === 'all' || e.tag === tagFilter)
    .filter(e => !search || e.source.toLowerCase().includes(search.toLowerCase()));
  const total = rows.reduce((a,b) => a + b.amount, 0);
  const saveExpense = (expense) => setState(s => ({
    ...s,
    expenses: s.expenses.map(e => e.id === expense.id ? expense : e)
  }));
  const deleteExpense = (id) => {
    if (!window.confirm('Delete this expense?')) return;
    setState(s => ({ ...s, expenses: s.expenses.filter(e => e.id !== id) }));
  };
  return (
    <div>
      <div style={{ display: 'flex', gap: 12, marginBottom: 20, alignItems: 'center', flexWrap: 'wrap' }}>
        <Select value={tagFilter} onChange={e => setTagFilter(e.target.value)} style={{ height: 38 }}>
          {tags.map(t => <option key={t}>{t === 'all' ? 'All categories' : t}</option>)}
        </Select>
        <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search" style={{ height: 38, width: 240 }} />
        <div style={{ flex: 1 }} />
        <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>{rows.length} entries · <Amount value={total} size="sm" tone="muted" /></div>
        <Button icon="plus" onClick={() => setAddOpen(true)}>Log expense</Button>
      </div>
      <Card padding="0">
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead><tr style={{ borderBottom: '1px solid var(--border)' }}>
            <th style={thStyle2}>Date</th>
            <th style={thStyle2}>Source</th>
            <th style={thStyle2}>Category</th>
            <th style={{ ...thStyle2, textAlign: 'right' }}>Amount</th>
            <th style={{ ...thStyle2, textAlign: 'right' }}>Actions</th>
          </tr></thead>
          <tbody>
            {rows.slice(0, 60).map(e => (
              <tr key={e.id} style={{ borderBottom: '1px solid var(--border-soft)' }}>
                <td style={{ ...tdStyle2, color: 'var(--text-muted)', fontSize: 12 }} className="mono">{e.date}</td>
                <td style={tdStyle2}>{e.source}</td>
                <td style={{ ...tdStyle2 }}><span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{e.tag}</span></td>
                <td style={{ ...tdStyle2, textAlign: 'right' }}><Amount value={-e.amount} tone="expense" size="sm" /></td>
                <td style={{ ...tdStyle2, textAlign: 'right' }}>
                  <FinanceRowActions onEdit={() => setEditingExpense(e)} onDelete={() => deleteExpense(e.id)} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
      <QuickExpenseModal open={addOpen} onClose={() => setAddOpen(false)} onSave={(x) => setState(s => ({ ...s, expenses: [x, ...s.expenses] }))} />
      <QuickExpenseModal open={!!editingExpense} initial={editingExpense} onClose={() => setEditingExpense(null)} onSave={saveExpense} />
    </div>
  );
}

function IncomeTab({ state, setState }) {
  const total = state.income.reduce((a,b) => a + b.amount, 0);
  return (
    <div>
      <div style={{ display: 'flex', gap: 12, marginBottom: 20, alignItems: 'center' }}>
        <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>{state.income.length} entries · <Amount value={total} size="sm" tone="income" /></div>
      </div>
      <Card padding="0">
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead><tr style={{ borderBottom: '1px solid var(--border)' }}>
            <th style={thStyle2}>Date</th>
            <th style={thStyle2}>Source</th>
            <th style={thStyle2}>Tag</th>
            <th style={{ ...thStyle2, textAlign: 'right' }}>Amount</th>
          </tr></thead>
          <tbody>
            {state.income.map(e => (
              <tr key={e.id} style={{ borderBottom: '1px solid var(--border-soft)' }}>
                <td style={{ ...tdStyle2, color: 'var(--text-muted)', fontSize: 12 }} className="mono">{e.date}</td>
                <td style={tdStyle2}>{e.source}</td>
                <td style={tdStyle2}><span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{e.tag}</span></td>
                <td style={{ ...tdStyle2, textAlign: 'right' }}><Amount value={e.amount} tone="income" size="sm" /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

function SavingsTab({ state, setState, savingsByAccount }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 20 }}>
        {savingsByAccount.map(acc => {
          const pct = Math.min((acc.balance / acc.target_amount) * 100, 100);
          const txs = state.savings.transactions.filter(t => t.account_id === acc.id).slice(0, 4);
          return (
            <Card key={acc.id} padding="var(--space-xl)">
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16, alignItems: 'flex-start' }}>
                <div>
                  <div className="serif" style={{ fontSize: 20, fontWeight: 500, color: 'var(--text-primary)' }}>{acc.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>Target <Amount value={acc.target_amount} size="sm" tone="muted" /></div>
                </div>
                <Amount value={acc.balance} size="xl" tone="accent" />
              </div>
              <div style={{ height: 4, background: 'var(--bg-tertiary)', borderRadius: 2, overflow: 'hidden', marginBottom: 16 }}>
                <div style={{ width: `${pct}%`, height: '100%', background: 'var(--accent)' }} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {txs.map(t => (
                  <div key={t.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                    <span style={{ color: 'var(--text-secondary)' }}>{t.notes || t.transaction_type} <span className="mono" style={{ color: 'var(--text-muted)', marginLeft: 6 }}>{t.date}</span></span>
                    <Amount value={t.transaction_type === 'deposit' ? t.amount : -t.amount} size="sm" tone={t.transaction_type === 'deposit' ? 'income' : 'expense'} />
                  </div>
                ))}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

const thStyle2 = { textAlign: 'left', padding: '14px 20px', fontSize: 11, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)' };
const tdStyle2 = { padding: '14px 20px', fontSize: 14 };

function FinanceRowActions({ onEdit, onDelete }) {
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
      <button onClick={onEdit} title="Edit" style={financeActionButtonStyle}>
        <Icon name="edit" size={14} />
      </button>
      <button onClick={onDelete} title="Delete" style={{ ...financeActionButtonStyle, color: 'var(--danger)' }}>
        <Icon name="trash" size={14} />
      </button>
    </div>
  );
}

const financeActionButtonStyle = {
  width: 30,
  height: 30,
  borderRadius: 'var(--radius-sm)',
  display: 'inline-grid',
  placeItems: 'center',
  color: 'var(--text-muted)',
};

Object.assign(window, { Finance });
