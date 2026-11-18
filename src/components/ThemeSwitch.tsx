import { THEMES, type Theme } from '../config'

interface Props {
  theme: Theme
  onChange: (theme: Theme) => void
}

export function ThemeSwitch({ theme, onChange }: Props) {
  return (
    <div className="theme" role="group" aria-label="Colour theme">
      {THEMES.map((t) => (
        <button key={t.id} aria-pressed={theme === t.id} onClick={() => onChange(t.id)}>
          {t.label}
        </button>
      ))}
    </div>
  )
}
