from collections import deque

from config import settings


class ChatMemory:
    """Per-chat conversation history using a deque with a fixed max size."""

    def __init__(self) -> None:
        # Each chat stores at most MAX_HISTORY * 2 messages (user + assistant pairs)
        self._store: dict[int, deque[dict]] = {}

    def _get_deque(self, chat_id: int) -> deque[dict]:
        if chat_id not in self._store:
            self._store[chat_id] = deque(maxlen=settings.MAX_HISTORY * 2)
        return self._store[chat_id]

    def add_message(self, chat_id: int, role: str, content: str) -> None:
        self._get_deque(chat_id).append({"role": role, "content": content})

    def get_history(self, chat_id: int) -> list[dict]:
        return list(self._get_deque(chat_id))

    def clear(self, chat_id: int) -> None:
        self._store.pop(chat_id, None)


chat_memory = ChatMemory()
