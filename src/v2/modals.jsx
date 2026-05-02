// Quick-add modals — Atelier style
function QuickTaskModal({ open, onClose, onSave, initial }) {
  const [title, setTitle] = React.useState('');
  const [type, setType] = React.useState('work');
  const [priority, setPriority] = React.useState('p2');
  const [status, setStatus] = React.useState('todo');
  const [due, setDue] = React.useState(window.iso(new Date()));
  React.useEffect(() => {
    if (!open) return;
    setTitle(initial?.title || '');
    setType(initial?.type || 'work');
    setPriority(initial?.priority || 'p2');
    setStatus(initial?.status || 'todo');
    setDue(initial?.due_date || window.iso(new Date()));
  }, [open, initial]);
  const submit = () => {
    if (!title.trim()) return;
    onSave({ ...(initial || { id: 't' + Date.now() }), title: title.trim(), type, priority, status, due_date: due });
    onClose();
  };
  return (
    <Modal open={open} onClose={onClose} eyebrow={initial ? 'Edit entry' : 'New entry'} title={initial ? 'Edit task' : 'Add a task'}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <Field label="Title">
          <Input autoFocus value={title} onChange={e => setTitle(e.target.value)} onKeyDown={e => e.key === 'Enter' && submit()} placeholder="What needs doing?" />
        </Field>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <Field label="Type"><Select value={type} onChange={e => setType(e.target.value)}><option value="work">Work</option><option value="personal">Personal</option></Select></Field>
          <Field label="Priority"><Select value={priority} onChange={e => setPriority(e.target.value)}><option value="p0">P0 — urgent</option><option value="p1">P1</option><option value="p2">P2</option><option value="p3">P3</option></Select></Field>
          <Field label="Status"><Select value={status} onChange={e => setStatus(e.target.value)}><option value="todo">To do</option><option value="in_progress">In progress</option><option value="blocked">Blocked</option><option value="done">Done</option></Select></Field>
          <Field label="Due"><Input type="date" value={due} onChange={e => setDue(e.target.value)} /></Field>
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 8 }}>
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button onClick={submit}>{initial ? 'Save changes' : 'Add task'}</Button>
        </div>
      </div>
    </Modal>
  );
}

function QuickExpenseModal({ open, onClose, onSave, initial }) {
  const [source, setSource] = React.useState('');
  const [amount, setAmount] = React.useState('');
  const [tag, setTag] = React.useState('Groceries');
  const [date, setDate] = React.useState(window.iso(new Date()));
  React.useEffect(() => {
    if (!open) return;
    setSource(initial?.source || '');
    setAmount(initial ? String(initial.amount) : '');
    setTag(initial?.tag || 'Groceries');
    setDate(initial?.date || window.iso(new Date()));
  }, [open, initial]);
  const submit = () => {
    const a = parseFloat(amount);
    if (!source.trim() || !a) return;
    onSave({ ...(initial || { id: 'e' + Date.now(), notes: '' }), source: source.trim(), amount: a, tag, date });
    onClose();
  };
  const tags = ['Groceries','Dining Out','Transportation','Healthcare','Utilities','Rent/Mortgage','Entertainment','Shopping','Trading','Other'];
  return (
    <Modal open={open} onClose={onClose} eyebrow={initial ? 'Edit entry' : 'New entry'} title={initial ? 'Edit expense' : 'Log an expense'}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <Field label="Source"><Input autoFocus value={source} onChange={e => setSource(e.target.value)} placeholder="Carrefour, Uber, ..." /></Field>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <Field label="Amount"><Input value={amount} onChange={e => setAmount(e.target.value)} onKeyDown={e => e.key === 'Enter' && submit()} placeholder="0.00" inputMode="decimal" /></Field>
          <Field label="Date"><Input type="date" value={date} onChange={e => setDate(e.target.value)} /></Field>
        </div>
        <Field label="Tag"><Select value={tag} onChange={e => setTag(e.target.value)}>{tags.map(t => <option key={t}>{t}</option>)}</Select></Field>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 8 }}>
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button onClick={submit}>{initial ? 'Save changes' : 'Log'}</Button>
        </div>
      </div>
    </Modal>
  );
}

function QuickFamilyModal({ open, onClose, onSave }) {
  const [description, setDescription] = React.useState('');
  const [amount, setAmount] = React.useState('');
  const [txType, setTxType] = React.useState('expense');
  const [tag, setTag] = React.useState('Groceries');
  const [date, setDate] = React.useState(window.iso(new Date()));
  const [payment, setPayment] = React.useState('cash');
  React.useEffect(() => { if (open) { setDescription(''); setAmount(''); } }, [open]);
  const submit = () => {
    const a = parseFloat(amount);
    if (!description.trim() || !a) return;
    onSave({ id: 'ft' + Date.now(), description, amount: a, transaction_type: txType, date, tag, payment_method: payment, person: 'brother', notes: '' });
    onClose();
  };
  return (
    <Modal open={open} onClose={onClose} eyebrow="Family ledger" title="New family entry">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <Segmented
          value={txType}
          onChange={setTxType}
          options={[{ value: 'expense', label: 'Expense for family' }, { value: 'income', label: 'Income from family' }]}
          style={{ width: '100%', display: 'grid', gridTemplateColumns: '1fr 1fr' }}
        />
        <Field label="Description"><Input autoFocus value={description} onChange={e => setDescription(e.target.value)} placeholder="Groceries for Mohtadi" /></Field>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <Field label="Amount"><Input value={amount} onChange={e => setAmount(e.target.value)} onKeyDown={e => e.key === 'Enter' && submit()} placeholder="0.00" inputMode="decimal" /></Field>
          <Field label="Date"><Input type="date" value={date} onChange={e => setDate(e.target.value)} /></Field>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <Field label="Tag"><Select value={tag} onChange={e => setTag(e.target.value)}>{window.FAMILY_TAGS.map(t => <option key={t}>{t}</option>)}</Select></Field>
          <Field label="Payment"><Select value={payment} onChange={e => setPayment(e.target.value)}><option value="cash">Cash</option><option value="bank_transfer">Bank transfer</option><option value="card">Card</option></Select></Field>
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 8 }}>
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button onClick={submit}>Save entry</Button>
        </div>
      </div>
    </Modal>
  );
}

Object.assign(window, { QuickTaskModal, QuickExpenseModal, QuickFamilyModal });
