document.addEventListener('DOMContentLoaded', () => {
    fetchOrders();
});

async function fetchOrders() {
    try {
        const response = await fetch('/api/orders');
        const orders = await response.json();
        const ordersList = document.getElementById('orders-list');
        ordersList.innerHTML = ''; // Clear existing orders

        if (orders.length > 0) {
            orders.forEach(order => {
                const orderCard = document.createElement('div');
                orderCard.className = 'bg-gray-100 p-4 rounded-lg shadow-md';
                orderCard.innerHTML = `
                    <h4 class="font-bold text-lg mb-2">الطلب رقم: ${order.id}</h4>
                    <p><strong>العميل:</strong> ${order.user_name}</p>
                    <p><strong>الإجمالي:</strong> ${order.total_price} ر.ي</p>
                    <p><strong>الحالة:</strong> <span id="status-${order.id}">${order.status}</span></p>
                    <div class="mt-4 flex space-x-2">
                        <button onclick="updateOrderStatus(${order.id}, 'قيد التوصيل')" class="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600">قيد التوصيل</button>
                        <button onclick="updateOrderStatus(${order.id}, 'مكتمل')" class="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600">مكتمل</button>
                        <button onclick="deleteOrder(${order.id})" class="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">حذف</button>
                    </div>
                `;
                ordersList.appendChild(orderCard);
            });
        } else {
            ordersList.innerHTML = '<p>لا توجد طلبات حالية.</p>';
        }
    } catch (error) {
        console.error('Error fetching orders:', error);
        document.getElementById('orders-list').innerHTML = '<p>حدث خطأ أثناء تحميل الطلبات.</p>';
    }
}

async function updateOrderStatus(orderId, newStatus) {
    try {
        const response = await fetch(`/api/orders/${orderId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ status: newStatus }),
        });
        const data = await response.json();
        if (data.message === 'success') {
            document.getElementById(`status-${orderId}`).innerText = newStatus;
            alert('تم تحديث حالة الطلب بنجاح!');
        } else {
            alert('فشل تحديث حالة الطلب: ' + data.error);
        }
    } catch (error) {
        console.error('Error updating order status:', error);
        alert('حدث خطأ أثناء تحديث حالة الطلب.');
    }
}

async function deleteOrder(orderId) {
    if (confirm('هل أنت متأكد أنك تريد حذف هذا الطلب؟')) {
        try {
            const response = await fetch(`/api/orders/${orderId}`, {
                method: 'DELETE',
            });
            const data = await response.json();
            if (data.message === 'success') {
                alert('تم حذف الطلب بنجاح!');
                fetchOrders(); // Refresh the list
            } else {
                alert('فشل حذف الطلب: ' + data.error);
            }
        } catch (error) {
            console.error('Error deleting order:', error);
            alert('حدث خطأ أثناء حذف الطلب.');
        }
    }
}
