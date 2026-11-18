# Клава (klava)

One-page web app: the user types Latin letters and they turn into Belarusian or Ukrainian Cyrillic
live in a single textarea. A third "Latin" mode does no conversion. Deployed on Netlify
(https://klava-app.netlify.app/), repo on GitHub (`maciejkrolpl/klava`, branch `main`).

## Scope and rules
- **Desktop only.** Mobile layout and phone keyboards are out of scope; don't spend effort on them.
- **Privacy:** no backend, no analytics, no network calls with user data. Anything stored goes through
  `src/storage.ts` (localStorage only). Text is stored only while "Save text on reload" is ticked.
  If you add or change a stored key, update the footer note and the README.
- No router, no login, no UI library, no Tailwind. Plain CSS in `src/App.css` and `src/index.css`.
- Keep it simple and pretty; don't add features that weren't asked for.

## Commands
- `npm run dev` – dev server (http://localhost:5173)
- `npm run build` – type-check + production build (run after changes)
- `npm run lint` – oxlint

## Code map
- `src/transliterate.ts` – mapping tables and the typing engine. **All mapping changes go here.**
  Longest match wins; `|` separates letters; case is preserved. The Letter guide is generated from
  these tables (multi-letter outputs like дз, дж, йо are hidden from it).
- `src/hooks/useLiveInput.ts` – live conversion in the textarea (caret and pending-letter handling).
  Fragile: after touching it, check typing, mid-text edits, paste and backspace in a browser.
- `src/storage.ts` – localStorage keys. `index.html` also reads `klava.theme` before first paint;
  keep the two in sync.
- `src/components/`, `src/hooks/`, `src/config.ts` – UI pieces, state hooks, tabs and theme lists.
- `public/` – favicon, `og-image.png` (link preview), `robots.txt`.
  `design/og-image.html` is the source of the preview image (regeneration command is inside it).

## Conventions
- When a mapping changes, update the key table in `README.md` by hand.
- Keep colour contrast at WCAG AA (4.5:1) in both Day and Night themes; use the `--on-accent` token
  for text on accent backgrounds.
- Line endings are LF (`.gitattributes`).
- Commits: short imperative subject. The commit identity for this repo is the personal GitHub
  noreply address; don't change it, and never push work identities or credentials.
- Check the app's output examples with `Slava Ukrajini` (uk) and `Zhyve Belarus'` (be).
