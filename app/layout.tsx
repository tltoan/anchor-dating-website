import type { Metadata } from "next";
import {
  Averia_Serif_Libre,
  Inter,
  DM_Serif_Display,
  Playfair_Display,
  DM_Sans,
} from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import { Providers } from "@/components/Providers";

const averiaSerif = Averia_Serif_Libre({
  weight: ["300", "400", "700"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-averia-serif",
});

const inter = Inter({
  weight: ["400", "600", "700"],
  subsets: ["latin"],
  variable: "--font-inter",
});

const dmSerifDisplay = DM_Serif_Display({
  weight: ["400"],
  subsets: ["latin"],
  variable: "--font-dm-serif-display",
});

const playfairDisplay = Playfair_Display({
  weight: ["400", "600", "700"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-playfair",
});

const dmSans = DM_Sans({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-dm-sans",
});

export const metadata: Metadata = {
  title: "Anchor - Where dating is guaranteed",
  description: "On Anchor, every match is a date. Meet people the old-fashioned way.",
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/icon-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    title: "Anchor - Where dating is guaranteed",
    description: "On Anchor, every match is a date. Meet people the old-fashioned way.",
    images: [{ url: "/anchor-header-logo.png", width: 1024, height: 1024 }],
    siteName: "Anchor",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Anchor - Where dating is guaranteed",
    description: "On Anchor, every match is a date.",
    images: ["/anchor-header-logo.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${dmSerifDisplay.variable} ${averiaSerif.variable} ${inter.variable} ${playfairDisplay.variable} ${dmSans.variable}`}
    >
      <body
        className={`${dmSerifDisplay.variable} ${averiaSerif.variable} ${inter.variable} ${playfairDisplay.variable} ${dmSans.variable} antialiased`}
        suppressHydrationWarning
      >
        <Providers>
          {children}
          <Toaster position="top-center" />
        </Providers>
      </body>
    </html>
  );
}
