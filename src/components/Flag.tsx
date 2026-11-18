import type { Mode } from '../config'

// Drawn as SVG because flag emoji don't render on Windows.
export function Flag({ mode }: { mode: Mode }) {
  if (mode === 'latin') return null
  const stripes =
    mode === 'be'
      ? ['#ffffff', '#cf101a', '#ffffff'] // white-red-white
      : ['#0057b8', '#ffd700'] // blue-yellow
  const h = 15 / stripes.length
  return (
    <svg className="flag" viewBox="0 0 22 15" width="22" height="15" aria-hidden="true">
      {stripes.map((fill, i) => (
        <rect key={i} x="0" y={i * h} width="22" height={h} fill={fill} />
      ))}
    </svg>
  )
}
