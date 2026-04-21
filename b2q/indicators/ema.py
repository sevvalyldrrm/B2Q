from __future__ import annotations

from decimal import Decimal, ROUND_HALF_UP

from .models import DataResult, EmaDto
from .sma import SmaIndicator


class EmaIndicator:
    def __init__(self, redis_client):
        self.redis = redis_client
        self.sma_indicator = SmaIndicator(redis_client)

    async def calculate_async(
        self,
        symbol: str,
        interval: str,
        length: int,
    ) -> DataResult[list[EmaDto]]:
        klines = await self.redis.get_history(symbol.lower(), interval, 500)
        ema_list: list[EmaDto] = []

        if len(klines) < length:
            return DataResult[list[EmaDto]].fail_length_required()

        ema = Decimal("0")
        sf = Decimal("2") / (Decimal("1") + Decimal(length))
        klines.reverse()
        ordered = list(klines)

        sma_result = await self.sma_indicator.calculate_async(symbol, interval, length)
        if not sma_result.is_successful:
            return DataResult[list[EmaDto]].fail(sma_result.errors, sma_result.status_code)

        close_price = self._to_decimal(ordered[0]["closePrice"])
        open_time = ordered[0]["openTime"]

        sma = sma_result.data[0]
        ema = ((self._to_decimal(ordered[0]["closePrice"]) - sma.sma) * sf) + sma.sma
        for i in range(1, length):
            ema = ((self._to_decimal(ordered[i]["closePrice"]) - ema) * sf) + ema

        ema = self._round4(ema)
        ema_list.append(EmaDto(close_price=close_price, ema=ema, open_time=open_time))

        for k in range(1, len(ordered)):
            multiple = Decimal("2") / (Decimal(length) + Decimal("1"))
            prev_ema = ema_list[k - 1]
            ema = (
                self._to_decimal(ordered[k]["closePrice"]) * multiple
            ) + (prev_ema.ema * (Decimal("1") - multiple))
            ema = self._round4(ema)
            close_price = self._to_decimal(ordered[k]["closePrice"])
            open_time = ordered[k]["openTime"]

            ema_list.append(EmaDto(close_price=close_price, ema=ema, open_time=open_time))

        klines.reverse()
        ema_list.reverse()
        return DataResult[list[EmaDto]].success(ema_list)

    @staticmethod
    def _to_decimal(value: float | int | str | Decimal) -> Decimal:
        return Decimal(str(value))

    @staticmethod
    def _round4(value: Decimal) -> Decimal:
        return value.quantize(Decimal("0.0001"), rounding=ROUND_HALF_UP)
