import io
import sys

import matplotlib as mpl
import matplotlib.pyplot as plt
import numpy as np
from matplotlib.axes import Axes

mpl.rcParams["backend"] = "Agg"
if sys.platform == "emscripten":
    plt.style.use(["default", "seaborn-paper"])
else:
    plt.style.use(["default", "seaborn-v0_8-paper"])
mpl.rcParams["font.family"] = "Arial"
mpl.rcParams["font.weight"] = "bold"
mpl.rcParams["axes.labelweight"] = "bold"


sf = 2 / 3.5
"""Scale factor"""

mpl.rcParams["figure.figsize"] = 3.5 * sf, 3.5 * sf


def plotFigPlane1(config: dict[str, str] | None = None):
    x = np.linspace(0, 2 * np.pi, 100)
    y = np.sin(x)

    fig, ax = plt.subplots()
    assert isinstance(ax, Axes)

    ax.plot(x, y)

    f = io.BytesIO()
    fig.savefig(f, format="svg")
    plt.close(fig)
    f.seek(0)
    return f.getvalue().decode()


print(plotFigPlane1())

plotFigPlane1  # pyright: ignore[reportUnusedExpression] # noqa: B018
