// Finance module — Dashboard + Expenses/Income/Savings detail

function FinanceView({ state, dispatch, openQuick }) {
  const [sub, setSub] = useLocal('finance_sub', 'dashboard');
  const [monthOffset, setMonthOffset] = React.useState(0);

  const targetMonth = (() => {
    const d = new Date(); d.setMonth(d.getMonth() + monthOffset); return iso(d).slice(0, 7);
  })();

  return (
    <div className="fade-in" style={{ padding: '20px 24px', maxWidth: 1600, margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 16 }}>
        <div>
          <div className="sec-label">MODULE · FINANCE.DB</div>
          <h1 style={{ fontSize: 28, fontWeight: 600, margin: '6px 0 0', letterSpacing: '-0.02em' }}>Finance</h1>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn" onClick={() => openQuick('expense')}><Icon.Plus size={12}/> Expense</button>
          <button className="btn" onClick={() => openQuick('income')}><Icon.Plus size={12}/> Income</button>
          <button className="btn" onClick={() => openQuick('deposit')}><Icon.Plus size={12}/> Deposit</button>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 0, marginBottom: 16, borderBottom: '1px solid var(--border)' }}>
        {[
          { v: 'dashboard', label: 'DASHBOARD' },
          { v: 'expenses', label: 'EXPENSES', count: state.expenses.length },
          { v: 'income', label: 'INCOME', count: state.income.length },
          { v: 'savings', label: 'SAVINGS', count: state.savings_accounts.length },
        ].map(t => (
          <button key={t.v} onClick={() => setSub(t.v)} className="mono t-12"
            style={{
              padding: '10px 16px', borderBottom: '2px solid ' + (sub === t.v ? 'var(--blue)' : 'transparent'),
              color: sub === t.v ? 'var(--text-0)' : 'var(--text-3)', letterSpacing: '0.1em',
              marginBottom: -1,
            }}>
            {t.label} {t.count != null && <span style={{ color: 'var(--text-4)', marginLeft: 4 }}>{t.count}</span>}
          </button>
        ))}
      </div>

      {sub === 'dashboard' && <FinanceDashboard state={state} monthOffset={monthOffset} setMonthOffset={setMonthOffset} targetMonth={targetMonth}/>}
      {sub === 'expenses' && <ExpensesList state={state} dispatch={dispatch} openQuick={openQuick}/>}
      {sub === 'income' && <IncomeList state={state} dispatch={dispatch}/>}
      {sub === 'savings' && <SavingsView state={state} dispatch={dispatch}/>}
    </div>
  );
}

function FinanceDashboard({ state, monthOffset, setMonthOffset, targetMonth }) {
  const monthExp = state.expenses.filter(e => e.date.startsWith(targetMonth));
  const monthInc = state.income.filter(e => e.date.startsWith(targetMonth));
  const totalExp = monthExp.reduce((s, e) => s + e.amount, 0);
  const totalInc = monthInc.reduce((s, e) => s + e.amount, 0);
  const net = totalInc - totalExp;
  const savingsRate = totalInc > 0 ? (net / totalInc) * 100 : 0;

  // By tag for donut
  const byTag = {};
  monthExp.forEach(e => { byTag[e.tag] = (byTag[e.tag] || 0) + e.amount; });
  const donutData = Object.entries(byTag)
    .sort((a, b) => b[1] - a[1])
    .map(([tag, value]) => ({ label: tag, value, color: tagColor(tag) }));

  // Trend: last 6 months
  const trend = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(); d.setMonth(d.getMonth() - i + monthOffset);
    const ym = iso(d).slice(0, 7);
    const exp = state.expenses.filter(e => e.date.startsWith(ym)).reduce((s, e) => s + e.amount, 0);
    const inc = state.income.filter(e => e.date.startsWith(ym)).reduce((s, e) => s + e.amount, 0);
    trend.push({ label: d.toLocaleDateString('en', { month: 'short' }), expense: exp, income: inc });
  }

  const biggest = [...monthExp].sort((a, b) => b.amount - a.amount)[0];
  const diningLast = [...state.expenses].filter(e => e.tag === 'Dining Out').sort((a,b) => b.date.localeCompare(a.date))[0];
  const daysSinceDining = diningLast ? Math.round((Date.now() - new Date(diningLast.date).getTime()) / 86400000) : '—';

  // Savings
  const savingsData = state.savings_accounts.map(acc => {
    const txs = state.savings_tx.filter(t => t.account_id === acc.id);
    const bal = txs.reduce((sm, t) => sm + (t.transaction_type === 'deposit' ? t.amount : -t.amount), 0);
    return { ...acc, balance: bal };
  });

  return (
    <div>
      {/* Month selector */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
        <button className="btn btn-icon" onClick={() => setMonthOffset(monthOffset - 1)}><Icon.ChevronLeft size={14}/></button>
        <div className="mono" style={{ fontSize: 18, fontWeight: 600, minWidth: 180, textAlign: 'center' }}>
          {new Date(targetMonth + '-01').toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}
        </div>
        <button className="btn btn-icon" onClick={() => setMonthOffset(Math.min(0, monthOffset + 1))}><Icon.ChevronRight size={14}/></button>
        <span className="mono t-11" style={{ color: 'var(--text-4)', marginLeft: 8 }}>{monthOffset === 0 ? '· CURRENT' : monthOffset < 0 ? '· HISTORICAL' : ''}</span>
      </div>

      {/* KPI row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 16 }}>
        <BigStat label="INCOME" value={fmtEUR(totalInc)} color="var(--green)" sub={monthInc.length + ' sources'} icon={<Icon.ArrowDown size={14}/>}/>
        <BigStat label="EXPENSES" value={fmtEUR(totalExp)} color="var(--red)" sub={monthExp.length + ' transactions'} icon={<Icon.ArrowUp size={14}/>}/>
        <BigStat label="NET" value={fmtEUR(net)} color={net >= 0 ? 'var(--text-0)' : 'var(--red)'} sub={(net >= 0 ? 'surplus' : 'deficit')}/>
        <BigStat label="SAVINGS RATE" value={savingsRate.toFixed(0) + '%'} color="var(--cyan)" sub="of income"/>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
        {/* Donut */}
        <div className="card hud card-pad">
          <HUDBrackets/>
          <div className="sec-label" style={{ marginBottom: 14 }}>EXPENSE BREAKDOWN · BY TAG</div>
          <div style={{ display: 'flex', gap: 18, alignItems: 'center' }}>
            <div style={{ position: 'relative', width: 160, height: 160, flex: '0 0 auto' }}>
              <Donut data={donutData} size={160} thickness={14}/>
              <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <div className="mono t-11" style={{ color: 'var(--text-3)' }}>TOTAL</div>
                <div className="mono" style={{ fontSize: 20, fontWeight: 600 }}>{fmtEURshort(totalExp)}</div>
              </div>
            </div>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
              {donutData.slice(0, 7).map(d => (
                <div key={d.label} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span className="dot" style={{ background: d.color }}/>
                  <span className="t-12" style={{ flex: 1 }}>{d.label}</span>
                  <span className="mono t-12" style={{ color: 'var(--text-2)' }}>{fmtEUR(d.value)}</span>
                  <span className="mono t-11" style={{ color: 'var(--text-4)', width: 36, textAlign: 'right' }}>{(d.value / totalExp * 100).toFixed(0)}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* 6-month trend */}
        <div className="card hud card-pad">
          <HUDBrackets/>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 14 }}>
            <div className="sec-label">INCOME vs EXPENSES · 6 MONTHS</div>
            <div style={{ display: 'flex', gap: 10 }}>
              <span className="t-11" style={{ color: 'var(--text-2)' }}><span className="dot" style={{ background: 'var(--green)' }}/> Income</span>
              <span className="t-11" style={{ color: 'var(--text-2)' }}><span className="dot" style={{ background: 'var(--red)' }}/> Expense</span>
            </div>
          </div>
          <div style={{ height: 160 }}>
            <BarChart data={trend} height={130}/>
          </div>
        </div>
      </div>

      {/* Savings progress + Telemetry */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16 }}>
        <div className="card hud card-pad">
          <HUDBrackets/>
          <div className="sec-label" style={{ marginBottom: 14 }}>SAVINGS · PROGRESS TO TARGET</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {savingsData.map(acc => (
              <div key={acc.id}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <div>
                    <span className="t-13">{acc.name}</span>
                    <span className="mono t-11" style={{ color: 'var(--text-3)', marginLeft: 8 }}>
                      {fmtEUR(acc.balance)} <span style={{ color: 'var(--text-4)' }}>/ {fmtEUR(acc.target_amount)}</span>
                    </span>
                  </div>
                  <span className="mono t-12">{((acc.balance / acc.target_amount) * 100).toFixed(1)}%</span>
                </div>
                <div className="bar" style={{ height: 8 }}>
                  <i style={{ width: Math.min(100, (acc.balance / acc.target_amount) * 100) + '%',
                              background: 'linear-gradient(90deg, var(--cyan), var(--blue))' }}/>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="card hud card-pad">
          <HUDBrackets/>
          <div className="sec-label" style={{ marginBottom: 14 }}>QUICK STATS</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <StatLine label="Biggest expense" value={biggest ? fmtEUR(biggest.amount) : '—'} sub={biggest?.source}/>
            <StatLine label="Days since dining out" value={daysSinceDining + 'd'}/>
            <StatLine label="Avg daily burn" value={fmtEURshort(totalExp / (new Date().getDate() || 1))}/>
            <StatLine label="Transactions / day" value={(monthExp.length / (new Date().getDate() || 1)).toFixed(1)}/>
            <StatLine label="Fixed / variable" value={
              (monthExp.filter(e => ['Rent/Mortgage','Utilities','Insurance'].includes(e.tag)).reduce((s,e)=>s+e.amount,0) / (totalExp||1) * 100).toFixed(0) + '%'
            } sub="fixed cost ratio"/>
          </div>
        </div>
      </div>
    </div>
  );
}

function BigStat({ label, value, color, sub, icon }) {
  return (
    <div className="card card-tight hud" style={{ padding: 14 }}>
      <HUDBrackets/>
      <div className="sec-label" style={{ marginBottom: 8 }}>{label}</div>
      <div className="mono" style={{ fontSize: 26, fontWeight: 600, color, letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: 6 }}>
        {icon} {value}
      </div>
      <div className="mono t-11" style={{ color: 'var(--text-3)', marginTop: 4 }}>{sub}</div>
    </div>
  );
}

function StatLine({ label, value, sub }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
      <div>
        <div className="t-12" style={{ color: 'var(--text-2)' }}>{label}</div>
        {sub && <div className="t-11" style={{ color: 'var(--text-4)', marginTop: 2 }}>{sub}</div>}
      </div>
      <div className="mono" style={{ fontSize: 15, fontWeight: 600 }}>{value}</div>
    </div>
  );
}

function ExpensesList({ state, dispatch, openQuick }) {
  const [tagFilter, setTagFilter] = React.useState(null);
  const [monthFilter, setMonthFilter] = React.useState(iso(new Date()).slice(0, 7));
  const rows = state.expenses
    .filter(e => !monthFilter || e.date.startsWith(monthFilter))
    .filter(e => !tagFilter || e.tag === tagFilter);
  const total = rows.reduce((s, e) => s + e.amount, 0);
  const tags = Array.from(new Set(state.expenses.map(e => e.tag)));
  return (
    <div className="card hud" style={{ padding: 0, overflow: 'hidden' }}>
      <HUDBrackets/>
      <div style={{ padding: '14px 16px', display: 'flex', gap: 10, alignItems: 'center', borderBottom: '1px solid var(--border)' }}>
        <span className="sec-label">FILTER</span>
        <input type="month" className="input mono" style={{ width: 150 }} value={monthFilter} onChange={e => setMonthFilter(e.target.value)}/>
        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
          <button className="btn btn-sm" style={{ background: !tagFilter ? 'var(--bg-4)' : 'transparent' }} onClick={() => setTagFilter(null)}>All</button>
          {tags.map(t => (
            <button key={t} className="btn btn-sm" onClick={() => setTagFilter(t === tagFilter ? null : t)}
              style={{ color: tagFilter === t ? tagColor(t) : 'var(--text-2)', borderColor: tagFilter === t ? tagColor(t) : 'var(--border-2)' }}>
              <span className="dot" style={{ background: tagColor(t) }}/> {t}
            </button>
          ))}
        </div>
        <span style={{ flex: 1 }}/>
        <div className="mono t-12" style={{ color: 'var(--text-2)' }}>
          {rows.length} rows · <span style={{ color: 'var(--text-0)', fontWeight: 600 }}>{fmtEUR(total)}</span>
        </div>
      </div>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
        <thead>
          <tr style={{ background: 'var(--bg-3)' }}>
            <th style={thStyle}>Date</th>
            <th style={thStyle}>Source</th>
            <th style={thStyle}>Tag</th>
            <th style={{...thStyle, textAlign: 'right'}}>Amount</th>
            <th style={thStyle}>Notes</th>
            <th style={thStyle}></th>
          </tr>
        </thead>
        <tbody>
          {rows.map((e, i) => (
            <tr key={e.id} style={{ borderBottom: '1px solid var(--border)', background: i % 2 ? 'rgba(255,255,255,0.015)' : 'transparent' }}>
              <td style={{ ...tdStyle, color: 'var(--text-2)' }} className="mono t-12">{fmtDate(e.date)}</td>
              <td style={tdStyle}>{e.source}</td>
              <td style={tdStyle}>
                <span className="pill" style={{ color: tagColor(e.tag), borderColor: tagColor(e.tag) + '40', background: tagColor(e.tag) + '15' }}>
                  <span className="dot" style={{ background: tagColor(e.tag) }}/> {e.tag}
                </span>
              </td>
              <td style={{ ...tdStyle, textAlign: 'right', color: 'var(--red)', fontWeight: 600 }} className="mono">-{fmtEUR(e.amount)}</td>
              <td style={{ ...tdStyle, color: 'var(--text-3)' }} className="t-12">{e.notes || '—'}</td>
              <td style={tdStyle}>
                <button className="btn btn-icon btn-ghost" onClick={() => dispatch({ type: 'delete_expense', id: e.id })}><Icon.Trash size={12}/></button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function IncomeList({ state, dispatch }) {
  const rows = state.income;
  const total = rows.reduce((s, e) => s + e.amount, 0);
  return (
    <div className="card hud" style={{ padding: 0, overflow: 'hidden' }}>
      <HUDBrackets/>
      <div style={{ padding: '14px 16px', display: 'flex', gap: 10, alignItems: 'center', borderBottom: '1px solid var(--border)' }}>
        <span className="sec-label">ALL INCOME</span>
        <span style={{ flex: 1 }}/>
        <div className="mono t-12" style={{ color: 'var(--text-2)' }}>
          {rows.length} rows · <span style={{ color: 'var(--green)', fontWeight: 600 }}>+{fmtEUR(total)}</span>
        </div>
      </div>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
        <thead><tr style={{ background: 'var(--bg-3)' }}>
          <th style={thStyle}>Date</th><th style={thStyle}>Source</th><th style={thStyle}>Tag</th><th style={{...thStyle, textAlign: 'right'}}>Amount</th>
        </tr></thead>
        <tbody>
          {rows.map((e, i) => (
            <tr key={e.id} style={{ borderBottom: '1px solid var(--border)', background: i % 2 ? 'rgba(255,255,255,0.015)' : 'transparent' }}>
              <td style={{ ...tdStyle, color: 'var(--text-2)' }} className="mono t-12">{fmtDate(e.date)}</td>
              <td style={tdStyle}>{e.source}</td>
              <td style={tdStyle}><span className="pill pill-cyan">{e.tag}</span></td>
              <td style={{ ...tdStyle, textAlign: 'right', color: 'var(--green)', fontWeight: 600 }} className="mono">+{fmtEUR(e.amount)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function SavingsView({ state, dispatch }) {
  const [selectedId, setSelectedId] = React.useState(state.savings_accounts[0]?.id);
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: 16 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {state.savings_accounts.map(acc => {
          const txs = state.savings_tx.filter(t => t.account_id === acc.id);
          const bal = txs.reduce((sm, t) => sm + (t.transaction_type === 'deposit' ? t.amount : -t.amount), 0);
          const pct = (bal / acc.target_amount) * 100;
          const active = selectedId === acc.id;
          return (
            <button key={acc.id} onClick={() => setSelectedId(acc.id)} className="card hud"
              style={{ padding: 14, textAlign: 'left', borderColor: active ? 'var(--blue)' : 'var(--border)' }}>
              <HUDBrackets color={active ? 'rgba(59,130,246,0.6)' : 'rgba(59,130,246,0.25)'}/>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span className="t-14" style={{ fontWeight: 500 }}>{acc.name}</span>
                <span className="mono t-11" style={{ color: 'var(--text-3)' }}>{txs.length} tx</span>
              </div>
              <div className="mono" style={{ fontSize: 22, fontWeight: 600, color: 'var(--cyan)' }}>{fmtEUR(bal)}</div>
              <div className="mono t-11" style={{ color: 'var(--text-3)', marginBottom: 8 }}>of {fmtEUR(acc.target_amount)} · {pct.toFixed(1)}%</div>
              <div className="bar" style={{ height: 4 }}>
                <i style={{ width: Math.min(100, pct) + '%', background: 'linear-gradient(90deg, var(--cyan), var(--blue))' }}/>
              </div>
            </button>
          );
        })}
      </div>
      <div className="card hud" style={{ padding: 0, overflow: 'hidden' }}>
        <HUDBrackets/>
        <div className="sec-label" style={{ padding: 14, borderBottom: '1px solid var(--border)' }}>TRANSACTIONS · {state.savings_accounts.find(a => a.id === selectedId)?.name}</div>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead><tr style={{ background: 'var(--bg-3)' }}>
            <th style={thStyle}>Date</th><th style={thStyle}>Type</th><th style={{...thStyle, textAlign: 'right'}}>Amount</th><th style={thStyle}>Notes</th>
          </tr></thead>
          <tbody>
            {state.savings_tx.filter(t => t.account_id === selectedId).sort((a,b) => b.date.localeCompare(a.date)).map((t, i) => (
              <tr key={t.id} style={{ borderBottom: '1px solid var(--border)', background: i % 2 ? 'rgba(255,255,255,0.015)' : 'transparent' }}>
                <td style={{ ...tdStyle, color: 'var(--text-2)' }} className="mono t-12">{fmtDate(t.date)}</td>
                <td style={tdStyle}>
                  {t.transaction_type === 'deposit'
                    ? <span className="pill pill-done"><Icon.ArrowDown size={10}/> Deposit</span>
                    : <span className="pill pill-blocked"><Icon.ArrowUp size={10}/> Withdrawal</span>}
                </td>
                <td style={{ ...tdStyle, textAlign: 'right', color: t.transaction_type === 'deposit' ? 'var(--green)' : 'var(--red)', fontWeight: 600 }} className="mono">
                  {t.transaction_type === 'deposit' ? '+' : '-'}{fmtEUR(t.amount)}
                </td>
                <td style={{ ...tdStyle, color: 'var(--text-3)' }} className="t-12">{t.notes || '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

Object.assign(window, { FinanceView });
