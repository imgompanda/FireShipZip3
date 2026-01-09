import fs from "fs";
import path from "path";
import matter from "gray-matter";

const postsDirectory = path.join(process.cwd(), "content/blog");

export type Post = {
  slug: string;
  title: string;
  date: string;
  description: string;
  content: string;
  locale: string;
};

export function getPostSlugs(locale: string) {
  const localeDir = path.join(postsDirectory, locale);
  if (!fs.existsSync(localeDir)) return [];
  return fs.readdirSync(localeDir);
}

export function getPostBySlug(slug: string, locale: string): Post | null {
  const realSlug = slug.replace(/\.mdx$/, "");
  const fullPath = path.join(postsDirectory, locale, `${realSlug}.mdx`);

  if (!fs.existsSync(fullPath)) return null;

  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);

  return {
    slug: realSlug,
    title: data.title,
    date: data.date,
    description: data.description,
    content,
    locale,
  };
}

export function getAllPosts(locale: string): Post[] {
  const slugs = getPostSlugs(locale);
  const posts = slugs
    .map((slug) => getPostBySlug(slug, locale))
    .filter((post): post is Post => post !== null)
    // Sort posts by date in descending order
    .sort((post1, post2) => (post1.date > post2.date ? -1 : 1));
  return posts;
}
