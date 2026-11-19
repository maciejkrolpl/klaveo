import { useEffect } from 'react'
import { THEME_IDS, type Theme } from '../config'
import { THEME_KEY } from '../storage'
import { usePersistedChoice } from './usePersistedChoice'

export function useTheme() {
  const [theme, setTheme] = usePersistedChoice<Theme>(THEME_KEY, THEME_IDS, 'auto')

  // "auto" removes the override so the page follows the system setting.
  useEffect(() => {
    const root = document.documentElement
    if (theme === 'auto') {
      delete root.dataset.theme
    } else {
      root.dataset.theme = theme
    }
  }, [theme])

  return [theme, setTheme] as const
}
