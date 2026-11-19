import { useEffect } from 'react'
import { MODE_IDS, type Mode } from '../config'

/** Esc cycles through the modes in tab order (be → uk → latin → be). */
export function useModeShortcut(mode: Mode, onChange: (mode: Mode) => void) {
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key !== 'Escape' || e.repeat || e.isComposing) {
        return
      }
      e.preventDefault()
      onChange(MODE_IDS[(MODE_IDS.indexOf(mode) + 1) % MODE_IDS.length])
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [mode, onChange])
}
