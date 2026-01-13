'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  updateProfileSchema,
  UpdateProfileFormData,
  changePasswordSchema,
  ChangePasswordFormData,
} from '@/lib/validation/auth';
import { createClient } from '@/lib/supabase/client';
import { useAuth, useAnalytics } from '@/lib/hooks';
import type { User } from '@supabase/supabase-js';
import { ProfilePicture } from '@/components/profile';
import { PasswordStrength } from '@/components/auth';
import { Header } from '@/components/layout/Header';
import { format } from 'date-fns';
import { PageLoader } from '@/components/ui/MysticalLoader';
import { th } from 'date-fns/locale';

interface UserProfile {
  id: string;
  email: string;
  name: string | null;
  profile_picture_url: string | null;
  created_at: string;
  last_login_at: string | null;
}

export default function ProfilePage() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const { track } = useAnalytics();
  const supabase = createClient();

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const {
    register: registerProfile,
    handleSubmit: handleProfileSubmit,
    formState: { errors: profileErrors },
    reset: resetProfileForm,
  } = useForm<UpdateProfileFormData>({
    resolver: zodResolver(updateProfileSchema),
  });

  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    formState: { errors: passwordErrors },
    reset: resetPasswordForm,
    watch: watchPassword,
  } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
  });

  const newPassword = watchPassword('newPassword', '');

  // Fetch user profile
  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;

      try {
        // First, try to get the user from our users table
        const { data, error: fetchError } = await supabase
          .from('users')
          .select('*')
          .eq('id', user.id)
          .single();

        if (fetchError && fetchError.code !== 'PGRST116') {
          // PGRST116 means no rows found
          console.error('Error fetching profile:', fetchError);
        }

        if (data) {
          setProfile(data);
          resetProfileForm({ name: data.name || '' });
        } else {
          // Create profile if it doesn't exist
          const newProfile: UserProfile = {
            id: user.id,
            email: user.email || '',
            name: user.user_metadata?.name || null,
            profile_picture_url: user.user_metadata?.avatar_url || null,
            created_at: user.created_at,
            last_login_at: user.last_sign_in_at || null,
          };

          const { error: createError } = await supabase.from('users').insert({
            id: user.id,
            email: user.email,
            name: user.user_metadata?.name || null,
            profile_picture_url: user.user_metadata?.avatar_url || null,
            email_verified: !!user.email_confirmed_at,
          });

          if (createError) {
            console.error('Error creating profile:', createError);
          }

          setProfile(newProfile);
          resetProfileForm({ name: newProfile.name || '' });
        }
      } catch (err) {
        console.error('Profile fetch error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    if (!authLoading) {
      if (!user) {
        router.push('/auth/login?redirectTo=/profile');
      } else {
        fetchProfile();
        track('profile_viewed');
      }
    }
  }, [user, authLoading, router, supabase, resetProfileForm, track]);

  // Handle profile update
  const onProfileSubmit = async (data: UpdateProfileFormData) => {
    if (!user) return;

    setIsSaving(true);
    setError(null);

    try {
      const { error: updateError } = await supabase
        .from('users')
        .update({
          name: data.name || null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (updateError) throw updateError;

      setProfile((prev) =>
        prev ? { ...prev, name: data.name || null } : null
      );
      setIsEditing(false);
      setSuccessMessage('อัพเดทโปรไฟล์สำเร็จ');
      track('profile_updated', { field: 'name' });

      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      console.error('Update profile error:', err);
      setError('ไม่สามารถอัพเดทโปรไฟล์ได้ กรุณาลองใหม่');
    } finally {
      setIsSaving(false);
    }
  };

  // Handle profile picture upload
  const handleAvatarUpload = async (file: File) => {
    if (!user) return;

    setIsUploading(true);
    setError(null);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: true,
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from('avatars').getPublicUrl(fileName);

      // Update user profile
      const { error: updateError } = await supabase
        .from('users')
        .update({
          profile_picture_url: publicUrl,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (updateError) throw updateError;

      setProfile((prev) =>
        prev ? { ...prev, profile_picture_url: publicUrl } : null
      );
      setSuccessMessage('อัพโหลดรูปโปรไฟล์สำเร็จ');
      track('profile_updated', { field: 'profile_picture' });

      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      console.error('Upload error:', err);
      setError('ไม่สามารถอัพโหลดรูปภาพได้ กรุณาลองใหม่');
    } finally {
      setIsUploading(false);
    }
  };

  // Handle password change
  const onPasswordSubmit = async (data: ChangePasswordFormData) => {
    if (!user || !user.email) return;

    setIsSaving(true);
    setError(null);

    try {
      // Verify current password
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: data.currentPassword,
      });

      if (signInError) {
        setError('รหัสผ่านปัจจุบันไม่ถูกต้อง');
        return;
      }

      // Update password
      const { error: updateError } = await supabase.auth.updateUser({
        password: data.newPassword,
      });

      if (updateError) throw updateError;

      setShowChangePassword(false);
      resetPasswordForm();
      setSuccessMessage('เปลี่ยนรหัสผ่านสำเร็จ');
      track('password_changed');

      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      console.error('Password change error:', err);
      setError('ไม่สามารถเปลี่ยนรหัสผ่านได้ กรุณาลองใหม่');
    } finally {
      setIsSaving(false);
    }
  };

  // Handle account deletion
  const handleDeleteAccount = async () => {
    if (!user || deleteConfirmText !== 'DELETE') return;

    setIsSaving(true);
    setError(null);

    try {
      // Delete user data from our table
      const { error: deleteError } = await supabase
        .from('users')
        .delete()
        .eq('id', user.id);

      if (deleteError) throw deleteError;

      // Sign out
      await supabase.auth.signOut();
      track('account_deleted');

      // Redirect to home
      router.push('/');
      router.refresh();
    } catch (err) {
      console.error('Delete account error:', err);
      setError('ไม่สามารถลบบัญชีได้ กรุณาติดต่อฝ่ายสนับสนุน');
    } finally {
      setIsSaving(false);
    }
  };

  if (authLoading || isLoading) {
    return (
      <>
        <Header />
        <PageLoader message="กำลังโหลดโปรไฟล์..." />
      </>
    );
  }

  if (!user || !profile) {
    return null;
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-purple-950/20 to-slate-900 py-12 px-4">
        <div className="max-w-2xl mx-auto">
          {/* Success Message */}
          {successMessage && (
            <div className="mb-6 bg-green-500/10 border border-green-500/50 rounded-lg p-4 text-green-400 text-center">
              ✅ {successMessage}
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-6 bg-red-500/10 border border-red-500/50 rounded-lg p-4 text-red-400 text-center">
              ❌ {error}
            </div>
          )}

          {/* Profile Header */}
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-8 shadow-xl mb-6">
            <div className="flex flex-col md:flex-row items-center gap-6">
              {/* Profile Picture */}
              <ProfilePicture
                src={profile.profile_picture_url}
                name={profile.name || profile.email}
                size="lg"
                editable={true}
                onUpload={handleAvatarUpload}
                isUploading={isUploading}
              />

              {/* Profile Info */}
              <div className="flex-1 text-center md:text-left">
                {isEditing ? (
                  <form onSubmit={handleProfileSubmit(onProfileSubmit)}>
                    <input
                      type="text"
                      placeholder="ชื่อของคุณ"
                      className={`w-full max-w-xs px-4 py-2 bg-slate-900/50 border rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 mb-2 ${
                        profileErrors.name
                          ? 'border-red-500 focus:ring-red-500/50'
                          : 'border-slate-700 focus:ring-purple-500/50'
                      }`}
                      {...registerProfile('name')}
                    />
                    {profileErrors.name && (
                      <p className="text-sm text-red-400 mb-2">
                        {profileErrors.name.message}
                      </p>
                    )}
                    <div className="flex gap-2 justify-center md:justify-start">
                      <button
                        type="submit"
                        disabled={isSaving}
                        className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white text-sm rounded-lg transition-colors"
                      >
                        {isSaving ? 'กำลังบันทึก...' : 'บันทึก'}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setIsEditing(false);
                          resetProfileForm({ name: profile.name || '' });
                        }}
                        className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white text-sm rounded-lg transition-colors"
                      >
                        ยกเลิก
                      </button>
                    </div>
                  </form>
                ) : (
                  <>
                    <h1 className="text-2xl font-bold text-white mb-1">
                      {profile.name || 'ไม่ได้ตั้งชื่อ'}
                    </h1>
                    <p className="text-slate-400 mb-2">{profile.email}</p>
                    <p className="text-slate-500 text-sm mb-3">
                      เป็นสมาชิกตั้งแต่{' '}
                      {format(new Date(profile.created_at), 'd MMMM yyyy', {
                        locale: th,
                      })}
                    </p>
                    <button
                      onClick={() => setIsEditing(true)}
                      className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white text-sm rounded-lg transition-colors"
                    >
                      ✏️ แก้ไขโปรไฟล์
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Security Section */}
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-8 shadow-xl mb-6">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              🔐 ความปลอดภัย
            </h2>

            {/* Change Password */}
            {showChangePassword ? (
              <form onSubmit={handlePasswordSubmit(onPasswordSubmit)} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    รหัสผ่านปัจจุบัน
                  </label>
                  <input
                    type="password"
                    className={`w-full px-4 py-3 bg-slate-900/50 border rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 ${
                      passwordErrors.currentPassword
                        ? 'border-red-500 focus:ring-red-500/50'
                        : 'border-slate-700 focus:ring-purple-500/50'
                    }`}
                    placeholder="••••••••"
                    {...registerPassword('currentPassword')}
                  />
                  {passwordErrors.currentPassword && (
                    <p className="mt-1 text-sm text-red-400">
                      {passwordErrors.currentPassword.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    รหัสผ่านใหม่
                  </label>
                  <input
                    type="password"
                    className={`w-full px-4 py-3 bg-slate-900/50 border rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 ${
                      passwordErrors.newPassword
                        ? 'border-red-500 focus:ring-red-500/50'
                        : 'border-slate-700 focus:ring-purple-500/50'
                    }`}
                    placeholder="••••••••"
                    {...registerPassword('newPassword')}
                  />
                  {passwordErrors.newPassword && (
                    <p className="mt-1 text-sm text-red-400">
                      {passwordErrors.newPassword.message}
                    </p>
                  )}
                  {newPassword && <PasswordStrength password={newPassword} />}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    ยืนยันรหัสผ่านใหม่
                  </label>
                  <input
                    type="password"
                    className={`w-full px-4 py-3 bg-slate-900/50 border rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 ${
                      passwordErrors.confirmNewPassword
                        ? 'border-red-500 focus:ring-red-500/50'
                        : 'border-slate-700 focus:ring-purple-500/50'
                    }`}
                    placeholder="••••••••"
                    {...registerPassword('confirmNewPassword')}
                  />
                  {passwordErrors.confirmNewPassword && (
                    <p className="mt-1 text-sm text-red-400">
                      {passwordErrors.confirmNewPassword.message}
                    </p>
                  )}
                </div>

                <div className="flex gap-2">
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="px-6 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg transition-colors"
                  >
                    {isSaving ? 'กำลังบันทึก...' : 'เปลี่ยนรหัสผ่าน'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowChangePassword(false);
                      resetPasswordForm();
                    }}
                    className="px-6 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
                  >
                    ยกเลิก
                  </button>
                </div>
              </form>
            ) : (
              <button
                onClick={() => setShowChangePassword(true)}
                className="w-full text-left px-4 py-3 bg-slate-700/50 hover:bg-slate-700 rounded-lg transition-colors flex items-center justify-between"
              >
                <span className="text-slate-300">เปลี่ยนรหัสผ่าน</span>
                <span className="text-slate-500">→</span>
              </button>
            )}
          </div>

          {/* Quick Links */}
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-8 shadow-xl mb-6">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              🔗 ลิงก์ด่วน
            </h2>

            <div className="space-y-2">
              <Link
                href="/history"
                className="w-full text-left px-4 py-3 bg-slate-700/50 hover:bg-slate-700 rounded-lg transition-colors flex items-center justify-between"
              >
                <span className="text-slate-300">📜 ประวัติการดูดวง</span>
                <span className="text-slate-500">→</span>
              </Link>
              <Link
                href="/profile/billing"
                className="w-full text-left px-4 py-3 bg-slate-700/50 hover:bg-slate-700 rounded-lg transition-colors flex items-center justify-between"
              >
                <span className="text-slate-300">💳 การเรียกเก็บเงิน</span>
                <span className="text-slate-500">→</span>
              </Link>
              <Link
                href="/settings"
                className="w-full text-left px-4 py-3 bg-slate-700/50 hover:bg-slate-700 rounded-lg transition-colors flex items-center justify-between"
              >
                <span className="text-slate-300">⚙️ ตั้งค่า</span>
                <span className="text-slate-500">→</span>
              </Link>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="bg-red-950/20 border border-red-500/30 rounded-2xl p-8 shadow-xl">
            <h2 className="text-xl font-bold text-red-400 mb-6 flex items-center gap-2">
              ⚠️ โซนอันตราย
            </h2>

            {showDeleteConfirm ? (
              <div className="space-y-4">
                <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4">
                  <p className="text-red-300 mb-2">
                    <strong>คำเตือน:</strong> การลบบัญชีจะไม่สามารถย้อนกลับได้
                  </p>
                  <p className="text-red-300/70 text-sm">
                    ข้อมูลทั้งหมดของคุณจะถูกลบ รวมถึงประวัติการดูดวงทั้งหมด
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    พิมพ์ &quot;DELETE&quot; เพื่อยืนยัน
                  </label>
                  <input
                    type="text"
                    value={deleteConfirmText}
                    onChange={(e) => setDeleteConfirmText(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-900/50 border border-red-500/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-red-500/50"
                    placeholder="DELETE"
                  />
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={handleDeleteAccount}
                    disabled={deleteConfirmText !== 'DELETE' || isSaving}
                    className="px-6 py-2 bg-red-600 hover:bg-red-500 disabled:bg-slate-600 text-white rounded-lg transition-colors"
                  >
                    {isSaving ? 'กำลังลบ...' : 'ลบบัญชีถาวร'}
                  </button>
                  <button
                    onClick={() => {
                      setShowDeleteConfirm(false);
                      setDeleteConfirmText('');
                    }}
                    className="px-6 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
                  >
                    ยกเลิก
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="px-6 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/50 rounded-lg transition-colors"
              >
                🗑️ ลบบัญชี
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

