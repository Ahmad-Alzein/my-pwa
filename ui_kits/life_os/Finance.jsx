// Finance — Overview + Statements (new) with multi-select delete
function Finance({ subroute, onSubroute }) {
  if (subroute === 'statements') return <Statements onBack={() => onSubroute('finance')} />;
  return <FinanceOverview onStatements={() => onSubroute('finance/statements')} />;
}

function FinanceOverview({ onStatements }) {
  const [type, setType] = React.useState('expense'); // expense | income
  const [period, setPeriod] = React.useState('month'); // month | year | all
  const [selected, setSelected] = React.useState(() => new Set());
  const [expenses, setExpenses] = React.useState(SEED_EXPENSES);
  const [income, setIncome]   = React.useState(SEED_INCOME);

  React.useEffect(() => { setSelected(new Set()); }, [type, period]);

  const items = type === 'expense' ? expenses : income;
  const cutoff = period === 'month' ? 30 : period === 'year' ? 365 : 99999;
  const visible = items.filter(it => {
    const d = (today - new Date(it.date)) / (1000 * 60 * 60 * 24);
    return d <= cutoff;
  });

  const total = visible.reduce((a, x) => a + x.amount, 0);
  const allSelected = visible.length > 0 && visible.every(x => selected.has(x.id));

  const toggle = (id) => { const n = new Set(selected); n.has(id) ? n.delete(id) : n.add(id); setSelected(n); };
  const toggleAll = () => setSelected(allSelected ? new Set() : new Set(visible.map(x => x.id)));
  const remove = (ids) => {
    if (type === 'expense') setExpenses(expenses.filter(x => !ids.includes(x.id)));
    else setIncome(income.filter(x => !ids.includes(x.id)));
    setSelected(new Set());
  };

  const tagTotals = {};
  visible.forEach(x => { tagTotals[x.tag] = (tagTotals[x.tag] || 0) + x.amount; });
  const topTags = Object.entries(tagTotals).sort((a, b) => b[1] - a[1]).slice(0, 5);

  return (
    <div className="fade-in">
      <PageTitle eyebrow="Finance" right={
        <div style={{ display: 'flex', gap: 10 }}>
          <Button variant="secondary" icon="archive" onClick={onStatements}>Statements</Button>
          <Button variant="primary" icon="plus">Add entry</Button>
        </div>
      }>Overview</PageTitle>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 24, marginBottom: 28 }}>
        <Card raised>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
            <Segmented value={type} options={[{ value: 'expense', label: 'Spending' }, { value: 'income', label: 'Income' }]} onChange={setType} />
            <Segmented value={period} options={[{ value: 'month', label: 'Month' }, { value: 'year', label: 'Year' }, { value: 'all', label: 'All' }]} onChange={setPeriod} />
          </div>
          <Caps style={{ marginBottom: 8 }}>{type === 'expense' ? 'Total spent' : 'Total earned'} · {period === 'month' ? 'last 30 days' : period === 'year' ? 'last 12 months' : 'all time'}</Caps>
          <Amount value={total} size="xxl" tone={type === 'expense' ? 'expense' : 'income'} />
        </Card>

        <Card>
          <Caps style={{ marginBottom: 12 }}>By tag</Caps>
          {topTags.map(([tag, amt]) => {
            const pct = (amt / total) * 100;
            return (
              <div key={tag} style={{ marginBottom: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4 }}>
                  <span style={{ color: 'var(--text-secondary)' }}>{tag}</span>
                  <Amount value={amt} size="sm" tone="muted" />
                </div>
                <div style={{ height: 4, background: 'var(--bg-tertiary)', borderRadius: 2 }}>
                  <div style={{ height: '100%', width: `${pct}%`, background: 'var(--accent)', borderRadius: 2 }} />
                </div>
              </div>
            );
          })}
        </Card>
      </div>

      <Card padding={0}>
        <div style={{ padding: '18px 24px', borderBottom: '1px solid var(--border-soft)', display: 'flex', alignItems: 'center', gap: 12 }}>
          <h3 className="serif" style={{ margin: 0, fontSize: 17, fontWeight: 500, flex: 1 }}>
            {type === 'expense' ? 'Expenses' : 'Income'} <span style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 400, marginLeft: 8 }}>{visible.length}</span>
          </h3>
          {selected.size === 0 ? (
            <Button variant="ghost" size="sm" icon="filter">Filter</Button>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, animation: 'fadeIn 200ms var(--ease)' }}>
              <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{selected.size} selected</span>
              <Button variant="ghost" size="sm" onClick={() => setSelected(new Set())}>Clear</Button>
              <Button variant="danger" size="sm" icon="trash" onClick={() => remove([...selected])}>Delete {selected.size}</Button>
            </div>
          )}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '40px 1.6fr 1fr 110px 120px 60px', padding: '10px 24px',
          borderBottom: '1px solid var(--border-soft)', background: 'var(--bg-tertiary)',
          fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-muted)' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Checkbox checked={allSelected} onChange={toggleAll} />
          </div>
          <div>Source</div><div>Tag</div><div>Date</div><div style={{ textAlign: 'right' }}>Amount</div><div></div>
        </div>

        {visible.map(it => (
          <Row key={it.id} item={it} type={type} selected={selected.has(it.id)} onToggle={() => toggle(it.id)} onDelete={() => remove([it.id])} />
        ))}
        {visible.length === 0 && <div style={{ padding: 60, textAlign: 'center', color: 'var(--text-muted)', fontSize: 13 }}>No entries in this period.</div>}
      </Card>
    </div>
  );
}

function Checkbox({ checked, onChange, indeterminate }) {
  return (
    <button onClick={(e) => { e.stopPropagation(); onChange(); }} style={{
      width: 18, height: 18, borderRadius: 4, border: `1.5px solid ${checked ? 'var(--accent)' : 'var(--border)'}`,
      background: checked ? 'var(--accent)' : 'var(--bg-primary)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.15s var(--ease)' }}>
      {checked && <Icon name="check" size={11} style={{ color: '#fff', strokeWidth: 3 }} />}
    </button>
  );
}

function Row({ item, type, selected, onToggle, onDelete }) {
  const [hover, setHover] = React.useState(false);
  const d = new Date(item.date);
  return (
    <div onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      onClick={onToggle} style={{
        display: 'grid', gridTemplateColumns: '40px 1.6fr 1fr 110px 120px 60px', padding: '14px 24px', alignItems: 'center',
        borderBottom: '1px solid var(--border-soft)',
        background: selected ? 'var(--accent-soft)' : hover ? 'var(--bg-tertiary)' : 'transparent',
        cursor: 'pointer', transition: 'background 0.12s' }}>
      <div><Checkbox checked={selected} onChange={onToggle} /></div>
      <div style={{ fontSize: 14, color: 'var(--text-primary)' }}>{item.source}</div>
      <div><Pill tone="muted">{item.tag}</Pill></div>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-secondary)' }}>
        {d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
      </div>
      <div style={{ textAlign: 'right' }}><Amount value={item.amount} tone={type === 'expense' ? 'expense' : 'income'} /></div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 4, opacity: hover && !selected ? 1 : 0, transition: 'opacity 0.15s' }}>
        <button onClick={(e) => e.stopPropagation()} style={{ width: 28, height: 28, borderRadius: 6, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon name="edit" size={14} /></button>
        <button onClick={(e) => { e.stopPropagation(); onDelete(); }} style={{ width: 28, height: 28, borderRadius: 6, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon name="trash" size={14} /></button>
      </div>
    </div>
  );
}

// Statements — monthly + yearly archive
function Statements({ onBack }) {
  const [view, setView] = React.useState('month'); // month | year
  const [openId, setOpenId] = React.useState(null);

  const months = buildMonthly(SEED_EXPENSES, SEED_INCOME).slice(0, 6);
  const years  = buildYearly(SEED_EXPENSES, SEED_INCOME);

  const list = view === 'month' ? months : years;

  return (
    <div className="fade-in">
      <button onClick={onBack} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--text-secondary)', fontSize: 13, marginBottom: 18 }}>
        <Icon name="chevronLeft" size={14} /> Finance
      </button>
      <PageTitle eyebrow="Finance · Archive" right={
        <Segmented value={view} options={[{ value: 'month', label: 'Monthly' }, { value: 'year', label: 'Yearly' }]} onChange={setView} />
      }>Statements</PageTitle>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
        {list.map(s => (
          <Card key={s.id} raised onClick={() => setOpenId(s.id)} style={{ transition: 'transform 0.15s var(--ease), box-shadow 0.15s var(--ease)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
              <div>
                <Caps style={{ marginBottom: 6 }}>{view === 'month' ? 'Monthly statement' : 'Yearly statement'}</Caps>
                <h3 className="serif" style={{ margin: 0, fontSize: 22, fontWeight: 500, letterSpacing: '-0.01em' }}>{s.label}</h3>
              </div>
              <Pill tone={s.net >= 0 ? 'success' : 'p0'}>{s.net >= 0 ? 'Net positive' : 'Net negative'}</Pill>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, paddingTop: 16, borderTop: '1px solid var(--border-soft)' }}>
              <div><Caps style={{ marginBottom: 4 }}>In</Caps><Amount value={s.income} tone="income" size="lg" /></div>
              <div><Caps style={{ marginBottom: 4 }}>Out</Caps><Amount value={s.spend} tone="expense" size="lg" /></div>
              <div><Caps style={{ marginBottom: 4 }}>Net</Caps><Amount value={s.net} tone={s.net >= 0 ? 'accent' : 'expense'} size="lg" /></div>
            </div>
          </Card>
        ))}
      </div>

      <Modal open={openId !== null} onClose={() => setOpenId(null)} title={list.find(x => x.id === openId)?.label}
        eyebrow={view === 'month' ? 'Monthly statement' : 'Yearly statement'} width={560}>
        {openId && (() => {
          const s = list.find(x => x.id === openId);
          return (
            <div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, padding: '16px 0', borderTop: '1px solid var(--border-soft)', borderBottom: '1px solid var(--border-soft)', marginBottom: 20 }}>
                <div><Caps style={{ marginBottom: 4 }}>Income</Caps><Amount value={s.income} tone="income" size="lg" /></div>
                <div><Caps style={{ marginBottom: 4 }}>Spending</Caps><Amount value={s.spend} tone="expense" size="lg" /></div>
                <div><Caps style={{ marginBottom: 4 }}>Net</Caps><Amount value={s.net} tone={s.net >= 0 ? 'accent' : 'expense'} size="lg" /></div>
              </div>
              <Caps style={{ marginBottom: 10 }}>Top categories</Caps>
              {Object.entries(s.byTag).sort((a,b) => b[1] - a[1]).slice(0, 5).map(([t, v]) => (
                <div key={t} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--border-soft)' }}>
                  <span style={{ fontSize: 13 }}>{t}</span><Amount value={v} tone="muted" size="sm" />
                </div>
              ))}
              <div style={{ display: 'flex', gap: 10, marginTop: 24, justifyContent: 'flex-end' }}>
                <Button variant="ghost" onClick={() => setOpenId(null)}>Close</Button>
                <Button variant="primary" icon="archive">Export PDF</Button>
              </div>
            </div>
          );
        })()}
      </Modal>
    </div>
  );
}

function buildMonthly(exp, inc) {
  const groups = {};
  [...exp.map(x => ({...x, kind: 'e'})), ...inc.map(x => ({...x, kind: 'i'}))].forEach(x => {
    const d = new Date(x.date);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    if (!groups[key]) groups[key] = { id: key, label: d.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' }), income: 0, spend: 0, byTag: {} };
    if (x.kind === 'e') { groups[key].spend += x.amount; groups[key].byTag[x.tag] = (groups[key].byTag[x.tag] || 0) + x.amount; }
    else groups[key].income += x.amount;
  });
  return Object.values(groups).map(g => ({ ...g, net: g.income - g.spend })).sort((a, b) => b.id.localeCompare(a.id));
}
function buildYearly(exp, inc) {
  const groups = {};
  [...exp.map(x => ({...x, kind: 'e'})), ...inc.map(x => ({...x, kind: 'i'}))].forEach(x => {
    const key = String(new Date(x.date).getFullYear());
    if (!groups[key]) groups[key] = { id: key, label: key, income: 0, spend: 0, byTag: {} };
    if (x.kind === 'e') { groups[key].spend += x.amount; groups[key].byTag[x.tag] = (groups[key].byTag[x.tag] || 0) + x.amount; }
    else groups[key].income += x.amount;
  });
  return Object.values(groups).map(g => ({ ...g, net: g.income - g.spend })).sort((a, b) => b.id.localeCompare(a.id));
}

window.Finance = Finance;
