// Family — Saving HUB ledger (running balance, notes, snapshots)
function Family() {
  const [tx, setTx] = React.useState(SEED_FAMILY);
  const [notes, setNotes] = React.useState(SEED_FAMILY_NOTES);
  const [snapshots] = React.useState(SEED_SNAPSHOTS);
  const [selected, setSelected] = React.useState(new Set());
  const [tab, setTab] = React.useState('ledger'); // ledger | notes | snapshots

  const sorted = [...tx].sort((a, b) => new Date(b.date) - new Date(a.date));

  // Running balance — Mohtadi has paid back X, owes/lent Y
  const totalIn  = tx.filter(x => x.type === 'income').reduce((a, x) => a + x.amount, 0);
  const totalOut = tx.filter(x => x.type === 'expense').reduce((a, x) => a + x.amount, 0);
  const balance = totalOut - totalIn; // positive = Mohtadi owes Ahmad

  const allSelected = sorted.length > 0 && sorted.every(x => selected.has(x.id));
  const toggle = (id) => { const n = new Set(selected); n.has(id) ? n.delete(id) : n.add(id); setSelected(n); };
  const toggleAll = () => setSelected(allSelected ? new Set() : new Set(sorted.map(x => x.id)));
  const remove = (ids) => { setTx(tx.filter(x => !ids.includes(x.id))); setSelected(new Set()); };

  const latest = snapshots[snapshots.length - 1];
  const cashOnHand = latest.bank + latest.cash;

  return (
    <div className="fade-in">
      <PageTitle eyebrow="Family · Mohtadi" right={
        <Button variant="primary" icon="plus">Log entry</Button>
      }>Saving HUB</PageTitle>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 28 }}>
        <Card raised>
          <Caps style={{ marginBottom: 8 }}>Outstanding</Caps>
          <Amount value={Math.abs(balance)} size="xl" tone={balance >= 0 ? 'expense' : 'income'} />
          <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 6 }}>{balance >= 0 ? 'Owed to Ahmad' : 'Owed to Mohtadi'}</div>
        </Card>
        <Card raised>
          <Caps style={{ marginBottom: 8 }}>Total support</Caps>
          <Amount value={totalOut} size="xl" tone="neutral" />
          <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 6 }}>{tx.filter(x => x.type === 'expense').length} entries</div>
        </Card>
        <Card raised>
          <Caps style={{ marginBottom: 8 }}>Repaid</Caps>
          <Amount value={totalIn} size="xl" tone="income" />
          <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 6 }}>{tx.filter(x => x.type === 'income').length} repayments</div>
        </Card>
        <Card raised>
          <Caps style={{ marginBottom: 8 }}>Cash on hand</Caps>
          <Amount value={cashOnHand} size="xl" tone="accent" />
          <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 6 }}>Bank €{latest.bank} · cash €{latest.cash}</div>
        </Card>
      </div>

      <div style={{ display: 'flex', gap: 4, marginBottom: 16, borderBottom: '1px solid var(--border-soft)' }}>
        {[{ k: 'ledger', l: 'Ledger' }, { k: 'notes', l: `Notes (${notes.filter(n => !n.resolved).length})` }, { k: 'snapshots', l: 'Snapshots' }].map(t => (
          <button key={t.k} onClick={() => setTab(t.k)} style={{
            padding: '12px 18px', fontSize: 14, fontWeight: tab === t.k ? 500 : 400,
            color: tab === t.k ? 'var(--text-primary)' : 'var(--text-secondary)',
            borderBottom: `2px solid ${tab === t.k ? 'var(--accent)' : 'transparent'}`,
            marginBottom: -1, transition: 'all 0.15s var(--ease)' }}>{t.l}</button>
        ))}
      </div>

      {tab === 'ledger' && (
        <Card padding={0}>
          <div style={{ padding: '14px 24px', borderBottom: '1px solid var(--border-soft)', display: 'flex', alignItems: 'center', gap: 12 }}>
            <Checkbox checked={allSelected} onChange={toggleAll} />
            <span style={{ fontSize: 12, color: 'var(--text-secondary)', flex: 1 }}>{selected.size > 0 ? `${selected.size} selected` : `${sorted.length} entries`}</span>
            {selected.size > 0 && (
              <>
                <Button variant="ghost" size="sm" onClick={() => setSelected(new Set())}>Clear</Button>
                <Button variant="danger" size="sm" icon="trash" onClick={() => remove([...selected])}>Delete</Button>
              </>
            )}
          </div>
          {sorted.map((t, i) => {
            const sel = selected.has(t.id);
            const d = new Date(t.date);
            return (
              <div key={t.id} onClick={() => toggle(t.id)} style={{
                display: 'grid', gridTemplateColumns: '40px 80px 1fr 130px 120px',
                padding: '14px 24px', alignItems: 'center', cursor: 'pointer',
                borderBottom: i < sorted.length - 1 ? '1px solid var(--border-soft)' : 'none',
                background: sel ? 'var(--accent-soft)' : 'transparent', transition: 'background 0.12s' }}>
                <Checkbox checked={sel} onChange={() => toggle(t.id)} />
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-secondary)' }}>
                  {d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
                </div>
                <div>
                  <div style={{ fontSize: 14 }}>{t.description}</div>
                  <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
                    <Pill tone="muted">{t.tag}</Pill>
                    <span style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'capitalize' }}>{t.method.replace('_', ' ')}</span>
                  </div>
                </div>
                <div><Pill tone={t.type === 'income' ? 'success' : 'p1'}>{t.type === 'income' ? '↓ Repayment' : '↑ Support'}</Pill></div>
                <div style={{ textAlign: 'right' }}>
                  <Amount value={t.amount} tone={t.type === 'income' ? 'income' : 'expense'} />
                </div>
              </div>
            );
          })}
        </Card>
      )}

      {tab === 'notes' && (
        <Card>
          <SectionTitle eyebrow="Quick log">Open notes & reminders</SectionTitle>
          {notes.map(n => (
            <div key={n.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0', borderBottom: '1px solid var(--border-soft)' }}>
              <button onClick={() => setNotes(notes.map(x => x.id === n.id ? { ...x, resolved: !x.resolved } : x))} style={{
                width: 18, height: 18, borderRadius: '50%', border: `1.5px solid ${n.resolved ? 'var(--success)' : 'var(--border)'}`,
                background: n.resolved ? 'var(--success)' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {n.resolved && <Icon name="check" size={11} style={{ color: '#fff', strokeWidth: 3 }} />}
              </button>
              <div style={{ flex: 1, fontFamily: 'var(--font-mono)', fontSize: 13,
                color: n.resolved ? 'var(--text-muted)' : 'var(--text-primary)',
                textDecoration: n.resolved ? 'line-through' : 'none' }}>{n.content}</div>
              <span style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                {new Date(n.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
              </span>
            </div>
          ))}
          <div style={{ marginTop: 16, display: 'flex', gap: 8 }}>
            <Input placeholder="e.g. ghadi bado: 100" style={{ flex: 1 }} />
            <Button variant="primary" icon="plus">Log</Button>
          </div>
        </Card>
      )}

      {tab === 'snapshots' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
          {snapshots.map(s => (
            <Card key={s.id} raised>
              <Caps style={{ marginBottom: 6 }}>{new Date(s.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</Caps>
              <h3 className="serif" style={{ margin: '0 0 14px', fontSize: 18, fontWeight: 500 }}>{s.name}</h3>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderTop: '1px solid var(--border-soft)' }}>
                <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Bank</span><Amount value={s.bank} size="sm" />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderTop: '1px solid var(--border-soft)' }}>
                <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Cash</span><Amount value={s.cash} size="sm" />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0 0', borderTop: '1px solid var(--border)', marginTop: 4 }}>
                <span style={{ fontSize: 12, color: 'var(--text-primary)', fontWeight: 500 }}>Total</span><Amount value={s.bank + s.cash} tone="accent" />
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
window.Family = Family;
