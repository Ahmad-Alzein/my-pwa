// Tasks — kanban-style with priority lanes
const SEED_TASKS = [
  { id: 't1', title: 'Reconcile April statement', project: 'Finance',  priority: 'p1', due: daysAgo(-1), done: false, notes: 'Cross-check with bank export' },
  { id: 't2', title: 'Confirm Mohtadi rent share', project: 'Family',   priority: 'p2', due: daysAgo(0),  done: false },
  { id: 't3', title: 'Annual insurance renewal',   project: 'Finance',  priority: 'p0', due: daysAgo(-3), done: false, notes: 'Compare 2 quotes' },
  { id: 't4', title: 'Review reading queue',       project: 'Library',  priority: 'p3', due: daysAgo(0),  done: true },
  { id: 't5', title: 'Pharmacy refill',            project: 'Errands',  priority: 'p2', due: daysAgo(-1), done: false },
  { id: 't6', title: 'Export Q1 statements',       project: 'Finance',  priority: 'p1', due: daysAgo(-7), done: false },
  { id: 't7', title: 'Reply to Lyon landlord',     project: 'Family',   priority: 'p1', due: daysAgo(-2), done: false },
  { id: 't8', title: 'Backup photos to drive',     project: 'Personal', priority: 'p3', due: daysAgo(-14), done: false },
  { id: 't9', title: 'Plan Tunis trip dates',      project: 'Family',   priority: 'p2', due: daysAgo(-21), done: false },
  { id: 't10', title: 'Cancel old gym',            project: 'Finance',  priority: 'p3', due: daysAgo(0),  done: true },
];

function Tasks() {
  const [tasks, setTasks] = React.useState(SEED_TASKS);
  const [view, setView] = React.useState('priority'); // priority | project
  const [showDone, setShowDone] = React.useState(false);
  const [selected, setSelected] = React.useState(new Set());

  const visible = tasks.filter(t => showDone || !t.done);
  const groupKey = view === 'priority' ? 'priority' : 'project';
  const groups = {};
  visible.forEach(t => { const k = t[groupKey]; (groups[k] ||= []).push(t); });

  const order = view === 'priority' ? ['p0', 'p1', 'p2', 'p3'] : Object.keys(groups).sort();
  const labels = { p0: 'Urgent', p1: 'High', p2: 'Medium', p3: 'Someday' };

  const toggle = (id) => setTasks(tasks.map(t => t.id === id ? { ...t, done: !t.done } : t));
  const toggleSel = (id) => { const n = new Set(selected); n.has(id) ? n.delete(id) : n.add(id); setSelected(n); };

  const open = visible.filter(t => !t.done).length;
  const overdue = visible.filter(t => !t.done && new Date(t.due) < today).length;

  return (
    <div className="fade-in">
      <PageTitle eyebrow="Today · Inbox" right={
        <div style={{ display: 'flex', gap: 10 }}>
          <Segmented value={view} options={[{ value: 'priority', label: 'Priority' }, { value: 'project', label: 'Project' }]} onChange={setView} />
          <Button variant="primary" icon="plus">New task</Button>
        </div>
      }>Tasks</PageTitle>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 28 }}>
        <Card raised><Caps style={{ marginBottom: 8 }}>Open</Caps><div className="serif" style={{ fontSize: 36, fontWeight: 500, letterSpacing: '-0.02em' }}>{open}</div></Card>
        <Card raised><Caps style={{ marginBottom: 8 }}>Overdue</Caps><div className="serif" style={{ fontSize: 36, fontWeight: 500, letterSpacing: '-0.02em', color: overdue ? 'var(--danger)' : 'var(--text-primary)' }}>{overdue}</div></Card>
        <Card raised><Caps style={{ marginBottom: 8 }}>Done · today</Caps><div className="serif" style={{ fontSize: 36, fontWeight: 500, letterSpacing: '-0.02em', color: 'var(--success)' }}>{tasks.filter(t => t.done).length}</div></Card>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18 }}>
        <button onClick={() => setShowDone(!showDone)} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--text-secondary)' }}>
          <div style={{ width: 14, height: 14, borderRadius: 3, border: `1.5px solid ${showDone ? 'var(--accent)' : 'var(--border)'}`, background: showDone ? 'var(--accent)' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {showDone && <Icon name="check" size={9} style={{ color: '#fff', strokeWidth: 3 }} />}
          </div>
          Show completed
        </button>
        {selected.size > 0 && (
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 10, alignItems: 'center' }}>
            <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{selected.size} selected</span>
            <Button size="sm" variant="ghost" onClick={() => setSelected(new Set())}>Clear</Button>
            <Button size="sm" variant="danger" icon="trash" onClick={() => { setTasks(tasks.filter(t => !selected.has(t.id))); setSelected(new Set()); }}>Delete</Button>
          </div>
        )}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
        {order.filter(k => groups[k]?.length).map(k => (
          <div key={k}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 10 }}>
              <Caps>{labels[k] || k}</Caps>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-muted)' }}>{groups[k].length}</span>
            </div>
            <Card padding={0}>
              {groups[k].map((t, i) => {
                const sel = selected.has(t.id);
                const overdueT = !t.done && new Date(t.due) < today;
                return (
                  <div key={t.id} style={{ display: 'grid', gridTemplateColumns: '24px 28px 1fr 110px 100px 80px', alignItems: 'center',
                    padding: '14px 20px', gap: 12, borderBottom: i < groups[k].length - 1 ? '1px solid var(--border-soft)' : 'none',
                    background: sel ? 'var(--accent-soft)' : 'transparent', cursor: 'pointer' }} onClick={() => toggleSel(t.id)}>
                    <Checkbox checked={sel} onChange={() => toggleSel(t.id)} />
                    <button onClick={(e) => { e.stopPropagation(); toggle(t.id); }} style={{
                      width: 18, height: 18, borderRadius: 4, border: `1.5px solid ${t.done ? 'var(--accent)' : 'var(--border)'}`,
                      background: t.done ? 'var(--accent)' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {t.done && <Icon name="check" size={11} style={{ color: '#fff', strokeWidth: 3 }} />}
                    </button>
                    <div>
                      <div style={{ fontSize: 14, color: t.done ? 'var(--text-muted)' : 'var(--text-primary)', textDecoration: t.done ? 'line-through' : 'none' }}>{t.title}</div>
                      {t.notes && <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 3 }}>{t.notes}</div>}
                    </div>
                    <Pill tone="muted">{t.project}</Pill>
                    <Pill tone={t.priority}>{labels[t.priority]}</Pill>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: overdueT ? 'var(--danger)' : 'var(--text-secondary)', textAlign: 'right' }}>
                      {new Date(t.due).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
                    </span>
                  </div>
                );
              })}
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
}
window.Tasks = Tasks;
