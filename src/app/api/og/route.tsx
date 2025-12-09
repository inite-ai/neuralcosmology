import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  try {
    // Get parameters if needed
    const searchParams = request.nextUrl.searchParams;
    const title = searchParams.get('title') || 'Neuralcosmology';
    
    // Instead of loading a local font, use a Google Font
    const fontData = await fetch(
      new URL('https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuGKYAZ9hiA.woff2', import.meta.url)
    ).then((res) => res.arrayBuffer());

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
            backgroundColor: '#181c2e',
            background: 'linear-gradient(to bottom right, #181c2e, #232946, #10182a)',
            position: 'relative',
          }}
        >
          {/* Cosmic particles/stars effect */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              opacity: 0.7,
              backgroundImage: 'radial-gradient(circle at 25% 25%, rgba(255, 255, 255, 0.1) 1px, transparent 1px), radial-gradient(circle at 75% 75%, rgba(255, 255, 255, 0.1) 1px, transparent 1px)',
              backgroundSize: '35px 35px',
            }}
          />

          {/* Glowing orb effect */}
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '400px',
              height: '400px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(120, 139, 255, 0.3) 0%, rgba(70, 87, 190, 0.1) 40%, transparent 70%)',
              filter: 'blur(40px)',
              zIndex: 0,
            }}
          />

          {/* Content container */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              padding: '20px',
              position: 'relative',
              zIndex: 10,
            }}
          >
            {/* Logo placeholder */}
            <div
              style={{
                color: 'white',
                fontSize: '28px',
                marginBottom: '20px',
                opacity: 0.9,
              }}
            >
              neuralcosmology.com
            </div>

            {/* Title */}
            <div
              style={{
                display: 'flex',
                color: 'white',
                fontSize: '72px',
                fontWeight: 'bold',
                fontFamily: 'Inter',
                letterSpacing: '-0.05em',
                marginBottom: '20px',
                background: 'linear-gradient(to right, #a78bfa, #ffffff, #c084fc)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                textShadow: '0 8px 30px rgba(60, 60, 180, 0.3)',
              }}
            >
              {title}
            </div>

            {/* Subtitle */}
            <div
              style={{
                color: 'rgba(185, 212, 255, 0.9)',
                fontSize: '32px',
                fontWeight: 500,
                lineHeight: 1.4,
                marginBottom: '10px',
                maxWidth: '700px',
              }}
            >
              You&apos;re not in the world. You are the structure.
            </div>

            {/* Description */}
            <div
              style={{
                color: 'rgba(173, 186, 244, 0.75)',
                fontSize: '24px',
                maxWidth: '650px',
                lineHeight: 1.3,
              }}
            >
              A system of reality navigation through states, memory, and attention.
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
        fonts: [
          {
            name: 'Inter',
            data: fontData,
            style: 'normal',
          },
        ],
      }
    );
  } catch (e) {
    console.error(e);
    return new Response(`Failed to generate image`, {
      status: 500,
    });
  }
} 