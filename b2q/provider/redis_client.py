
import json
import redis.asyncio as aioredis

REDIS_HOST = "localhost"
REDIS_PORT = 6379


class RedisClient:
    def __init__(self, host: str = REDIS_HOST, port: int = REDIS_PORT):
        self._host = host
        self._port = port
        self._client: aioredis.Redis | None = None

    async def connect(self):
        self._client = aioredis.Redis(
            host=self._host,
            port=self._port,
            decode_responses=True,
        )
        await self._client.ping()
        print(f"[Redis] Bağlandı → {self._host}:{self._port}")

    async def push_candle(self, symbol: str, interval: str, candle: dict):
        base_key = f"klines:{symbol}:{interval}"
        payload = json.dumps(candle)

        # 1. En son mumu tut
        await self._client.set(f"{base_key}:latest", payload)

        # 2. Kapanan mumları geçmişe ekle (son 500 mumu tut)
        if candle.get("isClosed"):
            await self._client.lpush(f"{base_key}:history", payload)
            await self._client.ltrim(f"{base_key}:history", 0, 499)

        # 3. Pub/Sub — diğer servisler bu kanalı dinleyebilir
        await self._client.publish(base_key, payload)

    async def close(self):
        if self._client:
            await self._client.aclose()
            print("[Redis] Bağlantı kapatıldı")

    async def get_latest(self, symbol: str, interval: str) -> dict | None:
        """En son (anlık) mumu döner."""
        key = f"klines:{symbol}:{interval}:latest"
        data = await self._client.get(key)
        return json.loads(data) if data else None

    async def get_history(self, symbol: str, interval: str, limit: int = 10) -> list:
        """Kapanan mumları döner (en yeni → en eski)."""
        key = f"klines:{symbol}:{interval}:history"
        items = await self._client.lrange(key, 0, limit - 1)
        return [json.loads(i) for i in items]

    async def clear(self, symbol: str, interval: str):
        """Bir sembol/interval için tüm Redis key'lerini temizler."""
        base_key = f"klines:{symbol}:{interval}"
        await self._client.delete(f"{base_key}:latest")
        await self._client.delete(f"{base_key}:history")
        print(f"[Redis] 🗑️  {base_key} temizlendi.")
