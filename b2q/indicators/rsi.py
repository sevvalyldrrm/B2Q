from __future__ import annotations

from decimal import Decimal

from .models import DataResult, RsiDto


class RsiIndicator:
    def __init__(self, redis_client):
        self.redis = redis_client

    async def calculate_async(
        self,
        symbol: str,
        interval: str,
        length: int = 14,
    ) -> DataResult[list[RsiDto]]:
        klines = await self.redis.get_history(symbol.lower(), interval, 500)

        rs_list: list[Decimal] = []
        avg_loss_list: list[Decimal] = []
        avg_gain_list: list[Decimal] = []
        rsi_list: list[RsiDto] = []

        if len(klines) < length or length == 0:
            return DataResult[list[RsiDto]].fail_length_required()

        r_sum: list[Decimal] = []
        s_sum: list[Decimal] = []

        # C# algorithm parity: initial average gain/loss calculation.
        for k in range(1, length + 1):
            div1 = self._to_decimal(klines[k]["closePrice"]) - self._to_decimal(klines[k - 1]["closePrice"])
            if div1 > 0:
                r_sum.append(div1)
            elif div1 < 0:
                s_sum.append(div1)

        r = sum(r_sum, Decimal("0")) / Decimal(length)
        s = abs(sum(s_sum, Decimal("0"))) / Decimal(length)
        rs = r / (Decimal("1") if s == 0 else s)
        rsi = Decimal("100") - (Decimal("100") / (Decimal("1") + rs))

        avg_gain_list.append(r)
        avg_loss_list.append(s)
        rs_list.append(rs)
        rsi_list.append(
            RsiDto(
                rsi=rsi,
                open_price=self._to_decimal(klines[length]["openPrice"]),
                close_price=self._to_decimal(klines[length]["closePrice"]),
                open_time=klines[length]["openTime"],
                low_price=self._to_decimal(klines[length]["lowPrice"]),
                high_price=self._to_decimal(klines[length]["highPrice"]),
            )
        )

        for i in range(length + 1, len(klines)):
            div = self._to_decimal(klines[i]["closePrice"]) - self._to_decimal(klines[i - 1]["closePrice"])
            _i = i - (length + 1)

            if div > 0:
                r = ((avg_gain_list[_i] * Decimal(length - 1)) + div) / Decimal(length)
                s = ((avg_loss_list[_i] * Decimal(length - 1)) + Decimal("0")) / Decimal(length)
                avg_gain_list.append(r)
                avg_loss_list.append(s)
            else:
                r = ((avg_gain_list[_i] * Decimal(length - 1)) + Decimal("0")) / Decimal(length)
                s = ((avg_loss_list[_i] * Decimal(length - 1)) + abs(div)) / Decimal(length)
                avg_gain_list.append(r)
                avg_loss_list.append(s)

            rs = r / (Decimal("1") if s == 0 else s)
            rsi = Decimal("100") - (Decimal("100") / (Decimal("1") + rs))
            rs_list.append(rs)
            rsi_list.append(
                RsiDto(
                    rsi=rsi,
                    open_price=self._to_decimal(klines[i]["openPrice"]),
                    close_price=self._to_decimal(klines[i]["closePrice"]),
                    open_time=klines[i]["openTime"],
                    low_price=self._to_decimal(klines[i]["lowPrice"]),
                    high_price=self._to_decimal(klines[i]["highPrice"]),
                )
            )

        return DataResult[list[RsiDto]].success(rsi_list)

    @staticmethod
    def _to_decimal(value: float | int | str | Decimal) -> Decimal:
        return Decimal(str(value))
