
import type { MetadataRoute } from "next";

const baseUrl = "https://www.understandmylove.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    "/",
    "/help",
    "/contact",
    "/cancel",
    "/accessibility",
    "/terms",
    "/privacy",
    "/cookie",
    "/refund",
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    changeFrequency:
      route === "/" ? "weekly" : "monthly",
    priority:
      route === "/" ? 1 : 0.3,
  }));
}
