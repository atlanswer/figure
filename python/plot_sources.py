# spell-checker:words azim, mplot3d

import io
from typing import Literal, TypedDict

import matplotlib.pyplot as plt
from mpl_toolkits.mplot3d.axes3d import Axes3D, get_test_data


class Source(TypedDict):
    type: Literal["E", "M"]
    theta: float
    phi: float
    amplitude: float
    phase: float


def plot_sources(sources: list[Source]):
    X, Y, Z = get_test_data()

    fig, ax = plt.subplots(subplot_kw={"projection": "3d"})
    assert isinstance(ax, Axes3D)

    ax.plot_wireframe(X, Y, Z, rstride=10, cstride=10)

    ax.view_init(elev=45, azim=45)
    ax.set_proj_type("ortho")
    ax.set_aspect("auto")

    f = io.BytesIO()
    fig.savefig(f, format="svg")
    plt.close(fig)
    f.seek(0)

    return f.getvalue().decode()


plot_sources  # pyright: ignore[reportUnusedExpression] # noqa: B018

# plot_sources([Source(type="E", theta=90, phi=90, amplitude=1, phase=0)])
