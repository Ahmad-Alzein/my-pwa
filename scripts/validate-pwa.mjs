import { existsSync, readFileSync, statSync } from 'node:fs';

const requiredFiles = [
  'index.html',
  'manifest.webmanifest',
  'sw.js',
  'assets/icons/life-os-icon.svg',
  'assets/icons/life-os-icon-180.png',
  'assets/icons/life-os-icon-192.png',
  'assets/icons/life-os-icon-512.png',
  'GITHUB_PAGES_PWA_SETUP.md',
];

const errors = [];

for (const file of requiredFiles) {
  if (!existsSync(file)) {
    errors.push(`Missing required file: ${file}`);
  } else if (statSync(file).size === 0) {
    errors.push(`Required file is empty: ${file}`);
  }
}

if (existsSync('index.html')) {
  const html = readFileSync('index.html', 'utf8');
  const requiredHtml = [
    '<link rel="manifest" href="manifest.webmanifest"',
    '<meta name="theme-color"',
    '<meta name="apple-mobile-web-app-capable" content="yes"',
    '<meta name="apple-mobile-web-app-title" content="Life OS"',
    '<link rel="apple-touch-icon" href="assets/icons/life-os-icon-180.png"',
    'navigator.serviceWorker.register',
    'src="src/v2/app.jsx"',
  ];

  for (const marker of requiredHtml) {
    if (!html.includes(marker)) errors.push(`index.html missing marker: ${marker}`);
  }
}

if (existsSync('manifest.webmanifest')) {
  const manifest = JSON.parse(readFileSync('manifest.webmanifest', 'utf8'));
  if (manifest.name !== 'Life OS') errors.push('manifest name must be Life OS');
  if (manifest.short_name !== 'Life OS') errors.push('manifest short_name must be Life OS');
  if (manifest.display !== 'standalone') errors.push('manifest display must be standalone');
  if (manifest.start_url !== './') errors.push('manifest start_url must be ./');
  if (manifest.scope !== './') errors.push('manifest scope must be ./');
  if (!Array.isArray(manifest.icons) || manifest.icons.length < 3) {
    errors.push('manifest must include at least 3 icons');
  }
}

if (existsSync('sw.js')) {
  const sw = readFileSync('sw.js', 'utf8');
  const requiredSw = [
    "const CACHE_NAME = 'life-os-pwa-v3';",
    'Life OS v2.html',
    'src/v2/app.jsx',
    'manifest.webmanifest',
    'life-os-icon-512.png',
    'https://unpkg.com/react@18.3.1/umd/react.development.js',
    'https://unpkg.com/react-dom@18.3.1/umd/react-dom.development.js',
    'https://unpkg.com/@babel/standalone@7.29.0/babel.min.js',
    'RUNTIME_ASSETS.includes(event.request.url)',
    'cache.addAll',
  ];

  for (const marker of requiredSw) {
    if (!sw.includes(marker)) errors.push(`sw.js missing marker: ${marker}`);
  }
}

if (existsSync('src/v2/app.jsx')) {
  const app = readFileSync('src/v2/app.jsx', 'utf8');
  const requiredApp = [
    'function isMobileLikeViewport',
    'function useIsMobileViewport',
    "window.matchMedia(`(max-width: ${breakpoint}px)`)",
    "window.matchMedia('(pointer: coarse) and (max-width: 1024px)')",
    'navigator.userAgent',
    'data-screen-label="atelier-mobile-shell"',
    '<Mobile state={state} setState={setState} theme={theme} onToggleTheme={toggleTheme} framed={false} />',
  ];

  for (const marker of requiredApp) {
    if (!app.includes(marker)) errors.push(`src/v2/app.jsx missing marker: ${marker}`);
  }
}

if (existsSync('src/v2/mobile.jsx')) {
  const mobile = readFileSync('src/v2/mobile.jsx', 'utf8');
  const requiredMobile = [
    'framed = true',
    'data-screen-label="atelier-mobile-main"',
    "framed ? '64px 16px 90px'",
  ];

  for (const marker of requiredMobile) {
    if (!mobile.includes(marker)) errors.push(`src/v2/mobile.jsx missing marker: ${marker}`);
  }
}

if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}

console.log('PWA validation passed.');
