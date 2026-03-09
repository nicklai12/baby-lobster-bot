import { useCurrentFrame, useVideoConfig, interpolate, Easing, spring } from "remotion";

export const IntroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Lobster bounce animation
  const bounce = spring({
    frame,
    fps,
    config: { damping: 10, stiffness: 100 },
  });

  const scale = interpolate(bounce, [0, 1], [0.5, 1], { extrapolateRight: "clamp" });
  const rotate = interpolate(frame, [0, 30], [-20, 0], { extrapolateRight: "clamp" });

  // Title animations
  const titleOpacity = interpolate(frame, [20, 40], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const titleY = interpolate(frame, [20, 40], [50, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Subtitle animation
  const subtitleOpacity = interpolate(frame, [50, 70], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const subtitleY = interpolate(frame, [50, 70], [30, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Description animation
  const descOpacity = interpolate(frame, [80, 100], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Glow pulse
  const glowIntensity = interpolate(frame % 60, [0, 30, 60], [0.5, 1, 0.5]);

  return (
    <div style={{
      width: "100%",
      height: "100%",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      position: "relative",
    }}>
      {/* Lobster emoji with effects */}
      <div style={{
        fontSize: 200,
        transform: `scale(${scale}) rotate(${rotate}deg)`,
        filter: `drop-shadow(0 0 ${30 * glowIntensity}px rgba(255, 107, 107, 0.8))`,
        marginBottom: 40,
      }}>
        🦞
      </div>

      {/* Main title */}
      <h1 style={{
        fontSize: 90,
        fontWeight: 900,
        color: "#fff",
        margin: 0,
        opacity: titleOpacity,
        transform: `translateY(${titleY}px)`,
        textShadow: "0 0 60px rgba(255, 107, 107, 0.5), 0 4px 20px rgba(0,0,0,0.3)",
        letterSpacing: "-2px",
      }}>
        Baby Lobster
      </h1>

      {/* Subtitle */}
      <h2 style={{
        fontSize: 48,
        fontWeight: 600,
        color: "#ff6b6b",
        margin: "20px 0 0 0",
        opacity: subtitleOpacity,
        transform: `translateY(${subtitleY}px)`,
        textShadow: "0 2px 10px rgba(0,0,0,0.3)",
      }}>
        🎓 Telegram 英文學習機器人
      </h2>

      {/* Tagline */}
      <p style={{
        fontSize: 28,
        color: "rgba(255,255,255,0.8)",
        marginTop: 40,
        textAlign: "center",
        maxWidth: 800,
        lineHeight: 1.6,
        opacity: descOpacity,
      }}>
        你好奇又熱情的 AI 英文學習夥伴 🎉
      </p>

      {/* Feature badges */}
      <div style={{
        display: "flex",
        gap: 20,
        marginTop: 60,
        opacity: interpolate(frame, [100, 120], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
      }}>
        {["🎙️ 語音對話", "🤖 AI 智能", "🔊 語音回覆"].map((badge, i) => (
          <span key={badge} style={{
            padding: "12px 28px",
            background: "rgba(255,255,255,0.1)",
            borderRadius: 30,
            fontSize: 20,
            color: "#fff",
            border: "1px solid rgba(255,255,255,0.2)",
            transform: `translateY(${interpolate(frame, [110 + i * 5, 130 + i * 5], [20, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}px)`,
            opacity: interpolate(frame, [110 + i * 5, 130 + i * 5], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
          }}>
            {badge}
          </span>
        ))}
      </div>
    </div>
  );
};
