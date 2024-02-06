import io
from typing import Literal, TypedDict, cast

import matplotlib.pyplot as plt
from mpl_toolkits.mplot3d.axes3d import Axes3D


class Source(TypedDict):
    type: Literal["E", "M"]
    phi: float
    theta: float
    amplitude: float
    phase: float


def plot_sources(sources: list[Source]):
    sources = cast(list[Source], sources.to_py())  # type: ignore

    fig, ax = plt.subplots(subplot_kw={"projection": "3d"})
    assert isinstance(ax, Axes3D)

    # ax.view_init(elev=45, azim=45, roll=45)

    f = io.BytesIO()
    fig.savefig(f, format="svg")
    plt.close(fig)
    f.seek(0)

    return f.getvalue().decode()


plot_sources  # pyright: ignore[reportUnusedExpression] # noqa: B018
