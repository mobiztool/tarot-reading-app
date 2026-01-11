'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';

interface ProfilePictureProps {
  src?: string | null;
  name?: string | null;
  size?: 'sm' | 'md' | 'lg';
  editable?: boolean;
  onUpload?: (file: File) => Promise<void>;
  isUploading?: boolean;
}

const sizeClasses = {
  sm: 'w-10 h-10 text-sm',
  md: 'w-20 h-20 text-2xl',
  lg: 'w-32 h-32 text-4xl',
};

// Generate a consistent color based on name/email
function getAvatarColor(name: string | null | undefined): string {
  const colors = [
    'from-purple-500 to-indigo-500',
    'from-pink-500 to-rose-500',
    'from-amber-500 to-orange-500',
    'from-emerald-500 to-teal-500',
    'from-blue-500 to-cyan-500',
    'from-violet-500 to-purple-500',
  ];
  
  if (!name) return colors[0];
  
  // Simple hash function
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  return colors[Math.abs(hash) % colors.length];
}

export function ProfilePicture({
  src,
  name,
  size = 'md',
  editable = false,
  onUpload,
  isUploading = false,
}: ProfilePictureProps) {
  const [error, setError] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    if (editable && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !onUpload) return;

    // Validate file
    const maxSize = 2 * 1024 * 1024; // 2MB
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];

    if (file.size > maxSize) {
      alert('ไฟล์ต้องมีขนาดไม่เกิน 2MB');
      return;
    }

    if (!allowedTypes.includes(file.type)) {
      alert('รองรับเฉพาะไฟล์ JPG, PNG, WEBP เท่านั้น');
      return;
    }

    try {
      await onUpload(file);
    } catch (err) {
      console.error('Upload error:', err);
      alert('อัพโหลดรูปภาพไม่สำเร็จ กรุณาลองใหม่');
    }

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const initials = name?.charAt(0).toUpperCase() || '?';
  const avatarColor = getAvatarColor(name);

  return (
    <div className="relative inline-block">
      {src && !error ? (
        <div
          className={`${sizeClasses[size]} relative rounded-full overflow-hidden border-2 border-purple-500/50 ${
            editable ? 'cursor-pointer hover:opacity-80 transition-opacity' : ''
          }`}
          onClick={handleClick}
        >
          <Image
            src={src}
            alt={name || 'Profile'}
            fill
            className="object-cover"
            onError={() => setError(true)}
          />
          {isUploading && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="animate-spin text-white">⏳</span>
            </div>
          )}
        </div>
      ) : (
        <div
          className={`${sizeClasses[size]} rounded-full bg-gradient-to-br ${avatarColor} flex items-center justify-center text-white font-bold border-2 border-purple-500/50 ${
            editable ? 'cursor-pointer hover:opacity-80 transition-opacity' : ''
          }`}
          onClick={handleClick}
        >
          {isUploading ? (
            <span className="animate-spin">⏳</span>
          ) : (
            initials
          )}
        </div>
      )}

      {editable && (
        <>
          {/* Edit badge */}
          <div className="absolute bottom-0 right-0 w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center border-2 border-slate-900 cursor-pointer hover:bg-purple-500 transition-colors" onClick={handleClick}>
            <span className="text-xs">📷</span>
          </div>

          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={handleFileChange}
            disabled={isUploading}
          />
        </>
      )}
    </div>
  );
}

