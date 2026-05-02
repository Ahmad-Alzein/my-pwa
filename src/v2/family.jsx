// Family Ledger — IOUs, snapshots, transactions, notes
function FamilyLedger({ state, setState }) {
  const family = state.family;
  const txs = family.transactions;

  const expense = txs.filter(t => t.transaction_type === 'expense').reduce((a,b) => a + b.amount, 0);
  const income = txs.filter(t => t.transaction_type === 'income').reduce((a,b) => a + b.amount, 0);
  const net = income - expense;
  const latestSnap = family.snapshots[family.snapshots.length - 1];

  const [addOpen, setAddOpen] = React.useState(false);
  const [editingEntry, setEditingEntry] = React.useState(null);
  const [noteText, setNoteText] = React.useState('');

  const addNote = () => {
    if (!noteText.trim()) return;
    setState(s => ({ ...s, family: { ...s.family, notes: [{ id: 'fn' + Date.now(), content: noteText, is_resolved: false, created_at: window.iso(new Date()) }, ...s.family.notes] }}));
    setNoteText('');
  };
  const toggleNote = (id) => setState(s => ({
    ...s,
    family: { ...s.family, notes: s.family.notes.map(n => n.id === id ? { ...n, is_resolved: !n.is_resolved, resolved_at: !n.is_resolved ? window.iso(new Date()) : null } : n) }
  }));
  const saveEntry = (entry) => setState(s => ({
    ...s,
    family: {
      ...s.family,
      transactions: s.family.transactions.map(t => t.id === entry.id ? entry : t)
    }
  }));
  const deleteEntry = (id) => {
    if (!window.confirm('Delete this family entry?')) return;
    setState(s => ({ ...s, family: { ...s.family, transactions: s.family.transactions.filter(t => t.id !== id) } }));
  };
  const deleteNote = (id) => {
    if (!window.confirm('Delete this note?')) return;
    setState(s => ({ ...s, family: { ...s.family, notes: s.family.notes.filter(n => n.id !== id) } }));
  };

  // Tag breakdown
  const byTag = {};
  txs.filter(t => t.transaction_type === 'expense').forEach(t => { byTag[t.tag] = (byTag[t.tag] || 0) + t.amount; });
  const tagRows = Object.entries(byTag).sort((a,b) => b[1] - a[1]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Hero balance card */}
      <Card padding="var(--space-2xl)" style={{ background: 'var(--bg-raised)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, right: 0, width: 200, height: 200, background: 'radial-gradient(circle, var(--accent-soft) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div className="caps" style={{ marginBottom: 12 }}>Net balance with Mohtadi</div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 16, marginBottom: 32 }}>
          <Amount value={Math.abs(net)} size="xxl" tone={net >= 0 ? 'accent' : 'expense'} />
          <div style={{ fontSize: 14, color: 'var(--text-secondary)' }}>
            {net >= 0 ? 'They owe you' : 'You owe them'}
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 24, rowGap: 20 }}>
          <div>
            <div className="caps" style={{ marginBottom: 6 }}>Spent for them</div>
            <Amount value={expense} size="lg" />
          </div>
          <div>
            <div className="caps" style={{ marginBottom: 6 }}>Received</div>
            <Amount value={income} size="lg" tone="income" />
          </div>
          <div>
            <div className="caps" style={{ marginBottom: 6 }}>Last snapshot</div>
            <Amount value={(latestSnap?.bank_amount || 0) + (latestSnap?.cash_amount || 0)} size="lg" tone="muted" />
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{latestSnap?.name}</div>
          </div>
          <div>
            <div className="caps" style={{ marginBottom: 6 }}>Open IOUs</div>
            <span className="mono" style={{ fontSize: 20, color: 'var(--text-primary)', letterSpacing: '-0.01em' }}>{family.notes.filter(n => !n.is_resolved).length}</span>
          </div>
        </div>
        <div style={{ position: 'absolute', top: 24, right: 24 }}>
          <Button icon="plus" onClick={() => setAddOpen(true)}>New entry</Button>
        </div>
      </Card>

      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 24 }}>
        {/* Transactions */}
        <Card padding="var(--space-xl)">
          <SectionTitle eyebrow={`${txs.length} entries`}>Transactions</SectionTitle>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {txs.slice(0, 14).map((t, i) => (
              <div key={t.id} style={{
                display: 'flex', alignItems: 'center', gap: 14,
                padding: '12px 0',
                borderBottom: i < txs.length - 1 ? '1px solid var(--border-soft)' : 'none',
              }}>
                <div style={{
                  width: 32, height: 32, borderRadius: '50%',
                  display: 'grid', placeItems: 'center',
                  background: t.transaction_type === 'income' ? 'var(--success-soft)' : 'var(--danger-soft)',
                  color: t.transaction_type === 'income' ? 'var(--success)' : 'var(--danger)',
                  flexShrink: 0,
                }}>
                  <Icon name={t.transaction_type === 'income' ? 'arrowDown' : 'arrowUp'} size={14} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, color: 'var(--text-primary)' }}>{t.description}</div>
                  <div style={{ display: 'flex', gap: 8, fontSize: 11, color: 'var(--text-muted)', marginTop: 3 }}>
                    <span>{t.tag}</span>
                    <span>·</span>
                    <span>{t.payment_method.replace('_', ' ')}</span>
                    <span>·</span>
                    <span className="mono">{t.date}</span>
                  </div>
                </div>
                <Amount
                  value={t.transaction_type === 'income' ? t.amount : -t.amount}
                  tone={t.transaction_type === 'income' ? 'income' : 'expense'}
                  size="sm"
                />
                <FinanceRowActions onEdit={() => setEditingEntry(t)} onDelete={() => deleteEntry(t.id)} />
              </div>
            ))}
          </div>
        </Card>

        {/* IOUs / Notes */}
        <Card padding="var(--space-xl)">
          <SectionTitle eyebrow={`${family.notes.filter(n => !n.is_resolved).length} open`}>Notes & IOUs</SectionTitle>
          <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
            <Input value={noteText} onChange={e => setNoteText(e.target.value)} onKeyDown={e => e.key === 'Enter' && addNote()} placeholder="ghadi bado: 100" style={{ height: 38, fontSize: 13 }} />
            <Button size="sm" onClick={addNote} icon="plus" />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {family.notes.map(n => (
              <div key={n.id} style={{
                display: 'flex', alignItems: 'flex-start', gap: 10,
                padding: '10px 4px',
                borderBottom: '1px solid var(--border-soft)',
                textAlign: 'left',
                width: '100%',
              }}>
                <button onClick={() => toggleNote(n.id)} style={{
                  width: 16, height: 16, borderRadius: 4,
                  border: `1.5px solid ${n.is_resolved ? 'var(--success)' : 'var(--border)'}`,
                  background: n.is_resolved ? 'var(--success)' : 'transparent',
                  display: 'grid', placeItems: 'center',
                  flexShrink: 0, marginTop: 2,
                }}>
                  {n.is_resolved && <Icon name="check" size={9} stroke={2.5} style={{ color: '#fff' }} />}
                </button>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className={n.is_resolved ? '' : 'mono'} style={{
                    fontSize: 13,
                    color: n.is_resolved ? 'var(--text-muted)' : 'var(--text-primary)',
                    textDecoration: n.is_resolved ? 'line-through' : 'none',
                  }}>{n.content}</div>
                  <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 2 }}>{n.created_at}{n.resolved_at && ` → resolved ${n.resolved_at}`}</div>
                </div>
                <button onClick={() => deleteNote(n.id)} title="Delete note" style={{ ...financeActionButtonStyle, color: 'var(--danger)' }}><Icon name="trash" size={14} /></button>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        {/* Snapshots timeline */}
        <Card padding="var(--space-xl)">
          <SectionTitle eyebrow="Reconciliation">Cash + bank snapshots</SectionTitle>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {family.snapshots.map((s, i) => {
              const total = s.bank_amount + s.cash_amount;
              const max = Math.max(...family.snapshots.map(x => x.bank_amount + x.cash_amount));
              const pct = (total / max) * 100;
              return (
                <div key={s.id}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, alignItems: 'baseline' }}>
                    <div>
                      <span style={{ fontSize: 13, color: 'var(--text-primary)', fontWeight: 500 }}>{s.name}</span>
                      <span className="mono" style={{ fontSize: 11, color: 'var(--text-muted)', marginLeft: 8 }}>{s.date}</span>
                    </div>
                    <Amount value={total} size="sm" tone="muted" />
                  </div>
                  <div style={{ display: 'flex', height: 6, borderRadius: 3, overflow: 'hidden', background: 'var(--bg-tertiary)' }}>
                    <div style={{ width: `${(s.bank_amount / max) * 100}%`, background: 'var(--info)' }} />
                    <div style={{ width: `${(s.cash_amount / max) * 100}%`, background: 'var(--accent)' }} />
                  </div>
                  <div style={{ display: 'flex', gap: 14, fontSize: 11, color: 'var(--text-muted)', marginTop: 5 }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}><Dot color="var(--info)" /> Bank <Amount value={s.bank_amount} size="sm" tone="muted" /></span>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}><Dot color="var(--accent)" /> Cash <Amount value={s.cash_amount} size="sm" tone="muted" /></span>
                    {s.notes && <span style={{ marginLeft: 'auto', fontStyle: 'italic' }}>{s.notes}</span>}
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        <Card padding="var(--space-xl)">
          <SectionTitle eyebrow="Where it went">Spend by category</SectionTitle>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {tagRows.map(([tag, amt], i) => {
              const pct = (amt / expense) * 100;
              return (
                <div key={tag}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5, fontSize: 13 }}>
                    <span style={{ color: 'var(--text-primary)' }}>{tag}</span>
                    <Amount value={amt} size="sm" tone="muted" />
                  </div>
                  <div style={{ height: 3, background: 'var(--bg-tertiary)', borderRadius: 2, overflow: 'hidden' }}>
                    <div style={{ width: `${pct}%`, height: '100%', background: 'var(--accent)' }} />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      <QuickFamilyModal open={addOpen} onClose={() => setAddOpen(false)} onSave={(t) => {
        setState(s => ({ ...s, family: { ...s.family, transactions: [t, ...s.family.transactions] }}));
      }} />
      <QuickFamilyModal open={!!editingEntry} initial={editingEntry} onClose={() => setEditingEntry(null)} onSave={saveEntry} />
    </div>
  );
}

Object.assign(window, { FamilyLedger });
