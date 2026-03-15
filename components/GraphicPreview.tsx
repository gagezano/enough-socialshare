"use client";

import { useRef, useEffect, useCallback } from "react";

const WIDTH = 1080;
const HEIGHT = 1080;

interface GraphicPreviewProps {
  word: string;
  onImageReady?: (dataUrl: string) => void;
}

export default function GraphicPreview({ word, onImageReady }: GraphicPreviewProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const logoRef = useRef<HTMLImageElement | null>(null);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(2, typeof window !== "undefined" ? window.devicePixelRatio : 1);
    canvas.width = WIDTH * dpr;
    canvas.height = HEIGHT * dpr;
    canvas.style.width = `${WIDTH}px`;
    canvas.style.height = `${HEIGHT}px`;
    ctx.scale(dpr, dpr);

    // White background
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, WIDTH, HEIGHT);

    // Draw word(s) - Arial Black, -6px letter spacing
    const displayText = word.toUpperCase();
    const words = displayText.split(/\s+/).filter(Boolean);
    const isStacked = words.length >= 2 && words.length <= 8;

    const fontSize = 280;
    ctx.font = `bold ${fontSize}px "Arial Black", "Arial Bold", Arial, sans-serif`;
    ctx.letterSpacing = "-6px";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "#000000";

    let scale: number;
    let textWidth: number;
    let textHeight: number;

    ctx.save();
    ctx.translate(WIDTH / 2, HEIGHT / 2 + 28);

    if (isStacked) {
      const lineHeight = fontSize * 0.86;
      const gap = fontSize * 0.01;

      const allLayouts: string[][] = [];
      const generate = (start: number, linesSoFar: string[][]) => {
        if (start === words.length && linesSoFar.length >= 2 && linesSoFar.length <= 8) {
          allLayouts.push(linesSoFar.map((line) => line.join(" ")));
          return;
        }
        if (start >= words.length || linesSoFar.length >= 8) return;
        for (let end = start + 1; end <= words.length; end++) {
          generate(end, [...linesSoFar, words.slice(start, end)]);
        }
      };
      generate(0, []);

      let bestLines: string[] = words.map((w) => w);
      let bestMaxWidth = Math.max(...words.map((w) => ctx.measureText(w).width));
      for (const lines of allLayouts) {
        const maxW = Math.max(...lines.map((s) => ctx.measureText(s).width));
        if (maxW < bestMaxWidth || (maxW === bestMaxWidth && lines.length < bestLines.length)) {
          bestMaxWidth = maxW;
          bestLines = lines;
        }
      }

      textWidth = bestMaxWidth;
      textHeight = bestLines.length * lineHeight + (bestLines.length - 1) * gap;
      const scaleW = (WIDTH * 1.08) / bestMaxWidth;
      const scaleH = (HEIGHT * 1.08) / textHeight;
      scale = Math.min(scaleW, scaleH);

      ctx.scale(scale, scale);
      // Center block at origin: first line at -textHeight/2 + lineHeight/2
      const startY = -textHeight / 2 + lineHeight / 2;
      bestLines.forEach((line, i) => {
        ctx.fillText(line, 0, startY + i * (lineHeight + gap));
      });
    } else {
      const singleLine = words.join(" ") || displayText;
      textWidth = ctx.measureText(singleLine).width;
      textHeight = fontSize;
      const scaleW = (WIDTH * 1.08) / textWidth;
      const scaleH = (HEIGHT * 1.08) / textHeight;
      scale = Math.min(scaleW, scaleH);
      ctx.scale(scale, scale);
      ctx.fillText(singleLine, 0, 0);
    }

    ctx.restore();

    // Logo on top line of text, fixed right inset (same placement for one line or multi)
    const logo = logoRef.current;
    const scaledTextH = textHeight * scale;
    const textTopY = HEIGHT / 2 + 28 - scaledTextH / 2;
    const logoSize = 160;
    const marginRight = 80;
    const overlapFromTop = 85;
    const logoX = WIDTH - marginRight - logoSize; // always same inset from right edge
    const logoY = textTopY - logoSize + overlapFromTop; // always on top line with same overlap

    if (logo && logo.complete && logo.naturalWidth > 0) {
      ctx.drawImage(logo, logoX, logoY, logoSize, logoSize);
    } else {
      ctx.font = `bold ${logoSize * 0.4}px "Arial Black", Arial, sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillStyle = "#000000";
      ctx.fillText("E", logoX + logoSize / 2, logoY + logoSize / 2);
    }

    // 10px black border (part of the image for sharing)
    ctx.strokeStyle = "#000000";
    ctx.lineWidth = 10;
    ctx.strokeRect(5, 5, WIDTH - 10, HEIGHT - 10);

    if (onImageReady) {
      onImageReady(canvas.toDataURL("image/png"));
    }
  }, [word, onImageReady]);

  useEffect(() => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      logoRef.current = img;
      draw();
    };
    const tryFallback = () => {
      img.onerror = () => {
        logoRef.current = null;
        draw();
      };
      img.src = "/logo.svg";
    };
    img.onerror = tryFallback;
    img.src = "/logo.png";
  }, [draw]);

  useEffect(() => {
    draw();
  }, [draw]);

  return (
    <div className="flex justify-center">
      <canvas
        ref={canvasRef}
        width={WIDTH}
        height={HEIGHT}
        className="max-w-full"
        style={{ maxWidth: "min(40vh, 360px)", maxHeight: "min(40vh, 360px)", width: "auto", height: "auto" }}
        aria-label={`Preview graphic showing the word ${word}`}
      />
    </div>
  );
}
