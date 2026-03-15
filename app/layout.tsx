import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Enough - Social Share",
  description: "Create and share custom word graphics",
  openGraph: {
    title: "Enough - Social Share",
    description: "Create and share custom word graphics",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Enough - Social Share",
    description: "Create and share custom word graphics",
  },
  icons: {
    icon: [
      { url: "https://enough2026.org/favicon.ico", type: "image/x-icon", sizes: "any" },
      { url: "https://enough2026.org/favicon.ico", type: "image/x-icon", media: "(prefers-color-scheme: light)" },
      { url: "https://enough2026.org/favicon-dark.ico", type: "image/x-icon", media: "(prefers-color-scheme: dark)" },
    ],
    apple: "https://enough2026.org/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
