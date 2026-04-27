import type { Metadata, Viewport } from "next";
import { Space_Grotesk } from "next/font/google";
import "./globals.css";

const sg = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sg",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3020"),
  title: "Moritz Birthday Bash",
  description: "Drop your song, movie & drink picks for Moritz' Birthday Bash — April 29, Denver.",
  openGraph: {
    title: "Moritz Birthday Bash",
    description: "Drop your picks before the party starts — April 29, Denver.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Moritz Birthday Bash",
    description: "Drop your picks before the party starts — April 29, Denver.",
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
