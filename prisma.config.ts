import 'dotenv/config';
import { defineConfig } from 'prisma/config';

export default defineConfig({
  schema: 'prisma/schema.prisma',
  datasource: {
    // Prefer DIRECT_URL for CLI operations (migrations/push) to avoid pooler issues
    url: process.env.DIRECT_URL || process.env.DATABASE_URL || '',
  },
});
