import { useEffect, useState } from 'react';
import { load, loadRaw, remove, save, SAVE_TEXT_KEY, TEXT_KEY } from '../storage';

const FLAGS = ['1', '0'] as const;

/** The editor text, optionally kept in localStorage while "Save text on reload" is ticked. */
export function useSavedText() {
  const [saveText, setSaveText] = useState(() => load(SAVE_TEXT_KEY, FLAGS, '0') === '1');
  const [text, setText] = useState(() =>
    load(SAVE_TEXT_KEY, FLAGS, '0') === '1' ? loadRaw(TEXT_KEY) : '',
  );

  // Unticking the box also deletes any text stored earlier.
  useEffect(() => {
    save(SAVE_TEXT_KEY, saveText ? '1' : '0');
    if (saveText) {
      save(TEXT_KEY, text);
    } else {
      remove(TEXT_KEY);
    }
  }, [saveText, text]);

  return { text, setText, saveText, setSaveText };
}
