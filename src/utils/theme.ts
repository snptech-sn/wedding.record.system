export type ThemeMode = 'light' | 'dark';

const THEME_STORAGE_KEY = 'wedding_gift_theme_mode';

export function getInitialTheme(): ThemeMode {
  if (typeof window === 'undefined') return 'light';
  
  const stored = localStorage.getItem(THEME_STORAGE_KEY);
  if (stored === 'light' || stored === 'dark') {
    return stored;
  }
  
  // Optional: check system preference
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }
  
  return 'light';
}

export function applyTheme(theme: ThemeMode) {
  if (typeof document === 'undefined') return;
  
  const root = document.documentElement;
  if (theme === 'dark') {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }
  
  localStorage.setItem(THEME_STORAGE_KEY, theme);
}
