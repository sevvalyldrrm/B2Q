from dotenv import load_dotenv
import os
import requests
from datetime import datetime, timezone

# .env yükle
load_dotenv()

API_KEY = os.getenv("BINANCE_API_KEY")
SECRET_KEY = os.getenv("BINANCE_SECRET_KEY")

BASE_URL = "https://api.binance.com"


def _ms_to_iso(ms: int) -> str:
    return (
        datetime.fromtimestamp(ms / 1000, tz=timezone.utc)
        .strftime("%Y-%m-%dT%H:%M:%S.%f")[:-3] + "Z"
    )


class BinanceProvider:

    def get_price(self, symbol: str):
        url = f"{BASE_URL}/api/v3/ticker/price"
        response = requests.get(url, params={"symbol": symbol})
        if response.status_code != 200:
            raise Exception("Binance API error")
        return response.json()

    def get_klines(self, symbol: str, interval: str, limit: int = 500) -> list:
        """
        REST API'den geçmiş kapanmış mumları çeker ve formatlar.
        Binance max 1000 döner.
        """
        url = f"{BASE_URL}/api/v3/klines"
        response = requests.get(url, params={
            "symbol": symbol.upper(),
            "interval": interval,
            "limit": limit,
        })
        if response.status_code != 200:
            raise Exception(f"Binance klines error: {response.text}")

        candles = []
        for k in response.json():
            candles.append({
                "openPrice":  float(k[1]),
                "highPrice":  float(k[2]),
                "lowPrice":   float(k[3]),
                "closePrice": float(k[4]),
                "volume":     float(k[5]),
                "openTime":   _ms_to_iso(k[0]),
                "closeTime":  _ms_to_iso(k[6]),
                "isClosed":   True,   # REST'ten gelen mumlar hep kapanmış
            })
        return candles

    async def seed_redis(self, redis, symbol: str, interval: str, limit: int = 500):
        """
        Redis'i geçmiş mumlarla doldurur.
        Uygulama başlarken bir kez çağrılır.
        Önce mevcut veriyi temizler, sonra REST'ten çekip yazar.
        """
        print(f"[Seed] {symbol} {interval} → {limit} geçmiş mum yükleniyor...")

        # Önce temizle (restart'ta üstüne yazmasın)
        await redis.clear(symbol.lower(), interval)

        candles = self.get_klines(symbol, interval, limit)

        # En eskiden en yeniye → Redis listesi en yeni başta olacak şekilde
        for candle in reversed(candles):
            await redis.push_candle(symbol.lower(), interval, candle)

        print(f"[Seed] ✅ {len(candles)} mum Redis'e yazıldı.")
        return len(candles)