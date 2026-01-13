/**
 * Cancellation Modal with Multi-Step Flow
 * Survey → Retention Offers → Final Confirmation
 * Story 6.11 - Cancellation & Retention Flow
 */
'use client';

import { useState } from 'react';
import { X, AlertTriangle, CheckCircle } from 'lucide-react';
import { SubscriptionTier } from '@/types/subscription';
import { getTierNameTh } from '@/lib/subscription';
import { RetentionOffers } from './RetentionOffers';
import { format } from 'date-fns';
import { th } from 'date-fns/locale';

type Step = 'survey' | 'retention' | 'confirmation' | 'success';
type CancelOption = 'end_of_period' | 'immediate';

interface CancellationModalProps {
  isOpen: boolean;
  onClose: () => void;
  subscriptionId: string;
  currentTier: SubscriptionTier;
  currentPeriodEnd: Date;
  onCancelled?: () => void;
}

const CANCELLATION_REASONS = [
  { id: 'too_expensive', label: 'ราคาแพงเกินไป' },
  { id: 'not_using', label: 'ไม่ได้ใช้บ่อยพอ' },
  { id: 'missing_features', label: 'ขาดฟีเจอร์ที่ต้องการ' },
  { id: 'found_alternative', label: 'เจอทางเลือกที่ดีกว่า' },
  { id: 'technical_issues', label: 'มีปัญหาทางเทคนิค' },
  { id: 'temporary', label: 'หยุดพักชั่วคราว' },
  { id: 'other', label: 'อื่นๆ' },
];

export function CancellationModal({
  isOpen,
  onClose,
  subscriptionId,
  currentTier,
  currentPeriodEnd,
  onCancelled,
}: CancellationModalProps) {
  const [step, setStep] = useState<Step>('survey');
  const [reason, setReason] = useState('');
  const [feedback, setFeedback] = useState('');
  const [cancelOption, setCancelOption] = useState<CancelOption>('end_of_period');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState('');

  const tierName = getTierNameTh(currentTier);

  const handleSurveyNext = () => {
    if (!reason) {
      setError('กรุณาเลือกเหตุผล');
      return;
    }
    setError(null);
    setStep('retention');
  };

  const handleAcceptOffer = async (offer: { action: string }) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/subscriptions/${subscriptionId}/retention`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: offer.action,
          reason,
          feedback,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'เกิดข้อผิดพลาด');
      }

      // Show success message based on offer type
      if (offer.action === 'pause') {
        setSuccessMessage('หยุดพักชั่วคราวสำเร็จ! คุณสามารถกลับมาใช้งานได้ทุกเมื่อ');
      } else if (offer.action.startsWith('discount')) {
        setSuccessMessage('รับส่วนลดสำเร็จ! ส่วนลด 20% จะถูกนำไปใช้กับ 3 รอบบิลถัดไป');
      } else if (offer.action.startsWith('downgrade')) {
        setSuccessMessage('ลดระดับสำเร็จ! การเปลี่ยนแปลงจะมีผลในรอบบิลถัดไป');
      } else {
        setSuccessMessage('บันทึก feedback สำเร็จ! ขอบคุณสำหรับความคิดเห็น');
      }

      setStep('success');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'เกิดข้อผิดพลาด');
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmCancel = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/subscriptions/${subscriptionId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          immediate: cancelOption === 'immediate',
          reason,
          feedback,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'เกิดข้อผิดพลาด');
      }

      if (cancelOption === 'immediate') {
        setSuccessMessage('ยกเลิกสมาชิกเรียบร้อยแล้ว');
      } else {
        setSuccessMessage(`ยกเลิกสมาชิกเรียบร้อยแล้ว คุณยังใช้งานได้จนถึง ${format(currentPeriodEnd, 'd MMMM yyyy', { locale: th })}`);
      }

      setStep('success');
      onCancelled?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'เกิดข้อผิดพลาด');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    // Reset state
    setStep('survey');
    setReason('');
    setFeedback('');
    setCancelOption('end_of_period');
    setError(null);
    setSuccessMessage('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-lg mx-4 bg-gradient-to-b from-slate-900 to-purple-950 border border-purple-700 rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-1 text-slate-400 hover:text-white transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Step: Survey */}
        {step === 'survey' && (
          <div className="p-6">
            <h2 className="text-xl font-bold text-white mb-1">
              ยกเลิกแพ็คเกจ {tierName}
            </h2>
            <p className="text-purple-200 text-sm mb-6">
              เราเสียใจที่คุณจะจากไป ช่วยบอกเราได้ไหมว่าทำไมถึงยกเลิก?
            </p>

            {/* Reason Selection */}
            <div className="space-y-2 mb-4">
              <label className="text-sm font-medium text-purple-200">
                เหตุผลหลัก <span className="text-red-400">*</span>
              </label>
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
                    name="reason"
                    value={r.id}
                    checked={reason === r.id}
                    onChange={(e) => setReason(e.target.value)}
                    className="w-4 h-4 text-purple-500"
                  />
                  <span className="text-white">{r.label}</span>
                </label>
              ))}
            </div>

            {/* Feedback */}
            <div className="mb-4">
              <label className="text-sm font-medium text-purple-200 block mb-2">
                ข้อเสนอแนะเพิ่มเติม (ไม่บังคับ)
              </label>
              <textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="มีอะไรที่เราสามารถปรับปรุงได้บ้าง?"
                className="w-full px-3 py-2 bg-white/10 border border-purple-500/50 rounded-lg text-white placeholder:text-purple-300/50 focus:outline-none focus:border-purple-400 resize-none"
                rows={3}
              />
            </div>

            {error && (
              <div className="mb-4 text-red-400 text-sm">{error}</div>
            )}

            <div className="flex gap-3">
              <button
                onClick={handleClose}
                className="flex-1 px-4 py-2 text-purple-200 hover:text-white hover:bg-purple-800/50 rounded-lg transition-colors"
              >
                ยกเลิก
              </button>
              <button
                onClick={handleSurveyNext}
                className="flex-1 px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg font-medium transition-colors"
              >
                ถัดไป
              </button>
            </div>
          </div>
        )}

        {/* Step: Retention Offers */}
        {step === 'retention' && (
          <div className="p-6">
            <RetentionOffers
              reason={reason}
              currentTier={currentTier}
              onAcceptOffer={handleAcceptOffer}
              onDecline={() => setStep('confirmation')}
              isLoading={isLoading}
            />
            {error && (
              <div className="mt-4 text-red-400 text-sm text-center">{error}</div>
            )}
          </div>
        )}

        {/* Step: Final Confirmation */}
        {step === 'confirmation' && (
          <div className="p-6">
            <div className="text-center mb-6">
              <AlertTriangle className="w-12 h-12 text-yellow-400 mx-auto mb-3" />
              <h3 className="text-xl font-bold text-white mb-2">ยืนยันการยกเลิก</h3>
              <p className="text-purple-200 text-sm">
                เลือกวิธีการยกเลิกที่ต้องการ
              </p>
            </div>

            <div className="space-y-3 mb-6">
              {/* End of Period Option */}
              <label
                className={`block p-4 rounded-lg cursor-pointer transition-colors ${
                  cancelOption === 'end_of_period'
                    ? 'bg-purple-600/30 border-2 border-purple-500'
                    : 'bg-white/5 border-2 border-transparent hover:bg-white/10'
                }`}
              >
                <div className="flex items-start gap-3">
                  <input
                    type="radio"
                    name="cancelOption"
                    value="end_of_period"
                    checked={cancelOption === 'end_of_period'}
                    onChange={() => setCancelOption('end_of_period')}
                    className="w-4 h-4 mt-1 text-purple-500"
                  />
                  <div>
                    <div className="font-semibold text-white">
                      ยกเลิกเมื่อสิ้นสุดรอบบิล (แนะนำ)
                    </div>
                    <p className="text-sm text-purple-300 mt-1">
                      ใช้งานต่อได้จนถึง {format(currentPeriodEnd, 'd MMMM yyyy', { locale: th })}
                    </p>
                  </div>
                </div>
              </label>

              {/* Immediate Option */}
              <label
                className={`block p-4 rounded-lg cursor-pointer transition-colors ${
                  cancelOption === 'immediate'
                    ? 'bg-red-600/20 border-2 border-red-500'
                    : 'bg-white/5 border-2 border-transparent hover:bg-white/10'
                }`}
              >
                <div className="flex items-start gap-3">
                  <input
                    type="radio"
                    name="cancelOption"
                    value="immediate"
                    checked={cancelOption === 'immediate'}
                    onChange={() => setCancelOption('immediate')}
                    className="w-4 h-4 mt-1 text-red-500"
                  />
                  <div>
                    <div className="font-semibold text-white">
                      ยกเลิกทันที
                    </div>
                    <p className="text-sm text-red-300 mt-1">
                      หยุดใช้งานทันทีและไม่มีการคืนเงิน
                    </p>
                  </div>
                </div>
              </label>
            </div>

            {error && (
              <div className="mb-4 text-red-400 text-sm text-center">{error}</div>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => setStep('retention')}
                disabled={isLoading}
                className="flex-1 px-4 py-2 text-purple-200 hover:text-white hover:bg-purple-800/50 rounded-lg transition-colors disabled:opacity-50"
              >
                กลับ
              </button>
              <button
                onClick={handleConfirmCancel}
                disabled={isLoading}
                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
              >
                {isLoading ? 'กำลังยกเลิก...' : 'ยืนยันยกเลิก'}
              </button>
            </div>
          </div>
        )}

        {/* Step: Success */}
        {step === 'success' && (
          <div className="p-6 text-center">
            <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">สำเร็จ!</h3>
            <p className="text-purple-200 mb-6">{successMessage}</p>
            <button
              onClick={handleClose}
              className="px-6 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg font-medium transition-colors"
            >
              ปิด
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default CancellationModal;
