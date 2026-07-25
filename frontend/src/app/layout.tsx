import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Page Pulse — URL Audit & Diagnostics Service",
  description: "Production URL audit engine built for Digital Heroes Task",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased dark">
      <body className="min-h-full flex flex-col bg-[#09090b] text-zinc-100">{children}</body>
    </html>
  );
}

