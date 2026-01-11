'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/hooks';

interface EditableQuestionProps {
  readingId: string;
  initialQuestion: string | null;
  onUpdate?: (question: string) => void;
}

const MAX_QUESTION_LENGTH = 500;

/**
 * Editable question component for reading detail page
 * Allows users to add or edit the question for their reading
 */
export function EditableQuestion({
  readingId,
  initialQuestion,
  onUpdate,
}: EditableQuestionProps) {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [question, setQuestion] = useState(initialQuestion || '');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSave = async () => {
    setIsSaving(true);
    setError(null);

    try {
      const response = await fetch(`/api/readings/${readingId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to save question');
      }

      onUpdate?.(question);
      setIsEditing(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'เกิดข้อผิดพลาด');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setQuestion(initialQuestion || '');
    setIsEditing(false);
    setError(null);
  };

  // Not logged in - just display
  if (!user) {
    return initialQuestion ? (
      <div className="text-center mb-8">
        <p className="text-slate-500 text-sm mb-1">คำถาม:</p>
        <p className="text-purple-300 text-lg italic">&ldquo;{initialQuestion}&rdquo;</p>
      </div>
    ) : null;
  }

  // Display mode
  if (!isEditing) {
    return (
      <div className="bg-slate-800/30 border border-slate-700/30 rounded-xl p-4 mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-slate-500">❓ คำถามของคุณ</span>
          <button
            onClick={() => setIsEditing(true)}
            className="text-sm text-purple-400 hover:text-purple-300 transition-colors"
          >
            ✏️ {initialQuestion ? 'แก้ไข' : 'เพิ่มคำถาม'}
          </button>
        </div>
        {initialQuestion ? (
          <p className="text-purple-300 text-lg italic">&ldquo;{initialQuestion}&rdquo;</p>
        ) : (
          <p className="text-slate-500 text-sm">ยังไม่ได้ระบุคำถาม</p>
        )}
      </div>
    );
  }

  // Edit mode
  return (
    <div className="bg-slate-800/50 border border-purple-500/30 rounded-xl p-4 mb-8">
      <label htmlFor="edit-question" className="block text-sm text-purple-300 mb-2">
        ❓ คำถามของคุณ
      </label>
      <textarea
        id="edit-question"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder="พิมพ์คำถามของคุณ..."
        rows={3}
        maxLength={MAX_QUESTION_LENGTH}
        className="w-full bg-slate-900/50 border border-slate-600/50 rounded-lg p-3 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 resize-none"
        aria-describedby="question-char-count"
      />
      
      <div className="flex items-center justify-between mt-2">
        <span id="question-char-count" className="text-xs text-slate-500">
          {question.length}/{MAX_QUESTION_LENGTH}
        </span>

        <div className="flex gap-2">
          <button
            onClick={handleCancel}
            disabled={isSaving}
            className="px-4 py-2 text-sm text-slate-400 hover:text-slate-300 transition-colors"
          >
            ยกเลิก
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-4 py-2 text-sm bg-purple-600 hover:bg-purple-500 disabled:bg-slate-600 text-white rounded-lg transition-colors"
          >
            {isSaving ? 'กำลังบันทึก...' : 'บันทึก'}
          </button>
        </div>
      </div>

      {error && (
        <p className="mt-2 text-sm text-red-400" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}


