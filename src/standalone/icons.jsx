// Lucide-style icons — 1.5 stroke, 18 default
function Icon({ name, size = 18, stroke = 1.5, style = {} }) {
  const p = ICON_PATHS[name];
  if (!p) return null;
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" style={style} aria-hidden="true">{p}</svg>
  );
}
const ICON_PATHS = {
  home: <path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1h-5v-7h-6v7H4a1 1 0 0 1-1-1V9.5Z"/>,
  tasks: <><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M7 10h4M7 14h7"/></>,
  wallet: <><path d="M3 7h15a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7Z"/><path d="M3 7V5a2 2 0 0 1 2-2h11"/><circle cx="17" cy="13" r="1.2"/></>,
  users: <><circle cx="9" cy="8" r="3.2"/><path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6"/><circle cx="17" cy="9" r="2.5"/><path d="M15 15.5c3 0 6 1.8 6 4.5"/></>,
  book: <><path d="M4 4.5A2.5 2.5 0 0 1 6.5 2H20v18H6.5A2.5 2.5 0 0 0 4 22.5"/><path d="M4 4.5V22"/></>,
  calendar: <><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></>,
  plus: <path d="M12 5v14M5 12h14"/>,
  x: <path d="M18 6 6 18M6 6l12 12"/>,
  check: <polyline points="20 6 9 17 4 12"/>,
  edit: <><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 1 1 3 3L7 19l-4 1 1-4L16.5 3.5Z"/></>,
  trash: <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/>,
  arrowRight: <path d="M5 12h14M13 5l7 7-7 7"/>,
  arrowUp: <path d="M12 19V5M5 12l7-7 7 7"/>,
  arrowDown: <path d="M12 5v14M19 12l-7 7-7-7"/>,
  chevronLeft: <polyline points="15 18 9 12 15 6"/>,
  chevronRight: <polyline points="9 18 15 12 9 6"/>,
  sun: <><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></>,
  moon: <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z"/>,
  filter: <path d="M3 5h18l-7 9v6l-4-2v-4L3 5Z"/>,
  archive: <><path d="M3 7h18v4H3z"/><path d="M5 11v9a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-9"/><path d="M10 14h4"/></>,
};
window.Icon = Icon;
