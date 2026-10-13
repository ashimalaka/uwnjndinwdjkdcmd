from pathlib import Path

import pandas as pd
import streamlit as st

COMPONENTS = [
    {
        "id": 1,
        "outer": "Casing / Rumah Instrumen",
        "inner": ["Tutup atas", "Pintu ruang atomisasi", "Panel depan", "Sisi kiri-kanan"],
        "fn": "Melindungi komponen optik, mekanik, dan atomizer serta menjaga stabilitas operasional alat.",
    },
    {
        "id": 2,
        "outer": "Hollow Cathode Lamp (HCL)",
        "inner": ["Katoda berongga", "Anoda", "Soket lampu", "Gas pengisi (Ne/Ar)", "Kabel power"],
        "fn": "Menghasilkan radiasi pada panjang gelombang spesifik unsur target, misalnya Cu 324.7 nm.",
    },
    {
        "id": 3,
        "outer": "Sample Tray / Rak Sampel",
        "inner": ["Vial blanko", "Vial standar", "Vial sampel", "Pengunci vial"],
        "fn": "Tempat larutan blanko, standar, dan sampel yang akan diaspirasikan ke sistem nebulizer.",
    },
    {
        "id": 4,
        "outer": "Nebulizer",
        "inner": ["Kapiler hisap", "Nosel venturi", "Baffle / impact bead", "Selang aspirasi"],
        "fn": "Mengubah larutan menjadi aerosol halus dan menghisapnya ke dalam aliran gas.",
    },
    {
        "id": 5,
        "outer": "Spray Chamber",
        "inner": ["Ruangan semprot", "Flow spoiler", "Saluran drain", "Filter aerosol"],
        "fn": "Menyaring droplet besar, menstabilkan aerosol, dan memusatkan partikel ke burner.",
    },
    {
        "id": 6,
        "outer": "Burner Head / Kepala Pembakar",
        "inner": ["Slot burner", "Leher burner", "Keluar gas", "Penopang burner"],
        "fn": "Tempat nyala pembakaran terbentuk untuk atomisasi unsur dalam larutan sampel.",
    },
    {
        "id": 7,
        "outer": "Gas Supply / Sistem Gas",
        "inner": ["Selang udara", "Selang asetilena", "Regulator gas", "Katup kontrol aliran"],
        "fn": "Menyuplai oxidant dan bahan bakar untuk pembentukan nyala atomisasi yang stabil.",
    },
    {
        "id": 8,
        "outer": "Flame / Nyala Api",
        "inner": ["Zona primer", "Zona interkonal", "Zona sekunder", "Panjang nyala"],
        "fn": "Membentuk atom bebas dari unsur yang dianalisis untuk menyerap radiasi lampu sumber.",
    },
    {
        "id": 9,
        "outer": "Optical Path / Jalur Optik",
        "inner": ["Lensa kolimator", "Cermin pemantul", "Pintu optik", "Jalur cahaya"],
        "fn": "Mengarahkan pancaran cahaya dari lampu ke flame dan kemudian ke monokromator.",
    },
    {
        "id": 10,
        "outer": "Monokromator",
        "inner": ["Celah masuk", "Cermin kolimator", "Kisi difraksi", "Cermin fokus", "Celah keluar"],
        "fn": "Memilih panjang gelombang tertentu dan membuang spektrum lain agar sinyal yang dideteksi relevan.",
    },
    {
        "id": 11,
        "outer": "Detector / PMT",
        "inner": ["Fotokatoda", "Dinoda", "Anoda", "Casing detektor"],
        "fn": "Mengubah intensitas cahaya yang lolos dari monokromator menjadi sinyal listrik.",
    },
    {
        "id": 12,
        "outer": "Amplifier / Penguat Sinyal",
        "inner": ["Penguat sinyal", "Filter sinyal", "Konverter analog-ke-digital"],
        "fn": "Memperkuat sinyal detektor agar dapat dibaca secara akurat oleh perangkat lunak.",
    },
    {
        "id": 13,
        "outer": "Display / Monitor",
        "inner": ["Layar monitor", "Display absorbansi", "Grafik transmittance", "Nilai konsentrasi"],
        "fn": "Menampilkan hasil pengukuran, kurva kalibrasi, dan parameter operasi alat.",
    },
    {
        "id": 14,
        "outer": "Exhaust / Saluran Buang",
        "inner": ["Hood pembuangan", "Duct ventilasi", "Kipas hisap", "Filtrasi gas buang"],
        "fn": "Membuang gas hasil pembakaran, residu sampel, dan uap berbahaya agar aman bagi operator.",
    },
    {
        "id": 15,
        "outer": "Waste Bottle / Botol Limbah",
        "inner": ["Tangki limbah cair", "Saluran drain", "Sekat penampung akhir"],
        "fn": "Menampung larutan yang tidak teratomisasi atau sisa sampel dari sistem aspirasi.",
    },
]


def render(runs, params):
    st.caption("Simulasi alat AAS: komponen utama dan hasil pengukuran")
    if not runs:
        st.info("Data masih kosong.")
        return

    st.markdown("### Viewer 3D AAS")
    try:
        viewer_path = Path(__file__).resolve().parents[1] / "aas3d.html"
        html = viewer_path.read_text(encoding="utf-8")
        st.components.v1.html(html, height=760, scrolling=False)
    except Exception as exc:
        st.warning(f"Viewer 3D gagal dimuat: {exc}")

    df = pd.DataFrame(runs)
    st.dataframe(df, hide_index=True)
    st.json({"parameter": params})

    st.markdown("### Daftar kompartemen AAS yang ada secara rinci")
    comp_df = pd.DataFrame(
        [
            {
                "No": c["id"],
                "Nama kompartemen": c["outer"],
                "Nama bagian dalam": "; ".join(c["inner"]),
                "Fungsi utama": c["fn"],
            }
            for c in COMPONENTS
        ]
    )
    st.dataframe(comp_df, hide_index=True, use_container_width=True)

    with st.expander("Lihat daftar nama kompartemen AAS"):
        for item in COMPONENTS:
            st.markdown(
                f"**{item['id']}. {item['outer']}**\n"
                f"- Bagian dalam: {', '.join(item['inner'])}\n"
                f"- Fungsi: {item['fn']}"
            )

    st.caption("Model 3D skematik untuk pembelajaran. Garis 324,7 nm adalah UV (tak terlihat), berkasnya divisualisasikan ungu.")

    st.session_state["aas_components"] = COMPONENTS


"""
Catatan:
- Kompartemen di sini mencakup komponen utama yang biasa ada pada AAS flame, termasuk lampu, nebulizer,
  spray chamber, burner, nyala, monokromator, detector, sistem gas, exhaust, dan botol limbah.
- Penamaan yang lebih rinci ini dibuat agar viewer dan halaman instrumen jelas mencantumkan tiap bagian.
"""
