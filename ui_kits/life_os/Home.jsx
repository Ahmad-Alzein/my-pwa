// Home — Today dashboard
function Home() {
  const today = new Date();
  const greet = today.getHours() < 12 ? 'Good morning' : today.getHours() < 18 ? 'Good afternoon' : 'Good evening';
  const dateStr = today.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <div className="fade-in">
      <PageTitle eyebrow={dateStr} right={<Caps>{`Week ${Math.ceil((today.getDate() + 3) / 7)}`}</Caps>}>{greet}, Ahmad</PageTitle>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20, marginBottom: 32 }}>
        <Card raised>
          <Caps style={{ marginBottom: 10 }}>This month · spend</Caps>
          <Amount value={1247.30} size="xxl" tone="expense" />
          <div style={{ marginTop: 10, fontSize: 12, color: 'var(--text-secondary)' }}>
            <span style={{ color: 'var(--success)' }}>↓ 8%</span> vs last month
          </div>
        </Card>
        <Card raised>
          <Caps style={{ marginBottom: 10 }}>Net this month</Caps>
          <Amount value={3372.70} size="xxl" tone="accent" />
          <div style={{ marginTop: 10, fontSize: 12, color: 'var(--text-secondary)' }}>Income €4 620 · Spend €1 247</div>
        </Card>
        <Card raised>
          <Caps style={{ marginBottom: 10 }}>Family — outstanding</Caps>
          <Amount value={250} size="xxl" tone="neutral" />
          <div style={{ marginTop: 10, fontSize: 12, color: 'var(--text-secondary)' }}>2 open notes · ledger up to date</div>
        </Card>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 24 }}>
        <Card>
          <SectionTitle eyebrow="Today">On the agenda</SectionTitle>
          {[
            { t: 'Reconcile April statement', tag: 'Finance', tone: 'p1', done: false },
            { t: 'Confirm Mohtadi rent share',  tag: 'Family',  tone: 'p2', done: false },
            { t: 'Review reading queue',        tag: 'Library', tone: 'p3', done: true },
            { t: 'Pharmacy refill',             tag: 'Errands', tone: 'p2', done: false },
          ].map((t, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 0',
              borderBottom: i < 3 ? '1px solid var(--border-soft)' : 'none' }}>
              <div style={{ width: 18, height: 18, borderRadius: 4, border: `1.5px solid ${t.done ? 'var(--accent)' : 'var(--border)'}`,
                background: t.done ? 'var(--accent)' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                {t.done && <Icon name="check" size={11} style={{ color: '#fff', strokeWidth: 3 }} />}
              </div>
              <div style={{ flex: 1, fontSize: 14, color: t.done ? 'var(--text-muted)' : 'var(--text-primary)',
                textDecoration: t.done ? 'line-through' : 'none' }}>{t.t}</div>
              <Pill tone={t.tone}>{t.tag}</Pill>
            </div>
          ))}
        </Card>

        <Card>
          <SectionTitle eyebrow="Latest">Recent activity</SectionTitle>
          {SEED_EXPENSES.slice(0, 5).map((e, i) => (
            <div key={e.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '11px 0',
              borderBottom: i < 4 ? '1px solid var(--border-soft)' : 'none' }}>
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
