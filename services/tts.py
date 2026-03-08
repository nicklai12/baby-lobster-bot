import io

import edge_tts

from config import settings


async def synthesize(text: str) -> bytes:
    """Convert text to speech using edge-tts and return raw MP3 bytes."""
    communicate = edge_tts.Communicate(text, settings.TTS_VOICE)
    buffer = io.BytesIO()
    async for chunk in communicate.stream():
        if chunk["type"] == "audio":
            buffer.write(chunk["data"])
    return buffer.getvalue()
