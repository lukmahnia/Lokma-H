document.addEventListener('DOMContentLoaded', () => {
    fetchHealthyMeals();

    const healthyForm = document.getElementById('healthy-form');
    healthyForm.addEventListener('submit', handleFormSubmit);
});

async function fetchHealthyMeals() {
    try {
        const response = await fetch('/api/healthy-meals');
        const meals = await response.json();
        const healthyItemsList = document.getElementById('healthy-items-list');
        healthyItemsList.innerHTML = ''; // Clear existing items

        if (meals.length > 0) {
            meals.forEach(meal => {
                const mealCard = document.createElement('div');
                mealCard.className = 'bg-gray-100 p-4 rounded-lg shadow-md flex items-center space-x-4';
                mealCard.innerHTML = `
                    <img src="${meal.image}" alt="${meal.name}" class="w-24 h-24 object-cover rounded-md">
                    <div class="flex-1">
                        <h4 class="font-bold text-lg">${meal.name} - ${meal.price}</h4>
                        <p class="text-gray-600">${meal.description}</p>
                        <p class="text-gray-600">السعرات الحرارية: ${meal.calories}</p>
                        <p class="text-gray-600">نوع الحمية: ${meal.diet_type}</p>
                    </div>
                    <div class="flex space-x-2">
                        <button onclick="editHealthyMeal(${meal.id}, '${meal.name}', '${meal.price}', '${meal.description}', '${meal.image}', ${meal.calories}, '${meal.diet_type}')" class="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600">تعديل</button>
                        <button onclick="deleteHealthyMeal(${meal.id})" class="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">حذف</button>
                    </div>
                `;
                healthyItemsList.appendChild(mealCard);
            });
        } else {
            healthyItemsList.innerHTML = '<p>لا توجد وجبات صحية حاليًا.</p>';
        }
    } catch (error) {
        console.error('Error fetching healthy meals:', error);
        document.getElementById('healthy-items-list').innerHTML = '<p>حدث خطأ أثناء تحميل الوجبات الصحية.</p>';
    }
}

async function handleFormSubmit(event) {
    event.preventDefault();

    const healthyId = document.getElementById('healthy-id').value;
    const name = document.getElementById('healthy-name').value;
    const price = document.getElementById('healthy-price').value;
    const description = document.getElementById('healthy-description').value;
    const image = document.getElementById('healthy-image').value;
    const calories = document.getElementById('healthy-calories').value;
    const diet_type = document.getElementById('healthy-diet-type').value;

    const method = healthyId ? 'PUT' : 'POST';
    const url = healthyId ? `/api/healthy-meals/${healthyId}` : '/api/healthy-meals';

    try {
        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, price, description, image, calories, diet_type }),
        });
        const data = await response.json();

        if (data.message === 'success') {
            alert(healthyId ? 'تم تحديث الوجبة الصحية بنجاح!' : 'تم إضافة وجبة صحية جديدة بنجاح!');
            // Clear form and refresh list
            document.getElementById('healthy-form').reset();
            document.getElementById('healthy-id').value = '';
            fetchHealthyMeals();
        } else {
            alert('فشل حفظ الوجبة الصحية: ' + data.error);
        }
    } catch (error) {
        console.error('Error saving healthy meal:', error);
        alert('حدث خطأ أثناء حفظ الوجبة الصحية.');
    }
}

function editHealthyMeal(id, name, price, description, image, calories, diet_type) {
    document.getElementById('healthy-id').value = id;
    document.getElementById('healthy-name').value = name;
    document.getElementById('healthy-price').value = price;
    document.getElementById('healthy-description').value = description;
    document.getElementById('healthy-image').value = image;
    document.getElementById('healthy-calories').value = calories;
    document.getElementById('healthy-diet-type').value = diet_type;
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

async function deleteHealthyMeal(healthyId) {
    if (confirm('هل أنت متأكد أنك تريد حذف هذه الوجبة الصحية؟')) {
        try {
            const response = await fetch(`/api/healthy-meals/${healthyId}`, {
                method: 'DELETE',
            });
            const data = await response.json();
            if (data.message === 'success') {
                alert('تم حذف الوجبة الصحية بنجاح!');
                fetchHealthyMeals(); // Refresh the list
            } else {
                alert('فشل حذف الوجبة الصحية: ' + data.error);
            }
        } catch (error) {
            console.error('Error deleting healthy meal:', error);
            alert('حدث خطأ أثناء حذف الوجبة الصحية.');
        }
    }
}
