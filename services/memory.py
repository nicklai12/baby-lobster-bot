import logging
from collections import deque

from config import settings

logger = logging.getLogger(__name__)

_MAX = settings.MAX_HISTORY * 2

# Initialise Supabase client when credentials are present
_supabase = None
_USE_SUPABASE = False

if settings.SUPABASE_URL and settings.SUPABASE_KEY:
    try:
        from supabase import create_client
        _supabase = create_client(settings.SUPABASE_URL, settings.SUPABASE_KEY)
        _USE_SUPABASE = True
        logger.info("Supabase memory backend initialised")
    except Exception as exc:
        logger.warning("Supabase init failed, falling back to in-memory: %s", exc)


class ChatMemory:
    """Per-chat conversation history backed by Supabase with in-memory fallback."""

    def __init__(self) -> None:
        self._store: dict[int, deque[dict]] = {}

    def _get_deque(self, chat_id: int) -> deque[dict]:
        if chat_id not in self._store:
            self._store[chat_id] = deque(maxlen=_MAX)
        return self._store[chat_id]

    def add_message(self, chat_id: int, role: str, content: str) -> None:
        if _USE_SUPABASE:
            try:
                _supabase.table("chat_messages").insert(
                    {"chat_id": chat_id, "role": role, "content": content}
                ).execute()
                # Prune oldest rows if we now exceed _MAX for this chat
                rows = (
                    _supabase.table("chat_messages")
                    .select("id")
                    .eq("chat_id", chat_id)
                    .order("created_at", desc=False)
                    .execute()
                )
                if len(rows.data) > _MAX:
                    excess = len(rows.data) - _MAX
                    ids_to_delete = [r["id"] for r in rows.data[:excess]]
                    _supabase.table("chat_messages").delete().in_("id", ids_to_delete).execute()
                return
            except Exception as exc:
                logger.error("Supabase add_message failed, falling back to in-memory: %s", exc)
        self._get_deque(chat_id).append({"role": role, "content": content})

    def get_history(self, chat_id: int) -> list[dict]:
        if _USE_SUPABASE:
            try:
                result = (
                    _supabase.table("chat_messages")
                    .select("role, content")
                    .eq("chat_id", chat_id)
                    .order("created_at", desc=False)
                    .limit(_MAX)
                    .execute()
                )
                return [{"role": r["role"], "content": r["content"]} for r in result.data]
            except Exception as exc:
                logger.error("Supabase get_history failed, falling back to in-memory: %s", exc)
        return list(self._get_deque(chat_id))

    def clear(self, chat_id: int) -> None:
        if _USE_SUPABASE:
            try:
                _supabase.table("chat_messages").delete().eq("chat_id", chat_id).execute()
                self._store.pop(chat_id, None)
                return
            except Exception as exc:
                logger.error("Supabase clear failed, falling back to in-memory: %s", exc)
        self._store.pop(chat_id, None)


chat_memory = ChatMemory()
