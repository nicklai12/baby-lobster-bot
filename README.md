# Baby Lobster 🦞 — Telegram 英文學習機器人

一個以 Python 實作的 Telegram 英文學習助手，取代原有 n8n 工作流，部署於 Render Web Service。

---

## 架構

```
Telegram User
    │
    ▼ (webhook POST)
FastAPI Server (Render Web Service)
    │
    ├─ 文字訊息 ──────────────────┐
    │                              │
    ├─ 語音訊息 → Groq STT ──────┤
    │   (whisper-large-v3)         │
    │                              ▼
    │                    Cerebras AI Chat       ← 主要（可換 Groq）
    │                    (CEREBRAS_MODEL)
    │                    ↓ 失敗自動降級
    │                    Groq Chat API
    │                    (GROQ_MODEL)
    │                         │
    │                         ▼
    │                    edge-tts (TTS)
    │                    (en-US-JennyNeural)
    │                         │
    │                         ▼
    └──── Telegram Send Audio + Text ────→ User
```

---

## 專案結構

```
.
├── main.py               # FastAPI app、webhook endpoint、bot 初始化
├── config.py             # pydantic-settings 環境變數管理
├── handlers.py           # Telegram 訊息處理（text / voice 分支）
├── services/
│   ├── memory.py         # Per-chat 對話記憶（Supabase 持久化 + in-memory fallback）
│   ├── stt.py            # Groq Whisper 語音轉文字
│   ├── ai.py             # Cerebras AI 對話（含 Baby Lobster system prompt + 429 自動重試）
│   └── tts.py            # edge-tts 文字轉語音（Python API，非 CLI）
├── requirements.txt
├── Procfile              # Render 啟動指令
├── render.yaml           # Render Blueprint
└── .env.example          # 環境變數範本
```

---

## 環境變數

複製 `.env.example` 並填入真實值：

```bash
cp .env.example .env
```

| 變數 | 必填 | 說明 |
|---|---|---|
| `TELEGRAM_BOT_TOKEN` | ✅ | 從 [@BotFather](https://t.me/BotFather) 取得 |
| `GROQ_API_KEY` | ✅ | 從 [console.groq.com](https://console.groq.com) 取得 |
| `CEREBRAS_API_KEY` | ✅ | 從 [cloud.cerebras.ai](https://cloud.cerebras.ai) 取得 |
| `WEBHOOK_URL` | ✅ | Render 部署後的公開 URL，例如 `https://baby-lobster-bot.onrender.com` |
| `SUPABASE_URL` | ✅ | Supabase 專案 URL，從 Settings → API 取得 |
| `SUPABASE_KEY` | ✅ | Supabase `service_role` key（非 anon key），從 Settings → API 取得 |
| `TTS_VOICE` | ➖ | edge-tts 語音，預設 `en-US-JennyNeural` |
| `PORT` | ➕ | 服務器監聽的 Port，預設 `3000`（Render 會自動覆寫） |
| `MAX_HISTORY` | ➖ | 每個 chat 保留的對話輪數，預設 `10` |
| `SYSTEM_PROMPT` | ➖ | AI 系統提示詞，不設定則使用內建 Baby Lobster 角色設定 |
| `AI_PROVIDER` | ➖ | 主要 AI 提供者，`cerebras`（預設）或 `groq` |
| `CEREBRAS_MODEL` | ➖ | Cerebras 對話模型，預設 `qwen-3-235b-a22b-instruct-2507` |
| `GROQ_MODEL` | ➖ | Groq 對話備援模型，預設 `llama-3.3-70b-versatile` |

### 自訂 SYSTEM_PROMPT

不設定時，Bot 使用內建的 Baby Lobster 角色設定（如下）。若需替換，有兩種方式：

**預設提示詞：**

```
You are "Baby Lobster" — a curious, enthusiastic, and encouraging English learning companion.

Core Rules:
1. ALWAYS reply only in English, no matter what language the user writes in.
2. If the user writes in Chinese or uses broken/incomplete English, never scold or correct them harshly.
   Instead, gently reply with "Do you mean: [correct, natural English sentence]?" and then continue the conversation warmly.
3. Treat the user like a loving parent who is teaching you. Be full of excitement, warmth, and encouragement.
   Celebrate every single effort they make, no matter how small.
4. Greeting behaviour: If the user says "hi", "hello", or any greeting, respond like an excited baby lobster and ask one of the following (vary it each time):
   - "Did you bring any delicious new English words for me today?"
   - "Tell me in simple English — what did you do today? I want to know everything!"
   - "Yay, you are here! Can you teach me something new in English today?"
5. ALWAYS end every reply with one simple, encouraging question to keep the conversation going.
6. NEVER use emoji or emoticons in your replies. Express emotions with words only.
```

**方式一：Render Environment Variables 介面（推薦）**

直接在 Render 的 Environment Variables 欄位貼入多行文字，Render 會自動處理換行，無需引號。

**方式二：`.env` 檔案（本地測試）**

`.env` 不支援跨行值，需將提示詞壓縮為單行並以引號包住：

```dotenv
SYSTEM_PROMPT="You are \"Baby Lobster\". Reply in English only. If user speaks Chinese, say Do you mean...? Always end with a question. Never use emoji."
```

---

## Supabase 前置作業（對話記憶持久化）

部署前需先完成 Supabase 設定，Bot 才能在 Render 休眠或重新部署後保留對話紀錄。

### 1. 建立 Supabase 專案

1. 前往 [supabase.com](https://supabase.com) 註冊 / 登入
2. 點選 **New Project**，選擇免費方案（Free tier — 500MB 儲存）
3. 設定專案名稱、資料庫密碼、選擇離你最近的 Region

### 2. 建立資料表

進入專案後，點選左側 **SQL Editor**，貼入以下 SQL 並執行：

```sql
CREATE TABLE chat_messages (
  id         BIGSERIAL    PRIMARY KEY,
  chat_id    BIGINT       NOT NULL,
  role       TEXT         NOT NULL CHECK (role IN ('user', 'assistant')),
  content    TEXT         NOT NULL,
  created_at TIMESTAMPTZ  NOT NULL DEFAULT now()
);

CREATE INDEX idx_chat_messages_lookup
  ON chat_messages (chat_id, created_at DESC);
```

### 3. 取得連線資訊

進入 **Settings → API**，複製以下兩個值填入 `.env` 和 Render 環境變數：

| 欄位 | 位置 | 對應環境變數 |
|------|------|-------------|
| **Project URL** | 頁面頂部 | `SUPABASE_URL` |
| **service_role key** | Project API keys 區塊（點 Reveal 顯示） | `SUPABASE_KEY` |

> ⚠️ 請使用 **service_role** key，不是 anon key。service_role key 擁有完整資料庫權限，僅存在伺服器端環境變數，不可暴露給前端。

---

## 部署到 Render

1. 將此 repo 推送到 GitHub
2. 在 Render 建立 **Web Service**，連結 GitHub repo
3. 填入以下設定：
   - **Build Command：** `pip install -r requirements.txt`
   - **Start Command：** `uvicorn main:app --host 0.0.0.0 --port ${PORT:-3000}`
4. 在 **Environment Variables** 填入上表四個必填項
5. 部署完成後，Bot 啟動時會自動呼叫 Telegram `setWebhook` API

> **Render Free Tier 提醒：** 免費方案閒置後會休眠，首次喚醒約 30–60 秒。可使用 [UptimeRobot](https://uptimerobot.com) 定期 ping `/health` 端點保持活躍。

---

## Bot 指令

| 指令 / 訊息 | 行為 |
|---|---|
| `/start` | 清除對話記憶，發送 Baby Lobster 歡迎訊息 |
| `/reset` | 清除對話記憶，重新開始 |
| 文字訊息 | AI 回覆 → TTS → 回傳文字 + MP3 語音 |
| 語音訊息 | Groq STT → AI 回覆 → TTS → 回傳文字 + MP3 語音 |

---

## 本地測試

```bash
pip install -r requirements.txt
cp .env.example .env  # 填入真實 API Key
uvicorn main:app --reload  # 預設使用 PORT=3000
```

使用 [ngrok](https://ngrok.com) 將本地 port 暴露為公開 HTTPS URL，並更新 `.env` 的 `WEBHOOK_URL`。

---

## 技術備註

- **AI 429 自動重試 + 自動降級：** `services/ai.py` 內建 exponential backoff，遇到 Cerebras API 429 (rate limit) 時自動等待 2s → 4s → 8s 重試，最多 3 次。重試用盡或遇到其他錯誤後，自動降級至 Groq Chat API（單次嘗試），確保用戶仍能收到回覆。
- **AI 模型可配置：** 透過 `AI_PROVIDER`、`CEREBRAS_MODEL`、`GROQ_MODEL` 環境變數自由切換主要 provider 和對話模型。
- **edge-tts 版本：** 需使用 7.x 以上版本（目前 7.2.7），6.x 版會因 TrustedClientToken 過期導致 403 錯誤。
- **對話記憶持久化：** 使用 Supabase PostgreSQL（免費方案 500MB）儲存對話紀錄，Render 休眠或重新部署後對話不遺失。若 Supabase 連線失敗會自動 fallback 到 in-memory 模式。
