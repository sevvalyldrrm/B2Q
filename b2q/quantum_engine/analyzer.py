"""
Quantum Analyzer
Redis'ten mum verisi çeker, kuantum-ilhamlı skorlar üretir.

Hesaplanan metrikler:
  - volatility_score   : fiyat dalgalanma şiddeti (0-100)
  - momentum_score     : son mumların yönsel ivmesi (0-100)
  - trend_score        : genel trend gücü (0-100)
  - quantum_score      : üçünün ağırlıklı ortalaması (0-100)
  - signal             : BUY / SELL / HOLD
"""

import math


class QuantumAnalyzer:

    def analyze(self, candles: list) -> dict:
        """
        candles: Redis'ten gelen mum listesi (en yeni → en eski)
        En az 10 mum gerekir.
        """
        if len(candles) < 10:
            raise ValueError("Yeterli mum yok (min 10)")

        # En yeniden en eskiye → hesaplamalar için ters çevir
        candles = list(reversed(candles))

        closes  = [c["closePrice"] for c in candles]
        highs   = [c["highPrice"]  for c in candles]
        lows    = [c["lowPrice"]   for c in candles]
        volumes = [c["volume"]     for c in candles]

        volatility = self._volatility_score(closes, highs, lows)
        momentum   = self._momentum_score(closes)
        trend      = self._trend_score(closes)

        quantum = round(
            volatility * 0.30 +
            momentum   * 0.40 +
            trend      * 0.30,
            2
        )

        signal = self._signal(quantum, momentum, trend)

        return {
            "symbol":           candles[-1].get("openTime", "")[:10],
            "candle_count":     len(candles),
            "latest_close":     closes[-1],
            "volatility_score": round(volatility, 2),
            "momentum_score":   round(momentum, 2),
            "trend_score":      round(trend, 2),
            "quantum_score":    quantum,
            "signal":           signal,
        }

    # ── Metrik hesaplamaları ──────────────────────────────────────

    def _volatility_score(self, closes, highs, lows) -> float:
        """
        ATR (Average True Range) tabanlı volatilite.
        Yüksek ATR → yüksek skor.
        """
        trs = []
        for i in range(1, len(closes)):
            tr = max(
                highs[i] - lows[i],
                abs(highs[i] - closes[i - 1]),
                abs(lows[i]  - closes[i - 1]),
            )
            trs.append(tr)

        atr = sum(trs[-14:]) / 14 if len(trs) >= 14 else sum(trs) / len(trs)
        atr_pct = (atr / closes[-1]) * 100  # ATR'yi yüzdeye çevir

        # 0-5% aralığını 0-100 skor'a normalize et
        score = min(atr_pct / 5.0 * 100, 100)
        return score

    def _momentum_score(self, closes) -> float:
        """
        RSI tabanlı momentum (14 periyot).
        """
        gains, losses = [], []
        for i in range(1, len(closes)):
            diff = closes[i] - closes[i - 1]
            if diff > 0:
                gains.append(diff)
                losses.append(0)
            else:
                gains.append(0)
                losses.append(abs(diff))

        period = 14
        avg_gain = sum(gains[-period:]) / period
        avg_loss = sum(losses[-period:]) / period

        if avg_loss == 0:
            return 100.0

        rs = avg_gain / avg_loss
        rsi = 100 - (100 / (1 + rs))
        return round(rsi, 2)

    def _trend_score(self, closes) -> float:
        """
        EMA20 / EMA50 çapraz oranı ile trend gücü.
        EMA20 > EMA50 → yüksek skor (yükseliş trendi)
        """
        ema20 = self._ema(closes, 20)
        ema50 = self._ema(closes, 50)

        if ema50 == 0:
            return 50.0

        ratio = ema20 / ema50
        # ratio 0.98-1.02 arası → 0-100 normalize
        score = (ratio - 0.98) / 0.04 * 100
        return max(0.0, min(100.0, score))

    def _ema(self, closes: list, period: int) -> float:
        if len(closes) < period:
            return sum(closes) / len(closes)
        k = 2 / (period + 1)
        ema = sum(closes[:period]) / period
        for price in closes[period:]:
            ema = price * k + ema * (1 - k)
        return ema

    def _signal(self, quantum: float, momentum: float, trend: float) -> str:
        if quantum >= 65 and momentum >= 60 and trend >= 55:
            return "BUY"
        elif quantum <= 35 or momentum <= 30 or trend <= 25:
            return "SELL"
        else:
            return "HOLD"
