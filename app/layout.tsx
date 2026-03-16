import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "تقييم | Taqyeem — Saudi Arabia's National Business Review Platform",
  description:
    "Saudi Arabia's first verified, geofenced business review platform. Nafath-verified reviews across 3,200+ businesses in 15 cities.",
  keywords: "Saudi Arabia, business reviews, تقييم, Nafath, verified reviews, KSA",
  authors: [{ name: "Taqyeem" }],
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-icon.png",
  },
  openGraph: {
    title: "تقييم | Taqyeem",
    description: "Saudi Arabia's First Verified Business Review Platform",
    type: "website",
    locale: "ar_SA",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#1B6B3A",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="antialiased bg-white">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
