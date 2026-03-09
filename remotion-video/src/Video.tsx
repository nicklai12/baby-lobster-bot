import { Sequence, useCurrentFrame, useVideoConfig, interpolate, Easing } from "remotion";
import { IntroScene } from "./scenes/IntroScene";
import { FeatureScene } from "./scenes/FeatureScene";
import { VoiceScene } from "./scenes/VoiceScene";
import { AIScene } from "./scenes/AIScene";
import { TechStackScene } from "./scenes/TechStackScene";
import { OutroScene } from "./scenes/OutroScene";

export const BabyLobsterPromo: React.FC = () => {
  return (
    <div style={{
      width: 1920,
      height: 1080,
      background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
      position: "relative",
      overflow: "hidden",
      fontFamily: "'Inter', 'Noto Sans TC', sans-serif",
    }}>
      {/* Background particles effect */}
      <ParticleBackground />

      {/* Scene 1: Intro (0-150 frames = 5s) */}
      <Sequence from={0} durationInFrames={150}>
        <IntroScene />
      </Sequence>

      {/* Scene 2: Voice Features (150-300 frames = 5s) */}
      <Sequence from={150} durationInFrames={150}>
        <VoiceScene />
      </Sequence>

      {/* Scene 3: AI Features (300-450 frames = 5s) */}
      <Sequence from={300} durationInFrames={150}>
        <AIScene />
      </Sequence>

      {/* Scene 4: Feature Highlights (450-600 frames = 5s) */}
      <Sequence from={450} durationInFrames={150}>
        <FeatureScene />
      </Sequence>

      {/* Scene 5: Tech Stack (600-750 frames = 5s) */}
      <Sequence from={600} durationInFrames={150}>
        <TechStackScene />
      </Sequence>

      {/* Scene 6: Outro (750-900 frames = 5s) */}
      <Sequence from={750} durationInFrames={150}>
        <OutroScene />
      </Sequence>
    </div>
  );
};

const ParticleBackground: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Generate animated particles
  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    x: (i * 97) % 1920,
    y: (i * 53) % 1080,
    size: 4 + (i % 6),
    delay: i * 3,
  }));

  return (
    <div style={{
      position: "absolute",
      inset: 0,
      pointerEvents: "none",
    }}>
      {particles.map((p) => {
        const floatY = Math.sin((frame + p.delay) * 0.02) * 30;
        const opacity = 0.3 + Math.sin((frame + p.delay) * 0.03) * 0.2;

        return (
          <div
            key={p.id}
            style={{
              position: "absolute",
              left: p.x,
              top: p.y + floatY,
              width: p.size,
              height: p.size,
              borderRadius: "50%",
              background: `rgba(255, 107, 107, ${opacity})`,
              boxShadow: `0 0 ${p.size * 2}px rgba(255, 107, 107, ${opacity * 0.5})`,
            }}
          />
        );
      })}

      {/* Gradient orbs */}
      <div style={{
        position: "absolute",
        width: 600,
        height: 600,
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(255,107,107,0.15) 0%, transparent 70%)",
        left: -200,
        top: -100,
        transform: `translate(${Math.sin(frame * 0.01) * 50}px, ${Math.cos(frame * 0.015) * 30}px)`,
      }} />
      <div style={{
        position: "absolute",
        width: 800,
        height: 800,
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(78,205,196,0.1) 0%, transparent 70%)",
        right: -300,
        bottom: -200,
        transform: `translate(${Math.cos(frame * 0.012) * 40}px, ${Math.sin(frame * 0.018) * 50}px)`,
      }} />
    </div>
  );
};
