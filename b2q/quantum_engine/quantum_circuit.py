"""
Quantum Circuit (Simüle edilmiş)
=================================
Gerçek bir kuantum bilgisayar kullanmadan, qubit mekaniğini
klasik Python ile simüle eder.

"""

import math


# ─────────────────────────────────────────────
# 1. QUBIT ENCODING
# ─────────────────────────────────────────────

def encode(score: float) -> float:
   
    score = max(0.0, min(100.0, score))   # 0-100 arasına sıkıştır
    theta = (score / 100.0) * (math.pi / 2)
    return theta


# ─────────────────────────────────────────────
# 2. ÖLÇÜM (Measurement)
# ─────────────────────────────────────────────

def measure(theta: float) -> float:
    
    return math.sin(theta) ** 2


# ─────────────────────────────────────────────
# 3. DOLANIKLIK (Entanglement)
# ─────────────────────────────────────────────

def entangle(theta1: float, theta2: float) -> float:
   
    return measure(theta1) * measure(theta2)


def entangle_triple(theta1: float, theta2: float, theta3: float) -> float:
    """
    Üç qubitin (RSI, ATR, EMA) joint bullish olasılığı.
    P(q1=1, q2=1, q3=1) = sin²(θ1) × sin²(θ2) × sin²(θ3)
    """
    return measure(theta1) * measure(theta2) * measure(theta3)


# ─────────────────────────────────────────────
# 4. SİNYAL ÜRETİMİ
# ─────────────────────────────────────────────

def quantum_signal(
    momentum_score: float,    # RSI   → q1
    volatility_score: float,  # ATR   → q2
    trend_score: float,       # EMA   → q3
) -> dict:
   

    # 1. Encoding
    theta_rsi = encode(momentum_score)
    theta_atr = encode(volatility_score)
    theta_ema = encode(trend_score)

    # 2. Tek qubit olasılıkları
    p_rsi = measure(theta_rsi)
    p_atr = measure(theta_atr)
    p_ema = measure(theta_ema)

    # 3. Dolanık joint olasılık (üçü aynı anda bullish mi?)
    joint_prob = entangle_triple(theta_rsi, theta_atr, theta_ema)

    # 4. Güven skoru: joint_prob 0-1 → 0-100
    confidence = round(joint_prob * 100, 2)

    # 5. Sinyal kararı
    #    joint_prob > 0.40 → üçü birden güçlü → BUY
    #    joint_prob < 0.08 → en az biri çok zayıf → SELL
    if joint_prob >= 0.40:
        signal = "BUY"
    elif joint_prob <= 0.08:
        signal = "SELL"
    else:
        signal = "HOLD"

    return {
        "q1_rsi_prob":  round(p_rsi, 4),
        "q2_atr_prob":  round(p_atr, 4),
        "q3_ema_prob":  round(p_ema, 4),
        "joint_prob":   round(joint_prob, 4),
        "confidence":   confidence,
        "signal":       signal,
    }
