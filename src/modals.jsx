// Quick-add modals: Task, Expense, Income, Savings, Session

function ModalShell({ title, onClose, children, footer }) {
  React.useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal hud" onClick={e => e.stopPropagation()}>
        <HUDBrackets/>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div>
            <div className="sec-label">QUICK ADD</div>
            <div style={{ fontSize: 18, fontWeight: 600, marginTop: 4 }}>{title}</div>
          </div>
          <button className="btn btn-icon btn-ghost" onClick={onClose}><Icon.X size={14}/></button>
        </div>
        {children}
        {footer && <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 18, paddingTop: 14, borderTop: '1px solid var(--border)' }}>{footer}</div>}
      </div>
    </div>
  );
}

function Field({ label, children, hint }) {
  return (
    <div style={{ marginBottom: 12 }}>
      <label style={{ display: 'block', fontSize: 11, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6, fontFamily: 'var(--ff-mono)' }}>{label}</label>
      {children}
      {hint && <div style={{ fontSize: 11, color: 'var(--text-4)', marginTop: 4 }}>{hint}</div>}
    </div>
  );
}

function Select({ value, onChange, options }) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
      {options.map(o => (
        <button key={o.value} type="button"
          className="btn btn-sm"
          onClick={() => onChange(o.value)}
          style={{
            background: value === o.value ? 'var(--blue)' : 'var(--bg-3)',
            borderColor: value === o.value ? 'var(--blue)' : 'var(--border-2)',
            color: value === o.value ? 'white' : 'var(--text-2)',
          }}>
          {o.label}
        </button>
      ))}
    </div>
  );
}

function TaskQuickAdd({ onClose, onSave, defaultType = 'work' }) {
  const [title, setTitle] = React.useState('');
  const [type, setType] = React.useState(defaultType);
  const [status, setStatus] = React.useState('todo');
  const [priority, setPriority] = React.useState('p2');
  const [due, setDue] = React.useState(iso(new Date()));
  const [project, setProject] = React.useState('ML Infra');
  const [category, setCategory] = React.useState('Admin');
  const inputRef = React.useRef();
  React.useEffect(() => { setTimeout(() => inputRef.current?.focus(), 50); }, []);

  const submit = () => {
    if (!title.trim()) return;
    const t = {
      id: 't' + Date.now(), title, status, priority, due_date: due, type,
      tags: [], notes: '',
    };
    if (type === 'work') t.project = project;
    else t.category = category;
    onSave(t);
    onClose();
  };

  return (
    <ModalShell title="New Task" onClose={onClose} footer={
      <>
        <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
        <button className="btn btn-primary" onClick={submit}>
          Create <span className="mono" style={{ opacity: 0.6, marginLeft: 4 }}>↵</span>
        </button>
      </>
    }>
      <Field label="Title">
        <input ref={inputRef} className="input" placeholder="What needs doing?"
               value={title} onChange={e => setTitle(e.target.value)}
               onKeyDown={e => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey || title.trim())) submit(); }}/>
      </Field>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <Field label="Type">
          <Select value={type} onChange={setType} options={[
            { value: 'work', label: 'Work' }, { value: 'personal', label: 'Personal' },
          ]}/>
        </Field>
        <Field label="Priority">
          <Select value={priority} onChange={setPriority} options={[
            { value: 'p0', label: 'P0' }, { value: 'p1', label: 'P1' }, { value: 'p2', label: 'P2' }, { value: 'p3', label: 'P3' },
          ]}/>
        </Field>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <Field label="Status">
          <Select value={status} onChange={setStatus} options={[
            { value: 'todo', label: 'To Do' }, { value: 'in_progress', label: 'Doing' },
            { value: 'done', label: 'Done' }, { value: 'blocked', label: 'Blocked' },
          ]}/>
        </Field>
        <Field label="Due">
          <input type="date" className="input mono" value={due} onChange={e => setDue(e.target.value)}/>
        </Field>
      </div>
      {type === 'work' ? (
        <Field label="Project">
          <Select value={project} onChange={setProject} options={[
            { value: 'Incubation Squad', label: 'Incubation' },
            { value: 'ML Infra', label: 'ML Infra' },
            { value: 'Data Collection', label: 'Data' },
            { value: 'Other', label: 'Other' },
          ]}/>
        </Field>
      ) : (
        <Field label="Category">
          <Select value={category} onChange={setCategory} options={
            ['Admin','Health','Finance','Social','Home','Side Project'].map(c => ({ value: c, label: c }))
          }/>
        </Field>
      )}
    </ModalShell>
  );
}

function ExpenseQuickAdd({ onClose, onSave }) {
  const [amount, setAmount] = React.useState('');
  const [source, setSource] = React.useState('');
  const [tag, setTag] = React.useState('Groceries');
  const [date, setDate] = React.useState(iso(new Date()));
  const [notes, setNotes] = React.useState('');
  const [more, setMore] = React.useState(false);
  const amtRef = React.useRef();
  React.useEffect(() => { setTimeout(() => amtRef.current?.focus(), 50); }, []);

  const submit = () => {
    const a = parseFloat(amount);
    if (!a || !source.trim()) return;
    onSave({ id: 'e' + Date.now(), amount: a, source: source.trim(), tag, date, notes });
    onClose();
  };

  const commonTags = ['Groceries','Dining Out','Transportation','Utilities','Healthcare','Entertainment','Shopping','Tabac','Iphone','Rent/Mortgage','Trading','Insurance','Retail','once'];

  return (
    <ModalShell title="Log Expense" onClose={onClose} footer={
      <>
        <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
        <button className="btn btn-primary" onClick={submit}>Log Expense <span className="mono" style={{ opacity: 0.6, marginLeft: 4 }}>↵</span></button>
      </>
    }>
      <div style={{ display: 'grid', gridTemplateColumns: '160px 1fr', gap: 12, marginBottom: 12 }}>
        <Field label="Amount (€)">
          <div style={{ position: 'relative' }}>
            <span className="mono" style={{ position: 'absolute', left: 12, top: 9, color: 'var(--text-3)' }}>€</span>
            <input ref={amtRef} className="input mono" inputMode="decimal"
                   value={amount} onChange={e => setAmount(e.target.value)}
                   onKeyDown={e => { if (e.key === 'Enter') submit(); }}
                   style={{ paddingLeft: 24, fontSize: 18, fontWeight: 600 }} placeholder="0.00"/>
          </div>
        </Field>
        <Field label="Source">
          <input className="input" value={source} onChange={e => setSource(e.target.value)}
                 placeholder="Carrefour, Uber, …"
                 onKeyDown={e => { if (e.key === 'Enter') submit(); }}/>
        </Field>
      </div>
      <Field label="Tag">
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {commonTags.map(t => (
            <button key={t} type="button" className="btn btn-sm"
              onClick={() => setTag(t)}
              style={{
                background: tag === t ? tagColor(t) + '20' : 'var(--bg-3)',
                borderColor: tag === t ? tagColor(t) : 'var(--border-2)',
                color: tag === t ? tagColor(t) : 'var(--text-2)',
              }}>
              <span className="dot" style={{ background: tagColor(t) }}/> {t}
            </button>
          ))}
        </div>
      </Field>
      {!more ? (
        <button className="btn btn-ghost btn-sm" onClick={() => setMore(true)} style={{ marginTop: 4 }}>
          + More options (date, notes)
        </button>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 8 }}>
          <Field label="Date"><input type="date" className="input mono" value={date} onChange={e => setDate(e.target.value)}/></Field>
          <Field label="Notes"><input className="input" value={notes} onChange={e => setNotes(e.target.value)}/></Field>
        </div>
      )}
    </ModalShell>
  );
}

function SessionQuickAdd({ domains, onClose, onSave }) {
  const [domainId, setDomainId] = React.useState(domains[0]?.id || '');
  const [minutes, setMinutes] = React.useState(45);
  const [notes, setNotes] = React.useState('');
  const submit = () => {
    if (!domainId || !minutes) return;
    onSave({ id: 'ls' + Date.now(), domain_id: domainId, duration_minutes: parseInt(minutes), date: iso(new Date()), notes });
    onClose();
  };
  return (
    <ModalShell title="Log Learning Session" onClose={onClose} footer={
      <>
        <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
        <button className="btn btn-primary" onClick={submit}>Log Session</button>
      </>
    }>
      <Field label="Domain">
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {domains.map(d => (
            <button key={d.id} type="button" className="btn btn-sm"
              onClick={() => setDomainId(d.id)}
              style={{
                background: domainId === d.id ? 'var(--blue)' : 'var(--bg-3)',
                borderColor: domainId === d.id ? 'var(--blue)' : 'var(--border-2)',
                color: domainId === d.id ? 'white' : 'var(--text-2)',
              }}>{d.title}</button>
          ))}
        </div>
      </Field>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 12 }}>
        <Field label="Minutes">
          <input className="input mono" value={minutes} onChange={e => setMinutes(e.target.value)} type="number"/>
        </Field>
        <Field label="Notes (optional)">
          <input className="input" value={notes} onChange={e => setNotes(e.target.value)} placeholder="What did you work on?"/>
        </Field>
      </div>
      <div style={{ display: 'flex', gap: 6, marginTop: 4 }}>
        {[15, 30, 45, 60, 90, 120].map(m => (
          <button key={m} className="btn btn-sm" onClick={() => setMinutes(m)}>{m}m</button>
        ))}
      </div>
    </ModalShell>
  );
}

Object.assign(window, { TaskQuickAdd, ExpenseQuickAdd, SessionQuickAdd, ModalShell, Field, Select });
