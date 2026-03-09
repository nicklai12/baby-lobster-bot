import { useCurrentFrame, useVideoConfig, interpolate, Easing } from "remotion";
import { DESIGN_TOKENS } from "../Video";
import { IconMic, IconTarget, IconZap, IconGlobe } from "../components/Icons";

export const VoiceScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const { micro, standard } = DESIGN_TOKENS.animation;

  // Title animation with easing
  const titleOpacity = interpolate(frame, [0, standard.frames], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: standard.easing,
  });
  const titleX = interpolate(frame, [0, standard.frames], [-30, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: standard.easing,
  });

  // Phone mockup animation
  const phoneScale = interpolate(frame, [10, 25], [0.9, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.back(1.5)),
  });
  const phoneOpacity = interpolate(frame, [10, 25], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Voice wave animation - optimized
  const wavePhase = frame * 0.12;

  // Chat bubbles with staggered animation
  const bubble1Opacity = interpolate(frame, [30, 45], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: micro.easing,
  });
  const bubble1Y = interpolate(frame, [30, 45], [20, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: micro.easing,
  });

  const bubble2Opacity = interpolate(frame, [55, 70], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: micro.easing,
  });
  const bubble2Y = interpolate(frame, [55, 70], [20, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: micro.easing,
  });

  // Features animation
  const featuresOpacity = interpolate(frame, [80, 95], [0, 1], {
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
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-around",
        padding: "0 120px",
        zIndex: DESIGN_TOKENS.zIndex.content,
      }}
    >
      {/* Left side - Title and description */}
      <div style={{ flex: 1, maxWidth: 700 }}>
        <h2
          style={{
            fontSize: DESIGN_TOKENS.typography.hero.size,
            fontWeight: DESIGN_TOKENS.typography.hero.weight,
            color: DESIGN_TOKENS.colors.text.primary,
            margin: 0,
            opacity: titleOpacity,
            transform: `translateX(${titleX}px)`,
            textShadow: `0 0 40px ${DESIGN_TOKENS.colors.secondary}50`,
          }}
        >
          🎙️ 語音對話
        </h2>

        <p
          style={{
            fontSize: DESIGN_TOKENS.typography.subtitle.size,
            color: DESIGN_TOKENS.colors.text.secondary,
            marginTop: DESIGN_TOKENS.spacing.lg,
            lineHeight: DESIGN_TOKENS.typography.subtitle.lineHeight,
            opacity: titleOpacity,
            transform: `translateX(${titleX}px)`,
          }}
        >
          不用打字，直接說話！
          <br />
          使用 Groq Whisper 技術，
          <br />
          精準識別你的英文發音
        </p>

        {/* Features with claymorphism style and Lucide icons */}
        <div
          style={{
            marginTop: 50,
            opacity: featuresOpacity,
          }}
        >
          {[
            { Icon: IconTarget, text: "whisper-large-v3 模型" },
            { Icon: IconZap, text: "即時語音轉文字" },
            { Icon: IconGlobe, text: "支援中英文混合" },
          ].map((feature, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 15,
                marginBottom: 16,
                fontSize: 18,
                color: DESIGN_TOKENS.colors.text.secondary,
                transform: `translateX(${interpolate(
                  frame,
                  [85 + i * 4, 100 + i * 4],
                  [20, 0],
                  { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: micro.easing }
                )}px)`,
                opacity: interpolate(
                  frame,
                  [85 + i * 4, 100 + i * 4],
                  [0, 1],
                  { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: micro.easing }
                ),
              }}
            >
              <span
                style={{
                  width: 40,
                  height: 40,
                  background: `linear-gradient(135deg, ${DESIGN_TOKENS.colors.primary}, ${DESIGN_TOKENS.colors.secondary})`,
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 18,
                  boxShadow: `0 4px 15px ${DESIGN_TOKENS.colors.primary}40`,
                }}
              >
                <feature.Icon size={20} color="#fff" />
              </span>
              {feature.text}
            </div>
          ))}
        </div>
      </div>

      {/* Right side - Phone mockup with claymorphism */}
      <div
        style={{
          width: 360,
          height: 680,
          background: `linear-gradient(145deg, ${DESIGN_TOKENS.colors.primary}20, rgba(255,255,255,0.05))`,
          borderRadius: 50,
          padding: 18,
          boxShadow: `
            0 50px 100px rgba(0,0,0,0.4),
            inset 0 1px 0 rgba(255,255,255,0.1),
            0 0 0 1px rgba(255,255,255,0.1)
          `,
          transform: `scale(${phoneScale}) rotateY(${interpolate(frame, [0, 150], [5, -5])}deg)`,
          opacity: phoneOpacity,
          position: "relative",
          backdropFilter: "blur(20px)",
        }}
      >
        {/* Phone screen */}
        <div
          style={{
            width: "100%",
            height: "100%",
            background: `linear-gradient(180deg, ${DESIGN_TOKENS.colors.background.start} 0%, ${DESIGN_TOKENS.colors.background.middle} 100%)`,
            borderRadius: 35,
            padding: 24,
            display: "flex",
            flexDirection: "column",
            boxShadow: "inset 0 2px 10px rgba(0,0,0,0.3)",
          }}
        >
          {/* Header */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              paddingBottom: 20,
              borderBottom: `1px solid ${DESIGN_TOKENS.colors.primary}30`,
            }}
          >
            <div
              style={{
                width: 45,
                height: 45,
                borderRadius: "50%",
                background: `linear-gradient(135deg, ${DESIGN_TOKENS.colors.primary}, ${DESIGN_TOKENS.colors.accent})`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 22,
                boxShadow: `0 4px 15px ${DESIGN_TOKENS.colors.primary}50`,
              }}
            >
              🦞
            </div>
            <div>
              <div
                style={{
                  color: DESIGN_TOKENS.colors.text.primary,
                  fontSize: 17,
                  fontWeight: 600,
                }}
              >
                Baby Lobster
              </div>
              <div
                style={{
                  color: DESIGN_TOKENS.colors.secondary,
                  fontSize: 13,
                }}
              >
                在線上 🟢
              </div>
            </div>
          </div>

          {/* Chat area */}
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              gap: 12,
              marginTop: 20,
            }}
          >
            {/* Voice message bubble */}
            <div
              style={{
                alignSelf: "flex-end",
                background: `linear-gradient(135deg, ${DESIGN_TOKENS.colors.primary}, ${DESIGN_TOKENS.colors.accent})`,
                padding: "14px 18px",
                borderRadius: "20px 20px 5px 20px",
                maxWidth: 260,
                opacity: bubble1Opacity,
                transform: `translateY(${bubble1Y}px)`,
                boxShadow: `0 4px 15px ${DESIGN_TOKENS.colors.primary}40`,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: 18 }}><IconMic size={20} color="#fff" /></span>
                <div
                  style={{
                    display: "flex",
                    gap: 3,
                    alignItems: "flex-end",
                    height: 22,
                  }}
                >
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div
                      key={i}
                      style={{
                        width: 3,
                        height: 8 + Math.sin(wavePhase + i * 0.8) * 6 + 4,
                        background: "rgba(255,255,255,0.9)",
                        borderRadius: 1.5,
                      }}
                    />
                  ))}
                </div>
                <span
                  style={{
                    color: "rgba(255,255,255,0.8)",
                    fontSize: 11,
                  }}
                >
                  0:03
                </span>
              </div>
            </div>

            {/* AI reply */}
            <div
              style={{
                alignSelf: "flex-start",
                background: "rgba(255,255,255,0.08)",
                padding: "14px 18px",
                borderRadius: "20px 20px 20px 5px",
                maxWidth: 260,
                opacity: bubble2Opacity,
                transform: `translateY(${bubble2Y}px)`,
                border: "1px solid rgba(255,255,255,0.1)",
              }}
            >
              <p
                style={{
                  color: DESIGN_TOKENS.colors.text.primary,
                  fontSize: 14,
                  margin: 0,
                  lineHeight: 1.5,
                }}
              >
                🦞 Wow! That's great English practice! Do you mean: "I went to the park yesterday"? Keep it up! 🎉
              </p>
            </div>

            {/* Audio reply indicator */}
            <div
              style={{
                alignSelf: "flex-start",
                display: "flex",
                alignItems: "center",
                gap: 10,
                opacity: interpolate(frame, [85, 100], [0, 1], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                }),
              }}
            >
              <div
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: "50%",
                  background: `linear-gradient(135deg, ${DESIGN_TOKENS.colors.secondary}, ${DESIGN_TOKENS.colors.primary})`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 16,
                  boxShadow: `0 4px 15px ${DESIGN_TOKENS.colors.secondary}50`,
                }}
              >
                ▶️
              </div>
              <div style={{ display: "flex", gap: 2 }}>
                {Array.from({ length: 20 }).map((_, i) => (
                  <div
                    key={i}
                    style={{
                      width: 2.5,
                      height: 4 + Math.sin(frame * 0.2 + i * 0.3) * 7 + 4,
                      background: DESIGN_TOKENS.colors.secondary,
                      borderRadius: 1,
                    }}
                  />
                ))}
              </div>
              <span
                style={{
                  color: DESIGN_TOKENS.colors.text.muted,
                  fontSize: 11,
                }}
              >
                0:05
              </span>
            </div>
          </div>

          {/* Input area */}
          <div
            style={{
              display: "flex",
              gap: 10,
              alignItems: "center",
              padding: "14px",
              background: "rgba(255,255,255,0.05)",
              borderRadius: 25,
              marginTop: 10,
              border: "1px solid rgba(255,255,255,0.1)",
            }}
          >
            <div
              style={{
                flex: 1,
                height: 38,
                background: "rgba(255,255,255,0.08)",
                borderRadius: 19,
                display: "flex",
                alignItems: "center",
                paddingLeft: 16,
                color: DESIGN_TOKENS.colors.text.muted,
                fontSize: 14,
              }}
            >
              輸入訊息...
            </div>
            <div
              style={{
                width: 38,
                height: 38,
                borderRadius: "50%",
                background: `linear-gradient(135deg, ${DESIGN_TOKENS.colors.primary}, ${DESIGN_TOKENS.colors.accent})`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 16,
                boxShadow: `0 4px 15px ${DESIGN_TOKENS.colors.primary}50`,
              }}
            >
              🎤
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
