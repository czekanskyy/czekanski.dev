# 📝 Pre-Deployment Checklist dla Hostingera

## 🔍 Lokalne przygotowania

- [ ] **Build testowy**

  ```bash
  pnpm install
  pnpm build
  ```

  Status: ✓ Przechodzi bez błędów

- [ ] **Git status**
  ```bash
  git status
  git log --oneline -5
  ```
- [ ] **Backupa bazy danych**

  ```bash
  # Windows
  .\scripts\deploy-hostinger.ps1

  # macOS/Linux
  ./scripts/deploy-hostinger.sh
  ```

---

## ☁️ Setup na Hostingerze

### 1. Konto i dostęp

- [ ] Hostinger konto aktywne
- [ ] Dostęp do Hostinger Dashboard
- [ ] Domena `czekanski.dev` zaaktualizowana DNS
- [ ] SSH access włączony (jeśli chcesz)

### 2. Baza danych

- [ ] MariaDB/MySQL baza utworzona na Hostingerze
- [ ] Zanotuj: database name, user, password, host
- [ ] Sprawdzić dostęp do phpMyAdmin (w Hostinger Dashboard)

```
Database Credentials Template:
==============================
Name:     _________________________
User:     _________________________
Password: _________________________
Host:     _________________________
Port:     3306 (default)
```

### 3. Aplikacja Node.js

- [ ] Node.js application created w Hostinger Dashboard
- [ ] Build Command: `pnpm install && pnpm build`
- [ ] Start Command: `pnpm start`
- [ ] Auto deployment z Gita (opcjonalne)

---

## 🚀 Deployment - Krok po kroku

### Opcja A: Git Push (Rekomendowana)

```bash
# 1. Upewnij się że projekt buduje się
pnpm build

# 2. Commitaj zmiany
git add .
git commit -m "chore: prepare for Hostinger deployment"

# 3. Push do Hostingera
git push hostinger main
# lub
git push origin main (jeśli Hostinger jest origin)

# 4. Hostinger automatycznie:
#    - Zainstaluje zależności
#    - Zbuduje aplikację
#    - Uruchomi npm start
```

**Status:** Czekaj na notyfikację deployment'u w Dashboard

### Opcja B: Via Dashboard

1. Dashboard → Applications
2. Utwórz nową aplikację
3. Wybierz Node.js
4. Połącz Git repository
5. Ustaw zmienne środowiskowe
6. Kliknij Deploy

---

## 🔐 Konfiguracja zmiennych środowiskowych

```bash
# Skopiuj template
cp .env.production.example .env.production

# Edytuj dane Hostingera
nano .env.production
# lub powiedź mi swoje Hostinger credentials
```

### Wymagane zmienne:

```env
# HOSTINGER DATABASE
DATABASE_URL="mysql://hostinger_user:password@localhost:3306/db_name"

# GMAIL SMTP (bez zmian)
SMTP_USER=czekanski.dev@gmail.com
SMTP_PASSWORD=<app-specific-password>

# NEXTAUTH (GENERUJ NOWE!)
NEXTAUTH_SECRET=<openssl rand -base64 32>
AUTH_SECRET=<openssl rand -base64 32>
NEXTAUTH_URL=https://czekanski.dev

# ADMIN
ADMIN_EMAIL=admin@czekanski.dev
ADMIN_SEED_PASSWORD=<secure-password>

# PRODUCTION
NODE_ENV=production
```

### Gdzie to ustawić:

- **SSH:** Edytuj `.env.production` na serwerze
- **Dashboard:** Hostinger Dashboard → Application → Environment Variables

---

## 💾 Migracja bazy danych

### Metoda 1: mysqldump (Rekomendowana)

```bash
# Na LOKALNYM komputerze - eksport
mysqldump -h 127.0.0.1 -u root -p czekanski_dev > backup.sql

# Na HOSTINGERZE - import via phpMyAdmin
# 1. Dashboard → Databases → phpMyAdmin
# 2. SQL tab
# 3. Wklej zawartość backup.sql
# 4. Execute
```

### Metoda 2: Prisma Push

```bash
# SSH na Hostinger
ssh user@hostinger

# Uruchom prisma push
npx prisma db push
# lub
npm run db:push
```

### Metoda 3: Seed bazy

Jeśli chcesz dodać initial data:

```bash
npm run db:seed
# lub dla admin account
npm run init-admin
```

---

## ✅ Po deployment'cie - Testy

```bash
# 1. Sprawdź czy strona ładuje się
curl https://czekanski.dev

# 2. Testuj formularz kontaktowy
# - Wejdź na stronę
# - Wypełnij formularz
# - Sprawdź czy email przychodzi

# 3. Admin dashboard
# - https://czekanski.dev/admin/login
# - Zaloguj się
# - Edytuj content
# - Sprawdź czy save'y działają

# 4. Uploads
# - Wejdź do admin
# - Spróbuj uploadować zdjęcie
# - Sprawdź czy pojawia się na stronie

# 5. Logi
# - SSH: tail -f logs/application.log
# - Dashboard: View Application Logs
```

---

## 🆘 Troubleshooting

### ❌ Build fails: "Cannot find module 'next'"

```bash
npm install
npm run build
```

### ❌ Build fails: "prisma generate" error

```bash
npx prisma generate
npm run build
```

### ❌ Application won't start

```bash
# Check logs
tail -f logs/application.log

# SSH to server and test
npm start

# Check ports
netstat -an | grep 3000
```

### ❌ Database connection error

```
1. Verify DATABASE_URL w .env.production
2. Check credentials w Hostinger Dashboard
3. Sprawdź czy baza została migrowana
4. Test connection:
   mysql -h host -u user -p database
```

### ❌ "Cannot find config file"

Upewnij się że `.env.production` istnieje w root katalogu

### ❌ Admin login nie działa

```bash
npm run init-admin
# lub sprawdź logi dla błędów
```

### ❌ Uploads nie działają

```bash
# SSH na serwer
chmod -R 755 public/uploads
chown -R app:app public/uploads
```

---

## 📊 Monitoring

### Ustawić na Hostingerze:

- [ ] Application uptime monitoring
- [ ] Email alerts dla errors
- [ ] Database backups (daily)
- [ ] Application logs retention

---

## 🔒 Security Checklist

- [ ] `.env.production` nie jest tracked w Gicie
- [ ] Secrets (NEXTAUTH_SECRET, APP_PASSWORD) są silne
- [ ] SSL certificate active (HTTPS)
- [ ] Database password jest silne
- [ ] Admin password jest silne
- [ ] SSH keys skonfigurowane (jeśli SSH dostęp)

---

## 📞 Support

Jeśli coś nie działa:

1. Sprawdź Application Logs w Dashboard
2. SSH na server i runuj ręcznie
3. Skontaktuj się z Hostinger Support
4. Przywróć z backup'u jeśli potrzeba

---

## 🎯 Performance Tips

Po deployment'cie rozważ:

1. **Cache:**
   - Cloudflare free tier
   - Caching headers w next.config.ts

2. **Database:**
   - Dodaj indexes w schema.prisma
   - Monitor slow queries

3. **Monitoring:**
   - Google PageSpeed Insights
   - Sentry dla error tracking

4. **Auto-scaling:**
   - Sprawdź czy Hostinger oferuje auto-scale

---

**Status:** ✋ Ready to deploy!

Kiedy masz Hostinger credentials i domena skonfigurowana, wdrażamy 🚀
