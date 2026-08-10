const WA_NUMBER = "6285743473837"; // Format internasional tanpa angka 0 di depan

// Data Produk Bawaan
let products = JSON.parse(localStorage.getItem('tungzz_products')) || [
  {
    id: 1,
    name: "Vintage Crewneck Nike",
    price: 120000,
    category: "Jaket",
    size: "L",
    image: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=500"
  },
  {
    id: 2,
    name: "Kaos Oversize Band Vintage",
    price: 75000,
    category: "Kaos",
    size: "XL",
    image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=500"
  }
];

let cart = [];
let currentCategory = 'all';

// Load awal
window.onload = () => {
  renderProducts();
};

// Fungsi Render Produk ke Layar
function renderProducts() {
  const container = document.getElementById('product-list');
  container.innerHTML = '';

  const filtered = currentCategory === 'all' 
    ? products 
    : products.filter(p => p.category === currentCategory);

  filtered.forEach(p => {
    container.innerHTML += `
      <div class="card">
        <img src="${p.image}" alt="${p.name}">
        <div class="card-details">
          <div class="card-title">${p.name}</div>
          <div class="card-tag">${p.category} | Size: ${p.size}</div>
          <div class="card-price">Rp ${p.price.toLocaleString('id-ID')}</div>
          <button class="btn-add" onclick="addToCart(${p.id})">+ Keranjang</button>
        </div>
      </div>
    `;
  });
}

// Upload Produk Baru (Membaca file gambar)
function addNewProduct(event) {
  event.preventDefault();

  const name = document.getElementById('p-name').value;
  const price = parseInt(document.getElementById('p-price').value);
  const category = document.getElementById('p-category').value;
  const size = document.getElementById('p-size').value;
  const imageFile = document.getElementById('p-image').files[0];

  const reader = new FileReader();
  reader.onload = function(e) {
    const newProduct = {
      id: Date.now(),
      name,
      price,
      category,
      size,
      image: e.target.result // Mengubah gambar jadi data URL string
    };

    products.unshift(newProduct);
    localStorage.setItem('tungzz_products', JSON.stringify(products));
    renderProducts();
    document.getElementById('upload-form').reset();
    alert('Produk thrift berhasil ditambahkan!');
  };

  reader.readAsDataURL(imageFile);
}

// Filter Kategori
function filterCategory(cat, btn) {
  currentCategory = cat;
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  renderProducts();
}

// Toggle Modal Keranjang
function toggleCart() {
  document.getElementById('cart-modal').classList.toggle('open');
}

// Tambah ke Keranjang
function addToCart(id) {
  const item = products.find(p => p.id === id);
  cart.push(item);
  updateCart();
}

// Update Keranjang
function updateCart() {
  document.getElementById('cart-count').innerText = cart.length;
  const cartBody = document.getElementById('cart-items');
  const cartTotal = document.getElementById('cart-total');

  if (cart.length === 0) {
    cartBody.innerHTML = '<p class="empty-msg">Keranjang kamu masih kosong.</p>';
    cartTotal.innerText = 'Rp 0';
    return;
  }

  cartBody.innerHTML = '';
  let total = 0;

  cart.forEach((item, index) => {
    total += item.price;
    cartBody.innerHTML += `
      <div class="cart-item">
        <div>
          <strong>${item.name}</strong> (${item.size})<br>
          <small>Rp ${item.price.toLocaleString('id-ID')}</small>
        </div>
        <button onclick="removeFromCart(${index})" style="background:none; border:none; color:#f43f5e; cursor:pointer;">Hapus</button>
      </div>
    `;
  });

  cartTotal.innerText = `Rp ${total.toLocaleString('id-ID')}`;
}

function removeFromCart(index) {
  cart.splice(index, 1);
  updateCart();
}

// Checkout Otomatis ke WA
function checkoutWA() {
  if (cart.length === 0) {
    alert("Keranjang kamu kosong!");
    return;
  }

  let text = "Halo *Tungzzthriftsecond*, saya mau order barang berikut:\n\n";
  let total = 0;

  cart.forEach((item, i) => {
    text += `${i + 1}. *${item.name}* (Size: ${item.size}) - Rp ${item.price.toLocaleString('id-ID')}\n`;
    total += item.price;
  });

  text += `\n*Total Harga:* Rp ${total.toLocaleString('id-ID')}`;
  text += `\n\nApakah stok item di atas masih ready?`;

  const waUrl = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(text)}`;
  window.open(waUrl, '_blank');
}
