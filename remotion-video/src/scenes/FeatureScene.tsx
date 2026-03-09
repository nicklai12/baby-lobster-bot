import { useCurrentFrame, useVideoConfig, interpolate, Easing } from "remotion";
import { DESIGN_TOKENS } from "../Video";
import { IconVolume2, IconBrain, IconLanguages, IconTrophy } from "../components/Icons";

export const FeatureScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const { micro, standard } = DESIGN_TOKENS.animation;

  // Features with Lucide icons (no emoji for professional look)
  const features = [
    {
      Icon: IconVolume2,
      title: "AI 語音回覆",
      desc: "edge-tts JennyNeural 語音為你朗讀回覆",
      highlight: "自然發音",
      gridArea: "span 2 / span 2", // Large card (Bento Grid)
    },
    {
      Icon: IconBrain,
      title: "智能記憶",
      desc: "Per-chat 記憶，10輪對話脈絡",
      highlight: "10輪記憶",
      gridArea: "span 1 / span 1",
    },
    {
      Icon: IconLanguages,
      title: "中英文混合",
      desc: "理解中文、破碎英文並幫你修正",
      highlight: "無障礙溝通",
      gridArea: "span 1 / span 1",
    },
    {
      Icon: IconTrophy,
      title: "鼓勵教學",
      desc: "像熱情的寶寶龍蝦，用愛與耐心陪伴",
      highlight: "正面激勵",
      gridArea: "span 2 / span 2", // Large card
    },
  ];

  // Header animation
  const headerOpacity = interpolate(frame, [0, standard.frames], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: standard.easing,
  });
  const headerY = interpolate(frame, [0, standard.frames], [20, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: standard.easing,
  });

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "80px 120px",
        zIndex: DESIGN_TOKENS.zIndex.content,
      }}
    >
      {/* Header */}
      <div
        style={{
          textAlign: "center",
          marginBottom: 60,
          opacity: headerOpacity,
          transform: `translateY(${headerY}px)`,
        }}
      >
        <h2
          style={{
            fontSize: DESIGN_TOKENS.typography.hero.size,
            fontWeight: DESIGN_TOKENS.typography.hero.weight,
            color: DESIGN_TOKENS.colors.text.primary,
            margin: 0,
            textShadow: `0 0 50px ${DESIGN_TOKENS.colors.primary}50`,
          }}
        >
          強大功能一覽
        </h2>
        <p
          style={{
            fontSize: DESIGN_TOKENS.typography.subtitle.size,
            color: DESIGN_TOKENS.colors.text.secondary,
            marginTop: DESIGN_TOKENS.spacing.md,
          }}
        >
          讓英文學習變得有趣又高效
        </p>
      </div>

      {/* Bento Grid Layout (Style #46) */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gridTemplateRows: "repeat(2, 1fr)",
          gap: 24,
          width: "100%",
          maxWidth: 1200,
        }}
      >
        {features.map((feature, i) => {
          const delay = 15 + i * 6;
          const opacity = interpolate(
            frame,
            [delay, delay + standard.frames],
            [0, 1],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: standard.easing }
          );
          const scale = interpolate(
            frame,
            [delay, delay + standard.frames],
            [0.95, 1],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: standard.easing }
          );
          const y = interpolate(
            frame,
            [delay, delay + standard.frames],
            [20, 0],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: standard.easing }
          );

          const isLarge = feature.gridArea.includes("span 2");

          return (
            <div
              key={i}
              style={{
                gridArea: feature.gridArea,
                padding: isLarge ? "40px" : "32px",
                background: `linear-gradient(135deg, ${DESIGN_TOKENS.colors.primary}15, ${DESIGN_TOKENS.colors.secondary}08)`,
                borderRadius: 24,
                border: `1px solid ${DESIGN_TOKENS.colors.primary}25`,
                opacity,
                transform: `scale(${scale}) translateY(${y}px)`,
                backdropFilter: "blur(10px)",
                position: "relative",
                overflow: "hidden",
                boxShadow: `
                  0 8px 32px rgba(0,0,0,0.2),
                  inset 0 1px 0 rgba(255,255,255,0.1)
                `,
                transition: "transform 150ms ease-out, box-shadow 150ms ease-out",
              }}
            >
              {/* Gradient orb background */}
              <div
                style={{
                  position: "absolute",
                  top: -50,
                  right: -50,
                  width: 150,
                  height: 150,
                  background: `radial-gradient(circle, ${DESIGN_TOKENS.colors.primary}30, transparent)`,
                  borderRadius: "50%",
                }}
              />

              {/* Highlight badge */}
              <div
                style={{
                  position: "absolute",
                  top: 20,
                  right: 20,
                  padding: "6px 14px",
                  background: `${DESIGN_TOKENS.colors.accent}25`,
                  borderRadius: 20,
                  fontSize: 12,
                  fontWeight: 600,
                  color: DESIGN_TOKENS.colors.accent,
                  border: `1px solid ${DESIGN_TOKENS.colors.accent}40`,
                }}
              >
                {feature.highlight}
              </div>

              <div
                style={{
                  marginBottom: 16,
                  position: "relative",
                  zIndex: 1,
                  color: DESIGN_TOKENS.colors.primaryLight,
                }}
              >
                <feature.Icon size={isLarge ? 56 : 44} />
              </div>

              <h3
                style={{
                  fontSize: isLarge ? 28 : 22,
                  fontWeight: 700,
                  color: DESIGN_TOKENS.colors.text.primary,
                  margin: "0 0 12px 0",
                  position: "relative",
                  zIndex: 1,
                }}
              >
                {feature.title}
              </h3>

              <p
                style={{
                  fontSize: isLarge ? 18 : 15,
                  color: DESIGN_TOKENS.colors.text.secondary,
                  margin: 0,
                  lineHeight: 1.6,
                  position: "relative",
                  zIndex: 1,
                }}
              >
                {feature.desc}
              </p>
            </div>
          );
        })}
      </div>

      {/* Bottom stats */}
      <div
        style={{
          display: "flex",
          gap: 80,
          marginTop: 60,
          opacity: interpolate(frame, [60, 75], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: standard.easing,
          }),
        }}
      >
        {[
          { value: "100%", label: "英文回覆", color: DESIGN_TOKENS.colors.primary },
          { value: "24/7", label: "隨時在線", color: DESIGN_TOKENS.colors.secondary },
          { value: "🦞", label: "可愛夥伴", color: DESIGN_TOKENS.colors.accent },
        ].map((stat, i) => (
          <div
            key={i}
            style={{
              textAlign: "center",
              transform: `translateY(${interpolate(
                frame,
                [65 + i * 3, 80 + i * 3],
                [15, 0],
                { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: micro.easing }
              )}px)`,
              opacity: interpolate(
                frame,
                [65 + i * 3, 80 + i * 3],
                [0, 1],
                { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: micro.easing }
              ),
            }}
          >
            <div
              style={{
                fontSize: 42,
                fontWeight: 900,
                color: stat.color,
                textShadow: `0 0 30px ${stat.color}50`,
              }}
            >
              {stat.value}
            </div>
            <div
              style={{
                fontSize: 14,
                color: DESIGN_TOKENS.colors.text.muted,
                marginTop: 8,
              }}
            >
              {stat.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
