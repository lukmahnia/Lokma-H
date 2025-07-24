
document.addEventListener('DOMContentLoaded', () => {
    const links = document.querySelectorAll('aside a');
    const pages = document.querySelectorAll('.page-content');

    links.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const href = e.target.getAttribute('href');
            let targetId;

            if (href === 'admin.html') {
                targetId = 'orders'; // Default page for admin.html
            } else {
                // Extract the ID from href like "admin_orders.html" -> "orders"
                targetId = href.replace('admin_', '').replace('.html', '');
            }

            pages.forEach(page => {
                if (page.id === targetId) {
                    page.style.display = 'block';
                } else {
                    page.style.display = 'none';
                }
            });

            links.forEach(l => l.classList.remove('bg-primary'));
            e.target.classList.add('bg-primary');
        });
    });

    // Show the first page by default (which is 'orders' for admin.html)
    const initialPath = window.location.pathname.split('/').pop();
    let initialTargetId = 'orders'; // Default to orders page

    if (initialPath !== 'admin.html' && initialPath.startsWith('admin_')) {
        initialTargetId = initialPath.replace('admin_', '').replace('.html', '');
    }

    pages.forEach(page => {
        if (page.id === initialTargetId) {
            page.style.display = 'block';
        } else {
            page.style.display = 'none';
        }
    });

    // Highlight the correct link in the sidebar based on the initial page
    links.forEach(link => {
        const href = link.getAttribute('href');
        let linkTargetId;
        if (href === 'admin.html') {
            linkTargetId = 'orders';
        } else {
            linkTargetId = href.replace('admin_', '').replace('.html', '');
        }

        if (linkTargetId === initialTargetId) {
            link.classList.add('bg-primary');
        } else {
            link.classList.remove('bg-primary');
        }
    });


    // Initialize Menu Management
    loadMenuItemsAdmin();
    setupMenuForm();

    // Initialize Promotions Management
    loadPromotionsAdmin();
    setupPromoForm();

    // Initialize Subscriptions Management
    loadSubscriptionsAdmin();
    setupSubForm();
    loadUserSubscriptionsAdmin();

    // Initialize Healthy Meals Management
    loadHealthyMealsAdmin();
    setupHealthyForm();

    // Initialize Business Meals Management
    loadBusinessMealsAdmin();
    setupBusinessForm();

    // Initialize Order Management
    loadOrdersAdmin();
    setInterval(loadOrdersAdmin, 30000); // Refresh orders every 30 seconds

    // Initialize Reports
    loadReports();

    // Initialize Settings
    loadSettings();
    setupSettingsForm();
});

async function loadMenuItemsAdmin() {
    const response = await fetch('/api/menu');
    const { data } = await response.json();

    const menuItemsList = document.getElementById('menu-items-list');
    menuItemsList.innerHTML = '';
    data.forEach(item => {
        const menuItem = document.createElement('div');
        menuItem.className = 'flex justify-between items-center border-b py-2';
        menuItem.innerHTML = `
            <div>
                <h4 class="font-bold">${item.name}</h4>
                <p>${item.price}</p>
            </div>
            <div>
                <button class="text-blue-500 hover:text-blue-700 mr-2" onclick="editMenuItem('${item.id}', '${item.name}', '${item.price}', '${item.description}', '${item.image}')">تعديل</button>
                <button class="text-red-500 hover:text-red-700" onclick="deleteMenuItem('${item.id}')">حذف</button>
            </div>
        `;
        menuItemsList.appendChild(menuItem);
    });
}

function setupMenuForm() {
    const menuForm = document.getElementById('menu-form');
    menuForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(menuForm);
        const data = Object.fromEntries(formData.entries());
        const itemId = data.itemId;

        const url = itemId ? `/api/menu/${itemId}` : '/api/menu';
        const method = itemId ? 'PUT' : 'POST';

        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            alert('تم حفظ بيانات الطبق بنجاح');
            menuForm.reset();
            loadMenuItemsAdmin();
        } else {
            alert('فشل حفظ البيانات');
        }
    });
}

function editMenuItem(id, name, price, description, image) {
    document.getElementById('item-id').value = id;
    document.getElementById('item-name').value = name;
    document.getElementById('item-price').value = price;
    document.getElementById('item-description').value = description;
    document.getElementById('item-image').value = image;
}

async function deleteMenuItem(id) {
    if (confirm('هل أنت متأكد من رغبتك في حذف هذا الطبق؟')) {
        const response = await fetch(`/api/menu/${id}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            alert('تم حذف الطبق بنجاح');
            loadMenuItemsAdmin();
        } else {
            alert('فشل حذف الطبق');
        }
    }
}

async function loadPromotionsAdmin() {
    const response = await fetch('/api/offers');
    const { data } = await response.json();

    const promoItemsList = document.getElementById('promo-items-list');
    promoItemsList.innerHTML = '';
    data.forEach(item => {
        const promoItem = document.createElement('div');
        promoItem.className = 'flex justify-between items-center border-b py-2';
        promoItem.innerHTML = `
            <div>
                <h4 class="font-bold">${item.name}</h4>
                <p>${item.price}</p>
            </div>
            <div>
                <button class="text-blue-500 hover:text-blue-700 mr-2" onclick="editPromoItem('${item.id}', '${item.name}', '${item.price}', '${item.description}', '${item.image}')">تعديل</button>
                <button class="text-red-500 hover:text-red-700" onclick="deletePromoItem('${item.id}')">حذف</button>
            </div>
        `;
        promoItemsList.appendChild(promoItem);
    });
}

function setupPromoForm() {
    const promoForm = document.getElementById('promo-form');
    promoForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(promoForm);
        const data = Object.fromEntries(formData.entries());
        const promoId = data.promoId;

        const url = promoId ? `/api/offers/${promoId}` : '/api/offers';
        const method = promoId ? 'PUT' : 'POST';

        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            alert('تم حفظ بيانات العرض بنجاح');
            promoForm.reset();
            loadPromotionsAdmin();
        } else {
            alert('فشل حفظ البيانات');
        }
    });
}

function editPromoItem(id, name, price, description, image) {
    document.getElementById('promo-id').value = id;
    document.getElementById('promo-name').value = name;
    document.getElementById('promo-price').value = price;
    document.getElementById('promo-description').value = description;
    document.getElementById('promo-image').value = image;
}

async function deletePromoItem(id) {
    if (confirm('هل أنت متأكد من رغبتك في حذف هذا العرض؟')) {
        const response = await fetch(`/api/offers/${id}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            alert('تم حذف العرض بنجاح');
            loadPromotionsAdmin();
        } else {
            alert('فشل حذف العرض');
        }
    }
}

async function loadSubscriptionsAdmin() {
    const response = await fetch('/api/subscriptions');
    const { data } = await response.json();

    const subItemsList = document.getElementById('sub-items-list');
    subItemsList.innerHTML = '';
    data.forEach(item => {
        const subItem = document.createElement('div');
        subItem.className = 'flex justify-between items-center border-b py-2';
        subItem.innerHTML = `
            <div>
                <h4 class="font-bold">${item.name}</h4>
                <p>${item.price}</p>
            </div>
            <div>
                <button class="text-blue-500 hover:text-blue-700 mr-2" onclick="editSubItem('${item.id}', '${item.name}', '${item.price}', '${item.description}', '${item.meals_per_week}', '${item.delivery_days}')">تعديل</button>
                <button class="text-red-500 hover:text-red-700" onclick="deleteSubItem('${item.id}')">حذف</button>
            </div>
        `;
        subItemsList.appendChild(subItem);
    });
}

function setupSubForm() {
    const subForm = document.getElementById('sub-form');
    subForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(subForm);
        const data = Object.fromEntries(formData.entries());
        const subId = data.subId;

        const url = subId ? `/api/subscriptions/${subId}` : '/api/subscriptions';
        const method = subId ? 'PUT' : 'POST';

        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            alert('تم حفظ بيانات الباقة بنجاح');
            subForm.reset();
            loadSubscriptionsAdmin();
        } else {
            alert('فشل حفظ البيانات');
        }
    });
}

function editSubItem(id, name, price, description, meals_per_week, delivery_days) {
    document.getElementById('sub-id').value = id;
    document.getElementById('sub-name').value = name;
    document.getElementById('sub-price').value = price;
    document.getElementById('sub-description').value = description;
    document.getElementById('sub-meals').value = meals_per_week;
    document.getElementById('sub-days').value = delivery_days;
}

async function deleteSubItem(id) {
    if (confirm('هل أنت متأكد من رغبتك في حذف هذه الباقة؟')) {
        const response = await fetch(`/api/subscriptions/${id}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            alert('تم حذف الباقة بنجاح');
            loadSubscriptionsAdmin();
        } else {
            alert('فشل حذف الباقة');
        }
    }
}

async function loadUserSubscriptionsAdmin() {
    const response = await fetch('/api/user_subscriptions');
    const { data } = await response.json();

    const userSubscriptionsList = document.getElementById('user-subscriptions-list');
    userSubscriptionsList.innerHTML = '';
    data.forEach(item => {
        const userSubItem = document.createElement('div');
        userSubItem.className = 'flex justify-between items-center border-b py-2';
        userSubItem.innerHTML = `
            <div>
                <h4 class="font-bold">${item.user_name}</h4>
                <p>${item.subscription_name}</p>
            </div>
            <div>
                <span>${item.start_date} - ${item.end_date}</span>
            </div>
        `;
        userSubscriptionsList.appendChild(userSubItem);
    });
}

async function loadHealthyMealsAdmin() {
    const response = await fetch('/api/healthy-meals');
    const { data } = await response.json();

    const healthyItemsList = document.getElementById('healthy-items-list');
    healthyItemsList.innerHTML = '';
    data.forEach(item => {
        const healthyItem = document.createElement('div');
        healthyItem.className = 'flex justify-between items-center border-b py-2';
        healthyItem.innerHTML = `
            <div>
                <h4 class="font-bold">${item.name}</h4>
                <p>${item.price}</p>
            </div>
            <div>
                <button class="text-blue-500 hover:text-blue-700 mr-2" onclick="editHealthyItem('${item.id}', '${item.name}', '${item.price}', '${item.description}', '${item.image}', '${item.calories}', '${item.diet_type}')">تعديل</button>
                <button class="text-red-500 hover:text-red-700" onclick="deleteHealthyItem('${item.id}')">حذف</button>
            </div>
        `;
        healthyItemsList.appendChild(healthyItem);
    });
}

function setupHealthyForm() {
    const healthyForm = document.getElementById('healthy-form');
    healthyForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(healthyForm);
        const data = Object.fromEntries(formData.entries());
        const healthyId = data.healthyId;

        const url = healthyId ? `/api/healthy-meals/${healthyId}` : '/api/healthy-meals';
        const method = healthyId ? 'PUT' : 'POST';

        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            alert('تم حفظ بيانات الوجبة الصحية بنجاح');
            healthyForm.reset();
            loadHealthyMealsAdmin();
        } else {
            alert('فشل حفظ البيانات');
        }
    });
}

function editHealthyItem(id, name, price, description, image, calories, diet_type) {
    document.getElementById('healthy-id').value = id;
    document.getElementById('healthy-name').value = name;
    document.getElementById('healthy-price').value = price;
    document.getElementById('healthy-description').value = description;
    document.getElementById('healthy-image').value = image;
    document.getElementById('healthy-calories').value = calories;
    document.getElementById('healthy-diet-type').value = diet_type;
}

async function deleteHealthyItem(id) {
    if (confirm('هل أنت متأكد من رغبتك في حذف هذه الوجبة الصحية؟')) {
        const response = await fetch(`/api/healthy-meals/${id}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            alert('تم حذف الوجبة الصحية بنجاح');
            loadHealthyMealsAdmin();
        } else {
            alert('فشل حذف الوجبة الصحية');
        }
    }
}

async function loadBusinessMealsAdmin() {
    const response = await fetch('/api/business-meals');
    const { data } = await response.json();

    const businessItemsList = document.getElementById('business-items-list');
    businessItemsList.innerHTML = '';
    data.forEach(item => {
        const businessItem = document.createElement('div');
        businessItem.className = 'flex justify-between items-center border-b py-2';
        businessItem.innerHTML = `
            <div>
                <h4 class="font-bold">${item.name}</h4>
                <p>${item.price}</p>
            </div>
            <div>
                <button class="text-blue-500 hover:text-blue-700 mr-2" onclick="editBusinessItem('${item.id}', '${item.name}', '${item.price}', '${item.description}', '${item.image}', '${item.people_count}')">تعديل</button>
                <button class="text-red-500 hover:text-red-700" onclick="deleteBusinessItem('${item.id}')">حذف</button>
            </div>
        `;
        businessItemsList.appendChild(businessItem);
    });
}

function setupBusinessForm() {
    const businessForm = document.getElementById('business-form');
    businessForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(businessForm);
        const data = Object.fromEntries(formData.entries());
        const businessId = data.businessId;

        const url = businessId ? `/api/business-meals/${businessId}` : '/api/business-meals';
        const method = businessId ? 'PUT' : 'POST';

        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            alert('تم حفظ بيانات وجبة الأعمال بنجاح');
            businessForm.reset();
            loadBusinessMealsAdmin();
        } else {
            alert('فشل حفظ البيانات');
        }
    });
}

function editBusinessItem(id, name, price, description, image, people_count) {
    document.getElementById('business-id').value = id;
    document.getElementById('business-name').value = name;
    document.getElementById('business-price').value = price;
    document.getElementById('business-description').value = description;
    document.getElementById('business-image').value = image;
    document.getElementById('business-people-count').value = people_count;
}

async function deleteBusinessItem(id) {
    if (confirm('هل أنت متأكد من رغبتك في حذف وجبة الأعمال هذه؟')) {
        const response = await fetch(`/api/business-meals/${id}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            alert('تم حذف وجبة الأعمال بنجاح');
            loadBusinessMealsAdmin();
        } else {
            alert('فشل حذف وجبة الأعمال');
        }
    }
}

async function loadOrdersAdmin() {
    const response = await fetch('/api/orders');
    const { data } = await response.json();

    const ordersContainer = document.querySelector('#orders .grid');
    ordersContainer.innerHTML = '';
    data.forEach(order => {
        const orderCard = document.createElement('div');
        orderCard.className = 'border p-4 rounded-lg';
        orderCard.innerHTML = `
            <div class="flex justify-between items-center mb-2">
                <span class="font-bold">طلب #${order.id}</span>
                <span class="${getStatusClass(order.status)} text-white px-2 py-1 text-sm rounded">${order.status}</span>
            </div>
            <p><strong>الزبون:</strong> ${order.customer_name}</p>
            <p><strong>الإجمالي:</strong> ${order.total_price} ر.ي</p>
            <p><strong>الحالة:</strong> ${order.status}</p>
            <div class="mt-4">
                <select onchange="updateOrderStatus(${order.id}, this.value)" class="w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary">
                    <option value="جديد" ${order.status === 'جديد' ? 'selected' : ''}>جديد</option>
                    <option value="قيد التحضير" ${order.status === 'قيد التحضير' ? 'selected' : ''}>قيد التحضير</option>
                    <option value="قيد التوصيل" ${order.status === 'قيد التوصيل' ? 'selected' : ''}>قيد التوصيل</option>
                    <option value="مكتمل" ${order.status === 'مكتمل' ? 'selected' : ''}>مكتمل</option>
                </select>
            </div>
        `;
        ordersContainer.appendChild(orderCard);
    });
}

function getStatusClass(status) {
    switch (status) {
        case 'جديد': return 'bg-green-500';
        case 'قيد التحضير': return 'bg-blue-500';
        case 'قيد التوصيل': return 'bg-yellow-500';
        case 'مكتمل': return 'bg-gray-500';
        default: return 'bg-gray-500';
    }
}

async function updateOrderStatus(orderId, newStatus) {
    const response = await fetch(`/api/orders/${orderId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
    });

    if (response.ok) {
        alert('تم تحديث حالة الطلب بنجاح');
        loadOrdersAdmin();
    } else {
        alert('فشل تحديث حالة الطلب');
    }
}

async function loadReports() {
    loadSalesAnalysis();
    loadBestSellingDishes();
    loadPremiumCustomers();
}

async function loadSalesAnalysis() {
    const response = await fetch('/api/reports/sales-analysis');
    const { total_sales, total_orders } = await response.json();

    document.querySelector('#sales-analysis-data span:nth-child(1)').innerText = `${total_sales} ر.ي`;
    document.querySelector('#sales-analysis-data span:nth-child(2)').innerText = total_orders;
}

async function loadBestSellingDishes() {
    const response = await fetch('/api/reports/best-selling-dishes');
    const { data } = await response.json();

    const bestSellingDishesData = document.getElementById('best-selling-dishes-data');
    bestSellingDishesData.innerHTML = '';
    if (data.length === 0) {
        bestSellingDishesData.innerHTML = '<p>لا توجد بيانات حاليًا.</p>';
        return;
    }
    data.forEach(item => {
        bestSellingDishesData.innerHTML += `<p>${item.name} - ${item.sales_count} مبيعات</p>`;
    });
}

async function loadPremiumCustomers() {
    const response = await fetch('/api/reports/premium-customers');
    const { data } = await response.json();

    const premiumCustomersData = document.getElementById('premium-customers-data');
    premiumCustomersData.innerHTML = '';
    if (data.length === 0) {
        premiumCustomersData.innerHTML = '<p>لا توجد بيانات حاليًا.</p>';
        return;
    }
    data.forEach(customer => {
        premiumCustomersData.innerHTML += `<p>${customer.name} - ${customer.total_spent} ر.ي</p>`;
    });
}

async function loadSettings() {
    const response = await fetch('/api/settings');
    const { data } = await response.json();

    if (data) {
        document.getElementById('working-hours').value = data.working_hours || '';
        document.getElementById('delivery-companies').value = data.delivery_companies || '';
        document.getElementById('payment-settings').value = data.payment_settings || '';
    }
}

function setupSettingsForm() {
    const settingsForm = document.getElementById('settings-form');
    settingsForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(settingsForm);
        const data = Object.fromEntries(formData.entries());

        const response = await fetch('/api/settings', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            alert('تم حفظ الإعدادات بنجاح');
        } else {
            alert('فشل حفظ الإعدادات');
        }
    });
}
