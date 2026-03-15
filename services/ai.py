import asyncio
import logging

import httpx

from config import settings

logger = logging.getLogger(__name__)

MAX_RETRIES = 3

_SYSTEM_MESSAGES = lambda: [{"role": "system", "content": settings.SYSTEM_PROMPT}]


async def _call_cerebras(client: httpx.AsyncClient, messages: list[dict]) -> str:
    """Call Cerebras API with exponential backoff on 429. Raises on failure."""
    for attempt in range(MAX_RETRIES):
        response = await client.post(
            "https://api.cerebras.ai/v1/chat/completions",
            headers={
                "Authorization": f"Bearer {settings.CEREBRAS_API_KEY}",
                "Content-Type": "application/json",
            },
            json={
                "model": settings.CEREBRAS_MODEL,
                "messages": _SYSTEM_MESSAGES() + messages,
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


async def _call_groq(client: httpx.AsyncClient, messages: list[dict]) -> str:
    """Call Groq Chat API (single attempt). Raises on failure."""
    response = await client.post(
        "https://api.groq.com/openai/v1/chat/completions",
        headers={
            "Authorization": f"Bearer {settings.GROQ_API_KEY}",
            "Content-Type": "application/json",
        },
        json={
            "model": settings.GROQ_MODEL,
            "messages": _SYSTEM_MESSAGES() + messages,
        },
        timeout=60.0,
    )
    response.raise_for_status()
    return response.json()["choices"][0]["message"]["content"]


async def chat(messages: list[dict]) -> str:
    """Send the conversation history to the configured AI provider and return the reply.

    Primary provider is determined by AI_PROVIDER ("cerebras" or "groq").
    If the primary provider fails after all retries, automatically falls back to
    the other provider (single attempt) to preserve user experience.
    """
    async with httpx.AsyncClient() as client:
        primary = settings.AI_PROVIDER.lower()
        if primary == "groq":
            primary_fn = _call_groq
            fallback_fn = _call_cerebras
            fallback_name = "Cerebras"
        else:
            primary_fn = _call_cerebras
            fallback_fn = _call_groq
            fallback_name = "Groq"

        try:
            return await primary_fn(client, messages)
        except Exception as primary_err:
            logger.warning(
                "%s provider failed (%s), falling back to %s",
                primary.capitalize(), primary_err, fallback_name,
            )
            return await fallback_fn(client, messages)
