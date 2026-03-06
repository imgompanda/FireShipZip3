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

interface BetaLaunchEmailProps {
  locale?: "en" | "ko";
}

export default function BetaLaunchEmail({
  locale = "ko",
}: BetaLaunchEmailProps) {
  const content = {
    ko: {
      preview: "🔥 FireShip 출시 + 특별 할인 코드 $200 할인! (FIRSHIP0425)",
      greeting: "안녕하세요! 👋",
      betaNotice:
        "베타테스터 신청에 참여해주셔서 진심으로 감사드립니다. 안타깝게도 이번 베타테스터에는 선정되지 못하셨습니다. 😢",
      compensation:
        "하지만 신청해주신 분들께만 드리는 특별한 혜택을 준비했습니다!",
      headline: "🎁 특별 할인 혜택 (총 $200 할인!)",
      discountTitle: "💰 출시 할인 $100 + 특별 코드 할인 $100",
      discountDesc:
        "현재 출시 기념 $100 할인이 적용되어 있습니다. 여기에 추가로 특별 할인 코드를 사용하시면 $100을 더 할인받아 총 $200 할인을 받으실 수 있습니다!",
      codeTitle: "🏷️ 할인 코드",
      codeValue: "FIRSHIP0425",
      codeInstruction:
        "결제 시 LemonSqueezy 체크아웃 페이지에서 위 코드를 입력하세요.",
      feature1Title: "✅ 모든 서비스 연동 완료",
      feature1Desc:
        "회원가입, 로그인, 결제, 데이터베이스, 이메일 발송이 이미 완벽하게 연결되어 있습니다.",
      feature2Title: "🤖 바이브 코딩 맞춤형 프롬프트",
      feature2Desc:
        "AI(Cursor 등)에게 어떻게 명령해야 1분 만에 기능을 수정할 수 있는지, 실전에서 검증된 가이드를 드립니다.",
      feature3Title: "⚡ 30분 만에 런칭",
      feature3Desc: "다운로드부터 배포까지 30분~1시간이면 충분합니다.",
      ctaText: "지금 $200 할인받고 시작하기 🔥",
      closing: "지금 바로 여러분의 아이디어를 현실로 만들어보세요!",
      footer: "FireShip Team",
    },
    en: {
      preview: "🔥 FireShip Launch + Special $200 Discount Code! (FIRSHIP0425)",
      greeting: "Hello! 👋",
      betaNotice:
        "Thank you so much for applying to be a beta tester. Unfortunately, you were not selected for this beta round. 😢",
      compensation:
        "But we've prepared a special offer just for applicants like you!",
      headline: "🎁 Special Discount (Total $200 Off!)",
      discountTitle: "💰 Launch Discount $100 + Code Discount $100",
      discountDesc:
        "The current $100 launch discount is already applied. Use the special code below for an additional $100 off - that's $200 total savings!",
      codeTitle: "🏷️ Discount Code",
      codeValue: "FIRSHIP0425",
      codeInstruction: "Enter this code at the LemonSqueezy checkout page.",
      feature1Title: "✅ All Services Connected",
      feature1Desc:
        "Auth, payments, database, and email are already perfectly integrated.",
      feature2Title: "🤖 Vibe Coding Prompts",
      feature2Desc:
        "Get battle-tested prompts to command AI and modify features in minutes.",
      feature3Title: "⚡ Launch in 30 Minutes",
      feature3Desc:
        "From download to deployment, everything is done in 30 minutes to 1 hour.",
      ctaText: "Get $200 Off Now 🔥",
      closing: "Turn your idea into reality today!",
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

            {/* Beta Notice */}
            <Section style={noticeBox}>
              <Text style={noticeText}>{t.betaNotice}</Text>
              <Text style={compensationText}>{t.compensation}</Text>
            </Section>

            <Heading as="h2" style={headline}>
              {t.headline}
            </Heading>

            {/* Discount Info */}
            <Section style={discountBox}>
              <Text style={discountTitle}>{t.discountTitle}</Text>
              <Text style={discountDesc}>{t.discountDesc}</Text>
            </Section>

            {/* Coupon Code */}
            <Section style={codeBox}>
              <Text style={codeLabel}>{t.codeTitle}</Text>
              <Text style={codeValue}>{t.codeValue}</Text>
              <Text style={codeInstruction}>{t.codeInstruction}</Text>
            </Section>

            <Hr style={divider} />

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
  marginBottom: "16px",
};

const noticeBox = {
  backgroundColor: "#1a1a1a",
  borderRadius: "12px",
  padding: "20px",
  marginBottom: "24px",
  border: "1px solid #333",
};

const noticeText = {
  fontSize: "15px",
  color: "#a1a1aa",
  margin: "0 0 12px 0",
  lineHeight: "1.6",
};

const compensationText = {
  fontSize: "15px",
  color: "#22c55e",
  margin: "0",
  fontWeight: "bold",
};

const headline = {
  fontSize: "24px",
  fontWeight: "bold",
  color: "#ffffff",
  marginBottom: "24px",
  textAlign: "center" as const,
};

const discountBox = {
  backgroundColor: "#1a2e1a",
  borderRadius: "12px",
  padding: "20px",
  marginBottom: "16px",
  border: "1px solid #22c55e",
};

const discountTitle = {
  fontSize: "18px",
  fontWeight: "bold",
  color: "#22c55e",
  margin: "0 0 12px 0",
};

const discountDesc = {
  fontSize: "14px",
  color: "#a1a1aa",
  margin: "0",
  lineHeight: "1.6",
};

const codeBox = {
  backgroundColor: "#2a2a2a",
  borderRadius: "12px",
  padding: "24px",
  marginBottom: "24px",
  textAlign: "center" as const,
  border: "2px dashed #FFBE1A",
};

const codeLabel = {
  fontSize: "14px",
  color: "#a1a1aa",
  margin: "0 0 8px 0",
};

const codeValue = {
  fontSize: "28px",
  fontWeight: "bold",
  color: "#FFBE1A",
  margin: "0 0 12px 0",
  letterSpacing: "2px",
};

const codeInstruction = {
  fontSize: "13px",
  color: "#71717a",
  margin: "0",
};

const divider = {
  borderColor: "#333",
  margin: "24px 0",
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
