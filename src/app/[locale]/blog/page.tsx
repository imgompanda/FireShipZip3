import { getAllPosts } from "@/lib/blog/api";
import { Link } from "@/i18n/routing";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Header } from "@/components/shared/Header";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, ArrowRight, Rss } from "lucide-react";
import { ScrollAnimation } from "@/components/ui/animated/ScrollAnimation";

export default async function BlogIndexPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const posts = getAllPosts(locale);

  // 예상 읽기 시간 계산
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
    <div className="min-h-screen bg-zinc-50 dark:bg-black selection:bg-purple-500/30">
      <Header />

      <main className="container mx-auto py-24 px-4 max-w-4xl relative z-10">
        {/* Page Header */}
        <ScrollAnimation animation="fade-in">
          <div className="mb-16 text-center space-y-4">
            <div className="mx-auto w-12 h-12 bg-zinc-900 dark:bg-zinc-100 rounded-2xl flex items-center justify-center mb-6 shadow-xl rotate-3 hover:rotate-6 transition-transform">
              <Rss className="text-white dark:text-zinc-900 w-6 h-6" />
            </div>
            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
              {locale === "ko" ? "블로그" : "Blog"}
            </h1>
            <p className="text-xl text-zinc-500 dark:text-zinc-400 max-w-2xl mx-auto leading-relaxed">
              {locale === "ko"
                ? "SaaS 구축, 디자인, 그리고 성장에 관한 이야기를 나눕니다."
                : "Thoughts, stories and ideas about building SaaS and design."}
            </p>
          </div>
        </ScrollAnimation>

        {/* Posts Grid */}
        <div className="space-y-6">
          {posts.map((post, index) => (
            <ScrollAnimation
              key={post.slug}
              animation="slide-up"
              delay={index * 0.1}
            >
              <Link href={`/blog/${post.slug}`}>
                <Card
                  className={`group relative overflow-hidden transition-all duration-300 border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 hover:shadow-2xl hover:-translate-y-1 ${
                    index === 0
                      ? "border-2 border-zinc-900 dark:border-zinc-100 shadow-xl"
                      : "hover:border-zinc-300 dark:hover:border-zinc-700"
                  }`}
                >
                  {/* Hover Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                  <CardHeader className="pb-3 relative z-10">
                    <div className="flex justify-between items-start mb-2">
                      {index === 0 && (
                        <Badge
                          className="bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-white dark:text-black"
                          variant="default"
                        >
                          {locale === "ko" ? "✨ 최신 글" : "✨ Featured"}
                        </Badge>
                      )}
                      <div className="flex items-center gap-3 text-xs font-medium text-zinc-400 dark:text-zinc-500 ml-auto">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5" />
                          {formatDate(post.date)}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5" />
                          {getReadingTime(post.content)}{" "}
                          {locale === "ko" ? "분" : "min"}
                        </span>
                      </div>
                    </div>

                    <CardTitle className="text-2xl sm:text-3xl font-bold text-zinc-800 dark:text-zinc-100 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors leading-tight">
                      {post.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="relative z-10">
                    <CardDescription className="text-base sm:text-lg text-zinc-600 dark:text-zinc-400 mb-6 line-clamp-2">
                      {post.description}
                    </CardDescription>
                    <span className="inline-flex items-center text-sm font-semibold text-zinc-900 dark:text-zinc-100 group-hover:underline decoration-2 underline-offset-4 decoration-purple-500/50">
                      {locale === "ko" ? "계속 읽기" : "Read article"}
                      <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </CardContent>
                </Card>
              </Link>
            </ScrollAnimation>
          ))}
        </div>

        {/* Empty State */}
        {posts.length === 0 && (
          <ScrollAnimation animation="fade-in">
            <div className="text-center py-32 bg-white dark:bg-zinc-900 rounded-3xl border border-dashed border-zinc-200 dark:border-zinc-800">
              <p className="text-xl text-zinc-400 dark:text-zinc-600 font-medium">
                {locale === "ko"
                  ? "준비 중인 글이 곧 올라옵니다! ✍️"
                  : "New posts are coming soon! ✍️"}
              </p>
            </div>
          </ScrollAnimation>
        )}
      </main>

      {/* Footer */}
      <footer className="py-12 border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-black">
        <div className="container mx-auto px-4 text-center text-zinc-500 dark:text-zinc-500 text-sm">
          <p>© 2025 SaaS Kit. Built for creators.</p>
        </div>
      </footer>
    </div>
  );
}
