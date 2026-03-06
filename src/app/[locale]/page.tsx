"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  CheckIcon,
  Zap,
  Globe,
  Shield,
  Rocket,
  Star,
  Layers,
  Code2,
  Lock,
  Database,
  Smartphone,
  Gauge,
  CreditCard,
} from "lucide-react";
import { Header } from "@/components/shared/Header";
import { AnimatedHero } from "@/components/ui/animated/AnimatedHero";
import { BentoGrid, BentoGridItem } from "@/components/ui/animated/BentoGrid";
import { FeatureCard } from "@/components/ui/animated/FeatureCard";

import { TypewriterText } from "@/components/ui/animated/TypewriterText";
import { ScrollAnimation } from "@/components/ui/animated/ScrollAnimation";

export default function HomePage() {
  const t = useTranslations("HomePage");
  const tFooter = useTranslations("HomePage.footer");

  // BentoGrid Items
  const bentoItems = [
    {
      title: t("deepDives.one.title"), // Global Ready
      description: t("deepDives.one.description"),
      header: (
        <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 items-center justify-center">
          <Globe className="h-12 w-12 text-primary" />
        </div>
      ),
      icon: <Globe className="h-4 w-4 text-neutral-500" />,
      className: "md:col-span-2",
    },
    {
      title: t("features.secure.title"), // Secure
      description: t("features.secure.description"),
      header: (
        <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-primary/15 to-primary/5 items-center justify-center">
          <Shield className="h-12 w-12 text-primary/80" />
        </div>
      ),
      icon: <Lock className="h-4 w-4 text-neutral-500" />,
      className: "md:col-span-1",
    },
    {
      title: t("deepDives.two.title"), // Developer Experience
      description: t("deepDives.two.description"),
      header: (
        <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 items-center justify-center">
          <Code2 className="h-12 w-12 text-primary" />
        </div>
      ),
      icon: <Layers className="h-4 w-4 text-neutral-500" />,
      className: "md:col-span-1",
    },
    {
      title: t("features.deploy.title"), // Fast Deploy
      description: t("features.deploy.description"),
      header: (
        <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-primary/15 to-primary/5 items-center justify-center">
          <Rocket className="h-12 w-12 text-primary/80" />
        </div>
      ),
      icon: <Gauge className="h-4 w-4 text-neutral-500" />,
      className: "md:col-span-2",
    },
  ];

  const testimonials = [
    {
      name: t("testimonial.items.1.name"),
      role: t("testimonial.items.1.role"),
      avatar: "🧑‍💻",
      content: t("testimonial.items.1.content"),
      rating: 5,
    },
    {
      name: t("testimonial.items.2.name"),
      role: t("testimonial.items.2.role"),
      avatar: "👩‍💼",
      content: t("testimonial.items.2.content"),
      rating: 5,
    },
    {
      name: t("testimonial.items.3.name"),
      role: t("testimonial.items.3.role"),
      avatar: "👨‍🔧",
      content: t("testimonial.items.3.content"),
      rating: 5,
    },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-base-100 selection:bg-primary/20 relative z-10">
      {/* Header */}
      <Header />

      {/* Parallax Background (Fixed) */}
      {/* Parallax Background Removed */}

      {/* Hero Section */}
      <AnimatedHero
        badge={t("badge")}
        title1={t("title")}
        title2Prefix=""
        title2Highlight={
          <TypewriterText
            texts={[t("typewriter.0"), t("typewriter.1"), t("typewriter.2")]}
            className="text-primary bg-primary/10 px-2 rounded-lg"
            typingSpeed={80}
            deletingSpeed={40}
          />
        }
        description={t("description")}
        primaryCta={{
          text: t("pricing.getStarted") + " →",
          href: "/login",
        }}
        secondaryCta={{
          text: t("pricing.title"),
          href: "#pricing",
        }}
        className="bg-base-100"
      />

      {/* Logo Cloud Section */}
      <section className="py-12 border-y border-neutral bg-base-200 backdrop-blur-sm">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm font-semibold text-base-content/60 uppercase tracking-widest mb-8">
            {t("logos.title")}
          </p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-50 grayscale transition-all hover:grayscale-0 hover:opacity-100">
            <div className="flex items-center gap-2 text-xl font-bold text-base-content">
              <Layers className="h-6 w-6" /> Acme Corp
            </div>
            <div className="flex items-center gap-2 text-xl font-bold text-base-content">
              <Zap className="h-6 w-6" /> BoltShift
            </div>
            <div className="flex items-center gap-2 text-xl font-bold text-base-content">
              <Globe className="h-6 w-6" /> Globex
            </div>
            <div className="flex items-center gap-2 text-xl font-bold text-base-content">
              <BoxIcon className="h-6 w-6" /> Spherix
            </div>
            <div className="flex items-center gap-2 text-xl font-bold text-base-content">
              <CommandIcon className="h-6 w-6" /> Cmd+R
            </div>
          </div>
        </div>
      </section>

      {/* BentoGrid Section - Replacing Deep Dives */}
      <section id="features" className="py-24 bg-base-100">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-bold mb-6 text-base-content tracking-tight">
              {t("bento.title")}
            </h2>
            <p className="text-xl text-base-content/60">
              {t("bento.description")}
            </p>
          </div>

          <BentoGrid>
            {bentoItems.map((item, i) => (
              <BentoGridItem
                key={i}
                title={item.title}
                description={item.description}
                header={item.header}
                icon={item.icon}
                className={item.className + " bg-base-200"}
              />
            ))}
          </BentoGrid>
        </div>
      </section>

      {/* Holographic Feature Cards Grid */}
      <section className="py-24 bg-base-100">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <ScrollAnimation animation="slide-up" delay={0.1}>
              <FeatureCard
                title={t("features.fast.title")}
                description={t("features.fast.description")}
                icon={<Zap className="h-6 w-6 text-warning" />}
              />
            </ScrollAnimation>
            <ScrollAnimation animation="slide-up" delay={0.2}>
              <FeatureCard
                title={t("holographic.database.title")}
                description={t("holographic.database.description")}
                icon={<Database className="h-6 w-6 text-success" />}
              />
            </ScrollAnimation>
            <ScrollAnimation animation="slide-up" delay={0.3}>
              <FeatureCard
                title={t("holographic.payments.title")}
                description={t("holographic.payments.description")}
                icon={<CreditCard className="h-6 w-6 text-primary" />}
              />
            </ScrollAnimation>
            <ScrollAnimation animation="slide-up" delay={0.4}>
              <FeatureCard
                title={t("holographic.mobile.title")}
                description={t("holographic.mobile.description")}
                icon={<Smartphone className="h-6 w-6 text-info" />}
              />
            </ScrollAnimation>
            <ScrollAnimation animation="slide-up" delay={0.5}>
              <FeatureCard
                title={t("holographic.seo.title")}
                description={t("holographic.seo.description")}
                icon={<Globe className="h-6 w-6 text-secondary" />}
              />
            </ScrollAnimation>
            <ScrollAnimation animation="slide-up" delay={0.6}>
              <FeatureCard
                title={t("holographic.auth.title")}
                description={t("holographic.auth.description")}
                icon={<Lock className="h-6 w-6 text-error" />}
              />
            </ScrollAnimation>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-base-200">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-base-content">
              {t("testimonial.title")}
            </h2>
            <p className="text-xl text-base-content/60">
              {t("testimonial.subtitle")}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, i) => (
              <ScrollAnimation key={i} animation="slide-up" delay={i * 0.2}>
                <Card className="h-full bg-base-100 border border-neutral hover:border-base-content/20 transition-colors">
                  <CardContent className="pt-6">
                    <div className="flex gap-1 mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star
                          key={i}
                          className="h-5 w-5 fill-primary text-primary"
                        />
                      ))}
                    </div>
                    <p className="text-base-content/70 mb-6 leading-relaxed">
                      &ldquo;{testimonial.content}&rdquo;
                    </p>
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{testimonial.avatar}</span>
                      <div>
                        <p className="text-base-content font-semibold">{testimonial.name}</p>
                        <p className="text-sm text-base-content/60">
                          {testimonial.role}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </ScrollAnimation>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section
        id="pricing"
        className="py-24 bg-base-100 border-t border-neutral"
      >
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">{t("pricing.title")}</h2>
            <p className="text-xl text-base-content/60">
              {t("pricing.subtitle")}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Basic Plan */}
            <Card className="border border-neutral shadow-sm hover:shadow-lg transition-all h-full bg-base-200">
              <CardHeader>
                <CardTitle className="text-2xl">
                  {t("pricing.basic.name")}
                </CardTitle>
                <CardDescription>
                  {t("pricing.basic.description")}
                </CardDescription>
                <div className="mt-4">
                  <span className="text-5xl font-bold">
                    {t("pricing.basic.price")}
                  </span>
                  <span className="text-base-content/60">
                    {t("pricing.perMonth")}
                  </span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {t
                  .raw("pricing.basic.features")
                  .map((feature: string, i: number) => (
                    <div key={i} className="flex items-center gap-2">
                      <CheckIcon className="h-5 w-5 text-success flex-shrink-0" />
                      <span>{feature}</span>
                    </div>
                  ))}
                <Button
                  className="w-full mt-6 h-12 text-lg"
                  variant="outline"
                  asChild
                >
                  <Link href="/login">{t("pricing.getStarted")}</Link>
                </Button>
              </CardContent>
            </Card>

            {/* Pro Plan */}
            <Card className="border-2 border-primary relative h-full shadow-2xl bg-base-200 overflow-hidden">
              <div className="absolute top-0 right-0 p-4">
                <Badge className="bg-primary text-white hover:bg-primary/90">
                  {t("pricing.pro.popular")}
                </Badge>
              </div>
              <CardHeader>
                <CardTitle className="text-2xl">
                  {t("pricing.pro.name")}
                </CardTitle>
                <CardDescription>
                  {t("pricing.pro.description")}
                </CardDescription>
                <div className="mt-4">
                  <span className="text-5xl font-bold">
                    {t("pricing.pro.price")}
                  </span>
                  <span className="text-base-content/60">
                    {t("pricing.perMonth")}
                  </span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {t
                  .raw("pricing.pro.features")
                  .map((feature: string, i: number) => (
                    <div key={i} className="flex items-center gap-2">
                      <CheckIcon className="h-5 w-5 text-primary flex-shrink-0" />
                      <span>{feature}</span>
                    </div>
                  ))}
                <Button className="w-full mt-6 h-12 text-lg font-bold bg-primary text-white hover:brightness-110" asChild>
                  <Link href="/login">{t("pricing.getStarted")}</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-24 bg-base-200">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">{t("faq.title")}</h2>
          </div>

          <Accordion type="single" collapsible className="w-full">
            {t
              .raw("faq.questions")
              .map((faq: { q: string; a: string }, i: number) => (
                <AccordionItem
                  key={i}
                  value={`item-${i}`}
                  className="border-b border-neutral"
                >
                  <AccordionTrigger className="text-left text-lg font-medium hover:no-underline hover:text-primary transition-colors text-base-content">
                    {faq.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-base text-base-content/60 leading-relaxed">
                    {faq.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
          </Accordion>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-base-200 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,oklch(var(--p)/0.1),transparent)]" />

        <div className="container mx-auto px-4 text-center max-w-3xl relative z-10">
          <h2 className="text-5xl font-extrabold mb-8 tracking-tight text-base-content">
            {t("cta.title")}
          </h2>
          <p className="text-xl mb-12 text-base-content/60">{t("cta.description")}</p>
          <Button
            size="lg"
            variant="default"
            asChild
            className="text-lg px-12 h-16 shadow-2xl bg-primary text-white hover:brightness-110"
          >
            <Link href="/login">{t("cta.button")} →</Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 bg-base-100 border-t border-neutral text-base-content/60">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            <div>
              <h4 className="font-bold text-base-content mb-4">
                {tFooter("product")}
              </h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="#features"
                    className="hover:text-primary transition-colors"
                  >
                    {tFooter("links.features")}
                  </Link>
                </li>
                <li>
                  <Link
                    href="#pricing"
                    className="hover:text-primary transition-colors"
                  >
                    {tFooter("links.pricing")}
                  </Link>
                </li>
                <li>
                  <Link
                    href="#faq"
                    className="hover:text-primary transition-colors"
                  >
                    {tFooter("links.faq")}
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-base-content mb-4">
                {tFooter("resources")}
              </h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="/blog"
                    className="hover:text-primary transition-colors"
                  >
                    {tFooter("links.blog")}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/support"
                    className="hover:text-primary transition-colors"
                  >
                    {tFooter("links.support")}
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-base-content mb-4">
                {tFooter("company")}
              </h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="#"
                    className="hover:text-primary transition-colors"
                  >
                    {tFooter("links.about")}
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="hover:text-primary transition-colors"
                  >
                    {tFooter("links.careers")}
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-base-content mb-4">
                {tFooter("legal")}
              </h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="/privacy"
                    className="hover:text-primary transition-colors"
                  >
                    {tFooter("links.privacy")}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terms"
                    className="hover:text-primary transition-colors"
                  >
                    {tFooter("links.terms")}
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-neutral flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-base-content/40">
              © {new Date().getFullYear()} SaaS Starter Kit. All rights reserved.
            </p>
            <div className="flex gap-4">
              <a href="https://twitter.com" target="_blank" rel="noreferrer" className="hover:text-primary transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" className="fill-current" aria-hidden="true">
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"></path>
                </svg>
              </a>
              <a href="https://youtube.com" target="_blank" rel="noreferrer" className="hover:text-primary transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" className="fill-current" aria-hidden="true">
                  <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"></path>
                </svg>
              </a>
              <a href="https://facebook.com" target="_blank" rel="noreferrer" className="hover:text-primary transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" className="fill-current" aria-hidden="true">
                  <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"></path>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Simple icons for logo cloud
function BoxIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
      <path d="m3.3 7 8.7 5 8.7-5" />
      <path d="M12 22v-9" />
    </svg>
  );
}

function CommandIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
    </svg>
  );
}
