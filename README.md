# Hey guys, I finally finished my portfolio! 🚀

After quite some time, I've finally put together my personal portfolio website. I wanted something that's not just a static showcase, but a fully dynamic application that stays fresh without me having to touch the code every time.

## 🔗 Live Site

Check it out here: [czekanski.dev](https://czekanski.dev)

## ✨ What's inside?

- **Modern & Snappy**: Built with **Next.js 16**, leveraging the App Router for a liquid-smooth experience.
- **Fully Dynamic Content**: Every bit of text, every project details, and even the skills list is fetched from a database. I can update anything on the fly.
- **Responsive Background Media**: The site intelligently switches between different high-quality video or image backgrounds for desktop and mobile, so it looks great on any device.
- **Dynamic Meta & SEO**: I can manage page titles, SEO descriptions, and even the favicon dynamically.
- **Premium Aesthetics**: A crisp dark-mode design with custom micro-animations and a focus on visual excellence.
- **Contact Form**: Fully functional contact form with email notifications via Gmail SMTP.

## 🛠 Tech Stack

- **Frontend**: Next.js 16 (React), Tailwind CSS.
- **Backend/Data**: Prisma ORM with MySQL/MariaDB.
- **Auth**: NextAuth.js for secure dashboard access.
- **Email**: Nodemailer with Gmail SMTP.
- **Hosting**: Hostinger (Node.js + MySQL)

## ⚙️ Quick Start - Local Development

If you'd like to run this project locally:

1. **Clone the repository**

   ```bash
   git clone <repo-url>
   cd czekanski.dev
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Setup environment variables**

   ```bash
   cp env.example .env.local
   # Edit .env.local with your database and auth credentials
   ```

4. **Run database migrations**

   ```bash
   npx prisma db push
   ```

5. **Start development server**

   ```bash
   pnpm dev
   ```

6. **Access the app**
   - Frontend: http://localhost:3000
   - Admin Dashboard: http://localhost:3000/admin/login

## 🚀 Deployment - Hostinger

For production deployment on Hostinger, see the detailed guides:

- **📖 [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)** - Complete step-by-step guide
- **✅ [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md)** - Pre-deployment checklist
- **⚡ [QUICK_REFERENCE.md](./QUICK_REFERENCE.md)** - Quick reference card

### Quick Deploy

```bash
# 1. Test build locally
pnpm build

# 2. Create backup
.\scripts\deploy-hostinger.ps1  # Windows
# or
./scripts/deploy-hostinger.sh   # macOS/Linux

# 3. Push to Hostinger
git push hostinger main

# 4. Configure on Hostinger Dashboard
# - Set environment variables from .env.production.example
# - Migrate database: npm run db:push

# 5. Verify at https://czekanski.dev
```

## 📁 Project Structure

```
czekanski.dev/
├── app/                          # Next.js App Router
│   ├── actions/                  # Server actions (email, etc.)
│   ├── api/                      # API routes
│   ├── admin/                    # Admin dashboard
│   ├── Components/               # Page sections
│   └── layout.tsx                # Root layout
├── components/                   # Reusable components
├── public/                       # Static assets
│   └── uploads/                  # Dynamic user uploads
├── prisma/                       # Database schema & migrations
├── scripts/                      # Utility scripts
│   ├── deploy-hostinger.ps1      # Windows deployment helper
│   └── deploy-hostinger.sh       # Linux/macOS deployment helper
└── types/                        # TypeScript type definitions
```

## 🔧 Available Scripts

```bash
# Development
pnpm dev              # Start dev server

# Building
pnpm build            # Production build
pnpm start            # Start production server

# Database
pnpm db:push          # Push schema to database
pnpm db:migrate       # Create migrations
pnpm db:seed          # Run seed file
pnpm init-admin       # Initialize admin account

# Code quality
pnpm lint             # Run ESLint
```

## 🌐 Environment Variables

### Development (.env.local)

```env
DATABASE_URL=mysql://user:password@localhost:3306/database
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=app-specific-password
NEXTAUTH_SECRET=your-secret
AUTH_SECRET=your-secret
ADMIN_EMAIL=admin@example.com
ADMIN_SEED_PASSWORD=password
ADMIN_NAME=Admin
```

### Production (.env.production)

See `.env.production.example` for production configuration on Hostinger.

## 📊 Features

### Public Features

- ✓ Dynamic portfolio sections (About, Projects, Skills, Contact)
- ✓ Responsive design (mobile, tablet, desktop)
- ✓ SEO optimized
- ✓ Contact form with email notifications
- ✓ Smooth animations and transitions

### Admin Features

- ✓ Secure dashboard (NextAuth.js)
- ✓ Edit all content directly
- ✓ Manage project images
- ✓ Update social links
- ✓ Modify security settings
- ✓ View and manage uploaded files

## 🔒 Security

- NextAuth.js for authentication
- Password hashing with bcryptjs
- Environment variables for sensitive data
- HTTPS enforced
- CSRF protection
- Input validation and sanitization

## 🎯 Performance

- Optimized images with next/image
- WebP & AVIF format support
- Code splitting and lazy loading
- Static generation where possible
- Database query optimization with Prisma

## 📝 License

This project is private. Contact me for usage inquiries.

---

_Built with ❤️ by Dominik Czekański_

For questions or suggestions, check out my contact page at [czekanski.dev](https://czekanski.dev)
