import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://pagepulse-divy.netlify.app"),
  title: "Page Pulse — Production URL Audit & Performance Engine",
  description: "Enterprise-grade URL audit engine with input validation, concurrency bounds, rate limiting, and cache-aside latency analysis. Built for Digital Heroes Training Task.",
  keywords: [
    "Page Pulse",
    "URL Audit",
    "Digital Heroes",
    "Web Vitals",
    "SEO Inspector",
    "Performance Audit",
    "Divy Mohan Singh"
  ],
  authors: [{ name: "Divy Mohan Singh", url: "https://www.linkedin.com/in/divya-mohan-singh-b321a61a0/" }],
  creator: "Divy Mohan Singh",
  publisher: "Digital Heroes Training Task",
  openGraph: {
    title: "Page Pulse — Production URL Audit & Performance Engine",
    description: "Input-validated, concurrency-bounded, rate-limited URL audit engine. Built for high-scale storefronts and APIs. Built for Digital Heroes Training Task.",
    url: "https://pagepulse-divy.netlify.app",
    siteName: "Page Pulse",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Page Pulse — URL Audit & Performance Engine",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Page Pulse — Production URL Audit Service",
    description: "High-throughput URL audit engine with SVG performance score rings, OpenGraph inspectors, and custom auth support. Built for Digital Heroes Training Task.",
    images: ["/og-image.png"],
    creator: "@divyamohan",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-[#e8e3d9] text-[#1a2520]">{children}</body>
    </html>
  );
}

