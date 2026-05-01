// Home dashboard — Engineer's cockpit landing view

function HomeView({ state, dispatch, openQuick }) {
  const now = new Date();
  const hour = now.getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Bonsoir';
  const name = 'Ahmad';

  // Today tasks
  const todayStr = iso(now);
  const tasks = state.tasks;
  const todayTasks = tasks.filter(t => t.status !== 'done' && (t.due_date === todayStr || (t.due_date && t.due_date < todayStr)))
    .sort((a, b) => a.priority.localeCompare(b.priority))
    .slice(0, 5);

  // Upcoming
  const upcoming = tasks.filter(t => t.status !== 'done' && t.due_date > todayStr)
    .sort((a, b) => a.due_date.localeCompare(b.due_date))
    .slice(0, 4);

  // Finance pulse
  const ym = todayStr.slice(0, 7);
  const monthExpenses = state.expenses.filter(e => e.date.startsWith(ym)).reduce((s, e) => s + e.amount, 0);
  const monthIncome = state.income.filter(e => e.date.startsWith(ym)).reduce((s, e) => s + e.amount, 0);
  const net = monthIncome - monthExpenses;

  // Last 14 days net
  const days = [];
  for (let i = 13; i >= 0; i--) {
    const d = daysFromNow(-i);
    const inc = state.income.filter(x => x.date === d).reduce((s, x) => s + x.amount, 0);
    const exp = state.expenses.filter(x => x.date === d).reduce((s, x) => s + x.amount, 0);
    days.push(inc - exp);
  }

  // Learning streak
  const streakDays = (() => {
    let streak = 0;
    for (let i = 0; i < 30; i++) {
      const d = daysFromNow(-i);
      const has = state.learning.some(dom => (dom.sessions_minutes_per_day || [])[13 - i > 0 ? 13 - i : 0] > 0);
      if (has) streak++; else if (i > 0) break;
    }
    return streak;
  })();

  // Savings total
  const savingsTotal = state.savings_accounts.reduce((s, acc) => {
    const bal = state.savings_tx.filter(t => t.account_id === acc.id)
      .reduce((sm, t) => sm + (t.transaction_type === 'deposit' ? t.amount : -t.amount), 0);
    return s + bal;
  }, 0);

  return (
    <div className="fade-in" style={{ padding: '20px 24px', maxWidth: 1400, margin: '0 auto' }}>
      {/* Greeting strip */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 20 }}>
        <div>
          <div className="sec-label">MAIN · {now.toLocaleDateString('en-GB', { weekday: 'long' }).toUpperCase()} · {fmtDateFull(now).toUpperCase()}</div>
          <h1 style={{ fontSize: 32, fontWeight: 600, margin: '8px 0 0', letterSpacing: '-0.02em' }}>
            {greeting}, {name}<span style={{ color: 'var(--cyan)' }}>.</span>
          </h1>
          <div className="mono t-12" style={{ color: 'var(--text-3)', marginTop: 6 }}>
            {todayTasks.length} open · {upcoming.length} upcoming · Montpellier, 22°C clear
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn" onClick={() => openQuick('expense')}><Icon.Plus size={12}/> Expense <kbd className="mono t-11" style={{ color: 'var(--text-4)', marginLeft: 2 }}>E</kbd></button>
          <button className="btn" onClick={() => openQuick('task')}><Icon.Plus size={12}/> Task <kbd className="mono t-11" style={{ color: 'var(--text-4)', marginLeft: 2 }}>N</kbd></button>
          <button className="btn" onClick={() => openQuick('session')}><Icon.Plus size={12}/> Session</button>
        </div>
      </div>

      {/* Stat strip */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 20 }}>
        <StatCard label="NET / MONTH" value={fmtEUR(net)}
                  sub={`${fmtEURshort(monthIncome)} in · ${fmtEURshort(monthExpenses)} out`}
                  trend={<Sparkline data={days} stroke={net >= 0 ? 'var(--green)' : 'var(--red)'} fill={net >= 0 ? 'rgba(34,197,94,0.12)' : 'rgba(239,68,68,0.12)'} width={80} height={28}/>}
                  positive={net >= 0}/>
        <StatCard label="OPEN TASKS" value={tasks.filter(t => t.status !== 'done').length}
                  sub={`${tasks.filter(t => t.status === 'in_progress').length} in flight`}
                  trend={<BarMini data={[4,6,3,5,7,4,8,5,6,4,5,7,6,5]} color="var(--blue)" width={80} height={28}/>}/>
        <StatCard label="SAVINGS · TOTAL" value={fmtEUR(savingsTotal)}
                  sub={`${state.savings_accounts.length} accounts`}
                  trend={<Sparkline data={[28000,29500,30000,31500,33000,34500,35800,37000,38200,savingsTotal]} stroke="var(--cyan)" fill="rgba(6,182,212,0.12)" width={80} height={28}/>}/>
        <StatCard label="LEARNING · STREAK" value={streakDays + 'd'}
                  sub={`${state.learning.filter(l => l.status === 'in_progress').length} active domains`}
                  trend={<BarMini data={state.learning[0]?.sessions_minutes_per_day || []} color="var(--amber)" width={80} height={28}/>}
                  icon={<Icon.Flame size={12}/>}/>
      </div>

      {/* Grid: Today focus + right column */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: 16 }}>
        {/* TODAY FOCUS */}
        <div className="card hud card-pad">
          <HUDBrackets/>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <div className="sec-label">TODAY · FOCUS QUEUE</div>
            <span className="mono t-11" style={{ color: 'var(--text-3)' }}>{todayTasks.length} items</span>
          </div>
          {todayTasks.length === 0 ? (
            <EmptyInline icon={<Icon.Check size={18}/>} text="Clear. Nothing due today — rare and beautiful."/>
          ) : (
            <div>
              {todayTasks.map((t, i) => (
                <TaskRow key={t.id} task={t} index={i}
                  onToggle={() => dispatch({ type: 'toggle_task', id: t.id })}/>
              ))}
            </div>
          )}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* ACTIVITY FEED */}
          <div className="card hud card-pad">
            <HUDBrackets/>
            <div className="sec-label" style={{ marginBottom: 12, display: 'flex', justifyContent: 'space-between' }}>
              <span><span className="live-dot" style={{ color: 'var(--green)' }}>●</span> ACTIVITY · LIVE</span>
              <span className="mono t-11" style={{ color: 'var(--text-4)' }}>T+{(Date.now()/1000|0).toString().slice(-6)}</span>
            </div>
            {state.activity.slice(0, 5).map(a => <ActivityRow key={a.id} a={a}/>)}
          </div>

          {/* UPCOMING */}
          <div className="card hud card-pad">
            <HUDBrackets/>
            <div className="sec-label" style={{ marginBottom: 12 }}>UPCOMING</div>
            {upcoming.length === 0 && <div className="t-13" style={{ color: 'var(--text-3)' }}>Horizon clear.</div>}
            {upcoming.map(t => (
              <div key={t.id} style={{ display: 'flex', gap: 10, padding: '8px 0', borderBottom: '1px solid var(--border)', alignItems: 'center' }}>
                <span className={'dot ' + (t.type === 'work' ? 'dot-doing' : 'dot-done')} style={{ background: t.type === 'work' ? 'var(--blue)' : 'var(--cyan)' }}/>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="t-13" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{t.title}</div>
                </div>
                <span className="mono t-11" style={{ color: 'var(--text-3)' }}>{relativeDay(t.due_date)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom strip: 3 telemetry-ish panels */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginTop: 16 }}>
        <LearningMiniPanel learning={state.learning}/>
        <FinancePulsePanel state={state}/>
        <TelemetryPanel state={state}/>
      </div>
    </div>
  );
}

function StatCard({ label, value, sub, trend, positive, icon }) {
  return (
    <div className="card card-tight hud" style={{ padding: 14, position: 'relative' }}>
      <HUDBrackets/>
      <div className="sec-label" style={{ marginBottom: 10 }}>{label}</div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 8 }}>
        <div style={{ minWidth: 0 }}>
          <div className="mono" style={{ fontSize: 22, fontWeight: 600, color: positive === false ? 'var(--red)' : (positive ? 'var(--green)' : 'var(--text-0)'), letterSpacing: '-0.02em' }}>
            {icon}{icon ? ' ' : null}{value}
          </div>
          <div className="mono t-11" style={{ color: 'var(--text-3)', marginTop: 4 }}>{sub}</div>
        </div>
        <div style={{ flex: '0 0 auto' }}>{trend}</div>
      </div>
    </div>
  );
}

function TaskRow({ task, onToggle, index }) {
  return (
    <div style={{
      display: 'grid', gridTemplateColumns: 'auto 28px 1fr auto auto', gap: 12, alignItems: 'center',
      padding: '10px 0', borderBottom: '1px solid var(--border)',
    }}>
      <span className="mono t-11" style={{ color: 'var(--text-4)', width: 18 }}>{String(index + 1).padStart(2, '0')}</span>
      <button onClick={onToggle} style={{
        width: 18, height: 18, borderRadius: 4, border: '1.5px solid var(--border-2)',
        background: task.status === 'done' ? 'var(--green)' : 'transparent',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        {task.status === 'done' && <Icon.Check size={12} style={{ color: '#000' }}/>}
      </button>
      <div style={{ minWidth: 0, overflow: 'hidden' }}>
        <div className="t-13" style={{
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
          color: task.status === 'done' ? 'var(--text-4)' : 'var(--text-1)',
          textDecoration: task.status === 'done' ? 'line-through' : 'none',
        }}>{task.title}</div>
        <div style={{ display: 'flex', gap: 8, marginTop: 3 }}>
          {task.jira_ref && <span className="mono t-11" style={{ color: 'var(--cyan)' }}>{task.jira_ref}</span>}
          <span className="mono t-11" style={{ color: 'var(--text-3)' }}>
            {task.type === 'work' ? task.project : task.category}
          </span>
        </div>
      </div>
      <PriorityPill priority={task.priority}/>
      <span className="mono t-11" style={{ color: task.due_date < iso(new Date()) && task.status !== 'done' ? 'var(--red)' : 'var(--text-3)', minWidth: 70, textAlign: 'right' }}>
        {relativeDay(task.due_date)}
      </span>
    </div>
  );
}

function ActivityRow({ a }) {
  const iconMap = { tasks: 'var(--blue)', expenses: 'var(--red)', income: 'var(--green)', savings: 'var(--cyan)', learning: 'var(--amber)' };
  const t = new Date(a.when);
  return (
    <div style={{ display: 'flex', gap: 10, padding: '6px 0', alignItems: 'center' }}>
      <span className="mono t-11" style={{ color: 'var(--text-4)', width: 40 }}>{t.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}</span>
      <span className="dot" style={{ background: iconMap[a.module] }}/>
      <div className="t-12" style={{ flex: 1, color: 'var(--text-2)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{a.summary}</div>
    </div>
  );
}

function EmptyInline({ icon, text }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '24px 12px', color: 'var(--text-3)' }}>
      <div style={{ width: 32, height: 32, borderRadius: 6, background: 'var(--bg-3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{icon}</div>
      <span className="t-13">{text}</span>
    </div>
  );
}

function LearningMiniPanel({ learning }) {
  const active = learning.filter(l => l.status === 'in_progress').slice(0, 3);
  return (
    <div className="card hud card-pad">
      <HUDBrackets/>
      <div className="sec-label" style={{ marginBottom: 12 }}>LEARNING · ACTIVE DOMAINS</div>
      {active.map(l => (
        <div key={l.id} style={{ marginBottom: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
            <span className="t-13">{l.title}</span>
            <span className="mono t-11" style={{ color: 'var(--text-2)' }}>{l.progress}%</span>
          </div>
          <Progress value={l.progress} label={null} color="var(--amber)" height={4}/>
        </div>
      ))}
    </div>
  );
}

function FinancePulsePanel({ state }) {
  const ym = iso(new Date()).slice(0, 7);
  const byTag = {};
  state.expenses.filter(e => e.date.startsWith(ym)).forEach(e => {
    byTag[e.tag] = (byTag[e.tag] || 0) + e.amount;
  });
  const top = Object.entries(byTag).sort((a, b) => b[1] - a[1]).slice(0, 5);
  const total = top.reduce((s, [,v]) => s + v, 0) || 1;
  return (
    <div className="card hud card-pad">
      <HUDBrackets/>
      <div className="sec-label" style={{ marginBottom: 12 }}>FINANCE · TOP BURN · {ym}</div>
      {top.map(([tag, amt]) => (
        <div key={tag} style={{ marginBottom: 10 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
            <span className="t-12" style={{ color: 'var(--text-1)' }}>
              <span className="dot" style={{ background: tagColor(tag), marginRight: 6 }}/> {tag}
            </span>
            <span className="mono t-12">{fmtEUR(amt)}</span>
          </div>
          <div className="bar" style={{ height: 3 }}>
            <i style={{ width: (amt / total * 100) + '%', background: tagColor(tag) }}/>
          </div>
        </div>
      ))}
    </div>
  );
}

function TelemetryPanel({ state }) {
  const ym = iso(new Date()).slice(0, 7);
  const diningDays = (() => {
    const d = [...state.expenses].filter(e => e.tag === 'Dining Out').sort((a,b) => b.date.localeCompare(a.date))[0];
    if (!d) return '—';
    return Math.round((Date.now() - new Date(d.date).getTime()) / 86400000) + 'd';
  })();
  const biggest = state.expenses.filter(e => e.date.startsWith(ym)).sort((a, b) => b.amount - a.amount)[0];
  const grocerySum = state.expenses.filter(e => e.date.startsWith(ym) && e.tag === 'Groceries').reduce((s, e) => s + e.amount, 0);
  return (
    <div className="card hud card-pad">
      <HUDBrackets/>
      <div className="sec-label" style={{ marginBottom: 12 }}>TELEMETRY</div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <Metric label="Biggest expense" value={biggest ? fmtEURshort(biggest.amount) : '—'} sub={biggest ? biggest.source : ''}/>
        <Metric label="Days since dining" value={diningDays} sub="last observed"/>
        <Metric label="Groceries MTD" value={fmtEURshort(grocerySum)} sub="this month"/>
        <Metric label="CPU · async" value="0.84" sub="agents queue" color="var(--cyan)"/>
      </div>
      <TelemetryStream lines={[
        'task sync ok · ' + state.tasks.length + ' rows',
        'expense ingestion · 12 in last 24h',
        'savings projection · on track +' + fmtEURshort(800) + '/mo',
        'learning engine · ' + state.learning.filter(l => l.status === 'in_progress').length + ' domains active',
        'idle · ready',
      ]}/>
    </div>
  );
}

function Metric({ label, value, sub, color }) {
  return (
    <div style={{ borderLeft: '2px solid var(--border-2)', paddingLeft: 10 }}>
      <div className="mono t-11" style={{ color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</div>
      <div className="mono" style={{ fontSize: 18, fontWeight: 600, color: color || 'var(--text-0)', marginTop: 2 }}>{value}</div>
      {sub && <div className="t-11" style={{ color: 'var(--text-4)', marginTop: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{sub}</div>}
    </div>
  );
}

Object.assign(window, { HomeView, TaskRow, StatCard, ActivityRow });
