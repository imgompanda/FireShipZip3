import { getPostBySlug } from "@/lib/blog/api";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { Header } from "@/components/shared/Header";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, ArrowLeft } from "lucide-react";
import { Link } from "@/i18n/routing";

export async function generateStaticParams() {
  return [];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const post = getPostBySlug(slug, locale);

  if (!post) {
    return {};
  }

  return {
    title: post.title,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      publishedTime: post.date,
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const post = getPostBySlug(slug, locale);

  if (!post) {
    notFound();
  }

  // 읽기 시간 계산
  const getReadingTime = (content: string) => {
    const wordsPerMinute = 200;
    const wordCount = content.split(/\s+/).length;
    return Math.ceil(wordCount / wordsPerMinute);
  };

  // 날짜 포맷
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(locale === "ko" ? "ko-KR" : "en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <Header />

      <main className="container mx-auto py-24 px-4 max-w-3xl">
        {/* Back Link */}
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 mb-8 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          {locale === "ko" ? "블로그로 돌아가기" : "Back to Blog"}
        </Link>

        {/* Post Header */}
        <header className="mb-12">
          <Badge variant="secondary" className="mb-4">
            {locale === "ko" ? "블로그" : "Blog"}
          </Badge>
          <h1 className="text-4xl sm:text-5xl font-bold mb-4 leading-tight">
            {post.title}
          </h1>
          <p className="text-xl text-zinc-600 dark:text-zinc-400 mb-6">
            {post.description}
          </p>
          <div className="flex items-center gap-4 text-sm text-zinc-500 dark:text-zinc-400">
            <span className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              {formatDate(post.date)}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {getReadingTime(post.content)}{" "}
              {locale === "ko" ? "분 읽기" : "min read"}
            </span>
          </div>
        </header>

        {/* Post Content */}
        <article className="prose prose-lg dark:prose-invert max-w-none prose-headings:font-bold prose-headings:text-black dark:prose-headings:text-white prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4 prose-p:leading-relaxed prose-p:text-black dark:prose-p:text-white prose-li:text-black dark:prose-li:text-white prose-strong:text-black dark:prose-strong:text-white prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline prose-code:bg-zinc-200 dark:prose-code:bg-zinc-800 prose-code:text-pink-600 dark:prose-code:text-pink-400 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:font-mono prose-pre:bg-zinc-950 prose-pre:text-zinc-50">
          <MDXRemote source={post.content} />
        </article>

        {/* Footer */}
        <div className="border-t border-zinc-200 dark:border-zinc-800 mt-16 pt-8">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm font-medium text-zinc-900 dark:text-zinc-100 hover:gap-3 transition-all"
          >
            <ArrowLeft className="h-4 w-4" />
            {locale === "ko" ? "다른 글 보기" : "See all posts"}
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-12 border-t border-zinc-200 dark:border-zinc-800">
        <div className="container mx-auto px-4 text-center text-zinc-600 dark:text-zinc-400">
          <p>© 2025 SaaS Kit. Built with ❤️ for indie hackers.</p>
        </div>
      </footer>
    </div>
  );
}
