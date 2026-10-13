import numpy as np


LINES = [324.7, 327.4, 510.5]


def measure(conc, params, rng=None):
    rng = np.random.default_rng() if rng is None else rng
    m = 0.18
    b = 0.01
    base = m * float(conc) + b
    noise = rng.normal(0.0, 0.006, 3)
    vals = np.clip(base + noise, 0.0, None)
    return [float(v) for v in vals]


def readout(absorbance):
    a = float(absorbance)
    if a < 0:
        a = 0.0
    i0 = 1.0
    it = i0 * (10 ** (-a))
    transmittance = (it / i0) * 100.0
    return {"T": float(transmittance), "It": float(it), "I0": float(i0)}
