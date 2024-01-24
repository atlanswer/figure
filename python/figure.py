import io

import matplotlib.pyplot as plt
import numpy as np
from matplotlib.axes import Axes

x = np.linspace(0, 2 * np.pi, 100)
y = np.sin(x)

fig, ax = plt.subplots(figsize=(3.5, 3.5))
assert isinstance(ax, Axes)

ax.plot(x, y)

f = io.BytesIO()
fig.savefig(f, format="svg", bbox_inches="tight")
plt.close(fig)
f.seek(0)
figSvg = f.getvalue().decode()

print(figSvg)


# test  # pyright: ignore[reportUnusedExpression] # noqa: B018
