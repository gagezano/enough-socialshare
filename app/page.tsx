"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import ModerationBanner from "@/components/ModerationBanner";
import GraphicPreview from "@/components/GraphicPreview";
import ShareButtons from "@/components/ShareButtons";
import { moderateInput, maskBadWords } from "@/lib/moderation";

const ROTATING_PLACEHOLDERS = ["Chaos", "Corruption", "Violence", "ICE"];
const ROTATION_INTERVAL_MS = 4500;
const FADE_DURATION_MS = 1400;

const inputFontStyle = {
  fontFamily: '"Arial Black", "Arial Bold", Arial, sans-serif',
  letterSpacing: "-1px",
};

export default function Home() {
  const [inputText, setInputText] = useState("");
  const [word, setWord] = useState<string | null>(null);
  const [moderationError, setModerationError] = useState<string | null>(null);
  const [imageDataUrl, setImageDataUrl] = useState<string | null>(null);
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [previousPlaceholderIndex, setPreviousPlaceholderIndex] = useState<number | null>(null);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputText.trim() !== "") return;
    const id = setInterval(() => {
      setPlaceholderIndex((i) => {
        setPreviousPlaceholderIndex(i);
        return (i + 1) % ROTATING_PLACEHOLDERS.length;
      });
    }, ROTATION_INTERVAL_MS);
    return () => clearInterval(id);
  }, [inputText]);

  useEffect(() => {
    if (previousPlaceholderIndex === null) return;
    const t = setTimeout(() => setPreviousPlaceholderIndex(null), FADE_DURATION_MS);
    return () => clearTimeout(t);
  }, [previousPlaceholderIndex, placeholderIndex]);

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value;
    const masked = maskBadWords(raw);
    setInputText(masked);
    setModerationError(null);
    const trimmed = masked.trim();
    if (!trimmed) {
      setWord(null);
      setImageDataUrl(null);
      return;
    }
    if (maskBadWords(raw) !== raw || /[#*&]/.test(trimmed)) {
      setModerationError("No bad words, Jack!");
      setWord(null);
      setImageDataUrl(null);
      return;
    }
    const wordCount = trimmed.split(/\s+/).filter(Boolean).length;
    if (wordCount > 8) {
      setModerationError("Maximum 8 words allowed.");
      setWord(null);
      setImageDataUrl(null);
      return;
    }
    setWord(trimmed);
    try {
      const result = moderateInput(raw);
      if (!result.allowed) {
        setModerationError(result.reason ?? null);
        setWord(null);
        setImageDataUrl(null);
      }
    } catch {
      // keep preview visible if moderation throws
    }
  }

  const handleClearInput = useCallback(() => {
    setInputText("");
    setWord(null);
    setImageDataUrl(null);
    setModerationError(null);
    inputRef.current?.focus();
  }, []);

  const handleImageReady = useCallback((dataUrl: string) => {
    setImageDataUrl(dataUrl);
  }, []);

  const handleTryAgain = useCallback(() => {
    setModerationError(null);
    setInputText("");
    setWord(null);
    setImageDataUrl(null);
    inputRef.current?.focus();
  }, []);

  return (
    <main className="min-h-screen bg-white px-4 py-12 md:py-16">
      <a
        href="https://enough2026.org"
        target="_blank"
        rel="noopener noreferrer"
        className="logo-float-hover fixed right-4 top-5 z-10 block h-[88px] w-auto"
        aria-label="Enough – go to enough2026.org"
      >
        <img src="/logo.svg" alt="Enough" className="h-[88px] w-auto" />
      </a>
      <div className="mx-auto max-w-2xl">
        <section className="mb-8 mt-[60px] flex flex-col items-center justify-center gap-y-0">
          <p className="w-full max-w-2xl shrink-0 text-center text-2xl font-bold uppercase tracking-[-1px] text-black md:text-3xl">
            I HAD ENOUGH...
          </p>
          <div className="mt-1 w-full max-w-[min(40vh,360px)]">
            <div className="relative">
              {!inputText.trim() && !isInputFocused && (
                <div
                  className="pointer-events-none absolute left-0 top-0 z-0 h-[1.2em] w-full overflow-hidden pt-0.5 pb-0 text-2xl leading-none md:text-3xl"
                  aria-hidden
                >
                  {previousPlaceholderIndex !== null && (
                    <span
                      key={`out-${previousPlaceholderIndex}`}
                      className="placeholder-fade-out absolute left-0 top-0 w-full truncate font-bold uppercase tracking-tight text-gray-400"
                      style={inputFontStyle}
                    >
                      {ROTATING_PLACEHOLDERS[previousPlaceholderIndex]}
                    </span>
                  )}
                  <span
                    key={`in-${placeholderIndex}`}
                    className="placeholder-fade-in absolute left-0 top-0 w-full truncate font-bold uppercase tracking-tight text-gray-400"
                    style={inputFontStyle}
                  >
                    {ROTATING_PLACEHOLDERS[placeholderIndex]}
                  </span>
                </div>
              )}
              <input
                ref={inputRef}
                type="text"
                value={inputText}
                onChange={handleInputChange}
                onFocus={() => setIsInputFocused(true)}
                onBlur={() => setIsInputFocused(false)}
                maxLength={28}
                placeholder=" "
                className="relative z-10 w-full border-0 border-b-2 border-gray-300 bg-transparent pt-0.5 pb-0 text-2xl font-bold uppercase tracking-tight text-[#0056AE] placeholder:text-gray-400 focus:border-b-[#0056AE] focus:outline-none md:text-3xl"
                style={inputFontStyle}
                aria-label="Enter a word"
              />
              {inputText.trim() && (
                <button
                  type="button"
                  onClick={handleClearInput}
                  className="absolute right-0 top-1/2 -translate-y-1/2 p-2 text-black hover:opacity-70"
                  aria-label="Clear"
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="square" strokeLinejoin="miter" d="M6 6l12 12M6 18L18 6" />
                  </svg>
                </button>
              )}
            </div>
          </div>
        </section>

        {moderationError && (
          <section className="mb-6">
            <ModerationBanner message={moderationError} onTryAgain={handleTryAgain} />
          </section>
        )}

        <section className="mb-8">
          {word && <GraphicPreview word={word} onImageReady={handleImageReady} />}
        </section>
        {word && (
          <section>
            <ShareButtons word={word} imageDataUrl={imageDataUrl} />
          </section>
        )}
      </div>
    </main>
  );
}
