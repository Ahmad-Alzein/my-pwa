// Family Ledger seed data — matching Notion "Saving HUB" patterns
const SEED_FAMILY_TX = [
  { id: 'ft1', description: 'Groceries for Mohtadi — Carrefour', amount: 62.40, transaction_type: 'expense', date: window.daysFromNow(-2), tag: 'Groceries', payment_method: 'card', person: 'brother', notes: '' },
  { id: 'ft2', description: 'Mohtadi — rent share April', amount: 350, transaction_type: 'income', date: window.daysFromNow(-5), tag: 'Rent/Housing', payment_method: 'bank_transfer', person: 'brother', notes: 'SEPA' },
  { id: 'ft3', description: 'Pharmacy — prescriptions', amount: 38, transaction_type: 'expense', date: window.daysFromNow(-7), tag: 'Healthcare', payment_method: 'card', person: 'brother', notes: '' },
  { id: 'ft4', description: 'Train to Lyon (gift)', amount: 89, transaction_type: 'expense', date: window.daysFromNow(-12), tag: 'Gift/Support', payment_method: 'card', person: 'brother', notes: '' },
  { id: 'ft5', description: 'Mohtadi — cash back', amount: 200, transaction_type: 'income', date: window.daysFromNow(-15), tag: 'Loan Repayment', payment_method: 'cash', person: 'brother', notes: '' },
  { id: 'ft6', description: 'School supplies', amount: 54, transaction_type: 'expense', date: window.daysFromNow(-20), tag: 'Education', payment_method: 'card', person: 'brother', notes: '' },
  { id: 'ft7', description: 'Electricity share', amount: 42, transaction_type: 'expense', date: window.daysFromNow(-25), tag: 'Utilities', payment_method: 'bank_transfer', person: 'brother', notes: '' },
  { id: 'ft8', description: 'Groceries — Super U', amount: 28, transaction_type: 'expense', date: window.daysFromNow(-28), tag: 'Groceries', payment_method: 'card', person: 'brother', notes: '' },
  { id: 'ft9', description: 'Mohtadi — envoi espèces', amount: 150, transaction_type: 'income', date: window.daysFromNow(-32), tag: 'Loan Repayment', payment_method: 'cash', person: 'brother', notes: '' },
  { id: 'ft10', description: 'TaM — pass mensuel Mohtadi', amount: 40, transaction_type: 'expense', date: window.daysFromNow(-35), tag: 'Transportation', payment_method: 'card', person: 'brother', notes: '' },
  { id: 'ft11', description: 'Doctor visit — Mohtadi', amount: 25, transaction_type: 'expense', date: window.daysFromNow(-40), tag: 'Healthcare', payment_method: 'cash', person: 'brother', notes: '' },
  { id: 'ft12', description: 'Birthday — sneakers', amount: 120, transaction_type: 'expense', date: window.daysFromNow(-48), tag: 'Gift/Support', payment_method: 'card', person: 'brother', notes: '' },
];

const SEED_FAMILY_SNAPSHOTS = [
  { id: 'fs1', name: 'March check-in', bank_amount: 1850, cash_amount: 220, date: window.daysFromNow(-35), notes: 'After rent settlement' },
  { id: 'fs2', name: 'Mid-April', bank_amount: 1805, cash_amount: 100, date: window.daysFromNow(-14), notes: '' },
  { id: 'fs3', name: 'Current', bank_amount: 1920, cash_amount: 180, date: window.daysFromNow(-1), notes: 'Mohtadi paid April' },
];

const SEED_FAMILY_NOTES = [
  { id: 'fn1', content: 'ghadi bado: 100', is_resolved: false, created_at: window.daysFromNow(-3) },
  { id: 'fn2', content: '1850 mom', is_resolved: true, created_at: window.daysFromNow(-35), resolved_at: window.daysFromNow(-30) },
  { id: 'fn3', content: '1805 mom', is_resolved: true, created_at: window.daysFromNow(-14), resolved_at: window.daysFromNow(-10) },
  { id: 'fn4', content: 'Mohtadi — dentist bill to confirm', is_resolved: false, created_at: window.daysFromNow(-5) },
  { id: 'fn5', content: 'Vol billet Tunis été', is_resolved: false, created_at: window.daysFromNow(-2) },
];

const FAMILY_TAGS = [
  'Rent/Housing', 'Groceries', 'Utilities', 'Healthcare', 'Transportation',
  'Education', 'Gift/Support', 'Loan Repayment', 'Other'
];

Object.assign(window, { SEED_FAMILY_TX, SEED_FAMILY_SNAPSHOTS, SEED_FAMILY_NOTES, FAMILY_TAGS });
