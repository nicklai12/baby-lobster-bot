import logging
import os
from contextlib import asynccontextmanager

from fastapi import FastAPI, Request, Response
from telegram import Update
from telegram.ext import Application, CommandHandler, MessageHandler, filters

from config import settings
from handlers import handle_message, handle_reset, handle_start

logging.basicConfig(
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
    level=logging.INFO,
)
logger = logging.getLogger(__name__)

# Build the Telegram application once at module level
telegram_app = Application.builder().token(settings.TELEGRAM_BOT_TOKEN).build()


@asynccontextmanager
async def lifespan(app: FastAPI):
    # ── Register handlers ───────────────────────────────────────────────────
    telegram_app.add_handler(CommandHandler("start", handle_start))
    telegram_app.add_handler(CommandHandler("reset", handle_reset))
    telegram_app.add_handler(
        MessageHandler(filters.TEXT & ~filters.COMMAND, handle_message)
    )
    telegram_app.add_handler(MessageHandler(filters.VOICE, handle_message))

    # ── Start bot and set webhook ───────────────────────────────────────────
    await telegram_app.initialize()
    await telegram_app.start()

    webhook_url = f"{settings.WEBHOOK_URL}/webhook"
    await telegram_app.bot.set_webhook(
        url=webhook_url,
        allowed_updates=["message"],
    )
    logger.info("Webhook set to %s", webhook_url)

    yield

    # ── Graceful shutdown ───────────────────────────────────────────────────
    await telegram_app.stop()
    await telegram_app.shutdown()


app = FastAPI(lifespan=lifespan)


@app.post("/webhook")
async def webhook(request: Request) -> Response:
    """Receive updates from Telegram and hand them to the bot."""
    data = await request.json()
    update = Update.de_json(data, telegram_app.bot)
    await telegram_app.process_update(update)
    return Response(status_code=200)


@app.get("/health")
async def health():
    """Simple health-check endpoint (used by Render and UptimeRobot)."""
    return {"status": "ok", "bot": "Baby Lobster 🦞"}
