import { useCurrentFrame, useVideoConfig, interpolate, Easing, spring } from "remotion";

export const FeatureScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const features = [
    {
      icon: "🔊",
      title: "AI 語音回覆",
      desc: "使用 edge-tts，JennyNeural 語音為你朗讀回覆，邊聽邊學",
      color: "#4ecdc4",
      highlight: "自然發音",
    },
    {
      icon: "🧠",
      title: "智能記憶",
      desc: "Per-chat 對話記憶，記住你們的對話脈絡，聊天更連貫",
      color: "#ff6b6b",
      highlight: "10輪記憶",
    },
    {
      icon: "🌏",
      title: "中英文混合",
      desc: "說中文、破碎英文都沒問題，Baby Lobster 會理解並幫你修正",
      color: "#ffe66d",
      highlight: "無障礙溝通",
    },
    {
      icon: "🎉",
      title: "鼓勵教學",
      desc: "像熱情的寶寶龍蝦一樣，用愛與耐心陪伴你的英文學習旅程",
      color: "#a8e6cf",
      highlight: "正面激勵",
    },
  ];

  return (
    <div style={{
      width: "100%",
      height: "100%",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      padding: "60px 80px",
    }}>
      {/* Header */}
      <div style={{
        textAlign: "center",
        marginBottom: 50,
      }}>
        <h2 style={{
          fontSize: 56,
          fontWeight: 800,
          color: "#fff",
          margin: 0,
          opacity: interpolate(frame, [0, 20], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
          transform: `translateY(${interpolate(frame, [0, 20], [30, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}px)`,
          textShadow: "0 0 50px rgba(78, 205, 196, 0.5)",
        }}>
          ✨ 強大功能一覽
        </h2>
        <p style={{
          fontSize: 24,
          color: "rgba(255,255,255,0.7)",
          marginTop: 15,
          opacity: interpolate(frame, [10, 30], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
        }}>
          讓英文學習變得有趣又高效
        </p>
      </div>

      {/* Features Grid */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(2, 1fr)",
        gap: 30,
        maxWidth: 1400,
      }}>
        {features.map((feature, i) => {
          const delay = i * 10;
          const opacity = interpolate(frame, [20 + delay, 40 + delay], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          const scale = interpolate(frame, [20 + delay, 40 + delay], [0.9, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          const y = interpolate(frame, [20 + delay, 40 + delay], [30, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

          return (
            <div key={i} style={{
              padding: 40,
              background: "linear-gradient(135deg, rgba(255,255,255,0.08), rgba(255,255,255,0.02))",
              borderRadius: 24,
              border: `2px solid ${feature.color}30`,
              opacity,
              transform: `scale(${scale}) translateY(${y}px)`,
              backdropFilter: "blur(10px)",
              position: "relative",
              overflow: "hidden",
            }}>
              {/* Glow effect */}
              <div style={{
                position: "absolute",
                top: -100,
                right: -100,
                width: 200,
                height: 200,
                background: `radial-gradient(circle, ${feature.color}30, transparent)`,
                borderRadius: "50%",
              }} />

              {/* Highlight badge */}
              <div style={{
                position: "absolute",
                top: 20,
                right: 20,
                padding: "6px 14px",
                background: `${feature.color}25`,
                borderRadius: 20,
                fontSize: 13,
                fontWeight: 600,
                color: feature.color,
                border: `1px solid ${feature.color}40`,
              }}>
                {feature.highlight}
              </div>

              <div style={{
                fontSize: 64,
                marginBottom: 20,
              }}>
                {feature.icon}
              </div>

              <h3 style={{
                fontSize: 28,
                fontWeight: 700,
                color: "#fff",
                margin: "0 0 15px 0",
              }}>
                {feature.title}
              </h3>

              <p style={{
                fontSize: 18,
                color: "rgba(255,255,255,0.75)",
                margin: 0,
                lineHeight: 1.6,
              }}>
                {feature.desc}
              </p>
            </div>
          );
        })}
      </div>

      {/* Bottom stats */}
      <div style={{
        display: "flex",
        gap: 60,
        marginTop: 50,
        opacity: interpolate(frame, [70, 90], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
      }}>
        {[
          { value: "100%", label: "英文回覆", color: "#ff6b6b" },
          { value: "24/7", label: "隨時在線", color: "#4ecdc4" },
          { value: "🦞", label: "可愛夥伴", color: "#ffe66d" },
        ].map((stat, i) => (
          <div key={i} style={{
            textAlign: "center",
            transform: `translateY(${interpolate(frame, [70 + i * 5, 90 + i * 5], [20, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}px)`,
          }}>
            <div style={{
              fontSize: 42,
              fontWeight: 900,
              color: stat.color,
              textShadow: `0 0 30px ${stat.color}50`,
            }}>
              {stat.value}
            </div>
            <div style={{
              fontSize: 16,
              color: "rgba(255,255,255,0.6)",
              marginTop: 8,
            }}>
              {stat.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
