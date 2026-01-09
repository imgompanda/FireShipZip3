import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
  Tailwind,
  Hr,
} from "@react-email/components";
import * as React from "react";

interface WelcomeEmailProps {
  userName: string;
  planName?: string;
  dashboardUrl: string;
  locale?: "en" | "ko";
}

// 다국어 지원
const translations = {
  en: {
    preview: "Welcome to Global SaaS! Your journey starts here.",
    title: "Welcome! 🎉",
    greeting: "Hi",
    message1: "Thanks for joining us. We're thrilled to have you on board!",
    message2: "You now have access to all the tools you need to succeed.",
    planLabel: "Your Plan:",
    ctaButton: "Go to Dashboard",
    helpTitle: "Need Help?",
    helpText: "Reply to this email or visit our help center anytime.",
    footer: "Built with ❤️ for indie hackers",
  },
  ko: {
    preview: "Global SaaS에 오신 것을 환영해요! 여정이 시작됩니다.",
    title: "환영해요! 🎉",
    greeting: "안녕하세요",
    message1: "저희와 함께해주셔서 감사해요. 정말 기뻐요!",
    message2: "이제 성공에 필요한 모든 도구를 사용할 수 있어요.",
    planLabel: "현재 플랜:",
    ctaButton: "대시보드로 이동",
    helpTitle: "도움이 필요하세요?",
    helpText: "이 이메일에 답장하거나 언제든 헬프센터를 방문해주세요.",
    footer: "인디 해커를 위해 ❤️ 로 만들었어요",
  },
};

export const WelcomeEmail = ({
  userName,
  planName = "Basic",
  dashboardUrl,
  locale = "en",
}: WelcomeEmailProps) => {
  const t = translations[locale];

  return (
    <Html>
      <Head />
      <Preview>{t.preview}</Preview>
      <Tailwind>
        <Body className="bg-gray-100 my-auto mx-auto font-sans">
          <Container className="bg-white rounded-lg my-[40px] mx-auto p-[32px] max-w-[500px] shadow-lg">
            {/* Logo */}
            <Section className="text-center mb-[24px]">
              <Text className="text-2xl font-bold text-gray-900">
                🚀 Global SaaS
              </Text>
            </Section>

            {/* Main Content */}
            <Heading className="text-gray-900 text-[28px] font-bold text-center p-0 my-[24px] mx-0">
              {t.title}
            </Heading>

            <Text className="text-gray-700 text-[16px] leading-[28px]">
              {t.greeting} <strong>{userName}</strong>님,
            </Text>

            <Text className="text-gray-700 text-[16px] leading-[28px]">
              {t.message1}
            </Text>

            <Text className="text-gray-700 text-[16px] leading-[28px]">
              {t.message2}
            </Text>

            {/* Plan Badge */}
            {planName && (
              <Section className="bg-blue-50 rounded-lg p-4 my-[24px]">
                <Text className="text-blue-800 text-[14px] m-0">
                  {t.planLabel}{" "}
                  <strong className="text-blue-600">{planName}</strong>
                </Text>
              </Section>
            )}

            {/* CTA Button */}
            <Section className="text-center my-[32px]">
              <Button
                className="bg-black rounded-lg text-white text-[14px] font-semibold no-underline text-center px-6 py-4"
                href={dashboardUrl}
              >
                {t.ctaButton} →
              </Button>
            </Section>

            <Hr className="border-gray-200 my-[24px]" />

            {/* Help Section */}
            <Text className="text-gray-600 text-[14px] leading-[24px]">
              <strong>{t.helpTitle}</strong>
              <br />
              {t.helpText}
            </Text>

            <Hr className="border-gray-200 my-[24px]" />

            {/* Footer */}
            <Text className="text-gray-400 text-[12px] text-center">
              {t.footer}
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default WelcomeEmail;
