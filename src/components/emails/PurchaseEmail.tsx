import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Preview,
  Section,
  Text,
  Tailwind,
  Hr,
} from "@react-email/components";
import * as React from "react";

interface PurchaseEmailProps {
  userName: string;
  dashboardUrl: string;
  locale?: "en" | "ko";
}

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://fireship.me";

// 다국어 지원
const translations = {
  en: {
    preview: "Your FireShip Starter Kit is ready! 🚀",
    title: "You're all set! 🎉",
    greeting: "Hey",
    message1: "Thank you so much for your purchase!",
    message2:
      "Your FireShip Starter Kit is now ready. Here's how to get started:",
    step1Title: "1. Download the Starter Kit",
    step1Desc:
      "Click the button below to download your starter kit. You can always re-download it from your dashboard.",
    step2Title: "2. Read the documentation",
    step2Desc:
      "Check out the setup guide in your dashboard. It will walk you through everything step by step.",
    step3Title: "3. Use AI coding tools",
    step3Desc:
      "We recommend using Cursor or Claude together. Just drop the llm.md file into your AI tool!",
    tipTitle: "💡 Pro Tip",
    tipDesc:
      "The AI onboarding guide will help you set up everything automatically. Just ask your AI assistant to read docs/llm.md!",
    ctaDownload: "Go to Dashboard",
    signature: "Happy building!",
    footer: "Made with ❤️ by FreAiner",
  },
  ko: {
    preview: "FireShip 스타터킷이 준비됐어요! 🚀",
    title: "준비 완료! 🎉",
    greeting: "안녕하세요",
    message1: "구매해 주셔서 정말 감사해요!",
    message2: "FireShip 스타터킷이 준비됐어요. 이렇게 시작하시면 돼요:",
    step1Title: "1. 스타터킷 다운로드하기",
    step1Desc:
      "아래 버튼을 눌러 스타터킷을 다운로드하세요. 대시보드에서 언제든 다시 받으실 수 있어요.",
    step2Title: "2. 문서 읽어보기",
    step2Desc:
      "대시보드에서 셋업 가이드를 확인해 보세요. 단계별로 친절하게 안내해 드려요.",
    step3Title: "3. AI 코딩툴과 함께 사용하기",
    step3Desc:
      "Cursor나 Claude 같은 AI 코딩툴과 함께 사용하시는 걸 추천드려요. llm.md 파일을 AI에게 보여주기만 하면 돼요!",
    tipTitle: "💡 꿀팁",
    tipDesc:
      "AI 온보딩 가이드가 모든 셋업을 자동으로 도와줘요. AI 어시스턴트에게 docs/llm.md를 읽어달라고만 하시면 돼요!",
    ctaDownload: "대시보드로 이동",
    signature: "즐거운 개발 되세요!",
    footer: "Made with ❤️ by FreAiner",
  },
};

export const PurchaseEmail = ({
  userName,
  dashboardUrl,
  locale = "ko",
}: PurchaseEmailProps) => {
  const t = translations[locale];

  return (
    <Html>
      <Head />
      <Preview>{t.preview}</Preview>
      <Tailwind>
        <Body className="bg-zinc-900 my-auto mx-auto font-sans">
          <Container className="bg-zinc-950 rounded-2xl my-[40px] mx-auto p-[40px] max-w-[520px] border border-zinc-800">
            {/* Logo */}
            <Section className="text-center mb-[32px]">
              <Img
                src={`${baseUrl}/logo.png`}
                width="60"
                height="60"
                alt="FireShip"
                className="mx-auto mb-4"
              />
              <Text className="text-2xl font-bold text-white m-0">
                FireShip
              </Text>
            </Section>

            {/* Main Content */}
            <Heading className="text-white text-[32px] font-bold text-center p-0 my-[24px] mx-0">
              {t.title}
            </Heading>

            <Text className="text-zinc-300 text-[16px] leading-[28px]">
              {t.greeting}{" "}
              <strong className="text-amber-400">{userName}</strong>님,
            </Text>

            <Text className="text-zinc-300 text-[16px] leading-[28px]">
              {t.message1}
            </Text>

            <Text className="text-zinc-300 text-[16px] leading-[28px]">
              {t.message2}
            </Text>

            {/* Steps */}
            <Section className="my-[24px]">
              {/* Step 1 */}
              <Section className="bg-zinc-900 rounded-xl p-4 mb-3 border border-zinc-800">
                <Text className="text-amber-400 text-[14px] font-bold m-0 mb-2">
                  {t.step1Title}
                </Text>
                <Text className="text-zinc-400 text-[14px] m-0">
                  {t.step1Desc}
                </Text>
              </Section>

              {/* Step 2 */}
              <Section className="bg-zinc-900 rounded-xl p-4 mb-3 border border-zinc-800">
                <Text className="text-amber-400 text-[14px] font-bold m-0 mb-2">
                  {t.step2Title}
                </Text>
                <Text className="text-zinc-400 text-[14px] m-0">
                  {t.step2Desc}
                </Text>
              </Section>

              {/* Step 3 */}
              <Section className="bg-zinc-900 rounded-xl p-4 border border-zinc-800">
                <Text className="text-amber-400 text-[14px] font-bold m-0 mb-2">
                  {t.step3Title}
                </Text>
                <Text className="text-zinc-400 text-[14px] m-0">
                  {t.step3Desc}
                </Text>
              </Section>
            </Section>

            {/* Tip Box */}
            <Section className="bg-gradient-to-r from-amber-500/20 to-orange-500/20 rounded-xl p-4 my-[24px] border border-amber-500/30">
              <Text className="text-amber-300 text-[14px] font-bold m-0 mb-2">
                {t.tipTitle}
              </Text>
              <Text className="text-amber-200 text-[13px] m-0">
                {t.tipDesc}
              </Text>
            </Section>

            {/* CTA Button */}
            <Section className="text-center my-[32px]">
              <Button
                className="bg-amber-500 rounded-xl text-black text-[16px] font-bold no-underline text-center px-8 py-4"
                href={dashboardUrl}
              >
                {t.ctaDownload} →
              </Button>
            </Section>

            <Hr className="border-zinc-800 my-[24px]" />

            <Text className="text-zinc-300 text-[16px] text-center">
              {t.signature}
              <br />
              <strong className="text-amber-400">– FireShip Team</strong>
            </Text>

            <Hr className="border-zinc-800 my-[24px]" />

            {/* Footer */}
            <Text className="text-zinc-500 text-[12px] text-center">
              {t.footer}
            </Text>
            <Text className="text-zinc-600 text-[11px] text-center m-0">
              © {new Date().getFullYear()} FireShip. All rights reserved.
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default PurchaseEmail;
