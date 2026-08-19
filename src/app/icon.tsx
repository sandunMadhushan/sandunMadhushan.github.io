import { ImageResponse } from "next/og";

/**
 * Matches the SiteNav wordmark: a serif "S" in the site's off-white text
 * color, plus the small lime accent square that sits after it in the nav
 * (`bg-primary-container` there → `--accent` here). Colors are pulled
 * straight from globals.css's dark theme, not the old indigo scheme this
 * replaced.
 */
const BG = "#08090a"; // --bg
const ON_SURFACE = "#f2f1ee"; // --fg
const ACCENT = "#c8ff3d"; // --accent

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
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
          borderRadius: 7,
          position: "relative",
        }}
      >
        <span
          style={{
            color: ON_SURFACE,
            fontFamily: 'ui-serif, Georgia, "Times New Roman", serif',
            fontStyle: "italic",
            fontSize: 22,
            lineHeight: 1,
            transform: "translateY(-1px)",
          }}
        >
          S
        </span>
        <span
          style={{
            position: "absolute",
            right: 7,
            bottom: 7,
            width: 4,
            height: 4,
            background: ACCENT,
            display: "flex",
          }}
        />
      </div>
    ),
    { ...size },
  );
}
