import { MetadataRoute } from "next";
import { getAllPosts } from "@/lib/blog/api";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://your-domain.com";
  const locales = ["en", "ko"];

  // 기본 페이지들
  const staticPages = [
    { path: "", priority: 1.0, changeFreq: "weekly" as const },
    { path: "/pricing", priority: 0.9, changeFreq: "weekly" as const },
    { path: "/blog", priority: 0.8, changeFreq: "daily" as const },
    { path: "/terms", priority: 0.3, changeFreq: "yearly" as const },
    { path: "/privacy", priority: 0.3, changeFreq: "yearly" as const },
  ];

  // 다국어 정적 페이지 생성
  const localizedStaticPages = locales.flatMap((locale) =>
    staticPages.map((page) => ({
      url: `${baseUrl}/${locale}${page.path}`,
      lastModified: new Date(),
      changeFrequency: page.changeFreq,
      priority: page.priority,
    }))
  );

  // 블로그 포스트
  const blogPosts = locales.flatMap((locale) =>
    getAllPosts(locale).map((post) => ({
      url: `${baseUrl}/${locale}/blog/${post.slug}`,
      lastModified: new Date(post.date),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }))
  );

  return [...localizedStaticPages, ...blogPosts];
}
