import json
import asyncio
import aio_pika

RABBITMQ_URL  = "amqp://b2q:b2q123@localhost/"
EXCHANGE_NAME = "b2q_events"


class EventSubscriber:
    def __init__(self, queue_name: str = ""):
        self._queue_name = queue_name  # "" = exclusive/anonim kuyruk
        self._connection = None

    async def connect(self):
        self._connection = await aio_pika.connect_robust(RABBITMQ_URL)
        print("[EventBus] Subscriber RabbitMQ'ya bağlandı.")

    async def listen(self, callback):
        """
        b2q_events exchange'ini dinler.
        Her event geldiğinde async callback(event) çağırır.
        """
        channel  = await self._connection.channel()
        exchange = await channel.declare_exchange(
            EXCHANGE_NAME, aio_pika.ExchangeType.FANOUT, durable=True
        )
        queue = await channel.declare_queue(self._queue_name, exclusive=True)
        await queue.bind(exchange)
        print(f"[EventBus] '{EXCHANGE_NAME}' exchange dinleniyor...")

        async with queue.iterator() as it:
            async for message in it:
                async with message.process():
                    try:
                        event = json.loads(message.body.decode())
                        await callback(event)
                    except Exception as e:
                        print(f"[EventBus] Hata: {e}")

    async def close(self):
        if self._connection:
            await self._connection.close()


# ── TEST ──────────────────────────────────────────────────────────
if __name__ == "__main__":

    async def on_event(event: dict):
        etype = event.get("event_type")
        data  = event.get("data", {})

        if etype == "CANDLE_SEEDED":
            print(f"\n[Handler] CANDLE_SEEDED -> {data['symbol']} {data['interval']} | {data['count']} mum yuklendi")
        elif etype == "NEW_CANDLE":
            c = data["candle"]
            print(f"\n[Handler] NEW_CANDLE -> {data['symbol']} {data['interval']} | close={c['closePrice']} | {c['openTime']}")
        else:
            print(f"\n[Handler] {etype} -> {data}")

    async def main():
        sub = EventSubscriber()
        await sub.connect()
        await sub.listen(on_event)

    asyncio.run(main())
