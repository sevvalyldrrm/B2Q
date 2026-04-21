from __future__ import annotations

from dataclasses import dataclass
from decimal import Decimal


@dataclass
class RsiDto:
    rsi: Decimal
    open_time: str
    close_price: Decimal
    open_price: Decimal
    low_price: Decimal
    high_price: Decimal

    def to_dict(self) -> dict:
        return {
            "RSI": float(self.rsi),
            "openTime": self.open_time,
            "closePrice": float(self.close_price),
            "openPrice": float(self.open_price),
            "lowPrice": float(self.low_price),
            "highPrice": float(self.high_price),
        }
