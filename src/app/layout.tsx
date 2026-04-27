import type { Metadata, Viewport } from "next";
import { Space_Grotesk } from "next/font/google";
import "./globals.css";

const sg = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sg",
});

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "https://birthday-app-seven-coral.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: "Moritz Birthday Bash",
  description: "Drop your song, movie & drink picks for Moritz' Birthday Bash — April 29, Denver.",
  openGraph: {
    title: "Moritz Birthday Bash",
    description: "Drop your picks before the party starts — April 29, Denver.",
    type: "website",
    url: "https://birthday-app-seven-coral.vercel.app",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "Moritz Birthday Bash" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Moritz Birthday Bash",
    description: "Drop your picks before the party starts — April 29, Denver.",
    images: ["/og-image.jpg"],
  },
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
