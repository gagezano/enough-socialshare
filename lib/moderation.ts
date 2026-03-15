import { RegExpMatcher, englishDataset, englishRecommendedTransformers } from "obscenity";
import { isBlockedByPatterns, getBlocklistMatchRanges, BLOCKED_TERMS } from "./blocklist";

const matcher = new RegExpMatcher({
  ...englishDataset.build(),
  ...englishRecommendedTransformers,
});

const MAX_LENGTH = 28; // fits 1080x1080 graphic while staying readable
const MAX_WORD_LENGTH = 25;
const MIN_LENGTH = 2;

export interface ModerationResult {
  allowed: boolean;
  reason?: string;
}

export function moderateInput(input: string): ModerationResult {
  const trimmed = input.trim();

  if (!trimmed) {
    return { allowed: false, reason: "Please enter a word." };
  }

  if (trimmed.length < MIN_LENGTH) {
    return { allowed: false };
  }

  if (trimmed.length > MAX_LENGTH) {
    return { allowed: false, reason: `Please keep it under ${MAX_LENGTH} characters.` };
  }

  const words = trimmed.split(/\s+/).filter(Boolean);
  if (words.some((w) => w.length > MAX_WORD_LENGTH)) {
    return { allowed: false, reason: "Whoa, slow down there. Way too long." };
  }

  // Block repeated characters (e.g., "aaaaaaa")
  if (/^(.)\1+$/.test(trimmed)) {
    return { allowed: false, reason: "Please enter a meaningful word." };
  }

  // Block if contains only numbers or special chars
  if (!/[a-zA-Z]/.test(trimmed)) {
    // Masked curse words contain only # * & — show our bad-words message
    if (/^[#*&\s]+$/.test(trimmed)) {
      return { allowed: false, reason: "No bad words, Jack!" };
    }
    return { allowed: false, reason: "Please enter letters." };
  }

  const matches = matcher.getAllMatches(trimmed);
  if (matches.length > 0) {
    return { allowed: false, reason: "No bad words, Jack!" };
  }

  if (isBlockedByPatterns(trimmed)) {
    return { allowed: false, reason: "No bad words, Jack!" };
  }

  if (getBlocklistMatchRanges(trimmed).length > 0) {
    return { allowed: false, reason: "No bad words, Jack!" };
  }

  return { allowed: true };
}

const MASK_SYMBOLS = ["#", "*", "&"];

/** Find minimal offensive substring within [start, end] using blocklist (shortest term that appears). */
function minimalOffensiveRange(input: string, start: number, end: number): { start: number; end: number } | null {
  const sub = input.slice(start, end + 1);
  const lower = sub.toLowerCase();
  // Sort by length so we try shortest (curse part) first
  const byLength = [...BLOCKED_TERMS].sort((a, b) => a.length - b.length);
  for (const term of byLength) {
    const idx = lower.indexOf(term.toLowerCase());
    if (idx !== -1) {
      return { start: start + idx, end: start + idx + term.length - 1 };
    }
  }
  return null;
}

/**
 * Replaces only the curse part of bad words with # * & (e.g. "Bullshit" → "Bull$&%").
 * Uses both obscenity matcher and blocklist; prefers shortest matching term so
 * the rest of the word stays visible.
 */
export function maskBadWords(input: string): string {
  const obscenityMatches = matcher.getAllMatches(input, true);
  const blocklistRanges = getBlocklistMatchRanges(input);
  if (obscenityMatches.length === 0 && blocklistRanges.length === 0) return input;

  const chars = input.split("");
  const maskRange = (start: number, end: number) => {
    for (let i = start; i <= end; i++) {
      chars[i] = MASK_SYMBOLS[(i - start) % MASK_SYMBOLS.length];
    }
  };
  for (const m of obscenityMatches) {
    const minimal = minimalOffensiveRange(input, m.startIndex, m.endIndex);
    if (minimal) {
      maskRange(minimal.start, minimal.end);
    } else {
      maskRange(m.startIndex, m.endIndex);
    }
  }
  for (const r of blocklistRanges) maskRange(r.start, r.end);
  return chars.join("");
}
