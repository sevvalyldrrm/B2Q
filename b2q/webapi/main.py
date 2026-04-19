import asyncio
import json
from fastapi import FastAPI, Query, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from b2q.provider.binance_ws_provider import BinanceWSProvider
from b2q.provider.binance_provider import BinanceProvider
from b2q.provider.redis_client import RedisClient
from b2q.event_bus.publisher import EventPublisher
from b2q.quantum_engine.analyzer import QuantumAnalyzer

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

ws_provider   = BinanceWSProvider()
rest_provider = BinanceProvider()
redis         = RedisClient()
publisher     = EventPublisher()
analyzer      = QuantumAnalyzer()


@app.on_event("startup")
async def startup():
    await redis.connect()
    await publisher.connect()

    # Geçmiş 500 mumu Redis'e yükle
    count = await rest_provider.seed_redis(redis, "btcusdt", "1h", limit=500)

    # Seed tamamlandı → event at
    await publisher.candle_seeded("btcusdt", "1h", count)


@app.get("/")
def root():
    return {"message": "B2Q çalışıyor 🚀"}


# ── Redis okuma endpointleri ──────────────────────────────────────

@app.get("/redis/latest")
async def get_latest(
    symbol: str = Query(default="btcusdt"),
    interval: str = Query(default="1m"),
):
    """Redis'teki en son (anlık) mumu döner."""
    data = await redis.get_latest(symbol, interval)
    if not data:
        return {"error": "Veri bulunamadı. Önce stream çalıştır."}
    return data


@app.get("/redis/history")
async def get_history(
    symbol: str = Query(default="btcusdt"),
    interval: str = Query(default="1m"),
    limit: int = Query(default=10, ge=1, le=500),
):
    """Redis'teki kapanan mumları döner (en yeni → en eski)."""
    data = await redis.get_history(symbol, interval, limit)
    return {"symbol": symbol, "interval": interval, "count": len(data), "candles": data}


# ── Quantum endpoint ──────────────────────────────────────────────

@app.get("/quantum/analyze")
async def quantum_analyze(
    symbol:   str = Query(default="btcusdt"),
    interval: str = Query(default="1h"),
    limit:    int = Query(default=100, ge=10, le=500),
):
    """
    Redis'teki mum verisini çekip quantum skor hesaplar.
    Postman: GET http://localhost:8000/quantum/analyze?symbol=btcusdt&interval=1h&limit=100
    """
    candles = await redis.get_history(symbol, interval, limit)

    if len(candles) < 10:
        return {"error": f"Yeterli veri yok. Redis'te {len(candles)} mum var. Önce sunucuyu başlat."}

    result = analyzer.analyze(candles)
    result["symbol"]   = symbol.upper()
    result["interval"] = interval

    # Event at
    await publisher.publish("QUANTUM_ANALYZED", result)

    return result


@app.websocket("/ws/klines")
async def ws_klines(
    websocket: WebSocket,
    symbol: str = Query(default="btcusdt"),
    interval: str = Query(default="1h"),
):
    """
    Gerçek zamanlı mum verisi WebSocket endpoint.
    Bağlantı: ws://localhost:8000/ws/klines?symbol=btcusdt&interval=1h
    """
    await websocket.accept()
    print(f"[FastAPI WS] Client bağlandı: {symbol} / {interval}")

    async def send_candle(candle: dict):
        try:
            await websocket.send_text(json.dumps(candle))
        except Exception:
            raise

    stream_task = asyncio.create_task(
        ws_provider.stream_klines(symbol, interval, send_candle)
    )

    try:
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        print(f"[FastAPI WS] Client ayrıldı: {symbol} / {interval}")
    finally:
        stream_task.cancel()