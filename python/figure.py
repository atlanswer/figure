# spell-checker:words rlim, rticks, rscale, arange, nbins, yaxis, intp, hpbw

import io
import time
from typing import Literal, TypedDict, cast

import matplotlib.pyplot as plt
import numpy as np
import numpy.typing as npt
from matplotlib.projections.polar import PolarAxes
from matplotlib.ticker import MaxNLocator


class Source(TypedDict):
    type: Literal["E", "M"]
    phi: float
    theta: float
    amplitude: float
    phase: float


CutPlane = Literal["XZ", "YZ", "XY"]


class ViewPlaneConfig(TypedDict):
    cutPlane: CutPlane
    isDb: bool
    isGainTotal: bool
    sources: list[Source]


x: npt.NDArray[np.float64]


def plot_view_plane(config: ViewPlaneConfig) -> tuple[int, int, str]:
    t_start = time.perf_counter()

    config = cast(ViewPlaneConfig, config.to_py())  # type: ignore

    global x
    assert isinstance(x, np.ndarray)

    phi = np.zeros_like(x)
    theta = np.pi / 2 * np.ones_like(x)

    match config["cutPlane"]:
        case "YZ":
            theta = x
            phi = np.pi / 2 * np.ones_like(x)
        case "XZ":
            theta = x
        case "XY":
            phi = x

    theta_a = np.zeros_like(x)
    theta_phase = np.zeros_like(x)
    phi_a = np.zeros_like(x)
    phi_phase = np.zeros_like(x)

    for s in config["sources"]:
        theta_s = np.radians(s["theta"])
        phi_s = np.radians(s["phi"])
        phase_s = np.radians(s["phase"])
        match s["type"]:
            case "E":
                theta_b = -np.sin(theta - theta_s) * np.cos(phi - phi_s)
                phi_b = -np.sin(phi - phi_s)
            case "M":
                theta_b = np.sin(phi - phi_s)
                phi_b = -np.sin(theta - theta_s) * np.cos(phi - phi_s)
        theta_a = np.sqrt(
            theta_a**2
            + theta_b**2
            + 2 * theta_a * theta_b * np.cos(theta_phase - phase_s)
        )
        theta_phase_numerator = theta_a * np.sin(
            theta_phase
        ) + theta_b * np.sin(phase_s)
        theta_phase_numerator_nonzero = theta_phase != 0
        theta_phase_denominator = theta_a * np.cos(
            theta_phase
        ) + theta_b * np.cos(phase_s)
        theta_phase = theta_phase_numerator
        theta_phase[theta_phase_numerator_nonzero] = np.arctan(
            theta_phase_numerator[theta_phase_numerator_nonzero]
            / theta_phase_denominator[theta_phase_numerator_nonzero]
        )
        phi_a = np.sqrt(
            phi_a**2
            + phi_b**2
            + 2 * phi_a * phi_b * np.cos(phi_phase - phase_s)
        )
        phi_phase_numerator = phi_a * np.sin(phi_phase) + phi_b * np.sin(
            phase_s
        )
        phi_phase_numerator_nonzero = phi_phase_numerator != 0
        phi_phase_denominator = phi_a * np.cos(phi_phase) + phi_b * np.cos(
            phase_s
        )
        phi_phase = phi_phase_numerator
        phi_phase[phi_phase_numerator_nonzero] = np.arctan(
            phi_phase_numerator[phi_phase_numerator_nonzero]
            / phi_phase_denominator[phi_phase_numerator_nonzero]
        )

    y_total = np.sqrt(theta_a**2 + phi_a**2)
    y_total_db = 10 * np.log10(y_total)
    y_theta = np.abs(theta_a)
    y_phi = np.abs(phi_a)
    if config["isDb"]:
        y_theta = 10 * np.log10(y_theta)
        y_phi = 10 * np.log10(y_phi)

    fig, ax = plt.subplots(subplot_kw={"projection": "polar"})
    assert isinstance(ax, PolarAxes)

    if config["isGainTotal"]:
        if config["isDb"]:
            ax.plot(x, y_total_db, clip_on=False)
        else:
            ax.plot(x, y_total, clip_on=False)
    else:
        ax.plot(x, y_theta, clip_on=False)
        ax.plot(x, y_phi, clip_on=False)

    if config["isDb"]:
        ax.set_rlim(-41, 11)
    else:
        upper_lim = 0
        for s in config["sources"]:
            upper_lim += s["amplitude"]
        ax.set_rlim(0, upper_lim)
        r_locator = MaxNLocator(nbins=4)
        ax.yaxis.set_major_locator(r_locator)
    ax.set_theta_zero_location("N")
    ax.set_theta_direction(-1)
    # ax.tick_params(pad=0)

    f = io.BytesIO()
    fig.savefig(f, format="svg")
    plt.close(fig)
    f.seek(0)

    peak: np.float64 = np.max(y_total_db)
    peak_idx = np.argmax(y_total_db)
    hp = np.subtract(peak, 3)

    def get_hpbw() -> int:
        hpbw = 1
        r_idx = int(peak_idx)
        while y_total_db[r_idx] >= hp:
            r_idx += 1
            if r_idx >= 360:
                r_idx = 0
            if r_idx == peak_idx:
                return 360
        l_idx = r_idx - 2
        while y_total_db[l_idx] >= hp:
            l_idx -= 1
            hpbw += 1
            if l_idx <= 0:
                l_idx = 359
        return hpbw + 1

    t_finish = time.perf_counter()
    print(f"plot_view_plane: {( t_finish - t_start ) * 1000:.3f} ms")

    return int(peak_idx), get_hpbw(), f.getvalue().decode()


plot_view_plane  # pyright: ignore[reportUnusedExpression] # noqa: B018
