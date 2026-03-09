# Baby Lobster 宣傳影片

使用 Remotion 製作的 Telegram 英文學習機器人宣傳影片。

## 專案結構

```
remotion-video/
├── src/
│   ├── index.tsx           # 入口文件
│   ├── Video.tsx           # 主影片組件
│   └── scenes/
│       ├── IntroScene.tsx      # 開場 (0-5s)
│       ├── VoiceScene.tsx      # 語音功能 (5-10s)
│       ├── AIScene.tsx         # AI 智能 (10-15s)
│       ├── FeatureScene.tsx    # 功能亮點 (15-20s)
│       ├── TechStackScene.tsx  # 技術棧 (20-25s)
│       └── OutroScene.tsx      # 結尾 (25-30s)
├── package.json
├── tsconfig.json
└── remotion.config.ts

總時長：30 秒 (900 幀 @ 30fps)
解析度：1920x1080 (Full HD)
```

## 影片場景說明

### 🎬 Scene 1: Intro (0-5s)
- Baby Lobster Logo 動畫
- 標題：Baby Lobster Telegram 英文學習機器人
- 副標題：你好奇又熱情的 AI 英文學習夥伴
- 功能標籤展示

### 🎙️ Scene 2: Voice Features (5-10s)
- 語音對話功能展示
- 手機界面 Mockup
- 語音波形動畫
- Groq Whisper 技術說明

### 🤖 Scene 3: AI Core (10-15s)
- AI 大腦視覺化
- Cerebras AI 介紹
- 鼓勵式教學說明
- 對話記憶功能

### ✨ Scene 4: Feature Highlights (15-20s)
- AI 語音回覆 (edge-tts)
- 智能記憶 (10輪對話)
- 中英文混合支援
- 鼓勵式教學

### 🛠️ Scene 5: Tech Stack (20-25s)
- FastAPI + Telegram
- Groq + Cerebras
- edge-tts + Render
- 架構亮點

### 🎉 Scene 6: Outro (25-30s)
- 慶祝動畫 + 彩帶效果
- CTA：立即體驗
- 社交連結

## 安裝與運行

```bash
# 安裝依賴
npm install

# 開發模式
npm start

# 渲染影片
npm run build
```

## 技術亮點

- 使用 Remotion 的 `spring` 動畫函數實現彈性效果
- `interpolate` 進行平滑過渡動畫
- 粒子背景和光暈效果
- 響應式手機界面 Mockup
- 動態語音波形可視化

## 專案特點

- 🦞 可愛的 Baby Lobster 角色形象
- 🎨 漸層配色：珊瑚紅 (#ff6b6b) + 青綠 (#4ecdc4)
- ✨ 豐富的動畫效果
- 📱 現代化的 UI 設計
