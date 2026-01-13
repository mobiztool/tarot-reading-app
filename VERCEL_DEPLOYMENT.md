# 🚀 Vercel Deployment Guide

## วิธี Deploy โปรเจกต์ไปที่ Vercel (สำหรับ Monorepo)

### ขั้นตอนที่ 1: เตรียม Git Repository

1. ตรวจสอบว่า Git repository พร้อมแล้ว:

```bash
git status
```

2. Push code ไปที่ GitHub/GitLab (ถ้ายังไม่ได้ทำ):

```bash
# สร้าง repository บน GitHub
# แล้วรันคำสั่งนี้
git remote add origin <your-repo-url>
git push -u origin main
```

### ขั้นตอนที่ 2: Import Project ใน Vercel Dashboard

1. ไปที่ [vercel.com](https://vercel.com)
2. คลิก **"Add New..."** → **"Project"**
3. เลือก Git provider (GitHub/GitLab/Bitbucket)
4. เลือก repository `TestProject` หรือชื่อที่คุณตั้ง

### ขั้นตอนที่ 3: Configure Project Settings (สำคัญ! 🔥)

**Framework Preset:** Next.js

**Root Directory:** `apps/web` ⚠️ สำคัญมาก!

**Build Settings:**

- **Build Command:** `pnpm build` (Vercel จะ detect workspace auto)
- **Output Directory:** ใส่ว่าง (Next.js จะ auto config)
- **Install Command:** `pnpm install`

### ขั้นตอนที่ 4: Environment Variables

เพิ่ม Environment Variables (ถ้ามี):

- `NEXT_PUBLIC_SUPABASE_URL` (ใส่ทีหลังใน Story 1.2)
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` (ใส่ทีหลังใน Story 1.2)

### ขั้นตอนที่ 5: Deploy!

1. คลิก **"Deploy"**
2. รอ build ประมาณ 1-2 นาที
3. เมื่อ deploy สำเร็จจะได้ URL: `https://your-project.vercel.app`

---

## ✅ Verification Checklist

หลัง deploy สำเร็จ ตรวจสอบ:

- [ ] เปิด deployment URL ได้
- [ ] หน้าแรกแสดงข้อความ "Tarot Reading App"
- [ ] สี purple, gold ถูกต้อง (custom Tailwind theme)
- [ ] ไม่มี console errors
- [ ] Preview deployments auto-generate เมื่อ push PR

---

## 🔧 Alternative: Deploy via CLI

ถ้าต้องการ deploy ผ่าน CLI:

```bash
# 1. Login to Vercel
npx vercel login

# 2. Deploy (first time)
npx vercel

# เลือก settings ตามนี้:
# ? Set up and deploy "~/Documents/CursorCode/TestProject"? [Y/n] Y
# ? Which scope do you want to deploy to? <your-team>
# ? Link to existing project? [y/N] n
# ? What's your project's name? tarot-app
# ? In which directory is your code located? apps/web

# 3. Deploy to production
npx vercel --prod
```

---

## 📝 Notes

- Vercel จะ auto-detect Next.js framework
- Preview deployments auto-generate จาก Git branches
- Production deployment เกิดจาก `main` branch
- Environment variables ต้อง config ใน Vercel Dashboard

---

## 🆘 Troubleshooting

**ปัญหา: "No Output Directory found"**

- ✅ แก้: ตั้ง Root Directory = `apps/web` ใน Project Settings

**ปัญหา: "Build failed"**

- ✅ เช็ค Build Command: ควรเป็น `pnpm build`
- ✅ เช็ค Install Command: ควรเป็น `pnpm install`

**ปัญหา: "Module not found @tarot-app/shared"**

- ✅ แก้: ตรวจสอบว่า pnpm workspace config ถูกต้อง
- ✅ Root Directory ต้องเป็น `apps/web` ไม่ใช่ root
