/**
 * Blocklist for hate speech, slurs, spam patterns, and known abuse phrases.
 * Extend these arrays as needed for your use case.
 */

// Hate speech, slurs, and common profanity - word-boundary matched (case-insensitive)
export const BLOCKED_TERMS = [
  // Profanity (safety net alongside obscenity package)
  "shit",
  "fuck",
  "fucking",
  "bitch",
  "ass",
  "damn",
  "crap",
  "dick",
  "cock",
  "pussy",
  "cunt",
  "whore",
  "slut",
  "bastard",
  "bullshit",
  "motherfucker",
  "motherfucking",
  "wtf",
  // Hate speech and slurs
  "nigger",
  "nigga",
  "faggot",
  "fag",
  "tranny",
  "retard",
  "retarded",
  "chink",
  "gook",
  "kike",
  "spic",
  "wetback",
  "beaner",
  "paki",
  "raghead",
  "towelhead",
  "sandnigger",
  "nignog",
  "coon",
  "darkie",
  "negro",
  "fagot",
  "dyke",
  "homo",
  "heeb",
  "tard",
  "mong",
  "mongoloid",
  "subhuman",
  "untermensch",
];

// Spam and abuse phrase patterns (matched anywhere, case-insensitive)
export const BLOCKED_PATTERNS = [
  /\b(click here|buy now|free money|make money fast)\b/i,
  /\b(dm me|message me|hit me up)\b/i,
  /\b(follow me|add me|subscribe)\b/i,
  /(http|https|www\.|\.com|\.net|\.org)/i,
  /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/, // email
  /\b(scam|fraud|phishing)\b/i,
  /\b(illegal|drugs|pills)\b/i,
  /(.)\1{4,}/, // 5+ repeated chars (e.g. "aaaaa")
  /(\b\w+\b)(\s+\1){2,}/, // same word repeated 3+ times
];

export function isBlockedByPatterns(input: string): boolean {
  for (const term of BLOCKED_TERMS) {
    const regex = new RegExp(`\\b${term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "i");
    if (regex.test(input)) return true;
  }
  for (const pattern of BLOCKED_PATTERNS) {
    if (pattern.test(input)) return true;
  }
  return false;
}

/** Returns ranges [start, end] (inclusive) for masking — only the minimal offensive part (e.g. "shit" in "Bullshit"). */
export function getBlocklistMatchRanges(input: string): { start: number; end: number }[] {
  const allMatches: { start: number; end: number }[] = [];
  const escaped = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  // Find all substring matches (no word boundary) so we can match "shit" inside "Bullshit"
  for (const term of BLOCKED_TERMS) {
    const regex = new RegExp(escaped(term), "gi");
    let m: RegExpExecArray | null;
    while ((m = regex.exec(input)) !== null) {
      allMatches.push({ start: m.index, end: m.index + m[0].length - 1 });
    }
  }
  // Prefer shortest matches so we only mask the curse part (e.g. "shit" not "bullshit")
  allMatches.sort((a, b) => a.end - a.start - (b.end - b.start));
  const result: { start: number; end: number }[] = [];
  for (const r of allMatches) {
    const overlaps = result.some(
      (existing) => !(r.end < existing.start || r.start > existing.end)
    );
    if (!overlaps) result.push(r);
  }
  return result;
}
