import type { Metadata, Viewport } from "next";
import { Space_Grotesk } from "next/font/google";
import "./globals.css";

const sg = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sg",
});

export const metadata: Metadata = {
  title: "Moritz Birthday Bash",
  description: "Song, movie, show, and drink picks for Moritz Birthday Bash.",
};

export const viewport: Viewport = {
  themeColor: "#0c0c10",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={sg.variable}>
      <body>{children}</body>
    </html>
  );
}
