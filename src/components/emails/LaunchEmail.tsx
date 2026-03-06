import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Section,
  Text,
  Hr,
} from "@react-email/components";

interface LaunchEmailProps {
  locale?: "en" | "ko";
}

export default function LaunchEmail({ locale = "ko" }: LaunchEmailProps) {
  const content = {
    ko: {
      preview: "🔥 FireShip 출시 알림 - 바이브 코딩으로 30분 만에 런칭하세요!",
      greeting: "안녕하세요! 👋",
      intro:
        "대기자 명단에 등록해주셔서 감사합니다. 드디어 FireShip이 정식 출시되었습니다!",
      headline: "🚀 FireShip - 30분 만에 SaaS 런칭하기",
      feature1Title: "✅ 모든 서비스 연동 완료",
      feature1Desc:
        "회원가입, 로그인, 결제, 데이터베이스, 이메일 발송이 이미 완벽하게 연결되어 있습니다. API 키만 복사해서 붙여넣으세요.",
      feature2Title: "🤖 바이브 코딩 맞춤형 프롬프트",
      feature2Desc:
        "AI(Cursor 등)에게 어떻게 명령해야 1분 만에 기능을 수정할 수 있는지, 실전에서 검증된 전용 프롬프트 가이드를 함께 드립니다.",
      feature3Title: "📚 초보자용 친절한 가이드",
      feature3Desc:
        "Supabase, Lemon Squeezy, Resend 계정 설정 전 과정을 스크린샷과 함께 단계별로 설명해 드립니다.",
      feature4Title: "⚡ 30분 완성 패키지",
      feature4Desc:
        "다운로드부터 서비스 연결, 실제 배포까지 30분~1시간이면 충분합니다.",
      ctaText: "지금 FireShip 시작하기 🔥",
      closing:
        "지루한 설정 작업은 1시간 안에 끝내고, 여러분의 소중한 '아이디어 개발'에만 집중하세요!",
      footer: "FireShip Team",
    },
    en: {
      preview: "🔥 FireShip Launch - Ship your SaaS in 30 minutes!",
      greeting: "Hello! 👋",
      intro:
        "Thank you for joining our waitlist. FireShip is now officially launched!",
      headline: "🚀 FireShip - Launch your SaaS in 30 minutes",
      feature1Title: "✅ All Services Connected",
      feature1Desc:
        "Auth, payments, database, and email are already perfectly integrated. Just paste your API keys.",
      feature2Title: "🤖 Vibe Coding Prompts",
      feature2Desc:
        "Get battle-tested prompts to command AI (Cursor, etc.) and modify features in minutes.",
      feature3Title: "📚 Beginner-Friendly Guide",
      feature3Desc:
        "Step-by-step screenshots for Supabase, Lemon Squeezy, and Resend setup.",
      feature4Title: "⚡ 30-Minute Package",
      feature4Desc:
        "From download to deployment, everything is done in 30 minutes to 1 hour.",
      ctaText: "Start FireShip Now 🔥",
      closing:
        "Finish boring setup work in under an hour and focus on building your unique ideas!",
      footer: "FireShip Team",
    },
  };

  const t = content[locale];

  return (
    <Html>
      <Head />
      <Preview>{t.preview}</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header */}
          <Section style={header}>
            <Heading style={logo}>🔥 FireShip</Heading>
          </Section>

          {/* Main Content */}
          <Section style={contentSection}>
            <Text style={greeting}>{t.greeting}</Text>
            <Text style={introText}>{t.intro}</Text>

            <Heading as="h2" style={headline}>
              {t.headline}
            </Heading>

            {/* Feature List */}
            <Section style={featureBox}>
              <Text style={featureTitle}>{t.feature1Title}</Text>
              <Text style={featureDesc}>{t.feature1Desc}</Text>
            </Section>

            <Section style={featureBox}>
              <Text style={featureTitle}>{t.feature2Title}</Text>
              <Text style={featureDesc}>{t.feature2Desc}</Text>
            </Section>

            <Section style={featureBox}>
              <Text style={featureTitle}>{t.feature3Title}</Text>
              <Text style={featureDesc}>{t.feature3Desc}</Text>
            </Section>

            <Section style={featureBox}>
              <Text style={featureTitle}>{t.feature4Title}</Text>
              <Text style={featureDesc}>{t.feature4Desc}</Text>
            </Section>

            {/* CTA Button */}
            <Section style={ctaSection}>
              <Link href="https://fireship.me" style={ctaButton}>
                {t.ctaText}
              </Link>
            </Section>

            <Text style={closingText}>{t.closing}</Text>
          </Section>

          <Hr style={hr} />

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerText}>{t.footer}</Text>
            <Text style={footerLink}>
              <Link href="https://fireship.me" style={link}>
                fireship.me
              </Link>
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

// Styles
const main = {
  backgroundColor: "#0d0d0d",
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
};

const container = {
  maxWidth: "600px",
  margin: "0 auto",
  padding: "40px 20px",
};

const header = {
  textAlign: "center" as const,
  marginBottom: "32px",
};

const logo = {
  fontSize: "32px",
  fontWeight: "bold",
  color: "#FFBE1A",
  margin: "0",
};

const contentSection = {
  backgroundColor: "#141414",
  borderRadius: "16px",
  padding: "32px",
  border: "1px solid #2a2a2a",
};

const greeting = {
  fontSize: "18px",
  color: "#ffffff",
  marginBottom: "8px",
};

const introText = {
  fontSize: "16px",
  color: "#a1a1aa",
  lineHeight: "1.6",
  marginBottom: "24px",
};

const headline = {
  fontSize: "24px",
  fontWeight: "bold",
  color: "#ffffff",
  marginBottom: "24px",
  textAlign: "center" as const,
};

const featureBox = {
  backgroundColor: "#1a1a1a",
  borderRadius: "12px",
  padding: "16px",
  marginBottom: "12px",
  border: "1px solid #333",
};

const featureTitle = {
  fontSize: "16px",
  fontWeight: "bold",
  color: "#FFBE1A",
  margin: "0 0 8px 0",
};

const featureDesc = {
  fontSize: "14px",
  color: "#a1a1aa",
  margin: "0",
  lineHeight: "1.5",
};

const ctaSection = {
  textAlign: "center" as const,
  marginTop: "32px",
  marginBottom: "24px",
};

const ctaButton = {
  backgroundColor: "#FFBE1A",
  color: "#000000",
  padding: "16px 32px",
  borderRadius: "8px",
  fontWeight: "bold",
  fontSize: "16px",
  textDecoration: "none",
  display: "inline-block",
};

const closingText = {
  fontSize: "14px",
  color: "#71717a",
  textAlign: "center" as const,
  marginTop: "24px",
};

const hr = {
  borderColor: "#333",
  margin: "32px 0",
};

const footer = {
  textAlign: "center" as const,
};

const footerText = {
  fontSize: "14px",
  color: "#71717a",
  margin: "0 0 8px 0",
};

const footerLink = {
  fontSize: "14px",
  margin: "0",
};

const link = {
  color: "#FFBE1A",
  textDecoration: "none",
};
