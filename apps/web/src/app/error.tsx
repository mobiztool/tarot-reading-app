'use client';

import { useEffect } from 'react';

/**
 * Global error boundary for unhandled errors
 * Provides consistent error UI and recovery option
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error to console (or send to error tracking service)
    console.error('Application error:', error);
  }, [error]);

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-900 via-purple-950/20 to-slate-900 flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        {/* Error Icon */}
        <div className="relative w-32 h-32 mx-auto mb-8">
          <div className="absolute inset-0 bg-gradient-to-br from-red-500/30 to-orange-500/30 rounded-full blur-xl animate-pulse" />
          <div className="relative w-full h-full bg-gradient-to-br from-slate-800 to-slate-900 rounded-full flex items-center justify-center border border-red-500/30">
            <span className="text-6xl">⚠️</span>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold text-red-400 mb-4">
          เกิดข้อผิดพลาด
        </h1>

        {/* Description */}
        <p className="text-slate-400 mb-8">
          มีบางอย่างผิดพลาด กรุณาลองใหม่อีกครั้ง
          <br />
          หากปัญหายังคงอยู่ กรุณาติดต่อเรา
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={reset}
            className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-medium rounded-xl transition-all duration-300"
          >
            🔄 ลองใหม่
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center px-6 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium rounded-xl transition-colors"
          >
            🏠 กลับหน้าแรก
          </a>
        </div>

        {/* Error details (only in development) */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-8 p-4 bg-slate-800/50 border border-slate-700 rounded-lg text-left">
            <p className="text-xs text-slate-500 font-mono break-all">
              {error.message}
            </p>
            {error.digest && (
              <p className="text-xs text-slate-600 mt-2">
                Digest: {error.digest}
              </p>
            )}
          </div>
        )}
      </div>
    </main>
  );
}


