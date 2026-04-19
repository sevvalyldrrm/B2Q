import json
import asyncio
import websockets
from datetime import datetime, timezone


WS_BASE_URL = "wss://stream.binance.com:9443/ws"


def _format_candle(data: dict) -> dict:
    """Binance WS kline payload'ını standart formata çevirir."""
    k = data["k"]
    return {
        "openPrice":  float(k["o"]),
        "highPrice":  float(k["h"]),
        "lowPrice":   float(k["l"]),
        "closePrice": float(k["c"]),
        "volume":     float(k["v"]),
        "openTime":   _ms_to_iso(k["t"]),
        "closeTime":  _ms_to_iso(k["T"]),
        "isClosed":   k["x"],   # True ise mum kapandı (tamamlandı)
    }


def _ms_to_iso(ms: int) -> str:
    return (
        datetime.fromtimestamp(ms / 1000, tz=timezone.utc)
        .strftime("%Y-%m-%dT%H:%M:%S.%f")[:-3] + "Z"
    )


class BinanceWSProvider:

    async def stream_klines(self, symbol: str, interval: str, callback):
    
        stream = f"{symbol.lower()}@kline_{interval}"
        url = f"{WS_BASE_URL}/{stream}"

        print(f"[BinanceWS] Bağlanıyor: {url}")

        async for websocket in websockets.connect(url, ping_interval=20):
            try:
                async for message in websocket:
                    data = json.loads(message)
                    candle = _format_candle(data)
                    await callback(candle)
            except websockets.ConnectionClosed:
                print("[BinanceWS] Bağlantı kesildi, yeniden bağlanıyor...")
                continue
            except Exception as e:
                print(f"[BinanceWS] Hata: {e}")
                await asyncio.sleep(2)
                continue


# TEST 
if __name__ == "__main__":
    import asyncio
    from b2q.provider.redis_client import RedisClient

    SYMBOL   = "btcusdt"
    INTERVAL = "1m"
    LIMIT    = 100

    provider = BinanceWSProvider()
    redis    = RedisClient()
    count    = 0

    async def on_candle(candle: dict):
        global count
        count += 1
        status = "✅ KAPANDI" if candle["isClosed"] else "🔄 devam"
        print(
            f"#{count:>2} {status} | "
            f"sembol={SYMBOL.upper()} | "
            f"openTime={candle['openTime']} | "
            f"open={candle['openPrice']}  close={candle['closePrice']}  "
            f"high={candle['highPrice']}  low={candle['lowPrice']}  "
            f"vol={candle['volume']}"
        )

        # Redis'e yaz
        await redis.push_candle(SYMBOL, INTERVAL, candle)

        if count >= LIMIT:
            print(f"\n✅ {LIMIT} tick alındı. Bağlantı kapatılıyor.")
            await redis.close()
            raise SystemExit

    async def main():
        await redis.connect()
        try:
            await provider.stream_klines(SYMBOL, INTERVAL, on_candle)
        except SystemExit:
            pass

    asyncio.run(main())
