import { letterGuide, type Script } from '../transliterate'

export function LetterGuide({ script }: { script: Script }) {
  return (
    <details className="cheatsheet">
      <summary>Letter guide</summary>
      <ul>
        {letterGuide(script).map(({ cyrillic, keys }) => (
          <li key={cyrillic}>
            <b>{cyrillic}</b>: {keys.join(', ')}
          </li>
        ))}
        <li>
          <kbd>|</kbd> keeps letters apart (z|h → зг)
        </li>
      </ul>
    </details>
  )
}
