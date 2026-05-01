// Home — Atelier dashboard
function Home({ state, setState, openModal }) {
  const today = new Date();
  const hour = today.getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
  const dateStr = today.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' });

  const tasks = state.tasks;
  const expenses = state.expenses;
  const income = state.income;
  const family = state.family;

  const todayISO = window.iso(today);
  const todaysTasks = tasks.filter(t => t.status !== 'done' && t.due_date <= todayISO);
  const overdue = tasks.filter(t => t.status !== 'done' && t.due_date < todayISO);

  // Month finance
  const ym = todayISO.slice(0, 7);
  const monthExpenses = expenses.filter(e => e.date.startsWith(ym));
  const monthSpend = monthExpenses.reduce((a, b) => a + b.amount, 0);
  const monthIncome = income.filter(i => i.date.startsWith(ym)).reduce((a, b) => a + b.amount, 0);
  const dayOfMonth = today.getDate();
  const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
  const burnRate = monthSpend / dayOfMonth;
  const projected = burnRate * daysInMonth;

  // Family balance
  const famExpense = family.transactions.filter(t => t.transaction_type === 'expense').reduce((a,b) => a + b.amount, 0);
  const famIncome = family.transactions.filter(t => t.transaction_type === 'income').reduce((a,b) => a + b.amount, 0);
  const famNet = famIncome - famExpense;

  // Learning streak (minutes today)
  const learnMinutes = state.learning.reduce((a, d) => a + (d.sessions_minutes_per_day?.[d.sessions_minutes_per_day.length - 1] || 0), 0);

  return (
    <PageContainer>
      <PageTitle eyebrow={dateStr}>
        {greeting}, Ahmad.
      </PageTitle>

      {/* Quick stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 20, marginBottom: 40 }}>
        <StatCard
          label="Month spend"
          value={<Amount value={monthSpend} size="xl" tone="neutral" />}
          hint={<>Projected <Amount value={projected} size="sm" tone="muted" /></>}
          trend={<Sparkline data={monthExpenses.reduce((acc, e) => { const d = e.date.slice(8, 10); acc[parseInt(d)] = (acc[parseInt(d)] || 0) + e.amount; return acc; }, Array(dayOfMonth).fill(0))} color="var(--danger)" />}
        />
        <StatCard
          label="Month income"
          value={<Amount value={monthIncome} size="xl" tone="neutral" />}
          hint={<>Net <Amount value={monthIncome - monthSpend} size="sm" tone={monthIncome > monthSpend ? 'income' : 'expense'} /></>}
          trend={<Sparkline data={[0,0,0,4120,4120,4120,4120]} color="var(--success)" />}
        />
        <StatCard
          label="Tasks today"
          value={<span className="mono" style={{ fontSize: 28, letterSpacing: '-0.01em' }}>{todaysTasks.length}<span style={{ color: 'var(--text-muted)', fontSize: 16 }}> / {tasks.filter(t => t.status !== 'done').length}</span></span>}
          hint={overdue.length > 0 ? <span style={{ color: 'var(--danger)' }}>{overdue.length} overdue</span> : <span style={{ color: 'var(--success)' }}>On track</span>}
        />
        <StatCard
          label="Family balance"
          value={<Amount value={famNet} size="xl" tone={famNet >= 0 ? 'accent' : 'expense'} />}
          hint={`${family.transactions.length} entries`}
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: 24, marginBottom: 24 }}>
        {/* Today focus */}
        <Card padding="var(--space-xl)">
          <SectionTitle eyebrow="Today" right={
            <Button variant="ghost" size="sm" icon="arrowRight" onClick={() => window.dispatchEvent(new CustomEvent('atelier:route', { detail: 'tasks' }))}>View all</Button>
          }>Focus queue</SectionTitle>
          {todaysTasks.length === 0 ? (
            <div style={{ padding: '32px 0', textAlign: 'center', color: 'var(--text-muted)' }}>
              <div className="serif" style={{ fontSize: 18, marginBottom: 8, color: 'var(--text-secondary)' }}>A clear afternoon.</div>
              <div style={{ fontSize: 13 }}>Nothing due today.</div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {todaysTasks.slice(0, 6).map((t, i) => (
                <TaskRow key={t.id} task={t} onToggle={() => {
                  setState(s => ({ ...s, tasks: s.tasks.map(x => x.id === t.id ? { ...x, status: x.status === 'done' ? 'todo' : 'done' } : x) }));
                }} />
              ))}
            </div>
          )}
        </Card>

        {/* This week's rhythm */}
        <Card padding="var(--space-xl)">
          <SectionTitle eyebrow="This week">Rhythm</SectionTitle>
          <WeekRhythm state={state} />
        </Card>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 24 }}>
        {/* Recent expenses */}
        <Card padding="var(--space-xl)">
          <SectionTitle eyebrow="Ledger">Recent spend</SectionTitle>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {expenses.slice(0, 5).map((e, i) => (
              <div key={e.id} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '10px 0',
                borderBottom: i < 4 ? '1px solid var(--border-soft)' : 'none',
              }}>
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div style={{ fontSize: 13, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{e.source}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{e.tag} · {relativeDate(e.date)}</div>
                </div>
                <Amount value={-e.amount} size="sm" tone="expense" />
              </div>
            ))}
          </div>
        </Card>

        {/* Learning */}
        <Card padding="var(--space-xl)">
          <SectionTitle eyebrow="Study">In flight</SectionTitle>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {state.learning.filter(l => l.status === 'in_progress').slice(0, 4).map(l => (
              <div key={l.id}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                  <div style={{ fontSize: 13, color: 'var(--text-primary)' }}>{l.title}</div>
                  <div className="mono" style={{ fontSize: 11, color: 'var(--text-muted)' }}>{l.progress}%</div>
                </div>
                <div style={{ height: 3, background: 'var(--bg-tertiary)', borderRadius: 2, overflow: 'hidden' }}>
                  <div style={{ width: `${l.progress}%`, height: '100%', background: 'var(--accent)', transition: 'width 0.5s var(--ease)' }} />
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Recent activity */}
        <Card padding="var(--space-xl)">
          <SectionTitle eyebrow="Trail">Activity</SectionTitle>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {window.SEED_ACTIVITY.slice(0, 6).map(a => (
              <div key={a.id} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                <Dot color={
                  a.module === 'tasks' ? 'var(--accent)' :
                  a.module === 'expenses' ? 'var(--danger)' :
                  a.module === 'income' ? 'var(--success)' :
                  a.module === 'savings' ? 'var(--info)' :
                  'var(--warning)'
                } style={{ marginTop: 6 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12, color: 'var(--text-primary)', lineHeight: 1.5 }}>{a.summary}</div>
                  <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 2 }}>{relativeDate(a.when.slice(0,10))} · {a.when.slice(11)}</div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </PageContainer>
  );
}

function StatCard({ label, value, hint, trend }) {
  return (
    <Card padding="var(--space-lg)">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div className="caps">{label}</div>
        <div>{value}</div>
        {trend && <div style={{ height: 28 }}>{trend}</div>}
        {hint && <div style={{ fontSize: 12, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 4 }}>{hint}</div>}
      </div>
    </Card>
  );
}

function TaskRow({ task, onToggle }) {
  const done = task.status === 'done';
  const prioColor = task.priority === 'p0' ? 'var(--danger)' : task.priority === 'p1' ? 'var(--warning)' : 'var(--text-muted)';
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 12,
      padding: '12px 0',
      borderBottom: '1px solid var(--border-soft)',
    }}>
      <button onClick={onToggle} style={{
        width: 18, height: 18,
        border: `1.5px solid ${done ? 'var(--success)' : 'var(--border)'}`,
        borderRadius: '50%',
        background: done ? 'var(--success)' : 'transparent',
        display: 'grid', placeItems: 'center',
        flexShrink: 0,
        transition: 'all 0.15s var(--ease)',
      }}>
        {done && <Icon name="check" size={10} style={{ color: '#fff' }} stroke={2.5} />}
      </button>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 14, color: done ? 'var(--text-muted)' : 'var(--text-primary)', textDecoration: done ? 'line-through' : 'none' }}>{task.title}</div>
        <div style={{ display: 'flex', gap: 10, fontSize: 11, color: 'var(--text-muted)', marginTop: 3 }}>
          <span style={{ color: prioColor, fontWeight: 500, textTransform: 'uppercase', fontSize: 10, letterSpacing: '0.05em' }}>{task.priority}</span>
          <span>·</span>
          <span>{task.project || task.category || task.type}</span>
          {task.jira_ref && <><span>·</span><span className="mono">{task.jira_ref}</span></>}
        </div>
      </div>
    </div>
  );
}

function Sparkline({ data, color = 'var(--accent)', h = 28 }) {
  if (!data || data.length === 0) return null;
  const max = Math.max(...data, 1);
  const w = 100;
  const pts = data.map((d, i) => [i * (w / (data.length - 1 || 1)), h - (d / max) * h * 0.9 - 2]);
  const pathD = pts.map((p, i) => (i === 0 ? 'M' : 'L') + p[0].toFixed(1) + ',' + p[1].toFixed(1)).join(' ');
  const areaD = pathD + ` L${w},${h} L0,${h} Z`;
  return (
    <svg width="100%" height={h} viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none">
      <path d={areaD} fill={color} opacity="0.1" />
      <path d={pathD} fill="none" stroke={color} strokeWidth="1.2" />
    </svg>
  );
}

function WeekRhythm({ state }) {
  const today = new Date();
  const days = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today); d.setDate(d.getDate() - i);
    const iso = window.iso(d);
    const spend = state.expenses.filter(e => e.date === iso).reduce((a,b) => a + b.amount, 0);
    const doneCount = state.tasks.filter(t => t.status === 'done' && t.due_date === iso).length;
    days.push({ iso, label: d.toLocaleDateString('en-GB', { weekday: 'short' }).charAt(0), spend, doneCount, isToday: iso === window.iso(today) });
  }
  const maxSpend = Math.max(...days.map(d => d.spend), 50);
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 8 }}>
      {days.map(d => (
        <div key={d.iso} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
          <div style={{
            height: 90, width: '100%',
            background: 'var(--bg-tertiary)',
            borderRadius: 'var(--radius-sm)',
            display: 'flex', flexDirection: 'column-reverse',
            overflow: 'hidden',
            position: 'relative',
          }}>
            {d.spend > 0 && (
              <div style={{
                height: `${(d.spend / maxSpend) * 100}%`,
                background: d.isToday ? 'var(--accent)' : 'var(--text-secondary)',
                opacity: d.isToday ? 1 : 0.3,
                transition: 'height 0.3s var(--ease)',
              }} />
            )}
            {d.doneCount > 0 && (
              <div style={{ position: 'absolute', top: 6, left: 0, right: 0, textAlign: 'center', fontSize: 10, color: 'var(--success)', fontWeight: 500 }} className="mono">{d.doneCount}✓</div>
            )}
          </div>
          <div style={{ fontSize: 10, color: d.isToday ? 'var(--text-primary)' : 'var(--text-muted)', fontWeight: d.isToday ? 500 : 400 }}>{d.label}</div>
        </div>
      ))}
    </div>
  );
}

function relativeDate(dateStr) {
  const d = new Date(dateStr);
  const today = new Date();
  today.setHours(0,0,0,0);
  const diff = Math.round((d - today) / 86400000);
  if (diff === 0) return 'Today';
  if (diff === -1) return 'Yesterday';
  if (diff === 1) return 'Tomorrow';
  if (diff > -7 && diff < 0) return `${-diff}d ago`;
  if (diff > 0 && diff < 7) return `in ${diff}d`;
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
}

Object.assign(window, { Home, TaskRow, Sparkline, relativeDate });
