import {
  useLayoutEffect,
  useRef,
  type ChangeEvent,
  type RefObject,
  type SyntheticEvent,
} from 'react';
import type { Mode } from '../config';
import { typeChar } from '../transliterate';

export interface TextareaBindings {
  ref: RefObject<HTMLTextAreaElement | null>;
  value: string;
  onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  onSelect: (e: SyntheticEvent<HTMLTextAreaElement>) => void;
}

/**
 * Makes a textarea convert Latin keystrokes to Cyrillic as they are typed.
 * `mode` is the target script, or 'latin' for no conversion.
 */
export function useLiveInput(text: string, setText: (text: string) => void, mode: Mode) {
  const areaRef = useRef<HTMLTextAreaElement>(null);
  const pendingRef = useRef(''); // Latin letters at the end that may still combine
  const caretRef = useRef<number | null>(null);

  // Controlled textareas jump the caret to the end when we rewrite their value; put it back.
  useLayoutEffect(() => {
    if (caretRef.current !== null && areaRef.current) {
      areaRef.current.setSelectionRange(caretRef.current, caretRef.current);
      caretRef.current = null;
    }
  }, [text]);

  function onChange(e: ChangeEvent<HTMLTextAreaElement>) {
    const next = e.target.value;
    if (mode === 'latin') {
      setText(next);
      return;
    }

    const caret = e.target.selectionStart;
    const rest = next.slice(caret); // text after the caret is untouched by typing
    const oldHead = text.slice(0, text.length - rest.length);
    const newHead = next.slice(0, caret);

    let p = 0;
    while (p < oldHead.length && p < newHead.length && oldHead[p] === newHead[p]) {
      p++;
    }
    const removed = oldHead.slice(p);
    const inserted = newHead.slice(p);

    // Letters can only combine when we append at the very end without replacing anything.
    const appending = rest === '' && removed === '' && p === text.length;
    let state = { text: newHead.slice(0, p), pending: appending ? pendingRef.current : '' };
    for (const ch of inserted) {
      state = typeChar(state, ch, mode);
    }

    pendingRef.current = rest === '' ? state.pending : '';
    caretRef.current = state.text.length;
    setText(state.text + rest);
  }

  // Moving the caret (or selecting) ends any half-typed combination.
  function onSelect(e: SyntheticEvent<HTMLTextAreaElement>) {
    const t = e.currentTarget;
    if (t.selectionStart !== t.value.length || t.selectionStart !== t.selectionEnd) {
      pendingRef.current = '';
    }
  }

  const bindings: TextareaBindings = { ref: areaRef, value: text, onChange, onSelect };

  return {
    bindings,
    /** Forget half-typed letters, e.g. after switching language or clearing. */
    resetPending: () => {
      pendingRef.current = '';
    },
    focus: () => areaRef.current?.focus(),
  };
}
