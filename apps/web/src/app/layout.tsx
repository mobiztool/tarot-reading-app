import type { Metadata } from 'next';
import Script from 'next/script';
import { Analytics } from '@vercel/analytics/react';
import { Anuphan, Trirong } from 'next/font/google';
import { GoogleAnalytics, GrowthMetrics } from '@/components/analytics';
import { CookieConsent } from '@/components/cookies/CookieConsent';
import { WebsiteJsonLd, OrganizationJsonLd } from '@/components/seo';
import { SkipLink } from '@/components/accessibility';
import { TutorialProvider } from '@/components/onboarding';
import { CelebrationProvider } from '@/components/providers/CelebrationProvider';
import { config } from '@/lib/config';
import './globals.css';

// Configure fonts with optimization
// Anuphan - Modern Thai font for body text
const anuphan = Anuphan({
  subsets: ['thai', 'latin'],
  variable: '--font-anuphan',
  display: 'swap', // Prevents FOIT
  weight: ['400', '500', '600', '700'], // Reduced weights for smaller bundle
  preload: true,
});

// Trirong - Elegant Thai serif font for card headings
const trirong = Trirong({
  subsets: ['thai', 'latin'],
  variable: '--font-trirong',
  display: 'swap', // Prevents FOIT
  weight: ['400', '600', '700'], // Reduced weights for smaller bundle
  preload: true,
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://tarot-reading-app-ebon.vercel.app';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'ดูดวงไพ่ยิปซี - Tarot Reading App',
    template: '%s | ดูดวงไพ่ยิปซี',
  },
  description:
    'ค้นพบคำตอบและแนวทางชีวิตด้วยไพ่ยิปซี อ่านไพ่ยิปซีออนไลน์ฟรี รายวันและรายสัปดาห์ พร้อมความหมายครบ 78 ใบ',
  keywords: [
    'ไพ่ยิปซี',
    'ดูดวง',
    'tarot',
    'ไพ่ทาโรต์',
    'ดูดวงออนไลน์',
    'ดูดวงฟรี',
    'ไพ่ยิปซีความหมาย',
    'ไพ่ 3 ใบ',
    'ดูดวงประจำวัน',
  ],
  authors: [{ name: 'Tarot Reading App' }],
  creator: 'Tarot Reading App',
  publisher: 'Tarot Reading App',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: 'ดูดวงไพ่ยิปซี - เปิดเผยความลับแห่งจักรวาล',
    description:
      'ค้นพบคำตอบและแนวทางชีวิตด้วยไพ่ยิปซี 78 ใบ ดูดวงประจำวัน ไพ่ 3 ใบ พร้อมความหมายละเอียด',
    type: 'website',
    locale: 'th_TH',
    url: siteUrl,
    siteName: 'ดูดวงไพ่ยิปซี',
    images: [
      {
        url: '/api/og/reading',
        width: 1200,
        height: 630,
        alt: 'ดูดวงไพ่ยิปซี - Tarot Reading App',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ดูดวงไพ่ยิปซี - เปิดเผยความลับแห่งจักรวาล',
    description: 'ค้นพบคำตอบและแนวทางชีวิตด้วยไพ่ยิปซี 78 ใบ ดูดวงประจำวัน ไพ่ 3 ใบ',
    images: ['/api/og/reading'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    // Add when ready: google: 'your-google-verification-code',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}): React.ReactElement {
  const isProduction = config.isProduction;

  return (
    <html lang="th" className={`dark ${anuphan.variable} ${trirong.variable}`}>
      <head>
        {/* Google Analytics 4 */}
        {isProduction && config.gaMeasurementId && (
          <>
            <Script
              id="gtag-script"
              strategy="afterInteractive"
              src={`https://www.googletagmanager.com/gtag/js?id=${config.gaMeasurementId}`}
            />
            <Script
              id="gtag-init"
              strategy="afterInteractive"
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${config.gaMeasurementId}', {
                    page_path: window.location.pathname,
                  });
                `,
              }}
            />
          </>
        )}

        {/* Meta Pixel (Facebook/Instagram) */}
        {isProduction && config.metaPixelId && (
          <>
            <Script
              id="meta-pixel"
              strategy="afterInteractive"
              dangerouslySetInnerHTML={{
                __html: `
                  !function(f,b,e,v,n,t,s)
                  {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                  n.callMethod.apply(n,arguments):n.queue.push(arguments)};
                  if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
                  n.queue=[];t=b.createElement(e);t.async=!0;
                  t.src=v;s=b.getElementsByTagName(e)[0];
                  s.parentNode.insertBefore(t,s)}(window, document,'script',
                  'https://connect.facebook.net/en_US/fbevents.js');
                  fbq('init', '${config.metaPixelId}');
                  fbq('track', 'PageView');
                `,
              }}
            />
            <noscript>
              <img
                height="1"
                width="1"
                style={{ display: 'none' }}
                src={`https://www.facebook.com/tr?id=${config.metaPixelId}&ev=PageView&noscript=1`}
                alt=""
              />
            </noscript>
          </>
        )}

        {/* Hotjar */}
        {isProduction && config.hotjarId && (
          <Script
            id="hotjar"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                (function(h,o,t,j,a,r){
                  h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
                  h._hjSettings={hjid:${config.hotjarId},hjsv:6};
                  a=o.getElementsByTagName('head')[0];
                  r=o.createElement('script');r.async=1;
                  r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
                  a.appendChild(r);
                })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
              `,
            }}
          />
        )}
      </head>
      <body className="font-sans bg-slate-900 text-white antialiased">
        {/* Accessibility: Skip to main content link */}
        <SkipLink />

        {/* Structured Data */}
        <WebsiteJsonLd />
        <OrganizationJsonLd />

        {/* Main Content Area with Tutorial and Celebration */}
        <TutorialProvider>
          <CelebrationProvider>
            <div id="main-content" tabIndex={-1} className="outline-none">
              {children}
            </div>
          </CelebrationProvider>
        </TutorialProvider>

        {/* Client-side Analytics Components */}
        <GoogleAnalytics />
        <GrowthMetrics />
        <CookieConsent />

        {/* Vercel Analytics (always enabled) */}
        <Analytics />
      </body>
    </html>
  );
}
