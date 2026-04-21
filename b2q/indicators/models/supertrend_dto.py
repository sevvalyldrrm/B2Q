from __future__ import annotations

from dataclasses import dataclass
from decimal import Decimal


@dataclass
class SupertrendDto:
    supertrend_lower_band: Decimal
    supertrend_upper_band: Decimal
    open_time: str
    close_time: str
    close_price: Decimal
    open_price: Decimal
    high_price: Decimal
    low_price: Decimal
    supertrend: Decimal
    trend_tag: str

    def to_dict(self) -> dict:
        return {
            "SuperTrendLowerBand": float(self.supertrend_lower_band),
            "SuperTrendUpperBand": float(self.supertrend_upper_band),
            "openTime": self.open_time,
            "closeTime": self.close_time,
            "closePrice": float(self.close_price),
            "openPrice": float(self.open_price),
            "highPrice": float(self.high_price),
            "lowPrice": float(self.low_price),
            "SuperTrend": float(self.supertrend),
            "TrendTag": self.trend_tag,
        }
