import type { Metadata } from "next";

const baseUrl =
  process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : process.env.NEXT_PUBLIC_BASE_URL || "https://enough-socialshare.vercel.app";

interface PageProps {
  params: Promise<{ word: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { word } = await params;
  const decoded = decodeURIComponent(word || "");
  const shareText = `i have had enough of ${decoded} #ENOUGH2026`;

  return {
    title: `Enough - ${decoded}`,
    description: shareText,
    openGraph: {
      title: `Enough - ${decoded}`,
      description: shareText,
      images: [`${baseUrl}/api/share-image/${encodeURIComponent(decoded)}`],
    },
    twitter: {
      card: "summary_large_image",
      title: `Enough - ${decoded}`,
      description: shareText,
      images: [`${baseUrl}/api/share-image/${encodeURIComponent(decoded)}`],
    },
  };
}

export default async function SharePage({ params }: PageProps) {
  const { word } = await params;
  const decoded = decodeURIComponent(word || "");

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-white p-8">
      <p className="mb-4 text-2xl font-bold uppercase tracking-tight text-black">
        I have had enough of {decoded}
      </p>
      <p className="text-lg text-gray-600">#ENOUGH2026</p>
      <a
        href="/"
        className="mt-8 underline"
      >
        Create your own
      </a>
    </main>
  );
}
