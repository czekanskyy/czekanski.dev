import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function checkUser() {
  const email = 'admin@czekanski.dev';
  const user = await prisma.user.findUnique({
    where: { email },
  });
  console.log('User found:', user);

  if (user) {
    console.log('Password hash length:', user.passwordHash.length);
    const isValid = await bcrypt.compare('admin123', user.passwordHash);
    console.log('Password "admin123" valid:', isValid);
  }
}

checkUser()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
