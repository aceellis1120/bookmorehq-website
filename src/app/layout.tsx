import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "BookMoreHQ | AI-Powered Growth Systems for Service Businesses",
  description:
    "AI receptionist, outbound growth, conversion websites, automated follow-up, local authority, paid acquisition, and one operating dashboard.",
  openGraph: {
    title: "BookMoreHQ | AI-Powered Growth Systems",
    description:
      "Systems that help service businesses capture leads, answer calls, follow up, book appointments, and track growth.",
    type: "website",
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
      className={`${inter.variable} antialiased`}
      data-scroll-behavior="smooth"
    >
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      </head>
      <body className="min-h-screen bg-bg-primary text-text-primary">
        {children}
      </body>
    </html>
  );
}
