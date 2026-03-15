# Plan: AI 模型可配置 + Groq 降級備援

## TL;DR
將 Cerebras 和 Groq 的對話模型名稱抽為環境變數，讓用戶可自行切換模型；當 Cerebras API 重試 3 次仍失敗時，自動降級至 Groq Chat API 作為備援，避免用戶無回應的糟糕體驗。

## Steps

### Phase 1: 新增環境變數配置

1. **config.py** — 新增 3 個設定項：
   - `CEREBRAS_MODEL: str = "llama-4-scout-17b-16e-instruct"` — Cerebras 對話模型（預設為 Cerebras 目前支援的模型）
   - `GROQ_MODEL: str = "llama-3.3-70b-versatile"` — Groq 對話備援模型
   - `AI_PROVIDER: str = "cerebras"` — 主要 AI 提供者（可選值：`cerebras` / `groq`），讓用戶也能直接選擇只用 Groq

2. **更新 .env.example** — 加入新變數的範例說明

### Phase 2: 重構 AI 服務加入 Groq 降級

3. **services/ai.py** — 重構 `chat()` 函數：
   - 提取 `_call_cerebras(messages)` 內部函數：現有 Cerebras 邏輯，模型名從 `settings.CEREBRAS_MODEL` 讀取
   - 新增 `_call_groq(messages)` 內部函數：
     - 端點：`https://api.groq.com/openai/v1/chat/completions`
     - Header：`Authorization: Bearer {settings.GROQ_API_KEY}`（複用現有 key）
     - 模型：`settings.GROQ_MODEL`
     - 同樣注入 system prompt，格式與 Cerebras 一致（兩者都是 OpenAI 相容格式）
   - 修改 `chat()` 主邏輯：
     - 根據 `settings.AI_PROVIDER` 決定主要呼叫哪個 provider
     - 主 provider 失敗（重試 3 次後）→ log warning → 自動降級呼叫備援 provider
     - 備援 provider 也失敗 → raise 原始錯誤（交由 handlers.py 現有錯誤處理）

4. **錯誤降級邏輯**（在 `chat()` 內）：
   - Cerebras 重試 3 次仍收到 429/4xx/5xx → 捕獲異常 → log `"Cerebras failed after retries, falling back to Groq"`
   - 呼叫 `_call_groq(messages)`（單次嘗試，timeout 60s）
   - Groq 成功 → 回傳結果（用戶無感）
   - Groq 也失敗 → raise，觸發 handlers.py 的 "Oops!" 錯誤訊息

### Phase 3: 更新文件

5. **README.md** — 更新環境變數說明表格，加入新增的 3 個變數

## Relevant Files

| 檔案 | 修改內容 |
|---|---|
| `config.py` | `Settings` class 新增 `CEREBRAS_MODEL`、`GROQ_MODEL`、`AI_PROVIDER` |
| `services/ai.py` | 拆分 `_call_cerebras()` / `_call_groq()`，加入降級邏輯 |
| `README.md` | 更新環境變數文件 |
| `.env.example` | 加入新變數範例 |

## Verification

1. 設定正確 `CEREBRAS_MODEL` → 正常回應 ✓
2. 設定 `CEREBRAS_MODEL=invalid-model` → Cerebras 失敗後自動降級 Groq，用戶正常收到回覆 ✓
3. 設定 `AI_PROVIDER=groq` → 直接走 Groq API ✓
4. 兩個 provider 都故障 → 用戶收到 "Oops!" 錯誤訊息（現有行為不變）✓
5. 降級時 log 有 WARNING 記錄 ✓

## Decisions

- **複用 `GROQ_API_KEY`**：Groq 的 STT 和 Chat 共用同一把 API key，不需新增
- **Groq 備援不做多次重試**：降級已經是「最後手段」，單次嘗試即可，避免用戶等太久
- **預設模型選擇**：Cerebras 預設 `qwen-3-235b-a22b-instruct-2507`（目前官方支援），Groq 預設 `llama-3.3-70b-versatile`（穩定且能力強）
- **範圍限定**：僅修改 AI 對話相關邏輯，不動 STT/TTS/Memory 等服務

## Further Considerations

1. **是否需要 Groq 備援也做重試？** 建議不用 — 降級本身已是容錯，單次嘗試 + 60s timeout 足夠。若也要重試可加但會增加用戶等待時間。
2. **是否需要記錄使用了哪個 provider 到回覆中？** 例如降級時在 log 中標註，方便排查。建議只記 log 不影響用戶體驗。
