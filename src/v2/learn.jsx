// Learn module — Atelier
function Learn({ state, setState }) {
  const [selectedId, setSelectedId] = React.useState(state.learning.find(l => l.status === 'in_progress')?.id || state.learning[0]?.id);
  const selected = state.learning.find(l => l.id === selectedId);

  const totalMinutes = state.learning.reduce((a, l) => a + (l.sessions_minutes_per_day || []).reduce((x,y) => x+y, 0), 0);
  const inProgress = state.learning.filter(l => l.status === 'in_progress').length;

  return (
    <PageContainer>
      <PageTitle eyebrow="Domains">Learning shelf</PageTitle>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 20, marginBottom: 32 }}>
        <StatCard label="In progress" value={<span className="mono" style={{ fontSize: 28, letterSpacing: '-0.01em' }}>{inProgress}</span>} hint={`of ${state.learning.length} domains`} />
        <StatCard label="14-day minutes" value={<span className="mono" style={{ fontSize: 28, letterSpacing: '-0.01em' }}>{totalMinutes}</span>} hint={`~${(totalMinutes / 14).toFixed(0)} min/day avg`} />
        <StatCard label="Active streak" value={<span className="mono" style={{ fontSize: 28, letterSpacing: '-0.01em' }}>9d</span>} hint="longest run this month" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: 24 }}>
        {/* Domain list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {state.learning.map(l => {
            const active = l.id === selectedId;
            return (
              <button key={l.id} onClick={() => setSelectedId(l.id)} style={{
                padding: 16,
                background: active ? 'var(--bg-raised)' : 'var(--bg-secondary)',
                border: `1px solid ${active ? 'var(--accent)' : 'var(--border-soft)'}`,
                borderRadius: 'var(--radius-md)',
                textAlign: 'left',
                cursor: 'pointer',
                transition: 'all 0.15s var(--ease)',
                position: 'relative',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', gap: 8, marginBottom: 8 }}>
                  <div className="serif" style={{ fontSize: 15, color: 'var(--text-primary)', fontWeight: 500, letterSpacing: '-0.005em' }}>{l.title}</div>
                  <Status label={l.status.replace('_', ' ')} tone={l.status === 'in_progress' ? 'accent' : l.status === 'planned' ? 'muted' : 'success'} />
                </div>
                <div style={{ height: 3, background: 'var(--bg-tertiary)', borderRadius: 2, overflow: 'hidden', marginBottom: 6 }}>
                  <div style={{ width: `${l.progress}%`, height: '100%', background: 'var(--accent)' }} />
                </div>
                <div className="mono" style={{ fontSize: 11, color: 'var(--text-muted)' }}>{l.progress}% · {l.domain}</div>
              </button>
            );
          })}
        </div>

        {/* Detail */}
        {selected && (
          <Card padding="var(--space-xl)">
            <div style={{ marginBottom: 24 }}>
              <div className="caps" style={{ marginBottom: 8 }}>{selected.domain}</div>
              <h2 className="serif" style={{ margin: 0, fontSize: 28, fontWeight: 500, letterSpacing: '-0.02em' }}>{selected.title}</h2>
              <div style={{ display: 'flex', gap: 16, marginTop: 12, fontSize: 13, color: 'var(--text-secondary)' }}>
                <span>Status · <Status label={selected.status.replace('_', ' ')} tone={selected.status === 'in_progress' ? 'accent' : 'muted'} /></span>
                <span>Progress · <span className="mono" style={{ color: 'var(--text-primary)' }}>{selected.progress}%</span></span>
              </div>
            </div>

            {/* Heatmap */}
            <div style={{ marginBottom: 28 }}>
              <SectionTitle eyebrow="Last 14 days">Sessions</SectionTitle>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(14, 1fr)', gap: 4 }}>
                {(selected.sessions_minutes_per_day || []).map((m, i) => {
                  const intensity = m === 0 ? 0 : m < 20 ? 1 : m < 45 ? 2 : 3;
                  const colors = ['var(--bg-tertiary)', 'var(--accent-soft)', 'var(--accent)', 'var(--accent-hover)'];
                  return (
                    <div key={i} title={`${m} min`} style={{
                      aspectRatio: '1',
                      background: colors[intensity],
                      borderRadius: 'var(--radius-sm)',
                      transition: 'transform 0.15s var(--ease)',
                    }} />
                  );
                })}
              </div>
            </div>

            {/* Milestones */}
            {selected.milestones && (
              <div style={{ marginBottom: 28 }}>
                <SectionTitle eyebrow={`${selected.milestones.filter(m => m.done).length} of ${selected.milestones.length}`}>Milestones</SectionTitle>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  {selected.milestones.map((m, i) => (
                    <div key={i} style={{
                      display: 'flex', alignItems: 'center', gap: 12,
                      padding: '10px 0',
                      borderBottom: i < selected.milestones.length - 1 ? '1px solid var(--border-soft)' : 'none',
                    }}>
                      <Icon name={m.done ? 'circleCheck' : 'circle'} size={16} style={{ color: m.done ? 'var(--success)' : 'var(--text-muted)' }} />
                      <span style={{
                        fontSize: 14,
                        color: m.done ? 'var(--text-muted)' : 'var(--text-primary)',
                        textDecoration: m.done ? 'line-through' : 'none'
                      }}>{m.title}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Resources */}
            {selected.resources && (
              <div style={{ marginBottom: 28 }}>
                <SectionTitle eyebrow="Reading list">Resources</SectionTitle>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {selected.resources.map((r, i) => (
                    <div key={i} style={{
                      display: 'flex', alignItems: 'center', gap: 12,
                      padding: '12px 14px',
                      background: 'var(--bg-primary)',
                      border: '1px solid var(--border-soft)',
                      borderRadius: 'var(--radius-md)',
                    }}>
                      <Icon name="book" size={14} style={{ color: 'var(--text-muted)' }} />
                      <span style={{ fontSize: 13, flex: 1 }}>{r.title}</span>
                      <span style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{r.type}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Notes */}
            {selected.notes && (
              <div>
                <SectionTitle eyebrow="Field notes">Notes</SectionTitle>
                <div style={{
                  padding: 16,
                  background: 'var(--bg-primary)',
                  border: '1px solid var(--border-soft)',
                  borderRadius: 'var(--radius-md)',
                  fontSize: 13,
                  color: 'var(--text-secondary)',
                  lineHeight: 1.6,
                  fontStyle: 'italic',
                }}>{selected.notes}</div>
              </div>
            )}
          </Card>
        )}
      </div>
    </PageContainer>
  );
}

Object.assign(window, { Learn });
