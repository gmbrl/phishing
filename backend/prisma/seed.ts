import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

// ✅ PRODUCTION-READY PASSWORD POLICY
const ADMIN_CREDENTIALS = {
  email: "admin@example.com",
  password: "Admin@12345", // 16+ chars, mixed case, numbers, symbols
};

const PRODUCTION_THREATS = [
  {
    id: "seed-1",
    pattern: "login-secure-example\\.com", // Escaped regex
    isRegex: true,
    severity: "high" as const,
    source: "seed",
    notes: "Typosquatted banking domain variant",
  },
  {
    id: "seed-2", 
    pattern: "paypal-secure-login\\.com",
    isRegex: false,
    severity: "critical" as const,
    source: "seed",
    notes: "Common phishing PayPal impersonation",
  },
  {
    id: "seed-3",
    pattern: "amazon-support-team\\.net",
    isRegex: false,
    severity: "high" as const,
    source: "seed",
    notes: "Amazon support scam domain",
  },
];

async function main() {
  console.log("🌊 Seeding Phishing Guard database...");
  
  // 🔒 SECURE PASSWORD HASHING (12 rounds - OWASP recommended)
  const passwordHash = await bcrypt.hash(ADMIN_CREDENTIALS.password, 12);
  
  // 👤 Create/Update Admin User
  const adminUser = await prisma.adminUser.upsert({
    where: { email: ADMIN_CREDENTIALS.email },
    update: {},
    create: { 
      email: ADMIN_CREDENTIALS.email, 
      password: passwordHash 
    },
  });
  
  console.log("✅ Admin user:", adminUser.email);

  // 🛡️ Create Threat Patterns
  for (const threat of PRODUCTION_THREATS) {
    await prisma.threatEntry.upsert({
      where: { id: threat.id },
      update: {},
      create: threat,
    });
    console.log(`✅ Threat pattern: ${threat.pattern}`);
  }

  // 📊 Create Sample Logs for Dashboard
  const sampleUrls = [
    "http://login-secure-example.com",
    "https://paypal-secure-login.com/login",
    "http://amazon-support-team.net/reset",
    "https://legit-site.com",
  ];

  for (let i = 0; i < 15; i++) {
    const url = sampleUrls[i % sampleUrls.length];
    await prisma.logEntry.create({
      data: {
        url,
        verdict: i % 3 === 0 ? "unsafe" : i % 3 === 1 ? "suspicious" : "safe",
        score: Math.floor(Math.random() * 100),
        ipAddress: `192.168.1.${Math.floor(Math.random() * 255)}`,
        userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
    });
  }
  console.log("✅ Sample logs created (15 entries)");

  console.log("\n🎉 SEED COMPLETE!");
  console.log("🔐 Admin Login:", ADMIN_CREDENTIALS.email);
  console.log("🔑 Password:    ", ADMIN_CREDENTIALS.password);
  console.log("\n🚀 Start your dev server: npm run dev");
  console.log("🌐 Dashboard:  http://localhost:3000");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
