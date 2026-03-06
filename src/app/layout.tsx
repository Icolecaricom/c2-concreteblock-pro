import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#1E3A5F" },
    { media: "(prefers-color-scheme: dark)", color: "#1E3A5F" },
  ],
};

export const metadata: Metadata = {
  title: {
    default: "C2 ConcreteBlock Pro - Quality Concrete Blocks in Guyana",
    template: "%s | C2 ConcreteBlock Pro",
  },
  description: "Premium GNBS certified concrete blocks manufactured in Guyana. Building stronger foundations with strength, durability & affordability. Serving Region 3 and Region 4.",
  keywords: ["concrete blocks", "Guyana", "construction", "building materials", "hollow blocks", "paving blocks", "Region 3", "Region 4", "GNBS certified", "West Bank Demerara", "concrete construction"],
  authors: [{ name: "C2 ConcreteBlock Pro" }],
  creator: "C2 ConcreteBlock Pro",
  publisher: "C2 ConcreteBlock Pro",
  metadataBase: new URL("https://c2concreteblockpro.com"),
  icons: {
    icon: [
      { url: "/c2-logo.svg", type: "image/svg+xml" },
    ],
    apple: "/c2-logo.svg",
  },
  manifest: "/manifest.json",
  openGraph: {
    title: "C2 ConcreteBlock Pro - Quality Concrete Blocks in Guyana",
    description: "Premium GNBS certified concrete blocks. Building stronger foundations with strength, durability & affordability.",
    url: "https://c2concreteblockpro.com",
    siteName: "C2 ConcreteBlock Pro",
    type: "website",
    locale: "en_GY",
    images: [
      {
        url: "/c2-logo.svg",
        width: 1200,
        height: 630,
        alt: "C2 ConcreteBlock Pro - Quality Concrete Blocks",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "C2 ConcreteBlock Pro",
    description: "Premium GNBS certified concrete blocks in Guyana",
    images: ["/c2-logo.svg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    // Add your verification codes here when available
    // google: "your-google-verification-code",
    // facebook: "your-facebook-verification-code",
  },
  alternates: {
    canonical: "https://c2concreteblockpro.com",
  },
  category: "construction",
  classification: "Construction Materials",
  other: {
    "X-UA-Compatible": "IE=edge",
    "format-detection": "telephone=no",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "black-translucent",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Preconnect for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

        {/* DNS Prefetch for external resources */}
        <link rel="dns-prefetch" href="https://maps.googleapis.com" />

        {/* Security: Referrer Policy */}
        <meta name="referrer" content="origin-when-cross-origin" />

        {/* Security: X-Content-Type-Options (backup for older browsers) */}
        <meta httpEquiv="X-Content-Type-Options" content="nosniff" />

        {/* Theme Color for mobile browsers */}
        <meta name="theme-color" content="#1E3A5F" />
        <meta name="msapplication-TileColor" content="#1E3A5F" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
