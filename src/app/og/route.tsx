import { ImageResponse } from 'next/og'

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#f8fafc',
          backgroundImage: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
        }}
      >
        {/* Logo area */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 40,
          }}
        >
          <div
            style={{
              width: 80,
              height: 80,
              borderRadius: 16,
              backgroundColor: '#3b5bdb',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: 20,
            }}
          >
            <svg
              width="48"
              height="48"
              viewBox="0 0 32 32"
              fill="none"
            >
              <path d="M8 18 L10 10 L22 10 L24 18" fill="white" />
              <ellipse cx="16" cy="18" rx="8" ry="3" fill="white" />
              <ellipse cx="16" cy="10" rx="6" ry="2" fill="white" />
            </svg>
          </div>
          <span
            style={{
              fontSize: 48,
              fontWeight: 700,
              color: '#1e293b',
              letterSpacing: '-0.02em',
            }}
          >
            WhiteHatLinks
          </span>
        </div>

        {/* Tagline */}
        <div
          style={{
            fontSize: 32,
            color: '#3b5bdb',
            fontWeight: 600,
            marginBottom: 20,
          }}
        >
          Premium Backlinks Without Spam
        </div>

        {/* Description */}
        <div
          style={{
            fontSize: 24,
            color: '#64748b',
            textAlign: 'center',
            maxWidth: 800,
            lineHeight: 1.4,
          }}
        >
          High-authority, manually vetted backlinks for serious SEO
        </div>

        {/* Stats bar */}
        <div
          style={{
            display: 'flex',
            marginTop: 50,
            gap: 60,
          }}
        >
          {[
            { value: '500+', label: 'Vetted Sites' },
            { value: 'DR 50+', label: 'Avg Rating' },
            { value: '100%', label: 'White Hat' },
          ].map((stat) => (
            <div
              key={stat.label}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <span
                style={{
                  fontSize: 36,
                  fontWeight: 700,
                  color: '#3b5bdb',
                }}
              >
                {stat.value}
              </span>
              <span
                style={{
                  fontSize: 18,
                  color: '#64748b',
                }}
              >
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  )
}
