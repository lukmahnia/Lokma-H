document.addEventListener('DOMContentLoaded', () => {
    fetchSubscriptions();
    fetchUserSubscriptions();

    const subForm = document.getElementById('sub-form');
    subForm.addEventListener('submit', handleFormSubmit);
});

async function fetchSubscriptions() {
    try {
        const response = await fetch('/api/subscriptions');
        const subscriptions = await response.json();
        const subItemsList = document.getElementById('sub-items-list');
        subItemsList.innerHTML = ''; // Clear existing items

        if (subscriptions.length > 0) {
            subscriptions.forEach(sub => {
                const subCard = document.createElement('div');
                subCard.className = 'bg-gray-100 p-4 rounded-lg shadow-md flex items-center space-x-4';
                subCard.innerHTML = `
                    <div class="flex-1">
                        <h4 class="font-bold text-lg">${sub.name} - ${sub.price}</h4>
                        <p class="text-gray-600">${sub.description}</p>
                        <p class="text-gray-600">الوجبات في الأسبوع: ${sub.meals_per_week}</p>
                        <p class="text-gray-600">أيام التوصيل: ${sub.delivery_days}</p>
                    </div>
                    <div class="flex space-x-2">
                        <button onclick="editSubscription(${sub.id}, '${sub.name}', '${sub.price}', '${sub.description}', ${sub.meals_per_week}, '${sub.delivery_days}')" class="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600">تعديل</button>
                        <button onclick="deleteSubscription(${sub.id})" class="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">حذف</button>
                    </div>
                `;
                subItemsList.appendChild(subCard);
            });
        } else {
            subItemsList.innerHTML = '<p>لا توجد باقات اشتراك حاليًا.</p>';
        }
    } catch (error) {
        console.error('Error fetching subscriptions:', error);
        document.getElementById('sub-items-list').innerHTML = '<p>حدث خطأ أثناء تحميل باقات الاشتراك.</p>';
    }
}

async function fetchUserSubscriptions() {
    try {
        const response = await fetch('/api/user_subscriptions');
        const userSubscriptions = await response.json();
        const userSubscriptionsList = document.getElementById('user-subscriptions-list');
        userSubscriptionsList.innerHTML = ''; // Clear existing items

        if (userSubscriptions.length > 0) {
            userSubscriptions.forEach(userSub => {
                const userSubCard = document.createElement('div');
                userSubCard.className = 'bg-gray-100 p-4 rounded-lg shadow-md';
                userSubCard.innerHTML = `
                    <h4 class="font-bold text-lg">${userSub.user_name} - ${userSub.subscription_name}</h4>
                    <p>تاريخ البدء: ${userSub.start_date}</p>
                    <p>تاريخ الانتهاء: ${userSub.end_date}</p>
                `;
                userSubscriptionsList.appendChild(userSubCard);
            });
        } else {
            userSubscriptionsList.innerHTML = '<p>لا يوجد مشتركين حاليًا.</p>';
        }
    } catch (error) {
        console.error('Error fetching user subscriptions:', error);
        document.getElementById('user-subscriptions-list').innerHTML = '<p>حدث خطأ أثناء تحميل المشتركين.</p>';
    }
}

async function handleFormSubmit(event) {
    event.preventDefault();

    const subId = document.getElementById('sub-id').value;
    const name = document.getElementById('sub-name').value;
    const price = document.getElementById('sub-price').value;
    const description = document.getElementById('sub-description').value;
    const meals_per_week = document.getElementById('sub-meals').value;
    const delivery_days = document.getElementById('sub-days').value;

    const method = subId ? 'PUT' : 'POST';
    const url = subId ? `/api/subscriptions/${subId}` : '/api/subscriptions';

    try {
        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, price, description, meals_per_week, delivery_days }),
        });
        const data = await response.json();

        if (data.message === 'success') {
            alert(subId ? 'تم تحديث باقة الاشتراك بنجاح!' : 'تم إضافة باقة اشتراك جديدة بنجاح!');
            // Clear form and refresh list
            document.getElementById('sub-form').reset();
            document.getElementById('sub-id').value = '';
            fetchSubscriptions();
        } else {
            alert('فشل حفظ باقة الاشتراك: ' + data.error);
        }
    } catch (error) {
        console.error('Error saving subscription:', error);
        alert('حدث خطأ أثناء حفظ باقة الاشتراك.');
    }
}

function editSubscription(id, name, price, description, meals_per_week, delivery_days) {
    document.getElementById('sub-id').value = id;
    document.getElementById('sub-name').value = name;
    document.getElementById('sub-price').value = price;
    document.getElementById('sub-description').value = description;
    document.getElementById('sub-meals').value = meals_per_week;
    document.getElementById('sub-days').value = delivery_days;
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

async function deleteSubscription(subId) {
    if (confirm('هل أنت متأكد أنك تريد حذف باقة الاشتراك هذه؟')) {
        try {
            const response = await fetch(`/api/subscriptions/${subId}`, {
                method: 'DELETE',
            });
            const data = await response.json();
            if (data.message === 'success') {
                alert('تم حذف باقة الاشتراك بنجاح!');
                fetchSubscriptions(); // Refresh the list
            } else {
                alert('فشل حذف باقة الاشتراك: ' + data.error);
            }
        } catch (error) {
            console.error('Error deleting subscription:', error);
            alert('حدث خطأ أثناء حذف باقة الاشتراك.');
        }
    }
}
