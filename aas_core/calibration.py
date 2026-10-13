import numpy as np


def mean_sd_ci(values):
    arr = np.asarray(values, dtype=float)
    if arr.size == 0:
        return 0.0, 0.0, 0.0
    m = float(arr.mean())
    sd = float(arr.std(ddof=1)) if arr.size > 1 else 0.0
    ci = 1.96 * sd / np.sqrt(arr.size) if arr.size > 1 else 0.0
    return m, sd, ci


def fit(x, y):
    x = np.asarray(x, dtype=float)
    y = np.asarray(y, dtype=float)
    if x.size < 2:
        raise ValueError("Minimal 2 titik untuk regresi.")
    m, b = np.polyfit(x, y, 1)
    y_hat = m * x + b
    ss_res = float(np.sum((y - y_hat) ** 2))
    ss_tot = float(np.sum((y - y.mean()) ** 2))
    r2 = 1.0 - ss_res / ss_tot if ss_tot else 1.0
    r = float(np.corrcoef(x, y)[0, 1]) if x.size > 1 else 1.0
    return {
        "m": float(m),
        "b": float(b),
        "x": x,
        "y": y,
        "r2": float(r2),
        "r": float(r),
        "res": y - y_hat,
    }


def limits(f, blk_sd=None):
    sd = float(blk_sd) if blk_sd is not None else 0.01
    slope = abs(float(f["m"]))
    lod = 3.0 * sd / slope if slope else 0.0
    loq = 10.0 * sd / slope if slope else 0.0
    return lod, loq


def char_conc(f):
    slope = abs(float(f["m"]))
    return 1.0 / slope if slope else 0.0


def conc(f, A):
    arr = np.asarray(A, dtype=float)
    return (arr - float(f["b"])) / float(f["m"]) if float(f["m"]) else arr * 0.0


def kadar(cs, vol, fp, massa):
    arr = np.asarray(cs, dtype=float)
    return (arr * float(vol) * float(fp)) / float(massa) if float(massa) else arr * 0.0
