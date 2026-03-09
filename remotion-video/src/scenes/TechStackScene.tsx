import { useCurrentFrame, useVideoConfig, interpolate, Easing } from "remotion";

export const TechStackScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const techStack = [
    { name: "FastAPI", icon: "⚡", desc: "高速 Web 框架", color: "#009688" },
    { name: "Telegram Bot", icon: "📱", desc: "即時通訊整合", color: "#0088cc" },
    { name: "Groq", icon: "🎯", desc: "Whisper STT", color: "#f55036" },
    { name: "Cerebras", icon: "🧠", desc: "AI 推理引擎", color: "#7c3aed" },
    { name: "edge-tts", icon: "🔊", desc: "語音合成", color: "#00a4ef" },
    { name: "Render", icon: "🚀", desc: "雲端部署", color: "#46e3b7" },
  ];

  const connections = [
    { from: 0, to: 1 },
    { from: 1, to: 2 },
    { from: 2, to: 3 },
    { from: 3, to: 4 },
    { from: 4, to: 1 },
  ];

  return (
    <div style={{
      width: "100%",
      height: "100%",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      padding: "60px 100px",
    }}>
      {/* Header */}
      <div style={{
        textAlign: "center",
        marginBottom: 60,
      }}>
        <h2 style={{
          fontSize: 56,
          fontWeight: 800,
          color: "#fff",
          margin: 0,
          opacity: interpolate(frame, [0, 20], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
          transform: `translateY(${interpolate(frame, [0, 20], [30, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}px)`,
          textShadow: "0 0 50px rgba(255, 107, 107, 0.5)",
        }}>
          🛠️ 強大技術棧
        </h2>
        <p style={{
          fontSize: 24,
          color: "rgba(255,255,255,0.7)",
          marginTop: 15,
          opacity: interpolate(frame, [10, 30], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
        }}>
          現代化架構，穩定可靠
        </p>
      </div>

      {/* Tech Stack Flow Diagram */}
      <div style={{
        display: "flex",
        flexDirection: "column",
        gap: 20,
        width: "100%",
        maxWidth: 1200,
        alignItems: "center",
      }}>
        {/* Row 1: Infrastructure */}
        <div style={{
          display: "flex",
          gap: 30,
          justifyContent: "center",
        }}>
          {techStack.slice(0, 3).map((tech, i) => {
            const delay = i * 8;
            const opacity = interpolate(frame, [20 + delay, 40 + delay], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
            const x = interpolate(frame, [20 + delay, 40 + delay], [-30, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

            return (
              <TechCard
                key={tech.name}
                tech={tech}
                opacity={opacity}
                transform={`translateX(${x}px)`}
              />
            );
          })}
        </div>

        {/* Flow arrows */}
        <div style={{
          display: "flex",
          justifyContent: "center",
          gap: 200,
          opacity: interpolate(frame, [50, 70], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
        }}>
          {["⬇", "⬇", "⬇"].map((arrow, i) => (
            <span key={i} style={{
              fontSize: 24,
              color: "rgba(255,255,255,0.5)",
              transform: `translateY(${Math.sin(frame * 0.1 + i) * 5}px)`,
            }}>
              {arrow}
            </span>
          ))}
        </div>

        {/* Row 2: AI Services */}
        <div style={{
          display: "flex",
          gap: 30,
          justifyContent: "center",
        }}>
          {techStack.slice(3, 6).map((tech, i) => {
            const delay = (i + 3) * 8;
            const opacity = interpolate(frame, [40 + delay, 60 + delay], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
            const x = interpolate(frame, [40 + delay, 60 + delay], [30, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

            return (
              <TechCard
                key={tech.name}
                tech={tech}
                opacity={opacity}
                transform={`translateX(${x}px)`}
              />
            );
          })}
        </div>
      </div>

      {/* Architecture Highlights */}
      <div style={{
        display: "flex",
        gap: 40,
        marginTop: 60,
      }}>
        {[
          { icon: "🔄", text: "Webhook 架構", sub: "即時響應" },
          { icon: "⚡", text: "異步處理", sub: "非阻塞 IO" },
          { icon: "🛡️", text: "429 重試機制", sub: "指數退避" },
          { icon: "💾", text: "記憶管理", sub: "Deque 結構" },
        ].map((item, i) => {
          const delay = 80 + i * 5;
          const opacity = interpolate(frame, [delay, delay + 15], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          const y = interpolate(frame, [delay, delay + 15], [20, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

          return (
            <div key={i} style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "15px 25px",
              background: "rgba(255,255,255,0.05)",
              borderRadius: 12,
              border: "1px solid rgba(255,255,255,0.1)",
              opacity,
              transform: `translateY(${y}px)`,
            }}>
              <span style={{ fontSize: 28 }}>{item.icon}</span>
              <div>
                <div style={{ color: "#fff", fontSize: 16, fontWeight: 600 }}>{item.text}</div>
                <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 12 }}>{item.sub}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* GitHub badge */}
      <div style={{
        marginTop: 40,
        padding: "15px 30px",
        background: "linear-gradient(135deg, #333, #1a1a1a)",
        borderRadius: 30,
        display: "flex",
        alignItems: "center",
        gap: 12,
        opacity: interpolate(frame, [110, 130], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
        border: "1px solid rgba(255,255,255,0.1)",
      }}>
        <span style={{ fontSize: 24 }}>🐙</span>
        <span style={{ color: "#fff", fontSize: 16 }}>Open Source on GitHub</span>
        <span style={{ color: "rgba(255,255,255,0.5)", fontSize: 14 }}>remotion-dev/skills</span>
      </div>
    </div>
  );
};

const TechCard: React.FC<{
  tech: { name: string; icon: string; desc: string; color: string };
  opacity: number;
  transform: string;
}> = ({ tech, opacity, transform }) => {
  return (
    <div style={{
      width: 200,
      padding: 25,
      background: "linear-gradient(135deg, rgba(255,255,255,0.08), rgba(255,255,255,0.02))",
      borderRadius: 16,
      border: `2px solid ${tech.color}40`,
      opacity,
      transform,
      textAlign: "center",
      position: "relative",
      overflow: "hidden",
    }}>
      {/* Glow */}
      <div style={{
        position: "absolute",
        top: -50,
        left: "50%",
        transform: "translateX(-50%)",
        width: 100,
        height: 100,
        background: `radial-gradient(circle, ${tech.color}40, transparent)`,
        borderRadius: "50%",
      }} />

      <div style={{
        fontSize: 48,
        marginBottom: 12,
        position: "relative",
      }}>
        {tech.icon}
      </div>

      <div style={{
        fontSize: 20,
        fontWeight: 700,
        color: tech.color,
        marginBottom: 6,
      }}>
        {tech.name}
      </div>

      <div style={{
        fontSize: 13,
        color: "rgba(255,255,255,0.6)",
      }}>
        {tech.desc}
      </div>
    </div>
  );
};
