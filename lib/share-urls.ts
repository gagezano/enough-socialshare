const FACEBOOK_APP_ID = process.env.NEXT_PUBLIC_FACEBOOK_APP_ID || "";

export function getFacebookShareUrl(pageUrl: string, shareText?: string): string {
  const params = new URLSearchParams({
    app_id: FACEBOOK_APP_ID || "example",
    display: "popup",
    href: pageUrl,
    ...(shareText && { quote: shareText }),
  });
  return `https://www.facebook.com/dialog/share?${params}`;
}

export function getTwitterShareUrl(text: string, url?: string): string {
  const params = new URLSearchParams({
    text: url ? `${text} ${url}` : text,
  });
  return `https://twitter.com/intent/tweet?${params}`;
}

export function getLinkedInShareUrl(pageUrl: string): string {
  const params = new URLSearchParams({ url: pageUrl });
  return `https://www.linkedin.com/sharing/share-offsite/?${params}`;
}

export function getThreadsShareUrl(text: string, url?: string): string {
  const params = new URLSearchParams({
    text: url ? `${text} ${url}` : text,
  });
  return `https://www.threads.net/intent/post?${params}`;
}

export function getBlueskyShareUrl(text: string, url?: string): string {
  const fullText = url ? `${text} ${url}` : text;
  const params = new URLSearchParams({ text: fullText });
  return `https://bsky.app/intent/compose?${params}`;
}
