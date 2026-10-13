# -*- coding: utf-8 -*-
"""Penetapan Kadar Tembaga (Cu) dengan AAS - aplikasi Streamlit (entry point)."""
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))

import streamlit as st

from aas_views import analisis, instrumen, prosedur, teori

st.set_page_config(
    page_title="Kadar Cu dengan AAS",
    page_icon="🔬",
    layout="wide",
    initial_sidebar_state="expanded",
)

# Styling agar tampilan lebih rapi dan modern
st.markdown(
    """
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

        html, body, [class*="css"] {
            font-family: 'Inter', sans-serif;
            background: #07121f;
        }

        .stApp {
            background: linear-gradient(180deg, #07121f 0%, #0b1727 100%);
        }

        [data-testid="stSidebar"] {
            background: linear-gradient(180deg, #0d1d2c 0%, #0a1320 100%);
            border-right: 1px solid rgba(148, 163, 184, 0.2);
        }

        .block-container {
            padding-top: 1.25rem;
            padding-bottom: 2rem;
        }

        .stTabs [data-baseweb="tab-list"] {
            gap: 0.5rem;
            background: rgba(15, 23, 42, 0.85);
            border-radius: 12px;
            padding: 0.3rem;
            border: 1px solid rgba(148, 163, 184, 0.12);
        }

        .stTabs [data-baseweb="tab"] {
            height: 3rem;
            border-radius: 10px;
            color: #dbeafe;
            font-weight: 600;
        }

        .stTabs [aria-selected="true"] {
            background: linear-gradient(90deg, #0ea5e9, #2563eb);
            color: white;
            box-shadow: 0 8px 22px rgba(37, 99, 235, 0.35);
        }

        .sidebar-button {
            margin-top: 0.7rem;
        }

        div[data-testid="stHorizontalBlock"] > div {
            gap: 0.7rem;
        }
    </style>
    """,
    unsafe_allow_html=True,
)

PAGES = {
    "📖 Teori": teori.render,
    "🧊 Instrumen": instrumen.render,
    "📊 Analisis": analisis.render,
    "🧪 Prosedur": prosedur.render,
}

with st.sidebar:
    st.markdown(
        """
        <div style='padding: 0.6rem 0.25rem 0.5rem 0.25rem;'>
            <div style='font-size: 1.3rem; font-weight: 800; color: #e2e8f0;'>AAS LAB</div>
            <div style='font-size: 0.8rem; color: #93c5fd; margin-top: 0.2rem;'>Penetapan Kadar Cu</div>
        </div>
        """,
        unsafe_allow_html=True,
    )

    st.caption("Navigasi modul")
    page = st.radio("Pilih halaman", list(PAGES.keys()), index=1, label_visibility="collapsed")

    st.divider()

    st.caption("Ringkasan")
    st.info("Praktikum AAS untuk analisis Cu menggunakan pendekatan pembelajaran interaktif.")

    if st.button("Reset data sesi", use_container_width=True):
        for key in ["runs", "params"]:
            st.session_state.pop(key, None)
        st.success("Data sesi berhasil direset.")

st.markdown(
    """
    <div style='padding: 0.2rem 0 1rem 0;'>
        <h1 style='margin:0; color:#f8fafc; font-size:2.2rem;'>🔬 Penetapan Kadar Tembaga (Cu) dengan AAS</h1>
        <p style='margin-top:0.5rem; color:#cbd5e1; font-size:1.05rem;'>
            Atomic Absorption Spectrophotometry — media belajar interaktif
        </p>
    </div>
    """,
    unsafe_allow_html=True,
)

PAGES[page]()
