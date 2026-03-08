import httpx

from config import settings


async def transcribe(audio_bytes: bytes) -> str:
    """Send audio bytes to Groq Whisper and return the transcribed text."""
    async with httpx.AsyncClient() as client:
        response = await client.post(
            "https://api.groq.com/openai/v1/audio/transcriptions",
            headers={"Authorization": f"Bearer {settings.GROQ_API_KEY}"},
            files={"file": ("audio.ogg", audio_bytes, "audio/ogg")},
            data={"model": "whisper-large-v3"},
            timeout=60.0,
        )
        response.raise_for_status()
        return response.json()["text"]
