"use client";

import { useState, useCallback, useRef } from "react";
import WordInput, { type WordInputHandle } from "@/components/WordInput";
import ModerationBanner from "@/components/ModerationBanner";
import GraphicPreview from "@/components/GraphicPreview";
import ShareButtons from "@/components/ShareButtons";
import VerifyGate from "@/components/VerifyGate";
import { moderateInput, maskBadWords } from "@/lib/moderation";

export default function Home() {
  const [inputValue, setInputValue] = useState("");
  const [word, setWord] = useState<string | null>(null);
  const [moderationError, setModerationError] = useState<string | null>(null);
  const [verifyError, setVerifyError] = useState<string | null>(null);
  const [captchaVerified, setCaptchaVerified] = useState(false);
  const [imageDataUrl, setImageDataUrl] = useState<string | null>(null);
  const inputRef = useRef<WordInputHandle>(null);

  const handleInputChange = useCallback((maskedValue: string, rawValue: string) => {
    setInputValue(maskedValue);
    setModerationError(null);
    setVerifyError(null);
    const trimmed = maskedValue.trim();
    if (!trimmed) {
      setWord(null);
      setImageDataUrl(null);
      return;
    }
    if (maskBadWords(rawValue) !== rawValue || /[#*&]/.test(trimmed)) {
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
    const result = moderateInput(rawValue);
    if (result.allowed) {
      setWord(trimmed);
    } else {
      setModerationError(result.reason ?? null);
      setWord(null);
      setImageDataUrl(null);
    }
  }, []);

  const handleClearInput = useCallback(() => {
    setInputValue("");
    setWord(null);
  }, []);

  const handleImageReady = useCallback((dataUrl: string) => {
    setImageDataUrl(dataUrl);
  }, []);

  const handleTryAgain = useCallback(() => {
    setModerationError(null);
    setVerifyError(null);
    inputRef.current?.clear();
  }, []);

  const handleVerified = useCallback(() => {
    setCaptchaVerified(true);
    setVerifyError(null);
  }, []);

  const handleVerificationFailed = useCallback((reason: string) => {
    setVerifyError(reason || null);
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
          <div className="-mt-2 w-full max-w-[min(40vh,360px)]">
            <WordInput
              ref={inputRef}
              value={inputValue}
              onChange={handleInputChange}
              onClear={handleClearInput}
            />
          </div>
        </section>

        {moderationError && (
          <section className="mb-6">
            <ModerationBanner message={moderationError} onTryAgain={handleTryAgain} />
          </section>
        )}

        {verifyError && (
          <section className="mb-6">
            <ModerationBanner
              message={verifyError}
              onTryAgain={() => {
                setVerifyError(null);
                inputRef.current?.focus();
              }}
            />
          </section>
        )}

        {word && (
          <VerifyGate
            word={word}
            captchaVerified={captchaVerified}
            onVerified={handleVerified}
            onVerificationFailed={handleVerificationFailed}
          >
            <section className="mb-8">
              <GraphicPreview word={word} onImageReady={handleImageReady} />
            </section>
            <section>
              <ShareButtons word={word} imageDataUrl={imageDataUrl} />
            </section>
          </VerifyGate>
        )}
      </div>
    </main>
  );
}
