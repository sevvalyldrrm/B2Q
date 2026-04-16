from dotenv import load_dotenv
import os
import requests
import time
import hmac
import hashlib

# .env yükle
load_dotenv()

API_KEY = os.getenv("BINANCE_API_KEY")
SECRET_KEY = os.getenv("BINANCE_SECRET_KEY")

BASE_URL = "https://api.binance.com"


class BinanceProvider:

    def get_price(self, symbol: str):
        url = f"{BASE_URL}/api/v3/ticker/price"
        
        params = {
            "symbol": symbol
        }

        response = requests.get(url, params=params)

        if response.status_code != 200:
            raise Exception("Binance API error")

        return response.json()

    # ✅ EKLEDİĞİMİZ YENİ FONKSİYON
    def get_klines(self, symbol: str, interval: str, limit: int = 100):
        url = f"{BASE_URL}/api/v3/klines"

        params = {
            "symbol": symbol,
            "interval": interval,
            "limit": limit
        }

        response = requests.get(url, params=params)

        if response.status_code != 200:
            raise Exception("Binance API error")

        return response.json()


# ✅ TEST
if __name__ == "__main__":
    provider = BinanceProvider()

    data = provider.get_klines("BTCUSDT", "1m")

    print(data[0])  # ilk mum
    print(data[1])  # ikinci mum