# spell-checker:words rlim, rticks

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
    sources: list[Source]


def get_m_theta(theta: npt.NDArray[np.float64], phi: float, source: Source):
    phi_rad = (phi + source["phi"]) / 180 * np.pi
    return np.ones_like(theta) * np.sin(phi_rad)


def get_e_theta(theta: npt.NDArray[np.float64], phi: float, source: Source):
    theta_rad = theta + source["theta"] / 180 * np.pi
    phi_rad = (phi + source["phi"]) / 180 * np.pi
    return np.sin(theta_rad) * np.cos(phi_rad)


def plot_view_plane(config: ViewPlaneConfig) -> str:
    config = cast(ViewPlaneConfig, config.to_py())  # type: ignore

    # TODO: debug
    print(f"{config=}")

    x = np.linspace(0, 2 * np.pi, 361)

    phi = 0

    match config["cutPlane"]:
        case "YZ":
            phi = 90
        case "XZ":
            phi = 0
        case "XY":
            ...

    y_theta = np.zeros_like(x)

    for s in config["sources"]:
        match s["type"]:
            case "E":
                y_theta += get_e_theta(x, phi, s)
            case "M":
                y_theta += get_m_theta(x, phi, s)

    y_co = np.abs(y_theta)
    # r_x = np.abs()

    fig, ax = plt.subplots(subplot_kw={"projection": "polar"})
    assert isinstance(ax, PolarAxes)

    ax.set_rlim(0, 1)
    ax.plot(x, y_co)
    # ax.set_rticks([])
    ax.set_theta_zero_location("N")
    ax.set_theta_direction(-1)
    # ax.tick_params(pad=0)

    f = io.BytesIO()
    fig.savefig(f, format="svg")
    plt.close(fig)
    f.seek(0)

    return f.getvalue().decode()


plot_view_plane  # pyright: ignore[reportUnusedExpression] # noqa: B018
