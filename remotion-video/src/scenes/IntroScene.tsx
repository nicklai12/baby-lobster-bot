import { useCurrentFrame, useVideoConfig, interpolate, Easing, spring } from "remotion";
import { DESIGN_TOKENS } from "../Video";
import { IconGraduationCap, IconMic, IconBot, IconVolume2 } from "../components/Icons";

export const IntroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Optimized Animation Timing (Rule #8: 150-300ms)
  const { micro, standard, emphasis } = DESIGN_TOKENS.animation;

  // Lobster bounce animation - Emphasis (400ms for character entrance)
  const bounce = spring({
    frame,
    fps,
    config: { damping: 12, stiffness: 100 },
  });

  const scale = interpolate(bounce, [0, 1], [0.5, 1], { extrapolateRight: "clamp" });
  const rotate = interpolate(frame, [0, 10], [-20, 0], {
    extrapolateRight: "clamp",
    easing: emphasis.easing,
  });

  // Title animations - Standard timing (267ms)
  const titleStart = 10;
  const titleOpacity = interpolate(
    frame,
    [titleStart, titleStart + standard.frames],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: standard.easing }
  );
  const titleY = interpolate(
    frame,
    [titleStart, titleStart + standard.frames],
    [30, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: standard.easing }
  );

  // Subtitle animation - Standard timing
  const subtitleStart = titleStart + micro.frames;
  const subtitleOpacity = interpolate(
    frame,
    [subtitleStart, subtitleStart + standard.frames],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: standard.easing }
  );
  const subtitleY = interpolate(
    frame,
    [subtitleStart, subtitleStart + standard.frames],
    [20, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: standard.easing }
  );

  // Description animation
  const descStart = subtitleStart + micro.frames;
  const descOpacity = interpolate(
    frame,
    [descStart, descStart + standard.frames],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: standard.easing }
  );

  // Glow pulse - slower for ambient effect
  const glowIntensity = interpolate(frame % 90, [0, 45, 90], [0.4, 1, 0.4]);

  return (
    <div style={{
      width: "100%",
      height: "100%",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      position: "relative",
      zIndex: DESIGN_TOKENS.zIndex.content,
    }}>
      {/* Main icon with effects - Claymorphism style */}
      <div style={{
        transform: `scale(${scale}) rotate(${rotate}deg)`,
        filter: `drop-shadow(0 ${20 * glowIntensity}px ${40 * glowIntensity}px ${DESIGN_TOKENS.colors.primary}60)`,
        marginBottom: DESIGN_TOKENS.spacing.xl,
        padding: "30px",
        borderRadius: "50%",
        background: `linear-gradient(145deg, ${DESIGN_TOKENS.colors.primary}20, ${DESIGN_TOKENS.colors.primary}05)`,
        boxShadow: `
          20px 20px 60px rgba(0,0,0,0.3),
          -20px -20px 60px rgba(255,255,255,0.05),
          inset 0 1px 0 rgba(255,255,255,0.1)
        `,
      }}>
        <IconGraduationCap size={120} color={DESIGN_TOKENS.colors.primaryLight} strokeWidth={1.5} />
      </div>

      {/* Main title - Updated typography scale */}
      <h1 style={{
        fontSize: DESIGN_TOKENS.typography.hero.size,
        fontWeight: DESIGN_TOKENS.typography.hero.weight,
        lineHeight: DESIGN_TOKENS.typography.hero.lineHeight,
        letterSpacing: DESIGN_TOKENS.typography.hero.letterSpacing,
        color: DESIGN_TOKENS.colors.text.primary,
        margin: 0,
        opacity: titleOpacity,
        transform: `translateY(${titleY}px)`,
        textShadow: `0 0 50px ${DESIGN_TOKENS.colors.primary}50, 0 4px 20px rgba(0,0,0,0.3)`,
      }}>
        Baby Lobster
      </h1>

      {/* Subtitle - Updated color */}
      <h2 style={{
        fontSize: DESIGN_TOKENS.typography.subtitle.size,
        fontWeight: DESIGN_TOKENS.typography.subtitle.weight,
        lineHeight: DESIGN_TOKENS.typography.subtitle.lineHeight,
        color: DESIGN_TOKENS.colors.primaryLight,
        margin: `${DESIGN_TOKENS.spacing.md}px 0 0 0`,
        opacity: subtitleOpacity,
        transform: `translateY(${subtitleY}px)`,
        textShadow: "0 2px 10px rgba(0,0,0,0.3)",
      }}>
        Telegram 英文學習機器人
      </h2>

      {/* Tagline */}
      <p style={{
        fontSize: DESIGN_TOKENS.typography.body.size,
        fontWeight: DESIGN_TOKENS.typography.body.weight,
        lineHeight: DESIGN_TOKENS.typography.body.lineHeight,
        color: DESIGN_TOKENS.colors.text.secondary,
        marginTop: DESIGN_TOKENS.spacing.lg,
        textAlign: "center",
        maxWidth: 800,
        opacity: descOpacity,
      }}>
        你好奇又熱情的 AI 英文學習夥伴
      </p>

      {/* Feature badges - Claymorphism style with Lucide icons */}
      <div style={{
        display: "flex",
        gap: DESIGN_TOKENS.spacing.md,
        marginTop: DESIGN_TOKENS.spacing.xl,
        opacity: interpolate(
          frame,
          [descStart + micro.frames, descStart + micro.frames + standard.frames],
          [0, 1],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: standard.easing }
        ),
      }}>
        {[
          { Icon: IconMic, text: "語音對話" },
          { Icon: IconBot, text: "AI 智能" },
          { Icon: IconVolume2, text: "語音回覆" },
        ].map(({ Icon, text }, i) => {
          const badgeStart = descStart + micro.frames + (i * 3);
          return (
            <span
              key={text}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "14px 24px",
                background: "rgba(255,255,255,0.08)",
                borderRadius: 20,
                fontSize: DESIGN_TOKENS.typography.caption.size,
                fontWeight: 600,
                color: DESIGN_TOKENS.colors.text.primary,
                border: "1px solid rgba(255,255,255,0.1)",
                transform: `translateY(${interpolate(
                  frame,
                  [badgeStart, badgeStart + micro.frames],
                  [15, 0],
                  { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: micro.easing }
                )}px)`,
                opacity: interpolate(
                  frame,
                  [badgeStart, badgeStart + micro.frames],
                  [0, 1],
                  { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: micro.easing }
                ),
                transition: "transform 150ms ease-out",
              }}
            >
              <Icon size={18} color={DESIGN_TOKENS.colors.secondary} />
              <span>{text}</span>
            </span>
          );
        })}
      </div>
    </div>
  );
};
