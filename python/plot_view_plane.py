# spell-checker:words rlim, rticks, rscale, arange, nbins, yaxis, intp, hpbw

import io
from typing import Literal, TypedDict, cast

import matplotlib.pyplot as plt
import numpy as np
import numpy.typing as npt
from matplotlib.projections.polar import PolarAxes
from matplotlib.ticker import MaxNLocator


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
    isGainTotal: bool
    sources: list[Source]


x: npt.NDArray[np.float64]


def plot_view_plane(config: ViewPlaneConfig) -> tuple[int, int, str]:
    config = cast(ViewPlaneConfig, config.to_py())  # type: ignore

    db_min, db_max = -20, 10
    lin_min = 0
    n_samples = 361

    match config["cutPlane"]:
        case "YZ":
            theta = np.linspace(0, np.pi * 2, n_samples)
            phi = np.pi / 2 * np.ones_like(theta)
        case "XZ":
            theta = np.linspace(0, np.pi * 2, n_samples)
            phi = np.zeros_like(theta)
        case "XY":
            phi = np.linspace(0, np.pi * 2, n_samples)
            theta = np.pi / 2 * np.ones_like(phi)

    theta_a = np.zeros(n_samples)
    theta_phase_a = np.zeros(n_samples)
    phi_a = np.zeros(n_samples)
    phi_phase_a = np.zeros(n_samples)

    for s in config["sources"]:
        amplitude = s["amplitude"]
        theta_s = cast(np.float64, np.radians(s["theta"]))
        phi_s = cast(np.float64, np.radians(s["phi"]))
        phase_s = cast(np.float64, np.radians(s["phase"]))
        match s["type"]:
            case "E":
                theta_b = -np.sin(theta - theta_s) * np.cos(phi - phi_s)
                phi_b = -np.sin(phi - phi_s)
            case "M":
                theta_b = np.sin(phi - phi_s)
                phi_b = -np.sin(theta - theta_s) * np.cos(phi - phi_s)
        theta_b *= amplitude
        phi_b *= amplitude

        theta_phase_b = phase_s * np.ones(n_samples)
        phi_phase_b = phase_s * np.ones(n_samples)

        theta_phase_b[theta_b < 0] += np.pi
        theta_b = np.abs(theta_b)
        phi_phase_b[phi_b < 0] += np.pi
        phi_b = np.abs(phi_b)

        theta_phase_numerator = theta_a * np.sin(
            theta_phase_a
        ) + theta_b * np.sin(theta_phase_b)
        theta_phase_denominator = theta_a * np.cos(
            theta_phase_a
        ) + theta_b * np.cos(theta_phase_b)
        print(f"theta_a: [{theta_a[0], theta_a[180]}]")
        print(f"theta_phase_a: [{theta_phase_a[0], theta_phase_a[180]}]")
        print(f"theta_b: [{theta_b[0], theta_b[180]}]")
        print(f"theta_phase_b: [{theta_phase_b[0], theta_phase_b[180]}]")
        theta_a = np.sqrt(
            theta_a**2
            + theta_b**2
            + 2 * theta_a * theta_b * np.cos(theta_phase_a - theta_phase_b)
        )
        theta_phase_a = np.arctan(
            np.divide(
                theta_phase_numerator,
                theta_phase_denominator,
                out=np.zeros_like(theta_phase_numerator),
                where=theta_phase_denominator != 0,
            )
        )
        print(f"theta_a: [{theta_a[0], theta_a[180]}]")
        print(f"theta_phase_a: [{theta_phase_a[0], theta_phase_a[180]}]")
        print("----------")

        # phi_phase_numerator = phi_a * np.sin(phi_phase_a) + phi_b * np.sin(
        #     phi_phase_b
        # )
        # phi_phase_denominator = phi_a * np.cos(phi_phase_a) + phi_b * np.cos(
        #     phi_phase_b
        # )
        phi_a = np.sqrt(
            phi_a**2
            + phi_b**2
            + 2 * phi_a * phi_b * np.cos(phi_phase_a - phi_phase_b)
        )
        # phi_phase_a = np.arctan(
        #     np.divide(
        #         phi_phase_numerator,
        #         phi_phase_denominator,
        #         out=np.zeros_like(phi_phase_numerator),
        #         where=phi_phase_denominator != 0,
        #     )
        # )

    y_total = np.sqrt(theta_a**2 + phi_a**2)
    y_total_db = 10 * np.log10(y_total)
    y_total_db[y_total_db < db_min] = db_min
    y_theta = np.abs(theta_a)
    y_phi = np.abs(phi_a)
    if config["isDb"]:
        y_theta = 10 * np.log10(y_theta)
        y_theta[y_theta < db_min] = db_min
        y_phi = 10 * np.log10(y_phi)
        y_phi[y_phi < db_min] = db_min

    fig, ax = plt.subplots(subplot_kw={"projection": "polar"})
    assert isinstance(ax, PolarAxes)

    match config["cutPlane"], config["isDb"], config["isGainTotal"]:
        case "XY", True, True:
            ax.plot(phi, y_total_db, clip_on=False)
        case "XY", False, True:
            ax.plot(phi, y_total, clip_on=False)
        case "XY", _, False:
            ax.plot(phi, y_theta, clip_on=False)
            ax.plot(phi, y_phi, clip_on=False)
        case _, True, True:
            ax.plot(theta, y_total_db, clip_on=False)
        case _, False, True:
            ax.plot(theta, y_total, clip_on=False)
        case _:
            ax.plot(theta, y_theta, clip_on=False)
            ax.plot(theta, y_phi, clip_on=False)

    if config["isDb"]:
        r_locator = MaxNLocator(nbins=3)
        ax.set_rlim(db_min, db_max)
    else:
        lin_max = 0
        for s in config["sources"]:
            lin_max += s["amplitude"]
        r_locator = MaxNLocator(nbins=4)
        ax.set_rlim(lin_min, lin_max)
    ax.yaxis.set_major_locator(r_locator)
    ax.set_theta_zero_location("N")
    ax.set_theta_direction(-1)
    # ax.tick_params(pad=0)

    f = io.BytesIO()
    fig.savefig(f, format="svg")
    plt.close(fig)
    f.seek(0)

    peak: np.float64 = np.max(y_total_db)
    peak_idx = np.argmax(y_total_db)
    hp = np.subtract(peak, 3)

    def get_hpbw() -> int:
        hpbw = 1
        r_idx = int(peak_idx)
        while y_total_db[r_idx] >= hp:
            r_idx += 1
            if r_idx >= 360:
                r_idx = 0
            if r_idx == peak_idx:
                return 360
        l_idx = r_idx - 2
        while y_total_db[l_idx] >= hp:
            l_idx -= 1
            hpbw += 1
            if l_idx <= 0:
                l_idx = 359
        return hpbw + 1

    return int(peak_idx), get_hpbw(), f.getvalue().decode()


plot_view_plane  # pyright: ignore[reportUnusedExpression] # noqa: B018
