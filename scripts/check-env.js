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

const requiredKeys = [
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  "LEMONSQUEEZY_API_KEY",
  "LEMONSQUEEZY_STORE_ID",
  "LEMONSQUEEZY_WEBHOOK_SECRET",
  "NEXT_PUBLIC_LEMONSQUEEZY_VARIANT_BASIC",
  "NEXT_PUBLIC_LEMONSQUEEZY_VARIANT_PRO",
  "RESEND_API_KEY",
  "RESEND_FROM_EMAIL",
  "NEXT_PUBLIC_APP_URL",
  "ADMIN_EMAILS",
  //   'SUPABASE_SERVICE_ROLE_KEY' // Optional for client-only, required for admin
];

const missingKeys = requiredKeys.filter(
  (key) => !envVars[key] || envVars[key] === ""
);

if (missingKeys.length > 0) {
  console.error("❌ Missing or empty environment variables:");
  missingKeys.forEach((key) => console.error(`   - ${key}`));
  process.exit(1);
}

console.log("✅ All required environment variables are present!");
