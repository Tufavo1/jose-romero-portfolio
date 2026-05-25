import { profile } from "@/data/profile";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://joseromero.dev";

export function PersonJsonLd() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile.fullName,
    url: siteUrl,
    email: profile.email,
    jobTitle: profile.role,
    worksFor: {
      "@type": "Organization",
      name: "Clínica Dávila",
    },
    alumniOf: {
      "@type": "EducationalOrganization",
      name: "Duoc UC",
    },
    address: {
      "@type": "PostalAddress",
      addressLocality: "Santiago",
      addressCountry: "CL",
    },
    sameAs: [profile.urls.github, profile.urls.linkedin],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function ProjectJsonLd({
  title,
  description,
  url,
  datePublished,
}: {
  title: string;
  description: string;
  url: string;
  datePublished: string;
}) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: title,
    description,
    url: `${siteUrl}${url}`,
    datePublished,
    author: {
      "@type": "Person",
      name: profile.fullName,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
