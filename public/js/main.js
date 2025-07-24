function addToCart(name, price) {
    console.log('addToCart called for:', name, price);
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    // Remove non-numeric characters (like currency symbols) before parsing
    const cleanPrice = price.replace(/[^\d.-]/g, '');
    const numericPrice = parseFloat(cleanPrice); // Convert price to a number
    if (isNaN(numericPrice)) {
        console.error('Invalid price for item:', name, price);
        alert('حدث خطأ: السعر غير صالح.');
        return;
    }
    cart.push({ name, price: numericPrice }); // Store numeric price
    localStorage.setItem('cart', JSON.stringify(cart));
    alert(`تمت إضافة المنتج إلى السلة. عدد العناصر في السلة: ${cart.length}`);
}

async function loadMenuItems(searchTerm = '', priceFilter = '', dietFilter = '') {
    const response = await fetch(`/api/menu?search=${searchTerm}&price=${priceFilter}&diet=${dietFilter}`);
    const data = await response.json();

    const menuContainer = document.getElementById('menu-container');
    menuContainer.innerHTML = '';
    data.forEach(item => {
        const menuItem = document.createElement('div');
        menuItem.className = 'bg-white rounded-lg shadow-lg overflow-hidden';
        menuItem.innerHTML = `
            <img src="${item.image}" alt="${item.name}" class="w-full h-48 object-cover">
            <div class="p-6">
                <h4 class="font-bold text-xl text-secondary mb-2">${item.name}</h4>
                <p class="text-gray-600 mb-4">${item.description}</p>
                <div class="flex justify-between items-center">
                    <span class="font-bold text-primary text-lg">${item.price}</span>
                    <button class="bg-primary text-white px-4 py-2 rounded-full hover:bg-opacity-90 transition" onclick="addToCart('${item.name}', '${item.price}')">أضف للسلة</button>
                </div>
            </div>
        `;
        menuContainer.appendChild(menuItem);
    });
}

async function loadOffers() {
    const response = await fetch('/api/offers');
    const data = await response.json();

    const offersContainer = document.getElementById('offers-container');
    offersContainer.innerHTML = '';
    data.forEach(offer => {
        const offerItem = document.createElement('div');
        offerItem.className = 'bg-white rounded-lg shadow-lg overflow-hidden';
        offerItem.innerHTML = `
            <img src="${offer.image}" alt="${offer.name}" class="w-full h-48 object-cover">
            <div class="p-6">
                <h4 class="font-bold text-xl text-secondary mb-2">${offer.name}</h4>
                <p class="text-gray-600 mb-4">${offer.description}</p>
                <div class="flex justify-between items-center">
                    <span class="font-bold text-primary text-lg">${offer.price}</span>
                    <button class="bg-primary text-white px-4 py-2 rounded-full hover:bg-opacity-90 transition">اطلب الآن</button>
                </div>
            </div>
        `;
        offersContainer.appendChild(offerItem);
    });
}

function setupSearch() {
    const searchBar = document.getElementById('search-bar');
    const priceFilter = document.getElementById('price-filter');
    const dietFilter = document.getElementById('diet-filter');

    const applyFilters = () => {
        const searchTerm = searchBar.value.toLowerCase();
        const selectedPrice = priceFilter.value;
        const selectedDiet = dietFilter.value;
        loadMenuItems(searchTerm, selectedPrice, selectedDiet);
    };

    searchBar.addEventListener('keyup', applyFilters);
    priceFilter.addEventListener('change', applyFilters);
    dietFilter.addEventListener('change', applyFilters);

    // Initial load with no filters
    loadMenuItems();
}

function loadCartItems() {
    const cartItemsContainer = document.getElementById('cart-items-container');
    const cartSummary = document.getElementById('cart-summary');
    const totalPriceEl = document.getElementById('total-price');
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    let totalPrice = 0;

    cartItemsContainer.innerHTML = '';
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p class="text-center text-gray-600">سلة المشتريات فارغة</p>';
        totalPriceEl.innerText = '0 ر.ي';
        cartSummary.style.display = 'none';
        return;
    }

    cart.forEach((item, index) => {
        const cartItem = document.createElement('div');
        cartItem.className = 'flex justify-between items-center border-b py-4';
        cartItem.innerHTML = `
            <div>
                <h4 class="font-bold text-lg text-secondary">${item.name}</h4>
                <p class="text-primary">${item.price}</p>
            </div>
            <button class="text-red-500 hover:text-red-700" onclick="removeFromCart(${index})"><i class="fas fa-trash"></i></button>
        `;
        cartItemsContainer.appendChild(cartItem);
        totalPrice += parseFloat(item.price);
    });

    totalPriceEl.innerText = `${totalPrice} ر.ي`;

    const checkoutButton = document.getElementById('checkout-button');
    checkoutButton.addEventListener('click', () => {
        checkout(cart, totalPrice);
    });

    cartSummary.style.display = 'block';
}

function checkout(cart, totalPrice) {
    const cartSummary = document.getElementById('cart-summary');
    cartSummary.innerHTML = `
        <div class="text-center mb-8">
            <h2 class="text-4xl font-bold text-secondary mb-4">إتمام الدفع</h2>
        </div>
        <div class="mb-8">
            <h3 class="text-2xl font-bold text-secondary mb-4">ملخص الطلب</h3>
            <div id="order-summary-container"></div>
            <div class="flex justify-between items-center mt-4">
                <span class="text-lg font-bold text-secondary">الإجمالي</span>
                <span class="text-lg font-bold text-primary">${totalPrice} ر.ي</span>
            </div>
        </div>
        <div>
            <h3 class="text-2xl font-bold text-secondary mb-4">اختر نوع الطلب</h3>
            <div class="flex flex-col space-y-2 mb-6">
                <label class="inline-flex items-center">
                    <input type="radio" class="form-radio" name="order_type" value="delivery" checked>
                    <span class="ml-2">توصيل</span>
                </label>
                <label class="inline-flex items-center">
                    <input type="radio" class="form-radio" name="order_type" value="pickup">
                    <span class="ml-2">استلام من المطعم</span>
                </label>
                <label class="inline-flex items-center">
                    <input type="radio" class="form-radio" name="order_type" value="pre-booking">
                    <span class="ml-2">حجز مسبق</span>
                </label>
            </div>
            <h3 class="text-2xl font-bold text-secondary mb-4">اختر طريقة الدفع</h3>
            <div class="flex flex-col space-y-4">
                <button id="cash-on-delivery-button" class="w-full bg-green-500 text-white py-3 rounded-full font-bold hover:bg-opacity-90 transition">الدفع عند الاستلام</button>
                <button id="electronic-payment-button" class="w-full bg-blue-500 text-white py-3 rounded-full font-bold hover:bg-opacity-90 transition">الدفع الإلكتروني</button>
            </div>
        </div>
    `;

    const orderSummaryContainer = document.getElementById('order-summary-container');
    cart.forEach(item => {
        const orderItem = document.createElement('div');
        orderItem.className = 'flex justify-between items-center border-b py-2';
        orderItem.innerHTML = `
            <span class="text-secondary">${item.name}</span>
            <span class="text-primary">${item.price}</span>
        `;
        orderSummaryContainer.appendChild(orderItem);
    });

    const cashOnDeliveryButton = document.getElementById('cash-on-delivery-button');
    cashOnDeliveryButton.addEventListener('click', () => {
        const orderType = document.querySelector('input[name="order_type"]:checked').value;
        alert(`تم اختيار الدفع عند الاستلام (${orderType}). سيتم تأكيد طلبك.`);
        // Here you would typically send the order to the server with orderType
        // Award loyalty points
        const pointsEarned = Math.floor(totalPrice / 10);
        alert(`لقد ربحت ${pointsEarned} نقطة ولاء!`);

        // Save last order for reorder feature
        saveLastOrder(cart, totalPrice, orderType);

        localStorage.removeItem('cart');
        window.location.href = 'index.html';
    });

    const electronicPaymentButton = document.getElementById('electronic-payment-button');
    electronicPaymentButton.addEventListener('click', () => {
        const orderType = document.querySelector('input[name="order_type"]:checked').value;
        alert(`سيتم توجيهك إلى بوابة الدفع الإلكتروني (${orderType}). (محاكاة لعملية الدفع)`);
        // In a real application, you would redirect to the payment gateway with order details
        // Example: window.location.href = `https://paymentgateway.com/pay?amount=${totalPrice}&orderId=...`;
        localStorage.removeItem('cart');
        window.location.href = 'index.html';
    });
}

function removeFromCart(index) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    loadCartItems();
}

function setupLoginForm() {
    const loginForm = document.getElementById('login-form');
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(loginForm);
        const data = Object.fromEntries(formData.entries());

        const response = await fetch('/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            alert('تم تسجيل الدخول بنجاح');
            window.location.href = 'index.html';
        } else {
            alert('فشل تسجيل الدخول. يرجى التحقق من البريد الإلكتروني وكلمة المرور.');
        }
    });
}

function setupRegisterForm() {
    const registerForm = document.getElementById('register-form');
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(registerForm);
        const data = Object.fromEntries(formData.entries());

        if (data.password !== data['confirm-password']) {
            alert('كلمتا المرور غير متطابقتين');
            return;
        }

        

        const response = await fetch('/api/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            alert('تم إنشاء الحساب بنجاح');
            window.location.href = 'login.html';
        } else {
            alert('فشل إنشاء الحساب. قد يكون البريد الإلكتروني أو رقم الهاتف مستخدمًا بالفعل.');
        }
    });
}

function setupContactForm() {
    const contactForm = document.getElementById('contact-form');
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(contactForm);
        const data = Object.fromEntries(formData.entries());

        const response = await fetch('/api/contact', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            alert('تم إرسال رسالتك بنجاح');
            contactForm.reset();
        } else {
            alert('فشل إرسال الرسالة. يرجى المحاولة مرة أخرى.');
        }
    });
}

async function loadSubscriptionPackages() {
    const response = await fetch('/api/subscriptions');
    const data = await response.json();

    const subscriptionsContainer = document.getElementById('subscriptions-container');
    subscriptionsContainer.innerHTML = '';
    data.forEach(pkg => {
        const subscriptionPackage = document.createElement('div');
        subscriptionPackage.className = 'bg-white rounded-lg shadow-lg p-8';
        subscriptionPackage.innerHTML = `
            <h3 class="text-2xl font-bold text-secondary mb-4">${pkg.name}</h3>
            <p class="text-gray-600 mb-4">${pkg.description}</p>
            <p class="text-lg font-bold text-primary mb-4">${pkg.price}</p>
            <ul class="text-gray-600 mb-6">
                <li><i class="fas fa-check-circle text-green-500 mr-2"></i>${pkg.meals_per_week} وجبات في الأسبوع</li>
                <li><i class="fas fa-check-circle text-green-500 mr-2"></i>أيام التوصيل: ${pkg.delivery_days}</li>
            </ul>
            <button class="w-full bg-primary text-white py-3 rounded-full font-bold hover:bg-opacity-90 transition" onclick="subscribe(${pkg.id})">اشترك الآن</button>
        `;
        subscriptionsContainer.appendChild(subscriptionPackage);
    });
}

async function subscribe(packageId) {
    // In a real application, you would need to handle user authentication
    // For now, we'll just simulate the subscription process
    const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ packageId: packageId, userId: 1 }) // Assuming user ID 1 for now
    });

    if (response.ok) {
        alert('تم الاشتراك بنجاح!');
        window.location.href = 'index.html';
    } else {
        alert('فشل الاشتراك. يرجى المحاولة مرة أخرى.');
    }
}

async function saveLastOrder(cart, totalPrice, orderType) {
    // For simplicity, assuming user ID 1 is logged in
    const userId = 1;
    const lastOrder = { cart, totalPrice, orderType, timestamp: new Date().toISOString() };

    const response = await fetch(`/api/users/${userId}/last-order`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ last_order: JSON.stringify(lastOrder) })
    });

    if (!response.ok) {
        console.error('Failed to save last order.');
    }
}

async function loadHealthyMeals() {
    const response = await fetch('/api/healthy-meals');
    const data = await response.json();

    const healthyMealsContainer = document.getElementById('healthy-meals-container');
    healthyMealsContainer.innerHTML = '';
    data.forEach(item => {
        const healthyMeal = document.createElement('div');
        healthyMeal.className = 'bg-white rounded-lg shadow-lg overflow-hidden';
        healthyMeal.innerHTML = `
            <img src="${item.image}" alt="${item.name}" class="w-full h-48 object-cover">
            <div class="p-6">
                <h4 class="font-bold text-xl text-secondary mb-2">${item.name}</h4>
                <p class="text-gray-600 mb-4">${item.description}</p>
                <div class="flex justify-between items-center">
                    <span class="font-bold text-primary text-lg">${item.price}</span>
                    <button class="bg-primary text-white px-4 py-2 rounded-full hover:bg-opacity-90 transition" onclick="addToCart('${item.name}', '${item.price}')">أضف للسلة</button>
                </div>
            </div>
        `;
        healthyMealsContainer.appendChild(healthyMeal);
    });
}

async function loadBusinessMeals() {
    const response = await fetch('/api/business-meals');
    const data = await response.json();

    const businessMealsContainer = document.getElementById('business-meals-container');
    businessMealsContainer.innerHTML = '';
    data.forEach(item => {
        const businessMeal = document.createElement('div');
        businessMeal.className = 'bg-white rounded-lg shadow-lg overflow-hidden';
        businessMeal.innerHTML = `
            <img src="${item.image}" alt="${item.name}" class="w-full h-48 object-cover">
            <div class="p-6">
                <h4 class="font-bold text-xl text-secondary mb-2">${item.name}</h4>
                <p class="text-gray-600 mb-4">${item.description}</p>
                <div class="flex justify-between items-center">
                    <span class="font-bold text-primary text-lg">${item.price}</span>
                    <button class="bg-primary text-white px-4 py-2 rounded-full hover:bg-opacity-90 transition" onclick="addToCart('${item.name}', '${item.price}')">أضف للسلة</button>
                </div>
            </div>
        `;
        businessMealsContainer.appendChild(businessMeal);
    });
}

async function setupReorderButton() {
    const reorderButton = document.getElementById('reorder-button');
    if (reorderButton) {
        reorderButton.addEventListener('click', async () => {
            // For simplicity, assuming user ID 1 is logged in
            const userId = 1;
            const response = await fetch(`/api/users/${userId}/last-order`);
            const data = await response.json();

            if (data && data.last_order) {
                const lastOrder = JSON.parse(data.last_order);
                let cart = JSON.parse(localStorage.getItem('cart')) || [];
                lastOrder.cart.forEach(item => cart.push(item));
                localStorage.setItem('cart', JSON.stringify(cart));
                alert('تمت إضافة عناصر الطلب الأخير إلى سلة المشتريات.');
                window.location.href = 'cart.html';
            } else {
                alert('لا يوجد طلب سابق لإعادة طلبه.');
            }
        });
    }
}

async function loadFeaturedDishes() {
    const response = await fetch('/api/menu');
    const data = await response.json();
    console.log('Menu data fetched:', data);

    const featuredDishesContainer = document.getElementById('featured-dishes-container');
    if (!featuredDishesContainer) return;

    featuredDishesContainer.innerHTML = '';

    // Select 3 random items to feature
    const featuredItems = data.sort(() => 0.5 - Math.random()).slice(0, 3);

    featuredItems.forEach(item => {
        const featuredItem = document.createElement('div');
        featuredItem.className = 'bg-white rounded-lg shadow-lg overflow-hidden';
        featuredItem.innerHTML = `
            <img src="${item.image}" alt="${item.name}" class="w-full h-48 object-cover">
            <div class="p-6">
                <h4 class="font-bold text-xl text-secondary mb-2">${item.name}</h4>
                <p class="text-gray-600 mb-4">${item.description}</p>
                <div class="flex justify-between items-center">
                    <span class="font-bold text-primary text-lg">${item.price}</span>
                    <button class="bg-primary text-white px-4 py-2 rounded-full hover:bg-opacity-90 transition" onclick="addToCart('${item.name}', '${item.price}')">أضف للسلة</button>
                </div>
            </div>
        `;
        featuredDishesContainer.appendChild(featuredItem);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('featured-dishes-container')) {
        loadFeaturedDishes();
    }
    if (document.getElementById('menu-container')) {
        setupSearch();
    }
    if (document.getElementById('offers-container')) {
        loadOffers();
    }
    if (document.getElementById('cart-items-container')) {
        loadCartItems();
    }
    if (document.getElementById('login-form')) {
        setupLoginForm();
    }
    if (document.getElementById('register-form')) {
        setupRegisterForm();
    }
    if (document.getElementById('contact-form')) {
        setupContactForm();
    }
    if (document.getElementById('subscriptions-container')) {
        loadSubscriptionPackages();
    }
    if (document.getElementById('healthy-meals-container')) {
        loadHealthyMeals();
    }
    if (document.getElementById('business-meals-container')) {
        loadBusinessMeals();
    }
    if (document.getElementById('reorder-button')) {
        setupReorderButton();
    }
});
