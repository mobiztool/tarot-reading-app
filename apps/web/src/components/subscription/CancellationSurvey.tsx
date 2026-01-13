/**
 * Cancellation Survey Modal
 * Collects feedback when users cancel their subscription
 * Story 6.8 - Subscription Analytics
 */
'use client';

import { useState } from 'react';
import { AlertCircle, XCircle, X } from 'lucide-react';

export interface CancellationSurveyProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmCancel: (reason: string, feedback: string) => Promise<void>;
  tierName: string;
}

const CANCELLATION_REASONS = [
  { id: 'too_expensive', labelTh: 'ราคาแพงเกินไป', labelEn: 'Too expensive' },
  { id: 'not_using', labelTh: 'ไม่ได้ใช้บ่อย', labelEn: 'Not using enough' },
  { id: 'missing_features', labelTh: 'ขาด features ที่ต้องการ', labelEn: 'Missing features' },
  { id: 'found_alternative', labelTh: 'หาทางเลือกอื่น', labelEn: 'Found alternative' },
  { id: 'technical_issues', labelTh: 'มีปัญหาเทคนิค', labelEn: 'Technical issues' },
  { id: 'temporary', labelTh: 'หยุดพักชั่วคราว', labelEn: 'Taking a break' },
  { id: 'other', labelTh: 'อื่นๆ', labelEn: 'Other' },
];

export function CancellationSurvey({
  isOpen,
  onClose,
  onConfirmCancel,
  tierName,
}: CancellationSurveyProps) {
  const [reason, setReason] = useState('');
  const [feedback, setFeedback] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!reason) {
      setError('กรุณาเลือกเหตุผล');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await onConfirmCancel(reason, feedback);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'เกิดข้อผิดพลาด กรุณาลองใหม่');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-md mx-4 bg-gradient-to-b from-slate-900 to-purple-950 border border-purple-700 rounded-2xl shadow-2xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="p-6 pb-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <XCircle className="w-6 h-6 text-red-400" />
            ยกเลิกแพ็คเกจ {tierName}
          </h2>
          <p className="text-purple-200 mt-1 text-sm">
            เราเสียใจที่คุณจะจากไป ช่วยบอกเราได้ไหมว่าทำไมถึงยกเลิก?
          </p>
        </div>

        {/* Content */}
        <div className="px-6 pb-6 space-y-6">
          {/* Reason Selection */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-purple-200">
              เหตุผลหลักในการยกเลิก <span className="text-red-400">*</span>
            </label>
            <div className="space-y-2">
              {CANCELLATION_REASONS.map((r) => (
                <label
                  key={r.id}
                  className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                    reason === r.id
                      ? 'bg-purple-600/30 border border-purple-500'
                      : 'bg-white/5 border border-transparent hover:bg-white/10'
                  }`}
                >
                  <input
                    type="radio"
                    name="cancellation-reason"
                    value={r.id}
                    checked={reason === r.id}
                    onChange={(e) => setReason(e.target.value)}
                    className="w-4 h-4 text-purple-500 bg-slate-700 border-purple-500 focus:ring-purple-500"
                  />
                  <span className="text-white">{r.labelTh}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Additional Feedback */}
          <div className="space-y-2">
            <label htmlFor="feedback" className="text-sm font-medium text-purple-200">
              ข้อเสนอแนะเพิ่มเติม (ไม่บังคับ)
            </label>
            <textarea
              id="feedback"
              placeholder="มีอะไรที่เราสามารถปรับปรุงได้บ้าง?"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              className="w-full px-3 py-2 bg-white/10 border border-purple-500/50 rounded-lg text-white placeholder:text-purple-300/50 focus:outline-none focus:border-purple-400 resize-none"
              rows={3}
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="flex items-center gap-2 text-red-400 text-sm">
              <AlertCircle className="w-4 h-4" />
              {error}
            </div>
          )}

          {/* Warning */}
          <div className="p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg text-yellow-200 text-sm">
            <p className="font-medium">⚠️ สิ่งที่จะเกิดขึ้น:</p>
            <ul className="list-disc list-inside mt-1 space-y-1">
              <li>คุณยังใช้งานได้จนหมดรอบบิล</li>
              <li>หลังจากนั้นจะกลับเป็นแพ็คเกจฟรี</li>
              <li>สามารถสมัครใหม่ได้ทุกเมื่อ</li>
            </ul>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 text-purple-200 hover:text-white hover:bg-purple-800/50 rounded-lg transition-colors"
            >
              กลับไป
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-red-800 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors"
            >
              {isSubmitting ? 'กำลังยกเลิก...' : 'ยืนยันยกเลิก'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CancellationSurvey;
