from __future__ import annotations

from dataclasses import dataclass, field
from typing import Generic, TypeVar

T = TypeVar("T")


@dataclass
class DataResult(Generic[T]):
    is_successful: bool
    data: T | None = None
    errors: list[str] = field(default_factory=list)
    status_code: int = 200

    @classmethod
    def success(cls, data: T) -> "DataResult[T]":
        return cls(is_successful=True, data=data, errors=[], status_code=200)

    @classmethod
    def fail(cls, errors: list[str], status_code: int = 400) -> "DataResult[T]":
        return cls(is_successful=False, data=None, errors=errors, status_code=status_code)

    @classmethod
    def fail_length_required(
        cls,
        message: str = "Length requirement is not satisfied for available candles.",
        status_code: int = 400,
    ) -> "DataResult[T]":
        return cls.fail(errors=[message], status_code=status_code)
