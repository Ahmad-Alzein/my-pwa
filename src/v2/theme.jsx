// Refined Atelier theme tokens — light + dark
// Applied via <html data-theme="light|dark">

const ATELIER_CSS = `
html[data-theme="light"] {
  --bg-primary: #FAFAF8;
  --bg-secondary: #F2F0EB;
  --bg-tertiary: #E8E5DE;
  --bg-raised: #FFFFFF;
  --border: #D4D0C8;
  --border-soft: #E8E5DE;
  --text-primary: #1A1A1A;
  --text-secondary: #6B6560;
  --text-muted: #A39E96;
  --accent: #C17F59;
  --accent-hover: #A8694A;
  --accent-soft: #F5EDE6;
  --success: #5A8A6C;
  --success-soft: #EDF4EF;
  --warning: #C4963A;
  --warning-soft: #FBF4E4;
  --danger: #B85C4A;
  --danger-soft: #FAEDEA;
  --info: #5B7FA5;
  --info-soft: #EDF2F8;
  --shadow-sm: 0 1px 3px rgba(20, 19, 18, 0.04);
  --shadow-md: 0 2px 8px rgba(20, 19, 18, 0.06), 0 1px 3px rgba(20, 19, 18, 0.04);
  --shadow-lg: 0 10px 32px rgba(20, 19, 18, 0.08), 0 2px 6px rgba(20, 19, 18, 0.04);
  --paper-grain: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='400'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0.8 0 0 0 0 0.75 0 0 0 0 0.68 0 0 0 0.03 0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>");
}
html[data-theme="dark"] {
  --bg-primary: #141312;
  --bg-secondary: #1E1C1A;
  --bg-tertiary: #2A2725;
  --bg-raised: #23201E;
  --border: rgba(255, 245, 235, 0.08);
  --border-soft: rgba(255, 245, 235, 0.05);
  --text-primary: #ECE8E1;
  --text-secondary: #9B9590;
  --text-muted: #5C5650;
  --accent: #D4956F;
  --accent-hover: #E0A882;
  --accent-soft: rgba(212, 149, 111, 0.12);
  --success: #7AAF8E;
  --success-soft: rgba(122, 175, 142, 0.1);
  --warning: #D4A64E;
  --warning-soft: rgba(212, 166, 78, 0.1);
  --danger: #D47A68;
  --danger-soft: rgba(212, 122, 104, 0.1);
  --info: #7A9FC5;
  --info-soft: rgba(122, 159, 197, 0.1);
  --shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.2);
  --shadow-md: 0 4px 16px rgba(0, 0, 0, 0.3);
  --shadow-lg: 0 16px 40px rgba(0, 0, 0, 0.5);
  --paper-grain: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='400'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1 0 0 0 0 0.95 0 0 0 0 0.88 0 0 0 0.015 0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>");
}

:root {
  --space-xs: 4px;
  --space-sm: 8px;
  --space-md: 16px;
  --space-lg: 24px;
  --space-xl: 32px;
  --space-2xl: 48px;
  --space-3xl: 64px;
  --radius-sm: 6px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-xl: 16px;
  --ease: cubic-bezier(0.25, 0.1, 0.25, 1);
}
`;

// Inject
(function injectTheme() {
  const s = document.createElement('style');
  s.id = 'atelier-theme';
  s.textContent = ATELIER_CSS;
  document.head.appendChild(s);
})();

// Theme manager
const THEME_KEY = 'lifeos.v2.theme';
function getInitialTheme() {
  const stored = localStorage.getItem(THEME_KEY);
  if (stored === 'light' || stored === 'dark') return stored;
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) return 'dark';
  return 'light';
}
function applyTheme(theme) {
  document.documentElement.classList.add('theme-transition');
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem(THEME_KEY, theme);
  setTimeout(() => document.documentElement.classList.remove('theme-transition'), 400);
}
// Apply immediately to avoid flash
applyTheme(getInitialTheme());

function useTheme() {
  const [theme, setTheme] = React.useState(() => document.documentElement.getAttribute('data-theme') || 'light');
  const toggle = React.useCallback(() => {
    setTheme((t) => {
      const next = t === 'light' ? 'dark' : 'light';
      applyTheme(next);
      return next;
    });
  }, []);
  return [theme, toggle];
}

Object.assign(window, { useTheme, applyTheme });
