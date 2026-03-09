import { useCurrentFrame, useVideoConfig, interpolate, Easing, spring } from "remotion";

export const AIScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Title animation
  const titleOpacity = interpolate(frame, [0, 20], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const titleY = interpolate(frame, [0, 20], [30, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // AI brain animation
  const brainScale = spring({
    frame: frame - 10,
    fps,
    config: { damping: 12, stiffness: 80 },
  });

  // Neural network animation
  const pulse = Math.sin(frame * 0.1) * 0.5 + 0.5;

  // Feature cards
  const cards = [
    { icon: "🧠", title: "Cerebras AI", desc: "gpt-oss-120b 強大模型", color: "#ff6b6b" },
    { icon: "💬", title: "鼓勵式教學", desc: "像父母般耐心引導", color: "#4ecdc4" },
    { icon: "🔄", title: "對話記憶", desc: "記住上下文脈絡", color: "#ffe66d" },
    { icon: "⚡", title: "429 自動重試", desc: "智能錯誤處理", color: "#a8e6cf" },
  ];

  return (
    <div style={{
      width: "100%",
      height: "100%",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      padding: "80px 100px",
    }}>
      {/* Header */}
      <div style={{
        textAlign: "center",
        marginBottom: 60,
        opacity: titleOpacity,
        transform: `translateY(${titleY}px)`,
      }}>
        <h2 style={{
          fontSize: 64,
          fontWeight: 800,
          color: "#fff",
          margin: 0,
          textShadow: "0 0 50px rgba(255, 107, 107, 0.5)",
        }}>
          🤖 AI 智能核心
        </h2>
        <p style={{
          fontSize: 28,
          color: "rgba(255,255,255,0.8)",
          marginTop: 20,
        }}>
          不只是對話，更是專屬的英文學習夥伴
        </p>
      </div>

      {/* AI Visualization */}
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 80,
        width: "100%",
      }}>
        {/* Brain visualization */}
        <div style={{
          position: "relative",
          width: 300,
          height: 300,
        }}>
          {/* Glowing rings */}
          {[0, 1, 2].map((i) => (
            <div key={i} style={{
              position: "absolute",
              inset: i * 40,
              borderRadius: "50%",
              border: `2px solid rgba(255, 107, 107, ${0.3 - i * 0.1})`,
              transform: `scale(${1 + pulse * 0.05 * (i + 1)})`,
            }} />
          ))}

          {/* Center brain */}
          <div style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 120,
            transform: `scale(${interpolate(brainScale, [0, 1], [0.8, 1])})`,
            filter: `drop-shadow(0 0 ${40 * pulse}px rgba(255, 107, 107, 0.8))`,
          }}>
            🧠
          </div>

          {/* Orbiting particles */}
          {Array.from({ length: 6 }).map((_, i) => {
            const angle = (frame * 0.02 + i * Math.PI / 3) % (Math.PI * 2);
            const x = Math.cos(angle) * 150;
            const y = Math.sin(angle) * 150;
            return (
              <div key={i} style={{
                position: "absolute",
                width: 12,
                height: 12,
                borderRadius: "50%",
                background: "#ff6b6b",
                left: 150 + x - 6,
                top: 150 + y - 6,
                boxShadow: "0 0 20px #ff6b6b",
              }} />
            );
          })}
        </div>

        {/* Feature cards */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: 25,
        }}>
          {cards.map((card, i) => {
            const cardDelay = i * 8;
            const cardOpacity = interpolate(frame, [30 + cardDelay, 50 + cardDelay], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
            const cardX = interpolate(frame, [30 + cardDelay, 50 + cardDelay], [50, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

            return (
              <div key={i} style={{
                width: 280,
                padding: 30,
                background: "rgba(255,255,255,0.05)",
                borderRadius: 20,
                border: `1px solid ${card.color}40`,
                opacity: cardOpacity,
                transform: `translateX(${cardX}px)`,
                backdropFilter: "blur(10px)",
              }}>
                <div style={{
                  fontSize: 48,
                  marginBottom: 15,
                }}>
                  {card.icon}
                </div>
                <h3 style={{
                  fontSize: 24,
                  fontWeight: 700,
                  color: card.color,
                  margin: "0 0 10px 0",
                }}>
                  {card.title}
                </h3>
                <p style={{
                  fontSize: 16,
                  color: "rgba(255,255,255,0.7)",
                  margin: 0,
                  lineHeight: 1.5,
                }}>
                  {card.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quote */}
      <div style={{
        marginTop: 60,
        padding: "30px 50px",
        background: "linear-gradient(135deg, rgba(255,107,107,0.1), rgba(78,205,196,0.1))",
        borderRadius: 20,
        border: "1px solid rgba(255,255,255,0.1)",
        opacity: interpolate(frame, [80, 100], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
      }}>
        <p style={{
          fontSize: 24,
          color: "rgba(255,255,255,0.9)",
          fontStyle: "italic",
          margin: 0,
          textAlign: "center",
        }}>
          "Do you mean: [correct English]? Don't worry, you're doing great! 🎉"
        </p>
        <p style={{
          fontSize: 16,
          color: "#ff6b6b",
          textAlign: "center",
          marginTop: 10,
        }}>
          — Baby Lobster 鼓勵式回覆範例
        </p>
      </div>
    </div>
  );
};
