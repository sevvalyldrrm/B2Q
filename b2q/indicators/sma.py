from __future__ import annotations

from decimal import Decimal, ROUND_HALF_UP

from .models import DataResult, SmaDto


class SmaIndicator:
    def __init__(self, redis_client):
        self.redis = redis_client

    async def calculate_async(
        self,
        symbol: str,
        interval: str,
        length: int,
    ) -> DataResult[list[SmaDto]]:
        klines = await self.redis.get_history(symbol.lower(), interval, 500)
        if len(klines) < length:
            return DataResult[list[SmaDto]].fail_length_required()

        ordered = list(reversed(klines))
        closes = [self._to_decimal(c["closePrice"]) for c in ordered[:length]]
        sma = self._round4(sum(closes) / Decimal(length))

        sma_dto = SmaDto(
            sma=sma,
            open_time=ordered[0]["openTime"],
            close_price=self._to_decimal(ordered[0]["closePrice"]),
        )
        return DataResult[list[SmaDto]].success([sma_dto])

    @staticmethod
    def _to_decimal(value: float | int | str | Decimal) -> Decimal:
        return Decimal(str(value))

    @staticmethod
    def _round4(value: Decimal) -> Decimal:
        return value.quantize(Decimal("0.0001"), rounding=ROUND_HALF_UP)
