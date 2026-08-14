import type { MetadataRoute } from "next";
import { products } from "@/data/products";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const now = new Date();

  const staticPages = ["", "/product", "/about", "/contact"].map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: now,
    changeFrequency: path === "/product" ? ("daily" as const) : ("weekly" as const),
    priority: path === "" ? 1 : 0.8,
  }));

  const productPages = products.map((product) => ({
    url: `${baseUrl}/product/${product.id}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  const categories = Array.from(new Set(products.map((product) => product.range))).map(
    (category) => ({
      url: `${baseUrl}/category/${category}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }),
  );

  return [...staticPages, ...categories, ...productPages];
}
