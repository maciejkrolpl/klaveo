import { useState, type KeyboardEvent } from 'react';
import type { Mode } from '../config';
import type { TextareaBindings } from '../hooks/useLiveInput';

interface Props {
  mode: Mode;
  placeholder: string;
  textarea: TextareaBindings;
  saveText: boolean;
  onSaveTextChange: (checked: boolean) => void;
  onClear: () => void;
  onConvert: () => void;
  canConvert: boolean;
}

export function Editor({
  mode,
  placeholder,
  textarea,
  saveText,
  onSaveTextChange,
  onClear,
  onConvert,
  canConvert,
}: Props) {
  const [copied, setCopied] = useState(false);
  const text = textarea.value;

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard unavailable – ignore */
    }
  }

  // Ctrl+Enter (Cmd+Enter on Mac) copies, from the textarea or any button.
  function onKeyDown(e: KeyboardEvent<HTMLElement>) {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      if (text) {
        void copy();
      }
    }
  }

  return (
    <section className="editor" onKeyDown={onKeyDown}>
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
        {mode !== 'latin' && (
          <button
            className="btn ghost"
            onClick={onConvert}
            disabled={!canConvert}
            title="Turn Latin letters already in the box into Cyrillic"
          >
            Convert
          </button>
        )}
        <button
          className="btn"
          onClick={copy}
          disabled={!text}
          title="Copy (Ctrl+Enter)"
          aria-keyshortcuts="Control+Enter Meta+Enter"
        >
          {copied ? 'Copied ✓' : 'Copy'}
        </button>
      </div>
    </section>
  );
}
