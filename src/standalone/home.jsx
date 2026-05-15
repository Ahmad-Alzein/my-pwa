// Home — Today dashboard
function Home({ tasks = [], expenses = [], income = [], family = { tx: [], notes: [] } }) {
  const now = new Date();
  const greet = now.getHours() < 12 ? 'Good morning' : now.getHours() < 18 ? 'Good afternoon' : 'Good evening';
  const dateStr = now.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const monthSpend = expenses.filter(e => new Date(e.date) >= monthStart).reduce((a, e) => a + e.amount, 0);
  const monthIncome = income.filter(i => new Date(i.date) >= monthStart).reduce((a, i) => a + i.amount, 0);
  const netMonth = monthIncome - monthSpend;

  const familyTx = family.tx || [];
  const familyBalance = familyTx.filter(x => x.type === 'expense').reduce((a, x) => a + x.amount, 0)
                      - familyTx.filter(x => x.type === 'income').reduce((a, x) => a + x.amount, 0);

  const todayISO = iso(now);
  const todayTasks = tasks.filter(t => !t.done && t.due === todayISO).slice(0, 4);
  const recentExpenses = [...expenses].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5);

  return (
    <div className="fade-in">
      <PageTitle eyebrow={dateStr} right={<Caps>{`Week ${Math.ceil((now.getDate() + 3) / 7)}`}</Caps>}>{greet}, Ahmad</PageTitle>

      <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20, marginBottom: 32 }}>
        <Card raised>
          <Caps style={{ marginBottom: 10 }}>This month · spend</Caps>
          <Amount value={monthSpend} size="xxl" tone="expense" />
          <div style={{ marginTop: 10, fontSize: 12, color: 'var(--text-secondary)' }}>Current month total</div>
        </Card>
        <Card raised>
          <Caps style={{ marginBottom: 10 }}>Net this month</Caps>
          <Amount value={netMonth} size="xxl" tone={netMonth >= 0 ? 'accent' : 'expense'} />
          <div style={{ marginTop: 10, fontSize: 12, color: 'var(--text-secondary)' }}>Income €{monthIncome.toFixed(0)} · Spend €{monthSpend.toFixed(0)}</div>
        </Card>
        <Card raised>
          <Caps style={{ marginBottom: 10 }}>Family — outstanding</Caps>
          <Amount value={Math.abs(familyBalance)} size="xxl" tone="neutral" />
          <div style={{ marginTop: 10, fontSize: 12, color: 'var(--text-secondary)' }}>
            {family.notes ? family.notes.filter(n => !n.resolved).length : 0} open notes
          </div>
        </Card>
      </div>

      <div className="two-col" style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 24 }}>
        <Card>
          <SectionTitle eyebrow="Today">On the agenda</SectionTitle>
          {todayTasks.length === 0 && (
            <div style={{ padding: '20px 0', color: 'var(--text-muted)', fontSize: 13 }}>No tasks due today.</div>
          )}
          {todayTasks.map((t, i) => (
            <div key={t.id} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 0',
              borderBottom: i < todayTasks.length - 1 ? '1px solid var(--border-soft)' : 'none' }}>
              <div style={{ width: 18, height: 18, borderRadius: 4, border: '1.5px solid var(--border)',
                background: 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }} />
              <div style={{ flex: 1, fontSize: 14, color: 'var(--text-primary)' }}>{t.title}</div>
              <Pill tone={t.priority}>{t.project}</Pill>
            </div>
          ))}
        </Card>

        <Card>
          <SectionTitle eyebrow="Latest">Recent activity</SectionTitle>
          {recentExpenses.length === 0 && (
            <div style={{ padding: '20px 0', color: 'var(--text-muted)', fontSize: 13 }}>No recent expenses.</div>
          )}
          {recentExpenses.map((e, i) => (
            <div key={e.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '11px 0',
              borderBottom: i < recentExpenses.length - 1 ? '1px solid var(--border-soft)' : 'none' }}>
              <Dot color="var(--danger)" />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{e.source}</div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: 2 }}>{e.tag}</div>
              </div>
              <Amount value={e.amount} tone="expense" size="sm" />
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
}
window.Home = Home;
