from __future__ import annotations

from decimal import Decimal, ROUND_HALF_UP

from .models import AtrDto, DataResult


class AtrIndicator:
    def __init__(self, redis_client):
        self.redis = redis_client

    async def calculate_async(
        self,
        symbol: str,
        interval: str,
        length: int = 14,
    ) -> DataResult[list[AtrDto]]:
        klines = await self.redis.get_history(symbol.lower(), interval, 500)
        atr_length = length

        if len(klines) == 0 or atr_length <= 0 or len(klines) < atr_length:
            return DataResult[list[AtrDto]].fail_length_required()

        atr_list: list[AtrDto] = []

        indis = 0
        while indis < (atr_length - 1):
            item1 = klines[indis]
            atr_list.append(
                AtrDto(
                    open_time=item1["openTime"],
                    close_price=self._to_decimal(item1["closePrice"]),
                    atr=Decimal("0"),
                )
            )
            indis += 1

        prev_item = klines[atr_length - 2]
        item = klines[atr_length - 1]

        tr1 = self._to_decimal(item["highPrice"]) - self._to_decimal(item["lowPrice"])
        tr2 = abs(self._to_decimal(item["highPrice"]) - self._to_decimal(prev_item["closePrice"]))
        tr3 = abs(self._to_decimal(item["lowPrice"]) - self._to_decimal(prev_item["closePrice"]))
        true_range = max(max(tr1, tr2), tr3)
        atr = true_range / Decimal(atr_length)
        atr = self._round6(atr)

        atr_list.append(
            AtrDto(
                open_time=item["openTime"],
                close_price=self._to_decimal(item["closePrice"]),
                atr=atr,
            )
        )

        for i in range(atr_length, len(klines)):
            item = klines[i]
            prev_item = klines[i - 1]

            tr1 = self._to_decimal(item["highPrice"]) - self._to_decimal(item["lowPrice"])
            tr2 = abs(self._to_decimal(item["highPrice"]) - self._to_decimal(prev_item["closePrice"]))
            tr3 = abs(self._to_decimal(item["lowPrice"]) - self._to_decimal(prev_item["closePrice"]))
            true_range = max(max(tr1, tr2), tr3)

            prev_atr = atr_list[i - 1]
            atr = ((prev_atr.atr * Decimal(atr_length - 1)) + true_range) / Decimal(atr_length)
            atr = self._round6(atr)

            atr_list.append(
                AtrDto(
                    open_time=item["openTime"],
                    close_price=self._to_decimal(item["closePrice"]),
                    atr=atr,
                )
            )

        return DataResult[list[AtrDto]].success(atr_list)

    @staticmethod
    def _to_decimal(value: float | int | str | Decimal) -> Decimal:
        return Decimal(str(value))

    @staticmethod
    def _round6(value: Decimal) -> Decimal:
        return value.quantize(Decimal("0.000001"), rounding=ROUND_HALF_UP)
