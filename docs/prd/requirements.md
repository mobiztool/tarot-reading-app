# Requirements

## Functional

- **FR1:** ระบบต้องรองรับการเลือกไพ่แบบ Daily Reading (สุ่มเลือก 1 ใบ) พร้อมแสดงผลการดูดวงทันที
- **FR2:** ระบบต้องรองรับการเลือกไพ่แบบ 3-Card Spread (Past-Present-Future) พร้อมตีความแต่ละตำแหน่ง
- **FR3:** ผู้ใช้สามารถพลิกไพ่ด้วย animation แบบ 3D และมี interaction ที่ smooth
- **FR4:** ระบบต้องแสดงผลการดูดวง (reading result) พร้อมคำอธิบายความหมายของไพ่แต่ละใบ
- **FR5:** ผู้ใช้สามารถสร้างบัญชีและ login เพื่อเข้าถึงฟีเจอร์เพิ่มเติม (optional สำหรับ free users)
- **FR6:** ผู้ใช้ที่ login แล้วสามารถดูประวัติการดูดวงย้อนหลังได้ทั้งหมด
- **FR7:** ผู้ใช้สามารถแชร์ผลการดูดวงไปยัง social media (Instagram, Twitter, Facebook) ในรูปแบบภาพที่สวยงาม
- **FR8:** ระบบต้องมีหน้า landing page ที่อธิบาย product value และ call-to-action ชัดเจน
- **FR9:** ระบบต้องมีคู่มือไพ่ยิปซีทั้ง 78 ใบ พร้อมคำอธิบายความหมาย (Tarot guide/encyclopedia)
- **FR10:** ผู้ใช้สามารถเลือกธีมสีหรือสไตล์การ์ดได้ (personalization)
- **FR11:** ระบบต้องมี tutorial/onboarding สั้นๆ (ไม่เกิน 30 วินาที) สำหรับผู้ใช้ใหม่ และสามารถ skip ได้
- **FR12:** ผู้ใช้สามารถตั้งคำถามก่อนเลือกไพ่ได้ (optional question input) เพื่อให้การดูดวงมี context

## Non Functional

- **NFR1:** หน้าเว็บต้องโหลดเสร็จภายใน 1 วินาที (First Contentful Paint < 1s) บน mobile 4G
- **NFR2:** ระบบต้องรองรับ SEO อย่างเต็มรูปแบบ (meta tags, structured data, sitemap, server-side rendering)
- **NFR3:** ระบบต้องติดตั้ง conversion tracking tools อย่างน้อย 3 ระบบ: Google Analytics 4, Meta Pixel, และ Hotjar
- **NFR4:** UI/UX ต้องเป็น Dark Mode เป็นหลัก พร้อม Mystical/Spiritual aesthetic
- **NFR5:** ระบบต้องเป็น Progressive Web App (PWA) ที่สามารถติดตั้งบน home screen ได้
- **NFR6:** รูปภาพทั้งหมดต้องใช้ lazy loading และ optimization เพื่อลดเวลาโหลด
- **NFR7:** ระบบต้อง responsive และทำงานได้ดีบนทุก device (mobile-first approach)
- **NFR8:** ระบบต้องรักษาความเป็นส่วนตัวของผู้ใช้ โดยข้อมูลการดูดวงต้องเข้ารหัสและปลอดภัย
- **NFR9:** Animation และ transition ต้องมี smooth performance (60fps) และไม่ทำให้ระบบช้า
- **NFR10:** ระบบต้องสามารถ scale ได้เมื่อมีผู้ใช้เพิ่มขึ้น (ใช้ Vercel serverless architecture)
