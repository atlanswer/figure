import io

import matplotlib.pyplot as plt
from mpl_toolkits.mplot3d.axes3d import Axes3D


def plot_sources():
    fig, ax = plt.subplots(subplot_kw={"projection": "3d"})
    assert isinstance(ax, Axes3D)

    f = io.BytesIO()
    fig.savefig(f, format="svg")
    plt.close(fig)
    f.seek(0)

    return f.getvalue().decode()


plot_sources  # pyright: ignore[reportUnusedExpression] # noqa: B018
