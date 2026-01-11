/**
 * Invoice Card Component
 * Displays individual invoice with download/view options
 */

'use client';

import { useState } from 'react';
import { 
  FileText, 
  Download, 
  ExternalLink, 
  MoreVertical,
  CheckCircle,
  Clock,
  XCircle,
} from 'lucide-react';

interface InvoiceData {
  id: string;
  stripe_invoice_number: string | null;
  amount: number;
  currency: string;
  status: string;
  paid_at: Date | null;
  period_start: Date | null;
  period_end: Date | null;
  invoice_pdf_url: string | null;
  hosted_invoice_url: string | null;
  created_at: Date;
}

interface InvoiceCardProps {
  invoice: InvoiceData;
}

export function InvoiceCard({ invoice }: InvoiceCardProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  
  // Format amount in Thai Baht
  const formatAmount = (amount: number, currency: string) => {
    if (currency === 'thb') {
      return `฿${(amount / 100).toLocaleString('th-TH', { minimumFractionDigits: 2 })}`;
    }
    return `${(amount / 100).toLocaleString('en-US', { style: 'currency', currency })}`;
  };
  
  // Format date in Thai
  const formatDate = (date: Date | null) => {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('th-TH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };
  
  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-700">
            <CheckCircle className="w-3 h-3" />
            ชำระแล้ว
          </span>
        );
      case 'open':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-700">
            <Clock className="w-3 h-3" />
            รอชำระ
          </span>
        );
      case 'void':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-700">
            <XCircle className="w-3 h-3" />
            ยกเลิก
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-600">
            {status}
          </span>
        );
    }
  };
  
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 md:p-6 hover:shadow-md transition-shadow">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Invoice Info */}
        <div className="flex items-start gap-4">
          <div className="p-3 bg-purple-100 rounded-lg">
            <FileText className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-semibold text-gray-900">
                {invoice.stripe_invoice_number || `INV-${invoice.id.slice(0, 8)}`}
              </span>
              {getStatusBadge(invoice.status)}
            </div>
            <p className="text-sm text-gray-500">
              {formatDate(invoice.paid_at || invoice.created_at)}
            </p>
            {invoice.period_start && invoice.period_end && (
              <p className="text-xs text-gray-400 mt-1">
                สำหรับงวด: {formatDate(invoice.period_start)} - {formatDate(invoice.period_end)}
              </p>
            )}
          </div>
        </div>
        
        {/* Amount & Actions */}
        <div className="flex items-center gap-4">
          <span className="text-xl font-bold text-gray-900">
            {formatAmount(invoice.amount, invoice.currency)}
          </span>
          
          {/* Actions Menu */}
          <div className="relative">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="เมนู"
            >
              <MoreVertical className="w-5 h-5 text-gray-500" />
            </button>
            
            {menuOpen && (
              <>
                <div 
                  className="fixed inset-0 z-10"
                  onClick={() => setMenuOpen(false)}
                />
                <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20">
                  {invoice.invoice_pdf_url && (
                    <a
                      href={invoice.invoice_pdf_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      onClick={() => setMenuOpen(false)}
                    >
                      <Download className="w-4 h-4" />
                      ดาวน์โหลด PDF
                    </a>
                  )}
                  {invoice.hosted_invoice_url && (
                    <a
                      href={invoice.hosted_invoice_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      onClick={() => setMenuOpen(false)}
                    >
                      <ExternalLink className="w-4 h-4" />
                      ดูออนไลน์
                    </a>
                  )}
                  {!invoice.invoice_pdf_url && !invoice.hosted_invoice_url && (
                    <span className="block px-4 py-2 text-sm text-gray-400">
                      ไม่มีไฟล์ใบแจ้งหนี้
                    </span>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
