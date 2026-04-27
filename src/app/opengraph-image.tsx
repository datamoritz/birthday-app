import { ImageResponse } from "next/og";
import { readFile } from "fs/promises";
import path from "path";

export const runtime = "nodejs";
export const alt = "Moritz Birthday Bash — April 29, Denver";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  const imgBuffer = await readFile(path.join(process.cwd(), "public/moritz-mountain.jpg"));
  const base64 = `data:image/jpeg;base64,${imgBuffer.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          fontFamily: "ui-sans-serif, system-ui, -apple-system, sans-serif",
        }}
      >
        <img
          src={base64}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center 18%",
          }}
        />
        {/* dark gradient: left side heavy for text legibility, right stays airy */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background:
              "linear-gradient(110deg, rgba(12,12,16,0.88) 0%, rgba(12,12,16,0.55) 55%, rgba(12,12,16,0.25) 100%)",
            display: "flex",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "52px 68px",
          }}
        >
          {/* top badge */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              height: 38,
              padding: "0 20px",
              borderRadius: 999,
              background: "rgba(255, 122, 61, 0.93)",
              color: "#0c0c10",
              fontSize: 16,
              fontWeight: 800,
              letterSpacing: "0.07em",
            }}
          >
            APRIL 29, 2026 · DENVER
          </div>

          {/* bottom: title + tagline */}
          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                fontSize: 108,
                fontWeight: 900,
                lineHeight: 0.84,
                letterSpacing: "-3px",
                color: "#ffffff",
              }}
            >
              <span>Moritz&apos;</span>
              <span>Birthday</span>
              <span style={{ color: "#ffd23f" }}>Bash</span>
            </div>
            <span
              style={{
                fontSize: 23,
                fontWeight: 500,
                color: "rgba(255,255,255,0.68)",
                letterSpacing: "0.01em",
              }}
            >
              Drop your songs, movie &amp; drink picks →
            </span>
          </div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}
