import json
import time
import aio_pika

RABBITMQ_URL = "amqp://b2q:b2q123@localhost/"
EXCHANGE_NAME = "b2q_events"


class EventPublisher:
    def __init__(self):
        self._connection = None
        self._channel = None
        self._exchange = None

    async def connect(self):
        self._connection = await aio_pika.connect_robust(RABBITMQ_URL)
        self._channel = await self._connection.channel()
        self._exchange = await self._channel.declare_exchange(
            EXCHANGE_NAME, aio_pika.ExchangeType.FANOUT, durable=True
        )
        print("[EventBus] Publisher RabbitMQ'ya bağlandı.")

    async def publish(self, event_type: str, payload: dict):
        event = {
            "event_type": event_type,
            "timestamp":  time.time(),
            "data":       payload,
        }
        await self._exchange.publish(
            aio_pika.Message(
                body=json.dumps(event).encode(),
                content_type="application/json",
            ),
            routing_key="",
        )
        print(f"[EventBus] ▶ {event_type} → {payload}")

    async def close(self):
        if self._connection:
            await self._connection.close()

    # ── Hazır event yardımcıları ──────────────────────────────────

    async def candle_seeded(self, symbol: str, interval: str, count: int):
        """REST API seed tamamlandığında fırlatılır."""
        await self.publish("CANDLE_SEEDED", {
            "symbol":   symbol,
            "interval": interval,
            "count":    count,
        })

    async def new_candle(self, symbol: str, interval: str, candle: dict):
        """WebSocket'ten yeni kapanan mum geldiğinde fırlatılır."""
        await self.publish("NEW_CANDLE", {
            "symbol":   symbol,
            "interval": interval,
            "candle":   candle,
        })