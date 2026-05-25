import type { Metadata } from "next";
import { profile } from "@/data/profile";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://joseromero.dev";

export function buildMetadata({
  title,
  description,
  path = "",
  image,
}: {
  title?: string;
  description?: string;
  path?: string;
  image?: string;
}): Metadata {
  const fullTitle = title
    ? `${title} | ${profile.name}`
    : `${profile.name} — Full Stack Developer`;

  const fullDescription = description ?? profile.shortBio;

  const url = `${siteUrl}${path}`;
  const ogImage = image ?? `${siteUrl}/og.png`;

  return {
    title: fullTitle,
    description: fullDescription,
    metadataBase: new URL(siteUrl),
    alternates: { canonical: url },
    openGraph: {
      title: fullTitle,
      description: fullDescription,
      url,
      siteName: `${profile.name} — Portfolio`,
      locale: "es_CL",
      type: "website",
      images: [{ url: ogImage, width: 1200, height: 630, alt: fullTitle }],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description: fullDescription,
      images: [ogImage],
    },
  };
}
