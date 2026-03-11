# Supabase 對話記憶持久化計畫

## 背景

Baby Lobster Bot 目前的對話記憶完全存在 Python 記憶體中（`dict[int, deque]`）。  
Render 免費方案會在 **15 分鐘無活動後自動休眠**，每次休眠或部署都會丟失所有使用者的對話記錄。  
對英語學習機器人來說，「老師忘記學生學到哪了」體驗很差，因此需要持久化。

## 方案選擇

| 方案 | 免費額度 | 延遲 | 適合度 |
|------|---------|------|--------|
| **Supabase PostgreSQL** | 500MB, 50K MAU | ~50-100ms | ✅ 最適合 |
| Upstash Redis | 10K cmd/day | ~5ms | ⚠️ 免費額度太小 |
| SQLite + 磁碟 | Render 免費無持久磁碟 | - | ❌ 不可行 |

**選定 Supabase**：500MB 遠超需求（10 萬條訊息才 ~20MB）、Python SDK 成熟、無日請求限制。

## Supabase 設定

### 1. 建立專案

- 到 [supabase.com](https://supabase.com) 建立新專案（免費方案）

### 2. 建立資料表

在 Supabase Dashboard → **SQL Editor** 執行：

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

在 Supabase Dashboard → **Settings → API** 取得：
- **Project URL**（`SUPABASE_URL`）
- **service_role key**（`SUPABASE_KEY`）— 注意不是 anon key

## 程式碼修改計畫

### Step 1 — `.env` 新增環境變數

```
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_KEY=eyJhbGciOiJIUzI1NiIs...
```

### Step 2 — `config.py` 新增設定欄位

在 `Settings` class 新增：
- `SUPABASE_URL: str`
- `SUPABASE_KEY: str`

其餘設定不動。

### Step 3 — `requirements.txt` 新增依賴

新增 `supabase`（Python SDK，會自動帶入 `postgrest-py`、`httpx` 等依賴）。

### Step 4 — `services/memory.py` 核心重寫

保持 `ChatMemory` 介面不變（`add_message` / `get_history` / `clear`），內部改用 Supabase client：

- **初始化**：`from supabase import create_client`，建立 Supabase client
- **`add_message(chat_id, role, content)`**：
  1. INSERT 一筆到 `chat_messages`
  2. DELETE 該 chat_id 最舊的超額記錄（保持 ≤ `MAX_HISTORY * 2` 筆）
- **`get_history(chat_id)`**：
  1. SELECT `role, content` WHERE `chat_id = ?` ORDER BY `created_at ASC` LIMIT `MAX_HISTORY * 2`
  2. 回傳 `list[dict]`
- **`clear(chat_id)`**：DELETE WHERE `chat_id = ?`
- **錯誤處理**：若 Supabase 呼叫失敗，log error 並 fallback 回 in-memory（用原本的 deque 邏輯），確保 Bot 不會因 DB 問題而掛掉
- 模組層級仍然 export `chat_memory = ChatMemory()`

### Step 5 — `render.yaml` 新增環境變數

```yaml
- key: SUPABASE_URL
  sync: false
- key: SUPABASE_KEY
  sync: false
```

## 不需修改的檔案

- `handlers.py` — 介面不變（`chat_memory.add_message` / `.get_history` / `.clear`）
- `services/ai.py` — 只收 `list[dict]`，不關心來源
- `services/stt.py`、`services/tts.py` — 無關
- `main.py` — 無關

## 驗證步驟

1. 本地啟動 → 發訊息給 Bot → 檢查 Supabase Dashboard 確認資料有寫入
2. 重啟 app → 再發訊息 → 確認 Bot 記得之前的對話
3. 發送 `/reset` → 確認 Supabase 中該 chat_id 的記錄被清除
4. 發送 `/start` → 同上
5. 連續對話超過 20 筆（`MAX_HISTORY * 2`）→ 確認舊記錄被自動清理
6. 部署至 Render → 等 15 分鐘 spin down → 再對話 → 記憶仍在

## 注意事項

- **`supabase-py` 是同步 SDK**：每次操作 ~50-100ms，本專案流量極低，直接同步呼叫即可
- **延遲影響**：每次對話 +2 次 Supabase 呼叫（~100-200ms 總計），相比 AI + TTS 的數秒延遲可忽略
- **安全性**：`service_role` key 只存在伺服器端環境變數，不暴露給前端
