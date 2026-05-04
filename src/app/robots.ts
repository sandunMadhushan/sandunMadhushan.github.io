import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/site-url";

export default function robots(): MetadataRoute.Robots {
  const base = getSiteUrl();

  return {
    rules: [
      {
        userAgent: "Googlebot",
        allow: "/",
        disallow: ["/admin/", "/api/"],
      },
      {
        userAgent: "Googlebot-Image",
        allow: ["/", "/sandun-madhushan.webp", "/icon", "/apple-icon"],
      },
      {
        userAgent: "Google-Extended",
        disallow: "/",
      },
      {
        userAgent: [
          "GPTBot",
          "ClaudeBot",
          "Claude-Web",
          "PerplexityBot",
          "cohere-ai",
          "YouBot",
        ],
        allow: ["/", "/llms.txt"],
        disallow: ["/admin/", "/api/"],
      },
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/api/"],
      },
    ],
    sitemap: [`${base}/sitemap.xml`, `${base}/llms.txt`],
    host: base,
  };
}
