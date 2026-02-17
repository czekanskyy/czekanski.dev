/**
 * Pre-build script for Hostinger deployment.
 *
 * Runs during `pnpm build` to ensure the database is ready:
 * 1. Pushes Prisma schema to DB (creates tables if they don't exist, safe for existing data)
 * 2. Seeds initial data ONLY if the database is empty (no admin user exists)
 *
 * This script is safe to run on every deploy — it will never overwrite existing content.
 */

import { execSync } from 'child_process';
import { config } from 'dotenv';
import { existsSync } from 'fs';

// Load environment variables from .env files (Hostinger sets them via Dashboard)
if (existsSync('.env.local')) config({ path: '.env.local' });
else if (existsSync('.env.production')) config({ path: '.env.production' });
else if (existsSync('.env')) config({ path: '.env' });

function run(command, label) {
  console.log(`\n🔧 ${label}...`);
  try {
    execSync(command, { stdio: 'inherit' });
    console.log(`✅ ${label} — done`);
    return true;
  } catch (error) {
    console.error(`❌ ${label} — failed`);
    return false;
  }
}

async function main() {
  console.log('╔══════════════════════════════════════════╗');
  console.log('║  🚀 Pre-build: Database Setup            ║');
  console.log('╚══════════════════════════════════════════╝');

  // Check if DATABASE_URL is set
  if (!process.env.DATABASE_URL) {
    console.log('⚠️  DATABASE_URL not set — skipping database setup');
    process.exit(0);
  }

  // Step 1: Generate Prisma Client
  run('npx prisma generate', 'Generating Prisma Client');

  // Step 2: Push schema to database
  // `prisma db push` is safe — it creates missing tables without dropping existing data.
  // It only modifies the schema, never deletes rows.
  const pushSuccess = run('npx prisma db push', 'Pushing schema to database');

  if (!pushSuccess) {
    console.error('❌ Could not push schema to database. Build will continue without DB setup.');
    process.exit(0); // Don't fail the build — the app might still work if tables already exist
  }

  // Step 3: Check if database needs seeding
  // Only seed if no admin user exists (= fresh database)
  console.log('\n🔍 Checking if database needs seeding...');

  try {
    // Dynamic import to use the generated Prisma Client
    const { PrismaClient } = await import('@prisma/client');
    const prisma = new PrismaClient();

    try {
      const userCount = await prisma.user.count();
      const sectionCount = await prisma.section.count();

      if (userCount === 0 && sectionCount === 0) {
        console.log('📭 Database is empty — running seed...');
        await prisma.$disconnect();
        run('npx tsx prisma/seed.ts', 'Seeding database');
      } else {
        console.log(`📊 Database already has data (${userCount} users, ${sectionCount} sections) — skipping seed`);
        await prisma.$disconnect();
      }
    } catch (queryError) {
      console.log('⚠️  Could not query database — skipping seed check');
      await prisma.$disconnect();
    }
  } catch (importError) {
    console.log('⚠️  Could not import Prisma Client — skipping seed check');
  }

  console.log('\n✅ Pre-build database setup complete!\n');
}

main().catch(error => {
  console.error('❌ Pre-build script error:', error.message);
  // Don't fail the build
  process.exit(0);
});
