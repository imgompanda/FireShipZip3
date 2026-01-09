# 🛡️ Security & Performance Optimization (Recommended Guide)

FireShip provides enterprise-grade security guides for safe service operation. Check each security item with easy-to-understand metaphors that even beginners can grasp.

## 💡 Easy-to-Understand Security Metaphors

Computer terminology is difficult, but when compared to everyday life, it becomes very easy.

- **🚦 API Rate Limiting**:
  - **Metaphor**: "Only 5 people through the revolving door per minute"
  - **Explanation**: If someone rushed into a café 10 times per second, going in and out frantically, it would disrupt business, right? Rate limiting is a friendly manager who tells such 'pranksters' or 'attackers' to catch their breath outside for a moment before coming back.
- **🔒 Security Headers**:
  - **Metaphor**: "Double locks and ID verification"
  - **Explanation**: It's a robust lock set that blocks at the entrance anyone trying to wrap my house (website) in a fake box to scam (clickjacking), or secretly smuggling in suspicious items.

---

## 📚 Security Guide Table of Contents

### 1. [API Rate Limiting](./rate-limiting.md)

Explains how to prevent malicious requests and API abuse using Upstash (Redis).

### 2. [Security Headers](./security-headers.md)

Guide for setting HTTP security headers to block browser-based attacks.

### 3. Supabase RLS (Row Level Security)

Protects user data at the database level. All tables have RLS policies applied by default that allow access only to one's own data.

---

> **Tip**: When starting out, first check **Security Headers** settings, and activate **Rate Limiting** when your service has more API exposure. 🚀
