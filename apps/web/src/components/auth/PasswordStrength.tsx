'use client';

import { calculatePasswordStrength } from '@/lib/validation/auth';

interface PasswordStrengthProps {
  password: string;
}

export function PasswordStrength({ password }: PasswordStrengthProps) {
  if (!password) return null;

  const { label, tips } = calculatePasswordStrength(password);

  const strengthColors = {
    weak: 'bg-red-500',
    medium: 'bg-amber-500',
    strong: 'bg-green-500',
  };

  const strengthLabels = {
    weak: 'อ่อน',
    medium: 'ปานกลาง',
    strong: 'แข็งแกร่ง',
  };

  const strengthWidths = {
    weak: 'w-1/4',
    medium: 'w-2/4',
    strong: 'w-full',
  };

  return (
    <div className="mt-2 space-y-2">
      {/* Strength bar */}
      <div className="h-1.5 w-full bg-slate-700 rounded-full overflow-hidden">
        <div
          className={`h-full transition-all duration-300 ${strengthColors[label]} ${strengthWidths[label]}`}
        />
      </div>

      {/* Strength label */}
      <div className="flex justify-between items-center text-sm">
        <span className="text-slate-400">ความแข็งแกร่งของรหัสผ่าน:</span>
        <span
          className={`font-medium ${
            label === 'weak'
              ? 'text-red-400'
              : label === 'medium'
                ? 'text-amber-400'
                : 'text-green-400'
          }`}
        >
          {strengthLabels[label]}
        </span>
      </div>

      {/* Tips */}
      {tips.length > 0 && (
        <ul className="text-xs text-slate-400 space-y-1">
          {tips.map((tip, index) => (
            <li key={index} className="flex items-center gap-1">
              <span className="text-amber-400">•</span>
              {tip}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}


