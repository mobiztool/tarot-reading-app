'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '@/lib/hooks';

interface ReadingNotesProps {
  readingId: string;
  initialNotes?: string | null;
  onSave?: (notes: string) => void;
}

const MAX_CHARACTERS = 2000;

export function ReadingNotes({ readingId, initialNotes, onSave }: ReadingNotesProps) {
  const { isAuthenticated } = useAuth();
  const [notes, setNotes] = useState(initialNotes || '');
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-save with debounce
  const saveNotes = useCallback(
    async (notesText: string) => {
      if (!isAuthenticated) return;

      setIsSaving(true);
      setError(null);

      try {
        const response = await fetch(`/api/readings/${readingId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ notes: notesText }),
        });

        const data = await response.json();

        if (data.success) {
          setLastSaved(new Date());
          onSave?.(notesText);
        } else {
          throw new Error(data.error || 'Failed to save notes');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'เกิดข้อผิดพลาด');
      } finally {
        setIsSaving(false);
      }
    },
    [readingId, isAuthenticated, onSave]
  );

  // Handle text change with debounce
  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newNotes = e.target.value;
    if (newNotes.length <= MAX_CHARACTERS) {
      setNotes(newNotes);

      // Clear existing debounce timer
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      // Set new debounce timer (auto-save after 1.5 seconds)
      debounceTimerRef.current = setTimeout(() => {
        saveNotes(newNotes);
      }, 1500);
    }
  };

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  if (!isAuthenticated) {
    return (
      <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-purple-300 mb-3 flex items-center gap-2">
          📝 บันทึกส่วนตัว
        </h3>
        <p className="text-slate-400 text-sm mb-4">
          เข้าสู่ระบบเพื่อบันทึกโน้ตส่วนตัวสำหรับการดูดวงนี้
        </p>
        <a
          href="/auth/login"
          className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white text-sm rounded-lg transition-colors"
        >
          เข้าสู่ระบบ
        </a>
      </div>
    );
  }

  return (
    <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-purple-300 flex items-center gap-2">
          📝 บันทึกส่วนตัว
        </h3>
        <div className="flex items-center gap-2 text-sm">
          {isSaving && (
            <span className="text-amber-400 flex items-center gap-1">
              <span className="animate-spin">⏳</span> กำลังบันทึก...
            </span>
          )}
          {lastSaved && !isSaving && (
            <span className="text-green-400 flex items-center gap-1">
              ✅ บันทึกแล้ว
            </span>
          )}
          {error && <span className="text-red-400">{error}</span>}
        </div>
      </div>

      <textarea
        value={notes}
        onChange={handleNotesChange}
        placeholder="เขียนความคิดเห็น การตีความส่วนตัว หรือสิ่งที่รู้สึกจากการดูดวงครั้งนี้..."
        className="w-full h-32 px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 resize-none transition-all"
      />

      <div className="flex items-center justify-between mt-2 text-sm">
        <span className="text-slate-500">
          บันทึกอัตโนมัติเมื่อหยุดพิมพ์
        </span>
        <span
          className={`${notes.length >= MAX_CHARACTERS * 0.9 ? 'text-amber-400' : 'text-slate-500'}`}
        >
          {notes.length}/{MAX_CHARACTERS}
        </span>
      </div>
    </div>
  );
}


