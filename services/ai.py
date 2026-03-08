import asyncio
import logging

import httpx

from config import settings

logger = logging.getLogger(__name__)

MAX_RETRIES = 3


async def chat(messages: list[dict]) -> str:
    """Send the conversation history to Cerebras and return the AI reply.

    Retries up to MAX_RETRIES times with exponential backoff on 429 responses.
    """
    async with httpx.AsyncClient() as client:
        for attempt in range(MAX_RETRIES):
            response = await client.post(
                "https://api.cerebras.ai/v1/chat/completions",
                headers={
                    "Authorization": f"Bearer {settings.CEREBRAS_API_KEY}",
                    "Content-Type": "application/json",
                },
                json={
                    "model": "gpt-oss-120b",
                    "messages": [{"role": "system", "content": settings.SYSTEM_PROMPT}] + messages,
                },
                timeout=60.0,
            )
            if response.status_code == 429 and attempt < MAX_RETRIES - 1:
                wait = 2 ** (attempt + 1)  # 2s, 4s, 8s
                logger.warning("Cerebras 429 rate-limited, retrying in %ds (attempt %d/%d)", wait, attempt + 1, MAX_RETRIES)
                await asyncio.sleep(wait)
                continue
            response.raise_for_status()
            return response.json()["choices"][0]["message"]["content"]
