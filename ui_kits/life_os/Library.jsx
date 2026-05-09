// Library — reading queue + finished
const SEED_BOOKS = [
  { id: 'b1',  title: 'Atomic Habits',                 author: 'James Clear',         status: 'reading', progress: 64, tag: 'Productivity', rating: null, year: 2018 },
  { id: 'b2',  title: 'The Almanack of Naval Ravikant', author: 'Eric Jorgenson',     status: 'reading', progress: 22, tag: 'Philosophy',   rating: null, year: 2020 },
  { id: 'b3',  title: 'Deep Work',                     author: 'Cal Newport',         status: 'queue',   progress: 0,  tag: 'Productivity', rating: null, year: 2016 },
  { id: 'b4',  title: 'The Pragmatic Programmer',      author: 'Hunt & Thomas',       status: 'queue',   progress: 0,  tag: 'Tech',         rating: null, year: 1999 },
  { id: 'b5',  title: 'Designing Data-Intensive Apps', author: 'Martin Kleppmann',    status: 'queue',   progress: 0,  tag: 'Tech',         rating: null, year: 2017 },
  { id: 'b6',  title: 'Sapiens',                       author: 'Yuval Noah Harari',   status: 'done',    progress: 100, tag: 'History',     rating: 4,    year: 2014 },
  { id: 'b7',  title: 'The Lean Startup',              author: 'Eric Ries',           status: 'done',    progress: 100, tag: 'Business',    rating: 5,    year: 2011 },
  { id: 'b8',  title: 'Thinking, Fast and Slow',       author: 'Daniel Kahneman',     status: 'done',    progress: 100, tag: 'Psychology',  rating: 5,    year: 2011 },
];

const SEED_NOTES = [
  { id: 'n1', book: 'Atomic Habits', text: 'The 1% improvement compounds — focus on systems, not goals.', date: daysAgo(2) },
  { id: 'n2', book: 'Sapiens',       text: 'Cognitive Revolution → fictions enable cooperation at scale.',  date: daysAgo(45) },
  { id: 'n3', book: 'The Lean Startup', text: 'Build → measure → learn. Vanity metrics waste cycles.',     date: daysAgo(120) },
];

function Library() {
  const [tab, setTab] = React.useState('queue'); // queue | reading | done | notes
  const [books, setBooks] = React.useState(SEED_BOOKS);
  const [selected, setSelected] = React.useState(new Set());

  const filtered = tab === 'notes' ? [] : books.filter(b => b.status === tab);

  React.useEffect(() => setSelected(new Set()), [tab]);

  const toggleSel = (id) => { const n = new Set(selected); n.has(id) ? n.delete(id) : n.add(id); setSelected(n); };

  return (
    <div className="fade-in">
      <PageTitle eyebrow="Library" right={<Button variant="primary" icon="plus">Add book</Button>}>Reading</PageTitle>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 28 }}>
        <Stat label="In queue"  value={books.filter(b => b.status === 'queue').length} />
        <Stat label="Reading"   value={books.filter(b => b.status === 'reading').length} accent />
        <Stat label="Finished"  value={books.filter(b => b.status === 'done').length} />
        <Stat label="Avg rating" value={(books.filter(b => b.rating).reduce((a, b) => a + b.rating, 0) / books.filter(b => b.rating).length).toFixed(1)} />
      </div>

      <div style={{ display: 'flex', gap: 4, marginBottom: 18, borderBottom: '1px solid var(--border-soft)' }}>
        {[{ k: 'queue', l: 'Queue' }, { k: 'reading', l: 'Reading now' }, { k: 'done', l: 'Finished' }, { k: 'notes', l: 'Notes' }].map(t => (
          <button key={t.k} onClick={() => setTab(t.k)} style={{
            padding: '12px 18px', fontSize: 14, fontWeight: tab === t.k ? 500 : 400,
            color: tab === t.k ? 'var(--text-primary)' : 'var(--text-secondary)',
            borderBottom: `2px solid ${tab === t.k ? 'var(--accent)' : 'transparent'}`, marginBottom: -1 }}>{t.l}</button>
        ))}
      </div>

      {tab === 'notes' ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {SEED_NOTES.map(n => (
            <Card key={n.id}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 10 }}>
                <Caps>{n.book}</Caps>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-muted)' }}>
                  {new Date(n.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                </span>
              </div>
              <p className="serif" style={{ margin: 0, fontSize: 17, lineHeight: 1.5, color: 'var(--text-primary)', fontStyle: 'italic' }}>"{n.text}"</p>
            </Card>
          ))}
        </div>
      ) : (
        <>
          {selected.size > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 16px', marginBottom: 12,
              background: 'var(--accent-soft)', borderRadius: 'var(--radius-md)' }}>
              <span style={{ fontSize: 13, color: 'var(--text-primary)' }}>{selected.size} selected</span>
              <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
                <Button size="sm" variant="ghost" onClick={() => setSelected(new Set())}>Clear</Button>
                <Button size="sm" variant="danger" icon="trash" onClick={() => { setBooks(books.filter(b => !selected.has(b.id))); setSelected(new Set()); }}>Remove</Button>
              </div>
            </div>
          )}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
            {filtered.map(b => <BookCard key={b.id} book={b} selected={selected.has(b.id)} onSelect={() => toggleSel(b.id)} />)}
          </div>
        </>
      )}
    </div>
  );
}

function Stat({ label, value, accent }) {
  return (
    <Card raised>
      <Caps style={{ marginBottom: 8 }}>{label}</Caps>
      <div className="serif" style={{ fontSize: 36, fontWeight: 500, letterSpacing: '-0.02em', color: accent ? 'var(--accent)' : 'var(--text-primary)' }}>{value}</div>
    </Card>
  );
}

function BookCard({ book, selected, onSelect }) {
  const initials = book.title.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase();
  return (
    <Card raised onClick={onSelect} style={{ display: 'flex', gap: 18, padding: 20, position: 'relative',
      outline: selected ? '2px solid var(--accent)' : 'none' }}>
      <div style={{ position: 'absolute', top: 14, right: 14 }}><Checkbox checked={selected} onChange={onSelect} /></div>
      <div style={{ width: 72, height: 96, flexShrink: 0, borderRadius: 6,
        background: 'linear-gradient(135deg, var(--accent) 0%, var(--accent-deep) 100%)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff',
        fontFamily: 'var(--font-serif)', fontSize: 22, fontStyle: 'italic', fontWeight: 500,
        boxShadow: 'var(--shadow-md)' }}>{initials}</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <Caps style={{ marginBottom: 4 }}>{book.tag} · {book.year}</Caps>
        <h3 className="serif" style={{ margin: '0 0 4px', fontSize: 17, fontWeight: 500, letterSpacing: '-0.01em' }}>{book.title}</h3>
        <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 12 }}>{book.author}</div>
        {book.status === 'reading' && (
          <>
            <div style={{ height: 4, background: 'var(--bg-tertiary)', borderRadius: 2, marginBottom: 6 }}>
              <div style={{ height: '100%', width: `${book.progress}%`, background: 'var(--accent)', borderRadius: 2 }} />
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-muted)' }}>{book.progress}% read</div>
          </>
        )}
        {book.status === 'done' && (
          <div style={{ display: 'flex', gap: 2 }}>
            {[1,2,3,4,5].map(i => (
              <span key={i} style={{ color: i <= book.rating ? 'var(--warning)' : 'var(--border)', fontSize: 13 }}>★</span>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
}

window.Library = Library;
