import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const alt = 'ดูดวงไพ่ยิปซี';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function Image({ params }: { params: { id: string } }) {
  // Fetch reading data
  let readingData = null;
  try {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://tarot-reading-app-ebon.vercel.app';
    const response = await fetch(`${baseUrl}/api/readings/${params.id}`);
    const data = await response.json();
    if (data.success) {
      readingData = data.data;
    }
  } catch (error) {
    console.error('Error fetching reading for OG image:', error);
  }

  // If no reading data, show default image
  if (!readingData) {
    return new ImageResponse(
      (
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #1e1b4b 0%, #4c1d95 100%)',
          }}
        >
          <span style={{ fontSize: '80px' }}>🔮</span>
          <span
            style={{
              fontSize: '48px',
              fontWeight: 'bold',
              color: '#fcd34d',
              marginTop: '24px',
            }}
          >
            ดูดวงไพ่ยิปซี
          </span>
        </div>
      ),
      { ...size }
    );
  }

  const { readingType, cards } = readingData;

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 30%, #4c1d95 70%, #1e1b4b 100%)',
          fontFamily: 'sans-serif',
          position: 'relative',
        }}
      >
        {/* Decorative stars */}
        <div style={{ position: 'absolute', top: '40px', left: '60px', fontSize: '32px', opacity: 0.6 }}>
          ✨
        </div>
        <div style={{ position: 'absolute', top: '80px', right: '100px', fontSize: '24px', opacity: 0.5 }}>
          ⭐
        </div>
        <div style={{ position: 'absolute', bottom: '100px', left: '120px', fontSize: '20px', opacity: 0.4 }}>
          🌙
        </div>

        {/* Title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
          <span style={{ fontSize: '48px' }}>🔮</span>
          <span
            style={{
              fontSize: '36px',
              fontWeight: 'bold',
              color: '#fcd34d',
              textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
            }}
          >
            ดูดวงไพ่ยิปซี
          </span>
        </div>

        {/* Reading Type Badge */}
        <div
          style={{
            display: 'flex',
            padding: '8px 24px',
            background: 'rgba(168, 85, 247, 0.3)',
            borderRadius: '999px',
            border: '1px solid rgba(168, 85, 247, 0.5)',
            marginBottom: '32px',
          }}
        >
          <span style={{ color: '#e9d5ff', fontSize: '18px' }}>
            {readingType === 'daily' ? '☀️ ดูดวงประจำวัน' : '🌙 ไพ่ 3 ใบ'}
          </span>
        </div>

        {/* Cards Display */}
        <div
          style={{
            display: 'flex',
            gap: readingType === 'daily' ? '0' : '24px',
            alignItems: 'flex-start',
            marginBottom: '32px',
          }}
        >
          {cards.map(
            (
              card: {
                position: number;
                positionLabel: string | null;
                isReversed: boolean;
                card: { name: string; nameTh: string };
              },
              index: number
            ) => (
              <div
                key={index}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                {/* Position Label for 3-card */}
                {card.positionLabel && (
                  <div
                    style={{
                      display: 'flex',
                      padding: '4px 12px',
                      background:
                        card.positionLabel === 'past'
                          ? 'rgba(59, 130, 246, 0.3)'
                          : card.positionLabel === 'present'
                            ? 'rgba(168, 85, 247, 0.3)'
                            : 'rgba(251, 191, 36, 0.3)',
                      borderRadius: '999px',
                      fontSize: '14px',
                      color: '#fff',
                    }}
                  >
                    {card.positionLabel === 'past'
                      ? '⏪ อดีต'
                      : card.positionLabel === 'present'
                        ? '⏺️ ปัจจุบัน'
                        : '⏩ อนาคต'}
                  </div>
                )}

                {/* Card Placeholder */}
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: readingType === 'daily' ? '180px' : '140px',
                    height: readingType === 'daily' ? '280px' : '220px',
                    background: 'linear-gradient(135deg, #7c3aed 0%, #4f46e5 50%, #6366f1 100%)',
                    borderRadius: '12px',
                    border: '3px solid #fcd34d',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
                    transform: card.isReversed ? 'rotate(180deg)' : 'none',
                  }}
                >
                  <span style={{ fontSize: '64px' }}>🎴</span>
                </div>

                {/* Card Name */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '8px' }}>
                  <span
                    style={{
                      fontSize: readingType === 'daily' ? '24px' : '18px',
                      fontWeight: 'bold',
                      color: '#fcd34d',
                      textShadow: '1px 1px 2px rgba(0,0,0,0.3)',
                    }}
                  >
                    {card.card.nameTh}
                  </span>
                  <span
                    style={{
                      fontSize: readingType === 'daily' ? '16px' : '14px',
                      color: '#c4b5fd',
                    }}
                  >
                    {card.card.name}
                  </span>
                  {card.isReversed && (
                    <span style={{ fontSize: '12px', color: '#f472b6', marginTop: '4px' }}>🔄 กลับหัว</span>
                  )}
                </div>
              </div>
            )
          )}
        </div>

        {/* Footer Branding */}
        <div
          style={{
            position: 'absolute',
            bottom: '24px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 20px',
            background: 'rgba(0,0,0,0.3)',
            borderRadius: '999px',
          }}
        >
          <span style={{ fontSize: '20px' }}>🔮</span>
          <span style={{ color: '#e9d5ff', fontSize: '14px' }}>tarot-reading-app-ebon.vercel.app</span>
        </div>
      </div>
    ),
    { ...size }
  );
}

