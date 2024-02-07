# spell-checker:words azim, mplot3d
# %%

import io
import sys
from typing import Literal, TypedDict

import matplotlib.pyplot as plt
from mpl_toolkits.mplot3d.axes3d import Axes3D

if sys.platform != "emscripten":
    import initialization  # noqa: F401 # type:ignore


class Source(TypedDict):
    type: Literal["E", "M"]
    theta: float
    phi: float
    amplitude: float
    phase: float


# %%

if sys.platform != "emscripten":
    sources = []
    sources.append(Source(type="E", theta=90, phi=90, amplitude=1, phase=0))


# %%


def plot_sources(sources: list[Source]):
    fig, ax = plt.subplots(figsize=(2, 2), subplot_kw={"projection": "3d"})
    assert isinstance(ax, Axes3D)

    ax.set_xlim(-1, 1)
    ax.set_ylim(-1, 1)
    ax.set_zlim(-1, 1)
    ax.view_init(elev=45, azim=45)
    ax.set_proj_type("ortho")
    # ax.set_aspect("equal", anchor="C")
    ax.set_axis_off()
    ax.set_box_aspect((1, 1, 1))
    ax.quiver(
        0,
        0,
        0,
        1,
        0,
        0,
        length=2,
        color="k",
        pivot="middle",
        linewidth=1,
        arrow_length_ratio=0.1,
    )  # x-axis
    ax.quiver(
        0,
        0,
        0,
        0,
        1,
        0,
        length=2,
        color="k",
        pivot="middle",
        linewidth=1,
        arrow_length_ratio=0.1,
    )  # y-axis
    ax.quiver(
        0,
        0,
        0,
        0,
        0,
        1,
        length=2,
        color="k",
        pivot="middle",
        linewidth=1,
        arrow_length_ratio=0.1,
    )  # z-axis

    if sys.platform != "emscripten":
        # fig.tight_layout()
        return fig
    else:
        f = io.BytesIO()
        fig.tight_layout()
        fig.savefig(f, format="svg", bbox_inches="tight", pad_inches=0)
        plt.close(fig)
        f.seek(0)

    return f.getvalue().decode()


if sys.platform != "emscripten":
    plot_sources(sources)

plot_sources  # pyright: ignore[reportUnusedExpression] # noqa: B018
