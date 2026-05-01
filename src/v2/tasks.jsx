// Tasks module — Atelier treatment
function Tasks({ state, setState }) {
  const [tab, setTab] = React.useState('work');
  const [view, setView] = React.useState('today');
  const [filter, setFilter] = React.useState('');
  const [addOpen, setAddOpen] = React.useState(false);

  const filtered = state.tasks
    .filter(t => t.type === tab)
    .filter(t => !filter || t.title.toLowerCase().includes(filter.toLowerCase()));

  const todayISO = window.iso(new Date());
  const overdue = filtered.filter(t => t.status !== 'done' && t.due_date < todayISO);
  const todays = filtered.filter(t => t.status !== 'done' && t.due_date === todayISO);
  const upcoming = filtered.filter(t => t.status !== 'done' && t.due_date > todayISO);
  const done = filtered.filter(t => t.status === 'done');

  const toggle = (id) => setState(s => ({
    ...s,
    tasks: s.tasks.map(t => t.id === id ? { ...t, status: t.status === 'done' ? 'todo' : 'done' } : t)
  }));

  const totalOpen = filtered.filter(t => t.status !== 'done').length;

  return (
    <PageContainer>
      <PageTitle eyebrow="Tasks" right={
        <Button icon="plus" onClick={() => setAddOpen(true)}>New task</Button>
      }>
        {tab === 'work' ? 'Work queue' : 'Life queue'}
      </PageTitle>

      <div style={{ display: 'flex', gap: 16, alignItems: 'center', marginBottom: 28, flexWrap: 'wrap' }}>
        <Segmented
          value={tab}
          onChange={setTab}
          options={[{ value: 'work', label: `Work · ${state.tasks.filter(t => t.type === 'work' && t.status !== 'done').length}` }, { value: 'personal', label: `Personal · ${state.tasks.filter(t => t.type === 'personal' && t.status !== 'done').length}` }]}
        />
        <Segmented
          value={view}
          onChange={setView}
          options={[{ value: 'today', label: 'Today' }, { value: 'board', label: 'Board' }, { value: 'list', label: 'List' }]}
        />
        <div style={{ flex: 1 }} />
        <div style={{ position: 'relative', width: 280 }}>
          <Icon name="search" size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <Input value={filter} onChange={e => setFilter(e.target.value)} placeholder="Search tasks" style={{ height: 38, paddingLeft: 34, fontSize: 13 }} />
        </div>
      </div>

      {view === 'today' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {overdue.length > 0 && (
            <section>
              <SectionTitle eyebrow={`${overdue.length} · behind schedule`}>Overdue</SectionTitle>
              <Card padding="0">
                {overdue.map(t => <TaskRow2 key={t.id} task={t} onToggle={() => toggle(t.id)} tone="danger" />)}
              </Card>
            </section>
          )}
          <section>
            <SectionTitle eyebrow={`${todays.length} scheduled`}>Today</SectionTitle>
            <Card padding="0">
              {todays.length === 0 ? (
                <div style={{ padding: 32, textAlign: 'center', color: 'var(--text-muted)', fontSize: 13 }}>Nothing on the slate.</div>
              ) : todays.map(t => <TaskRow2 key={t.id} task={t} onToggle={() => toggle(t.id)} />)}
            </Card>
          </section>
          <section>
            <SectionTitle eyebrow={`${upcoming.length} ahead`}>Upcoming</SectionTitle>
            <Card padding="0">
              {upcoming.slice(0, 10).map(t => <TaskRow2 key={t.id} task={t} onToggle={() => toggle(t.id)} />)}
            </Card>
          </section>
          {done.length > 0 && (
            <section>
              <SectionTitle eyebrow={`${done.length} shipped`}>Done recently</SectionTitle>
              <Card padding="0">
                {done.slice(0, 5).map(t => <TaskRow2 key={t.id} task={t} onToggle={() => toggle(t.id)} />)}
              </Card>
            </section>
          )}
        </div>
      )}

      {view === 'board' && <KanbanBoard tasks={filtered} setState={setState} />}

      {view === 'list' && (
        <Card padding="0">
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                <th style={thStyle} width="40"></th>
                <th style={thStyle}>Task</th>
                <th style={thStyle} width="100">Status</th>
                <th style={thStyle} width="80">Priority</th>
                <th style={thStyle} width="140">Project</th>
                <th style={thStyle} width="110">Due</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(t => (
                <tr key={t.id} style={{ borderBottom: '1px solid var(--border-soft)' }}>
                  <td style={tdStyle}>
                    <button onClick={() => toggle(t.id)} style={checkboxStyle(t.status === 'done')}>
                      {t.status === 'done' && <Icon name="check" size={10} style={{ color: '#fff' }} stroke={2.5} />}
                    </button>
                  </td>
                  <td style={{ ...tdStyle, color: t.status === 'done' ? 'var(--text-muted)' : 'var(--text-primary)', textDecoration: t.status === 'done' ? 'line-through' : 'none' }}>{t.title}</td>
                  <td style={tdStyle}><Status label={t.status.replace('_', ' ')} tone={statusTone(t.status)} /></td>
                  <td style={tdStyle}><span style={{ fontSize: 11, fontWeight: 500, color: priorityColor(t.priority), textTransform: 'uppercase', letterSpacing: '0.05em' }}>{t.priority}</span></td>
                  <td style={{ ...tdStyle, color: 'var(--text-secondary)', fontSize: 13 }}>{t.project || t.category || '—'}</td>
                  <td style={{ ...tdStyle, color: t.due_date < todayISO && t.status !== 'done' ? 'var(--danger)' : 'var(--text-secondary)', fontSize: 13 }} className="mono">{relativeDate(t.due_date)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}

      <QuickTaskModal open={addOpen} onClose={() => setAddOpen(false)} onSave={(t) => {
        setState(s => ({ ...s, tasks: [t, ...s.tasks] }));
      }} />
    </PageContainer>
  );
}

const thStyle = { textAlign: 'left', padding: '14px 16px', fontSize: 11, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)' };
const tdStyle = { padding: '14px 16px', fontSize: 14 };
const checkboxStyle = (done) => ({
  width: 18, height: 18,
  border: `1.5px solid ${done ? 'var(--success)' : 'var(--border)'}`,
  borderRadius: '50%',
  background: done ? 'var(--success)' : 'transparent',
  display: 'grid', placeItems: 'center',
  cursor: 'pointer',
  transition: 'all 0.15s var(--ease)',
});
const statusTone = (s) => ({ todo: 'muted', in_progress: 'warning', blocked: 'danger', done: 'success' }[s] || 'muted');
const priorityColor = (p) => ({ p0: 'var(--danger)', p1: 'var(--warning)', p2: 'var(--text-secondary)', p3: 'var(--text-muted)' }[p]);

function TaskRow2({ task, onToggle, tone }) {
  const done = task.status === 'done';
  const todayISO = window.iso(new Date());
  const overdue = task.status !== 'done' && task.due_date < todayISO;
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 14,
      padding: '14px 20px',
      borderBottom: '1px solid var(--border-soft)',
      transition: 'background 0.15s var(--ease)',
    }}
    onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-tertiary)'}
    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
      <button onClick={onToggle} style={checkboxStyle(done)}>
        {done && <Icon name="check" size={10} style={{ color: '#fff' }} stroke={2.5} />}
      </button>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 14, color: done ? 'var(--text-muted)' : 'var(--text-primary)', textDecoration: done ? 'line-through' : 'none', lineHeight: 1.4 }}>{task.title}</div>
        <div style={{ display: 'flex', gap: 12, fontSize: 11, color: 'var(--text-muted)', marginTop: 4, alignItems: 'center' }}>
          <span style={{ color: priorityColor(task.priority), fontWeight: 500, textTransform: 'uppercase', fontSize: 10, letterSpacing: '0.05em' }}>{task.priority}</span>
          <span>{task.project || task.category || task.type}</span>
          {task.jira_ref && <span className="mono">{task.jira_ref}</span>}
          {task.status !== 'todo' && task.status !== 'done' && <Status label={task.status.replace('_', ' ')} tone={statusTone(task.status)} />}
        </div>
      </div>
      <div className="mono" style={{ fontSize: 12, color: overdue ? 'var(--danger)' : 'var(--text-muted)', flexShrink: 0 }}>{relativeDate(task.due_date)}</div>
    </div>
  );
}

function KanbanBoard({ tasks, setState }) {
  const cols = [
    { id: 'todo', label: 'To do', tone: 'muted' },
    { id: 'in_progress', label: 'In progress', tone: 'warning' },
    { id: 'blocked', label: 'Blocked', tone: 'danger' },
    { id: 'done', label: 'Done', tone: 'success' },
  ];
  const [drag, setDrag] = React.useState(null);
  const moveTo = (id, status) => setState(s => ({ ...s, tasks: s.tasks.map(t => t.id === id ? { ...t, status } : t) }));
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
      {cols.map(col => {
        const items = tasks.filter(t => t.status === col.id);
        return (
          <div key={col.id}
            onDragOver={e => { e.preventDefault(); }}
            onDrop={() => { if (drag) { moveTo(drag, col.id); setDrag(null); } }}
            style={{
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-soft)',
              borderRadius: 'var(--radius-lg)',
              padding: 16,
              minHeight: 480,
              display: 'flex', flexDirection: 'column', gap: 10,
            }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
              <Status label={col.label} tone={col.tone} />
              <span className="mono" style={{ fontSize: 11, color: 'var(--text-muted)' }}>{items.length}</span>
            </div>
            {items.map(t => (
              <div key={t.id}
                draggable
                onDragStart={() => setDrag(t.id)}
                onDragEnd={() => setDrag(null)}
                style={{
                  padding: 12,
                  background: 'var(--bg-raised)',
                  border: '1px solid var(--border-soft)',
                  borderRadius: 'var(--radius-md)',
                  cursor: 'grab',
                  boxShadow: drag === t.id ? 'var(--shadow-md)' : 'var(--shadow-sm)',
                  opacity: drag === t.id ? 0.5 : 1,
                  transition: 'box-shadow 0.15s var(--ease)',
                }}>
                <div style={{ fontSize: 13, color: 'var(--text-primary)', lineHeight: 1.45, marginBottom: 6 }}>{t.title}</div>
                <div style={{ display: 'flex', gap: 8, fontSize: 10, color: 'var(--text-muted)', alignItems: 'center' }}>
                  <span style={{ color: priorityColor(t.priority), fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{t.priority}</span>
                  <span>·</span>
                  <span>{t.project || t.category || ''}</span>
                </div>
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
}

Object.assign(window, { Tasks });
