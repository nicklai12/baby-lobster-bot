import { useCurrentFrame, useVideoConfig, interpolate, Easing, spring } from "remotion";
import { DESIGN_TOKENS } from "../Video";
import { IconGraduationCap, IconPartyPopper, IconGithub, IconFileText, IconMessageCircle } from "../components/Icons";

export const OutroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const { micro, standard, emphasis } = DESIGN_TOKENS.animation;

  // Celebration animation - Emphasis timing
  const celebration = spring({
    frame,
    fps,
    config: { damping: 8, stiffness: 60 },
  });

  const scale = 1 + celebration * 0.15;
  const rotate = Math.sin(frame * 0.08) * 8;

  // Text animations with easing
  const titleOpacity = interpolate(frame, [0, standard.frames], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: standard.easing,
  });
  const titleScale = interpolate(frame, [0, standard.frames], [0.9, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: standard.easing,
  });

  const subtitleOpacity = interpolate(frame, [micro.frames, micro.frames + standard.frames], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: standard.easing,
  });

  const ctaOpacity = interpolate(frame, [35, 50], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: standard.easing,
  });
  const ctaY = interpolate(frame, [35, 50], [20, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: standard.easing,
  });

  // Reduced confetti particles (Rule #7)
  const confetti = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    x: 150 + (i * 85) % 1620,
    y: -30 - (i * 40) % 150,
    color: [DESIGN_TOKENS.colors.primary, DESIGN_TOKENS.colors.secondary, DESIGN_TOKENS.colors.accent, "#22C55E"][i % 4],
    delay: i * 2,
    speed: 2.5 + (i % 3),
  }));

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        zIndex: DESIGN_TOKENS.zIndex.content,
      }}
    >
      {/* Confetti - reduced for less distraction */}
      {confetti.map((c) => {
        const y = c.y + (frame - c.delay) * c.speed;
        const rotation = (frame - c.delay) * 2;
        const opacity = y > 1080 ? 0 : 1;

        return (
          <div
            key={c.id}
            style={{
              position: "absolute",
              left: c.x,
              top: y,
              width: 10,
              height: 10,
              background: c.color,
              transform: `rotate(${rotation}deg)`,
              opacity: opacity * (frame > c.delay ? 0.7 : 0),
            }}
          />
        );
      })}

      {/* Main content */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          zIndex: 1,
        }}
      >
        {/* Celebrating icons - Claymorphism style */}
        <div
          style={{
            display: "flex",
            gap: 20,
            transform: `scale(${scale}) rotate(${rotate}deg)`,
            filter: `drop-shadow(0 ${30 * (0.5 + Math.sin(frame * 0.1) * 0.3)}px ${50 * (0.5 + Math.sin(frame * 0.1) * 0.3)}px ${DESIGN_TOKENS.colors.primary}70)`,
            marginBottom: DESIGN_TOKENS.spacing.lg,
            padding: "25px 35px",
            borderRadius: "50%",
            background: `linear-gradient(145deg, ${DESIGN_TOKENS.colors.primary}25, ${DESIGN_TOKENS.colors.primary}08)`,
            boxShadow: `
              25px 25px 50px rgba(0,0,0,0.3),
              -25px -25px 50px rgba(255,255,255,0.05),
              inset 0 1px 0 rgba(255,255,255,0.1)
            `,
            opacity: titleOpacity,
          }}
        >
          <IconGraduationCap size={80} color={DESIGN_TOKENS.colors.primaryLight} strokeWidth={1.5} />
          <IconPartyPopper size={80} color={DESIGN_TOKENS.colors.accent} strokeWidth={1.5} />
        </div>

        {/* Title */}
        <h2
          style={{
            fontSize: 56,
            fontWeight: DESIGN_TOKENS.typography.hero.weight,
            color: DESIGN_TOKENS.colors.text.primary,
            margin: 0,
            opacity: titleOpacity,
            transform: `scale(${titleScale})`,
            textShadow: `0 0 60px ${DESIGN_TOKENS.colors.primary}60, 0 4px 20px rgba(0,0,0,0.3)`,
            letterSpacing: "-1px",
          }}
        >
          開始你的英文學習之旅！
        </h2>

        {/* Subtitle */}
        <p
          style={{
            fontSize: DESIGN_TOKENS.typography.subtitle.size,
            color: DESIGN_TOKENS.colors.text.secondary,
            marginTop: DESIGN_TOKENS.spacing.md,
            opacity: subtitleOpacity,
            textAlign: "center",
            maxWidth: 800,
            lineHeight: 1.5,
          }}
        >
          Baby Lobster 期待與你一起探索英文的世界
        </p>

        {/* CTA Button - Claymorphism style with glow */}
        <div
          style={{
            marginTop: DESIGN_TOKENS.spacing.xl,
            padding: "22px 50px",
            background: `linear-gradient(135deg, ${DESIGN_TOKENS.colors.primary}, ${DESIGN_TOKENS.colors.secondary})`,
            borderRadius: 50,
            fontSize: 22,
            fontWeight: 700,
            color: DESIGN_TOKENS.colors.text.primary,
            boxShadow: `
              0 10px 40px ${DESIGN_TOKENS.colors.primary}${Math.floor((0.5 + Math.sin(frame * 0.1) * 0.3) * 80).toString(16).padStart(2, '0')},
              inset 0 1px 0 rgba(255,255,255,0.2)
            `,
            opacity: ctaOpacity,
            transform: `translateY(${ctaY}px)`,
            display: "flex",
            alignItems: "center",
            gap: 12,
            cursor: "pointer",
            // Active state feedback (Rule #30)
            transition: "transform 150ms ease-out, box-shadow 150ms ease-out",
          }}
        >
          <IconMessageCircle size={24} />
          <span>立即在 Telegram 體驗</span>
        </div>

        {/* Social/Links with Lucide icons */}
        <div
          style={{
            display: "flex",
            gap: 24,
            marginTop: 40,
            opacity: interpolate(frame, [60, 75], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: standard.easing,
            }),
          }}
        >
          {[
            { Icon: IconGithub, text: "GitHub" },
            { Icon: IconFileText, text: "文件" },
            { Icon: IconMessageCircle, text: "Telegram" },
          ].map(({ Icon, text }, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "10px 20px",
                background: "rgba(255,255,255,0.08)",
                borderRadius: 20,
                fontSize: 14,
                color: DESIGN_TOKENS.colors.text.secondary,
                border: "1px solid rgba(255,255,255,0.1)",
                transform: `translateY(${interpolate(
                  frame,
                  [65 + i * 4, 80 + i * 4],
                  [10, 0],
                  { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: micro.easing }
                )}px)`,
                opacity: interpolate(
                  frame,
                  [65 + i * 4, 80 + i * 4],
                  [0, 1],
                  { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: micro.easing }
                ),
              }}
            >
              <Icon size={16} />
              <span>{text}</span>
            </div>
          ))}
        </div>

        {/* Credits */}
        <div
          style={{
            marginTop: 40,
            fontSize: 14,
            color: DESIGN_TOKENS.colors.text.muted,
            opacity: interpolate(frame, [80, 95], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: standard.easing,
            }),
          }}
        >
          Made with ❤️ using Remotion
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: 150,
          background: `linear-gradient(to top, ${DESIGN_TOKENS.colors.background.start}cc, transparent)`,
          pointerEvents: "none",
        }}
      />
    </div>
  );
};
