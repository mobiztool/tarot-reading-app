/**
 * AI Interpretation Display Component
 * Story 9.2: AI-Powered Personalized Interpretations
 * 
 * Displays the AI-generated personalized interpretation
 */

'use client';

import { motion } from 'framer-motion';

interface AIInterpretationProps {
  interpretation: string;
  cached?: boolean;
  className?: string;
}

export function AIInterpretation({
  interpretation,
  cached = false,
  className = '',
}: AIInterpretationProps) {
  // Split interpretation into paragraphs for better display
  const paragraphs = interpretation
    .split('\n')
    .filter((p) => p.trim().length > 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className={`relative ${className}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-2xl">✨</span>
          <h3 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-pink-300">
            AI คำทำนายส่วนตัว
          </h3>
        </div>
        {cached && (
          <span className="px-2 py-1 bg-purple-500/20 text-purple-300 text-xs rounded-full">
            จากแคช
          </span>
        )}
      </div>

      {/* Decorative border */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-purple-500/20 blur-sm -z-10" />

      {/* Content */}
      <div className="bg-gradient-to-br from-purple-900/40 to-pink-900/40 border border-purple-500/30 rounded-2xl p-6">
        {/* VIP Badge */}
        <div className="flex items-center gap-2 mb-4 pb-4 border-b border-purple-500/20">
          <span className="px-3 py-1 bg-gradient-to-r from-yellow-400/20 to-amber-400/20 border border-yellow-500/30 text-yellow-300 text-xs font-medium rounded-full flex items-center gap-1">
            <span>👑</span>
            <span>VIP Exclusive</span>
          </span>
          <span className="text-purple-400/60 text-xs">
            สร้างโดย AI เฉพาะสำหรับคุณ
          </span>
        </div>

        {/* Interpretation content */}
        <div className="space-y-4">
          {paragraphs.map((paragraph, index) => {
            // Check if it's a header (starts with # or **)
            const isHeader = paragraph.startsWith('#') || paragraph.startsWith('**');
            
            if (isHeader) {
              const cleanHeader = paragraph
                .replace(/^#+\s*/, '')
                .replace(/\*\*/g, '');
              return (
                <h4
                  key={index}
                  className="text-lg font-semibold text-purple-200 mt-4 first:mt-0"
                >
                  {cleanHeader}
                </h4>
              );
            }

            // Check if it's a bullet point
            if (paragraph.startsWith('-') || paragraph.startsWith('•')) {
              return (
                <div key={index} className="flex items-start gap-2 pl-2">
                  <span className="text-purple-400 mt-1">•</span>
                  <p className="text-slate-200 leading-relaxed">
                    {paragraph.replace(/^[-•]\s*/, '')}
                  </p>
                </div>
              );
            }

            // Regular paragraph
            return (
              <p key={index} className="text-slate-200 leading-relaxed">
                {paragraph}
              </p>
            );
          })}
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-purple-500/20">
          <p className="text-xs text-purple-400/60 flex items-center gap-2">
            <span>💡</span>
            <span>
              คำทำนายนี้สร้างโดย AI เป็นเพียงแนวทาง ใช้วิจารณญาณของคุณประกอบเสมอ
            </span>
          </p>
        </div>
      </div>
    </motion.div>
  );
}

export default AIInterpretation;
