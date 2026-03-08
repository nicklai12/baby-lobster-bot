# Baby Lobster Telegram Bot — 執行計畫

> 將 n8n 工作流替換為 Python 應用程式，部署到 Render Web Service (Webhook 模式)。

---

## 架構總覽

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
    │                    OpenRouter AI Chat
    │                    (gpt-oss-120b:free)
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
/workspaces/n8n/
├── main.py               # FastAPI app, webhook endpoint, bot 初始化
├── config.py             # 環境變數管理 (pydantic-settings)
├── handlers.py           # Telegram 訊息處理 (text + voice 分支)
├── services/
│   ├── __init__.py
│   ├── stt.py            # Groq Whisper STT
│   ├── ai.py             # OpenRouter chat completion
│   ├── tts.py            # edge-tts 語音合成
│   └── memory.py         # Per-chat 對話記憶
├── requirements.txt
├── Procfile              # Render 啟動指令
├── render.yaml           # Render Blueprint (optional)
└── .env.example          # 環境變數範本
```

---

## 實作步驟

### Phase 1: 專案骨架與設定

1. **建立 `config.py`** — 使用 pydantic-settings 集中管理環境變數：
   - `TELEGRAM_BOT_TOKEN`
   - `GROQ_API_KEY`
   - `OPENROUTER_API_KEY`
   - `WEBHOOK_URL`（Render 提供的公開 URL）
   - `TTS_VOICE`（預設 `en-US-JennyNeural`）
   - `MAX_HISTORY`（預設 10 輪）

2. **建立 `requirements.txt`** — 依賴清單：
   - `python-telegram-bot[webhooks]~=21.x`
   - `fastapi`
   - `uvicorn[standard]`
   - `httpx`（呼叫 Groq / OpenRouter API）
   - `edge-tts`
   - `pydantic-settings`
   - `python-dotenv`

3. **建立 `.env.example`** — 環境變數範本

### Phase 2: 核心服務實作（步驟 4-7 可平行開發）

4. **`services/memory.py`** — 對話記憶管理
   - `ChatMemory` class：使用 `dict[int, deque[dict]]` 存每個 chat_id 的對話歷史
   - `add_message(chat_id, role, content)` → 加入訊息，超過 MAX_HISTORY 自動移除最舊的
   - `get_history(chat_id)` → 回傳 OpenAI messages 格式的 list
   - `clear(chat_id)` → 清除特定 chat 的記憶

5. **`services/stt.py`** — Groq 語音轉文字
   - `transcribe(audio_bytes: bytes) -> str`
   - 使用 httpx 呼叫 `https://api.groq.com/openai/v1/audio/transcriptions`
   - Form-data: `file`（audio bytes, filename=audio.ogg）, `model=whisper-large-v3`
   - Header: `Authorization: Bearer {GROQ_API_KEY}`

6. **`services/ai.py`** — OpenRouter AI 對話
   - `chat(messages: list[dict]) -> str`
   - 使用 httpx POST `https://openrouter.ai/api/v1/chat/completions`
   - Body: `model=openai/gpt-oss-120b:free`, `messages=[system_prompt, ...history]`
   - System prompt 內容（Baby Lobster 角色設定 + 五大核心規則）
   - Header: `Authorization: Bearer {OPENROUTER_API_KEY}`

7. **`services/tts.py`** — Edge-TTS 文字轉語音
   - `synthesize(text: str) -> bytes`
   - 使用 **edge-tts Python API**（非 CLI），避免 shell 轉義 / 注入問題
   - 呼叫 `edge_tts.Communicate(text, voice="en-US-JennyNeural")`
   - 直接在記憶體中收集音檔 bytes，不寫入磁碟（使用 BytesIO）
   - 回傳 mp3 bytes

### Phase 3: Telegram Handler 與主程式

8. **`handlers.py`** — 訊息處理邏輯（depends on 4-7）
   - `handle_message(update, context)`:
     1. 判斷訊息類型（text vs voice）
     2. 若 voice → 下載 .ogg → 呼叫 `stt.transcribe()` 取得文字
     3. 將用戶文字加入 memory
     4. 組合 system prompt + history → 呼叫 `ai.chat()`
     5. 將 AI 回覆加入 memory
     6. 呼叫 `tts.synthesize()` 產生 mp3
     7. 同時發送**文字回覆 + 語音檔**給用戶
   - `handle_start(update, context)`:
     1. 發送 Baby Lobster 歡迎訊息

9. **`main.py`** — FastAPI + Telegram Bot 整合（depends on 8）
   - 建立 FastAPI app
   - 建立 `telegram.ext.Application`
   - 註冊 handlers（`/start`, text, voice）
   - POST `/webhook` endpoint → 接收 Telegram update → 傳遞給 bot
   - `on_startup` → 自動設定 Telegram webhook URL
   - uvicorn 啟動（Render 使用 `$PORT` 環境變數）

### Phase 4: 部署設定

10. **`Procfile`** — Render 啟動指令
    - `web: uvicorn main:app --host 0.0.0.0 --port $PORT`

11. **`render.yaml`** — Render Blueprint（optional）
    - 定義 Web Service、環境變數、Python runtime

12. **部署 → Bot 啟動時自動設定 webhook**

---

## 各檔案用途

| 檔案 | 用途 |
|---|---|
| `main.py` | FastAPI app、webhook endpoint、bot 初始化 |
| `config.py` | pydantic-settings，所有 env vars 集中管理 |
| `handlers.py` | `handle_message()` 核心邏輯（text/voice → STT → AI → TTS → Send） |
| `services/stt.py` | `transcribe()` — httpx multipart 呼叫 Groq |
| `services/ai.py` | `chat()` — httpx POST OpenRouter，含 system prompt |
| `services/tts.py` | `synthesize()` — edge_tts Python API 產生 mp3 bytes |
| `services/memory.py` | `ChatMemory` — deque-based per-chat 對話歷史 |

---

## 驗證計畫

1. **本地 polling 測試** — `main.py` 加入 `--polling` flag，本地跑 bot 測試：
   - 發送 "hi" → 確認收到 Baby Lobster 風格的英文歡迎 + 語音
   - 發送中文 → 確認 AI 回覆 "Do you mean...?" 格式
   - 發送語音 → 確認 STT 正確轉換並回覆
2. **API 連線測試** — 各 service 可獨立測試 Groq / OpenRouter / edge-tts 連線
3. **Render 部署測試** — 部署後用 Telegram 發訊息確認 webhook 正常
4. **記憶測試** — 連續對話 3-5 輪，確認 bot 記得上下文
5. **錯誤處理測試** — 空訊息、超長文字、無效語音，確認不崩潰

---

## 關鍵決策

| 決策 | 理由 |
|---|---|
| **edge-tts Python API（非 CLI）** | 避免 shell 注入風險和引號轉義問題，直接在記憶體處理 bytes，更安全高效 |
| **In-memory 對話記憶** | Render 重啟會清除，但學習 bot 可接受；未來可升級 Redis |
| **FastAPI + Webhook** | 比 polling 更適合 Render Web Service，自帶 HTTPS |
| **同時發送文字 + 語音** | 用戶可看可聽，學習效果更好 |
| **Scope：純 1:1 替換 n8n** | 不含用戶管理 / 資料庫 / 分析功能 |

---

## 注意事項

1. **Render Free Tier 冷啟動** — 閒置後休眠，首次喚醒約 30-60 秒。可用 UptimeRobot 定期 ping 保持喚醒，或升級付費方案。
2. **對話記憶持久化** — 目前 in-memory 方案重啟後記憶會消失。若需持久化可加 Redis（Render 原生支援）或 SQLite + persistent disk。
3. **OpenRouter 免費模型限制** — `openai/gpt-oss-120b:free` 有速率限制。若遇到限流，可在 `ai.py` 加入 fallback 備用模型。
