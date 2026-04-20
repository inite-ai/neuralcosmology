import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

const KIND_LABELS: Record<string, string> = {
  home: "neuralcosmology.com",
  book: "book",
  essay: "essay",
  lecture: "lecture",
  preprint: "preprint",
  science: "research",
  page: "neuralcosmology.com",
};

export async function GET(request: NextRequest) {
  try {
    const params = request.nextUrl.searchParams;
    const title = params.get("title") || "Neural Cosmology";
    const subtitle = params.get("subtitle") || "";
    const kind = (params.get("kind") || "home").toLowerCase();
    const eyebrow = KIND_LABELS[kind] ?? KIND_LABELS.page;

    const titleLength = title.length;
    const titleFontSize =
      titleLength > 80 ? 52 : titleLength > 50 ? 64 : titleLength > 30 ? 76 : 88;

    return new ImageResponse(
      (
        <div
          style={{
            height: "100%",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            padding: "80px",
            background:
              "linear-gradient(135deg, #0a1026 0%, #181c2e 35%, #232946 70%, #10182a 100%)",
            position: "relative",
            fontFamily: "system-ui, sans-serif",
          }}
        >
          {/* Star field */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage:
                "radial-gradient(circle at 20% 30%, rgba(255,255,255,0.12) 1px, transparent 1px), radial-gradient(circle at 70% 60%, rgba(255,255,255,0.08) 1px, transparent 1px), radial-gradient(circle at 45% 85%, rgba(255,255,255,0.1) 1px, transparent 1px)",
              backgroundSize: "60px 60px, 90px 90px, 110px 110px",
              opacity: 0.9,
            }}
          />

          {/* Cosmic glow */}
          <div
            style={{
              position: "absolute",
              top: "-200px",
              right: "-150px",
              width: "700px",
              height: "700px",
              borderRadius: "50%",
              background:
                "radial-gradient(circle, rgba(129,140,248,0.28) 0%, rgba(99,102,241,0.12) 40%, transparent 70%)",
              filter: "blur(60px)",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: "-180px",
              left: "-100px",
              width: "600px",
              height: "600px",
              borderRadius: "50%",
              background:
                "radial-gradient(circle, rgba(192,132,252,0.22) 0%, rgba(167,139,250,0.08) 40%, transparent 70%)",
              filter: "blur(70px)",
            }}
          />

          {/* Top row: wordmark + kind */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              position: "relative",
              zIndex: 10,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "baseline",
                color: "rgba(255,255,255,0.95)",
                fontSize: "34px",
                fontWeight: 600,
                letterSpacing: "-0.01em",
              }}
            >
              <span>neural</span>
              <span style={{ color: "#a5b4fc" }}>cosmology</span>
            </div>
            <div
              style={{
                fontSize: "18px",
                textTransform: "uppercase",
                letterSpacing: "0.3em",
                color: "rgba(165,180,252,0.75)",
                fontFamily: "monospace",
              }}
            >
              {eyebrow}
            </div>
          </div>

          {/* Bottom content */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              marginTop: "auto",
              position: "relative",
              zIndex: 10,
            }}
          >
            <div
              style={{
                color: "white",
                fontSize: `${titleFontSize}px`,
                fontWeight: 700,
                letterSpacing: "-0.03em",
                lineHeight: 1.05,
                marginBottom: subtitle ? "32px" : "0",
                textShadow: "0 8px 40px rgba(60,60,180,0.35)",
              }}
            >
              {title}
            </div>
            {subtitle && (
              <div
                style={{
                  color: "rgba(200,210,255,0.78)",
                  fontSize: "30px",
                  fontWeight: 400,
                  lineHeight: 1.35,
                  maxWidth: "900px",
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
    );
  } catch (e) {
    console.error("OG generation error:", e);
    return new Response("Failed to generate image", { status: 500 });
  }
}
