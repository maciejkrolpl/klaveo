// Everything this app stores lives here, in this browser's localStorage only.
// The typed text is stored only while the "Save text on reload" box is ticked.
// (index.html also reads THEME_KEY before first paint – keep the two in sync.)
export const THEME_KEY = 'klaveo.theme';
export const MODE_KEY = 'klaveo.mode';
export const SAVE_TEXT_KEY = 'klaveo.saveText';
export const TEXT_KEY = 'klaveo.text';
export const ANALYTICS_KEY = 'klaveo.analytics'; // 'granted' | 'denied': the analytics consent choice

/** Read a stored string; fall back if it is missing, not allowed, or storage is blocked. */
export function load<T extends string>(key: string, allowed: readonly T[], fallback: T): T {
  try {
    const value = localStorage.getItem(key);
    return allowed.includes(value as T) ? (value as T) : fallback;
  } catch {
    return fallback;
  }
}

/** Read a stored string with no validation. */
export function loadRaw(key: string): string {
  try {
    return localStorage.getItem(key) ?? '';
  } catch {
    return '';
  }
}

export function save(key: string, value: string) {
  try {
    localStorage.setItem(key, value);
  } catch {
    /* storage blocked or full – the value just won't persist */
  }
}

export function remove(key: string) {
  try {
    localStorage.removeItem(key);
  } catch {
    /* ignore */
  }
}
