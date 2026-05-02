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

function QuickFamilyModal({ open, onClose, onSave, initial }) {
  const [description, setDescription] = React.useState('');
  const [amount, setAmount] = React.useState('');
  const [txType, setTxType] = React.useState('expense');
  const [tag, setTag] = React.useState('Groceries');
  const [date, setDate] = React.useState(window.iso(new Date()));
  const [payment, setPayment] = React.useState('cash');
  React.useEffect(() => {
    if (!open) return;
    setDescription(initial?.description || '');
    setAmount(initial ? String(initial.amount) : '');
    setTxType(initial?.transaction_type || 'expense');
    setTag(initial?.tag || 'Groceries');
    setDate(initial?.date || window.iso(new Date()));
    setPayment(initial?.payment_method || 'cash');
  }, [open, initial]);
  const submit = () => {
    const a = parseFloat(amount);
    if (!description.trim() || !a) return;
    onSave({ ...(initial || { id: 'ft' + Date.now(), person: 'brother', notes: '' }), description: description.trim(), amount: a, transaction_type: txType, date, tag, payment_method: payment });
    onClose();
  };
  return (
    <Modal open={open} onClose={onClose} eyebrow="Family ledger" title={initial ? 'Edit family entry' : 'New family entry'}>
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
          <Button onClick={submit}>{initial ? 'Save changes' : 'Save entry'}</Button>
        </div>
      </div>
    </Modal>
  );
}

function QuickIncomeModal({ open, onClose, onSave, initial }) {
  const [source, setSource] = React.useState('');
  const [amount, setAmount] = React.useState('');
  const [tag, setTag] = React.useState('Salary');
  const [date, setDate] = React.useState(window.iso(new Date()));
  React.useEffect(() => {
    if (!open) return;
    setSource(initial?.source || '');
    setAmount(initial ? String(initial.amount) : '');
    setTag(initial?.tag || 'Salary');
    setDate(initial?.date || window.iso(new Date()));
  }, [open, initial]);
  const submit = () => {
    const a = parseFloat(amount);
    if (!source.trim() || !a) return;
    onSave({ ...(initial || { id: 'i' + Date.now(), notes: '' }), source: source.trim(), amount: a, tag, date });
    onClose();
  };
  return (
    <Modal open={open} onClose={onClose} eyebrow={initial ? 'Edit entry' : 'New entry'} title={initial ? 'Edit income' : 'Log income'}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <Field label="Source"><Input autoFocus value={source} onChange={e => setSource(e.target.value)} placeholder="Salary, transfer, ..." /></Field>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <Field label="Amount"><Input value={amount} onChange={e => setAmount(e.target.value)} onKeyDown={e => e.key === 'Enter' && submit()} placeholder="0.00" inputMode="decimal" /></Field>
          <Field label="Date"><Input type="date" value={date} onChange={e => setDate(e.target.value)} /></Field>
        </div>
        <Field label="Tag"><Input value={tag} onChange={e => setTag(e.target.value)} placeholder="Salary" /></Field>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 8 }}>
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button onClick={submit}>{initial ? 'Save changes' : 'Log income'}</Button>
        </div>
      </div>
    </Modal>
  );
}

function QuickSavingsTxModal({ open, onClose, onSave, accounts, initial }) {
  const [accountId, setAccountId] = React.useState(accounts?.[0]?.id || '');
  const [amount, setAmount] = React.useState('');
  const [txType, setTxType] = React.useState('deposit');
  const [date, setDate] = React.useState(window.iso(new Date()));
  const [notes, setNotes] = React.useState('');
  React.useEffect(() => {
    if (!open) return;
    setAccountId(initial?.account_id || accounts?.[0]?.id || '');
    setAmount(initial ? String(initial.amount) : '');
    setTxType(initial?.transaction_type || 'deposit');
    setDate(initial?.date || window.iso(new Date()));
    setNotes(initial?.notes || '');
  }, [open, initial, accounts]);
  const submit = () => {
    const a = parseFloat(amount);
    if (!accountId || !a) return;
    onSave({ ...(initial || { id: 'st' + Date.now() }), account_id: accountId, amount: a, transaction_type: txType, date, notes: notes.trim() });
    onClose();
  };
  return (
    <Modal open={open} onClose={onClose} eyebrow="Savings" title={initial ? 'Edit movement' : 'New savings movement'}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <Segmented value={txType} onChange={setTxType} options={[{ value: 'deposit', label: 'Deposit' }, { value: 'withdrawal', label: 'Withdrawal' }]} style={{ width: '100%', display: 'grid', gridTemplateColumns: '1fr 1fr' }} />
        <Field label="Account"><Select value={accountId} onChange={e => setAccountId(e.target.value)}>{accounts.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}</Select></Field>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <Field label="Amount"><Input value={amount} onChange={e => setAmount(e.target.value)} inputMode="decimal" placeholder="0.00" /></Field>
          <Field label="Date"><Input type="date" value={date} onChange={e => setDate(e.target.value)} /></Field>
        </div>
        <Field label="Notes"><Input value={notes} onChange={e => setNotes(e.target.value)} placeholder="Optional" /></Field>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 8 }}>
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button onClick={submit}>{initial ? 'Save changes' : 'Save movement'}</Button>
        </div>
      </div>
    </Modal>
  );
}

function QuickSavingsAccountModal({ open, onClose, onSave, initial }) {
  const [name, setName] = React.useState('');
  const [target, setTarget] = React.useState('');
  React.useEffect(() => {
    if (!open) return;
    setName(initial?.name || '');
    setTarget(initial ? String(initial.target_amount || 0) : '');
  }, [open, initial]);
  const submit = () => {
    const targetAmount = parseFloat(target);
    if (!name.trim() || !targetAmount) return;
    onSave({ ...(initial || { id: 'sa' + Date.now() }), name: name.trim(), target_amount: targetAmount });
    onClose();
  };
  return (
    <Modal open={open} onClose={onClose} eyebrow="Savings" title={initial ? 'Edit account' : 'New savings account'}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <Field label="Name"><Input autoFocus value={name} onChange={e => setName(e.target.value)} placeholder="Emergency fund" /></Field>
        <Field label="Target"><Input value={target} onChange={e => setTarget(e.target.value)} inputMode="decimal" placeholder="0.00" /></Field>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 8 }}>
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button onClick={submit}>{initial ? 'Save changes' : 'Save account'}</Button>
        </div>
      </div>
    </Modal>
  );
}

Object.assign(window, { QuickTaskModal, QuickExpenseModal, QuickFamilyModal, QuickIncomeModal, QuickSavingsTxModal, QuickSavingsAccountModal });
