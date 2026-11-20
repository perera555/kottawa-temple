/**
 * Singlish -> Sinhala phonetic transliteration.
 *   ayubowan -> ආයුබෝවන්      budu saranai -> බුදු සරණයි (N = ණ)
 *   shrii -> ශ්‍රී              poya -> පොය
 * Helakuru-style: d=ද dh=ධ D=ඩ, t=ට th=ත T=ඨ, n=න N=ණ, l=ල L=ළ, sh=ශ Sh=ෂ, x=ං
 */

const ZWJ = "‍";
const HAL = "්"; // ්

// Independent vowel, vowel sign (after consonant)
const VOWELS: [string, string, string][] = [
  ["aee", "ඈ", "ෑ"],
  ["aae", "ඈ", "ෑ"],
  ["AA", "ඈ", "ෑ"],
  ["ae", "ඇ", "ැ"],
  ["A", "ඇ", "ැ"],
  ["aa", "ආ", "ා"],
  ["ai", "ඓ", "ෛ"],
  ["au", "ඖ", "ෞ"],
  ["a", "අ", ""],
  ["ii", "ඊ", "ී"],
  ["ie", "ඊ", "ී"],
  ["i", "ඉ", "ි"],
  ["uu", "ඌ", "ූ"],
  ["u", "උ", "ු"],
  ["ee", "ඒ", "ේ"],
  ["ea", "ඒ", "ේ"],
  ["e", "එ", "ෙ"],
  ["oo", "ඕ", "ෝ"],
  ["oe", "ඕ", "ෝ"],
  ["o", "ඔ", "ො"],
  ["Ru", "ඍ", "ෘ"],
];

// Longest keys first matter; sorted below.
const CONSONANTS: Record<string, string> = {
  nndh: "ඳ",
  nnd: "ඬ",
  nng: "ඟ",
  mmb: "ඹ",
  chh: "ඡ",
  Sh: "ෂ",
  sh: "ශ",
  kh: "ඛ",
  gh: "ඝ",
  ch: "ච",
  jh: "ඣ",
  ny: "ඤ",
  gn: "ඥ",
  Th: "ථ",
  Dh: "ඪ",
  th: "ත",
  dh: "ධ",
  ph: "ඵ",
  bh: "භ",
  k: "ක",
  g: "ග",
  c: "ච",
  j: "ජ",
  T: "ඨ",
  t: "ට",
  D: "ඩ",
  d: "ද",
  N: "ණ",
  n: "න",
  p: "ප",
  b: "බ",
  m: "ම",
  y: "ය",
  r: "ර",
  L: "ළ",
  l: "ල",
  w: "ව",
  v: "ව",
  s: "ස",
  S: "ෂ",
  h: "හ",
  f: "ෆ",
  z: "ස",
  q: "ක",
  G: "ඟ",
  B: "ඹ",
  K: "ඛ",
  P: "ඵ",
  J: "ඣ",
  C: "ඡ",
};
const CONS_KEYS = Object.keys(CONSONANTS).sort((a, b) => b.length - a.length);
const VOWEL_KEYS = [...VOWELS].sort((a, b) => b[0].length - a[0].length);

const SPECIAL: Record<string, string> = { x: "ං", H: "ඃ" };

function matchAt<T extends string>(text: string, i: number, keys: readonly T[]) {
  for (const k of keys) if (text.startsWith(k, i)) return k;
  return null;
}

export function singlishToSinhala(latin: string): string {
  let out = "";
  let i = 0;
  while (i < latin.length) {
    const ch = latin[i];
    if (SPECIAL[ch] && out) {
      out += SPECIAL[ch];
      i += 1;
      continue;
    }
    const c = matchAt(latin, i, CONS_KEYS);
    if (c) {
      i += c.length;
      out += CONSONANTS[c];
      // conjuncts: consonant + r / y  ->  ්‍ර / ්‍ය  (e.g. shrii -> ශ්‍රී, kya -> ක්‍ය)
      const next = latin[i];
      if ((next === "r" || next === "y") && c !== "r" && c !== "y" && matchAt(latin, i + 1, VOWEL_KEYS.map((v) => v[0]))) {
        out += HAL + ZWJ + CONSONANTS[next];
        i += 1;
      }
      const v = VOWEL_KEYS.find(([k]) => latin.startsWith(k, i));
      if (v) {
        out += v[2];
        i += v[0].length;
      } else {
        out += HAL;
      }
      continue;
    }
    const v = VOWEL_KEYS.find(([k]) => latin.startsWith(k, i));
    if (v) {
      out += v[1];
      i += v[0].length;
      continue;
    }
    out += ch;
    i += 1;
  }
  return out;
}
