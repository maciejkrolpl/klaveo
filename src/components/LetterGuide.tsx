import { letterGuide, type Script } from '../transliterate';

interface Props {
  script: Script;
  /** Lower-case letter just typed; its row is highlighted. */
  active: string | null;
}

export function LetterGuide({ script, active }: Props) {
  return (
    <details className="cheatsheet">
      <summary>Letter guide</summary>
      <ul>
        {letterGuide(script).map(({ cyrillic, keys }) => (
          <li key={cyrillic} className={cyrillic === active ? 'active' : undefined}>
            <b>{cyrillic}</b>: {keys.join(', ')}
          </li>
        ))}
        <li>
          <kbd>|</kbd> keeps letters apart (z|h → зг)
        </li>
      </ul>
    </details>
  );
}
