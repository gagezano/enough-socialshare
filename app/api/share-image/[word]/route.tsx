import { ImageResponse } from "next/og";
import { getShareImageSize } from "@/lib/share-image-sizes";

export const runtime = "edge";

const BORDER_PX = 10;
const REFERENCE_SIZE = 1080;
const LOGO_SIZE_REF = 160;
const MARGIN_RIGHT_REF = 80;
const OVERLAP_FROM_TOP = 85;

export async function GET(
  request: Request,
  context: { params: Promise<{ word: string }> }
) {
  const { word } = await context.params;
  const { searchParams } = new URL(request.url);
  const sizeParam = searchParams.get("size");

  const { width, height } = getShareImageSize(sizeParam);
  const contentSize = Math.min(width, height) - BORDER_PX * 2;
  const scale = contentSize / REFERENCE_SIZE;

  const logoSize = Math.round(LOGO_SIZE_REF * scale);
  const rightMargin = Math.round(MARGIN_RIGHT_REF * scale);
  const logoX = contentSize - rightMargin - logoSize;
  const logoY = Math.round(contentSize * 0.5 - logoSize + OVERLAP_FROM_TOP * (scale));

  const displayWord = decodeURIComponent(word || "").toUpperCase();
  const words = displayWord.split(/\s+/).filter(Boolean);
  const isStacked = words.length >= 2 && words.length <= 8;

  const baseUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  const singleFontSize = Math.round(contentSize * 0.5);
  const stackedFontSize = Math.round(contentSize * 0.22);
  const lineHeight = 0.86;
  const gap = 0.01;

  return new ImageResponse(
    (
      <div
        style={{
          width: width,
          height: height,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "white",
          border: `${BORDER_PX}px solid black`,
          boxSizing: "border-box",
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
          {isStacked ? (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: stackedFontSize * gap * 10,
              }}
            >
              {words.map((w) => (
                <div
                  key={w}
                  style={{
                    fontSize: stackedFontSize,
                    fontWeight: 900,
                    color: "black",
                    fontFamily: "system-ui, sans-serif",
                    letterSpacing: "-2px",
                    lineHeight: lineHeight,
                  }}
                >
                  {w}
                </div>
              ))}
            </div>
          ) : (
            <div
              style={{
                fontSize: singleFontSize,
                fontWeight: 900,
                color: "black",
                fontFamily: "system-ui, sans-serif",
                letterSpacing: "-4px",
                lineHeight: 1,
              }}
            >
              {displayWord || "ENOUGH"}
            </div>
          )}

          <div
            style={{
              position: "absolute",
              right: rightMargin,
              top: logoY,
              width: logoSize,
              height: logoSize,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#0056AE",
              color: "white",
              fontSize: logoSize * 0.5,
              fontWeight: 900,
              fontFamily: "system-ui, sans-serif",
            }}
          >
            E
          </div>
          <img
            src={`${baseUrl}/logo.svg`}
            alt=""
            width={logoSize}
            height={logoSize}
            style={{
              position: "absolute",
              right: rightMargin,
              top: logoY,
            }}
          />
        </div>
      </div>
    ),
    { width, height }
  );
}
