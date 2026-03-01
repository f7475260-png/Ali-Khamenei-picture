import streamlit as st

# Configuration de la page
st.set_page_config(page_title="Iconographie Suprême", layout="wide")

# --- STYLE PERSONNALISÉ ---
st.markdown("""
    <style>
    .main { background-color: #fdfdfd; }
    .stButton>button { width: 100%; border-radius: 0; background-color: #1a1a1a; color: white; }
    .stButton>button:hover { background-color: #c5a059; color: white; }
    </style>
    """, unsafe_allow_html=True)

# --- DONNÉES DES PRODUITS ---
products = [
    {"id": 1, "titre": "Portrait Officiel", "prix": 45, "img": "https://via.placeholder.com/300x400"},
    {"id": 2, "titre": "Moment de Prière", "prix": 35, "img": "https://via.placeholder.com/300x400"},
    {"id": 3, "titre": "Discours Solennel", "prix": 50, "img": "https://via.placeholder.com/300x400"},
]

# --- LOGIQUE DU PANIER ---
if 'cart' not in st.session_state:
    st.session_state.cart = []

# --- HEADER ---
st.title("🏛️ Iconographie Suprême")
st.write("Collection photographique en hommage à Ali Khamenei.")
st.divider()

# --- AFFICHAGE DES PRODUITS ---
cols = st.columns(3)

for i, p in enumerate(products):
    with cols[i % 3]:
        st.image(p["img"], use_container_width=True)
        st.subheader(p["titre"])
        st.write(f"Prix : **{p['prix']} €**")
        if st.button(f"Ajouter au panier", key=p["id"]):
            st.session_state.cart.append(p)
            st.success(f"{p['titre']} ajouté !")

# --- SIDEBAR (PANIER) ---
st.sidebar.title("🛒 Votre Panier")
if not st.session_state.cart:
    st.sidebar.write("Le panier est vide.")
else:
    total = sum(item["prix"] for item in st.session_state.cart)
    for item in st.session_state.cart:
        st.sidebar.text(f"• {item['titre']} ({item['prix']}€)")
    st.sidebar.divider()
    st.sidebar.write(f"**Total : {total} €**")
    if st.sidebar.button("Vider le panier"):
        st.session_state.cart = []
        st.rerun()
