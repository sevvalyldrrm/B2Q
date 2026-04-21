from __future__ import annotations

from decimal import Decimal

from .atr import AtrIndicator
from .bollinger import BollingerIndicator
from .ema import EmaIndicator
from .models import AtrDto, BollingerBandDto, DataResult, EmaDto, RsiDto, SmaDto, SupertrendDto
from .rsi import RsiIndicator
from .sma import SmaIndicator
from .supertrend import SupertrendIndicator


class IndicatorService:
    def __init__(self, redis_client):
        self.sma_indicator = SmaIndicator(redis_client)
        self.ema_indicator = EmaIndicator(redis_client)
        self.bollinger_indicator = BollingerIndicator(redis_client)
        self.atr_indicator = AtrIndicator(redis_client)
        self.rsi_indicator = RsiIndicator(redis_client)
        self.supertrend_indicator = SupertrendIndicator(redis_client)

    async def calculate_sma_async(
        self,
        symbol: str,
        interval: str,
        length: int,
    ) -> DataResult[list[SmaDto]]:
        return await self.sma_indicator.calculate_async(symbol, interval, length)

    async def calculate_ema_async(
        self,
        symbol: str,
        interval: str,
        length: int,
    ) -> DataResult[list[EmaDto]]:
        return await self.ema_indicator.calculate_async(symbol, interval, length)

    async def calculate_bollinger_async(
        self,
        symbol: str,
        interval: str,
        length: int = 20,
        std_dev: Decimal = Decimal("2"),
    ) -> DataResult[list[BollingerBandDto]]:
        return await self.bollinger_indicator.calculate_async(symbol, interval, length, std_dev)

    async def calculate_rsi_async(
        self,
        symbol: str,
        interval: str,
        length: int = 14,
    ) -> DataResult[list[RsiDto]]:
        return await self.rsi_indicator.calculate_async(symbol, interval, length)

    async def calculate_atr_async(
        self,
        symbol: str,
        interval: str,
        length: int = 14,
    ) -> DataResult[list[AtrDto]]:
        return await self.atr_indicator.calculate_async(symbol, interval, length)

    async def calculate_supertrend_async(
        self,
        symbol: str,
        interval: str,
        multiplier: Decimal = Decimal("3.0"),
        atr_length: int = 10,
    ) -> DataResult[list[SupertrendDto]]:
        return await self.supertrend_indicator.calculate_async(
            symbol,
            interval,
            multiplier,
            atr_length,
        )
