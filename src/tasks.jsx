// Tasks module — Today / Kanban / List / Calendar views

function TasksView({ state, dispatch, openQuick }) {
  const [view, setView] = useLocal('tasks_view', 'today');
  const [typeFilter, setTypeFilter] = useLocal('tasks_type', 'work');
  const [search, setSearch] = React.useState('');

  const tasks = state.tasks
    .filter(t => t.type === typeFilter)
    .filter(t => !search || t.title.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="fade-in" style={{ padding: '20px 24px', maxWidth: 1600, margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 16 }}>
        <div>
          <div className="sec-label">MODULE · TASK.DB</div>
          <h1 style={{ fontSize: 28, fontWeight: 600, margin: '6px 0 0', letterSpacing: '-0.02em' }}>Tasks</h1>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'var(--bg-2)', border: '1px solid var(--border)', borderRadius: 6, padding: '4px 10px' }}>
            <Icon.Search size={13} style={{ color: 'var(--text-3)' }}/>
            <input className="input" style={{ border: 0, padding: 0, width: 160 }}
                   placeholder="Search tasks…" value={search} onChange={e => setSearch(e.target.value)}/>
          </div>
          <button className="btn btn-primary" onClick={() => openQuick('task')}>
            <Icon.Plus size={12}/> New <span className="mono t-11" style={{ opacity: 0.7, marginLeft: 4 }}>N</span>
          </button>
        </div>
      </div>

      {/* Tabs: Work / Personal */}
      <div style={{ display: 'flex', gap: 0, marginBottom: 16, borderBottom: '1px solid var(--border)' }}>
        {[{ v: 'work', label: 'WORK', count: state.tasks.filter(t => t.type === 'work' && t.status !== 'done').length },
          { v: 'personal', label: 'PERSONAL', count: state.tasks.filter(t => t.type === 'personal' && t.status !== 'done').length }].map(t => (
          <button key={t.v} onClick={() => setTypeFilter(t.v)}
            className="mono t-12"
            style={{
              padding: '10px 16px', borderBottom: '2px solid ' + (typeFilter === t.v ? 'var(--blue)' : 'transparent'),
              color: typeFilter === t.v ? 'var(--text-0)' : 'var(--text-3)',
              letterSpacing: '0.1em',
              marginBottom: -1,
            }}>
            {t.label} <span style={{ color: 'var(--text-4)', marginLeft: 6 }}>{t.count}</span>
          </button>
        ))}
        <div style={{ flex: 1 }}/>
        <div style={{ display: 'flex', gap: 4, padding: '4px 0' }}>
          {[
            { v: 'today', label: 'Today', icon: Icon.Target },
            { v: 'kanban', label: 'Board', icon: Icon.Grid },
            { v: 'list', label: 'List', icon: Icon.List },
            { v: 'calendar', label: 'Week', icon: Icon.Calendar },
          ].map(o => {
            const active = view === o.v;
            const Ic = o.icon;
            return (
              <button key={o.v} onClick={() => setView(o.v)}
                className="btn btn-sm"
                style={{
                  background: active ? 'var(--bg-3)' : 'transparent',
                  color: active ? 'var(--text-0)' : 'var(--text-3)',
                  border: '1px solid ' + (active ? 'var(--border-2)' : 'transparent'),
                }}>
                <Ic size={12}/> {o.label}
              </button>
            );
          })}
        </div>
      </div>

      {view === 'today' && <TodayView tasks={tasks} dispatch={dispatch}/>}
      {view === 'kanban' && <KanbanView tasks={tasks} dispatch={dispatch}/>}
      {view === 'list' && <ListView tasks={tasks} dispatch={dispatch}/>}
      {view === 'calendar' && <WeekView tasks={tasks} dispatch={dispatch}/>}
    </div>
  );
}

function TodayView({ tasks, dispatch }) {
  const todayStr = iso(new Date());
  const overdue = tasks.filter(t => t.status !== 'done' && t.due_date && t.due_date < todayStr);
  const due = tasks.filter(t => t.status !== 'done' && t.due_date === todayStr);
  const byPri = (arr) => {
    const g = { p0: [], p1: [], p2: [], p3: [] };
    arr.forEach(t => g[t.priority].push(t));
    return g;
  };
  const dueByPri = byPri(due);
  const priLabels = { p0: 'CRITICAL · P0', p1: 'HIGH · P1', p2: 'MEDIUM · P2', p3: 'LOW · P3' };
  const priColors = { p0: '#EF4444', p1: '#F59E0B', p2: '#3B82F6', p3: '#71717A' };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 16 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {overdue.length > 0 && (
          <div className="card hud card-pad" style={{ borderColor: 'rgba(239,68,68,0.3)' }}>
            <HUDBrackets color="rgba(239,68,68,0.5)"/>
            <div className="sec-label" style={{ marginBottom: 10, color: 'var(--red)' }}>⚠ OVERDUE · {overdue.length}</div>
            {overdue.map((t, i) => <TaskListItem key={t.id} task={t} dispatch={dispatch} overdue/>)}
          </div>
        )}
        {['p0','p1','p2','p3'].map(p => (
          <div key={p} className="card hud card-pad">
            <HUDBrackets/>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 10 }}>
              <div className="sec-label" style={{ color: priColors[p] }}>
                <span style={{ filter: 'hue-rotate(0)' }}>{priLabels[p]}</span>
              </div>
              <span className="mono t-11" style={{ color: 'var(--text-4)', marginLeft: 'auto' }}>{dueByPri[p].length}</span>
            </div>
            {dueByPri[p].length === 0 ? (
              <div className="t-12" style={{ color: 'var(--text-4)', fontStyle: 'italic' }}>No {p.toUpperCase()} tasks due today.</div>
            ) : dueByPri[p].map(t => <TaskListItem key={t.id} task={t} dispatch={dispatch}/>)}
          </div>
        ))}
      </div>
      <div>
        <div className="card hud card-pad">
          <HUDBrackets/>
          <div className="sec-label" style={{ marginBottom: 12 }}>DAY · STATE</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <Metric label="Open" value={tasks.filter(t => t.status !== 'done').length}/>
            <Metric label="In Progress" value={tasks.filter(t => t.status === 'in_progress').length} color="var(--amber)"/>
            <Metric label="Blocked" value={tasks.filter(t => t.status === 'blocked').length} color="var(--red)"/>
            <Metric label="Completed (7d)" value={tasks.filter(t => t.status === 'done' && t.due_date >= daysFromNow(-7)).length} color="var(--green)"/>
          </div>
        </div>
      </div>
    </div>
  );
}

function TaskListItem({ task, dispatch, overdue }) {
  const [hover, setHover] = React.useState(false);
  const toggle = () => dispatch({ type: 'toggle_task', id: task.id });
  const cycle = () => {
    const order = ['todo','in_progress','done','blocked'];
    const next = order[(order.indexOf(task.status) + 1) % order.length];
    dispatch({ type: 'set_task_status', id: task.id, status: next });
  };
  return (
    <div onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
         style={{
      display: 'grid', gridTemplateColumns: '20px 1fr auto auto auto', gap: 10,
      padding: '8px 8px', margin: '0 -8px', borderRadius: 6, alignItems: 'center',
      background: hover ? 'var(--bg-3)' : 'transparent',
      transition: 'background 120ms',
    }}>
      <button onClick={toggle} style={{
        width: 16, height: 16, borderRadius: 4, border: '1.5px solid var(--border-2)',
        background: task.status === 'done' ? 'var(--green)' : 'transparent',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        {task.status === 'done' && <Icon.Check size={11} style={{ color: '#000' }}/>}
      </button>
      <div style={{ minWidth: 0 }}>
        <div className="t-13" style={{
          color: task.status === 'done' ? 'var(--text-4)' : 'var(--text-1)',
          textDecoration: task.status === 'done' ? 'line-through' : 'none',
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
        }}>{task.title}</div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginTop: 2 }}>
          {task.jira_ref && <span className="mono t-11" style={{ color: 'var(--cyan)' }}>{task.jira_ref}</span>}
          <span className="mono t-11" style={{ color: 'var(--text-3)' }}>{task.type === 'work' ? task.project : task.category}</span>
          {task.is_recurring && <span className="mono t-11" style={{ color: 'var(--purple)' }}>↻</span>}
        </div>
      </div>
      <button onClick={cycle} style={{ cursor: 'pointer' }}><StatusPill status={task.status}/></button>
      <PriorityPill priority={task.priority}/>
      <span className="mono t-11" style={{ color: overdue ? 'var(--red)' : 'var(--text-3)', minWidth: 70, textAlign: 'right' }}>
        {relativeDay(task.due_date)}
      </span>
    </div>
  );
}

function KanbanView({ tasks, dispatch }) {
  const cols = [
    { id: 'todo', label: 'TO DO' },
    { id: 'in_progress', label: 'IN PROGRESS' },
    { id: 'blocked', label: 'BLOCKED' },
    { id: 'done', label: 'DONE' },
  ];
  const [dragId, setDragId] = React.useState(null);
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
      {cols.map(c => {
        const items = tasks.filter(t => t.status === c.id);
        return (
          <div key={c.id}
               onDragOver={e => e.preventDefault()}
               onDrop={e => { e.preventDefault(); if (dragId) dispatch({ type: 'set_task_status', id: dragId, status: c.id }); setDragId(null); }}
               className="card hud"
               style={{ padding: 12, display: 'flex', flexDirection: 'column', minHeight: 400 }}>
            <HUDBrackets/>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10, paddingBottom: 8, borderBottom: '1px solid var(--border)' }}>
              <div className="sec-label" style={{ gap: 6 }}>
                <span className={'dot dot-' + (c.id === 'in_progress' ? 'doing' : c.id)}/>
                {c.label}
              </div>
              <span className="mono t-11" style={{ color: 'var(--text-3)' }}>{items.length.toString().padStart(2, '0')}</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {items.map(t => <KanbanCard key={t.id} task={t} dispatch={dispatch} onDragStart={() => setDragId(t.id)}/>)}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function KanbanCard({ task, dispatch, onDragStart }) {
  return (
    <div draggable onDragStart={onDragStart}
         style={{
           background: 'var(--bg-3)', border: '1px solid var(--border)', borderRadius: 6, padding: 10,
           cursor: 'grab',
         }}>
      <div style={{ display: 'flex', gap: 6, marginBottom: 6, alignItems: 'center' }}>
        <PriorityPill priority={task.priority}/>
        {task.jira_ref && <span className="mono t-11" style={{ color: 'var(--cyan)' }}>{task.jira_ref}</span>}
        <span style={{ flex: 1 }}/>
        <span className="mono t-11" style={{ color: task.due_date < iso(new Date()) && task.status !== 'done' ? 'var(--red)' : 'var(--text-3)' }}>
          {relativeDay(task.due_date)}
        </span>
      </div>
      <div className="t-13" style={{ lineHeight: 1.4 }}>{task.title}</div>
      <div className="mono t-11" style={{ color: 'var(--text-3)', marginTop: 6 }}>
        {task.type === 'work' ? task.project : task.category}
      </div>
    </div>
  );
}

function ListView({ tasks, dispatch }) {
  const sorted = [...tasks].sort((a, b) => (a.due_date || '9999').localeCompare(b.due_date || '9999'));
  return (
    <div className="card hud" style={{ padding: 0, overflow: 'hidden' }}>
      <HUDBrackets/>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
        <thead>
          <tr style={{ background: 'var(--bg-3)' }}>
            <th style={thStyle}>#</th>
            <th style={thStyle}>Title</th>
            <th style={thStyle}>Status</th>
            <th style={thStyle}>Priority</th>
            <th style={thStyle}>Ref</th>
            <th style={thStyle}>{tasks[0]?.type === 'work' ? 'Project' : 'Category'}</th>
            <th style={thStyle}>Due</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((t, i) => (
            <tr key={t.id} style={{ borderBottom: '1px solid var(--border)', background: i % 2 ? 'rgba(255,255,255,0.01)' : 'transparent' }}>
              <td style={{ ...tdStyle, color: 'var(--text-4)' }} className="mono">{String(i+1).padStart(3, '0')}</td>
              <td style={tdStyle}>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <button onClick={() => dispatch({ type: 'toggle_task', id: t.id })} style={{
                    width: 14, height: 14, borderRadius: 3, border: '1.5px solid var(--border-2)',
                    background: t.status === 'done' ? 'var(--green)' : 'transparent',
                  }}/>
                  <span style={{ textDecoration: t.status === 'done' ? 'line-through' : 'none', color: t.status === 'done' ? 'var(--text-4)' : 'var(--text-1)' }}>
                    {t.title}
                  </span>
                </div>
              </td>
              <td style={tdStyle}><StatusPill status={t.status}/></td>
              <td style={tdStyle}><PriorityPill priority={t.priority}/></td>
              <td style={{ ...tdStyle, color: 'var(--cyan)' }} className="mono">{t.jira_ref || '—'}</td>
              <td style={{ ...tdStyle, color: 'var(--text-2)' }} className="mono">{t.type === 'work' ? t.project : t.category}</td>
              <td style={{ ...tdStyle, color: t.due_date < iso(new Date()) && t.status !== 'done' ? 'var(--red)' : 'var(--text-2)' }} className="mono">
                {relativeDay(t.due_date)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
const thStyle = { textAlign: 'left', padding: '10px 14px', fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-3)', fontFamily: 'var(--ff-mono)', fontWeight: 500, borderBottom: '1px solid var(--border)' };
const tdStyle = { padding: '10px 14px', verticalAlign: 'middle' };

function WeekView({ tasks, dispatch }) {
  const days = [];
  const today = new Date();
  const dow = today.getDay() === 0 ? 6 : today.getDay() - 1;
  for (let i = -dow; i < 7 - dow; i++) {
    const d = new Date(today); d.setDate(d.getDate() + i);
    days.push(d);
  }
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 8 }}>
      {days.map((d, i) => {
        const dStr = iso(d);
        const isToday = dStr === iso(today);
        const items = tasks.filter(t => t.due_date === dStr);
        return (
          <div key={i} className="card hud" style={{ padding: 10, minHeight: 220, borderColor: isToday ? 'var(--blue)' : 'var(--border)' }}>
            <HUDBrackets color={isToday ? 'rgba(59,130,246,0.6)' : 'rgba(59,130,246,0.25)'}/>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8, paddingBottom: 6, borderBottom: '1px solid var(--border)' }}>
              <div>
                <div className="mono t-10" style={{ color: 'var(--text-3)' }}>{d.toLocaleDateString('en-GB', { weekday: 'short' }).toUpperCase()}</div>
                <div className="mono" style={{ fontSize: 18, color: isToday ? 'var(--blue)' : 'var(--text-0)', fontWeight: 600 }}>{d.getDate()}</div>
              </div>
              <span className="mono t-11" style={{ color: 'var(--text-4)' }}>{items.length || ''}</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {items.map(t => (
                <div key={t.id} style={{ padding: 6, background: 'var(--bg-3)', borderLeft: '2px solid ' + ({ p0: '#EF4444', p1: '#F59E0B', p2: '#3B82F6', p3: '#71717A' })[t.priority], borderRadius: 3 }}>
                  <div className="t-12" style={{ lineHeight: 1.25, color: t.status === 'done' ? 'var(--text-4)' : 'var(--text-1)', textDecoration: t.status === 'done' ? 'line-through' : 'none' }}>
                    {t.title}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

Object.assign(window, { TasksView });
