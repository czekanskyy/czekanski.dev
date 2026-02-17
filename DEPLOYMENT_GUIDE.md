# 🚀 Hostinger Deployment Guide

Ten plik zawiera krok-po-krok instrukcje deploymentu aplikacji Next.js na Hostingerze.

## 📋 Wymagania wstępne

- Konto Hostinger Premium (z obsługą Next.js)
- Dostęp do Hostinger Dashboard
- Git zainstalowany na lokalnym komputerze
- Domena skonfigurowana na Hostingerze

## 🔧 Krok 1: Przygotowanie projektu

### 1.1 Sprawdzenie build'u

```bash
pnpm install
pnpm build
```

Upewnij się, że build przechodzi bez błędów.

### 1.2 Aktualizacja .gitignore

Zawiera już wszystko, co trzeba. Zweryfikuj, że `.env.production` nie jest tracked:

```bash
git status
```

## 📦 Krok 2: Konfiguracja bazy danych na Hostingerze

### 2.1 Przygotowanie bazy na Hostingerze

1. Zaloguj się do Hostinger Dashboard
2. Przejdź do: **Databases** → **Create Database** (MariaDB)
3. Zanotuj:
   - Database name
   - Database user
   - Database password
   - Host (zwykle `localhost` lub dostarczone przez Hostinger)

### 2.2 Migracja danych

#### Opcja A: Backup & Restore (Rekomendowane)

1. **Na lokalnym komputerze - utwórz dump bazy:**

   ```bash
   # Windows (jeśli masz MySQL installed)
   mysqldump -h 127.0.0.1 -u root -p czekanski_dev > backup.sql

   # Lub użyj narzędzia Hostingera do importu
   ```

2. **Na Hostingerze:**
   - Zaloguj się do phpMyAdmin (dostępne w Hostinger Dashboard)
   - Przejdź do SQL
   - Wklej zawartość `backup.sql` i uruchom

#### Opcja B: Prisma Push (Najprostsze)

Na Hostingerze (via SSH lub Application Shell):

```bash
# SSH dostęp do Hostingera
npx prisma db push
```

> **⚠️ OSTRZEŻENIE:** `db push` modyfikuje bazę produkcyjną. Wykonaj backup najpierw!

### 2.3 Seed bazy danych (jeśli potrzebny admin account)

Na Hostingerze:

```bash
npm run db:seed
# lub
npm run init-admin
```

## 🌐 Krok 3: Konfiguracja zmiennych środowiskowych

### 3.1 Tworzenie .env.production

1. Na Hostingerze lub lokalnie skopiuj `.env.production.example` na `.env.production`
2. Uzupełnij wartości:
   - `DATABASE_URL` - z danych Hostingera
   - `SMTP_PASSWORD` - Gmail App Password
   - `NEXTAUTH_SECRET` i `AUTH_SECRET` - generuj nowe:
     ```bash
     openssl rand -base64 32
     ```
   - `NEXTAUTH_URL` - Twoja domena (np. `https://czekanski.dev`)

### 3.2 Ustawianie zmiennych w Hostingerze

**Opcja A: Через Hostinger Dashboard**

1. Przejdź do Aplikacji → Zmienne środowiskowe
2. Dodaj każdą zmienną z `.env.production`

**Opcja B: SSH**

```bash
# Edytuj plik bezpośrednio
nano .env.production
# lub
vim .env.production
```

## 📁 Krok 4: Obsługa uploadów

Aplikacja przechowuje pliki w `public/uploads/`.

### Opcje konfiguracji:

#### A. Local Storage (aktualnie)

- Pliki są zapisywane w `public/uploads/`
- Zaleta: prosty setup
- Wada: backup muszą być robione ręcznie

#### B. Cloud Storage (S3 lub podobny)

- Jeśli chcesz skalować, rozważ:
  - Amazon S3
  - Minio (self-hosted)
  - Hostinger Object Storage (jeśli dostępny)

Aby zmigrować na cloud storage, edytuj:

```typescript
// app/actions/sendEmail.ts lub app/api/upload/route.ts
// Zamień multer/fs na SDK cloud storage
```

## 🚀 Krok 5: Deployment

### Opcja A: Git Push (Rekomendowane)

1. **Dodaj remote na Hostingerze:**

   ```bash
   git remote add hostinger git@<hostinger-git-repo>
   # lub
   git clone <hostinger-repo>
   ```

2. **Push kodu:**

   ```bash
   git push hostinger main
   ```

3. **Hostinger automatycznie:**
   - Zainstaluje zależności (`npm install` lub `pnpm install`)
   - Wygeneruje Prisma Client
   - Builduje projekt (`npm run build`)
   - Uruchamia aplikację

### Opcja B: Manual Upload

1. Kompiluj lokalnie: `pnpm build`
2. Uploaduj `.next`, `app`, `public`, `prisma`, `node_modules`, `package.json`
3. Na Hostingerze uruchom: `npm start`

### Opcja C: Via Hostinger Dashboard

1. Przejdź do **Applications**
2. Kliknij **Create Application**
3. Wybierz **Node.js**
4. Skonfiguruj Git repository
5. Ustaw build commands:
   - Install: `pnpm install`
   - Build: `pnpm run build`
   - Start: `pnpm start`

## ✅ Krok 6: Weryfikacja

Po deployment'cie:

1. Sprawdź czy strona ładuje się: `https://czekanski.dev`
2. Testuj formularz kontaktowy (powinny przychodzić emaile)
3. Testuj admin dashboard: `https://czekanski.dev/admin/login`
4. Sprawdzaj logi:
   ```bash
   # Via SSH
   tail -f logs/application.log
   ```

## 🔒 Krok 7: SSL/TLS

Hostinger zwykle dostarcza darmowy SSL. Sprawdź:

- Hostinger Dashboard → Domains → SSL
- Powinno być ustawione na Auto-renew

## 📊 Krok 8: Monitoring & Backups

### Backups bazy danych

1. **Automatyczne backups na Hostingerze:**
   - Dashboard → Databases → Backup settings
   - Ustaw daily/weekly backups

2. **Ręczne backups:**
   ```bash
   mysqldump -h <host> -u <user> -p <database> > backup-$(date +%Y%m%d).sql
   ```

### Monitoring

1. Ustaw uptime monitoring na Hostingerze
2. Skonfiguruj email alerts dla błędów

## 🆘 Troubleshooting

### Problem: "Cannot find module 'next'"

**Rozwiązanie:**

```bash
npm install
npm run build
```

### Problem: Database connection error

**Sprawdź:**

- DATABASE_URL w `.env.production`
- Czy baza istnieje i jest dostępna
- Credentials są prawidłowe
- Firewall/IP whitelist na Hostingerze

### Problem: Pliki nie są uploadowane

**Sprawdzenie:**

```bash
# Uprawnienia do public/uploads
chmod -R 755 public/uploads
```

### Problem: Admin login nie działa

```bash
# Wykonaj seed na Hostingerze
npm run init-admin
# lub
npm run db:seed
```

## 📝 Checklist pre-deployment

- [ ] Build przechodzi lokalnie bez błędów
- [ ] Baza danych stworzona na Hostingerze
- [ ] `.env.production` wypełniony i uchroniony
- [ ] Backup lokalnej bazy wykonany
- [ ] Migracja danych do Hostingera zakończona
- [ ] NEXTAUTH_SECRET/AUTH_SECRET wygenerowane
- [ ] Gmail SMTP skonfigurowany (App Password)
- [ ] DNS/Domena wskazuje na Hostinger
- [ ] SSL certyfikat aktywny
- [ ] Testy po deployment'cie wykonane

## 🎯 Dalsze kroki

Dla zaawansowanej konfiguracji:

1. **CI/CD Pipeline** - GitHub Actions do automatycznego deploymentu
2. **CDN** - Dla lepszej wydajności (Cloudflare)
3. **Analytics** - Dodaj Google Analytics lub Vercel Analytics
4. **Monitoring** - Sentry dla error tracking
5. **Database Scaling** - Jeśli potrzebne performance tweaks

---

**Powodzenia z deployment'em! 🎉**

Jeśli napotkasz problemy, sprawdź logi aplikacji i bazy danych na Hostingerze.
