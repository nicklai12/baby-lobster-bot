# Plan: OpenRouter → Cerebras API 切換

> 將 AI Agent 從 OpenRouter (`openai/gpt-oss-120b:free`) 切換到 Cerebras (`gpt-oss-120b`)。

---

## Cerebras API 規格

- **Base URL：** `https://api.cerebras.ai/v1/chat/completions`
- **Auth Header：** `Authorization: Bearer {CEREBRAS_API_KEY}`
- **Model：** `gpt-oss-120b`
- **Request/Response 格式：** OpenAI 相容（與現有 `ai.py` 的 JSON 結構一致）
- **API Key 取得：** [cloud.cerebras.ai](https://cloud.cerebras.ai)

---

## Steps

1. **`config.py`** — 將 `OPENROUTER_API_KEY: str` 改為 `CEREBRAS_API_KEY: str`

2. **`services/ai.py`** — 修改三處：
   - URL: `https://openrouter.ai/api/v1/chat/completions` → `https://api.cerebras.ai/v1/chat/completions`
   - Header: `Bearer {settings.OPENROUTER_API_KEY}` → `Bearer {settings.CEREBRAS_API_KEY}`
   - 移除 OpenRouter 專用 header (`HTTP-Referer`, `X-Title`)
   - Model: `openai/gpt-oss-120b:free` → `gpt-oss-120b`

3. **`.env.example`** — `OPENROUTER_API_KEY=...` → `CEREBRAS_API_KEY=...`

4. **`.env`** — `OPENROUTER_API_KEY=...` → `CEREBRAS_API_KEY=your_cerebras_key`

5. **`render.yaml`** — env var key 從 `OPENROUTER_API_KEY` → `CEREBRAS_API_KEY`

6. **`README.md`** — 更新：
   - 架構圖中的 `OpenRouter AI Chat (openai/gpt-oss-120b:free)` → `Cerebras AI Chat (gpt-oss-120b)`
   - 專案結構 `ai.py` 描述
   - 環境變數表：`OPENROUTER_API_KEY` → `CEREBRAS_API_KEY`，來源改為 cloud.cerebras.ai
   - 自訂 SYSTEM_PROMPT 段落不變

7. **`docs/execution-plan.md`** — 同步更新所有 OpenRouter → Cerebras 的引用

---

## 影響範圍

| 檔案 | 改動 |
|---|---|
| `config.py` | 環境變數名 |
| `services/ai.py` | URL、Header、Model（核心改動） |
| `.env.example` | 環境變數名 |
| `.env` | 環境變數名 + 值 |
| `render.yaml` | 環境變數名 |
| `README.md` | 文件描述 |
| `docs/execution-plan.md` | 文件描述 |

## 不需要改動的部分

- `handlers.py` — 只呼叫 `chat()`，不直接碰 API
- `services/stt.py`、`services/tts.py`、`services/memory.py` — 不相關
- Request/Response JSON 結構 — Cerebras 是 OpenAI 相容，`messages` 和 `choices[0].message.content` 格式不變

---

## 驗證

1. 執行 `curl` 測試 Cerebras API Key 是否有效：
   ```bash
   curl https://api.cerebras.ai/v1/chat/completions \
     -H "Authorization: Bearer $CEREBRAS_API_KEY" \
     -H "Content-Type: application/json" \
     -d '{"model":"gpt-oss-120b","messages":[{"role":"user","content":"hello"}]}'
   ```
2. 啟動 bot，發送 "hi" 確認完整流程（STT 不變、AI → Cerebras、TTS 不變）
3. 確認 429 問題是否解決（Cerebras 的速率限制應與 OpenRouter 不同）
