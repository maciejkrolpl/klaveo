import { analyticsAvailable, track } from './analytics';
import { ConsentBanner } from './components/ConsentBanner';
import { Editor } from './components/Editor';
import { Footer } from './components/Footer';
import { LanguageTabs } from './components/LanguageTabs';
import { LetterGuide } from './components/LetterGuide';
import { ThemeSwitch } from './components/ThemeSwitch';
import { MODE_IDS, MODES, type Mode, type Theme } from './config';
import { useAnalyticsConsent } from './hooks/useAnalyticsConsent';
import { usePersistedChoice } from './hooks/usePersistedChoice';
import { useLiveInput } from './hooks/useLiveInput';
import { useModeShortcut } from './hooks/useModeShortcut';
import { useSavedText } from './hooks/useSavedText';
import { useTheme } from './hooks/useTheme';
import { MODE_KEY } from './storage';
import { transliterate } from './transliterate';
import './App.css';

export default function App() {
  const [mode, setMode] = usePersistedChoice<Mode>(MODE_KEY, MODE_IDS, 'be');
  const [theme, setTheme] = useTheme();
  const { text, setText, saveText, setSaveText } = useSavedText();
  const input = useLiveInput(text, setText, mode);
  const consent = useAnalyticsConsent();

  function changeTheme(next: Theme) {
    setTheme(next);
    track('theme_change', { theme: next });
  }

  function changeMode(next: Mode) {
    setMode(next);
    track('mode_change', { mode: next });
    input.resetPending();
    input.focus();
  }

  useModeShortcut(mode, changeMode);

  // Converts Latin text that is already in the box (e.g. typed in Latin mode). Cyrillic stays as is.
  const converted = mode === 'latin' ? text : transliterate(text, mode);

  function convert() {
    setText(converted);
    input.resetPending();
    input.focus();
  }

  function clear() {
    setText('');
    input.resetPending();
    input.focus();
  }

  return (
    <main className="app" data-mode={mode}>
      <ThemeSwitch theme={theme} onChange={changeTheme} />

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
        onConvert={convert}
        canConvert={converted !== text}
      />

      {mode !== 'latin' && <LetterGuide script={mode} active={input.lastLetter} />}

      <Footer onAnalyticsSettings={consent.reopen} />

      {analyticsAvailable && consent.needsChoice && (
        <ConsentBanner onAccept={consent.accept} onDecline={consent.decline} />
      )}
    </main>
  );
}
