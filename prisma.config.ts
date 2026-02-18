import 'dotenv/config';
import { defineConfig } from 'prisma/config';

export default defineConfig({
  schema: 'prisma/schema.prisma',
  datasource: {
    url: process.env.DATABASE_URL ?? '',
    // @ts-expect-error: directUrl is required for Prisma 7 but missing in type
    directUrl: process.env.DIRECT_URL ?? '',
  },
});
