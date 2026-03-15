import { ImageResponse } from "next/og";

export const runtime = "edge";

export async function GET(
  request: Request,
  context: { params: Promise<{ word: string }> }
) {
  const { word } = await context.params;
  const displayWord = decodeURIComponent(word || "").toUpperCase();
  const words = displayWord.split(/\s+/).filter(Boolean);

  const baseUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  const size = 270;
  const fontSizeStacked = 25;
  const fontSizeSingle = 30;
  const logoSize = 40;
  const rightMargin = 20;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "white",
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
              gap: 3,
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
    ),
    { width: size, height: size }
  );
}
