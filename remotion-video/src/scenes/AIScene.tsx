import { useCurrentFrame, useVideoConfig, interpolate, Easing, spring } from "remotion";
import { DESIGN_TOKENS } from "../Video";
import { IconBrain, IconMessageCircle, IconRepeat, IconZap } from "../components/Icons";

export const AIScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const { micro, standard, emphasis } = DESIGN_TOKENS.animation;

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

  // AI brain animation - Emphasis timing
  const brainScale = spring({
    frame: frame - 10,
    fps,
    config: { damping: 12, stiffness: 80 },
  });

  // Neural network animation
  const pulse = Math.sin(frame * 0.08) * 0.5 + 0.5;

  // Feature cards with updated colors
  const cards = [
    { Icon: IconBrain, title: "Cerebras AI", desc: "gpt-oss-120b 強大模型", color: DESIGN_TOKENS.colors.primary },
    { Icon: IconMessageCircle, title: "鼓勵式教學", desc: "像父母般耐心引導", color: DESIGN_TOKENS.colors.secondary },
    { Icon: IconRepeat, title: "對話記憶", desc: "記住上下文脈絡", color: DESIGN_TOKENS.colors.accent },
    { Icon: IconZap, title: "429 自動重試", desc: "智能錯誤處理", color: DESIGN_TOKENS.colors.success },
  ];

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "80px 100px",
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
          🤖 AI 智能核心
        </h2>
        <p
          style={{
            fontSize: DESIGN_TOKENS.typography.subtitle.size,
            color: DESIGN_TOKENS.colors.text.secondary,
            marginTop: DESIGN_TOKENS.spacing.md,
          }}
        >
          不只是對話，更是專屬的英文學習夥伴
        </p>
      </div>

      {/* AI Visualization */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 80,
          width: "100%",
        }}
      >
        {/* Brain visualization - Claymorphism style */}
        <div
          style={{
            position: "relative",
            width: 300,
            height: 300,
          }}
        >
          {/* Glowing rings with new colors */}
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                inset: i * 40,
                borderRadius: "50%",
                border: `2px solid ${DESIGN_TOKENS.colors.primary}${30 - i * 10}`,
                transform: `scale(${1 + pulse * 0.05 * (i + 1)})`,
              }}
            />
          ))}

          {/* Center brain with claymorphism */}
          <div
            style={{
              position: "absolute",
              inset: 40,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 100,
              borderRadius: "50%",
              background: `linear-gradient(145deg, ${DESIGN_TOKENS.colors.primary}30, ${DESIGN_TOKENS.colors.primary}10)`,
              transform: `scale(${interpolate(brainScale, [0, 1], [0.8, 1])})`,
              boxShadow: `
                20px 20px 60px rgba(0,0,0,0.3),
                -20px -20px 60px rgba(255,255,255,0.05),
                inset 0 1px 0 rgba(255,255,255,0.1),
                0 0 ${40 * pulse}px ${DESIGN_TOKENS.colors.primary}60
              `,
            }}
          >
            🧠
          </div>

          {/* Orbiting particles with new colors */}
          {Array.from({ length: 6 }).map((_, i) => {
            const angle = (frame * 0.02 + i * Math.PI / 3) % (Math.PI * 2);
            const x = Math.cos(angle) * 110;
            const y = Math.sin(angle) * 110;
            const colors = [DESIGN_TOKENS.colors.primary, DESIGN_TOKENS.colors.secondary];
            return (
              <div
                key={i}
                style={{
                  position: "absolute",
                  width: 12,
                  height: 12,
                  borderRadius: "50%",
                  background: colors[i % 2],
                  left: 150 + x - 6,
                  top: 150 + y - 6,
                  boxShadow: `0 0 20px ${colors[i % 2]}`,
                }}
              />
            );
          })}
        </div>

        {/* Feature cards with optimized animation */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: 20,
          }}
        >
          {cards.map((card, i) => {
            const cardDelay = 25 + i * 5;
            const cardOpacity = interpolate(
              frame,
              [cardDelay, cardDelay + standard.frames],
              [0, 1],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: standard.easing }
            );
            const cardX = interpolate(
              frame,
              [cardDelay, cardDelay + standard.frames],
              [30, 0],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: standard.easing }
            );

            return (
              <div
                key={i}
                style={{
                  width: 260,
                  padding: 28,
                  background: "rgba(255,255,255,0.05)",
                  borderRadius: 20,
                  border: `1px solid ${card.color}40`,
                  opacity: cardOpacity,
                  transform: `translateX(${cardX}px)`,
                  backdropFilter: "blur(10px)",
                  boxShadow: `
                    0 8px 32px rgba(0,0,0,0.2),
                    inset 0 1px 0 rgba(255,255,255,0.1)
                  `,
                }}
              >
                <div
                  style={{
                    fontSize: 40,
                    marginBottom: 12,
                    color: card.color,
                  }}
                >
                  <card.Icon size={40} />
                </div>
                <h3
                  style={{
                    fontSize: 20,
                    fontWeight: 700,
                    color: card.color,
                    margin: "0 0 8px 0",
                  }}
                >
                  {card.title}
                </h3>
                <p
                  style={{
                    fontSize: 14,
                    color: DESIGN_TOKENS.colors.text.secondary,
                    margin: 0,
                    lineHeight: 1.5,
                  }}
                >
                  {card.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quote with improved styling */}
      <div
        style={{
          marginTop: 50,
          padding: "24px 40px",
          background: `linear-gradient(135deg, ${DESIGN_TOKENS.colors.primary}15, ${DESIGN_TOKENS.colors.secondary}10)`,
          borderRadius: 16,
          border: `1px solid ${DESIGN_TOKENS.colors.primary}30`,
          opacity: interpolate(frame, [55, 70], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: standard.easing,
          }),
          maxWidth: 800,
        }}
      >
        <p
          style={{
            fontSize: 18,
            color: DESIGN_TOKENS.colors.text.secondary,
            fontStyle: "italic",
            margin: 0,
            textAlign: "center",
            lineHeight: 1.6,
          }}
        >
          "Do you mean: [correct English]? Don't worry, you're doing great! 🎉"
        </p>
        <p
          style={{
            fontSize: 14,
            color: DESIGN_TOKENS.colors.primaryLight,
            textAlign: "center",
            marginTop: 8,
          }}
        >
          — Baby Lobster 鼓勵式回覆範例
        </p>
      </div>
    </div>
  );
};
