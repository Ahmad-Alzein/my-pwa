// Realistic mock data for Ahmad's Life OS
// AI Engineer at AcuSurgical (surgical robotics), Montpellier

const today = new Date();
const iso = (d) => d.toISOString().slice(0, 10);
const daysFromNow = (n) => {
  const d = new Date(today); d.setDate(d.getDate() + n); return iso(d);
};

const SEED_TASKS = [
  // Work
  { id: 't1', title: 'Fix PMD pipeline drift on stereo endoscope feed', status: 'in_progress', priority: 'p0', due_date: iso(today), type: 'work', project: 'ML Infra', jira_ref: 'ACU-412', tags: ['cv', 'urgent'] },
  { id: 't2', title: 'Review Mohtadi\'s PR: temporal smoothing filter', status: 'todo', priority: 'p1', due_date: iso(today), type: 'work', project: 'Incubation Squad', jira_ref: 'ACU-398', tags: ['review'] },
  { id: 't3', title: 'Collect 50 more cadaver lab sequences — ENT track', status: 'todo', priority: 'p1', due_date: daysFromNow(1), type: 'work', project: 'Data Collection', jira_ref: 'ACU-377' },
  { id: 't4', title: 'Benchmark SAM2 vs. MedSAM on polyp set', status: 'in_progress', priority: 'p2', due_date: daysFromNow(3), type: 'work', project: 'Incubation Squad' },
  { id: 't5', title: 'Write ADR: switching vision backbone to DINOv2', status: 'todo', priority: 'p2', due_date: daysFromNow(2), type: 'work', project: 'ML Infra' },
  { id: 't6', title: 'Debug ROS2 topic lag on surgical arm telemetry', status: 'blocked', priority: 'p1', due_date: daysFromNow(-1), type: 'work', project: 'ML Infra', jira_ref: 'ACU-401' },
  { id: 't7', title: 'Q2 OKR sync with Jean-Luc', status: 'done', priority: 'p2', due_date: daysFromNow(-2), type: 'work', project: 'Other' },
  { id: 't8', title: 'Annotate 200 frames — cholecystectomy dataset', status: 'todo', priority: 'p3', due_date: daysFromNow(5), type: 'work', project: 'Data Collection' },
  { id: 't9', title: 'Pair with Yanis on signal denoising kernel', status: 'todo', priority: 'p2', due_date: daysFromNow(1), type: 'work', project: 'Incubation Squad' },
  { id: 't10', title: 'Update on-call runbook for GPU node failures', status: 'todo', priority: 'p3', due_date: daysFromNow(7), type: 'work', project: 'ML Infra' },

  // Personal
  { id: 'p1', title: 'Renouveler carte de séjour', status: 'todo', priority: 'p0', due_date: daysFromNow(2), type: 'personal', category: 'Admin' },
  { id: 'p2', title: 'Gym — push day', status: 'in_progress', priority: 'p2', due_date: iso(today), type: 'personal', category: 'Health', is_recurring: true },
  { id: 'p3', title: 'Call maman — dimanche', status: 'todo', priority: 'p1', due_date: daysFromNow(3), type: 'personal', category: 'Social' },
  { id: 'p4', title: 'Virement Livret A — 800€', status: 'todo', priority: 'p1', due_date: iso(today), type: 'personal', category: 'Finance' },
  { id: 'p5', title: 'Book dentist — Dr. Pelletier', status: 'todo', priority: 'p2', due_date: daysFromNow(1), type: 'personal', category: 'Health' },
  { id: 'p6', title: 'Side project: ship agentic trading backtest v0.2', status: 'in_progress', priority: 'p2', due_date: daysFromNow(4), type: 'personal', category: 'Side Project' },
  { id: 'p7', title: 'Rent — check SEPA cleared', status: 'done', priority: 'p1', due_date: daysFromNow(-1), type: 'personal', category: 'Home' },
  { id: 'p8', title: 'Dîner chez Léa et Thomas', status: 'todo', priority: 'p3', due_date: daysFromNow(2), type: 'personal', category: 'Social' },
  { id: 'p9', title: 'Fix kitchen faucet leak', status: 'blocked', priority: 'p2', due_date: daysFromNow(-3), type: 'personal', category: 'Home' },
  { id: 'p10', title: 'Run 10k — Parc Rimbaud', status: 'todo', priority: 'p3', due_date: daysFromNow(1), type: 'personal', category: 'Health', is_recurring: true },
];

// Expenses — last ~60 days, realistic Montpellier
function genExpenses() {
  const rows = [];
  const src = [
    ['Carrefour Polygone', 'Groceries', [42, 68, 31, 55]],
    ['Super U — Antigone', 'Groceries', [24, 38]],
    ['Monoprix', 'Groceries', [18, 29]],
    ['Uber', 'Transportation', [9.5, 12.4, 15.2]],
    ['TaM — Pass mensuel', 'Transportation', [40]],
    ['Total Access', 'Transportation', [58]],
    ['Pierre Hermé', 'Dining Out', [12]],
    ['Les 3 Brasseurs', 'Dining Out', [28, 34]],
    ['Sushi Izumi', 'Dining Out', [22]],
    ['La Réserve Rimbaud', 'Dining Out', [78]],
    ['Pharmacie du Peyrou', 'Healthcare', [14, 22]],
    ['Mutuelle Alan', 'Insurance', [48]],
    ['Netflix', 'Entertainment', [13.49]],
    ['Spotify', 'Entertainment', [10.99]],
    ['Cinéma Gaumont', 'Entertainment', [11]],
    ['Decathlon', 'Retail', [65, 120]],
    ['Uniqlo', 'Shopping', [89]],
    ['Zara', 'Shopping', [54]],
    ['Loyer — 14 rue Verdun', 'Rent/Mortgage', [980]],
    ['EDF', 'Utilities', [78]],
    ['Orange Fibre', 'Utilities', [29.99]],
    ['SEPM (eau)', 'Utilities', [34]],
    ['IBKR — deposit', 'Trading', [500]],
    ['Tabac — Place Laissac', 'Tabac', [7.5, 7.5]],
    ['Apple — iCloud+ 200GB', 'Iphone', [2.99]],
    ['Apple — AirPods 4', 'Iphone', [179]],
  ];
  let i = 0;
  for (let d = 45; d >= 0; d--) {
    // 1-3 expenses per day, skip some
    const n = Math.random() < 0.3 ? 0 : (Math.random() < 0.5 ? 1 : 2);
    for (let k = 0; k < n; k++) {
      const [name, tag, amounts] = src[Math.floor(Math.random() * src.length)];
      const amount = amounts[Math.floor(Math.random() * amounts.length)];
      rows.push({
        id: 'e' + (i++),
        source: name,
        amount,
        tag,
        date: daysFromNow(-d),
        notes: '',
      });
    }
  }
  // Always: rent on 1st of current month
  const firstOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  rows.push({
    id: 'e-rent', source: 'Loyer — 14 rue Verdun',
    amount: 980, tag: 'Rent/Mortgage',
    date: iso(firstOfMonth), notes: 'SEPA prélevé',
  });
  return rows.sort((a,b) => a.date < b.date ? 1 : -1);
}

const SEED_EXPENSES = genExpenses();

const SEED_INCOME = [
  { id: 'i1', source: 'AcuSurgical — Salaire avril', amount: 4120, date: daysFromNow(-4), tag: 'Salary' },
  { id: 'i2', source: 'AcuSurgical — Prime trimestre Q1', amount: 1800, date: daysFromNow(-12), tag: 'Bonus' },
  { id: 'i3', source: 'IBKR — dividendes', amount: 47.22, date: daysFromNow(-8), tag: 'Dividends' },
  { id: 'i4', source: 'Livret A — intérêts', amount: 18.40, date: daysFromNow(-15), tag: 'Interest' },
  { id: 'i5', source: 'Remboursement SNCF', amount: 78, date: daysFromNow(-20), tag: 'refund' },
  { id: 'i6', source: 'Freelance — audit ML (Dr. M.)', amount: 650, date: daysFromNow(-26), tag: 'Freelance' },
  { id: 'i7', source: 'AcuSurgical — Salaire mars', amount: 4120, date: daysFromNow(-34), tag: 'Salary' },
];

const SEED_SAVINGS_ACCOUNTS = [
  { id: 's1', name: 'Livret A', target_amount: 22950 },
  { id: 's2', name: 'PEA — Boursorama', target_amount: 50000 },
  { id: 's3', name: 'IBKR — Trading', target_amount: 15000 },
  { id: 's4', name: 'LEP — réserve', target_amount: 10000 },
];

const SEED_SAVINGS_TX = [
  // Livret A
  { id: 'st1', account_id: 's1', transaction_type: 'deposit', amount: 15000, date: daysFromNow(-180), notes: 'Solde initial' },
  { id: 'st2', account_id: 's1', transaction_type: 'deposit', amount: 800, date: daysFromNow(-30), notes: 'Virement mensuel' },
  { id: 'st3', account_id: 's1', transaction_type: 'deposit', amount: 800, date: daysFromNow(-60), notes: 'Virement mensuel' },
  { id: 'st4', account_id: 's1', transaction_type: 'deposit', amount: 18.40, date: daysFromNow(-15), notes: 'Intérêts' },
  // PEA
  { id: 'st5', account_id: 's2', transaction_type: 'deposit', amount: 28000, date: daysFromNow(-200), notes: 'Apport' },
  { id: 'st6', account_id: 's2', transaction_type: 'deposit', amount: 1500, date: daysFromNow(-45), notes: 'DCA ETF World' },
  { id: 'st7', account_id: 's2', transaction_type: 'deposit', amount: 1500, date: daysFromNow(-14), notes: 'DCA ETF World' },
  // IBKR
  { id: 'st8', account_id: 's3', transaction_type: 'deposit', amount: 8000, date: daysFromNow(-120), notes: '' },
  { id: 'st9', account_id: 's3', transaction_type: 'deposit', amount: 500, date: daysFromNow(-2), notes: 'DCA' },
  { id: 'st10', account_id: 's3', transaction_type: 'withdrawal', amount: 300, date: daysFromNow(-50), notes: 'Prise de bénéf' },
  // LEP
  { id: 'st11', account_id: 's4', transaction_type: 'deposit', amount: 6400, date: daysFromNow(-90), notes: '' },
  { id: 'st12', account_id: 's4', transaction_type: 'deposit', amount: 200, date: daysFromNow(-20), notes: '' },
];

const SEED_LEARNING = [
  {
    id: 'l1',
    title: 'Drone & AI in Defense',
    description: 'CV + autonomy stack for defense applications. Exploration → possible pivot.',
    status: 'in_progress', progress: 45,
    started_at: daysFromNow(-75), target_completion: daysFromNow(60),
    resources: [
      { title: 'Probabilistic Robotics — Thrun', type: 'book', status: 'in_progress', rating: 5 },
      { title: 'YOLOv10 paper', type: 'paper', status: 'done', rating: 4 },
      { title: 'Helsing careers teardown', type: 'article', status: 'done', rating: 3 },
      { title: 'PX4 autopilot docs', type: 'article', status: 'to_read' },
      { title: 'Anduril — Lattice demo', type: 'video', status: 'done', rating: 5 },
    ],
    milestones: [
      { title: 'Read Probabilistic Robotics ch.1-6', done: true },
      { title: 'Reproduce YOLOv10 on DOTA-v2', done: true },
      { title: 'Build SITL sim with PX4 + drone swarm', done: false },
      { title: 'Prototype target re-ID across frames', done: false },
    ],
    sessions_minutes_per_day: [30, 45, 0, 60, 90, 0, 20, 40, 60, 0, 30, 45, 60, 30],
  },
  {
    id: 'l2',
    title: 'Surgical Robotics CV',
    description: 'Deep dive into state-of-the-art for surgical scene understanding.',
    status: 'in_progress', progress: 62,
    started_at: daysFromNow(-120), target_completion: daysFromNow(30),
    resources: [
      { title: 'MedSAM — Ma et al.', type: 'paper', status: 'done', rating: 5 },
      { title: 'Cholec80 dataset analysis', type: 'article', status: 'done', rating: 4 },
      { title: 'Intuitive — da Vinci white papers', type: 'article', status: 'in_progress' },
      { title: 'SurgToolLoc challenge repo', type: 'repo', status: 'done', rating: 4 },
    ],
    milestones: [
      { title: 'Reproduce MedSAM baseline', done: true },
      { title: 'Evaluate on AcuSurgical internal set', done: true },
      { title: 'Write internal memo for team', done: false },
    ],
    sessions_minutes_per_day: [60, 90, 45, 60, 0, 120, 60, 30, 60, 90, 0, 45, 60, 90],
  },
  {
    id: 'l3',
    title: 'Trading Systems',
    description: 'Systematic strategies, backtesting, options.',
    status: 'in_progress', progress: 28,
    started_at: daysFromNow(-50), target_completion: daysFromNow(120),
    resources: [
      { title: 'Advances in Financial ML — López de Prado', type: 'book', status: 'in_progress', rating: 5 },
      { title: 'zipline-reloaded repo', type: 'repo', status: 'to_read' },
      { title: 'Options Vol & Pricing — Natenberg', type: 'book', status: 'to_read' },
    ],
    milestones: [
      { title: 'Backtest MA crossover on SPY', done: true },
      { title: 'Build walk-forward framework', done: false },
      { title: 'Ship agentic strategy v0.1', done: false },
    ],
    sessions_minutes_per_day: [20, 30, 0, 45, 0, 0, 30, 20, 0, 45, 30, 0, 60, 30],
  },
  {
    id: 'l4',
    title: 'Claude Agents',
    description: 'Tool use, orchestration, eval harnesses.',
    status: 'in_progress', progress: 70,
    started_at: daysFromNow(-40), target_completion: daysFromNow(14),
    resources: [
      { title: 'Anthropic — Building agents guide', type: 'article', status: 'done', rating: 5 },
      { title: 'Claude Code source exploration', type: 'repo', status: 'in_progress' },
      { title: 'MCP spec v2', type: 'article', status: 'done', rating: 4 },
    ],
    milestones: [
      { title: 'Ship internal research agent', done: true },
      { title: 'Evaluate on 20-task bench', done: true },
      { title: 'Publish blog post', done: false },
    ],
    sessions_minutes_per_day: [45, 60, 90, 60, 0, 45, 60, 30, 90, 60, 45, 60, 0, 45],
  },
  {
    id: 'l5',
    title: 'Rust',
    description: 'For performance-critical ML infra components.',
    status: 'paused', progress: 15,
    started_at: daysFromNow(-90), target_completion: null,
    resources: [
      { title: 'The Rust Book', type: 'book', status: 'in_progress', rating: 4 },
      { title: 'Rustlings', type: 'repo', status: 'in_progress' },
    ],
    milestones: [
      { title: 'Finish Rust Book ch.1-10', done: false },
      { title: 'Port one ML preproc kernel', done: false },
    ],
    sessions_minutes_per_day: [20, 0, 0, 0, 0, 15, 0, 0, 0, 0, 0, 0, 0, 0],
  },
  {
    id: 'l6',
    title: 'French Legal / Admin (EU IT engineer)',
    description: 'Understanding French legal setup for freelance + equity.',
    status: 'not_started', progress: 0,
    started_at: null, target_completion: null,
    resources: [],
    milestones: [
      { title: 'Read URSSAF freelance guide', done: false },
      { title: 'Meet with avocat fiscaliste', done: false },
    ],
    sessions_minutes_per_day: Array(14).fill(0),
  },
];

// Activity log — synthesized
const SEED_ACTIVITY = [
  { id: 'a1', module: 'tasks', action: 'completed', summary: 'Completed task: Q2 OKR sync with Jean-Luc', when: daysFromNow(-2) + 'T14:22' },
  { id: 'a2', module: 'expenses', action: 'created', summary: '+ Carrefour Polygone — 42€ (Groceries)', when: daysFromNow(0) + 'T09:14' },
  { id: 'a3', module: 'learning', action: 'completed', summary: 'Finished resource: YOLOv10 paper — 4★', when: daysFromNow(-1) + 'T22:40' },
  { id: 'a4', module: 'savings', action: 'created', summary: 'Deposit: Livret A +800€', when: daysFromNow(-1) + 'T07:02' },
  { id: 'a5', module: 'tasks', action: 'created', summary: 'New task: Fix PMD pipeline drift on stereo endoscope feed', when: daysFromNow(-1) + 'T10:05' },
  { id: 'a6', module: 'expenses', action: 'created', summary: '+ Les 3 Brasseurs — 28€ (Dining Out)', when: daysFromNow(-1) + 'T20:37' },
  { id: 'a7', module: 'learning', action: 'updated', summary: 'Learning session: Claude Agents — 60min', when: daysFromNow(0) + 'T06:40' },
  { id: 'a8', module: 'income', action: 'created', summary: '+ AcuSurgical Salaire avril — 4120€', when: daysFromNow(-4) + 'T00:01' },
];

Object.assign(window, {
  SEED_TASKS, SEED_EXPENSES, SEED_INCOME,
  SEED_SAVINGS_ACCOUNTS, SEED_SAVINGS_TX,
  SEED_LEARNING, SEED_ACTIVITY,
  daysFromNow, iso,
});
