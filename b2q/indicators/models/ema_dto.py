from __future__ import annotations

from dataclasses import dataclass
from decimal import Decimal


@dataclass
class EmaDto:
    ema: Decimal
    open_time: str
    close_price: Decimal

    def to_dict(self) -> dict:
        return {
            "EMA": float(self.ema),
            "openTime": self.open_time,
            "closePrice": float(self.close_price),
        }
