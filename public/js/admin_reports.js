document.addEventListener('DOMContentLoaded', () => {
    fetchSalesAnalysis();
    fetchBestSellingItems();
    fetchPremiumCustomers();
});

async function fetchSalesAnalysis() {
    try {
        const response = await fetch('/api/reports/sales-analysis');
        const data = await response.json();
        const salesAnalysisData = document.getElementById('sales-analysis-data');
        if (data) {
            salesAnalysisData.innerHTML = `
                <p>إجمالي المبيعات: <span class="font-bold text-primary">${data.total_sales || 0} ر.ي</span></p>
                <p>عدد الطلبات: <span class="font-bold text-primary">${data.total_orders || 0}</span></p>
            `;
        } else {
            salesAnalysisData.innerHTML = '<p>لا توجد بيانات تحليل مبيعات حاليًا.</p>';
        }
    } catch (error) {
        console.error('Error fetching sales analysis:', error);
        document.getElementById('sales-analysis-data').innerHTML = '<p>حدث خطأ أثناء تحميل تحليل المبيعات.</p>';
    }
}

async function fetchBestSellingItems() {
    try {
        const response = await fetch('/api/reports/best-selling-items');
        const items = await response.json();
        const bestSellingDishesData = document.getElementById('best-selling-dishes-data');
        bestSellingDishesData.innerHTML = ''; // Clear existing data

        if (items.length > 0) {
            items.forEach(item => {
                const dishItem = document.createElement('p');
                dishItem.innerHTML = `${item.name}: <span class="font-bold">${item.quantity_sold}</span> مباع`;
                bestSellingDishesData.appendChild(dishItem);
            });
        } else {
            bestSellingDishesData.innerHTML = '<p>لا توجد بيانات حاليًا.</p>';
        }
    } catch (error) {
        console.error('Error fetching best-selling items:', error);
        document.getElementById('best-selling-dishes-data').innerHTML = '<p>حدث خطأ أثناء تحميل العناصر الأكثر مبيعًا.</p>';
    }
}

async function fetchPremiumCustomers() {
    try {
        const response = await fetch('/api/reports/premium-customers');
        const customers = await response.json();
        const premiumCustomersData = document.getElementById('premium-customers-data');
        premiumCustomersData.innerHTML = ''; // Clear existing data

        if (customers.length > 0) {
            customers.forEach(customer => {
                const customerItem = document.createElement('p');
                customerItem.innerHTML = `${customer.name} (${customer.email}) - إجمالي الإنفاق: <span class="font-bold">${customer.total_spent} ر.ي</span>`;
                premiumCustomersData.appendChild(customerItem);
            });
        } else {
            premiumCustomersData.innerHTML = '<p>لا توجد بيانات حاليًا.</p>';
        }
    } catch (error) {
        console.error('Error fetching premium customers:', error);
        document.getElementById('premium-customers-data').innerHTML = '<p>حدث خطأ أثناء تحميل العملاء المميزين.</p>';
    }
}
