import streamlit as st
import time

# Configuration de la page
st.set_page_config(page_title="Iconographie Suprême", layout="wide")

# --- STYLE CSS "ARME DE GUERRE" POUR STREAMLIT ---
st.markdown("""
    <style>
    .main { background-color: #050505; color: white; }
    .stButton>button { 
        width: 100%; 
        border: 1px solid #D4AF37; 
        background-color: transparent; 
        color: #D4AF37; 
        font-family: 'Montserrat', sans-serif;
        transition: 0.3s;
    }
    .stButton>button:hover { background-color: #D4AF37; color: black; box-shadow: 0 0 15px #D4AF37; }
    .sidebar .sidebar-content { background-color: #0a0a0a; border-right: 1px solid #D4AF37; }
    h1, h2, h3 { font-family: 'Cinzel', serif; color: #D4AF37; }
    </style>
    """, unsafe_allow_html=True)

# --- INITIALISATION DE L'ÉTAT ---
if 'cart' not in st.session_state:
    st.session_state.cart = []
if 'logged_in' not in st.session_state:
    st.session_state.logged_in = False
if 'page' not in st.session_state:
    st.session_state.page = "Boutique"

# --- DONNÉES ---
products = [
    {"id": 1, "titre": "Portrait Officiel", "prix": 45, "img": "https://via.placeholder.com/400x500/111/D4AF37?text=PORTRAIT+I"},
    {"id": 2, "titre": "Moment de Prière", "prix": 35, "img": "https://via.placeholder.com/400x500/111/D4AF37?text=PRIERE"},
    {"id": 3, "titre": "Discours Solennel", "prix": 50, "img": "https://via.placeholder.com/400x500/111/D4AF37?text=DISCOURS"},
]

# --- BARRE LATÉRALE (PANIER & AUTH) ---
with st.sidebar:
    st.title("🛒 Votre Panier")
    
    # Section Authentification Google
    if not st.session_state.logged_in:
        if st.button("🔑 Connexion via Google"):
            with st.spinner("Connexion sécurisée..."):
                time.sleep(1)
                st.session_state.logged_in = True
                st.rerun()
    else:
        st.success("Connecté en tant que Membre")
        if st.button("Se déconnecter"):
            st.session_state.logged_in = False
            st.rerun()

    st.divider()

    # Liste du Panier
    if not st.session_state.cart:
        st.write("Le panier est vide.")
    else:
        total = sum(item["prix"] for item in st.session_state.cart)
        for item in st.session_state.cart:
            st.text(f"• {item['titre']} ({item['prix']}€)")
        
        st.divider()
        st.subheader(f"Total : {total} €")
        
        if st.button("💳 Passer au Paiement"):
            if st.session_state.logged_in:
                st.session_state.page = "Paiement"
                st.rerun()
            else:
                st.error("Connectez-vous avec Google pour payer.")

        if st.button("🗑️ Vider le panier"):
            st.session_state.cart = []
            st.rerun()

# --- AFFICHAGE PRINCIPAL ---
if st.session_state.page == "Boutique":
    st.title("🏛️ Iconographie Suprême")
    st.write("Collection photographique exclusive en hommage à Ali Khamenei.")
    st.divider()

    cols = st.columns(3)
    for i, p in enumerate(products):
        with cols[i % 3]:
            st.image(p["img"], use_container_width=True)
            st.subheader(p[ "titre"])
            st.write(f"Prix d'acquisition : **{p['prix']} €**")
            if st.button(f"Ajouter au panier", key=f"btn_{p['id']}"):
                st.session_state.cart.append(p)
                st.toast(f"{p['titre']} ajouté !")
                time.sleep(0.5)
                st.rerun()

elif st.session_state.page == "Paiement":
    st.title("🛡️ Paiement Sécurisé")
    if st.button("← Retour à la boutique"):
        st.session_state.page = "Boutique"
        st.rerun()

    col1, col2 = st.columns(2)
    
    with col1:
        st.markdown("### Détails de la Carte")
        nom = st.text_input("Nom du titulaire", placeholder="JEAN DUPONT")
        numero = st.text_input("Numéro de carte", placeholder="4242 4242 4242 4242")
        c1, c2 = st.columns(2)
        exp = c1.text_input("Expiration", placeholder="MM/YY")
        cvc = c2.text_input("CVC", type="password", placeholder="***")
        
    with col2:
        st.markdown("### Récapitulatif")
        total_pay = sum(item["prix"] for item in st.session_state.cart)
        st.write(f"Montant à débiter : **{total_pay} €**")
        
        if st.button("🔥 CONFIRMER L'ACQUISITION"):
            with st.status("Traitement bancaire...", expanded=True) as status:
                st.write("Cryptage SSL 256-bit...")
                time.sleep(1.5)
                st.write("Vérification des fonds...")
                time.sleep(1.5)
                status.update(label="PAIEMENT APPROUVÉ !", state="complete")
            
            st.balloons()
            st.success("Commande confirmée. Vous recevrez un certificat d'authenticité par mail.")
            st.session_state.cart = []
            time.sleep(3)
            st.session_state.page = "Boutique"
            st.rerun()
