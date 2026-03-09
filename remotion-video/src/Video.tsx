import { Sequence, useCurrentFrame, useVideoConfig, interpolate, Easing } from "remotion";
import { IntroScene } from "./scenes/IntroScene";
import { FeatureScene } from "./scenes/FeatureScene";
import { VoiceScene } from "./scenes/VoiceScene";
import { AIScene } from "./scenes/AIScene";
import { TechStackScene } from "./scenes/TechStackScene";
import { OutroScene } from "./scenes/OutroScene";

// ============================================
// UI/UX Pro Max - Educational App Design System
// Based on: #10 Educational App (Dark adaptation)
// ============================================
export const DESIGN_TOKENS = {
  // Colors - Educational App Dark Theme
  // Primary: Indigo (warm, friendly, educational)
  colors: {
    background: {
      start: "#1E1B4B",    // Deep Indigo (dark, warm)
      middle: "#312E81",   // Indigo 800
      end: "#1E293B",      // Slate 800 (for depth)
    },
    primary: "#6366F1",      // Indigo 500 (friendly, educational)
    primaryLight: "#818CF8", // Indigo 400
    primaryDark: "#4F46E5",  // Indigo 600
    secondary: "#22D3EE",    // Cyan 400 (energetic, fresh)
    accent: "#F97316",       // Orange 500 (CTA, energetic)
    success: "#22C55E",      // Green 500 (progress, success)
    warning: "#FBBF24",      // Amber 400 (attention)
    text: {
      primary: "#F8FAFC",    // Slate 50
      secondary: "rgba(248,250,252,0.85)",
      muted: "rgba(248,250,252,0.6)",
    },
  },

  // Typography - Educational (clear, readable)
  typography: {
    hero: { size: 72, weight: 800, lineHeight: 1.1, letterSpacing: "-1.5px" },
    title: { size: 40, weight: 700, lineHeight: 1.2, letterSpacing: "-0.5px" },
    subtitle: { size: 28, weight: 600, lineHeight: 1.4 },
    body: { size: 20, weight: 400, lineHeight: 1.6 },
    caption: { size: 16, weight: 500, lineHeight: 1.5 },
  },

  // Z-Index Scale (Rule #15)
  zIndex: {
    background: 10,
    particles: 20,
    orbs: 25,
    content: 30,
    overlay: 40,
    modal: 50,
  },

  // Animation Timing (Rule #8: 150-300ms)
  animation: {
    micro: { frames: 5, easing: Easing.out(Easing.quad) },      // 167ms @ 30fps
    standard: { frames: 8, easing: Easing.out(Easing.cubic) },  // 267ms @ 30fps
    emphasis: { frames: 12, easing: Easing.out(Easing.back) },  // 400ms @ 30fps
  },

  // Spacing Scale
  spacing: {
    xs: 8,
    sm: 16,
    md: 24,
    lg: 32,
    xl: 48,
    xxl: 64,
  },
} as const;

export const BabyLobsterPromo: React.FC = () => {
  return (
    <div style={{
      width: 1920,
      height: 1080,
      background: `linear-gradient(135deg, ${DESIGN_TOKENS.colors.background.start} 0%, ${DESIGN_TOKENS.colors.background.middle} 50%, ${DESIGN_TOKENS.colors.background.end} 100%)`,
      position: "relative",
      overflow: "hidden",
      fontFamily: "'Inter', 'Noto Sans TC', -apple-system, BlinkMacSystemFont, sans-serif",
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

  // Optimized: Reduced particles from 20 to 10 (Rule #7)
  const particles = Array.from({ length: 10 }, (_, i) => ({
    id: i,
    x: (i * 180) % 1920,
    y: (i * 97) % 1080,
    size: 6 + (i % 4),
    delay: i * 5,
    color: i % 2 === 0 ? DESIGN_TOKENS.colors.primary : DESIGN_TOKENS.colors.secondary,
  }));

  return (
    <div style={{
      position: "absolute",
      inset: 0,
      pointerEvents: "none",
      zIndex: DESIGN_TOKENS.zIndex.particles,
    }}>
      {particles.map((p) => {
        // Smoother animation with easing
        const floatY = Math.sin((frame + p.delay) * 0.015) * 20;
        const opacity = 0.2 + Math.sin((frame + p.delay) * 0.02) * 0.15;

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
              background: p.color,
              opacity,
              boxShadow: `0 0 ${p.size * 2}px ${p.color}40`,
            }}
          />
        );
      })}

      {/* Gradient orbs with new color scheme */}
      <div style={{
        position: "absolute",
        width: 700,
        height: 700,
        borderRadius: "50%",
        background: `radial-gradient(circle, ${DESIGN_TOKENS.colors.primary}18 0%, transparent 70%)`,
        left: -250,
        top: -150,
        transform: `translate(${Math.sin(frame * 0.008) * 40}px, ${Math.cos(frame * 0.012) * 30}px)`,
        zIndex: DESIGN_TOKENS.zIndex.orbs,
      }} />
      <div style={{
        position: "absolute",
        width: 900,
        height: 900,
        borderRadius: "50%",
        background: `radial-gradient(circle, ${DESIGN_TOKENS.colors.secondary}12 0%, transparent 70%)`,
        right: -350,
        bottom: -250,
        transform: `translate(${Math.cos(frame * 0.01) * 50}px, ${Math.sin(frame * 0.015) * 40}px)`,
        zIndex: DESIGN_TOKENS.zIndex.orbs,
      }} />
    </div>
  );
};
