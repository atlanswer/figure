import io
import sys
from typing import Literal, TypedDict, cast

import matplotlib as mpl
import matplotlib.pyplot as plt
import numpy as np
import numpy.typing as npt
from matplotlib.projections.polar import PolarAxes

mpl.rcParams["backend"] = "SVG"
if sys.platform == "emscripten":
    plt.style.use(["default", "seaborn-paper"])
else:
    plt.style.use(["default", "seaborn-v0_8-paper"])
mpl.rcParams["font.family"] = "Arial"
mpl.rcParams["font.weight"] = "bold"
mpl.rcParams["axes.labelweight"] = "bold"
mpl.rcParams["axes.grid"] = True
mpl.rcParams["grid.alpha"] = 0.5
mpl.rcParams["grid.linewidth"] = 0.5
mpl.rcParams["xtick.direction"] = "in"
mpl.rcParams["ytick.direction"] = "in"
mpl.rcParams["lines.linewidth"] = 2


sf = 2 / 3.5
"""Scale factor"""

mpl.rcParams["figure.figsize"] = 3.5 * sf, 3.5 * sf


class Source(TypedDict):
    type: Literal["E", "M"]
    phi: float
    theta: float
    amplitude: float
    phase: float


class FigureConfig(TypedDict):
    viewPlane: Literal["YZ", "XZ", "XY"]
    sources: list[Source]


def get_e_theta(theta: npt.NDArray[np.float64], phi: float, source: Source):
    phi_rad = phi + source["phi"] / 180 * np.pi
    return np.ones_like(theta) * np.sin(phi_rad)


def get_m_theta(theta: npt.NDArray[np.float64], phi: float, source: Source):
    theta_rad = theta + source["theta"] / 180 * np.pi
    phi_rad = phi + source["phi"] / 180 * np.pi
    return np.sin(theta_rad) * np.cos(phi_rad)


def plotFigPlane1(config: FigureConfig):
    config = cast(FigureConfig, config.to_py())  # type: ignore
    print(f"{config=}")

    x = np.linspace(0, 2 * np.pi, 361)

    phi: float = 0 if config["viewPlane"] == "XZ" else 90

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

    ax.plot(x, y_co)
    ax.set_rticks([])
    ax.set_theta_zero_location("N")
    ax.set_theta_direction(-1)
    # ax.tick_params(pad=0)

    f = io.BytesIO()
    fig.savefig(f, format="svg")
    plt.close(fig)
    f.seek(0)

    return f.getvalue().decode()


plotFigPlane1  # pyright: ignore[reportUnusedExpression] # noqa: B018
