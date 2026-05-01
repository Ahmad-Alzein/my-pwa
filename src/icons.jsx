// Minimal line icons — 16px by default, inherit currentColor
const mkIcon = (path, viewBox = '0 0 24 24') => ({ size = 16, strokeWidth = 1.75, style = {}, className = '' }) => (
  <svg width={size} height={size} viewBox={viewBox} fill="none" style={style} className={className}
       stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
    {path}
  </svg>
);

const Icon = {
  Home: mkIcon(<><path d="M3 10l9-7 9 7v11a1 1 0 01-1 1h-5v-7h-6v7H4a1 1 0 01-1-1z"/></>),
  Check: mkIcon(<path d="M5 12l5 5L20 7"/>),
  Plus: mkIcon(<><path d="M12 5v14M5 12h14"/></>),
  Tasks: mkIcon(<><rect x="3" y="4" width="7" height="7" rx="1"/><rect x="14" y="4" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><path d="M17 14l1.5 1.5L21 13"/></>),
  Finance: mkIcon(<><path d="M3 3v18h18"/><path d="M7 14l3-3 3 3 5-5"/><path d="M18 9h-3M18 9v3"/></>),
  Learn: mkIcon(<><path d="M2 6l10 4 10-4-10-4z"/><path d="M6 10v5c0 1.7 2.7 3 6 3s6-1.3 6-3v-5"/><path d="M22 6v6"/></>),
  Settings: mkIcon(<><circle cx="12" cy="12" r="3"/><path d="M12 1v4M12 19v4M4.2 4.2l2.8 2.8M17 17l2.8 2.8M1 12h4M19 12h4M4.2 19.8L7 17M17 7l2.8-2.8"/></>),
  Search: mkIcon(<><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></>),
  ChevronDown: mkIcon(<path d="M6 9l6 6 6-6"/>),
  ChevronRight: mkIcon(<path d="M9 6l6 6-6 6"/>),
  ChevronLeft: mkIcon(<path d="M15 6l-6 6 6 6"/>),
  X: mkIcon(<path d="M6 6l12 12M18 6L6 18"/>),
  Filter: mkIcon(<path d="M3 5h18l-7 9v5l-4 2v-7z"/>),
  Calendar: mkIcon(<><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M8 3v4M16 3v4M3 10h18"/></>),
  Clock: mkIcon(<><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></>),
  Flame: mkIcon(<path d="M12 2s4 4 4 8c0 2-1 3-2 3s-1-1-1-2c0-2-1-4-1-4s-4 3-4 7a6 6 0 0012 0c0-5-8-12-8-12z"/>),
  TrendUp: mkIcon(<><path d="M3 17l6-6 4 4 8-8"/><path d="M14 7h7v7"/></>),
  TrendDown: mkIcon(<><path d="M3 7l6 6 4-4 8 8"/><path d="M14 17h7v-7"/></>),
  Wallet: mkIcon(<><path d="M3 7a2 2 0 012-2h14v4H5a2 2 0 01-2-2z"/><rect x="3" y="7" width="18" height="12" rx="2"/><circle cx="17" cy="13" r="1.2" fill="currentColor"/></>),
  Zap: mkIcon(<path d="M13 2L3 14h7l-1 8 10-12h-7z"/>),
  Dot: mkIcon(<circle cx="12" cy="12" r="3" fill="currentColor"/>),
  ArrowUp: mkIcon(<path d="M12 19V5M5 12l7-7 7 7"/>),
  ArrowDown: mkIcon(<path d="M12 5v14M5 12l7 7 7-7"/>),
  Target: mkIcon(<><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1" fill="currentColor"/></>),
  Book: mkIcon(<><path d="M4 4h12a4 4 0 014 4v12H8a4 4 0 01-4-4z"/><path d="M4 4v13a3 3 0 003 3"/></>),
  Video: mkIcon(<><rect x="3" y="6" width="13" height="12" rx="2"/><path d="M16 10l5-3v10l-5-3z"/></>),
  Paper: mkIcon(<><path d="M6 2h9l5 5v15H6z"/><path d="M15 2v5h5"/><path d="M9 13h7M9 17h7M9 9h3"/></>),
  Code: mkIcon(<><path d="M16 18l6-6-6-6M8 6l-6 6 6 6"/></>),
  Article: mkIcon(<><rect x="4" y="3" width="16" height="18" rx="2"/><path d="M8 8h8M8 12h8M8 16h5"/></>),
  Course: mkIcon(<><path d="M2 9l10-5 10 5-10 5-10-5z"/><path d="M6 12v4c2 2 4 3 6 3s4-1 6-3v-4"/></>),
  Menu: mkIcon(<path d="M3 6h18M3 12h18M3 18h18"/>),
  Bell: mkIcon(<><path d="M6 10a6 6 0 1112 0c0 7 3 8 3 8H3s3-1 3-8z"/><path d="M10 21a2 2 0 004 0"/></>),
  Command: mkIcon(<path d="M9 3a3 3 0 00-3 3v3H3m6 0h6m0 0v6m0-6V6a3 3 0 013-3m0 18a3 3 0 00-3-3v-3m0 0H6m0 0v-3m0 3a3 3 0 01-3 3"/>),
  Terminal: mkIcon(<><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M7 10l3 2-3 2M13 14h4"/></>),
  Eye: mkIcon(<><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z"/><circle cx="12" cy="12" r="3"/></>),
  Building: mkIcon(<><path d="M3 21V5a2 2 0 012-2h9a2 2 0 012 2v16"/><path d="M16 8h3a2 2 0 012 2v11"/><path d="M7 8h3M7 12h3M7 16h3M14 12h3M14 16h3"/></>),
  User: mkIcon(<><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0116 0"/></>),
  Receipt: mkIcon(<><path d="M5 3h14v18l-3-2-2 2-2-2-2 2-2-2-3 2z"/><path d="M9 8h6M9 12h6M9 16h4"/></>),
  Play: mkIcon(<path d="M6 4l14 8-14 8z" fill="currentColor"/>),
  Pause: mkIcon(<><rect x="6" y="4" width="4" height="16" rx="1" fill="currentColor"/><rect x="14" y="4" width="4" height="16" rx="1" fill="currentColor"/></>),
  Edit: mkIcon(<path d="M11 4H4v16h16v-7M18.5 2.5a2.12 2.12 0 013 3L12 15l-4 1 1-4z"/>),
  Trash: mkIcon(<><path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2M6 6l1 14a2 2 0 002 2h6a2 2 0 002-2l1-14"/></>),
  Tag: mkIcon(<><path d="M2 12V4a2 2 0 012-2h8l10 10-10 10z"/><circle cx="7" cy="7" r="1" fill="currentColor"/></>),
  Grid: mkIcon(<><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></>),
  List: mkIcon(<><path d="M8 6h13M8 12h13M8 18h13"/><circle cx="4" cy="6" r="1" fill="currentColor"/><circle cx="4" cy="12" r="1" fill="currentColor"/><circle cx="4" cy="18" r="1" fill="currentColor"/></>),
  Star: mkIcon(<path d="M12 2l3 7 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1z"/>),
};

const ResourceTypeIcon = ({ type, ...p }) => {
  const map = { book: Icon.Book, course: Icon.Course, paper: Icon.Paper, video: Icon.Video, article: Icon.Article, repo: Icon.Code };
  const C = map[type] || Icon.Article;
  return <C {...p} />;
};

const ModuleIcon = ({ module, ...p }) => {
  const map = { tasks: Icon.Tasks, expenses: Icon.Receipt, income: Icon.Wallet, savings: Icon.Target, learning: Icon.Book };
  const C = map[module] || Icon.Dot;
  return <C {...p} />;
};

Object.assign(window, { Icon, ResourceTypeIcon, ModuleIcon });
