import io
import logging

from telegram import Update
from telegram.ext import ContextTypes

from services.ai import chat
from services.memory import chat_memory
from services.stt import transcribe
from services.tts import synthesize

logger = logging.getLogger(__name__)


async def handle_start(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """Handle /start — clear memory and send a welcome message."""
    chat_memory.clear(update.effective_chat.id)
    await update.message.reply_text(
        "Hi hi hi! 🦞 I'm Baby Lobster! I'm SO happy you're here!\n\n"
        "I'm learning English and I need YOUR help! "
        "Can you teach me something new today? "
        "Just talk to me — in English or even a little bit of English. "
        "I won't judge, I promise! 🥰\n\n"
        "What is one English word YOU learned today? 🎉"
    )


async def handle_reset(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """Handle /reset — wipe conversation memory for this chat."""
    chat_memory.clear(update.effective_chat.id)
    await update.message.reply_text(
        "Okay! Fresh start! 🦞 My memory is all clean now. "
        "Let's learn something new together! What shall we talk about? 😊"
    )


async def handle_message(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """Handle incoming text or voice messages."""
    message = update.message
    if not message:
        return

    chat_id = message.chat_id
    user_text: str | None = None

    # ── Step 1: decode input ────────────────────────────────────────────────
    try:
        if message.voice:
            await message.reply_text("🎧 Let me listen to that...")
            voice_file = await message.voice.get_file()
            voice_bytes = bytes(await voice_file.download_as_bytearray())
            user_text = await transcribe(voice_bytes)
        elif message.text:
            user_text = message.text.strip()
    except Exception as exc:
        logger.error("Input processing error for chat %s: %s", chat_id, exc)
        await message.reply_text(
            "Oh no! 😢 I had a little trouble understanding that. Can you try again?"
        )
        return

    if not user_text:
        return

    # ── Step 2: get AI reply ────────────────────────────────────────────────
    chat_memory.add_message(chat_id, "user", user_text)
    history = chat_memory.get_history(chat_id)

    try:
        ai_reply = await chat(history)
    except Exception as exc:
        logger.error("AI error for chat %s: %s", chat_id, exc)
        chat_memory.clear(chat_id)
        await message.reply_text(
            "Oops! 🦞 My brain got a little confused. Please try again in a moment!"
        )
        return

    chat_memory.add_message(chat_id, "assistant", ai_reply)

    # ── Step 3: synthesise speech and reply ────────────────────────────────
    try:
        audio_bytes = await synthesize(ai_reply)
        await message.reply_text(ai_reply)
        await message.reply_audio(
            audio=io.BytesIO(audio_bytes),
            filename="baby_lobster.mp3",
            title="Baby Lobster",
            performer="Baby Lobster 🦞",
        )
    except Exception as exc:
        logger.error("TTS/send error for chat %s: %s", chat_id, exc)
        # Fall back to text-only if TTS fails
        await message.reply_text(ai_reply)
