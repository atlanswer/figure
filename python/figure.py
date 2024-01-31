# spell-checker:words rlim, rticks, rscale, arange

import io
from typing import Literal, TypedDict, cast

import matplotlib.pyplot as plt
import numpy as np
import numpy.typing as npt
from matplotlib.projections.polar import PolarAxes


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
    sources: list[Source]


def get_m_theta(
    theta: npt.NDArray[np.float64], phi: npt.NDArray[np.float64], source: Source
):
    phi_rad = phi + source["phi"] / 180 * np.pi
    return np.sin(phi_rad)


def get_m_phi(
    theta: npt.NDArray[np.float64], phi: npt.NDArray[np.float64], source: Source
):
    theta_rad = theta + source["theta"] / 180 * np.pi
    phi_rad = phi + source["phi"] / 180 * np.pi
    return -np.cos(theta_rad) * np.cos(phi_rad)


def get_e_theta(
    theta: npt.NDArray[np.float64], phi: npt.NDArray[np.float64], source: Source
):
    theta_rad = theta + source["theta"] / 180 * np.pi
    phi_rad = phi + source["phi"] / 180 * np.pi
    return np.sin(theta_rad) * np.cos(phi_rad)


def get_e_phi(
    theta: npt.NDArray[np.float64], phi: npt.NDArray[np.float64], source: Source
):
    phi_rad = phi + source["phi"] / 180 * np.pi
    return -np.sin(phi_rad)


x: npt.NDArray[np.float64]


def plot_view_plane(config: ViewPlaneConfig) -> str:
    config = cast(ViewPlaneConfig, config.to_py())  # type: ignore

    global x
    assert isinstance(x, np.ndarray)

    # TODO: debug
    print(f"{config=}")

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
        match s["type"]:
            case "E":
                y_theta += s["amplitude"] * get_e_theta(theta, phi, s)
                y_phi += s["amplitude"] * get_e_phi(theta, phi, s)
            case "M":
                y_theta += s["amplitude"] * get_m_theta(theta, phi, s)
                y_phi += s["amplitude"] * get_m_phi(theta, phi, s)

    y_theta = np.abs(y_theta)
    y_phi = np.abs(y_phi)
    if config["isDb"]:
        y_theta = np.log10(y_theta)
        y_phi = np.log10(y_phi)

    fig, ax = plt.subplots(subplot_kw={"projection": "polar"})
    assert isinstance(ax, PolarAxes)
    # ax.xaxis.set_zorder(-1)

    ax.plot(x, y_theta)
    ax.plot(x, y_phi)
    if config["isDb"]:
        ax.set_rlim(-41, 11)
    else:
        ax.set_rlim(0, len(config["sources"]))
        ax.set_rticks(np.arange(0, len(config["sources"]) + 0.1, 0.5))
    ax.set_theta_zero_location("N")
    ax.set_theta_direction(-1)
    # ax.tick_params(pad=0)

    f = io.BytesIO()
    fig.savefig(f, format="svg")
    plt.close(fig)
    f.seek(0)

    return f.getvalue().decode()


plot_view_plane  # pyright: ignore[reportUnusedExpression] # noqa: B018
