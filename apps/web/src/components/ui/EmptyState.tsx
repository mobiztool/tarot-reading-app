'use client';

import Link from 'next/link';

interface EmptyStateProps {
  icon?: string;
  title: string;
  description?: string;
  action?: {
    label: string;
    href: string;
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
}

/**
 * Consistent empty state component for pages with no data
 */
export function EmptyState({
  icon = '📭',
  title,
  description,
  action,
  secondaryAction,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      {/* Icon */}
      <div className="w-24 h-24 mb-6 bg-gradient-to-br from-purple-500/20 to-amber-500/20 rounded-full flex items-center justify-center">
        <span className="text-5xl" role="img" aria-hidden="true">
          {icon}
        </span>
      </div>

      {/* Title */}
      <h2 className="text-xl font-bold text-slate-300 mb-2">{title}</h2>

      {/* Description */}
      {description && (
        <p className="text-slate-500 max-w-md mb-6">{description}</p>
      )}

      {/* Actions */}
      <div className="flex flex-wrap gap-3 justify-center">
        {action && (
          <Link
            href={action.href}
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-medium rounded-xl transition-all duration-300 btn-interactive"
          >
            {action.label}
          </Link>
        )}
        {secondaryAction && (
          <button
            onClick={secondaryAction.onClick}
            className="inline-flex items-center px-6 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium rounded-xl transition-colors"
          >
            {secondaryAction.label}
          </button>
        )}
      </div>
    </div>
  );
}

/**
 * Error state component
 */
export function ErrorState({
  title = 'เกิดข้อผิดพลาด',
  description = 'ไม่สามารถโหลดข้อมูลได้ กรุณาลองใหม่อีกครั้ง',
  onRetry,
}: {
  title?: string;
  description?: string;
  onRetry?: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-24 h-24 mb-6 bg-gradient-to-br from-red-500/20 to-orange-500/20 rounded-full flex items-center justify-center">
        <span className="text-5xl" role="img" aria-label="Error">
          ⚠️
        </span>
      </div>

      <h2 className="text-xl font-bold text-red-400 mb-2">{title}</h2>
      <p className="text-slate-500 max-w-md mb-6">{description}</p>

      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center px-6 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium rounded-xl transition-colors"
        >
          🔄 ลองใหม่
        </button>
      )}
    </div>
  );
}

/**
 * Not found state component
 */
export function NotFoundState({
  title = 'ไม่พบหน้านี้',
  description = 'หน้าที่คุณกำลังค้นหาไม่มีอยู่หรือถูกย้ายไปแล้ว',
}: {
  title?: string;
  description?: string;
}) {
  return (
    <EmptyState
      icon="🔍"
      title={title}
      description={description}
      action={{
        label: '🏠 กลับหน้าแรก',
        href: '/',
      }}
    />
  );
}

