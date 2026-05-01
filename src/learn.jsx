// Learning module — Domains grid + detail view

function LearnView({ state, dispatch, openQuick }) {
  const [selectedId, setSelectedId] = useLocal('learn_selected', null);
  const selected = state.learning.find(d => d.id === selectedId);

  if (selected) {
    return <LearnDetail domain={selected} state={state} dispatch={dispatch} onBack={() => setSelectedId(null)} openQuick={openQuick}/>;
  }

  // Total minutes this week
  const totalMinWeek = state.learning.reduce((s, d) => s + (d.sessions_minutes_per_day || []).slice(-7).reduce((x, y) => x + y, 0), 0);
  const weeklyTarget = 300; // 5h

  return (
    <div className="fade-in" style={{ padding: '20px 24px', maxWidth: 1600, margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 16 }}>
        <div>
          <div className="sec-label">MODULE · LEARN.DB</div>
          <h1 style={{ fontSize: 28, fontWeight: 600, margin: '6px 0 0', letterSpacing: '-0.02em' }}>Learning</h1>
        </div>
        <button className="btn" onClick={() => openQuick('session')}><Icon.Plus size={12}/> Log session</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 20 }}>
        <StatCard label="WEEKLY TARGET" value={Math.round(totalMinWeek/60) + 'h / 5h'} sub={`${Math.min(100, totalMinWeek/weeklyTarget*100).toFixed(0)}% complete`}
          positive={totalMinWeek >= weeklyTarget}
          trend={<Progress value={totalMinWeek} max={weeklyTarget} color="var(--amber)" showPct={false} height={6}/>}/>
        <StatCard label="ACTIVE DOMAINS" value={state.learning.filter(l => l.status === 'in_progress').length}
          sub={state.learning.length + ' total'}
          trend={<BarMini data={[2,3,3,3,4,4]} color="var(--blue)" width={80}/>}/>
        <StatCard label="RESOURCES DONE" value={state.learning.flatMap(l => l.resources).filter(r => r.status === 'done').length}
          sub="completed all-time"/>
        <StatCard label="AVG RATING" value={(() => {
          const rated = state.learning.flatMap(l => l.resources).filter(r => r.rating);
          return rated.length ? (rated.reduce((s,r)=>s+r.rating,0)/rated.length).toFixed(1) + '★' : '—';
        })()} sub="across all resources"/>
      </div>

      {/* Domains grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: 14 }}>
        {state.learning.map(d => <DomainCard key={d.id} domain={d} onClick={() => setSelectedId(d.id)}/>)}
      </div>
    </div>
  );
}

function DomainCard({ domain, onClick }) {
  const d = domain;
  const lastWeek = (d.sessions_minutes_per_day || []).slice(-7);
  const lastMin = lastWeek.reduce((s, x) => s + x, 0);
  const resourcesDone = d.resources.filter(r => r.status === 'done').length;
  const milestonesDone = d.milestones.filter(m => m.done).length;
  const statusColor = { in_progress: 'var(--amber)', completed: 'var(--green)', paused: 'var(--red)', not_started: 'var(--text-3)' }[d.status];
  return (
    <button onClick={onClick} className="card hud"
      style={{ padding: 16, textAlign: 'left', cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: 12, minHeight: 220 }}>
      <HUDBrackets/>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
            <span className="dot" style={{ background: statusColor }}/>
            <span className="mono t-10" style={{ color: 'var(--text-3)', letterSpacing: '0.08em' }}>{d.status.toUpperCase().replace('_',' ')}</span>
          </div>
          <div className="t-18" style={{ fontWeight: 600, marginBottom: 4 }}>{d.title}</div>
          <div className="t-12" style={{ color: 'var(--text-3)', lineHeight: 1.45 }}>{d.description}</div>
        </div>
        <div className="mono" style={{ fontSize: 22, fontWeight: 700, color: 'var(--amber)' }}>{d.progress}%</div>
      </div>

      <Progress value={d.progress} color={statusColor} showPct={false} height={4}/>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6, borderTop: '1px solid var(--border)', paddingTop: 10 }}>
        <div><div className="mono t-10" style={{ color: 'var(--text-3)' }}>RESOURCES</div><div className="mono t-14" style={{ fontWeight: 600 }}>{resourcesDone}/{d.resources.length}</div></div>
        <div><div className="mono t-10" style={{ color: 'var(--text-3)' }}>MILESTONES</div><div className="mono t-14" style={{ fontWeight: 600 }}>{milestonesDone}/{d.milestones.length}</div></div>
        <div><div className="mono t-10" style={{ color: 'var(--text-3)' }}>7d TIME</div><div className="mono t-14" style={{ fontWeight: 600 }}>{Math.round(lastMin/60*10)/10}h</div></div>
      </div>

      {/* heat strip */}
      <div style={{ display: 'flex', gap: 2, height: 20 }}>
        {(d.sessions_minutes_per_day || []).map((m, i) => (
          <div key={i} style={{ flex: 1, background: m > 0 ? `rgba(245,158,11,${0.2 + Math.min(1, m/90) * 0.8})` : 'var(--bg-3)', borderRadius: 2 }} title={m + 'min'}/>
        ))}
      </div>
    </button>
  );
}

function LearnDetail({ domain, state, dispatch, onBack, openQuick }) {
  const resourcesDone = domain.resources.filter(r => r.status === 'done').length;
  const lastWeek = (domain.sessions_minutes_per_day || []).slice(-7);
  const lastMin = lastWeek.reduce((s, x) => s + x, 0);
  return (
    <div className="fade-in" style={{ padding: '20px 24px', maxWidth: 1400, margin: '0 auto' }}>
      <button className="btn btn-ghost btn-sm" onClick={onBack} style={{ marginBottom: 12 }}>
        <Icon.ChevronLeft size={14}/> Back to domains
      </button>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 20 }}>
        <div>
          <div className="sec-label">DOMAIN · {domain.status.toUpperCase().replace('_',' ')}</div>
          <h1 style={{ fontSize: 32, fontWeight: 600, margin: '6px 0 0', letterSpacing: '-0.02em' }}>{domain.title}</h1>
          <div className="t-13" style={{ color: 'var(--text-2)', marginTop: 6, maxWidth: 700 }}>{domain.description}</div>
        </div>
        <button className="btn btn-primary" onClick={() => openQuick('session')}><Icon.Plus size={12}/> Log Session</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 20 }}>
        <BigStat label="PROGRESS" value={domain.progress + '%'} color="var(--amber)" sub="overall"/>
        <BigStat label="RESOURCES" value={resourcesDone + '/' + domain.resources.length} color="var(--cyan)" sub="completed"/>
        <BigStat label="7d TIME" value={Math.round(lastMin/60*10)/10 + 'h'} color="var(--green)" sub={lastWeek.filter(x => x > 0).length + ' sessions'}/>
        <BigStat label="TARGET" value={domain.target_completion ? fmtDate(domain.target_completion) : '—'} sub="completion date"/>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 16 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Milestones */}
          <div className="card hud card-pad">
            <HUDBrackets/>
            <div className="sec-label" style={{ marginBottom: 14 }}>MILESTONES · {domain.milestones.filter(m=>m.done).length}/{domain.milestones.length}</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {domain.milestones.map((m, i) => (
                <div key={i} onClick={() => dispatch({ type: 'toggle_milestone', domainId: domain.id, index: i })}
                  style={{ display: 'flex', gap: 10, alignItems: 'center', padding: 8, borderRadius: 4, background: 'var(--bg-3)', cursor: 'pointer' }}>
                  <span style={{
                    width: 16, height: 16, borderRadius: 4, border: '1.5px solid var(--border-2)',
                    background: m.done ? 'var(--green)' : 'transparent',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    {m.done && <Icon.Check size={11} style={{ color: '#000' }}/>}
                  </span>
                  <span className="t-13" style={{ flex: 1, textDecoration: m.done ? 'line-through' : 'none', color: m.done ? 'var(--text-4)' : 'var(--text-1)' }}>{m.title}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Resources */}
          <div className="card hud" style={{ padding: 0, overflow: 'hidden' }}>
            <HUDBrackets/>
            <div className="sec-label" style={{ padding: 14, borderBottom: '1px solid var(--border)' }}>RESOURCES · {domain.resources.length}</div>
            <div>
              {domain.resources.length === 0 && <div style={{ padding: 20, color: 'var(--text-3)' }} className="t-13">No resources yet.</div>}
              {domain.resources.map((r, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px', borderBottom: i === domain.resources.length-1 ? 0 : '1px solid var(--border)' }}>
                  <div style={{ width: 28, height: 28, borderRadius: 4, background: 'var(--bg-3)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--cyan)' }}>
                    <ResourceTypeIcon type={r.type} size={14}/>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="t-13" style={{ fontWeight: 500 }}>{r.title}</div>
                    <div className="mono t-11" style={{ color: 'var(--text-3)', marginTop: 2, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{r.type}</div>
                  </div>
                  <StatusPill status={r.status}/>
                  {r.rating && (
                    <div style={{ display: 'flex', gap: 1 }}>
                      {[1,2,3,4,5].map(n => <Icon.Star key={n} size={11} style={{ color: n <= r.rating ? 'var(--amber)' : 'var(--text-5)', fill: n <= r.rating ? 'var(--amber)' : 'none' }}/>)}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Heatmap / sessions */}
          <div className="card hud card-pad">
            <HUDBrackets/>
            <div className="sec-label" style={{ marginBottom: 14 }}>SESSION HEATMAP · 14 DAYS</div>
            <div style={{ display: 'flex', gap: 3 }}>
              {(domain.sessions_minutes_per_day || []).map((m, i) => {
                const opacity = m > 0 ? 0.2 + Math.min(1, m/90) * 0.8 : 0.08;
                return (
                  <div key={i} style={{ flex: 1 }}>
                    <div style={{ height: 40, background: `rgba(245,158,11,${opacity})`, borderRadius: 3, border: '1px solid var(--border)' }} title={m + ' minutes'}/>
                    <div className="mono t-10" style={{ color: 'var(--text-4)', textAlign: 'center', marginTop: 4 }}>{14 - i}d</div>
                  </div>
                );
              })}
            </div>
            <div className="mono t-11" style={{ color: 'var(--text-3)', marginTop: 12, display: 'flex', justifyContent: 'space-between' }}>
              <span>TOTAL · {Math.round((domain.sessions_minutes_per_day||[]).reduce((s,x)=>s+x,0)/60*10)/10}h</span>
              <span>AVG · {Math.round((domain.sessions_minutes_per_day||[]).reduce((s,x)=>s+x,0) / 14)}min/day</span>
            </div>
          </div>

          {/* Notes */}
          <div className="card hud card-pad">
            <HUDBrackets/>
            <div className="sec-label" style={{ marginBottom: 12 }}>NOTES · KEY TAKEAWAYS</div>
            <textarea className="input" rows="8" defaultValue={domain.notes || `// Key takeaways\n\n- \n- \n- \n\n// Open questions\n\n- \n`}
              style={{ fontFamily: 'var(--ff-mono)', fontSize: 12, lineHeight: 1.6, color: 'var(--text-1)', resize: 'vertical' }}/>
          </div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { LearnView });
