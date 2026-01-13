import { z } from 'zod';

// Password validation with clear requirements
const passwordSchema = z
  .string()
  .min(8, 'รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร')
  .regex(/[A-Z]/, 'ต้องมีตัวอักษรพิมพ์ใหญ่อย่างน้อย 1 ตัว')
  .regex(/[a-z]/, 'ต้องมีตัวอักษรพิมพ์เล็กอย่างน้อย 1 ตัว')
  .regex(/[0-9]/, 'ต้องมีตัวเลขอย่างน้อย 1 ตัว');

// Signup schema
export const signupSchema = z
  .object({
    email: z.string().min(1, 'กรุณากรอกอีเมล').email('รูปแบบอีเมลไม่ถูกต้อง'),
    password: passwordSchema,
    confirmPassword: z.string(),
    termsAccepted: z
      .boolean()
      .refine((val) => val === true, 'คุณต้องยอมรับข้อกำหนดและเงื่อนไข'),
    pdpaConsent: z
      .boolean()
      .refine((val) => val === true, 'คุณต้องยินยอมให้เก็บข้อมูลส่วนบุคคล (PDPA)'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'รหัสผ่านไม่ตรงกัน',
    path: ['confirmPassword'],
  });

// Login schema
export const loginSchema = z.object({
  email: z.string().min(1, 'กรุณากรอกอีเมล').email('รูปแบบอีเมลไม่ถูกต้อง'),
  password: z.string().min(1, 'กรุณากรอกรหัสผ่าน'),
});

// Forgot password schema
export const forgotPasswordSchema = z.object({
  email: z.string().min(1, 'กรุณากรอกอีเมล').email('รูปแบบอีเมลไม่ถูกต้อง'),
});

// Reset password schema
export const resetPasswordSchema = z
  .object({
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'รหัสผ่านไม่ตรงกัน',
    path: ['confirmPassword'],
  });

// Change password schema (requires current password)
export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'กรุณากรอกรหัสผ่านปัจจุบัน'),
    newPassword: passwordSchema,
    confirmNewPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: 'รหัสผ่านไม่ตรงกัน',
    path: ['confirmNewPassword'],
  });

// Update profile schema
export const updateProfileSchema = z.object({
  name: z
    .string()
    .min(2, 'ชื่อต้องมีอย่างน้อย 2 ตัวอักษร')
    .max(50, 'ชื่อต้องไม่เกิน 50 ตัวอักษร')
    .regex(/^[a-zA-Zก-๙\s]+$/, 'ชื่อต้องมีเฉพาะตัวอักษรเท่านั้น')
    .optional()
    .or(z.literal('')),
});

export type SignupFormData = z.infer<typeof signupSchema>;
export type LoginFormData = z.infer<typeof loginSchema>;
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;
export type UpdateProfileFormData = z.infer<typeof updateProfileSchema>;

// Password strength calculation
export interface PasswordStrength {
  score: number;
  label: 'weak' | 'medium' | 'strong';
  color: string;
  tips: string[];
}

export function calculatePasswordStrength(password: string): PasswordStrength {
  let score = 0;
  const tips: string[] = [];

  if (password.length >= 8) {
    score++;
  } else {
    tips.push('เพิ่มให้มีอย่างน้อย 8 ตัวอักษร');
  }

  if (password.length >= 12) score++;

  if (/[A-Z]/.test(password)) {
    score++;
  } else {
    tips.push('เพิ่มตัวอักษรพิมพ์ใหญ่');
  }

  if (/[a-z]/.test(password)) {
    score++;
  } else {
    tips.push('เพิ่มตัวอักษรพิมพ์เล็ก');
  }

  if (/[0-9]/.test(password)) {
    score++;
  } else {
    tips.push('เพิ่มตัวเลข');
  }

  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score <= 2) {
    return { score, label: 'weak', color: 'red', tips };
  }
  if (score <= 4) {
    return { score, label: 'medium', color: 'yellow', tips };
  }
  return { score, label: 'strong', color: 'green', tips: [] };
}


