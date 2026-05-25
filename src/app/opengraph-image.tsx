import { ImageResponse } from "next/og";
import { profile } from "@/data/profile";

export const runtime = "edge";
export const alt = `${profile.name} — Full Stack Developer`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    <div
      style={{
        background: "#09090b",
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "80px",
      }}
    >
      <div
        style={{
          fontSize: 20,
          color: "#71717a",
          marginBottom: 16,
          fontFamily: "sans-serif",
        }}
      >
        Santiago, Chile · Disponible para nuevas oportunidades
      </div>
      <div
        style={{
          fontSize: 72,
          fontWeight: 700,
          color: "#fafafa",
          lineHeight: 1.1,
          fontFamily: "sans-serif",
          marginBottom: 24,
        }}
      >
        {profile.name}
      </div>
      <div
        style={{
          fontSize: 32,
          color: "#a1a1aa",
          fontFamily: "sans-serif",
        }}
      >
        Full Stack Developer
      </div>
      <div
        style={{
          display: "flex",
          gap: 12,
          marginTop: 48,
        }}
      >
        {["React", ".NET Core", "Azure", "Power Platform"].map((tech) => (
          <div
            key={tech}
            style={{
              background: "#27272a",
              color: "#a1a1aa",
              padding: "8px 16px",
              borderRadius: 6,
              fontSize: 16,
              fontFamily: "sans-serif",
            }}
          >
            {tech}
          </div>
        ))}
      </div>
    </div>,
    { ...size },
  );
}
