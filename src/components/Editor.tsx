import { useState } from 'react'
import type { Mode } from '../config'
import type { TextareaBindings } from '../hooks/useLiveInput'

interface Props {
  mode: Mode
  placeholder: string
  textarea: TextareaBindings
  saveText: boolean
  onSaveTextChange: (checked: boolean) => void
  onClear: () => void
}

export function Editor({ mode, placeholder, textarea, saveText, onSaveTextChange, onClear }: Props) {
  const [copied, setCopied] = useState(false)
  const text = textarea.value

  async function copy() {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      /* clipboard unavailable – ignore */
    }
  }

  return (
    <section className="editor">
      <textarea
        {...textarea}
        placeholder={placeholder}
        spellCheck={false}
        lang={mode === 'latin' ? 'en' : mode}
        autoFocus
      />
      <div className="actions">
        <label className="check">
          <input
            type="checkbox"
            checked={saveText}
            onChange={(e) => onSaveTextChange(e.target.checked)}
          />
          Save text on reload
        </label>
        <button className="btn ghost" onClick={onClear} disabled={!text}>
          Clear
        </button>
        <button className="btn" onClick={copy} disabled={!text}>
          {copied ? 'Copied ✓' : 'Copy'}
        </button>
      </div>
    </section>
  )
}
