import httpx

from config import settings


async def chat(messages: list[dict]) -> str:
    """Send the conversation history to Cerebras and return the AI reply."""
    async with httpx.AsyncClient() as client:
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
        response.raise_for_status()
        return response.json()["choices"][0]["message"]["content"]
