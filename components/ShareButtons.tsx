"use client";

import {
  getFacebookShareUrl,
  getTwitterShareUrl,
  getLinkedInShareUrl,
  getThreadsShareUrl,
  getBlueskyShareUrl,
} from "@/lib/share-urls";

interface ShareButtonsProps {
  word: string;
  imageDataUrl: string | null;
  pageUrl?: string;
}

const iconClass = "h-[32px] w-[32px] shrink-0";

function DownloadIcon({ className = iconClass }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg className={iconClass} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg className={iconClass} fill="currentColor" viewBox="0 0 24 24">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg className={iconClass} fill="currentColor" viewBox="0 0 24 24">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

function ThreadsIcon() {
  return (
    <svg className={iconClass} fill="currentColor" viewBox="0 0 24 24">
      <path d="M12.186 24h-.007c-3.581-.024-6.334-1.205-8.184-3.509C2.35 18.44 1.5 15.586 1.472 12.01v-.017c.03-3.579.879-6.43 2.525-8.482C5.845 1.205 8.6.024 12.18 0h.014c2.746.02 5.043.725 6.826 2.098 1.677 1.29 2.858 3.13 3.509 5.467l-2.04.569c-1.104-3.96-3.898-5.984-8.304-6.015-2.91.022-5.11.936-6.54 2.717C4.307 6.504 3.616 8.914 3.589 12c.027 3.086.718 5.496 2.057 7.164 1.43 1.783 3.631 2.698 6.54 2.717 2.623-.02 4.358-.631 5.8-2.045 1.647-1.613 1.618-3.593 1.09-4.798-.31-.71-.873-1.3-1.634-1.75-.192 1.352-.622 2.446-1.284 3.272-.886 1.102-2.14 1.704-3.73 1.79-1.202.065-2.361-.218-3.259-.801-1.063-.689-1.685-1.74-1.752-2.964-.065-1.19.408-2.285 1.33-3.082.88-.76 2.119-1.207 3.583-1.291a13.853 13.853 0 0 1 3.02.142c-.126-.742-.375-1.332-.75-1.757-.513-.586-1.308-.883-2.359-.89h-.029c-.844 0-1.992.232-2.721 1.32L7.734 7.847c.98-1.454 2.568-2.256 4.478-2.256h.044c3.194.02 5.097 1.975 5.287 5.388.108.046.216.094.321.142 1.49.7 2.58 1.761 3.154 3.07.797 1.82.871 4.79-1.548 7.158-1.85 1.81-4.094 2.628-7.277 2.65Zm1.003-11.69c-.242 0-.487.007-.739.021-1.836.103-2.98.946-2.916 2.143.067 1.256 1.452 1.839 2.784 1.767 1.224-.065 2.818-.543 3.086-3.71a10.5 10.5 0 0 0-2.215-.221z" />
    </svg>
  );
}

function BlueskyIcon() {
  return (
    <svg className={iconClass} viewBox="0 0 24 24" fill="currentColor">
      <path d="M5.202 2.857C7.954 4.922 10.913 9.11 12 11.358c1.087-2.247 4.046-6.436 6.798-8.501C20.783 1.366 24 .213 24 3.883c0 .732-.42 6.156-.667 7.037-.856 3.061-3.978 3.842-6.755 3.37 4.854.826 6.089 3.562 3.422 6.299-5.065 5.196-7.28-1.304-7.847-2.97-.104-.305-.152-.448-.153-.327 0-.121-.05.022-.153.327-.568 1.666-2.782 8.166-7.847 2.97-2.667-2.737-1.432-5.473 3.422-6.3-2.777.473-5.899-.308-6.755-3.369C.42 10.04 0 4.615 0 3.883c0-3.67 3.217-2.517 5.202-1.026" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg className={iconClass} fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
    </svg>
  );
}

function addPlatformParam(url: string, platform: string): string {
  const sep = url.includes("?") ? "&" : "?";
  return `${url}${sep}for=${encodeURIComponent(platform)}`;
}

export default function ShareButtons({ word, imageDataUrl, pageUrl }: ShareButtonsProps) {
  const shareText = `i have had enough of ${word} #ENOUGH2026`;
  const baseShareUrl =
    pageUrl ||
    (typeof window !== "undefined"
      ? `${window.location.origin}/share/${encodeURIComponent(word)}`
      : "");
  const shareUrl = baseShareUrl;

  const handleDownload = () => {
    if (!imageDataUrl) return;
    const a = document.createElement("a");
    a.href = imageDataUrl;
    a.download = `enough-${word.toLowerCase().replace(/\s+/g, "-")}.png`;
    a.click();
  };

  const handleInstagramDownload = async () => {
    const slug = encodeURIComponent(word);
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    const url = `${origin}/api/share-image/${slug}?size=instagram`;
    try {
      const res = await fetch(url);
      if (!res.ok) return;
      const blob = await res.blob();
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = `enough-${word.toLowerCase().replace(/\s+/g, "-")}-instagram.png`;
      a.click();
      URL.revokeObjectURL(blobUrl);
    } catch {
      // fallback: open share page in new tab
      window.open(addPlatformParam(shareUrl, "instagram"), "_blank");
    }
  };

  const linkClass =
    "flex size-[40px] shrink-0 items-center justify-center rounded-none bg-white text-black transition hover:text-[#0056AE]";

  return (
    <div>
      <p
        className="mb-3 text-center text-2xl font-bold uppercase tracking-[-1px] text-black md:text-3xl"
        style={{ fontFamily: '"Arial Black", "Arial Bold", Arial, sans-serif' }}
      >
        Post to:
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <a
          href={getFacebookShareUrl(addPlatformParam(shareUrl, "facebook"), shareText)}
          target="_blank"
          rel="noopener noreferrer"
          className={linkClass}
          title="Facebook (caption copied — paste into the post)"
          aria-label="Post to Facebook"
          onClick={() => {
            shareText && navigator.clipboard?.writeText(shareText).catch(() => {});
          }}
        >
          <FacebookIcon />
        </a>

        <button
          type="button"
          onClick={handleInstagramDownload}
          className={linkClass}
          title="Download image for Instagram (1080×1350), then post in the app"
          aria-label="Download for Instagram"
        >
          <InstagramIcon />
        </button>

        <a
          href={getThreadsShareUrl(shareText, addPlatformParam(shareUrl, "threads"))}
          target="_blank"
          rel="noopener noreferrer"
          className={linkClass}
          title="Threads"
          aria-label="Post to Threads"
        >
          <ThreadsIcon />
        </a>

        <a
          href={getTwitterShareUrl(shareText, addPlatformParam(shareUrl, "twitter"))}
          target="_blank"
          rel="noopener noreferrer"
          className={linkClass}
          title="X"
          aria-label="Post to X"
        >
          <XIcon />
        </a>

        <a
          href={getBlueskyShareUrl(shareText, addPlatformParam(shareUrl, "bluesky"))}
          target="_blank"
          rel="noopener noreferrer"
          className={linkClass}
          title="Bluesky"
          aria-label="Post to Bluesky"
        >
          <BlueskyIcon />
        </a>

        <a
          href={getLinkedInShareUrl(addPlatformParam(shareUrl, "linkedin"))}
          target="_blank"
          rel="noopener noreferrer"
          className={linkClass}
          title="LinkedIn"
          aria-label="Post to LinkedIn"
        >
          <LinkedInIcon />
        </a>
      </div>

      <div className="mt-4 flex items-center justify-center gap-1.5">
        <button
          type="button"
          onClick={handleDownload}
          disabled={!imageDataUrl}
          className="inline-flex items-center gap-1.5 rounded-none text-[12px] font-bold uppercase text-black transition hover:text-[#0056AE] disabled:opacity-50"
          style={{ fontFamily: "Arial, sans-serif" }}
          title="Download"
          aria-label="Download"
        >
          <DownloadIcon className="h-6 w-6 shrink-0" />
          DOWNLOAD
        </button>
      </div>
    </div>
  );
}
