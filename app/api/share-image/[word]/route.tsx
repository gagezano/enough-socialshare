import { ImageResponse } from "next/og";
import { getShareImageSize } from "@/lib/share-image-sizes";

export const runtime = "edge";

const REFERENCE_SIZE = 1080; // design is for a 1080x1080 square
const FONT_STACKED_REF = 100;
const FONT_SINGLE_REF = 120;
const LOGO_SIZE_REF = 160;
const RIGHT_MARGIN_REF = 80;
const GAP_REF = 12;

export async function GET(
  request: Request,
  context: { params: Promise<{ word: string }> }
) {
  const { word } = await context.params;
  const { searchParams } = new URL(request.url);
  const sizeParam = searchParams.get("size");

  const { width, height } = getShareImageSize(sizeParam);
  const contentSize = Math.min(width, height);
  const scale = contentSize / REFERENCE_SIZE;

  const fontSizeStacked = Math.round(FONT_STACKED_REF * scale);
  const fontSizeSingle = Math.round(FONT_SINGLE_REF * scale);
  const logoSize = Math.round(LOGO_SIZE_REF * scale);
  const rightMargin = Math.round(RIGHT_MARGIN_REF * scale);
  const gap = Math.round(GAP_REF * scale);

  const displayWord = decodeURIComponent(word || "").toUpperCase();
  const words = displayWord.split(/\s+/).filter(Boolean);

  const baseUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "white",
          position: "relative",
        }}
      >
        <div
          style={{
            width: contentSize,
            height: contentSize,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
          }}
        >
          {words.length >= 2 && words.length <= 8 ? (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap,
              }}
            >
              {words.map((w) => (
                <div
                  key={w}
                  style={{
                    fontSize: fontSizeStacked,
                    fontWeight: 900,
                    color: "black",
                    fontFamily: "system-ui, sans-serif",
                    letterSpacing: "-1px",
                    lineHeight: 1,
                  }}
                >
                  {w}
                </div>
              ))}
            </div>
          ) : (
            <div
              style={{
                fontSize: fontSizeSingle,
                fontWeight: 900,
                color: "black",
                fontFamily: "system-ui, sans-serif",
                letterSpacing: "-1px",
              }}
            >
              {displayWord || "ENOUGH"}
            </div>
          )}
          <img
            src={`${baseUrl}/logo.svg`}
            alt=""
            width={logoSize}
            height={logoSize}
            style={{
              position: "absolute",
              right: rightMargin,
              top: "30%",
            }}
          />
        </div>
      </div>
    ),
    { width, height }
  );
}
