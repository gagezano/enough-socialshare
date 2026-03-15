/**
 * Recommended image dimensions per platform for link previews (og:image).
 * When a share link is opened, the platform fetches this URL and we serve the image at the right size.
 */

export type SharePlatform =
  | "facebook"
  | "twitter"
  | "linkedin"
  | "threads"
  | "bluesky"
  | "instagram";

export const SHARE_IMAGE_SIZES: Record<
  SharePlatform,
  { width: number; height: number; aspect: "landscape" | "portrait" | "square" }
> = {
  // Landscape link previews (feed cards)
  facebook: { width: 1200, height: 630, aspect: "landscape" },
  twitter: { width: 1200, height: 628, aspect: "landscape" },
  linkedin: { width: 1200, height: 627, aspect: "landscape" },
  bluesky: { width: 1200, height: 628, aspect: "landscape" },
  // Portrait / vertical (e.g. Instagram post aspect)
  instagram: { width: 1080, height: 1350, aspect: "portrait" },
  threads: { width: 1080, height: 1350, aspect: "portrait" },
};

export function getShareImageSize(
  size: string | null
): { width: number; height: number; aspect: "landscape" | "portrait" | "square" } {
  const platform = size?.toLowerCase() as SharePlatform | undefined;
  if (platform && platform in SHARE_IMAGE_SIZES) {
    return SHARE_IMAGE_SIZES[platform as SharePlatform];
  }
  // Default: Facebook/OG standard
  return SHARE_IMAGE_SIZES.facebook;
}
