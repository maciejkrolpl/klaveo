import { useEffect, useState } from 'react';
import { setAnalyticsEnabled } from '../analytics';
import { ANALYTICS_KEY, load, remove, save } from '../storage';

const CHOICES = ['granted', 'denied', 'unset'] as const;
type Consent = (typeof CHOICES)[number];

/** The visitor's analytics choice, remembered in localStorage and applied to the SDK. */
export function useAnalyticsConsent() {
  const [consent, setConsent] = useState<Consent>(() => load(ANALYTICS_KEY, CHOICES, 'unset'));

  useEffect(() => {
    setAnalyticsEnabled(consent === 'granted');
    if (consent === 'unset') {
      remove(ANALYTICS_KEY);
    } else {
      save(ANALYTICS_KEY, consent);
    }
  }, [consent]);

  return {
    needsChoice: consent === 'unset',
    accept: () => setConsent('granted'),
    decline: () => setConsent('denied'),
    /** Forget the choice and ask again (collection stays off until the visitor answers). */
    reopen: () => setConsent('unset'),
  };
}
