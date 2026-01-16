# Email Templates Setup for Supabase Auth

This document describes how to configure email templates in the Supabase Dashboard for the Tarot Reading App.

## How to Configure

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Navigate to **Authentication** → **Email Templates**
4. Copy and paste the templates below for each type

---

## 1. Confirm Signup (ยืนยันการสมัคร)

**Subject:** 🔮 ยืนยันการสมัครสมาชิก - ดูดวงไพ่ทาโรต์

**Body:**
```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #0f172a;">
  <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
    <!-- Header -->
    <div style="text-align: center; margin-bottom: 30px;">
      <span style="font-size: 48px;">🔮</span>
      <h1 style="color: #c084fc; margin: 10px 0;">ดูดวงไพ่ทาโรต์</h1>
    </div>
    
    <!-- Content Box -->
    <div style="background: linear-gradient(135deg, #1e293b 0%, #312e81 100%); border-radius: 16px; padding: 30px; border: 1px solid #6366f1;">
      <h2 style="color: #fcd34d; margin-top: 0;">🌟 ยินดีต้อนรับ!</h2>
      <p style="color: #e2e8f0; line-height: 1.6;">
        ขอบคุณที่สมัครสมาชิกกับ <strong style="color: #c084fc;">ดูดวงไพ่ทาโรต์</strong> 
        กรุณายืนยันอีเมลของคุณเพื่อเริ่มต้นการเดินทางทางจิตวิญญาณ
      </p>
      
      <!-- CTA Button -->
      <div style="text-align: center; margin: 30px 0;">
        <a href="{{ .ConfirmationURL }}" 
           style="display: inline-block; padding: 14px 32px; background: linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%); color: white; text-decoration: none; border-radius: 10px; font-weight: bold; font-size: 16px;">
          ✨ ยืนยันอีเมลของฉัน
        </a>
      </div>
      
      <p style="color: #94a3b8; font-size: 14px; text-align: center;">
        หรือใช้รหัส OTP: <strong style="color: #fcd34d;">{{ .Token }}</strong>
      </p>
    </div>
    
    <!-- Footer -->
    <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #334155;">
      <p style="color: #64748b; font-size: 12px;">
        หากคุณไม่ได้สมัครสมาชิก กรุณาเพิกเฉยอีเมลนี้
      </p>
      <p style="color: #475569; font-size: 11px;">
        © 2026 ดูดวงไพ่ทาโรต์ - เปิดประตูสู่ความลับแห่งจักรวาล
      </p>
    </div>
  </div>
</body>
</html>
```

---

## 2. Magic Link (เข้าสู่ระบบแบบไม่ต้องใช้รหัสผ่าน)

**Subject:** 🔮 ลิงก์เข้าสู่ระบบ - ดูดวงไพ่ทาโรต์

**Body:**
```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #0f172a;">
  <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
    <!-- Header -->
    <div style="text-align: center; margin-bottom: 30px;">
      <span style="font-size: 48px;">🔮</span>
      <h1 style="color: #c084fc; margin: 10px 0;">ดูดวงไพ่ทาโรต์</h1>
    </div>
    
    <!-- Content Box -->
    <div style="background: linear-gradient(135deg, #1e293b 0%, #312e81 100%); border-radius: 16px; padding: 30px; border: 1px solid #6366f1;">
      <h2 style="color: #fcd34d; margin-top: 0;">🌙 เข้าสู่ระบบ</h2>
      <p style="color: #e2e8f0; line-height: 1.6;">
        คลิกปุ่มด้านล่างเพื่อเข้าสู่ระบบบัญชีของคุณโดยไม่ต้องใช้รหัสผ่าน
      </p>
      
      <!-- CTA Button -->
      <div style="text-align: center; margin: 30px 0;">
        <a href="{{ .ConfirmationURL }}" 
           style="display: inline-block; padding: 14px 32px; background: linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%); color: white; text-decoration: none; border-radius: 10px; font-weight: bold; font-size: 16px;">
          🔓 เข้าสู่ระบบ
        </a>
      </div>
      
      <p style="color: #94a3b8; font-size: 14px; text-align: center;">
        หรือใช้รหัส OTP: <strong style="color: #fcd34d;">{{ .Token }}</strong>
      </p>
      
      <p style="color: #f87171; font-size: 12px; text-align: center; margin-top: 20px;">
        ⚠️ ลิงก์นี้จะหมดอายุใน 1 ชั่วโมง
      </p>
    </div>
    
    <!-- Footer -->
    <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #334155;">
      <p style="color: #64748b; font-size: 12px;">
        หากคุณไม่ได้ขอลิงก์นี้ กรุณาเพิกเฉยอีเมลนี้
      </p>
    </div>
  </div>
</body>
</html>
```

---

## 3. Reset Password (รีเซ็ตรหัสผ่าน)

**Subject:** 🔐 รีเซ็ตรหัสผ่าน - ดูดวงไพ่ทาโรต์

**Body:**
```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #0f172a;">
  <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
    <!-- Header -->
    <div style="text-align: center; margin-bottom: 30px;">
      <span style="font-size: 48px;">🔮</span>
      <h1 style="color: #c084fc; margin: 10px 0;">ดูดวงไพ่ทาโรต์</h1>
    </div>
    
    <!-- Content Box -->
    <div style="background: linear-gradient(135deg, #1e293b 0%, #312e81 100%); border-radius: 16px; padding: 30px; border: 1px solid #6366f1;">
      <h2 style="color: #fcd34d; margin-top: 0;">🔐 รีเซ็ตรหัสผ่าน</h2>
      <p style="color: #e2e8f0; line-height: 1.6;">
        เราได้รับคำขอรีเซ็ตรหัสผ่านสำหรับบัญชี <strong style="color: #c084fc;">{{ .Email }}</strong>
      </p>
      <p style="color: #e2e8f0; line-height: 1.6;">
        คลิกปุ่มด้านล่างเพื่อตั้งรหัสผ่านใหม่
      </p>
      
      <!-- CTA Button -->
      <div style="text-align: center; margin: 30px 0;">
        <a href="{{ .ConfirmationURL }}" 
           style="display: inline-block; padding: 14px 32px; background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%); color: white; text-decoration: none; border-radius: 10px; font-weight: bold; font-size: 16px;">
          🔑 ตั้งรหัสผ่านใหม่
        </a>
      </div>
      
      <p style="color: #f87171; font-size: 12px; text-align: center; margin-top: 20px;">
        ⚠️ ลิงก์นี้จะหมดอายุใน 1 ชั่วโมง
      </p>
    </div>
    
    <!-- Footer -->
    <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #334155;">
      <p style="color: #64748b; font-size: 12px;">
        หากคุณไม่ได้ขอรีเซ็ตรหัสผ่าน กรุณาเพิกเฉยอีเมลนี้<br>
        รหัสผ่านของคุณจะยังคงเหมือนเดิม
      </p>
    </div>
  </div>
</body>
</html>
```

---

## 4. Change Email Address (เปลี่ยนอีเมล)

**Subject:** 📧 ยืนยันการเปลี่ยนอีเมล - ดูดวงไพ่ทาโรต์

**Body:**
```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #0f172a;">
  <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
    <!-- Header -->
    <div style="text-align: center; margin-bottom: 30px;">
      <span style="font-size: 48px;">🔮</span>
      <h1 style="color: #c084fc; margin: 10px 0;">ดูดวงไพ่ทาโรต์</h1>
    </div>
    
    <!-- Content Box -->
    <div style="background: linear-gradient(135deg, #1e293b 0%, #312e81 100%); border-radius: 16px; padding: 30px; border: 1px solid #6366f1;">
      <h2 style="color: #fcd34d; margin-top: 0;">📧 ยืนยันการเปลี่ยนอีเมล</h2>
      <p style="color: #e2e8f0; line-height: 1.6;">
        คุณได้ขอเปลี่ยนอีเมลจาก <strong style="color: #94a3b8;">{{ .Email }}</strong> 
        เป็น <strong style="color: #c084fc;">{{ .NewEmail }}</strong>
      </p>
      <p style="color: #e2e8f0; line-height: 1.6;">
        คลิกปุ่มด้านล่างเพื่อยืนยันการเปลี่ยนแปลง
      </p>
      
      <!-- CTA Button -->
      <div style="text-align: center; margin: 30px 0;">
        <a href="{{ .ConfirmationURL }}" 
           style="display: inline-block; padding: 14px 32px; background: linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%); color: white; text-decoration: none; border-radius: 10px; font-weight: bold; font-size: 16px;">
          ✅ ยืนยันอีเมลใหม่
        </a>
      </div>
    </div>
    
    <!-- Footer -->
    <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #334155;">
      <p style="color: #64748b; font-size: 12px;">
        หากคุณไม่ได้ขอเปลี่ยนอีเมล กรุณาติดต่อเราทันที
      </p>
    </div>
  </div>
</body>
</html>
```

---

## 5. Invite User (เชิญผู้ใช้)

**Subject:** ✨ คุณได้รับเชิญให้เข้าร่วม - ดูดวงไพ่ทาโรต์

**Body:**
```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #0f172a;">
  <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
    <!-- Header -->
    <div style="text-align: center; margin-bottom: 30px;">
      <span style="font-size: 48px;">🔮</span>
      <h1 style="color: #c084fc; margin: 10px 0;">ดูดวงไพ่ทาโรต์</h1>
    </div>
    
    <!-- Content Box -->
    <div style="background: linear-gradient(135deg, #1e293b 0%, #312e81 100%); border-radius: 16px; padding: 30px; border: 1px solid #6366f1;">
      <h2 style="color: #fcd34d; margin-top: 0;">✨ คุณได้รับเชิญ!</h2>
      <p style="color: #e2e8f0; line-height: 1.6;">
        คุณได้รับเชิญให้เข้าร่วม <strong style="color: #c084fc;">ดูดวงไพ่ทาโรต์</strong> - 
        แพลตฟอร์มดูดวงไพ่ทาโรต์ที่ดีที่สุดในประเทศไทย
      </p>
      
      <!-- Features -->
      <ul style="color: #cbd5e1; line-height: 1.8; padding-left: 20px;">
        <li>🎴 ไพ่ทาโรต์ 78 ใบ พร้อมความหมายภาษาไทย</li>
        <li>☀️ ดูดวงประจำวัน</li>
        <li>🌙 ดูดวงไพ่ 3 ใบ (อดีต-ปัจจุบัน-อนาคต)</li>
        <li>📜 บันทึกประวัติการดูดวง</li>
      </ul>
      
      <!-- CTA Button -->
      <div style="text-align: center; margin: 30px 0;">
        <a href="{{ .ConfirmationURL }}" 
           style="display: inline-block; padding: 14px 32px; background: linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%); color: white; text-decoration: none; border-radius: 10px; font-weight: bold; font-size: 16px;">
          🌟 รับคำเชิญ
        </a>
      </div>
    </div>
    
    <!-- Footer -->
    <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #334155;">
      <p style="color: #64748b; font-size: 12px;">
        หากคุณไม่ต้องการรับคำเชิญ กรุณาเพิกเฉยอีเมลนี้
      </p>
    </div>
  </div>
</body>
</html>
```

---

## 6. Premium Welcome (ยินดีต้อนรับสมาชิก Premium)

**Subject:** 👑 ยินดีต้อนรับสู่ Premium! - ดูดวงไพ่ทาโรต์

**Body:**
```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #0f172a;">
  <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
    <!-- Header -->
    <div style="text-align: center; margin-bottom: 30px;">
      <span style="font-size: 48px;">👑</span>
      <h1 style="color: #fcd34d; margin: 10px 0;">ยินดีต้อนรับสู่ Premium!</h1>
    </div>
    
    <!-- Content Box -->
    <div style="background: linear-gradient(135deg, #1e293b 0%, #4c1d95 100%); border-radius: 16px; padding: 30px; border: 1px solid #fcd34d;">
      <h2 style="color: #fcd34d; margin-top: 0;">✨ ขอบคุณที่อัปเกรด!</h2>
      <p style="color: #e2e8f0; line-height: 1.6;">
        คุณได้ปลดล็อกความลับแห่งจักรวาลแล้ว! ตอนนี้คุณสามารถเข้าถึง <strong style="color: #fcd34d;">Premium Spreads</strong> ทั้งหมด
      </p>
      
      <!-- Premium Features -->
      <div style="background: rgba(0,0,0,0.3); border-radius: 12px; padding: 20px; margin: 20px 0;">
        <h3 style="color: #c084fc; margin-top: 0;">รูปแบบการดูดวงที่คุณเข้าถึงได้:</h3>
        <ul style="color: #e2e8f0; line-height: 1.8; padding-left: 20px;">
          <li>✨ <strong>Celtic Cross</strong> - การวิเคราะห์ชีวิตอย่างลึกซึ้ง (10 ไพ่)</li>
          <li>⚖️ <strong>Decision Making</strong> - ช่วยตัดสินใจเรื่องสำคัญ (5 ไพ่)</li>
          <li>🔍 <strong>Self Discovery</strong> - ค้นพบตัวตนที่แท้จริง (5 ไพ่)</li>
          <li>💞 <strong>Relationship Deep Dive</strong> - วิเคราะห์ความสัมพันธ์ (7 ไพ่)</li>
        </ul>
      </div>
      
      <!-- CTA Button -->
      <div style="text-align: center; margin: 30px 0;">
        <a href="{{ .SiteURL }}/reading#pro" 
           style="display: inline-block; padding: 14px 32px; background: linear-gradient(135deg, #fcd34d 0%, #f59e0b 100%); color: #1e293b; text-decoration: none; border-radius: 10px; font-weight: bold; font-size: 16px;">
          🎴 เริ่มดูดวง Premium
        </a>
      </div>
      
      <p style="color: #94a3b8; font-size: 14px; text-align: center;">
        มีคำถาม? ติดต่อทีมสนับสนุนได้ที่ support@tarot-app.com
      </p>
    </div>
    
    <!-- Footer -->
    <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #334155;">
      <p style="color: #475569; font-size: 11px;">
        © 2026 ดูดวงไพ่ทาโรต์ - เปิดประตูสู่ความลับแห่งจักรวาล
      </p>
    </div>
  </div>
</body>
</html>
```

---

## 7. Premium Spread Guide (คู่มือการดูดวง Premium)

**Subject:** 📚 คู่มือ Premium Spreads - ดูดวงไพ่ทาโรต์

**Body:**
```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #0f172a;">
  <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
    <!-- Header -->
    <div style="text-align: center; margin-bottom: 30px;">
      <span style="font-size: 48px;">📚</span>
      <h1 style="color: #c084fc; margin: 10px 0;">คู่มือ Premium Spreads</h1>
    </div>
    
    <!-- Content Box -->
    <div style="background: linear-gradient(135deg, #1e293b 0%, #312e81 100%); border-radius: 16px; padding: 30px; border: 1px solid #6366f1;">
      <p style="color: #e2e8f0; line-height: 1.6;">
        เรียนรู้วิธีใช้ Premium Spreads ให้ได้ประโยชน์สูงสุด!
      </p>
      
      <!-- Celtic Cross -->
      <div style="background: rgba(0,0,0,0.3); border-radius: 12px; padding: 20px; margin: 20px 0;">
        <h3 style="color: #fcd34d; margin-top: 0;">✨ Celtic Cross (10 ไพ่)</h3>
        <p style="color: #cbd5e1; font-size: 14px; line-height: 1.6;">
          <strong>เหมาะสำหรับ:</strong> คำถามที่ต้องการความเข้าใจรอบด้าน<br>
          <strong>เวลา:</strong> ~10 นาที<br>
          <strong>เคล็ดลับ:</strong> ตั้งคำถามที่ชัดเจน และให้เวลาพิจารณาความเชื่อมโยงของทุกตำแหน่ง
        </p>
      </div>
      
      <!-- Decision Making -->
      <div style="background: rgba(0,0,0,0.3); border-radius: 12px; padding: 20px; margin: 20px 0;">
        <h3 style="color: #fcd34d; margin-top: 0;">⚖️ Decision Making (5 ไพ่)</h3>
        <p style="color: #cbd5e1; font-size: 14px; line-height: 1.6;">
          <strong>เหมาะสำหรับ:</strong> เปรียบเทียบสองทางเลือก<br>
          <strong>เวลา:</strong> ~5 นาที<br>
          <strong>เคล็ดลับ:</strong> เขียนทางเลือกทั้งสองให้ชัดเจนก่อนเริ่ม
        </p>
      </div>
      
      <!-- Self Discovery -->
      <div style="background: rgba(0,0,0,0.3); border-radius: 12px; padding: 20px; margin: 20px 0;">
        <h3 style="color: #fcd34d; margin-top: 0;">🔍 Self Discovery (5 ไพ่)</h3>
        <p style="color: #cbd5e1; font-size: 14px; line-height: 1.6;">
          <strong>เหมาะสำหรับ:</strong> ค้นหาตัวตนและศักยภาพ<br>
          <strong>เวลา:</strong> ~5 นาที<br>
          <strong>เคล็ดลับ:</strong> ทำในช่วงเวลาที่สงบ มีสมาธิ
        </p>
      </div>
      
      <!-- Relationship Deep Dive -->
      <div style="background: rgba(0,0,0,0.3); border-radius: 12px; padding: 20px; margin: 20px 0;">
        <h3 style="color: #fcd34d; margin-top: 0;">💞 Relationship Deep Dive (7 ไพ่)</h3>
        <p style="color: #cbd5e1; font-size: 14px; line-height: 1.6;">
          <strong>เหมาะสำหรับ:</strong> วิเคราะห์ความสัมพันธ์ทุกรูปแบบ<br>
          <strong>เวลา:</strong> ~7 นาที<br>
          <strong>เคล็ดลับ:</strong> นึกถึงคนที่เกี่ยวข้องขณะเลือกไพ่
        </p>
      </div>
      
      <!-- CTA Button -->
      <div style="text-align: center; margin: 30px 0;">
        <a href="{{ .SiteURL }}/help" 
           style="display: inline-block; padding: 14px 32px; background: linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%); color: white; text-decoration: none; border-radius: 10px; font-weight: bold; font-size: 16px;">
          ❓ ดูคำถามที่พบบ่อย
        </a>
      </div>
    </div>
    
    <!-- Footer -->
    <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #334155;">
      <p style="color: #64748b; font-size: 12px;">
        ต้องการความช่วยเหลือ? ติดต่อ support@tarot-app.com
      </p>
    </div>
  </div>
</body>
</html>
```

---

## Configuration Notes

### Site URL
Make sure to set the **Site URL** in Authentication → URL Configuration to your production domain:
- Production: `https://your-domain.vercel.app`
- Local development: `http://localhost:3000`

### Redirect URLs
Add the following to **Redirect URLs**:
- `https://your-domain.vercel.app/**`
- `http://localhost:3000/**` (for development)

### Email Rate Limits
Default rate limits:
- 4 emails per hour per email address
- Consider adjusting for development/testing

### SMTP Configuration (Optional)
For custom SMTP (e.g., SendGrid, Resend, Mailgun):
1. Go to **Project Settings** → **Authentication** → **SMTP Settings**
2. Enable **Custom SMTP**
3. Enter your SMTP server details

