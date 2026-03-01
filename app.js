// --- CONFIGURATION FIREBASE ---
const firebaseConfig = {
    apiKey: "VOTRE_API_KEY",
    authDomain: "VOTRE_ID.firebaseapp.com",
    projectId: "VOTRE_ID",
    storageBucket: "VOTRE_ID.appspot.com",
    messagingSenderId: "VOTRE_SENDER_ID",
    appId: "VOTRE_APP_ID"
};

// Initialisation (si on utilise Firebase)
if (typeof firebase !== 'undefined') {
    firebase.initializeApp(firebaseConfig);
    var auth = firebase.auth();
    var provider = new firebase.auth.GoogleAuthProvider();
}

// --- DONNÉES DU CATALOGUE ---
const products = [
    { id: 1, title: "Sagesse Éternelle", category: "portrait", price: 65, img: "https://via.placeholder.com/600x800/111/D4AF37?text=PORTRAIT+I" },
    { id: 2, title: "L'Unité", category: "evenement", price: 45, img: "https://via.placeholder.com/600x800/111/D4AF37?text=EVENT+I" },
    { id: 3, title: "Regard Visionnaire", category: "portrait", price: 75, img: "https://via.placeholder.com/600x800/111/D4AF37?text=PORTRAIT+II" },
    { id: 4, title: "Le Discours", category: "evenement", price: 55, img: "https://via.placeholder.com/600x800/111/D4AF37?text=EVENT+II" },
    { id: 5, title: "Moment de Paix", category: "portrait", price: 50, img: "https://via.placeholder.com/600x800/111/D4AF37?text=PORTRAIT+III" },
    { id: 6, title: "Héritage", category: "evenement", price: 80, img: "https://via.placeholder.com/600x800/111/D4AF37?text=EVENT+III" }
];

// --- ÉTAT GLOBAL ---
let cart = JSON.parse(localStorage.getItem('war_cart')) || [];

// --- INITIALISATION ---
document.addEventListener('DOMContentLoaded', () => {
    renderUI();
    if (document.getElementById('product-grid')) renderProducts(products);
    if (document.getElementById('cart-table')) renderCart();
});

// --- FONCTIONS BOUTIQUE ---
function renderProducts(items) {
    const grid = document.getElementById('product-grid');
    grid.innerHTML = items.map(p => `
        <div class="product-card fade-in">
            <img src="${p.img}" alt="${p.title}" loading="lazy">
            <div class="card-body">
                <h3>${p.title}</h3>
                <p class="price">${p.price} €</p>
                <button class="btn-add" onclick="addToCart(${p.id})">Acquérir cette pièce</button>
            </div>
        </div>
    `).join('');
}

function filterProducts(cat) {
    const filtered = cat === 'tous' ? products : products.filter(p => p.category === cat);
    renderProducts(filtered);
    
    // UI Active state
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.toggle('active', btn.innerText.toLowerCase() === cat);
    });
}

function addToCart(id) {
    const p = products.find(prod => prod.id === id);
    cart.push(p);
    saveCart();
    showToast(`${p.title} ajouté au panier`);
}

function saveCart() {
    localStorage.setItem('war_cart', JSON.stringify(cart));
    renderUI();
}

function renderUI() {
    const count = document.getElementById('cart-count');
    if (count) count.innerText = cart.length;
}

// --- GESTION PANIER ---
function renderCart() {
    const table = document.getElementById('cart-table');
    const totalEl = document.getElementById('cart-total');
    if (cart.length === 0) {
        table.innerHTML = "<tr><td colspan='4' style='text-align:center'>Votre collection est vide.</td></tr>";
        return;
    }

    let total = 0;
    table.innerHTML = cart.map((item, index) => {
        total += item.price;
        return `
            <tr>
                <td><strong>${item.title}</strong></td>
                <td>1</td>
                <td>${item.price} €</td>
                <td><button onclick="removeItem(${index})" class="filter-btn">Retirer</button></td>
            </tr>
        `;
    }).join('');
    totalEl.innerText = total + " €";
}

function removeItem(index) {
    cart.splice(index, 1);
    saveCart();
    renderCart();
}

// --- AUTHENTIFICATION ---
const loginBtn = document.getElementById('google-login');
if (loginBtn) {
    loginBtn.addEventListener('click', () => {
        auth.signInWithPopup(provider).then(result => {
            showToast(`Accès autorisé : ${result.user.displayName}`);
            location.reload();
        });
    });
}

auth.onAuthStateChanged(user => {
    if (user && document.getElementById('auth-zone')) {
        document.getElementById('auth-zone').innerHTML = `
            <div class="user-profile">
                <img src="${user.photoURL}" class="avatar">
                <span>${user.displayName.split(' ')[0]}</span>
                <button onclick="auth.signOut()" style="background:none; border:none; color:var(--accent); cursor:pointer">Quitter</button>
            </div>
        `;
    }
});

// --- UTILITAIRES ---
function showToast(text) {
    Toastify({
        text: text,
        duration: 3000,
        gravity: "bottom",
        position: "right",
        style: { background: "linear-gradient(to right, #D4AF37, #000)", color: "white" }
    }).showToast();
}

function processPayment(e) {
    e.preventDefault();
    showToast("Transaction en cours...");
    setTimeout(() => {
        alert("Commande confirmée. Vous recevrez un mail de confirmation.");
        cart = [];
        saveCart();
        window.location.href = "index.html";
    }, 2000);
}
// --- LOGIQUE INTERACTIVE DE LA CARTE ---
const cardNameInput = document.getElementById('card-name');
const cardNumberInput = document.getElementById('card-number');
const cardExpiryInput = document.getElementById('card-expiry');

if (cardNameInput) {
    // Mise à jour du nom
    cardNameInput.addEventListener('input', (e) => {
        document.getElementById('display-name').innerText = e.target.value.toUpperCase() || "NOM COMPLET";
    });

    // Formatage et mise à jour du numéro
    cardNumberInput.addEventListener('input', (e) => {
        let value = e.target.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
        let formattedValue = "";
        for (let i = 0; i < value.length; i++) {
            if (i > 0 && i % 4 === 0) formattedValue += " ";
            formattedValue += value[i];
        }
        e.target.value = formattedValue;
        document.getElementById('display-number').innerText = formattedValue || "#### #### #### ####";
    });

    // Formatage de la date (MM/YY)
    cardExpiryInput.addEventListener('input', (e) => {
        let value = e.target.value.replace(/[^0-9]/gi, '');
        if (value.length > 2) {
            value = value.substring(0, 2) + '/' + value.substring(2, 4);
        }
        e.target.value = value;
        document.getElementById('display-expiry').innerText = value || "MM/YY";
    });
}

// --- SIMULATION DE PAIEMENT "GUERRE" ---
function processPayment(e) {
    e.preventDefault();
    const btn = document.getElementById('pay-button');
    
    // 1. Validation de base
    const cardNumber = cardNumberInput.value.replace(/\s/g, '');
    if (cardNumber.length < 16) {
        showToast("Numéro de carte invalide", "error");
        return;
    }

    // 2. Effet visuel de traitement
    btn.disabled = true;
    btn.innerText = "CRYPTAGE EN COURS...";
    
    setTimeout(() => {
        btn.innerText = "AUTHENTIFICATION BANCAIRE...";
        setTimeout(() => {
            // Succès
            showToast("PAIEMENT APPROUVÉ", "success");
            localStorage.removeItem('war_cart'); // Vide le panier
            
            // Redirection vers confirmation
            setTimeout(() => {
                alert("Acquisition confirmée. Votre pièce iconographique sera expédiée sous 24h.");
                window.location.href = "index.html";
            }, 1500);
        }, 2000);
    }, 1500);
}
