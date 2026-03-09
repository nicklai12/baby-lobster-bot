import { useCurrentFrame, useVideoConfig, interpolate, Easing, spring } from "remotion";

export const OutroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Lobster celebration animation
  const celebration = spring({
    frame,
    fps,
    config: { damping: 8, stiffness: 60 },
  });

  const scale = 1 + celebration * 0.2;
  const rotate = Math.sin(frame * 0.1) * 10;

  // Text animations
  const titleOpacity = interpolate(frame, [0, 20], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const titleScale = interpolate(frame, [0, 20], [0.8, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const subtitleOpacity = interpolate(frame, [20, 40], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const ctaOpacity = interpolate(frame, [50, 70], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const ctaY = interpolate(frame, [50, 70], [30, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Confetti particles
  const confetti = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    x: 100 + (i * 60) % 1720,
    y: -50 - (i * 30) % 200,
    color: ["#ff6b6b", "#4ecdc4", "#ffe66d", "#a8e6cf", "#ff8e53"][i % 5],
    delay: i * 2,
    speed: 3 + (i % 4),
  }));

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
      {/* Confetti */}
      {confetti.map((c) => {
        const y = c.y + (frame - c.delay) * c.speed;
        const rotation = (frame - c.delay) * 3;
        const opacity = y > 1080 ? 0 : 1;

        return (
          <div
            key={c.id}
            style={{
              position: "absolute",
              left: c.x,
              top: y,
              width: 12,
              height: 12,
              background: c.color,
              transform: `rotate(${rotation}deg)`,
              opacity: opacity * (frame > c.delay ? 1 : 0),
            }}
          />
        );
      })}

      {/* Main content */}
      <div style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        zIndex: 1,
      }}>
        {/* Celebrating Lobster */}
        <div style={{
          fontSize: 180,
          transform: `scale(${scale}) rotate(${rotate}deg)`,
          filter: "drop-shadow(0 0 50px rgba(255, 107, 107, 0.8))",
          marginBottom: 40,
          opacity: titleOpacity,
        }}>
          🦞🎉
        </div>

        {/* Title */}
        <h2 style={{
          fontSize: 72,
          fontWeight: 900,
          color: "#fff",
          margin: 0,
          opacity: titleOpacity,
          transform: `scale(${titleScale})`,
          textShadow: "0 0 60px rgba(255, 107, 107, 0.6), 0 4px 20px rgba(0,0,0,0.3)",
          letterSpacing: "-2px",
        }}>
          開始你的英文學習之旅！
        </h2>

        {/* Subtitle */}
        <p style={{
          fontSize: 32,
          color: "rgba(255,255,255,0.9)",
          marginTop: 25,
          opacity: subtitleOpacity,
          textAlign: "center",
          maxWidth: 900,
          lineHeight: 1.5,
        }}>
          Baby Lobster 期待與你一起探索英文的世界 🌟
        </p>

        {/* CTA Button */}
        <div style={{
          marginTop: 60,
          padding: "25px 60px",
          background: "linear-gradient(135deg, #ff6b6b, #ff8e53)",
          borderRadius: 50,
          fontSize: 28,
          fontWeight: 700,
          color: "#fff",
          boxShadow: `0 10px 40px rgba(255, 107, 107, ${0.5 + Math.sin(frame * 0.1) * 0.3})`,
          opacity: ctaOpacity,
          transform: `translateY(${ctaY}px)`,
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          gap: 15,
        }}>
          <span>📱</span>
          <span>立即在 Telegram 體驗</span>
        </div>

        {/* Social/Links */}
        <div style={{
          display: "flex",
          gap: 30,
          marginTop: 50,
          opacity: interpolate(frame, [80, 100], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
        }}>
          {[
            { icon: "🐙", text: "GitHub" },
            { icon: "📖", text: "文件" },
            { icon: "💬", text: "Telegram" },
          ].map((link, i) => (
            <div key={i} style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "12px 24px",
              background: "rgba(255,255,255,0.1)",
              borderRadius: 25,
              fontSize: 16,
              color: "rgba(255,255,255,0.8)",
              border: "1px solid rgba(255,255,255,0.2)",
            }}>
              <span>{link.icon}</span>
              <span>{link.text}</span>
            </div>
          ))}
        </div>

        {/* Credits */}
        <div style={{
          marginTop: 50,
          fontSize: 16,
          color: "rgba(255,255,255,0.4)",
          opacity: interpolate(frame, [100, 120], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
        }}>
          Made with ❤️ using Remotion
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        height: 200,
        background: "linear-gradient(to top, rgba(26,26,46,0.8), transparent)",
        pointerEvents: "none",
      }} />
    </div>
  );
};
