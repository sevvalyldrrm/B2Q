from __future__ import annotations

from dataclasses import dataclass
from decimal import Decimal


@dataclass
class SmaDto:
    sma: Decimal
    open_time: str
    close_price: Decimal
