'use client';

/**
 * Skip to Content Link
 * Allows keyboard users to skip navigation and go directly to main content
 * Only visible when focused (Tab key)
 */
export function SkipLink() {
  return (
    <a
      href="#main-content"
      className="
        sr-only focus:not-sr-only
        focus:fixed focus:top-4 focus:left-4 focus:z-[100]
        focus:px-4 focus:py-2
        focus:bg-purple-600 focus:text-white
        focus:rounded-lg focus:shadow-lg
        focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 focus:ring-offset-slate-900
        font-medium text-sm
        transition-all duration-200
      "
    >
      ข้ามไปยังเนื้อหาหลัก
    </a>
  );
}

/**
 * Skip to Navigation Link (optional, for long pages)
 */
export function SkipToNavLink() {
  return (
    <a
      href="#main-nav"
      className="
        sr-only focus:not-sr-only
        focus:fixed focus:top-4 focus:left-48 focus:z-[100]
        focus:px-4 focus:py-2
        focus:bg-slate-700 focus:text-white
        focus:rounded-lg focus:shadow-lg
        focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-900
        font-medium text-sm
        transition-all duration-200
      "
    >
      ข้ามไปยังเมนู
    </a>
  );
}


