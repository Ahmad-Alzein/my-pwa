# Ahmad's Life OS — App Design & Build Specification

> **Purpose:** This document is a handoff brief for designing and building a personal productivity web app that replaces and upgrades my current Notion setup. The app should feel like *mine* — engineered, dark-themed, fast, and zero-fluff.

---

## 1. Who This Is For

**Solo user.** Ahmad, AI Engineer at a surgical robotics startup (AcuSurgical, Montpellier, France). I work across ML pipelines, computer vision, and signal processing. I need a personal command center that handles work tasks, personal tasks, finances, and learning — all in one place.

**Context that matters for design decisions:**
- I switch between French and English constantly
- I'm on this app at 7am for morning planning and at 11pm logging expenses
- Mobile-first for expense logging; desktop-first for everything else
- I already have structured data in Notion (schemas below) — the app must support the same data model or better
- I hate clutter. I want density when I need it, space when I don't

---

## 2. Core Modules

### 2.1 — Task Manager (Work + Personal)

**What it replaces:** Two Notion databases — "Daily task" (simple checklist) and "My Tasks" (Kanban with status/due/assignee).

**Requirements:**

- Two distinct views toggled by a tab or segment control: **Work** and **Personal**
- Each task has: `title`, `status` (To Do / In Progress / Done / Blocked), `priority` (P0–P3), `due_date`, `tags[]`, `notes` (rich text), `created_at`
- **Work tasks** additionally have: `jira_ref` (optional text field for Jira ticket ID like `INC-42`), `project` (select: Incubation Squad, ML Infra, Data Collection, Other)
- **Personal tasks** additionally have: `category` (select: Admin, Health, Finance, Social, Home, Side Project)
- Default view: **Today focus** — shows tasks due today + overdue, grouped by priority
- Secondary views: Kanban by status, List by due date, Weekly calendar view
- Quick-add: floating FAB or keyboard shortcut (`n`) opens a minimal modal — title + status + due date, everything else optional
- Batch complete: checkbox to mark multiple tasks done at once
- Recurring tasks: option to set daily/weekly/monthly recurrence
- **Drag-and-drop** reordering within priority groups

**Data model (existing Notion schema for reference):**

```
Daily task (simple):
- Name (title)
- Check (checkbox)
- Numbers (number)
- Text (text)

My Tasks (Kanban):
- Task name (title)
- Status (status: To-do, In progress, Done)
- Due (date)
- Source (text)
- Assignee (person)
```

### 2.2 — Finance Tracker (Expenses + Income + Savings)

**What it replaces:** "Personal Finance Tracker" page with 3 linked databases (Expenses, Income, Savings Tracker) and a Saving HUB page.

**Requirements:**

#### Expenses
- Fields: `source` (title — e.g. "Carrefour", "Uber"), `amount` (€, number), `date`, `tags` (select, single), `notes`, `month` (auto-derived from date)
- Tags (pre-populated from my existing set): Rent/Mortgage, Utilities, Groceries, Dining Out, Healthcare, Transportation, Insurance, Entertainment, Retail, Shopping, Trading, Tabac, Iphone, once
- Allow custom tags
- **Quick-add optimized for mobile**: amount + source + tag is the minimum, everything else auto-fills (date = today, month = current)

#### Income
- Fields: `source` (title), `amount` (€), `date`, `tags` (select), `month`
- Tags: Salary, Bonus, Freelance, Dividends, Interest, Side Hustle, Refund, Saving
- Monthly salary auto-entry option (recurring)

#### Savings Tracker
- Fields: `name` (title — e.g. "Livret A", "Trading account"), `transaction_type` (Deposit / Withdrawal), `amount` (€), `date`, `notes`
- Formula fields (compute in frontend): `current_savings` (running total per account), `progress_bar` (% toward goal)
- Savings goals: each savings account can have a target amount

#### Dashboard (Finance Overview)
- **Monthly summary card**: total income, total expenses, net (income - expenses), savings rate %
- **Expenses breakdown**: donut/pie chart by tag for current month
- **Income vs Expenses trend**: bar chart, last 6 months
- **Savings progress**: horizontal progress bars per savings account toward goal
- **Month selector**: navigate between months
- **Quick stats row**: "Biggest expense this month", "Days since last dining out", etc.

**Data model (existing Notion schemas):**

```
Expenses:
- Source (title)
- Amount (number, €)
- Date (date)
- Tags (select: Rent/Mortgage, Utilities, Groceries, Dining Out, Healthcare, Transportation, Insurance, Entertainment, Retail, once, Trading, Iphone, Tabac, Mohtadi meetings, grenoble, Shopping)
- Notes (text)
- Month (relation → Total Savings)

Income:
- Source (title)
- Amount (number, €)
- Date (date)
- Tags (select: Salary, Bonus, Freelance, Dividends, Interest, Side Hustle, refund, saving)
- Month (relation → Total Savings)

Savings Tracker:
- Name (title)
- Transaction Type (select: Deposit, Withdrawal)
- Amount (number, €)
- Date (date)
- Notes (text)
- Current Savings (formula — running sum)
- Progress Bar (formula)
```

### 2.3 — Learning Tracker

**What it replaces:** Scattered Notion pages like "Drone & AI in Defense — Learning Hub", various resources pages, and track-specific knowledge bases.

**Requirements:**

- **Learning domains** (top-level grouping): each domain is a topic I'm studying (e.g. "Drone & AI in Defense", "Surgical Robotics CV", "Trading Systems", "Claude Agents", "Rust")
- Each domain has:
  - `title`, `description`, `status` (Not Started / In Progress / Completed / Paused), `progress` (0–100%), `started_at`, `target_completion`
  - **Resources**: list of links/books/courses with type (Book, Course, Paper, Video, Article, Repo), title, URL, status (To Read / In Progress / Done), rating (1–5 stars)
  - **Notes / Key takeaways**: rich text area per domain for my notes
  - **Milestones**: checkable list of milestones (e.g. "Complete Track A", "Build first prototype")
- **Dashboard view**: card grid showing all domains with progress bars and last-activity date
- **Activity log**: auto-generated timeline of "completed resource X in domain Y on date Z"
- **Weekly learning goal**: configurable target (e.g. "5 hours/week") with simple manual time logging per session

### 2.4 — Home Dashboard

**The landing page when I open the app.**

- **Greeting**: "Good morning, Ahmad" / "Bonsoir, Ahmad" based on time of day (French after 6pm, why not)
- **Today's Focus**: top 3–5 priority tasks across work and personal
- **Financial pulse**: net balance this month (income - expenses), mini sparkline
- **Learning streak**: days in a row with at least one learning log
- **Quick actions row**: + Expense, + Task, + Learning Session — each opens the respective quick-add modal
- **Upcoming**: next 3 tasks by due date
- **Recent activity feed**: last 5 actions across all modules

---

## 3. Design Direction

### Aesthetic: "Engineer's Cockpit"

Dark-themed, high-contrast, information-dense but not cluttered. Think Bloomberg Terminal meets Linear meets a premium car dashboard.

**Key design principles:**
1. **Dark mode only** (I don't use light mode). Rich dark backgrounds (#0A0A0F base), not pure black
2. **Accent color**: electric blue (#3B82F6) or a cyan-teal (#06B6D4) — signals precision, tech
3. **Typography**: monospace for numbers/amounts (JetBrains Mono or similar), a clean geometric sans for everything else (Geist, Satoshi, or General Sans — NOT Inter/Roboto)
4. **Micro-interactions**: subtle hover states, smooth transitions (200ms ease), skeleton loaders
5. **Data density**: tables should be compact. No giant padding. Show more data per viewport
6. **Status indicators**: colored dots/pills for task status, expense tags — consistent color language
7. **Cards with glass morphism**: subtle backdrop-blur, thin borders (1px rgba white 10%), no heavy shadows
8. **Charts**: use muted fills, no 3D, no gradients on charts — clean flat data viz
9. **Mobile**: bottom nav bar (4 tabs: Home, Tasks, Finance, Learn), FAB for quick-add
10. **Animations**: page transitions with subtle fade + slide, list items animate in staggered

### Color System

```
--bg-primary:     #0A0A0F     (main background)
--bg-secondary:   #12121A     (cards, panels)
--bg-tertiary:    #1A1A2E     (hover states, active items)
--border:         rgba(255, 255, 255, 0.06)
--text-primary:   #E4E4E7     (main text)
--text-secondary: #71717A     (labels, hints)
--text-muted:     #3F3F46     (disabled)
--accent:         #3B82F6     (primary actions, links)
--accent-hover:   #2563EB
--success:        #22C55E     (income, completed, deposits)
--warning:        #F59E0B     (due soon, in progress)
--danger:         #EF4444     (overdue, expenses, blocked)
--info:           #06B6D4     (neutral highlights)
```

### Status Colors (consistent across modules)

```
To Do / Not Started:  #71717A (gray)
In Progress:          #F59E0B (amber)
Done / Completed:     #22C55E (green)
Blocked / Paused:     #EF4444 (red)
```

### Component Patterns

- **Quick-add modals**: slide up from bottom on mobile, centered modal on desktop. Minimal fields visible, "More options" expandable section
- **Data tables**: zebra striping with very subtle alternation (2% opacity difference), sticky headers, sortable columns
- **Charts**: Recharts or similar. Dark theme, grid lines at 8% opacity, tooltips on hover
- **Navigation**: sidebar on desktop (collapsible), bottom tab bar on mobile
- **Empty states**: illustrated or icon-based, not just text. "No expenses logged this month — your wallet thanks you"
- **Loading**: skeleton screens that match the layout, never spinners

---

## 4. Tech Stack Recommendation

This is flexible — Claude Code can adapt, but here's my preferred direction:

| Layer | Choice | Rationale |
|-------|--------|-----------|
| Framework | **Next.js 14+ (App Router)** | SSR for dashboard, RSC for performance |
| UI Library | **Tailwind CSS + shadcn/ui** | Customizable, dark-mode native, composable |
| State | **Zustand** or React Context | Simple, no Redux overhead for solo app |
| Database | **Supabase (PostgreSQL)** | Free tier, real-time, auth built-in, row-level security |
| Auth | **Supabase Auth** | Magic link or Google OAuth — solo user |
| Charts | **Recharts** or **Tremor** | React-native charting, dark theme support |
| Hosting | **Vercel** | Automatic with Next.js |
| ORM | **Drizzle** or **Prisma** | Type-safe queries |

**Alternative minimal stack**: If building as a single-page React app (no SSR needed), use Vite + React + Supabase + Tailwind.

---

## 5. Database Schema (PostgreSQL / Supabase)

```sql
-- Tasks
CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'todo' CHECK (status IN ('todo', 'in_progress', 'done', 'blocked')),
  priority TEXT NOT NULL DEFAULT 'p2' CHECK (priority IN ('p0', 'p1', 'p2', 'p3')),
  due_date DATE,
  type TEXT NOT NULL CHECK (type IN ('work', 'personal')),
  tags TEXT[],
  notes TEXT,
  -- Work-specific
  jira_ref TEXT,
  project TEXT,
  -- Personal-specific
  category TEXT,
  -- Recurrence
  is_recurring BOOLEAN DEFAULT false,
  recurrence_pattern TEXT, -- 'daily', 'weekly', 'monthly'
  -- Meta
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  completed_at TIMESTAMPTZ
);

-- Expenses
CREATE TABLE expenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source TEXT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  tag TEXT,
  notes TEXT,
  month TEXT GENERATED ALWAYS AS (TO_CHAR(date, 'YYYY-MM')) STORED,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Income
CREATE TABLE income (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source TEXT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  tag TEXT,
  month TEXT GENERATED ALWAYS AS (TO_CHAR(date, 'YYYY-MM')) STORED,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Savings Accounts
CREATE TABLE savings_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  target_amount DECIMAL(10,2),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Savings Transactions
CREATE TABLE savings_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id UUID REFERENCES savings_accounts(id) ON DELETE CASCADE,
  transaction_type TEXT NOT NULL CHECK (transaction_type IN ('deposit', 'withdrawal')),
  amount DECIMAL(10,2) NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Learning Domains
CREATE TABLE learning_domains (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'not_started' CHECK (status IN ('not_started', 'in_progress', 'completed', 'paused')),
  progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  started_at DATE,
  target_completion DATE,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Learning Resources
CREATE TABLE learning_resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  domain_id UUID REFERENCES learning_domains(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  url TEXT,
  resource_type TEXT CHECK (resource_type IN ('book', 'course', 'paper', 'video', 'article', 'repo')),
  status TEXT DEFAULT 'to_read' CHECK (status IN ('to_read', 'in_progress', 'done')),
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  created_at TIMESTAMPTZ DEFAULT now(),
  completed_at TIMESTAMPTZ
);

-- Learning Milestones
CREATE TABLE learning_milestones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  domain_id UUID REFERENCES learning_domains(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  is_completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMPTZ,
  sort_order INTEGER DEFAULT 0
);

-- Learning Sessions (time logging)
CREATE TABLE learning_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  domain_id UUID REFERENCES learning_domains(id) ON DELETE CASCADE,
  duration_minutes INTEGER NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Activity Log (auto-populated via triggers or app logic)
CREATE TABLE activity_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  module TEXT NOT NULL, -- 'tasks', 'expenses', 'income', 'savings', 'learning'
  action TEXT NOT NULL, -- 'created', 'completed', 'updated', 'deleted'
  entity_id UUID,
  summary TEXT NOT NULL, -- "Completed task: Fix PMD pipeline"
  created_at TIMESTAMPTZ DEFAULT now()
);
```

---

## 6. API Routes / Data Flow

```
/api/tasks          GET (list, filter by type/status/date), POST, PATCH, DELETE
/api/expenses       GET (list, filter by month/tag), POST, PATCH, DELETE
/api/income         GET (list, filter by month/tag), POST, PATCH, DELETE
/api/savings        GET accounts + transactions, POST, PATCH, DELETE
/api/learning       GET domains + resources + milestones, POST, PATCH, DELETE
/api/learning/sessions  GET, POST (log time)
/api/dashboard      GET (aggregated: today's tasks, monthly summary, learning streak)
/api/activity       GET (recent activity log)
```

---

## 7. Pages / Routes

```
/                     → Home Dashboard
/tasks                → Task Manager (default: Today view)
/tasks?view=kanban    → Kanban view
/tasks?view=calendar  → Weekly calendar
/finance              → Finance Dashboard (overview + charts)
/finance/expenses     → Expenses list/table
/finance/income       → Income list/table
/finance/savings      → Savings accounts + tracker
/learn                → Learning Dashboard (domain cards)
/learn/[domain-id]    → Single domain detail (resources, milestones, notes)
/settings             → Tags management, savings goals, weekly learning target
```

---

## 8. Data Migration Notes

I have existing data in Notion that I may want to import. The Notion databases use these exact schemas (documented above in each module section). Key points for migration:

- Expenses and Income databases have a `Month` relation to a "Total Savings" database — in the new app, this is replaced by the auto-generated `month` column
- The "Daily task" database is very simple (just checkboxes) — these can be imported as personal tasks with status = done/todo based on the Check field
- Savings Tracker has formula fields (Current Savings, Progress Bar) — these should be computed client-side or as DB views

---

## 9. Nice-to-Haves (Phase 2)

- **Notion import script**: Python or Node script to pull existing data via Notion API and insert into Supabase
- **Keyboard shortcuts**: `n` = new task, `e` = new expense, `Cmd+K` = command palette for quick navigation
- **PWA support**: installable on phone home screen with offline capability for quick-add
- **Export**: monthly financial report as PDF
- **AI summaries**: weekly digest ("You spent 40% more on dining out this week", "3 tasks overdue")
- **Dark/OLED mode toggle**: true black (#000) for OLED screens
- **Widgets**: small embeddable views for phone home screen (Android)

---

## 10. Non-Goals

- **Multi-user / collaboration**: this is a solo app, no sharing needed
- **Complex project management**: no Gantt charts, dependencies, or sprint planning — that's what Jira is for
- **Calendar integration**: not needed, I use Google Calendar separately
- **Notifications / reminders**: not in v1 — I already have phone notifications from other tools
- **Crypto tracking**: explicitly excluded from finance module

---

## 11. Success Criteria

The app is successful when:
1. I open it instead of Notion for daily task management and expense logging
2. Adding an expense takes < 5 seconds on mobile
3. I can see my monthly financial health in one glance
4. My learning progress is visible and motivating, not buried in pages
5. It feels fast — no page loads > 500ms, no janky transitions
6. It looks like *my* app, not a generic template

---

*Generated: April 19, 2026*
*For use with: Claude Code / Claude Design*
