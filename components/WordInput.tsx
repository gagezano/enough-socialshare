"use client";

import { useImperativeHandle, forwardRef, useRef, useState, useEffect } from "react";
import { maskBadWords } from "@/lib/moderation";

const ROTATING_PLACEHOLDERS = ["Chaos", "Corruption", "Violence", "ICE"];
const ROTATION_INTERVAL_MS = 4500;
const FADE_DURATION_MS = 1400;

export interface WordInputHandle {
  clear: () => void;
  focus: () => void;
}

interface WordInputProps {
  value: string;
  /** Called with (maskedValue, rawValue) so parent can moderate raw and display masked */
  onChange: (maskedValue: string, rawValue: string) => void;
  onClear?: () => void;
  disabled?: boolean;
}

const fontFamily = '"Arial Black", "Arial Bold", Arial, sans-serif';
const BASE_FONT_SIZE_PX = 24;
const MIN_FONT_SIZE_PX = 12;

const WordInput = forwardRef<WordInputHandle, WordInputProps>(function WordInput({ value, onChange, onClear, disabled }, ref) {
  const inputRef = useRef<HTMLInputElement>(null);
  const measureRef = useRef<HTMLSpanElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [previousPlaceholderIndex, setPreviousPlaceholderIndex] = useState<number | null>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [fontSizePx, setFontSizePx] = useState(BASE_FONT_SIZE_PX);

  useEffect(() => {
    if (value.trim() !== "") return;
    const id = setInterval(() => {
      setPlaceholderIndex((i) => {
        setPreviousPlaceholderIndex(i);
        return (i + 1) % ROTATING_PLACEHOLDERS.length;
      });
    }, ROTATION_INTERVAL_MS);
    return () => clearInterval(id);
  }, [value]);

  useEffect(() => {
    if (previousPlaceholderIndex === null) return;
    const t = setTimeout(() => setPreviousPlaceholderIndex(null), FADE_DURATION_MS);
    return () => clearTimeout(t);
  }, [previousPlaceholderIndex, placeholderIndex]);

  useEffect(() => {
    const measure = measureRef.current;
    const container = containerRef.current;
    if (!measure || !container) return;
    const containerWidth = container.clientWidth;
    const textWidth = measure.scrollWidth;
    if (textWidth <= 0 || containerWidth <= 0) {
      setFontSizePx(BASE_FONT_SIZE_PX);
      return;
    }
    if (textWidth <= containerWidth) {
      setFontSizePx(BASE_FONT_SIZE_PX);
      return;
    }
    const scale = containerWidth / textWidth;
    const newSize = Math.max(MIN_FONT_SIZE_PX, Math.floor(BASE_FONT_SIZE_PX * scale));
    setFontSizePx(newSize);
  }, [value]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const ro = new ResizeObserver(() => {
      const measure = measureRef.current;
      if (!measure || !containerRef.current) return;
      const containerWidth = containerRef.current.clientWidth;
      const textWidth = measure.scrollWidth;
      if (textWidth <= 0 || containerWidth <= 0) {
        setFontSizePx(BASE_FONT_SIZE_PX);
        return;
      }
      if (textWidth <= containerWidth) {
        setFontSizePx(BASE_FONT_SIZE_PX);
        return;
      }
      const scale = containerWidth / textWidth;
      const newSize = Math.max(MIN_FONT_SIZE_PX, Math.floor(BASE_FONT_SIZE_PX * scale));
      setFontSizePx(newSize);
    });
    ro.observe(container);
    return () => ro.disconnect();
  }, []);

  useImperativeHandle(ref, () => ({
    clear: () => {
      onClear?.();
      inputRef.current?.focus();
    },
    focus: () => inputRef.current?.focus(),
  }));

  const showPlaceholder = value.trim() === "" && !isFocused;
  const showClear = value.trim() !== "" && onClear;

  const handleClearClick = () => {
    onClear?.();
    inputRef.current?.focus();
  };

  const textStyle = {
    fontFamily,
    fontSize: `${fontSizePx}px`,
    fontWeight: "bold" as const,
    letterSpacing: "-1px",
    textTransform: "uppercase" as const,
  };

  return (
    <div className="flex flex-col gap-0">
      <div ref={containerRef} className="relative">
        <span
          ref={measureRef}
          aria-hidden
          className="pointer-events-none absolute left-0 top-0 whitespace-nowrap opacity-0"
          style={{
            fontFamily,
            fontSize: `${BASE_FONT_SIZE_PX}px`,
            fontWeight: "bold",
            letterSpacing: "-1px",
            textTransform: "uppercase",
            paddingTop: "8px",
            paddingBottom: "2px",
          }}
        >
          {value || "W"}
        </span>
        {showPlaceholder && (
          <>
            {previousPlaceholderIndex !== null && (
              <span
                key={`out-${previousPlaceholderIndex}`}
                className="placeholder-fade-out pointer-events-none absolute left-0 top-0 pt-2 pb-0.5 font-bold uppercase tracking-[-1px] text-gray-400"
                style={{ ...textStyle, color: "rgb(156 163 175)" }}
                aria-hidden
              >
                {ROTATING_PLACEHOLDERS[previousPlaceholderIndex]}
              </span>
            )}
            <span
              key={`in-${placeholderIndex}`}
              className="placeholder-fade-in pointer-events-none absolute left-0 top-0 pt-2 pb-0.5 font-bold uppercase tracking-[-1px] text-gray-400"
              style={{ ...textStyle, color: "rgb(156 163 175)" }}
              aria-hidden
            >
              {ROTATING_PLACEHOLDERS[placeholderIndex]}
            </span>
          </>
        )}
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => {
            const raw = e.target.value;
            onChange(maskBadWords(raw), raw);
          }}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder=" "
          maxLength={28}
          disabled={disabled}
          className={`w-full border-0 border-b-2 border-gray-300 bg-transparent pt-2 pb-0.5 font-bold uppercase tracking-[-1px] text-[#0056AE] focus:border-b-[#0056AE] focus:outline-none disabled:opacity-50 ${showClear ? "pr-9" : "px-0"}`}
          style={{ ...textStyle, color: "#0056AE" }}
          aria-label="Enter a word"
        />
        {showClear && (
          <button
            type="button"
            onClick={handleClearClick}
            className="absolute right-0 top-1/2 flex h-10 w-9 -translate-y-1/2 items-center justify-center text-black transition hover:opacity-70 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-0"
            aria-label="Clear input"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="square" strokeLinejoin="miter" d="M6 6l12 12M6 18L18 6" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
});

export default WordInput;
