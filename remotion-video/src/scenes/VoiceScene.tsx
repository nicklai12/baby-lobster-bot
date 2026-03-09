import { useCurrentFrame, useVideoConfig, interpolate, Easing } from "remotion";

export const VoiceScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const sceneProgress = frame / 150;

  // Title animation
  const titleOpacity = interpolate(frame, [0, 20], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const titleX = interpolate(frame, [0, 20], [-50, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Phone mockup animation
  const phoneScale = interpolate(frame, [10, 30], [0.8, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const phoneOpacity = interpolate(frame, [10, 30], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Voice wave animation
  const wavePhase = frame * 0.15;

  // Chat bubbles
  const bubble1Opacity = interpolate(frame, [40, 60], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const bubble1Y = interpolate(frame, [40, 60], [30, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const bubble2Opacity = interpolate(frame, [80, 100], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const bubble2Y = interpolate(frame, [80, 100], [30, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Feature list animation
  const featuresOpacity = interpolate(frame, [110, 130], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <div style={{
      width: "100%",
      height: "100%",
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-around",
      padding: "0 120px",
    }}>
      {/* Left side - Title and description */}
      <div style={{ flex: 1, maxWidth: 700 }}>
        <h2 style={{
          fontSize: 64,
          fontWeight: 800,
          color: "#fff",
          margin: 0,
          opacity: titleOpacity,
          transform: `translateX(${titleX}px)`,
          textShadow: "0 0 40px rgba(78, 205, 196, 0.5)",
        }}>
          🎙️ 語音對話
        </h2>

        <p style={{
          fontSize: 28,
          color: "rgba(255,255,255,0.85)",
          marginTop: 30,
          lineHeight: 1.7,
          opacity: titleOpacity,
          transform: `translateX(${titleX}px)`,
        }}>
          不用打字，直接說話！<br/>
          使用 Groq Whisper 技術，<br/>
          精準識別你的英文發音
        </p>

        {/* Features */}
        <div style={{
          marginTop: 50,
          opacity: featuresOpacity,
        }}>
          {[
            { icon: "🎯", text: "whisper-large-v3 模型" },
            { icon: "⚡", text: "即時語音轉文字" },
            { icon: "🌐", text: "支援中英文混合" },
          ].map((feature, i) => (
            <div key={i} style={{
              display: "flex",
              alignItems: "center",
              gap: 15,
              marginBottom: 20,
              fontSize: 24,
              color: "rgba(255,255,255,0.9)",
            }}>
              <span style={{
                width: 40,
                height: 40,
                background: "linear-gradient(135deg, #ff6b6b, #ff8e53)",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 20,
              }}>
                {feature.icon}
              </span>
              {feature.text}
            </div>
          ))}
        </div>
      </div>

      {/* Right side - Phone mockup */}
      <div style={{
        width: 380,
        height: 720,
        background: "linear-gradient(145deg, #2a2a4a, #1a1a2e)",
        borderRadius: 50,
        padding: 20,
        boxShadow: "0 50px 100px rgba(0,0,0,0.5), inset 0 0 0 2px rgba(255,255,255,0.1)",
        transform: `scale(${phoneScale}) rotateY(${interpolate(frame, [0, 150], [5, -5])}deg)`,
        opacity: phoneOpacity,
        position: "relative",
      }}>
        {/* Phone screen */}
        <div style={{
          width: "100%",
          height: "100%",
          background: "linear-gradient(180deg, #0a0a1a 0%, #1a1a3e 100%)",
          borderRadius: 35,
          padding: 25,
          display: "flex",
          flexDirection: "column",
        }}>
          {/* Header */}
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            paddingBottom: 20,
            borderBottom: "1px solid rgba(255,255,255,0.1)",
          }}>
            <div style={{
              width: 45,
              height: 45,
              borderRadius: "50%",
              background: "linear-gradient(135deg, #ff6b6b, #ff8e53)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 24,
            }}>
              🦞
            </div>
            <div>
              <div style={{ color: "#fff", fontSize: 18, fontWeight: 600 }}>Baby Lobster</div>
              <div style={{ color: "#4ecdc4", fontSize: 13 }}>在線上 🟢</div>
            </div>
          </div>

          {/* Chat area */}
          <div style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            gap: 15,
            marginTop: 20,
          }}>
            {/* Voice message bubble */}
            <div style={{
              alignSelf: "flex-end",
              background: "linear-gradient(135deg, #ff6b6b, #ff8e53)",
              padding: "15px 20px",
              borderRadius: "20px 20px 5px 20px",
              maxWidth: 280,
              opacity: bubble1Opacity,
              transform: `translateY(${bubble1Y}px)`,
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: 20 }}>🎤</span>
                <div style={{
                  display: "flex",
                  gap: 3,
                  alignItems: "flex-end",
                  height: 25,
                }}>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} style={{
                      width: 4,
                      height: 10 + Math.sin(wavePhase + i * 0.8) * 8 + 5,
                      background: "rgba(255,255,255,0.9)",
                      borderRadius: 2,
                      transition: "height 0.1s ease",
                    }} />
                  ))}
                </div>
                <span style={{ color: "rgba(255,255,255,0.8)", fontSize: 12 }}>0:03</span>
              </div>
            </div>

            {/* AI reply */}
            <div style={{
              alignSelf: "flex-start",
              background: "rgba(255,255,255,0.1)",
              padding: "15px 20px",
              borderRadius: "20px 20px 20px 5px",
              maxWidth: 280,
              opacity: bubble2Opacity,
              transform: `translateY(${bubble2Y}px)`,
            }}>
              <p style={{ color: "#fff", fontSize: 15, margin: 0, lineHeight: 1.5 }}>
                🦞 Wow! That's great English practice! Do you mean: "I went to the park yesterday"? Keep it up! 🎉
              </p>
            </div>

            {/* Audio reply indicator */}
            <div style={{
              alignSelf: "flex-start",
              display: "flex",
              alignItems: "center",
              gap: 10,
              opacity: interpolate(frame, [100, 120], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
            }}>
              <div style={{
                width: 40,
                height: 40,
                borderRadius: "50%",
                background: "linear-gradient(135deg, #4ecdc4, #44a08d)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 18,
              }}>
                ▶️
              </div>
              <div style={{ display: "flex", gap: 2 }}>
                {Array.from({ length: 20 }).map((_, i) => (
                  <div key={i} style={{
                    width: 3,
                    height: 4 + Math.sin(frame * 0.2 + i * 0.3) * 8 + 4,
                    background: "#4ecdc4",
                    borderRadius: 1.5,
                  }} />
                ))}
              </div>
              <span style={{ color: "rgba(255,255,255,0.6)", fontSize: 12 }}>0:05</span>
            </div>
          </div>

          {/* Input area */}
          <div style={{
            display: "flex",
            gap: 10,
            alignItems: "center",
            padding: "15px",
            background: "rgba(255,255,255,0.05)",
            borderRadius: 25,
            marginTop: 10,
          }}>
            <div style={{
              flex: 1,
              height: 40,
              background: "rgba(255,255,255,0.1)",
              borderRadius: 20,
              display: "flex",
              alignItems: "center",
              paddingLeft: 15,
              color: "rgba(255,255,255,0.4)",
              fontSize: 14,
            }}>
              輸入訊息...
            </div>
            <div style={{
              width: 40,
              height: 40,
              borderRadius: "50%",
              background: "linear-gradient(135deg, #ff6b6b, #ff8e53)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 18,
            }}>
              🎤
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
