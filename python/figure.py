# spell-checker:words rlim, rticks, rscale, arange, nbins, yaxis, intp, hpbw

import io
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


def get_m_theta(
    theta: npt.NDArray[np.float64], phi: npt.NDArray[np.float64], source: Source
):
    phi_rad = phi + np.radians(source["phi"])
    phase = np.radians(source["phase"])
    return -np.sin(phi_rad) * source["amplitude"] * np.cos(phase)


def get_m_phi(
    theta: npt.NDArray[np.float64], phi: npt.NDArray[np.float64], source: Source
):
    theta_rad = theta + source["theta"]
    phi_rad = phi + source["phi"]
    return -np.sin(theta_rad) * np.cos(phi_rad) * source["amplitude"]


def get_e_theta(
    theta: npt.NDArray[np.float64], phi: npt.NDArray[np.float64], source: Source
):
    theta_rad = theta + source["theta"]
    phi_rad = phi + source["phi"]
    return np.sin(theta_rad) * np.cos(phi_rad) * source["amplitude"]


def get_e_phi(
    theta: npt.NDArray[np.float64], phi: npt.NDArray[np.float64], source: Source
):
    phi_rad = phi + source["phi"]
    return -np.sin(phi_rad) * source["amplitude"]


x: npt.NDArray[np.float64]


def plot_view_plane(config: ViewPlaneConfig) -> tuple[int, int, str]:
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

    y_theta = np.zeros_like(x)
    y_phi = np.zeros_like(x)

    for s in config["sources"]:
        s["theta"] = np.radians(s["theta"])
        s["phi"] = np.radians(s["phi"])
        s["phase"] = np.radians(s["phase"])
        match s["type"]:
            case "E":
                y_theta += get_e_theta(theta, phi, s)
                y_phi += get_e_phi(theta, phi, s)
            case "M":
                y_theta += get_m_theta(theta, phi, s)
                y_phi += get_m_phi(theta, phi, s)

    fig, ax = plt.subplots(subplot_kw={"projection": "polar"})
    assert isinstance(ax, PolarAxes)

    y_total = np.sqrt(y_theta**2 + y_phi**2)
    y_total_db = 10 * np.log10(y_total)
    y_theta = np.abs(y_theta)
    y_phi = np.abs(y_phi)
    if config["isDb"]:
        y_theta = 10 * np.log10(y_theta)
        y_phi = 10 * np.log10(y_phi)

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

    return int(peak_idx), get_hpbw(), f.getvalue().decode()


plot_view_plane  # pyright: ignore[reportUnusedExpression] # noqa: B018
