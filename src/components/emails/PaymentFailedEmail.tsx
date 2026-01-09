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
} from "@react-email/components";
import * as React from "react";

interface PaymentFailedEmailProps {
  userName: string;
  planName: string;
  amount: string;
  updateCardUrl: string;
  daysUntilSuspension: number;
}

export const PaymentFailedEmail = ({
  userName,
  planName,
  amount,
  updateCardUrl,
  daysUntilSuspension,
}: PaymentFailedEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>결제에 실패했어요. 카드 정보를 확인해주세요.</Preview>
      <Tailwind>
        <Body className="bg-white my-auto mx-auto font-sans">
          <Container className="border border-solid border-[#eaeaea] rounded my-[40px] mx-auto p-[20px] max-w-[465px]">
            <Heading className="text-black text-[24px] font-normal text-center p-0 my-[30px] mx-0">
              ⚠️ 결제에 실패했어요
            </Heading>
            <Text className="text-black text-[14px] leading-[24px]">
              안녕하세요 {userName}님,
            </Text>
            <Text className="text-black text-[14px] leading-[24px]">
              <strong>{planName}</strong> 플랜의 결제({amount})가 실패했어요.
            </Text>
            <Text className="text-black text-[14px] leading-[24px]">
              {daysUntilSuspension}일 안에 결제 정보를 업데이트하지 않으면
              서비스 이용이 중단될 수 있어요.
            </Text>
            <Section className="text-center mt-[32px] mb-[32px]">
              <Button
                className="bg-[#dc2626] rounded text-white text-[12px] font-semibold no-underline text-center px-5 py-3"
                href={updateCardUrl}
              >
                카드 정보 업데이트하기
              </Button>
            </Section>
            <Text className="text-[#666666] text-[12px] leading-[20px]">
              결제 정보에 문제가 없다면, 카드사에 문의해보세요.
              <br />
              도움이 필요하시면 언제든 연락 주세요.
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default PaymentFailedEmail;
