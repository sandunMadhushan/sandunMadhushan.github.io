import { ImageResponse } from "next/og";

const BG = "#131314";
const ON_SURFACE = "#e5e2e3";
const PRIMARY_CONTAINER = "#4f46e5";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: BG,
          borderRadius: 40,
          letterSpacing: "-0.06em",
          fontWeight: 700,
          fontSize: 108,
          fontFamily: 'ui-sans-serif, system-ui, "Segoe UI", sans-serif',
        }}
      >
        <span style={{ color: ON_SURFACE }}>S</span>
        <span style={{ color: PRIMARY_CONTAINER }}>M</span>
      </div>
    ),
    { ...size },
  );
}
