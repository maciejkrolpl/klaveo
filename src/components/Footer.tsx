import { analyticsAvailable } from '../analytics'

interface Props {
  onAnalyticsSettings: () => void
}

export function Footer({ onAnalyticsSettings }: Props) {
  return (
    <footer>
      The text you type never leaves your browser. Your theme and language are remembered on this
      device, and so is your text if “Save text on reload” is ticked.
      {analyticsAvailable && (
        <>
          {' '}
          If you accept, Google Analytics counts page views and language/theme choices.{' '}
          <button className="link" onClick={onAnalyticsSettings}>
            Analytics settings
          </button>
        </>
      )}
    </footer>
  )
}
