// Quick-add modals — Atelier style
function QuickTaskModal({ open, onClose, onSave }) {
  const [title, setTitle] = React.useState('');
  const [type, setType] = React.useState('work');
  const [priority, setPriority] = React.useState('p2');
  const [due, setDue] = React.useState(window.iso(new Date()));
  React.useEffect(() => { if (open) setTitle(''); }, [open]);
  const submit = () => {
    if (!title.trim()) return;
    onSave({ id: 't' + Date.now(), title, type, priority, status: 'todo', due_date: due });
    onClose();
  };
  return (
    <Modal open={open} onClose={onClose} eyebrow="New entry" title="Add a task">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <Field label="Title">
          <Input autoFocus value={title} onChange={e => setTitle(e.target.value)} onKeyDown={e => e.key === 'Enter' && submit()} placeholder="What needs doing?" />
        </Field>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
          <Field label="Type"><Select value={type} onChange={e => setType(e.target.value)}><option value="work">Work</option><option value="personal">Personal</option></Select></Field>
          <Field label="Priority"><Select value={priority} onChange={e => setPriority(e.target.value)}><option value="p0">P0 — urgent</option><option value="p1">P1</option><option value="p2">P2</option><option value="p3">P3</option></Select></Field>
          <Field label="Due"><Input type="date" value={due} onChange={e => setDue(e.target.value)} /></Field>
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 8 }}>
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button onClick={submit}>Add task</Button>
        </div>
      </div>
    </Modal>
  );
}

function QuickExpenseModal({ open, onClose, onSave }) {
  const [source, setSource] = React.useState('');
  const [amount, setAmount] = React.useState('');
  const [tag, setTag] = React.useState('Groceries');
  const [date, setDate] = React.useState(window.iso(new Date()));
  React.useEffect(() => { if (open) { setSource(''); setAmount(''); } }, [open]);
  const submit = () => {
    const a = parseFloat(amount);
    if (!source.trim() || !a) return;
    onSave({ id: 'e' + Date.now(), source, amount: a, tag, date, notes: '' });
    onClose();
  };
  const tags = ['Groceries','Dining Out','Transportation','Healthcare','Utilities','Rent/Mortgage','Entertainment','Shopping','Trading','Other'];
  return (
    <Modal open={open} onClose={onClose} eyebrow="New entry" title="Log an expense">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <Field label="Source"><Input autoFocus value={source} onChange={e => setSource(e.target.value)} placeholder="Carrefour, Uber, ..." /></Field>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <Field label="Amount"><Input value={amount} onChange={e => setAmount(e.target.value)} onKeyDown={e => e.key === 'Enter' && submit()} placeholder="0.00" inputMode="decimal" /></Field>
          <Field label="Date"><Input type="date" value={date} onChange={e => setDate(e.target.value)} /></Field>
        </div>
        <Field label="Tag"><Select value={tag} onChange={e => setTag(e.target.value)}>{tags.map(t => <option key={t}>{t}</option>)}</Select></Field>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 8 }}>
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button onClick={submit}>Log</Button>
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
