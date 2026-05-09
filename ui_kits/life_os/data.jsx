// Seed data — finance + family ledger (Saving HUB pattern)
const today = new Date();
const iso = (d) => d.toISOString().slice(0, 10);
const daysAgo = (n) => { const d = new Date(today); d.setDate(d.getDate() - n); return iso(d); };

const SEED_EXPENSES = [
  { id: 'e1', date: daysAgo(1),  source: 'Carrefour — groceries',     tag: 'Groceries',      amount: 62.40 },
  { id: 'e2', date: daysAgo(2),  source: 'Lyon SNCF train',           tag: 'Transportation', amount: 89.00 },
  { id: 'e3', date: daysAgo(3),  source: 'Pharmacy — prescription',   tag: 'Healthcare',     amount: 38.00 },
  { id: 'e4', date: daysAgo(5),  source: 'Spotify family',            tag: 'Subscriptions',  amount: 16.99 },
  { id: 'e5', date: daysAgo(7),  source: 'Café Le Square',            tag: 'Dining',         amount: 14.80 },
  { id: 'e6', date: daysAgo(9),  source: 'Decathlon — running shoes', tag: 'Personal',       amount: 79.00 },
  { id: 'e7', date: daysAgo(12), source: 'Electricity — EDF',         tag: 'Utilities',      amount: 42.10 },
  { id: 'e8', date: daysAgo(14), source: 'Super U — weekly',          tag: 'Groceries',      amount: 84.20 },
  { id: 'e9', date: daysAgo(18), source: 'Uber to airport',           tag: 'Transportation', amount: 28.50 },
  { id: 'e10', date: daysAgo(22), source: 'Books — Mollat',           tag: 'Personal',       amount: 36.00 },
  { id: 'e11', date: daysAgo(45), source: 'Rent — March',             tag: 'Rent/Housing',   amount: 720.00 },
  { id: 'e12', date: daysAgo(60), source: 'Annual insurance',         tag: 'Insurance',      amount: 320.00 },
  { id: 'e13', date: daysAgo(75), source: 'Carrefour — groceries',    tag: 'Groceries',      amount: 71.10 },
  { id: 'e14', date: daysAgo(120), source: 'New laptop',              tag: 'Personal',       amount: 1200.00 },
];

const SEED_INCOME = [
  { id: 'i1', date: daysAgo(8),   source: 'Salary — April',  tag: 'Salary',     amount: 4120.00 },
  { id: 'i2', date: daysAgo(38),  source: 'Salary — March',  tag: 'Salary',     amount: 4120.00 },
  { id: 'i3', date: daysAgo(28),  source: 'Freelance — A.Z.', tag: 'Freelance', amount: 480.00 },
  { id: 'i4', date: daysAgo(68),  source: 'Salary — Feb',    tag: 'Salary',     amount: 4120.00 },
];

const SEED_FAMILY = [
  { id: 'ft1',  description: 'Groceries for Mohtadi — Carrefour', amount: 62.40, type: 'expense', date: daysAgo(2),  tag: 'Groceries',      method: 'card' },
  { id: 'ft2',  description: 'Mohtadi — rent share April',         amount: 350,   type: 'income',  date: daysAgo(5),  tag: 'Rent/Housing',   method: 'bank_transfer' },
  { id: 'ft3',  description: 'Pharmacy — prescriptions',           amount: 38,    type: 'expense', date: daysAgo(7),  tag: 'Healthcare',     method: 'card' },
  { id: 'ft4',  description: 'Train to Lyon (gift)',               amount: 89,    type: 'expense', date: daysAgo(12), tag: 'Gift/Support',   method: 'card' },
  { id: 'ft5',  description: 'Mohtadi — cash back',                amount: 200,   type: 'income',  date: daysAgo(15), tag: 'Loan Repayment', method: 'cash' },
  { id: 'ft6',  description: 'School supplies',                    amount: 54,    type: 'expense', date: daysAgo(20), tag: 'Education',      method: 'card' },
  { id: 'ft7',  description: 'Electricity share',                  amount: 42,    type: 'expense', date: daysAgo(25), tag: 'Utilities',      method: 'bank_transfer' },
  { id: 'ft8',  description: 'Groceries — Super U',                amount: 28,    type: 'expense', date: daysAgo(28), tag: 'Groceries',      method: 'card' },
  { id: 'ft9',  description: 'Mohtadi — envoi espèces',            amount: 150,   type: 'income',  date: daysAgo(32), tag: 'Loan Repayment', method: 'cash' },
  { id: 'ft10', description: 'TaM — pass mensuel Mohtadi',         amount: 40,    type: 'expense', date: daysAgo(35), tag: 'Transportation', method: 'card' },
  { id: 'ft11', description: 'Doctor visit — Mohtadi',             amount: 25,    type: 'expense', date: daysAgo(40), tag: 'Healthcare',     method: 'cash' },
  { id: 'ft12', description: 'Birthday — sneakers',                amount: 120,   type: 'expense', date: daysAgo(48), tag: 'Gift/Support',   method: 'card' },
];

const SEED_FAMILY_NOTES = [
  { id: 'fn1', content: 'ghadi bado: 100',               resolved: false, created_at: daysAgo(3) },
  { id: 'fn2', content: '1850 mom',                       resolved: true,  created_at: daysAgo(35) },
  { id: 'fn3', content: '1805 mom',                       resolved: true,  created_at: daysAgo(14) },
  { id: 'fn4', content: 'Mohtadi — dentist bill to confirm', resolved: false, created_at: daysAgo(5) },
  { id: 'fn5', content: 'Vol billet Tunis été',           resolved: false, created_at: daysAgo(2) },
];

const SEED_SNAPSHOTS = [
  { id: 'fs1', name: 'March check-in', bank: 1850, cash: 220, date: daysAgo(35) },
  { id: 'fs2', name: 'Mid-April',      bank: 1805, cash: 100, date: daysAgo(14) },
  { id: 'fs3', name: 'Current',        bank: 1920, cash: 180, date: daysAgo(1) },
];

Object.assign(window, { SEED_EXPENSES, SEED_INCOME, SEED_FAMILY, SEED_FAMILY_NOTES, SEED_SNAPSHOTS, iso, daysAgo, today });
