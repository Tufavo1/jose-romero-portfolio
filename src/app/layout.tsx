import type { Metadata } from "next";
import { ReactNode } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Toaster } from "@/components/ui/sonner";
import { profile } from "@/data/profile";
import { PersonJsonLd } from "@/components/shared/json-ld";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: `${profile.name} — Full Stack Developer`,
    template: `%s | ${profile.name}`,
  },
  description: profile.shortBio,
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://joseromero.dev",
  ),
  authors: [{ name: profile.fullName }],
  creator: profile.fullName,
  openGraph: {
    type: "website",
    locale: "es_CL",
    siteName: `${profile.name} — Portfolio`,
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <a
          href="#main-content"
          className="focus:bg-background sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:rounded-md focus:border focus:px-4 focus:py-2 focus:text-sm focus:font-medium"
        >
          Saltar al contenido
        </a>

        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <PersonJsonLd />

          <Header />

          <main id="main-content">{children}</main>

          <Footer />
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
