import { getSiteUrl } from "@/lib/site-url";

/**
 * Structured data (replaces a large inline block from the old static index.html).
 * URLs use getSiteUrl() so dev/preview stay correct; use madhushan.me in production via NEXT_PUBLIC_APP_URL.
 */
export function SiteJsonLd() {
  const base = getSiteUrl();
  const profileImage = `${base}/sandun-madhushan.png`;

  const graph = [
    {
      "@context": "https://schema.org",
      "@type": "Person",
      "@id": `${base}/#person`,
      name: "Sandun Madhushan",
      givenName: "Sandun",
      familyName: "Madhushan",
      url: base,
      image: {
        "@type": "ImageObject",
        url: profileImage,
        contentUrl: profileImage,
        caption: "Sandun Madhushan — Full-Stack Developer from Sri Lanka",
      },
      description:
        "Full-Stack Developer from Sri Lanka — React, TypeScript, Node.js, and modern web applications.",
      jobTitle: "Full-Stack Software Engineer",
      sameAs: [
        "https://github.com/sandunMadhushan",
        "https://www.linkedin.com/in/sandunmadhushan",
        "https://mealbridge.lk",
      ],
      knowsAbout: [
        "React",
        "TypeScript",
        "Node.js",
        "Full-Stack Development",
        "Web Development",
        "REST APIs",
        "PostgreSQL",
        "Tailwind CSS",
      ],
      email: "hello@madhushan.me",
      telephone: "+94711349060",
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "@id": `${base}/#website`,
      name: "Sandun Madhushan Portfolio",
      url: base,
      description: "Portfolio — full-stack projects and experience.",
      inLanguage: "en-US",
      publisher: { "@id": `${base}/#person` },
    },
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "@id": `${base}/#webpage`,
      url: `${base}/`,
      name: "Sandun Madhushan | Full-Stack Developer Portfolio",
      description:
        "Full-Stack Developer from Sri Lanka specializing in React, TypeScript, and Node.js.",
      isPartOf: { "@id": `${base}/#website` },
      about: { "@id": `${base}/#person` },
      inLanguage: "en-US",
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "@id": `${base}/#breadcrumb`,
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: `${base}/` },
        { "@type": "ListItem", position: 2, name: "Projects", item: `${base}/projects` },
        { "@type": "ListItem", position: 3, name: "About", item: `${base}/about` },
        { "@type": "ListItem", position: 4, name: "Contact", item: `${base}/contact` },
      ],
    },
  ];

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
    />
  );
}
