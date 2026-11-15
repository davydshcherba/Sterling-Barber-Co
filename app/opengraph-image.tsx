import { ImageResponse } from "next/og";
import site from "@/data/site.json";

export const alt = `${site.name}: classic barbershop in ${site.city}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const colors = ["#A6262B", "#FBF6EA", "#1F3A6B", "#FBF6EA"];

function Stripe() {
  return (
    <svg width="1172" height="40" viewBox="0 0 1172 40">
      {Array.from({ length: 36 }, (_, i) => {
        const x = i * 36 - 40;
        return <polygon key={i} points={`${x},0 ${x + 36},0 ${x + 8},40 ${x - 28},40`} fill={colors[i % 4]} />;
      })}
    </svg>
  );
}

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: "#F3EAD8",
          color: "#2A1F1A",
          border: "14px solid #2A1F1A",
        }}
      >
        <Stripe />
        <div style={{ display: "flex", flex: 1, flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          <div style={{ display: "flex", fontSize: 28, letterSpacing: 9, color: "#A6262B" }}>
            {`BARBERSHOP · ${site.city.toUpperCase()} · EST. ${site.established}`}
          </div>
          <div style={{ display: "flex", fontSize: 118, fontWeight: 700, marginTop: 22 }}>{site.name}</div>
          <div style={{ display: "flex", fontSize: 34, marginTop: 22, color: "#5A493E" }}>
            Classic cuts, hot towel shaves, online booking
          </div>
        </div>
        <Stripe />
      </div>
    ),
    size,
  );
}
