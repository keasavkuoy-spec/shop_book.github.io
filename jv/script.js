/* ============================================================
   KHMER STATIONERY - JavaScript
   ============================================================ */

/* ============ ទិន្នន័យផលិតផល ============ */
const products = [
    { id: 1, name: 'ប៊ិច Pilot G2', cat: 'pen', price: 2.50, icon: '🖊️', desc: 'ប៊ិចសរសេររលូន ទឹកខ្មៅជាប់', tag: 'ពេញនិយម' },
    { id: 2, name: 'សៀវភៅ A5 200 ទំព័រ', cat: 'book', price: 3.00, icon: '📓', desc: 'សៀវភៅកត់ត្រាគុណភាពខ្ពស់', tag: '' },
    { id: 3, name: 'ខ្មៅដៃពណ៌ 24 ដើម', cat: 'pen', price: 4.50, icon: '✏️', desc: 'ខ្មៅដៃពណ៌សម្រាប់គូរ', tag: 'ថ្មី' },
    { id: 4, name: 'កាបូបសិក្សា', cat: 'bag', price: 18.00, icon: '🎒', desc: 'កាបូបធំ ស៊ូទ្រាំបានច្រើន', tag: 'ពេញនិយម' },
    { id: 5, name: 'បន្ទាត់ 30cm', cat: 'tool', price: 1.50, icon: '📏', desc: 'បន្ទាត់ដែក ត្រឹមត្រូវ', tag: '' },
    { id: 6, name: 'សៀវភៅ B5 300 ទំព័រ', cat: 'book', price: 5.00, icon: '📔', desc: 'សៀវភៅធំសម្រាប់ការងារ', tag: '' },
    { id: 7, name: 'កាបូបខ្នាតតូច', cat: 'bag', price: 12.00, icon: '👝', desc: 'កាបូបតូចសម្រាប់ប៊ិច', tag: '' },
    { id: 8, name: 'កន្ត្រៃ', cat: 'tool', price: 3.50, icon: '✂️', desc: 'កន្ត្រៃមុតស្រួច', tag: '' },
    { id: 9, name: 'ប៊ិចពណ៌ 12 ដើម', cat: 'pen', price: 6.00, icon: '🖍️', desc: 'ប៊ិចពណ៌សម្រាប់ការសិក្សា', tag: 'ថ្មី' },
    { id: 10, name: 'សៀវភៅក្រដាស A4', cat: 'book', price: 4.00, icon: '📄', desc: 'ក្រដាស A4 100 សន្លឹក', tag: '' },
    { id: 11, name: 'កាបូបធំ 3 ថត', cat: 'bag', price: 25.00, icon: '🧳', desc: 'កាបូបធំសម្រាប់និស្សិត', tag: 'ពេញនិយម' },
    { id: 12, name: 'ជ័រលុប', cat: 'tool', price: 0.75, icon: '🧽', desc: 'ជ័រលុបស្អាត', tag: '' }
];

const catNames = {
    pen: 'ប៊ិច & ខ្មៅដៃ',
    book: 'សៀវភៅ',
    bag: 'កាបូប',
    tool: 'ឧបករណ៍'
};

/* ============ បង្ហាញផលិតផល ============ */
function renderProducts(list, container) {
    if (!container) return;

    if (list.length === 0) {
        container.innerHTML = '<p style="grid-column:1/-1;text-align:center;padding:40px;color:#64748b;">មិនមានផលិតផលទេ</p>';
        return;
    }

    container.innerHTML = list.map(p => `
        <div class="product-card">
            <div class="product-image">
                ${p.tag ? `<span class="product-tag">${p.tag}</span>` : ''}
                <span>${p.icon}</span>
            </div>
            <div class="product-info">
                <span class="product-cat">${catNames[p.cat]}</span>
                <h3>${p.name}</h3>
                <p class="product-desc">${p.desc}</p>
                <div class="product-bottom">
                    <span class="product-price">$${p.price.toFixed(2)}</span>
                    <button class="add-btn" data-id="${p.id}">
                        <i class="fas fa-plus"></i>
                    </button>
                </div>
            </div>
        </div>
    `).join('');

    container.querySelectorAll('.add-btn').forEach(btn => {
        btn.addEventListener('click', () => addToCart(parseInt(btn.dataset.id)));
    });
}

/* ============ កន្ត្រក (Cart) ============ */
let cart = JSON.parse(localStorage.getItem('cart')) || [];

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function addToCart(id) {
    const product = products.find(p => p.id === id);
    if (!product) return;

    const existing = cart.find(c => c.id === id);
    if (existing) existing.qty++;
    else cart.push({ ...product, qty: 1 });

    saveCart();
    updateCartUI();
    showToast(`បានបន្ថែម "${product.name}" ចូលកន្ត្រក`);
}

function removeFromCart(id) {
    cart = cart.filter(c => c.id !== id);
    saveCart();
    updateCartUI();
}

function updateCartUI() {
    const countEl = document.getElementById('cartCount');
    const itemsEl = document.getElementById('cartItems');
    const totalEl = document.getElementById('cartTotal');

    const totalQty = cart.reduce((s, c) => s + c.qty, 0);
    const totalPrice = cart.reduce((s, c) => s + c.price * c.qty, 0);

    if (countEl) countEl.textContent = totalQty;

    if (itemsEl) {
        if (cart.length === 0) {
            itemsEl.innerHTML = '<p class="cart-empty">កន្ត្រករបស់អ្នកទទេ</p>';
        } else {
            itemsEl.innerHTML = cart.map(c => `
                <div class="cart-item">
                    <div class="cart-item-img">${c.icon}</div>
                    <div class="cart-item-info">
                        <h4>${c.name}</h4>
                        <span>$${c.price.toFixed(2)} × ${c.qty}</span>
                    </div>
                    <button class="cart-item-remove" data-id="${c.id}">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `).join('');

            itemsEl.querySelectorAll('.cart-item-remove').forEach(btn => {
                btn.addEventListener('click', () => removeFromCart(parseInt(btn.dataset.id)));
            });
        }
    }

    if (totalEl) totalEl.textContent = `$${totalPrice.toFixed(2)}`;
}

/* ============ Toast Notification ============ */
function showToast(msg) {
    const toast = document.createElement('div');
    toast.textContent = msg;
    Object.assign(toast.style, {
        position: 'fixed',
        bottom: '30px',
        left: '50%',
        transform: 'translateX(-50%) translateY(20px)',
        background: '#0f172a',
        color: 'white',
        padding: '12px 24px',
        borderRadius: '10px',
        fontSize: '14px',
        zIndex: '2000',
        opacity: '0',
        transition: '0.3s',
        boxShadow: '0 10px 40px rgba(0,0,0,0.2)'
    });
    document.body.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '1';
        toast.style.transform = 'translateX(-50%) translateY(0)';
    }, 10);

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(-50%) translateY(20px)';
        setTimeout(() => toast.remove(), 300);
    }, 2500);
}

/* ============ Cart Sidebar Open/Close ============ */
function setupCartSidebar() {
    const cartBtn = document.getElementById('cartBtn');
    const closeCart = document.getElementById('closeCart');
    const sidebar = document.getElementById('cartSidebar');
    const overlay = document.getElementById('overlay');

    if (cartBtn && sidebar) {
        cartBtn.addEventListener('click', () => {
            sidebar.classList.add('active');
            overlay?.classList.add('active');
        });
    }
    if (closeCart) {
        closeCart.addEventListener('click', () => {
            sidebar.classList.remove('active');
            overlay?.classList.remove('active');
        });
    }
    if (overlay) {
        overlay.addEventListener('click', () => {
            sidebar.classList.remove('active');
            overlay.classList.remove('active');
        });
    }
}

/* ============ Mobile Menu ============ */
function setupMobileMenu() {
    const toggle = document.getElementById('menuToggle');
    const menu = document.querySelector('.nav-menu');
    if (toggle && menu) {
        toggle.addEventListener('click', () => menu.classList.toggle('active'));
    }
}

/* ============ ទំព័រ Home ============ */
function initHome() {
    const featured = document.getElementById('featuredProducts');
    if (featured) {
        renderProducts(products.slice(0, 8), featured);
    }
}

/* ============ ទំព័រ Products ============ */
function initProductsPage() {
    const grid = document.getElementById('productsGrid');
    if (!grid) return;

    let currentCat = 'all';
    let currentPrice = 'all';
    let currentSearch = '';

    function filterProducts() {
        let list = [...products];

        if (currentCat !== 'all') {
            list = list.filter(p => p.cat === currentCat);
        }

        if (currentPrice === 'low') list = list.filter(p => p.price < 5);
        else if (currentPrice === 'mid') list = list.filter(p => p.price >= 5 && p.price <= 15);
        else if (currentPrice === 'high') list = list.filter(p => p.price > 15);

        if (currentSearch) {
            const s = currentSearch.toLowerCase();
            list = list.filter(p =>
                p.name.toLowerCase().includes(s) ||
                p.desc.toLowerCase().includes(s)
            );
        }

        renderProducts(list, grid);
        const count = document.getElementById('productCount');
        if (count) count.textContent = list.length;
    }

    document.querySelectorAll('#categoryFilter li').forEach(li => {
        li.addEventListener('click', () => {
            document.querySelectorAll('#categoryFilter li').forEach(x => x.classList.remove('active'));
            li.classList.add('active');
            currentCat = li.dataset.cat;
            filterProducts();
        });
    });

    document.querySelectorAll('#priceFilter li').forEach(li => {
        li.addEventListener('click', () => {
            document.querySelectorAll('#priceFilter li').forEach(x => x.classList.remove('active'));
            li.classList.add('active');
            currentPrice = li.dataset.price;
            filterProducts();
        });
    });

    const search = document.getElementById('searchInput');
    if (search) {
        search.addEventListener('input', (e) => {
            currentSearch = e.target.value;
            filterProducts();
        });
    }

    filterProducts();
}

/* ============ ទំព័រ Contact ============ */
function initContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('cName').value.trim();
        const email = document.getElementById('cEmail').value.trim();
        const msg = document.getElementById('cMessage').value.trim();
        const feedback = document.getElementById('formMessage');

        if (!name || !email || !msg) {
            feedback.style.color = '#ef4444';
            feedback.textContent = 'សូមបំពេញព័ត៌មានទាំងអស់!';
            return;
        }

        feedback.style.color = '#16a34a';
        feedback.textContent = `អរគុណ ${name}! សាររបស់អ្នកត្រូវបានផ្ញើដោយជោគជ័យ។`;
        form.reset();
    });
}

/* ============ ចាប់ផ្តើម ============ */
document.addEventListener('DOMContentLoaded', () => {
    updateCartUI();
    setupCartSidebar();
    setupMobileMenu();
    initHome();
    initProductsPage();
    initContactForm();
});