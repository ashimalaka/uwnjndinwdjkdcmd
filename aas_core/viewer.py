import pandas as pd
import streamlit as st


COMPONENTS = [
    {"id": 1, "outer": "Lamp housing", "inner": ["HCL Cu lamp", "power supply"], "fn": "Emit light at 324.7 nm"},
    {"id": 2, "outer": "Nebulizer chamber", "inner": ["spray chamber", "aerosol capillary"], "fn": "Aspirasi sampel"},
    {"id": 3, "outer": "Burner head", "inner": ["air-acetylene flame", "slot burner"], "fn": "Atomisasi Cu"},
    {"id": 4, "outer": "Monochromator", "inner": ["grating", "slit"], "fn": "Seleksi panjang gelombang"},
    {"id": 5, "outer": "Detector PMT", "inner": ["PMT", "amplifier"], "fn": "Mendeteksi intensitas"},
]


def render(runs, params):
    st.caption("Simulasi alat AAS: komponen utama dan hasil pengukuran")
    if not runs:
        st.info("Data masih kosong.")
        return
    df = pd.DataFrame(runs)
    st.dataframe(df, hide_index=True)
    st.json({"parameter": params})
