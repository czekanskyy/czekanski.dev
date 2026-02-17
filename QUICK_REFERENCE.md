# 🚀 Hostinger Quick Reference

## TL;DR - Szybki deployment

### 1. Przygotuj

```bash
# Sprawdź build
pnpm build

# Backup bazy (Windows)
.\scripts\deploy-hostinger.ps1

# lub (macOS/Linux)
./scripts/deploy-hostinger.sh
```

### 2. Wdróż

```bash
# Push do Hostingera
git push hostinger main
```

### 3. Skonfiguruj na Hostingerze

```
Hostinger Dashboard:
├── Database
│   └── Create MariaDB (zanotuj credentials)
├── Applications
│   └── New Node.js App
│       ├── Build: pnpm install && pnpm build
│       ├── Start: pnpm start
│       └── Environment Variables (patrz poniżej)
└── Domains
    └── DNS → czekanski.dev pointing to app
```

### 4. Environment Variables (w Hostinger Dashboard)

```
DATABASE_URL=mysql://user:pass@localhost:3306/db
SMTP_USER=czekanski.dev@gmail.com
SMTP_PASSWORD=your-app-password
NEXTAUTH_SECRET=<random-secret>
AUTH_SECRET=<random-secret>
NEXTAUTH_URL=https://czekanski.dev
ADMIN_EMAIL=admin@czekanski.dev
ADMIN_SEED_PASSWORD=secure-password
NODE_ENV=production
```

### 5. Migrate database

```bash
# SSH lub Application Shell:
npm run db:push
```

### 6. Test

```
✓ https://czekanski.dev
✓ https://czekanski.dev/admin/login
✓ Contact form (should send email)
✓ Upload test
```

---

## Useful Commands

```bash
# Build
pnpm build

# Test
npm start

# Database
npm run db:push       # Apply migrations
npm run db:seed       # Seed data
npm run init-admin    # Create admin

# Backup
mysqldump -h host -u user -p database > backup.sql
```

---

## Files Created

```
📁 czekanski.dev/
├── 📄 .env.production.example  (template)
├── 📄 DEPLOYMENT_GUIDE.md      (detailed guide)
├── 📄 DEPLOYMENT_CHECKLIST.md  (step-by-step)
├── 📄 hostinger.json           (config)
├── 📂 scripts/
│   ├── 📄 deploy-hostinger.sh  (Linux/macOS)
│   └── 📄 deploy-hostinger.ps1 (Windows)
└── 📄 QUICK_REFERENCE.md       (this file)
```

---

## Hostinger Setup Summary

```
┌─────────────────────────────────────────────────┐
│  HOSTINGER ACCOUNT                              │
├─────────────────────────────────────────────────┤
│ Dashboard                                       │
│ ├─ Databases                                    │
│ │  └─ MariaDB: czekanski_dev                   │
│ ├─ Applications                                 │
│ │  └─ Node.js: czekanski.dev                   │
│ │     ├─ Build: pnpm build                     │
│ │     ├─ Start: pnpm start                     │
│ │     └─ Env Vars: (see above)                 │
│ └─ Domains                                      │
│    └─ czekanski.dev (DNS configured)           │
└─────────────────────────────────────────────────┘
```

---

## Environment Secrets Generator

```bash
# Generate random secrets (run locally)
openssl rand -base64 32

# Output: use for NEXTAUTH_SECRET and AUTH_SECRET
```

---

## Database Credentials Template

```
Save this securely (LastPass, 1Password, etc):

Host:     _______________
Database: _______________
User:     _______________
Password: _______________

DATABASE_URL:
mysql://___:___@___:3306/___
```

---

## Troubleshooting Quick Fixes

| Problem           | Fix                                        |
| ----------------- | ------------------------------------------ |
| Build fails       | `pnpm install && pnpm build`               |
| DB error          | Check DATABASE_URL in .env.production      |
| Admin login fails | `npm run init-admin`                       |
| Uploads fail      | `chmod -R 755 public/uploads`              |
| Emails not sent   | Check Gmail App Password                   |
| App won't start   | Check logs: `tail -f logs/application.log` |

---

## Post-Deployment

```bash
# Monitor
tail -f logs/application.log

# Check app is running
curl https://czekanski.dev

# Check database
mysql -h host -u user -p database

# Update everything
npm update
npm run build
npm start
```

---

## Next Steps

1. ✅ Build & test locally
2. ✅ Create Hostinger account & database
3. ✅ Get Git repo on Hostinger (or push to GitHub, then GitHub to Hostinger)
4. ✅ Set environment variables
5. ✅ Migrate database
6. ✅ Deploy via git push
7. ✅ Verify at https://czekanski.dev
8. ✅ Setup monitoring & backups

---

**Ready? Let's deploy! 🚀**
