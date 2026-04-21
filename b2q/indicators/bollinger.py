from __future__ import annotations

from decimal import Decimal
import math

from .models import BollingerBandDto, DataResult


class BollingerIndicator:
    def __init__(self, redis_client):
        self.redis = redis_client

    async def calculate_async(
        self,
        symbol: str,
        interval: str,
        length: int = 20,
        std_dev: Decimal = Decimal("2"),
    ) -> DataResult[list[BollingerBandDto]]:
        klines = await self.redis.get_history(symbol.lower(), interval, 500)

        bb_list: list[BollingerBandDto] = []

        if len(klines) < length:
            return DataResult[list[BollingerBandDto]].fail_length_required()

        for i in range(0, len(klines) - length + 1):
            get_list = klines[i:i + length]
            closes = [self._to_decimal(item["closePrice"]) for item in get_list]

            medium_band_value = sum(closes, Decimal("0")) / Decimal(length)

            top_band_value_list: list[float] = []
            for item in get_list:
                r = math.pow(float(self._to_decimal(item["closePrice"]) - medium_band_value), 2)
                top_band_value_list.append(r)

            sapma = math.sqrt(sum(top_band_value_list) / len(top_band_value_list))

            top_band_value = medium_band_value + (std_dev * self._to_decimal(sapma))
            bottom_band_value = medium_band_value - (std_dev * self._to_decimal(sapma))

            last_item = get_list[-1]
            bb_list.append(
                BollingerBandDto(
                    top_band_value=top_band_value,
                    medium_band_value=medium_band_value,
                    bottom_band_value=bottom_band_value,
                    open_time=last_item["openTime"],
                    close_price=self._to_decimal(last_item["closePrice"]),
                )
            )

        return DataResult[list[BollingerBandDto]].success(bb_list)

    @staticmethod
    def _to_decimal(value: float | int | str | Decimal) -> Decimal:
        return Decimal(str(value))
