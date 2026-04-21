// 1. DATA MASTER & SISTEM KEAMANAN
let isAdmin = false;
let currentSlideIndex = 0;
let activeImages = [];

let products = JSON.parse(localStorage.getItem('keongStoreData')) || [
    {
        id: 1,
        name: "Laptop Gaming",
        category: "gaming",
        price: "Rp 12.000.000",
        stock: "15 Pcs",
        size: "N/A",
        desc: "Laptop gaming murah dengan spesifikasi mumpuni.",
        img: ["laptop gaming.jpg"] // Format array untuk slider
    }
];

function saveToStorage() {
    localStorage.setItem('keongStoreData', JSON.stringify(products));
}

// FUNGSI LOGIN ADMIN
function loginAdmin() {
    const pass = prompt("Masukkan Password Admin:");
    if (pass === "keong14253647") {
        isAdmin = true;
        document.getElementById('adminStatus').innerHTML = '<i class="fas fa-user-shield"></i> Mode Admin (Aktif)';
        document.getElementById('adminArea').style.display = "block";
        alert("Akses Admin Diterima!");
        displayProducts(products);
    } else {
        alert("Password Salah!");
    }
}

// 2. TAMPILKAN PRODUK
function displayProducts(data) {
    const katalog = document.getElementById('katalog');
    if (!katalog) return;
    katalog.innerHTML = ""; 

    data.forEach(product => {
        // Ambil foto pertama untuk tampilan depan
        const coverImg = Array.isArray(product.img) ? product.img[0] : product.img;

        katalog.innerHTML += `
            <div class="product-card" onclick="openModal(${product.id})">
                <div class="badge">${product.category.toUpperCase()}</div>
                <img src="${coverImg}" onerror="this.src='https://via.placeholder.com/300x200?text=No+Image'">
                <div class="product-info">
                    <span class="price">${product.price}</span>
                    <h3>${product.name}</h3>
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 10px;">
                        <span class="tag">${product.category}</span>
                        ${isAdmin ? `
                        <button onclick="event.stopPropagation(); deleteProduct(${product.id})" style="background:none; border:none; color:#ff4d4d; cursor:pointer;">
                            <i class="fas fa-trash"></i>
                        </button>` : ''}
                    </div>
                </div>
            </div>
        `;
    });
}

// 3. TAMBAH BARANG (MULTIPLE IMAGES)
async function addNewProduct() {
    const name = document.getElementById('prodName').value;
    const rawPrice = document.getElementById('prodPrice').value;
    const desc = document.getElementById('prodDesc').value;
    const fileInput = document.getElementById('prodImage');
    const uploadedImages = [];

    if (!name || !rawPrice || !desc) return alert("Lengkapi data barang!");

    if (fileInput.files.length > 0) {
        for (let file of fileInput.files) {
            const base64 = await toBase64(file);
            uploadedImages.push(base64);
        }
    } else {
        uploadedImages.push("produk1.jpg");
    }

    const newProd = {
        id: Date.now(),
        name: name,
        category: document.getElementById('prodCategory').value,
        price: "Rp " + parseInt(rawPrice).toLocaleString('id-ID'),
        stock: document.getElementById('prodStock').value + " Pcs",
        size: document.getElementById('prodSize').value || "Universal",
        desc: desc,
        img: uploadedImages
    };

    products.push(newProd);
    saveToStorage();
    displayProducts(products);
    alert("Produk Berhasil Ditambahkan!");
    document.querySelectorAll('.admin-section input, .admin-section textarea').forEach(i => i.value = "");
}

const toBase64 = file => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
});

// 4. MODAL & SLIDER
function openModal(id) {
    const p = products.find(item => item.id == id);
    if (!p) return;

    document.getElementById('modalTitle').innerText = p.name;
    document.getElementById('modalDesc').innerText = p.desc;
    document.getElementById('modalStock').innerText = p.stock;
    document.getElementById('modalSize').innerText = p.size;
    document.getElementById('modalPrice').innerText = p.price;

    activeImages = Array.isArray(p.img) ? p.img : [p.img];
    currentSlideIndex = 0;
    showSlide(0);

    const btnBuy = document.getElementById('igLink'); 
    if(btnBuy) {
        btnBuy.href = `https://www.instagram.com/si.keong.36/`;
        btnBuy.target = "_blank";
    }
    document.getElementById('productModal').style.display = "block";
}

function showSlide(index) {
    const container = document.getElementById('imageSlider');
    container.innerHTML = `<img src="${activeImages[index]}" class="slide-img">`;
    
    // Sembunyikan panah jika foto cuma satu
    const btns = document.querySelectorAll('.slider-btn');
    btns.forEach(b => b.style.display = activeImages.length > 1 ? "block" : "none");
}

function changeSlide(n) {
    currentSlideIndex += n;
    if (currentSlideIndex >= activeImages.length) currentSlideIndex = 0;
    if (currentSlideIndex < 0) currentSlideIndex = activeImages.length - 1;
    showSlide(currentSlideIndex);
}

function closeModal() {
    document.getElementById('productModal').style.display = "none";
}

// 5. SEARCH & FILTER
function searchProduct() {
    let input = document.getElementById('searchInput').value.toLowerCase();
    let filtered = products.filter(p => p.name.toLowerCase().includes(input));
    displayProducts(filtered);
}

function filterProduct(kategori) {
    const buttons = document.querySelectorAll('.btn-filter');
    buttons.forEach(btn => btn.classList.remove('active'));
    if (event) event.target.classList.add('active');
    
    const result = (kategori === 'semua') ? products : products.filter(p => p.category === kategori);
    displayProducts(result);
}

function deleteProduct(id) {
    if(confirm("Hapus barang ini?")) {
        products = products.filter(p => p.id !== id);
        saveToStorage();
        displayProducts(products);
    }
}

// 6. KOMENTAR
function sendComment() {
    const input = document.getElementById('inputChat');
    const list = document.getElementById('commentList');
    if (input.value.trim() !== "") {
        const p = document.createElement('p');
        p.className = "chat-bubble";
        p.innerHTML = `<strong>Anda:</strong> ${input.value}`;
        list.appendChild(p);
        input.value = "";
        list.scrollTop = list.scrollHeight;
    }
}

window.onclick = (e) => { if (e.target == document.getElementById('productModal')) closeModal(); }
document.addEventListener('DOMContentLoaded', () => displayProducts(products));