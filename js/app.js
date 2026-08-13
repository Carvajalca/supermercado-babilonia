/* ==========================================================
   SUPERMERCADO BABILONIA
   app.js - Versión 2
   Autor: ChatGPT + Carlos
========================================================== */

/* =========================
   BASE DE PRODUCTOS
========================= */

const products = [
  {
    id: 1,
    name: "Arroz",
    brand: "Roa",
    presentation: "Libra",
    price: 3000,
    image: "assets/products/arroz-roa.png"
  },
  {
    id: 2,
    name: "Arroz",
    brand: "Diana",
    presentation: "Media libra",
    price: 1800,
    image: "assets/products/arroz-diana.png"
  },
  {
    id: 3,
    name: "Huevos",
    brand: "Kikes",
    presentation: "30 unidades",
    price: 14500,
    image: "assets/products/huevos-kikes.png"
  },
  {
    id: 4,
    name: "Arepas",
    brand: "Blanca",
    presentation: "5 unidades",
    price: 6200,
    image: "assets/products/arepa-blanca.png"
  },
  {
    id: 5,
    name: "Arepas",
    brand: "Chócolo",
    presentation: "6 unidades",
    price: 6500,
    image: "assets/products/arepa-chocolo.png"
  }
];

/* =========================
   VARIABLES GLOBALES
========================= */

let cart = [];

const productList = document.getElementById("productList");
const searchInput = document.getElementById("searchInput");

/* =========================
   FORMATO PESOS COLOMBIANOS
========================= */

function formatPrice(value) {
  return value.toLocaleString("es-CO");
}

/* =========================
   RENDER PRODUCTOS
========================= */

function renderProducts(list = products) {

  productList.innerHTML = "";

  list.forEach(product => {

    const item = cart.find(p => p.id === product.id);
    const qty = item ? item.qty : 0;

    productList.innerHTML += `
      <div class="product">

        <img
          src="${product.image}"
          alt="${product.name}"
        >

        <div class="product-info">

          <h4>${product.name}</h4>

          <p>${product.brand} · ${product.presentation}</p>

          <div class="price">
            $${formatPrice(product.price)}
          </div>

          <div class="qty">

            <button
              class="minus"
              onclick="changeQty(${product.id},-1)"
            >
              −
            </button>

            <strong>${qty}</strong>

            <button
              class="plus"
              onclick="changeQty(${product.id},1)"
            >
              +
            </button>

          </div>

        </div>

      </div>
    `;
  });

}

/* =========================
   AGREGAR / QUITAR
========================= */

function changeQty(id, value) {

  const product = products.find(p => p.id === id);

  let item = cart.find(p => p.id === id);

  if (!item && value > 0) {

    cart.push({
      ...product,
      qty: 1
    });

  } else if (item) {

    item.qty += value;

    if (item.qty <= 0) {
      cart = cart.filter(p => p.id !== id);
    }

  }

  renderProducts(filterProducts(searchInput.value));
  updateCart();

}

/* =========================
   ACTUALIZAR CARRITO
========================= */

function updateCart() {

  const totalItems = cart.reduce((a, b) => a + b.qty, 0);

  const total = cart.reduce((a, b) => a + (b.qty * b.price), 0);

  document.getElementById("cartCounter").textContent = totalItems;

  document.getElementById("itemsCart").textContent =
    `${totalItems} producto(s)`;

  document.getElementById("totalCart").textContent =
    `$${formatPrice(total)}`;

  document.getElementById("cartTotalModal").textContent =
    `$${formatPrice(total)}`;

  renderCartItems();

}

/* =========================
   MODAL DEL PEDIDO
========================= */

function renderCartItems() {

  const container = document.getElementById("cartItems");

  if (cart.length === 0) {

    container.innerHTML = `
      <div style="padding:30px;text-align:center;color:#777;">
        <h3>🛒 Tu carrito está vacío</h3>
        <p>Agrega algunos productos para comenzar.</p>
      </div>
    `;

    return;
  }

  container.innerHTML = "";

  cart.forEach(item => {

    container.innerHTML += `

      <div class="cart-item">

        <div>

          <strong>${item.qty} × ${item.name}</strong>

          <p>${item.brand} · ${item.presentation}</p>

        </div>

        <strong>
          $${formatPrice(item.qty * item.price)}
        </strong>

      </div>

    `;

  });

}

/* =========================
   BUSCADOR INTELIGENTE
========================= */

const aliases = {
  arro: "arroz",
  arroz: "arroz",
  huev: "huevos",
  huevo: "huevos",
  arep: "arepas",
  chocolo: "chócolo",
  blanca: "blanca",
  roa: "roa",
  diana: "diana"
};

function filterProducts(text) {

  text = text.toLowerCase().trim();

  if (aliases[text]) {
    text = aliases[text];
  }

  return products.filter(product => {

    const data = `
      ${product.name}
      ${product.brand}
      ${product.presentation}
    `.toLowerCase();

    return data.includes(text);

  });

}

searchInput.addEventListener("input", () => {

  renderProducts(
    filterProducts(searchInput.value)
  );

});

/* =========================
   CARRUSEL AUTOMÁTICO
========================= */

const track = document.getElementById("carouselTrack");
const dots = document.querySelectorAll(".dots span");

let currentSlide = 0;

function moveCarousel(index) {

  currentSlide = index;

  track.style.transform =
    `translateX(-${index * 100}%)`;

  dots.forEach(dot =>
    dot.classList.remove("active")
  );

  dots[index].classList.add("active");

}

setInterval(() => {

  currentSlide++;

  if (currentSlide > 2) currentSlide = 0;

  moveCarousel(currentSlide);

}, 4500);

/* =========================
   MODAL
========================= */

const modal = document.getElementById("cartModal");

document.getElementById("floatingCart").onclick = () => {
  modal.classList.remove("hidden");
};

document.getElementById("openCart").onclick = () => {
  modal.classList.remove("hidden");
};

document.querySelector(".close-btn").onclick = () => {
  modal.classList.add("hidden");
};

document.querySelector(".back-btn").onclick = () => {
  modal.classList.add("hidden");
};

/* Cerrar tocando el fondo */

modal.addEventListener("click", (e) => {

  if (e.target === modal) {
    modal.classList.add("hidden");
  }

});

/* =========================
   INICIALIZAR APP
========================= */

renderProducts();
updateCart();