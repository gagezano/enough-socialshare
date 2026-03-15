import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit } from "@/lib/rate-limit";

const TURNSTILE_VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const token = typeof body.token === "string" ? body.token : null;

    // If token provided, verify with Cloudflare Turnstile
    if (token) {
      const secret = process.env.CLOUDFLARE_TURNSTILE_SECRET_KEY;
      if (!secret) {
        console.warn("CLOUDFLARE_TURNSTILE_SECRET_KEY not set, skipping CAPTCHA verification");
      } else {
        const formData = new URLSearchParams();
        formData.append("secret", secret);
        formData.append("response", token);

        const res = await fetch(TURNSTILE_VERIFY_URL, {
          method: "POST",
          body: formData,
        });
        const data = (await res.json()) as { success?: boolean };
        if (!data.success) {
          return NextResponse.json(
            { allowed: false, reason: "Verification failed." },
            { status: 400 }
          );
        }
      }
    }

    // Check rate limit
    const { allowed, remaining } = checkRateLimit(request.headers);
    if (!allowed) {
      return NextResponse.json(
        { allowed: false, reason: "Too many requests. Please try again later." },
        { status: 429 }
      );
    }

    return NextResponse.json({
      allowed: true,
      remaining: remaining ?? 0,
    });
  } catch {
    return NextResponse.json(
      { allowed: false, reason: "Verification failed." },
      { status: 500 }
    );
  }
}
