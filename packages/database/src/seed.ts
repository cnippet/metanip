// apps/payment/prisma/seed.ts

import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import { PrismaClient } from "./client";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Starting seed...");
  console.log(
    "📡 Database URL:",
    process.env.DATABASE_URL?.replace(/:[^:]*@/, ":****@"),
  );

  // Test database connection
  try {
    await prisma.$queryRaw`SELECT 1`;
    console.log("✅ Database connection successful");
  } catch (error) {
    console.error("❌ Database connection failed:", error);
    throw error;
  }

  // Seed sites
  const sites = [
    {
      displayName: "Blocks",
      domain: "https://blocks.cnippet.dev",
      isActive: true,
      name: "blocks.cnippet.dev",
      webhookUrl: "https://blocks.cnippet.dev/api/webhook/payment",
    },
    {
      displayName: "UI Components",
      domain: "https://ui.cnippet.dev",
      isActive: true,
      name: "ui.cnippet.dev",
      webhookUrl: "https://ui.cnippet.dev/api/webhook/payment",
    },
    {
      displayName: "Local Development",
      domain: "http://localhost:3000",
      isActive: true,
      name: "localhost:3000",
      webhookUrl: "http://localhost:3000/api/webhook/payment",
    },
  ];

  console.log("📍 Seeding sites...");

  for (const siteData of sites) {
    const site = await prisma.site.upsert({
      create: siteData,
      update: siteData,
      where: { name: siteData.name },
    });

    console.log(`✅ Site created/updated: ${site.name}`);
    console.log(`   Display Name: ${site.displayName}`);
    console.log(`   Domain: ${site.domain}`);
    console.log(`   API Key: ${site.apiKey}`);
    console.log(`   Active: ${site.isActive}`);
    console.log("");
  }

  console.log("✨ Seed completed successfully!");
  console.log("");
  console.log("📋 Site API Keys:");
  console.log("Copy these API keys to use in your applications:");
  console.log("");

  const allSites = await prisma.site.findMany({
    select: {
      apiKey: true,
      displayName: true,
      name: true,
    },
  });

  allSites.forEach((site) => {
    console.log(`${site.displayName} (${site.name}):`);
    console.log(`  API_KEY="${site.apiKey}"`);
    console.log("");
  });
}

main()
  .catch((e) => {
    console.error("❌ Error during seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
