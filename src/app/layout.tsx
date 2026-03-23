import type { Metadata } from "next";
import { Playfair_Display, DM_Sans } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { LivePlayer } from "@/components/LivePlayer";
import { Toaster } from "sonner";
import { PlayerProvider } from "@/context/PlayerContext";
import { ClerkProvider } from "@clerk/nextjs";

const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });
const dmSans = DM_Sans({ subsets: ["latin"], variable: "--font-dm-sans" });

export const metadata: Metadata = {
  title: {
    template: "%s | Muoroto FM",
    default: "Muoroto FM - Mugambo Wa Ma",
  },
  description: "Nairobi's number one gospel and inspirational radio station (98.1 FM). Tune in for spiritual nourishment and community empowerment.",
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" }
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180" }
    ],
    other: [
      {
        rel: "icon",
        url: "/android-chrome-192x192.png",
        sizes: "192x192",
        type: "image/png"
      },
      {
        rel: "icon",
        url: "/android-chrome-512x512.png",
        sizes: "512x512",
        type: "image/png"
      }
    ]
  },
  manifest: "/site.webmanifest"
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${playfair.variable} ${dmSans.variable} font-sans min-h-screen flex flex-col antialiased bg-background`}>
          <PlayerProvider>
            <Header />
            <main className="flex-1 pb-20">
              {children}
            </main>
            <Footer />
            <LivePlayer />
            <Toaster position="top-right" richColors />
          </PlayerProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
