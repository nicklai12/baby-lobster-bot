import { useCurrentFrame, useVideoConfig, interpolate, Easing } from "remotion";
import { DESIGN_TOKENS } from "../Video";
import { IconServer, IconSend, IconTarget, IconCpu, IconAudioWaveform, IconRocket } from "../components/Icons";

export const TechStackScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const { micro, standard } = DESIGN_TOKENS.animation;

  const techStack = [
    { name: "FastAPI", Icon: IconServer, desc: "高速 Web 框架", color: "#009688" },
    { name: "Telegram", Icon: IconSend, desc: "即時通訊整合", color: "#0088cc" },
    { name: "Groq", Icon: IconTarget, desc: "Whisper STT", color: "#f55036" },
    { name: "Cerebras", Icon: IconCpu, desc: "AI 推理引擎", color: "#7c3aed" },
    { name: "edge-tts", Icon: IconAudioWaveform, desc: "語音合成", color: "#00a4ef" },
    { name: "Render", Icon: IconRocket, desc: "雲端部署", color: "#46e3b7" },
  ];

  // Header animation
  const headerOpacity = interpolate(frame, [0, standard.frames], [0, 1], {
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
        padding: "60px 100px",
        zIndex: DESIGN_TOKENS.zIndex.content,
      }}
    >
      {/* Header */}
      <div
        style={{
          textAlign: "center",
          marginBottom: 50,
          opacity: headerOpacity,
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
          🛠️ 強大技術棧
        </h2>
        <p
          style={{
            fontSize: DESIGN_TOKENS.typography.subtitle.size,
            color: DESIGN_TOKENS.colors.text.secondary,
            marginTop: DESIGN_TOKENS.spacing.md,
          }}
        >
          現代化架構，穩定可靠
        </p>
      </div>

      {/* Tech Stack Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 24,
          width: "100%",
          maxWidth: 1000,
        }}
      >
        {techStack.map((tech, i) => {
          const delay = 15 + i * 4;
          const opacity = interpolate(
            frame,
            [delay, delay + standard.frames],
            [0, 1],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: standard.easing }
          );
          const y = interpolate(
            frame,
            [delay, delay + standard.frames],
            [20, 0],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: standard.easing }
          );

          return (
            <div
              key={tech.name}
              style={{
                padding: 28,
                background: `linear-gradient(135deg, ${DESIGN_TOKENS.colors.primary}10, rgba(255,255,255,0.03))`,
                borderRadius: 20,
                border: `1px solid ${DESIGN_TOKENS.colors.primary}25`,
                opacity,
                transform: `translateY(${y}px)`,
                textAlign: "center",
                backdropFilter: "blur(10px)",
                boxShadow: `
                  0 8px 32px rgba(0,0,0,0.2),
                  inset 0 1px 0 rgba(255,255,255,0.1)
                `,
              }}
            >
              <div
                style={{
                  marginBottom: 12,
                  color: tech.color,
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <tech.Icon size={40} />
              </div>
              <div
                style={{
                  fontSize: 18,
                  fontWeight: 700,
                  color: DESIGN_TOKENS.colors.text.primary,
                  marginBottom: 6,
                }}
              >
                {tech.name}
              </div>
              <div
                style={{
                  fontSize: 13,
                  color: DESIGN_TOKENS.colors.text.muted,
                }}
              >
                {tech.desc}
              </div>
            </div>
          );
        })}
      </div>

      {/* Architecture Highlights */}
      <div
        style={{
          display: "flex",
          gap: 30,
          marginTop: 50,
          opacity: interpolate(frame, [55, 70], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: standard.easing,
          }),
        }}
      >
        {[
          { icon: "🔄", text: "Webhook 架構", sub: "即時響應" },
          { icon: "⚡", text: "異步處理", sub: "非阻塞 IO" },
          { icon: "🛡️", text: "429 重試機制", sub: "指數退避" },
          { icon: "💾", text: "記憶管理", sub: "Deque 結構" },
        ].map((item, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "14px 22px",
              background: "rgba(255,255,255,0.05)",
              borderRadius: 12,
              border: "1px solid rgba(255,255,255,0.1)",
              transform: `translateY(${interpolate(
                frame,
                [60 + i * 3, 75 + i * 3],
                [10, 0],
                { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: micro.easing }
              )}px)`,
              opacity: interpolate(
                frame,
                [60 + i * 3, 75 + i * 3],
                [0, 1],
                { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: micro.easing }
              ),
            }}
          >
            <span style={{ fontSize: 24 }}>{item.icon}</span>
            <div>
              <div
                style={{
                  color: DESIGN_TOKENS.colors.text.primary,
                  fontSize: 14,
                  fontWeight: 600,
                }}
              >
                {item.text}
              </div>
              <div
                style={{
                  color: DESIGN_TOKENS.colors.text.muted,
                  fontSize: 11,
                }}
              >
                {item.sub}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
