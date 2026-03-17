import { ImageResponse } from 'next/og'
import { NextRequest } from 'next/server'

export const runtime = 'edge'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)

  const title = searchParams.get('title') || 'Find Digital Asset roles that suit you'
  const subtitle = searchParams.get('subtitle') || ''

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '60px 80px',
          background: 'linear-gradient(135deg, #d4a038 0%, #c49030 50%, #b8842a 100%)',
          fontFamily: 'system-ui, sans-serif',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Decorative diamond shapes in background */}
        <div
          style={{
            position: 'absolute',
            right: '-40px',
            top: '50%',
            transform: 'translateY(-50%) rotate(45deg)',
            width: '400px',
            height: '400px',
            background: 'rgba(255,255,255,0.08)',
            display: 'flex',
          }}
        />
        <div
          style={{
            position: 'absolute',
            right: '100px',
            top: '50%',
            transform: 'translateY(-30%) rotate(45deg)',
            width: '260px',
            height: '260px',
            background: 'rgba(255,255,255,0.06)',
            display: 'flex',
          }}
        />

        {/* Top: Logo area */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {/* Diamond icon */}
          <svg width="40" height="40" viewBox="0 0 68 68" fill="none">
            <path
              d="M16 44L4 32L36 0L68 32L36 64L24 52L8 68L0 60L16 44ZM36 48L52 32L36 16L20 32L36 48Z"
              fill="white"
            />
          </svg>
          <span
            style={{
              fontSize: '28px',
              color: 'rgba(255,255,255,0.9)',
              fontWeight: 400,
              letterSpacing: '-0.01em',
            }}
          >
            DigitalAsset
            <span style={{ fontStyle: 'italic' }}>Jobs</span>
          </span>
        </div>

        {/* Bottom: Title */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxWidth: '700px' }}>
          <div
            style={{
              fontSize: title.length > 40 ? '48px' : '56px',
              fontWeight: 400,
              color: 'white',
              lineHeight: 1.15,
              letterSpacing: '-0.02em',
            }}
          >
            {title}
          </div>
          {subtitle && (
            <div
              style={{
                fontSize: '22px',
                color: 'rgba(255,255,255,0.75)',
                fontWeight: 400,
              }}
            >
              {subtitle}
            </div>
          )}
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    },
  )
}
