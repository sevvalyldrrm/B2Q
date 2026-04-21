from __future__ import annotations

from decimal import Decimal, ROUND_HALF_UP

from .atr import AtrIndicator
from .models import DataResult, SupertrendDto


class SupertrendIndicator:
    def __init__(self, redis_client):
        self.redis = redis_client
        self.atr_indicator = AtrIndicator(redis_client)

    async def calculate_async(
        self,
        symbol: str,
        interval: str,
        multiplier: Decimal = Decimal("3.0"),
        atr_length: int = 10,
    ) -> DataResult[list[SupertrendDto]]:
        klines = await self.redis.get_history(symbol.lower(), interval, 500)
        result: list[SupertrendDto] = []

        if len(klines) < atr_length or atr_length == 0:
            return DataResult[list[SupertrendDto]].fail_length_required()

        atr_list_result = await self.atr_indicator.calculate_async(symbol, interval, atr_length)
        if not atr_list_result.is_successful:
            return DataResult[list[SupertrendDto]].fail(
                atr_list_result.errors,
                atr_list_result.status_code,
            )

        atr_list = atr_list_result.data or []

        previous_final_upperband = Decimal("0")
        previous_final_lowerband = Decimal("0")
        final_upperband = Decimal("0")
        final_lowerband = Decimal("0")
        previous_close = Decimal("0")
        previous_supertrend = Decimal("0")
        supertrendc = Decimal("0")

        multiplier_decimal = self._to_decimal(multiplier)

        for i in range(len(klines)):
            kline = klines[i]
            source = (
                self._to_decimal(kline["highPrice"]) + self._to_decimal(kline["lowPrice"])
            ) / Decimal("2")
            atr = atr_list[i]
            basic_lowerband = source - (multiplier_decimal * atr.atr)
            basic_upperband = source + (multiplier_decimal * atr.atr)

            if basic_upperband < previous_final_upperband or previous_close > previous_final_upperband:
                final_upperband = basic_upperband
            else:
                final_upperband = previous_final_upperband

            if basic_lowerband > previous_final_lowerband or previous_close < previous_final_lowerband:
                final_lowerband = basic_lowerband
            else:
                final_lowerband = previous_final_lowerband

            if previous_supertrend == previous_final_upperband and self._to_decimal(kline["closePrice"]) <= final_upperband:
                supertrendc = final_upperband
            else:
                if previous_supertrend == previous_final_upperband and self._to_decimal(kline["closePrice"]) >= final_upperband:
                    supertrendc = final_lowerband
                else:
                    if previous_supertrend == previous_final_lowerband and self._to_decimal(kline["closePrice"]) >= final_lowerband:
                        supertrendc = final_lowerband
                    elif previous_supertrend == previous_final_lowerband and self._to_decimal(kline["closePrice"]) <= final_lowerband:
                        supertrendc = final_upperband

            previous_close = self._to_decimal(kline["closePrice"])
            previous_final_upperband = final_upperband
            previous_final_lowerband = final_lowerband
            previous_supertrend = supertrendc

            result.append(
                SupertrendDto(
                    close_price=self._to_decimal(kline["closePrice"]),
                    high_price=self._to_decimal(kline["highPrice"]),
                    low_price=self._to_decimal(kline["lowPrice"]),
                    open_price=self._to_decimal(kline["openPrice"]),
                    open_time=kline["openTime"],
                    close_time=kline.get("closeTime", ""),
                    supertrend_lower_band=self._round4(final_lowerband),
                    supertrend_upper_band=self._round4(final_upperband),
                    supertrend=self._round4(supertrendc),
                    trend_tag="BUY" if supertrendc == final_lowerband else "SELL",
                )
            )

        return DataResult[list[SupertrendDto]].success(result)

    @staticmethod
    def _to_decimal(value: float | int | str | Decimal) -> Decimal:
        return Decimal(str(value))

    @staticmethod
    def _round4(value: Decimal) -> Decimal:
        return value.quantize(Decimal("0.0001"), rounding=ROUND_HALF_UP)
