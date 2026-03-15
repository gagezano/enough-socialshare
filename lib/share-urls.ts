/**
 * Facebook share: use classic sharer.php (no App ID required).
 * For quote/custom text you’d need the Share Dialog + App ID.
 */
export function getFacebookShareUrl(pageUrl: string, _shareText?: string): string {
  const u = encodeURIComponent(pageUrl);
  return `https://www.facebook.com/sharer/sharer.php?u=${u}`;
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
