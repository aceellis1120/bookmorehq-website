import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "BookMore HQ — Outbound Systems That Generate Clients On Demand",
  description:
    "Infrastructure-driven outbound designed to create consistent, predictable lead flow. We build the systems, you close the deals.",
  openGraph: {
    title: "BookMore HQ — Outbound Systems That Generate Clients On Demand",
    description:
      "Infrastructure-driven outbound designed to create consistent, predictable lead flow.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} antialiased`}>
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      </head>
      <body className="min-h-screen bg-bg-primary text-text-primary">
        {children}
      </body>
    </html>
  );
}
