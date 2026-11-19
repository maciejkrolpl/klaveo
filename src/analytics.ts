// Google Analytics (via Firebase). Nothing is loaded or sent until the visitor clicks Accept.
// Only page views and the language/theme choices are tracked – never the typed text.
import type { Analytics } from 'firebase/analytics'

// Firebase console > Project settings > Your apps > Web app > SDK setup and configuration.
// These values are public by design (they ship in every Firebase web app).
const firebaseConfig = {
  apiKey: 'AIzaSyAmc4TWGAUE_rjGqTwB48AMzI034boUEXc',
  authDomain: 'getklaveo.firebaseapp.com',
  projectId: 'getklaveo',
  storageBucket: 'getklaveo.firebasestorage.app',
  messagingSenderId: '1000141068255',
  appId: '1:1000141068255:web:f65be715daf2707248d66a',
  measurementId: 'G-VVR7NZGTEL',
}

// Only the live site reports to this property, so local dev, clones and forks never do.
// (A fork that wants its own analytics: replace the config above and these hosts.)
const ANALYTICS_HOSTS = ['getklaveo.web.app', 'getklaveo.firebaseapp.com']

/** False off the live site or without a config; the consent banner then stays hidden. */
export const analyticsAvailable =
  ANALYTICS_HOSTS.includes(location.hostname) &&
  Boolean(firebaseConfig.appId && firebaseConfig.measurementId)

type Started = { analytics: Analytics; sdk: typeof import('firebase/analytics') }
let started: Promise<Started | null> | null = null

async function start(): Promise<Started | null> {
  try {
    const [{ initializeApp }, sdk] = await Promise.all([
      import('firebase/app'),
      import('firebase/analytics'),
    ])
    if (!(await sdk.isSupported())) {
      return null
    }
    const analytics = sdk.initializeAnalytics(initializeApp(firebaseConfig), {
      config: { allow_google_signals: false, allow_ad_personalization_signals: false },
    })
    return { analytics, sdk }
  } catch {
    return null // blocked by an ad blocker or offline – the app works the same without it
  }
}

/** Turn collection on (loading the SDK the first time) or off. */
export function setAnalyticsEnabled(on: boolean) {
  if (!analyticsAvailable) {
    return
  }
  if (on) {
    started ??= start()
  }
  started?.then((s) => s?.sdk.setAnalyticsCollectionEnabled(s.analytics, on))
}

/** Record an event; does nothing unless the visitor has accepted. */
export function track(name: string, params?: Record<string, string>) {
  started?.then((s) => s?.sdk.logEvent(s.analytics, name, params))
}
