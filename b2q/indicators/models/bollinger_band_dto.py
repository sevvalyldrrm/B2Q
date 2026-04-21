from __future__ import annotations

from dataclasses import dataclass
from decimal import Decimal


@dataclass
class BollingerBandDto:
    top_band_value: Decimal
    medium_band_value: Decimal
    bottom_band_value: Decimal
    open_time: str
    close_price: Decimal

    def to_dict(self) -> dict:
        return {
            "TopBandValue": float(self.top_band_value),
            "MediumBandValue": float(self.medium_band_value),
            "BottomBandValue": float(self.bottom_band_value),
            "openTime": self.open_time,
            "closePrice": float(self.close_price),
        }
