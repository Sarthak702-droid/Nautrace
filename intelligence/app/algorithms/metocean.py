from __future__ import annotations

from dataclasses import dataclass
from datetime import datetime, timezone

import numpy as np
from scipy.interpolate import RegularGridInterpolator

from app.models import GeoPoint, MetoceanGridInput


@dataclass(frozen=True)
class VelocityComponents:
    current_east_mps: float
    current_north_mps: float
    wind_east_mps: float
    wind_north_mps: float
    stokes_east_mps: float
    stokes_north_mps: float

    def total(self, current_scale: float, wind_scale: float, windage: float) -> tuple[float, float]:
        east = (
            current_scale * self.current_east_mps
            + self.stokes_east_mps
            + wind_scale * windage * self.wind_east_mps
        )
        north = (
            current_scale * self.current_north_mps
            + self.stokes_north_mps
            + wind_scale * windage * self.wind_north_mps
        )
        return east, north


class ForcingCoverageError(RuntimeError):
    pass


def _epoch_seconds(value: datetime) -> float:
    return value.astimezone(timezone.utc).timestamp()


class RegularGridMetoceanField:
    def __init__(self, grid: MetoceanGridInput) -> None:
        self.grid = grid
        axes = (
            np.array([_epoch_seconds(t) for t in grid.times], dtype=float),
            np.array(grid.latitudes, dtype=float),
            np.array(grid.longitudes, dtype=float),
        )
        self._time_min = float(axes[0][0])
        self._time_max = float(axes[0][-1])
        self._lat_min = float(axes[1][0])
        self._lat_max = float(axes[1][-1])
        self._lon_min = float(axes[2][0])
        self._lon_max = float(axes[2][-1])

        self._interpolators = {
            "current_e": self._make_interpolator(axes, grid.current_east_mps),
            "current_n": self._make_interpolator(axes, grid.current_north_mps),
            "wind_e": self._make_interpolator(axes, grid.wind_east_mps),
            "wind_n": self._make_interpolator(axes, grid.wind_north_mps),
            "stokes_e": self._make_interpolator(axes, grid.stokes_east_mps) if grid.stokes_east_mps else None,
            "stokes_n": self._make_interpolator(axes, grid.stokes_north_mps) if grid.stokes_north_mps else None,
        }

    @staticmethod
    def _make_interpolator(axes: tuple[np.ndarray, np.ndarray, np.ndarray], values) -> RegularGridInterpolator:
        array = np.asarray(values, dtype=float)
        if not np.all(np.isfinite(array)):
            raise ValueError("metocean grid contains non-finite values")
        return RegularGridInterpolator(axes, array, bounds_error=False, fill_value=np.nan)

    def covers(self, point: GeoPoint, at: datetime) -> bool:
        ts = _epoch_seconds(at)
        return (
            self._time_min <= ts <= self._time_max
            and self._lat_min <= point.lat <= self._lat_max
            and self._lon_min <= point.lon <= self._lon_max
        )

    def velocity(self, point: GeoPoint, at: datetime) -> VelocityComponents:
        query = np.array([[_epoch_seconds(at), point.lat, point.lon]], dtype=float)

        def value(name: str, optional: bool = False) -> float:
            interpolator = self._interpolators[name]
            if interpolator is None:
                return 0.0
            result = float(interpolator(query)[0])
            if not np.isfinite(result):
                if optional:
                    return 0.0
                raise ForcingCoverageError(
                    f"metocean forcing has no coverage at time={at.isoformat()}, lat={point.lat}, lon={point.lon}"
                )
            return result

        return VelocityComponents(
            current_east_mps=value("current_e"),
            current_north_mps=value("current_n"),
            wind_east_mps=value("wind_e"),
            wind_north_mps=value("wind_n"),
            stokes_east_mps=value("stokes_e", optional=True),
            stokes_north_mps=value("stokes_n", optional=True),
        )
