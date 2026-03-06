/* eslint-disable */
const fs = require("fs");
const path = require("path");

const envPath = path.join(process.cwd(), ".env.local");

if (!fs.existsSync(envPath)) {
  console.error("❌ .env.local file not found!");
  console.log(
    "👉 Please copy .env.local.example to .env.local and fill in the values."
  );
  process.exit(1);
}

const envContent = fs.readFileSync(envPath, "utf8");
const envVars = envContent.split("\n").reduce((acc, line) => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) {
    acc[match[1].trim()] = match[2].trim();
  }
  return acc;
}, {});

// 필수 키: Supabase + App 설정
const requiredKeys = [
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  "NEXT_PUBLIC_APP_URL",
  "ADMIN_EMAILS",
];

// 선택 키: 결제, 이메일, AI 등 (없어도 앱 실행 가능)
const optionalKeys = [
  "LEMONSQUEEZY_API_KEY",
  "LEMONSQUEEZY_STORE_ID",
  "LEMONSQUEEZY_WEBHOOK_SECRET",
  "NEXT_PUBLIC_LEMONSQUEEZY_VARIANT_BASIC",
  "NEXT_PUBLIC_LEMONSQUEEZY_VARIANT_PRO",
  "RESEND_API_KEY",
  "RESEND_FROM_EMAIL",
  "OPENAI_API_KEY",
  "GOOGLE_GENERATIVE_AI_API_KEY",
  //   'SUPABASE_SERVICE_ROLE_KEY' // Optional for client-only, required for admin
];

const missingRequired = requiredKeys.filter(
  (key) => !envVars[key] || envVars[key] === ""
);

const missingOptional = optionalKeys.filter(
  (key) => !envVars[key] || envVars[key] === ""
);

if (missingRequired.length > 0) {
  console.error("❌ Missing or empty REQUIRED environment variables:");
  missingRequired.forEach((key) => console.error(`   - ${key}`));
  process.exit(1);
}

console.log("✅ All required environment variables are present!");

if (missingOptional.length > 0) {
  console.warn("⚠️  Missing optional environment variables (features may be limited):");
  missingOptional.forEach((key) => console.warn(`   - ${key}`));
}
