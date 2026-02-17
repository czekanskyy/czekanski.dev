#!/bin/bash
# Hostinger deployment helper script
# Usage: ./scripts/deploy-hostinger.sh

set -e

echo "🚀 Hostinger Deployment Helper"
echo "================================"
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Function to print colored output
print_step() {
  echo -e "${GREEN}✓${NC} $1"
}

print_warning() {
  echo -e "${YELLOW}⚠${NC} $1"
}

print_error() {
  echo -e "${RED}✗${NC} $1"
}

# Check if build passes
echo "1️⃣  Checking if build passes..."
if pnpm build &>/dev/null; then
  print_step "Build successful"
else
  print_error "Build failed. Please fix errors before deployment."
  exit 1
fi

# Check git status
echo ""
echo "2️⃣  Checking git status..."
if [ -n "$(git status --porcelain)" ]; then
  print_warning "You have uncommitted changes"
  git status
  read -p "Continue anyway? (y/n) " -n 1 -r
  echo
  if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    exit 1
  fi
fi

# Backup local database
echo ""
echo "3️⃣  Creating local database backup..."
if command -v mysqldump &> /dev/null; then
  DB_USER="root"
  DB_NAME="czekanski_dev"
  BACKUP_FILE="backup-$(date +%Y%m%d-%H%M%S).sql"
  
  read -p "Database host [127.0.0.1]: " DB_HOST
  DB_HOST=${DB_HOST:-127.0.0.1}
  
  read -sp "Database password: " DB_PASS
  echo ""
  
  if mysqldump -h "$DB_HOST" -u "$DB_USER" -p"$DB_PASS" "$DB_NAME" > "$BACKUP_FILE"; then
    print_step "Database backup created: $BACKUP_FILE"
  else
    print_error "Failed to create backup"
    exit 1
  fi
else
  print_warning "mysqldump not found. Skipping local backup."
fi

# Git push
echo ""
echo "4️⃣  Pushing to git..."
read -p "Push to which remote? [hostinger]: " GIT_REMOTE
GIT_REMOTE=${GIT_REMOTE:-hostinger}

if git push "$GIT_REMOTE" main; then
  print_step "Code pushed successfully"
else
  print_error "Git push failed"
  exit 1
fi

echo ""
echo "📋 Next steps:"
echo "1. SSH into your Hostinger server (if needed)"
echo "2. Create .env.production from .env.production.example"
echo "3. Update DATABASE_URL with Hostinger credentials"
echo "4. Run: npm run db:push  (or migrate with Prisma Studio)"
echo "5. Verify the deployment at https://czekanski.dev"
echo ""
print_step "Deployment script complete!"
