"use client";

import { useState, useEffect, useCallback } from "react";
import { Turnstile } from "@marsidev/react-turnstile";

const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

interface VerifyGateProps {
  word: string;
  captchaVerified: boolean;
  onVerified: () => void;
  onVerificationFailed: (reason: string) => void;
  children: React.ReactNode;
}

export default function VerifyGate({
  word,
  captchaVerified,
  onVerified,
  onVerificationFailed,
  children,
}: VerifyGateProps) {
  const [generationAllowed, setGenerationAllowed] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  const verifyWithApi = useCallback(
    async (token?: string) => {
      if (isVerifying) return;
      setIsVerifying(true);
      onVerificationFailed("");
      try {
        const res = await fetch("/api/verify-generation", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(token ? { token } : {}),
        });
        const data = (await res.json()) as { allowed?: boolean; reason?: string };
        if (data.allowed) {
          setGenerationAllowed(true);
          onVerified();
        } else {
          setGenerationAllowed(false);
          onVerificationFailed(data.reason || "Verification failed.");
        }
      } catch {
        setGenerationAllowed(false);
        onVerificationFailed("Verification failed.");
      } finally {
        setIsVerifying(false);
      }
    },
    [isVerifying, onVerified, onVerificationFailed]
  );

  const skipCaptcha = !TURNSTILE_SITE_KEY;
  const needsRateLimitCheck = captchaVerified || skipCaptcha;

  useEffect(() => {
    if (!word) {
      setGenerationAllowed(false);
      return;
    }
    if (skipCaptcha) {
      // No Turnstile: show preview immediately (don't call API so a failure can't hide the preview)
      setGenerationAllowed(true);
      return;
    }
    if (needsRateLimitCheck) {
      verifyWithApi();
    }
  }, [word, needsRateLimitCheck, skipCaptcha]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleTurnstileSuccess = useCallback(
    (token: string) => {
      verifyWithApi(token);
    },
    [verifyWithApi]
  );

  if (!word) return null;

  if (!skipCaptcha && !captchaVerified) {
    return (
      <section className="mb-8">
        <p className="mb-3 text-2xl font-bold uppercase tracking-[-1px] text-black md:text-3xl">
          Verify you&apos;re human to continue
        </p>
        <div className="flex justify-start">
          <Turnstile
            siteKey={TURNSTILE_SITE_KEY}
            onSuccess={handleTurnstileSuccess}
            options={{
              theme: "light",
              size: "normal",
            }}
          />
        </div>
        {isVerifying && (
          <p className="mt-2 text-sm text-gray-500">Verifying...</p>
        )}
      </section>
    );
  }

  if (!generationAllowed) {
    if (isVerifying) {
      return (
        <section className="mb-8 text-2xl font-bold uppercase tracking-[-1px] text-gray-400 md:text-3xl">
          Verifying...
        </section>
      );
    }
    return null;
  }

  return <>{children}</>;
}
