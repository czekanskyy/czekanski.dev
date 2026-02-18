# Portfolio Website - czekanski.dev

A modern, dynamic portfolio website built with **Next.js 16**, **Prisma 7**, **PostgreSQL** (via Supabase), and **Tailwind CSS**.

## 🔗 Live Site

Check it out here: [czekanski.dev](https://czekanski.dev)

## ✨ key Features

- **Full Dynamic Content**: Managed via a secure admin dashboard.
- **Responsive Design**: Mobile-first approach with custom animations.
- **Dark/Light Mode**: System-aware theming.
- **Media Management**: Support for image and video backgrounds (WebM/MP4).
- **SEO Optimized**: Dynamic metadata and OpenGraph tags.
- **Contact Form**: Email integration via SMTP.

## 🛠 Tech Stack

- **Frontend**: Next.js 16 (App Router), React 19, Tailwind CSS
- **Database**: PostgreSQL (Supabase)
- **ORM**: Prisma 7 (with `@prisma/adapter-pg` for Edge compatibility)
- **Auth**: NextAuth.js v5 (Edge-compatible)
- **Storage**: Supabase Storage
- **Deployment**: Vercel (recommended) or any Node.js host

## ⚙️ Quick Start - Local Development

1. **Clone the repository**

   ```bash
   git clone <repo-url>
   cd czekanski.dev
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Setup Environment**
   Duplicate `.env.example` to `.env.local` and configure your variables:

   ```bash
   cp .env.example .env.local
   ```

4. **Start Database (Docker)**
   This project uses a local PostgreSQL instance via Docker for development.

   ```bash
   docker-compose up -d
   ```

5. **Initialize Database**

   ```bash
   npx prisma db push
   # Optional: Seed data
   # npx prisma db seed
   ```

6. **Start Dev Server**
   ```bash
   pnpm dev
   ```
   Access the app at `http://localhost:3000`.

## 📦 Supabase Setup Guide

To deploy this project with working content and images, follow these steps to prepare your Supabase project.

### 1. Create Supabase Project

1. Go to [database.new](https://database.new) and create a new project.
2. Note your `Project URL` and `API Keys`.

### 2. Configure Database Connectivity

Get your **Connection String** from Project Settings -> Database -> Connection string (URI).

- **Mode**: Transaction Mode (Port 6543) is recommended for serverless/edge environments.
- Update your `.env` file (locally or in production dashboard):
  ```env
  DATABASE_URL="postgresql://postgres.[PROJECT_REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true"
  ```

### 3. Setup Storage (Images & Media)

The portfolio uses Supabase Storage for project screenshots and background videos.

1. Go to **Storage** in the Supabase dashboard.
2. Create a new bucket named **`uploads`**.
   - **Public**: Toggle "Association Public" to ON.
3. **Configure Policies (RLS)**:
   In the Storage Policies section for the `uploads` bucket, add the following policies:
   - **Public Read Access** (Allows anyone to view images):
     - _Policy Name_: "Public Access"
     - _Allowed Operations_: SELECT
     - _Target Roles_: `anon`, `authenticated`
     - _Policy definition_: `bucket_id = 'uploads'`

   - **Authenticated Upload/Delete** (Allows admin to upload/delete):
     - _Policy Name_: "Admin Access"
     - _Allowed Operations_: INSERT, UPDATE, DELETE
     - _Target Roles_: `authenticated` (or restrict to specific user UUIDs if preferred)
     - _Policy definition_: `bucket_id = 'uploads'`

### 4. Environment Variables

Ensure your production environment variables include Supabase credentials (required for upload API):

```env
NEXT_PUBLIC_SUPABASE_URL="https://[PROJECT_REF].supabase.co"
SUPABASE_SERVICE_ROLE_KEY="[YOUR_SERVICE_ROLE_KEY]"
```

> **Security Note**: Never expose the `service_role` key on the client side.

## 🚀 Deployment

### Vercel (Recommended)

1. Push code to GitHub.
2. Import project into Vercel.
3. Add Environment Variables (Database URL, Auth Secret, Supabase URL/Key).
4. Redeploy.

## 📁 Project Structure

```
├── app/                  # Next.js App Router (Pages & API)
├── components/           # React Components
├── lib/                  # Utilities (Prisma, Supabase, Auth)
├── prisma/               # Database Schema
├── public/               # Static Assets
└── scripts/              # Helper scripts
```

## 📝 License

Private. Contact me for usage inquiries.
