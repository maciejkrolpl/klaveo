import { MODES, type Mode } from '../config'
import { Flag } from './Flag'

interface Props {
  mode: Mode
  onChange: (mode: Mode) => void
}

export function LanguageTabs({ mode, onChange }: Props) {
  return (
    <div className="tabs" role="tablist" aria-label="Language">
      {MODES.map((m) => (
        <button
          key={m.id}
          role="tab"
          aria-selected={mode === m.id}
          className={mode === m.id ? 'tab active' : 'tab'}
          onClick={() => onChange(m.id)}
        >
          <Flag mode={m.id} />
          {m.label}
        </button>
      ))}
    </div>
  )
}
