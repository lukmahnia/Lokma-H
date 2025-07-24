document.addEventListener('DOMContentLoaded', () => {
    fetchPromotions();

    const promoForm = document.getElementById('promo-form');
    promoForm.addEventListener('submit', handleFormSubmit);
});

async function fetchPromotions() {
    try {
        const response = await fetch('/api/promotions');
        const promotions = await response.json();
        const promoItemsList = document.getElementById('promo-items-list');
        promoItemsList.innerHTML = ''; // Clear existing items

        if (promotions.length > 0) {
            promotions.forEach(promo => {
                const promoCard = document.createElement('div');
                promoCard.className = 'bg-gray-100 p-4 rounded-lg shadow-md flex items-center space-x-4';
                promoCard.innerHTML = `
                    <div class="flex-1">
                        <h4 class="font-bold text-lg">${promo.name}</h4>
                        <p class="text-gray-600">${promo.description}</p>
                        <p class="text-gray-600">نسبة الخصم: ${promo.discount_percentage}%</p>
                        <p class="text-gray-600">تاريخ البدء: ${promo.start_date}</p>
                        <p class="text-gray-600">تاريخ الانتهاء: ${promo.end_date}</p>
                        <p class="text-gray-600">العناصر القابلة للتطبيق: ${promo.applicable_items}</p>
                    </div>
                    <div class="flex space-x-2">
                        <button onclick="editPromotion(${promo.id}, '${promo.name}', '${promo.description}', ${promo.discount_percentage}, '${promo.start_date}', '${promo.end_date}', '${promo.applicable_items}')" class="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600">تعديل</button>
                        <button onclick="deletePromotion(${promo.id})" class="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">حذف</button>
                    </div>
                `;
                promoItemsList.appendChild(promoCard);
            });
        } else {
            promoItemsList.innerHTML = '<p>لا توجد عروض حاليًا.</p>';
        }
    } catch (error) {
        console.error('Error fetching promotions:', error);
        document.getElementById('promo-items-list').innerHTML = '<p>حدث خطأ أثناء تحميل العروض.</p>';
    }
}

async function handleFormSubmit(event) {
    event.preventDefault();

    const promoId = document.getElementById('promo-id').value;
    const name = document.getElementById('promo-name').value;
    const description = document.getElementById('promo-description').value;
    const discount_percentage = document.getElementById('promo-discount').value;
    const start_date = document.getElementById('promo-start-date').value;
    const end_date = document.getElementById('promo-end-date').value;
    const applicable_items = document.getElementById('promo-applicable-items').value;

    const method = promoId ? 'PUT' : 'POST';
    const url = promoId ? `/api/promotions/${promoId}` : '/api/promotions';

    try {
        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, description, discount_percentage, start_date, end_date, applicable_items }),
        });
        const data = await response.json();

        if (response.ok) {
            alert(promoId ? 'تم تحديث العرض بنجاح!' : 'تم إضافة عرض جديد بنجاح!');
            // Clear form and refresh list
            document.getElementById('promo-form').reset();
            document.getElementById('promo-id').value = '';
            fetchPromotions();
        } else {
            alert('فشل حفظ العرض: ' + data.error);
        }
    } catch (error) {
        console.error('Error saving promotion:', error);
        alert('حدث خطأ أثناء حفظ العرض.');
    }
}

function editPromotion(id, name, description, discount_percentage, start_date, end_date, applicable_items) {
    document.getElementById('promo-id').value = id;
    document.getElementById('promo-name').value = name;
    document.getElementById('promo-description').value = description;
    document.getElementById('promo-discount').value = discount_percentage;
    document.getElementById('promo-start-date').value = start_date;
    document.getElementById('promo-end-date').value = end_date;
    document.getElementById('promo-applicable-items').value = applicable_items;
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

async function deletePromotion(promoId) {
    if (confirm('هل أنت متأكد أنك تريد حذف هذا العرض؟')) {
        try {
            const response = await fetch(`/api/promotions/${promoId}`, {
                method: 'DELETE',
            });
            const data = await response.json();
            if (data.message === 'success') {
                alert('تم حذف العرض بنجاح!');
                fetchPromotions(); // Refresh the list
            } else {
                alert('فشل حذف العرض: ' + data.error);
            }
        } catch (error) {
            console.error('Error deleting promotion:', error);
            alert('حدث خطأ أثناء حذف العرض.');
        }
    }
}
