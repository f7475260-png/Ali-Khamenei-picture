// 1. Catalogue de produits
const products = [
    { id: 1, title: "Portrait Officiel", category: "portrait", price: 45, desc: "Tirage argentique haute qualité.", img: "https://via.placeholder.com/300x400?text=Portrait+1" },
    { id: 2, title: "Moment de Prière", category: "evenement", price: 35, desc: "Scène symbolique de recueillement.", img: "https://via.placeholder.com/300x400?text=Priére" },
    { id: 3, title: "Discours Solennel", category: "evenement", price: 50, desc: "Capture d'un discours public historique.", img: "https://via.placeholder.com/300x400?text=Discours" },
    { id: 4, title: "Regard Serein", category: "portrait", price: 40, desc: "Gros plan détaillé, éclairage naturel.", img: "https://via.placeholder.com/300x400?text=Regard" },
    { id: 5, title: "Rencontre Diplomatique", category: "evenement", price: 55, desc: "Photo d'archive en noir et blanc.", img: "https://via.placeholder.com/300x400?text=Archive" },
    { id: 6, title: "Sagesse et Étude", category: "portrait", price: 38, desc: "Portrait dans une bibliothèque.", img: "https://via.placeholder.com/300x400?text=Etude" },
];

// 2. Gestion du Panier (localStorage)
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
    updateUI();
    if (document.getElementById('product-grid')) renderProducts(products);
    if (document.getElementById('cart-table')) renderCart();
    if (document.getElementById('welcome-user')) {
        document.getElementById('welcome-user').innerText = currentUser ? `Bienvenue, ${currentUser.firstName}` : "";
    }
});

function updateUI() {
    const cartCount = document.getElementById('cart-count');
    if (cartCount) cartCount.innerText = cart.length;
    
    const authLink = document.getElementById('auth-link');
    if (authLink && currentUser) {
        authLink.innerHTML = `<a href="#" onclick="logout()">${currentUser.firstName} (Déconnexion)</a>`;
    }
}

// 3. Fonctions Boutique
function renderProducts(items) {
    const grid = document.getElementById('product-grid');
    grid.innerHTML = items.map(p => `
        <div class="product-card">
            <img src="${p.img}" alt="${p.title}">
            <h3>${p.title}</h3>
            <p>${p.desc}</p>
            <p class="price">${p.price} €</p>
            <button class="btn-add" onclick="addToCart(${p.id})">Ajouter au panier</button>
        </div>
    `).join('');
}

function filterProducts(cat) {
    const filtered = cat === 'tous' ? products : products.filter(p => p.category === cat);
    renderProducts(filtered);
}

function addToCart(id) {
    const product = products.find(p => p.id === id);
    cart.push(product);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateUI();
    alert("Photo ajoutée au panier !");
}

// 4. Fonctions Panier
function renderCart() {
    const table = document.getElementById('cart-table');
    const totalEl = document.getElementById('cart-total');
    if (cart.length === 0) {
        table.innerHTML = "<tr><td colspan='4'>Votre panier est vide.</td></tr>";
        totalEl.innerText = "0";
        return;
    }
    
    let total = 0;
    table.innerHTML = cart.map((item, index) => {
        total += item.price;
        return `
            <tr>
                <td>${item.title}</td>
                <td>1</td>
                <td>${item.price} €</td>
                <td><button onclick="removeFromCart(${index})">Supprimer</button></td>
            </tr>
        `;
    }).join('');
    totalEl.innerText = total;
}

function removeFromCart(index) {
    cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    renderCart();
    updateUI();
}

function goToCheckout() {
    if (!currentUser) {
        alert("Vous devez être connecté pour commander.");
        window.location.href = "auth.html";
    } else {
        window.location.href = "checkout.html";
    }
}

// 5. Authentification (Simulée)
function handleSignup(e) {
    e.preventDefault();
    const user = {
        firstName: e.target.firstName.value,
        email: e.target.email.value,
        password: e.target.password.value // En prod, ne jamais stocker en clair !
    };
    localStorage.setItem('registeredUser', JSON.stringify(user));
    alert("Compte créé ! Connectez-vous.");
    showLogin();
}

function handleLogin(e) {
    e.preventDefault();
    const registered = JSON.parse(localStorage.getItem('registeredUser'));
    if (registered && registered.email === e.target.email.value && registered.password === e.target.password.value) {
        localStorage.setItem('currentUser', JSON.stringify(registered));
        window.location.href = "index.html";
    } else {
        alert("Identifiants incorrects.");
    }
}

function logout() {
    localStorage.removeItem('currentUser');
    window.location.reload();
}

// Simulation paiement
function processPayment(e) {
    e.preventDefault();
    alert("Paiement validé ! Merci pour votre commande.");
    localStorage.removeItem('cart');
    window.location.href = "index.html";
}
