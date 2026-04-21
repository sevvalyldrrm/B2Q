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
from b2q.quantum_engine.quantum_circuit import quantum_signal
from b2q.quantum_engine.decision_engine import decide


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

        # ── Quantum Circuit (qubit simülasyonu) ──────────────────
        circuit = quantum_signal(
            momentum_score   = momentum,
            volatility_score = volatility,
            trend_score      = trend,
        )

        # ── Decision Engine (klasik + qubit birleşik karar) ───────
        decision = decide(
            classic_signal = signal,
            circuit_signal = circuit["signal"],
            confidence     = circuit["confidence"],
            quantum_score  = quantum,
        )

        return {
            "symbol":           candles[-1].get("openTime", "")[:10],
            "candle_count":     len(candles),
            "latest_close":     closes[-1],
            "volatility_score": round(volatility, 2),
            "momentum_score":   round(momentum, 2),
            "trend_score":      round(trend, 2),
            "quantum_score":    quantum,
            "signal":           signal,
            "circuit":          circuit,
            "decision":         decision,
        }

    # ── Metrik hesaplamaları ──────────────────────────────────────

    def _volatility_score(self, closes, highs, lows) -> float:
        """
        Wilder'ın orijinal ATR'si (Smoothed Moving Average of TR).
        Yüksek ATR → yüksek skor.
        """
        period = 14
        trs = []
        for i in range(1, len(closes)):
            tr = max(
                highs[i] - lows[i],
                abs(highs[i] - closes[i - 1]),
                abs(lows[i]  - closes[i - 1]),
            )
            trs.append(tr)

        if len(trs) < period:
            atr = sum(trs) / len(trs)
        else:
            # Seed: ilk 14 TR'nin basit ortalaması
            atr = sum(trs[:period]) / period
            # Wilder'ın smoothed avg: ATR(i) = (ATR(i-1) × 13 + TR(i)) / 14
            for tr in trs[period:]:
                atr = (atr * (period - 1) + tr) / period

        atr_pct = (atr / closes[-1]) * 100  # ATR'yi yüzdeye çevir

        # 0-5% aralığını 0-100 skor'a normalize et
        score = min(atr_pct / 5.0 * 100, 100)
        return score

    def _momentum_score(self, closes) -> float:
        """
        Wilder'ın orijinal RSI'ı (Smoothed Moving Average of gains/losses).
        14 periyot.
        """
        period = 14
        gains, losses = [], []
        for i in range(1, len(closes)):
            diff = closes[i] - closes[i - 1]
            gains.append(max(diff, 0))
            losses.append(max(-diff, 0))

        if len(gains) < period:
            avg_gain = sum(gains) / len(gains)
            avg_loss = sum(losses) / len(losses)
        else:
            # Seed: ilk 14 periyodun basit ortalaması
            avg_gain = sum(gains[:period]) / period
            avg_loss = sum(losses[:period]) / period
            # Wilder'ın smoothed avg: avg(i) = (avg(i-1) × 13 + val(i)) / 14
            for g, l in zip(gains[period:], losses[period:]):
                avg_gain = (avg_gain * (period - 1) + g) / period
                avg_loss = (avg_loss * (period - 1) + l) / period

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
