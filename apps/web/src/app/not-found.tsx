'use client';

import Link from 'next/link';
import Lottie from 'lottie-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import crystalBallAnimation from '../../public/animations/crystal-ball.json';

/**
 * Custom 404 Not Found page
 * Provides consistent styling and helpful navigation
 */
export default function NotFound() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-b from-slate-900 via-purple-950/20 to-slate-900 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          {/* Mystical 404 Icon with Lottie Animation */}
          <div className="relative w-40 h-40 mx-auto mb-8">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/30 to-amber-500/30 rounded-full blur-xl" />
            <Lottie
              animationData={crystalBallAnimation}
              loop={true}
              autoplay={true}
              style={{ width: 160, height: 160 }}
            />
          </div>

          {/* Title */}
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-amber-400 mb-4">
            ไม่พบหน้านี้
          </h1>

          {/* Description */}
          <p className="text-slate-400 mb-8">
            ดูเหมือนว่าไพ่ใบนี้หายไปจากสำรับ... 
            <br />
            หน้าที่คุณกำลังค้นหาไม่มีอยู่หรือถูกย้ายไปแล้ว
          </p>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/"
              className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-medium rounded-xl transition-all duration-300"
            >
              🏠 กลับหน้าแรก
            </Link>
            <Link
              href="/reading"
              className="inline-flex items-center justify-center px-6 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium rounded-xl transition-colors"
            >
              🔮 ดูดวง
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}


