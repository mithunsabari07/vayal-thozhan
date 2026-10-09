import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Space_Grotesk, Be_Vietnam_Pro } from "next/font/google";
import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-headline",
  weight: ["600", "700", "800"],
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-telemetry",
  weight: ["500", "600", "700"],
  display: "swap",
});

const beVietnamPro = Be_Vietnam_Pro({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Vayal Thozhan (வயல் தோழன்) - Smart Irrigation Dashboard",
  description:
    "AI-powered precision irrigation monitor and smart automated water telemetry for smallholder farmers in Tamil Nadu.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="ta"
      className={`${plusJakarta.variable} ${spaceGrotesk.variable} ${beVietnamPro.variable} antialiased`}
      suppressHydrationWarning
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      </head>
      <body className="min-h-screen selection:bg-emerald-200 selection:text-emerald-950 dark:selection:bg-emerald-900 dark:selection:text-emerald-100">
        {children}
      </body>
    </html>
  );
}
