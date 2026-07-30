import type { APIRoute } from "astro";
import { getCollection } from "astro:content";

export const GET: APIRoute = async ({ site }) => {
  const siteUrl = site?.toString() || "https://aarav2709.github.io";

  const projects = await getCollection("projects");

  const staticPages = [
    { url: "", priority: "1.0", changefreq: "weekly" },
    { url: "about", priority: "0.8", changefreq: "monthly" },
    { url: "projects", priority: "0.9", changefreq: "weekly" },
    { url: "achievements", priority: "0.8", changefreq: "monthly" },
    { url: "blog", priority: "0.7", changefreq: "monthly" },
    { url: "contact", priority: "0.7", changefreq: "monthly" },
  ];

  const projectPages = projects.map((project) => ({
    url: `projects/${project.id}`,
    priority: "0.8",
    changefreq: "monthly",
  }));

  const pages = [...staticPages, ...projectPages];

  const lastmod = new Date().toISOString();

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages
  .map(
    (page) => `  <url>
    <loc>${new URL(page.url, siteUrl)}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`,
  )
  .join("\n")}
</urlset>`;

  return new Response(sitemap, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
    },
  });
};
