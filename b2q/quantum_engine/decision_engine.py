"""
Decision Engine
================
Klasik sinyal (ağırlıklı ortalama) ile Qubit sinyalini (dolanıklık)
birleştirip tek bir nihai karar üretir.

"""


# ── Karar Matrisi ────────────────────────────────────────────────

_MATRIX = {
    ("BUY",  "BUY"):  "STRONG_BUY",
    ("BUY",  "HOLD"): "BUY",
    ("BUY",  "SELL"): "HOLD",
    ("HOLD", "BUY"):  "HOLD",
    ("HOLD", "HOLD"): "HOLD",
    ("HOLD", "SELL"): "WEAK_SELL",
    ("SELL", "BUY"):  "HOLD",
    ("SELL", "HOLD"): "SELL",
    ("SELL", "SELL"): "STRONG_SELL",
}

_SCORE = {
    "STRONG_BUY":  2,
    "BUY":         1,
    "HOLD":        0,
    "WEAK_SELL":  -1,
    "SELL":       -1,
    "STRONG_SELL": -2,
}

# Kullanıcıya gösterilecek açıklama
_REASON = {
    "STRONG_BUY":  "Klasik ve qubit sinyalleri aynı anda güçlü → yüksek güvenli alış.",
    "BUY":         "Klasik sinyal alış yönünde, qubit nötr → alış eğilimi.",
    "HOLD":        "Sinyaller çelişiyor veya yetersiz güven → bekle.",
    "WEAK_SELL":   "Klasik nötr ama qubit zayıf → temkinli satış eğilimi.",
    "SELL":        "Klasik satış sinyali, qubit nötr → satış eğilimi.",
    "STRONG_SELL": "Klasik ve qubit sinyalleri aynı anda zayıf → yüksek güvenli satış.",
}


def decide(
    classic_signal: str,   # analyzer._signal() → "BUY" / "SELL" / "HOLD"
    circuit_signal: str,   # quantum_circuit.quantum_signal() → "BUY" / "SELL" / "HOLD"
    confidence: float,     # circuit.confidence (0-100)
    quantum_score: float,  # analyzer.quantum_score (0-100)
) -> dict:
    """
    İki sinyali birleştirip nihai karar üretir.

    Dönen dict:
      - final_decision : STRONG_BUY / BUY / HOLD / WEAK_SELL / SELL / STRONG_SELL
      - decision_score : -2 (güçlü satış) → +2 (güçlü alış)
      - reason         : insan okunabilir açıklama
      - agreement      : klasik ve qubit aynı fikirde mi?
    """
    key = (classic_signal, circuit_signal)
    final = _MATRIX.get(key, "HOLD")

    agreement = classic_signal == circuit_signal

    return {
        "final_decision": final,
        "decision_score": _SCORE[final],
        "reason":         _REASON[final],
        "agreement":      agreement,
        "classic_signal": classic_signal,
        "circuit_signal": circuit_signal,
        "confidence":     round(confidence, 2),
        "quantum_score":  round(quantum_score, 2),
    }
