# 🗄️ Supabase Database Setup Guide

## ✅ สิ่งที่ทำเสร็จแล้ว

1. ✅ **Supabase Project Created**
   - Project: tarot-app
   - ID: `hgmrscepsnrgeozrmqez`
   - Region: ap-southeast-1
   - URL: https://hgmrscepsnrgeozrmqez.supabase.co

2. ✅ **Prisma ORM Installed**
   - Version: 7.2.0
   - @prisma/client installed
   - tsx for TypeScript execution

3. ✅ **Database Schema Defined**
   - 3 tables: Cards, Readings, ReadingCards
   - 5 enums: Suit, Arcana, Element, ReadingType, PositionLabel
   - All relationships and indexes configured

4. ✅ **Seed Script Ready**
   - 78 tarot cards data prepared
   - Major Arcana (22 cards)
   - Minor Arcana (56 cards)

5. ✅ **Code Files Ready**
   - `src/lib/prisma.ts` - Prisma Client singleton
   - `src/app/api/test-db/route.ts` - Test API endpoint
   - `packages/shared/src/types/database.ts` - TypeScript types

---

## 📝 ขั้นตอนที่คุณต้องทำ (2 Steps - 5 นาที)

### Step 1: Get Supabase Credentials

1. **Login to Supabase:**
   - Go to: https://supabase.com/dashboard
   - Login with your account

2. **Get Database Password:**
   - Open project: https://supabase.com/dashboard/project/hgmrscepsnrgeozrmqez/settings/database
   - Scroll to "Connection string"
   - Click "Show password" 
   - Copy the password

3. **Get Service Role Key:**
   - Go to: https://supabase.com/dashboard/project/hgmrscepsnrgeozrmqez/settings/api
   - Under "Project API keys"
   - Find "service_role" key (secret key)
   - Click "Reveal" and copy

### Step 2: Update `.env.local`

Replace the placeholders in `.env.local` with your credentials:

```bash
# Open the file
code .env.local

# Update these values:
SUPABASE_SERVICE_ROLE_KEY=your-actual-service-role-key
DATABASE_URL=postgresql://postgres.hgmrscepsnrgeozrmqez:YOUR-PASSWORD@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres
DIRECT_URL=postgresql://postgres.hgmrscepsnrgeozrmqez:YOUR-PASSWORD@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres
```

### Step 3: Run Database Migration & Seed

```bash
cd /Users/sutthikitphunthanasap/Documents/CursorCode/TestProject/apps/web

# 1. Generate Prisma Client
pnpm prisma:generate

# 2. Run migration (create tables)
pnpm prisma:migrate

# 3. Seed database (78 cards)
pnpm prisma:seed

# 4. Verify in Prisma Studio
pnpm prisma:studio
```

### Step 4: Test Database Connection

```bash
# Start dev server
cd /Users/sutthikitphunthanasap/Documents/CursorCode/TestProject
pnpm dev

# Test API endpoint
# Open: http://localhost:3000/api/test-db
# Should see: { success: true, totalCards: 78 }
```

---

## ✅ Verification Checklist

After completing steps above, verify:

- [ ] `.env.local` has real credentials (not placeholders)
- [ ] `pnpm prisma:generate` runs successfully
- [ ] Migration creates 3 tables in Supabase
- [ ] Seed inserts 78 cards
- [ ] Prisma Studio shows all tables and data
- [ ] `/api/test-db` returns success

---

## 🆘 Troubleshooting

**Problem:** "Environment variable not found: DATABASE_URL"
- ✅ Check `.env.local` exists and has `DATABASE_URL`
- ✅ Restart dev server after updating `.env.local`

**Problem:** "Can't reach database server"
- ✅ Check password is correct
- ✅ Check Supabase project is running
- ✅ Use DIRECT_URL for migrations (port 5432)

**Problem:** "Seed fails with duplicate key"
- ✅ This is OK - seed uses upsert
- ✅ Running seed multiple times is safe

---

## 📞 แจ้งผมเมื่อเสร็จ

เมื่อคุณทำ Steps 1-4 เสร็จแล้ว พิมพ์:
```
✅ เสร็จแล้วครับ
- Migration สำเร็จ
- Seed ครบ 78 ใบ
- Test API ผ่าน
```

แล้วผมจะ mark Story 1.2 เป็น "Ready for Review" ให้ครับ! 🚀
