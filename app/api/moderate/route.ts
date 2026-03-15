import { NextRequest, NextResponse } from "next/server";
import { moderateInput } from "@/lib/moderation";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const text = typeof body.text === "string" ? body.text : "";
    const result = moderateInput(text);
    return NextResponse.json(result);
  } catch {
    return NextResponse.json(
      { allowed: false, reason: "Invalid request" },
      { status: 400 }
    );
  }
}
