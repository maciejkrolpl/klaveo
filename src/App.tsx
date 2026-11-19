import { Editor } from './components/Editor'
import { Footer } from './components/Footer'
import { LanguageTabs } from './components/LanguageTabs'
import { LetterGuide } from './components/LetterGuide'
import { ThemeSwitch } from './components/ThemeSwitch'
import { MODE_IDS, MODES, type Mode } from './config'
import { usePersistedChoice } from './hooks/usePersistedChoice'
import { useLiveInput } from './hooks/useLiveInput'
import { useSavedText } from './hooks/useSavedText'
import { useTheme } from './hooks/useTheme'
import { MODE_KEY } from './storage'
import './App.css'

export default function App() {
  const [mode, setMode] = usePersistedChoice<Mode>(MODE_KEY, MODE_IDS, 'be')
  const [theme, setTheme] = useTheme()
  const { text, setText, saveText, setSaveText } = useSavedText()
  const input = useLiveInput(text, setText, mode)

  function changeMode(next: Mode) {
    setMode(next)
    input.resetPending()
    input.focus()
  }

  function clear() {
    setText('')
    input.resetPending()
    input.focus()
  }

  return (
    <main className="app" data-mode={mode}>
      <ThemeSwitch theme={theme} onChange={setTheme} />

      <header>
        <h1>Klaveo</h1>
        <p>Type in Latin letters – they turn into Cyrillic as you type.</p>
      </header>

      <LanguageTabs mode={mode} onChange={changeMode} />

      <Editor
        mode={mode}
        placeholder={MODES.find((m) => m.id === mode)!.placeholder}
        textarea={input.bindings}
        saveText={saveText}
        onSaveTextChange={setSaveText}
        onClear={clear}
      />

      {mode !== 'latin' && <LetterGuide script={mode} />}

      <Footer />
    </main>
  )
}
