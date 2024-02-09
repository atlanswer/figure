# spell-checker:words azim, mplot3d

import io
import sys
from typing import Literal, TypedDict, cast

import matplotlib.pyplot as plt
import numpy as np
from mpl_toolkits.mplot3d.axes3d import Axes3D

if sys.platform != "emscripten":
    import initialization  # noqa: F401 # type:ignore


class Source(TypedDict):
    type: Literal["E", "M"]
    theta: float
    phi: float
    amplitude: float
    phase: float


def plot_sources(sources: list[Source]):
    sources = cast(list[Source], sources.to_py())  # type: ignore

    fig, ax = plt.subplots(
        figsize=(2, 2),
        subplot_kw={
            "projection": "3d",
            # "facecolor": "#AAAAAA",
        },
    )
    assert isinstance(ax, Axes3D)

    ax.set_proj_type("ortho")
    ax.set_box_aspect((1, 1, 1))
    ax.view_init(elev=45, azim=45)
    ax.set_axis_off()

    max_amplitude = 0

    for s in sources:
        theta = np.radians(s["theta"])
        phi = np.radians(s["phi"])
        w = s["amplitude"] * np.cos(theta)
        w2 = s["amplitude"] * np.sin(theta)
        u = w2 * np.cos(phi)
        v = w2 * np.sin(phi)
        ax.quiver(
            0,
            0,
            0,
            u,
            v,
            w,
            pivot="middle",
            color="C0" if s["type"] == "E" else "C1",
            arrow_length_ratio=0.2,
        )
        ax.text(
            u / 2 * 1.2,
            v / 2 * 1.2,
            w / 2 * 1.2,
            "J" if s["type"] == "E" else "M",
        )
        max_amplitude = max(max_amplitude, s["amplitude"])

    ax.plot([0, max_amplitude], [0, 0], [0, 0], "k", linewidth=0.5)
    ax.plot([0, 0], [0, max_amplitude], [0, 0], "k", linewidth=0.5)
    ax.plot([0, 0], [0, 0], [0, max_amplitude], "k", linewidth=0.5)
    ax.text(max_amplitude, 0, max_amplitude * 0.1, "x", "x", fontsize="small")
    ax.text(
        0, max_amplitude * 0.8, max_amplitude * 0.05, "y", "y", fontsize="small"
    )
    ax.text(
        0, max_amplitude * 0.05, max_amplitude * 0.85, "z", fontsize="small"
    )
    ax.set_xlim(-max_amplitude * 0.4, max_amplitude * 0.4)
    ax.set_ylim(-max_amplitude * 0.4, max_amplitude * 0.4)
    ax.set_zlim(-max_amplitude * 0.4, max_amplitude * 0.4)
    ax.set_axisbelow(True)

    f = io.BytesIO()
    fig.savefig(f, format="svg", bbox_inches="tight", pad_inches=0)
    plt.close(fig)
    f.seek(0)

    return f.getvalue().decode()


plot_sources  # pyright: ignore[reportUnusedExpression] # noqa: B018
