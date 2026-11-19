import type { Script } from './transliterate';

export type Mode = Script | 'latin';
export type Theme = 'auto' | 'light' | 'dark';

export const THEMES: { id: Theme; label: string }[] = [
  { id: 'light', label: '☀ Day' },
  { id: 'auto', label: 'Auto' },
  { id: 'dark', label: '☾ Night' },
];

export const MODES: { id: Mode; label: string; placeholder: string }[] = [
  { id: 'be', label: 'Беларуская', placeholder: "Zhyve Belarus'" },
  { id: 'uk', label: 'Українська', placeholder: 'Slava Ukrajini' },
  { id: 'latin', label: 'Latin', placeholder: 'Type here…' },
];

export const THEME_IDS = THEMES.map((t) => t.id);
export const MODE_IDS = MODES.map((m) => m.id);
