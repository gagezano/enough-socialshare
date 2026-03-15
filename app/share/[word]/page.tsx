import type { Metadata } from "next";
import { getShareImageSize } from "@/lib/share-image-sizes";

const baseUrl =
  process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : process.env.NEXT_PUBLIC_BASE_URL || "https://enough-socialshare.vercel.app";

interface PageProps {
  params: Promise<{ word: string }>;
  searchParams: Promise<{ for?: string }>;
}

export async function generateMetadata({ params, searchParams }: PageProps): Promise<Metadata> {
  const { word } = await params;
  const { for: platform } = await searchParams;
  const decoded = decodeURIComponent(word || "");
  const shareText = `i have had enough of ${decoded} #ENOUGH2026`;

  const sizeParam = platform || "facebook";
  const { width, height } = getShareImageSize(sizeParam);
  const imageUrl = `${baseUrl}/api/share-image/${encodeURIComponent(decoded)}?size=${encodeURIComponent(sizeParam)}`;
  const pageUrl = `${baseUrl}/share/${encodeURIComponent(decoded)}${platform ? `?for=${encodeURIComponent(platform)}` : ""}`;

  return {
    title: `Enough - ${decoded}`,
    description: shareText,
    openGraph: {
      title: `Enough - ${decoded}`,
      description: shareText,
      url: pageUrl,
      type: "website",
      images: [
        {
          url: imageUrl,
          width,
          height,
          type: "image/png",
          secureUrl: imageUrl,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `Enough - ${decoded}`,
      description: shareText,
      images: [
        {
          url: imageUrl,
          width,
          height,
        },
      ],
    },
  };
}

export default async function SharePage({ params, searchParams }: PageProps) {
  const { word } = await params;
  const { for: platform } = await searchParams;
  const decoded = decodeURIComponent(word || "");
  const sizeParam = platform || "facebook";
  const imageUrl = `${baseUrl}/api/share-image/${encodeURIComponent(decoded)}?size=${encodeURIComponent(sizeParam)}`;

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 bg-white p-8">
      <p className="text-center text-2xl font-bold uppercase tracking-tight text-black">
        I have had enough of {decoded}
      </p>
      <p className="text-lg text-gray-600">#ENOUGH2026</p>
      <div className="flex flex-col items-center gap-4">
        {/* Preview: same image crawlers use (platform-sized) */}
        <img
          src={imageUrl}
          alt={`Enough - ${decoded}`}
          className="max-h-[70vh] w-auto max-w-full border-4 border-black object-contain"
        />
        <a
          href={imageUrl}
          download={`enough-${decoded.toLowerCase().replace(/\s+/g, "-")}.png`}
          className="inline-flex items-center gap-2 rounded-none border-2 border-black bg-white px-4 py-2 text-sm font-bold uppercase text-black transition hover:bg-black hover:text-white"
        >
          Download image
        </a>
      </div>
      <a href="/" className="mt-4 underline">
        Create your own
      </a>
    </main>
  );
}
