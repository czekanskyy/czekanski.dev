import bcrypt from 'bcryptjs';
import fs from 'fs/promises';
import path from 'path';
import { randomUUID } from 'crypto';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function hashPassword(password) {
  return bcrypt.hash(password, 10);
}

async function writeJSONFile(filename, data) {
  const dataDir = path.join(__dirname, '..', 'data');
  
  // Ensure data directory exists
  try {
    await fs.access(dataDir);
  } catch {
    await fs.mkdir(dataDir, { recursive: true });
  }
  
  const filePath = path.join(dataDir, filename);
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
}

async function initAdmin() {
  const adminUser = {
    id: randomUUID(),
    email: 'admin@czekanski.dev',
    name: 'Admin',
    passwordHash: await hashPassword('Admin123!'),
  };

  await writeJSONFile('users.json', {
    users: [adminUser],
  });

  console.log('✅ Admin user created successfully!');
  console.log('');
  console.log('Login credentials:');
  console.log('Email: admin@czekanski.dev');
  console.log('Password: Admin123!');
  console.log('');
  console.log('⚠️  Please change the password after first login!');
}

initAdmin()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Error creating admin user:', error);
    process.exit(1);
  });
