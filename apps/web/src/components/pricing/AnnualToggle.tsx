/**
 * Monthly/Annual Toggle Component (Annual is placeholder for future)
 */
'use client';

export function AnnualToggle() {
  return (
    <div className="flex flex-col items-center gap-4 mb-8">
      <div className="flex items-center gap-4">
        <button className="px-6 py-2 bg-purple-600 border border-purple-500 rounded-lg font-semibold text-white">
          รายเดือน
        </button>
        <button 
          className="px-6 py-2 bg-white/5 border border-purple-500/30 rounded-lg text-purple-300 cursor-not-allowed relative"
          disabled
        >
          รายปี
          <span className="absolute -top-2 -right-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs px-2 py-0.5 rounded-full animate-pulse">
            เร็วๆ นี้
          </span>
        </button>
      </div>
      <p className="text-sm text-purple-300">
        ✨ ประหยัด 20% ด้วยแผนรายปี (เร็วๆ นี้)
      </p>
    </div>
  );
}
