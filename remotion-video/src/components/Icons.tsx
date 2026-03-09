import React from 'react';
import {
  // Intro & General
  GraduationCap,
  Sparkles,
  Volume2,
  Bot,
  Brain,
  MessageCircle,
  RefreshCw,
  Zap,
  Globe,
  PartyPopper,
  Smartphone,
  BookOpen,
  Heart,
  // Tech Stack
  Server,
  Send,
  Target,
  Cpu,
  AudioWaveform,
  Rocket,
  // Features
  Mic,
  Repeat,
  Languages,
  Trophy,
  // Voice
  Headphones,
  Play,
  Waves,
  // GitHub/Social
  Github,
  FileText,
  // Navigation
  ChevronRight,
  CheckCircle2,
} from 'lucide-react';

// Icon wrapper with consistent styling for Remotion
interface IconProps {
  size?: number;
  color?: string;
  strokeWidth?: number;
}

const createIcon = (IconComponent: React.ElementType) => {
  return ({ size = 24, color = 'currentColor', strokeWidth = 2 }: IconProps) => (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: size,
      height: size,
    }}>
      <IconComponent
        size={size}
        color={color}
        strokeWidth={strokeWidth}
      />
    </div>
  );
};

// Export all icons
export const IconGraduationCap = createIcon(GraduationCap);
export const IconSparkles = createIcon(Sparkles);
export const IconVolume2 = createIcon(Volume2);
export const IconBot = createIcon(Bot);
export const IconBrain = createIcon(Brain);
export const IconMessageCircle = createIcon(MessageCircle);
export const IconRefreshCw = createIcon(RefreshCw);
export const IconZap = createIcon(Zap);
export const IconGlobe = createIcon(Globe);
export const IconPartyPopper = createIcon(PartyPopper);
export const IconSmartphone = createIcon(Smartphone);
export const IconBookOpen = createIcon(BookOpen);
export const IconHeart = createIcon(Heart);
export const IconServer = createIcon(Server);
export const IconSend = createIcon(Send);
export const IconTarget = createIcon(Target);
export const IconCpu = createIcon(Cpu);
export const IconAudioWaveform = createIcon(AudioWaveform);
export const IconRocket = createIcon(Rocket);
export const IconMic = createIcon(Mic);
export const IconRepeat = createIcon(Repeat);
export const IconLanguages = createIcon(Languages);
export const IconTrophy = createIcon(Trophy);
export const IconHeadphones = createIcon(Headphones);
export const IconPlay = createIcon(Play);
export const IconWaves = createIcon(Waves);
export const IconGithub = createIcon(Github);
export const IconFileText = createIcon(FileText);
export const IconChevronRight = createIcon(ChevronRight);
export const IconCheckCircle2 = createIcon(CheckCircle2);

// Animated Icon Component for Remotion
interface AnimatedIconProps extends IconProps {
  frame: number;
  animation?: 'pulse' | 'bounce' | 'wave';
}

export const AnimatedIcon: React.FC<AnimatedIconProps & { children: React.ReactNode }> = ({
  children,
  frame,
  animation = 'pulse',
  size = 24,
}) => {
  let transform = '';

  if (animation === 'pulse') {
    const scale = 1 + Math.sin(frame * 0.1) * 0.1;
    transform = `scale(${scale})`;
  } else if (animation === 'bounce') {
    const y = Math.abs(Math.sin(frame * 0.15)) * -5;
    transform = `translateY(${y}px)`;
  } else if (animation === 'wave') {
    const rotate = Math.sin(frame * 0.1) * 5;
    transform = `rotate(${rotate}deg)`;
  }

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: size,
      height: size,
      transform,
    }}>
      {children}
    </div>
  );
};
