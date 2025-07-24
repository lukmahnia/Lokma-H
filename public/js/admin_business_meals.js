document.addEventListener('DOMContentLoaded', () => {
    fetchBusinessMeals();

    const businessForm = document.getElementById('business-form');
    businessForm.addEventListener('submit', handleFormSubmit);
});

async function fetchBusinessMeals() {
    try {
        const response = await fetch('/api/business-meals');
        const meals = await response.json();
        const businessItemsList = document.getElementById('business-items-list');
        businessItemsList.innerHTML = ''; // Clear existing items

        if (meals.length > 0) {
            meals.forEach(meal => {
                const mealCard = document.createElement('div');
                mealCard.className = 'bg-gray-100 p-4 rounded-lg shadow-md flex items-center space-x-4';
                mealCard.innerHTML = `
                    <img src="${meal.image}" alt="${meal.name}" class="w-24 h-24 object-cover rounded-md">
                    <div class="flex-1">
                        <h4 class="font-bold text-lg">${meal.name} - ${meal.price}</h4>
                        <p class="text-gray-600">${meal.description}</p>
                        <p class="text-gray-600">عدد الأشخاص: ${meal.people_count}</p>
                    </div>
                    <div class="flex space-x-2">
                        <button onclick="editBusinessMeal(${meal.id}, '${meal.name}', '${meal.price}', '${meal.description}', '${meal.image}', ${meal.people_count})" class="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600">تعديل</button>
                        <button onclick="deleteBusinessMeal(${meal.id})" class="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">حذف</button>
                    </div>
                `;
                businessItemsList.appendChild(mealCard);
            });
        } else {
            businessItemsList.innerHTML = '<p>لا توجد وجبات أعمال حاليًا.</p>';
        }
    } catch (error) {
        console.error('Error fetching business meals:', error);
        document.getElementById('business-items-list').innerHTML = '<p>حدث خطأ أثناء تحميل وجبات الأعمال.</p>';
    }
}

async function handleFormSubmit(event) {
    event.preventDefault();

    const businessId = document.getElementById('business-id').value;
    const name = document.getElementById('business-name').value;
    const price = document.getElementById('business-price').value;
    const description = document.getElementById('business-description').value;
    const image = document.getElementById('business-image').value;
    const people_count = document.getElementById('business-people-count').value;

    const method = businessId ? 'PUT' : 'POST';
    const url = businessId ? `/api/business-meals/${businessId}` : '/api/business-meals';

    try {
        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, price, description, image, people_count }),
        });
        const data = await response.json();

        if (data.message === 'success') {
            alert(businessId ? 'تم تحديث وجبة الأعمال بنجاح!' : 'تم إضافة وجبة أعمال جديدة بنجاح!');
            // Clear form and refresh list
            document.getElementById('business-form').reset();
            document.getElementById('business-id').value = '';
            fetchBusinessMeals();
        } else {
            alert('فشل حفظ وجبة الأعمال: ' + data.error);
        }
    } catch (error) {
        console.error('Error saving business meal:', error);
        alert('حدث خطأ أثناء حفظ وجبة الأعمال.');
    }
}

function editBusinessMeal(id, name, price, description, image, people_count) {
    document.getElementById('business-id').value = id;
    document.getElementById('business-name').value = name;
    document.getElementById('business-price').value = price;
    document.getElementById('business-description').value = description;
    document.getElementById('business-image').value = image;
    document.getElementById('business-people-count').value = people_count;
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

async function deleteBusinessMeal(businessId) {
    if (confirm('هل أنت متأكد أنك تريد حذف وجبة الأعمال هذه؟')) {
        try {
            const response = await fetch(`/api/business-meals/${businessId}`, {
                method: 'DELETE',
            });
            const data = await response.json();
            if (data.message === 'success') {
                alert('تم حذف وجبة الأعمال بنجاح!');
                fetchBusinessMeals(); // Refresh the list
            } else {
                alert('فشل حذف وجبة الأعمال: ' + data.error);
            }
        } catch (error) {
            console.error('Error deleting business meal:', error);
            alert('حدث خطأ أثناء حذف وجبة الأعمال.');
        }
    }
}
