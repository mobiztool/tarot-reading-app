/**
 * Invoice List Page
 * Shows all invoices and receipts for the user
 */

import { redirect } from 'next/navigation';
import Link from 'next/link';
import { FileText, ArrowLeft, Receipt } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import prisma from '@/lib/prisma';
import { InvoiceCard } from '@/components/invoices';

export const metadata = {
  title: 'ใบแจ้งหนี้และใบเสร็จ | ดูดวงไพ่ยิปซี',
  description: 'ดูประวัติการชำระเงินและดาวน์โหลดใบเสร็จ',
};

export default async function InvoicesPage() {
  const supabase = await createClient();
  const { data: { user: authUser } } = await supabase.auth.getUser();
  
  if (!authUser) {
    redirect('/auth/login?redirect=/profile/invoices');
  }
  
  // Fetch invoices for the user
  const invoices = await prisma.invoice.findMany({
    where: { user_id: authUser.id },
    orderBy: { paid_at: 'desc' },
    include: {
      subscription: true,
    },
  });
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-950 via-purple-900 to-indigo-950 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link 
            href="/profile/billing"
            className="inline-flex items-center gap-2 text-purple-300 hover:text-white mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            กลับไปหน้าจัดการสมาชิก
          </Link>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <Receipt className="w-8 h-8 text-purple-400" />
            ใบแจ้งหนี้และใบเสร็จ
          </h1>
          <p className="text-purple-200 mt-2">
            ดูประวัติการชำระเงินทั้งหมดและดาวน์โหลดใบเสร็จ
          </p>
        </div>
        
        {/* Invoice List */}
        {invoices.length === 0 ? (
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-12 border border-purple-500/30 text-center">
            <FileText className="w-16 h-16 text-purple-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-white mb-2">
              ยังไม่มีใบแจ้งหนี้
            </h2>
            <p className="text-purple-200 mb-6">
              ใบแจ้งหนี้และใบเสร็จจะแสดงที่นี่หลังจากการชำระเงินแต่ละครั้ง
            </p>
            <Link
              href="/pricing"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500 to-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-purple-600 hover:to-indigo-700 transition-all"
            >
              ดูแพ็คเกจ
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Summary Card */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-purple-500/30 mb-6">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-purple-300 text-sm">จำนวนใบแจ้งหนี้</p>
                  <p className="text-2xl font-bold text-white">{invoices.length}</p>
                </div>
                <div>
                  <p className="text-purple-300 text-sm">ชำระแล้ว</p>
                  <p className="text-2xl font-bold text-green-400">
                    {invoices.filter(i => i.status === 'paid').length}
                  </p>
                </div>
                <div className="col-span-2 md:col-span-1">
                  <p className="text-purple-300 text-sm">ยอดรวม</p>
                  <p className="text-2xl font-bold text-white">
                    ฿{(invoices.reduce((sum, inv) => sum + (inv.status === 'paid' ? inv.amount : 0), 0) / 100).toLocaleString('th-TH', { minimumFractionDigits: 2 })}
                  </p>
                </div>
              </div>
            </div>
            
            {/* Invoice Cards */}
            {invoices.map((invoice) => (
              <InvoiceCard 
                key={invoice.id} 
                invoice={{
                  ...invoice,
                  paid_at: invoice.paid_at,
                  period_start: invoice.period_start,
                  period_end: invoice.period_end,
                  created_at: invoice.created_at,
                }}
              />
            ))}
          </div>
        )}
        
        {/* Help Section */}
        <div className="mt-8 text-center">
          <p className="text-purple-300 text-sm">
            ต้องการความช่วยเหลือเกี่ยวกับใบแจ้งหนี้? ติดต่อ{' '}
            <a href="mailto:support@tarot.app" className="text-purple-400 hover:text-white underline">
              support@tarot.app
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
