export type Script = 'uk' | 'be';

type Rule = readonly [latin: string, cyrillic: string];

// Longest match wins, so "szcz" is tried before "sz", which is tried before "s".
// Hand-grouped layout: kept as is.
// oxfmt-ignore
const COMMON: Rule[] = [
  ['a', 'а'], ['b', 'б'], ['c', 'ц'], ['d', 'д'], ['f', 'ф'], ['j', 'й'],
  ['k', 'к'], ['l', 'л'], ['m', 'м'], ['n', 'н'], ['o', 'о'], ['p', 'п'],
  ['r', 'р'], ['s', 'с'], ['t', 'т'], ['u', 'у'], ['v', 'в'], ['x', 'х'],
  ['z', 'з'],
  ['zh', 'ж'], ['kh', 'х'], ['ch', 'ч'], ['sh', 'ш'],
  // Polish-style digraphs
  ['cz', 'ч'], ['sz', 'ш'], ['dz', 'дз'], ['dzh', 'дж'],
  // iotated vowels
  ['ia', 'я'], ['ya', 'я'], ['ja', 'я'],
  ['iu', 'ю'], ['yu', 'ю'], ['ju', 'ю'],
  ["'", 'ь'], ['`', '’'],
];

// oxfmt-ignore
export const RULES: Record<Script, Rule[]> = {
  uk: [
    ...COMMON,
    ['e', 'е'], ['g', 'ґ'], ['h', 'г'], ['i', 'і'], ['w', 'щ'], ['y', 'и'],
    ['sch', 'щ'], ['szcz', 'щ'],
    ['ie', 'є'], ['ye', 'є'], ['je', 'є'], ['yi', 'ї'], ['ji', 'ї'], ['ii', 'ї'],
    ['io', 'йо'], ['yo', 'йо'], ['jo', 'йо'],
  ],
  be: [
    ...COMMON,
    ['e', 'е'], ['g', 'г'], ['h', 'г'], ['i', 'і'], ['w', 'ў'], ['y', 'ы'],
    ['eh', 'э'], ['io', 'ё'], ['yo', 'ё'], ['jo', 'ё'],
  ],
};

const ALPHABETS: Record<Script, string> = {
  uk: 'абвгґдеєжзиіїйклмнопрстуфхцчшщьюя’',
  be: 'абвгдеёжзійклмнопрстуўфхцчшыьэюя’',
};

/**
 * Letter guide: one entry per Cyrillic letter with the Latin keys that produce it,
 * ordered by the target language's alphabet. Rules that output several letters
 * (дз, дж, йо) are left out.
 */
export function letterGuide(script: Script): { cyrillic: string; keys: string[] }[] {
  const groups = new Map<string, string[]>();
  for (const [latin, cyr] of RULES[script]) {
    if (cyr.length !== 1) {
      continue;
    }
    groups.set(cyr, [...(groups.get(cyr) ?? []), latin]);
  }
  const order = (c: string) => {
    const i = ALPHABETS[script].indexOf(c);
    return i === -1 ? Infinity : i;
  };
  return [...groups]
    .sort(([a], [b]) => order(a) - order(b))
    .map(([cyrillic, keys]) => ({
      cyrillic,
      keys: keys.sort((a, b) => a.length - b.length || a.localeCompare(b)),
    }));
}

const MAX_LEN = 4;
/** Type it to stop two letters from combining, e.g. z|h -> зг */
export const SEPARATOR = '|';

const tables = Object.fromEntries(
  (Object.keys(RULES) as Script[]).map((s) => [s, new Map(RULES[s])]),
) as Record<Script, Map<string, string>>;

function matchCase(source: string, out: string): string {
  if (source === source.toLowerCase()) {
    return out; // not a cased letter
  }
  if (source.length > 1 && source === source.toUpperCase()) {
    return out.toUpperCase();
  }
  if (source[0] !== source[0].toLowerCase()) {
    return out[0].toUpperCase() + out.slice(1);
  }
  return out;
}

interface Token {
  src: string;
  out: string;
}

function tokenize(text: string, script: Script): Token[] {
  const table = tables[script];
  const lower = text.toLowerCase();
  const tokens: Token[] = [];
  let i = 0;

  while (i < text.length) {
    if (text[i] === SEPARATOR) {
      tokens.push({ src: SEPARATOR, out: '' });
      i++;
      continue;
    }
    let len = Math.min(MAX_LEN, text.length - i);
    for (; len >= 1; len--) {
      if (table.has(lower.slice(i, i + len))) {
        break;
      }
    }
    if (len >= 1) {
      const src = text.slice(i, i + len);
      tokens.push({ src, out: matchCase(src, table.get(lower.slice(i, i + len))!) });
      i += len;
    } else {
      tokens.push({ src: text[i], out: text[i] });
      i++;
    }
  }
  return tokens;
}

export function transliterate(text: string, script: Script): string {
  return tokenize(text, script)
    .map((t) => t.out)
    .join('');
}

/** True if `src` could still grow into a longer rule (e.g. "s" -> "sz" -> "szcz"). */
function canExtend(src: string, script: Script): boolean {
  const lower = src.toLowerCase();
  return RULES[script].some(([key]) => key.length > lower.length && key.startsWith(lower));
}

export interface TypingState {
  /** Text shown in the box up to the caret. */
  text: string;
  /** Latin keystrokes at the end of `text` that might still combine with the next letter. */
  pending: string;
}

/**
 * Apply one typed character at the end of `state.text`.
 * Re-reads the pending Latin letters together with the new one, so "s" + "h" turns
 * the already shown "с" into "ш".
 */
export function typeChar(state: TypingState, ch: string, script: Script): TypingState {
  let { text, pending } = state;
  let shown = transliterate(pending, script);
  if (!text.endsWith(shown)) {
    pending = '';
    shown = '';
  }
  const stem = text.slice(0, text.length - shown.length);
  const tokens = tokenize(pending + ch, script);

  let nextPending = '';
  for (let k = 0; k < tokens.length; k++) {
    const candidate = tokens
      .slice(k)
      .map((t) => t.src)
      .join('');
    if (canExtend(candidate, script)) {
      nextPending = candidate;
      break;
    }
  }
  return { text: stem + tokens.map((t) => t.out).join(''), pending: nextPending };
}
