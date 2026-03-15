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
  /** Called with (maskedValue, rawValue) so parent can update preview; input keeps its own value */
  onChange: (maskedValue: string, rawValue: string) => void;
  onClear?: () => void;
  disabled?: boolean;
}

const fontFamily = '"Arial Black", "Arial Bold", Arial, sans-serif';
const BASE_FONT_SIZE_PX = 24;
const MIN_FONT_SIZE_PX = 12;

const WordInput = forwardRef<WordInputHandle, WordInputProps>(function WordInput({ onChange, onClear, disabled }, ref) {
  const inputRef = useRef<HTMLInputElement>(null);
  const measureRef = useRef<HTMLSpanElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [localValue, setLocalValue] = useState("");
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [previousPlaceholderIndex, setPreviousPlaceholderIndex] = useState<number | null>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [fontSizePx, setFontSizePx] = useState(BASE_FONT_SIZE_PX);

  useEffect(() => {
    if (localValue.trim() !== "") return;
    const id = setInterval(() => {
      setPlaceholderIndex((i) => {
        setPreviousPlaceholderIndex(i);
        return (i + 1) % ROTATING_PLACEHOLDERS.length;
      });
    }, ROTATION_INTERVAL_MS);
    return () => clearInterval(id);
  }, [localValue]);

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
  }, [localValue]);

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
      setLocalValue("");
      onClear?.();
      inputRef.current?.focus();
    },
    focus: () => inputRef.current?.focus(),
  }), [onClear]);

  const hasValue = localValue.trim().length > 0;
  const showPlaceholder = !hasValue && !isFocused;
  const showClear = hasValue && onClear;

  const handleClearClick = () => {
    setLocalValue("");
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
          className="pointer-events-none absolute left-0 top-0 z-0 whitespace-nowrap opacity-0"
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
          {localValue || "W"}
        </span>
        {showPlaceholder ? (
          <div className="pointer-events-none absolute left-0 top-0 z-0" aria-hidden>
            {previousPlaceholderIndex !== null && (
              <span
                key={`out-${previousPlaceholderIndex}`}
                className="placeholder-fade-out block pt-2 pb-0.5 font-bold uppercase tracking-[-1px] text-gray-400"
                style={{ ...textStyle, color: "rgb(156 163 175)" }}
              >
                {ROTATING_PLACEHOLDERS[previousPlaceholderIndex]}
              </span>
            )}
            <span
              key={`in-${placeholderIndex}`}
              className="placeholder-fade-in block pt-2 pb-0.5 font-bold uppercase tracking-[-1px] text-gray-400"
              style={{ ...textStyle, color: "rgb(156 163 175)" }}
            >
              {ROTATING_PLACEHOLDERS[placeholderIndex]}
            </span>
          </div>
        ) : null}
        <input
          ref={inputRef}
          type="text"
          value={localValue}
          onChange={(e) => {
            const raw = e.target.value;
            const masked = maskBadWords(raw);
            setLocalValue(masked);
            onChange(masked, raw);
          }}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder=" "
          maxLength={28}
          disabled={disabled}
          className={`relative z-10 w-full border-0 border-b-2 border-gray-300 bg-transparent pt-2 pb-0.5 font-bold uppercase tracking-[-1px] text-[#0056AE] focus:border-b-[#0056AE] focus:outline-none disabled:opacity-50 ${showClear ? "pr-9" : "px-0"}`}
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
