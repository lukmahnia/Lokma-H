document.addEventListener('DOMContentLoaded', () => {
    fetchMenuItems();

    const menuForm = document.getElementById('menu-form');
    menuForm.addEventListener('submit', handleFormSubmit);
});

async function fetchMenuItems() {
    try {
        const response = await fetch('/api/menu');
        const items = await response.json();
        const menuItemsList = document.getElementById('menu-items-list');
        menuItemsList.innerHTML = ''; // Clear existing items

        if (items.length > 0) {
            items.forEach(item => {
                const menuItemCard = document.createElement('div');
                menuItemCard.className = 'bg-gray-100 p-4 rounded-lg shadow-md flex items-center space-x-4';
                menuItemCard.innerHTML = `
                    <img src="${item.image}" alt="${item.name}" class="w-24 h-24 object-cover rounded-md">
                    <div class="flex-1">
                        <h4 class="font-bold text-lg">${item.name} - ${item.price}</h4>
                        <p class="text-gray-600">${item.description}</p>
                    </div>
                    <div class="flex space-x-2">
                        <button onclick="editMenuItem(${item.id}, '${item.name}', '${item.price}', '${item.description}', '${item.image}')" class="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600">تعديل</button>
                        <button onclick="deleteMenuItem(${item.id})" class="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">حذف</button>
                    </div>
                `;
                menuItemsList.appendChild(menuItemCard);
            });
        } else {
            menuItemsList.innerHTML = '<p>لا توجد عناصر في القائمة حاليًا.</p>';
        }
    } catch (error) {
        console.error('Error fetching menu items:', error);
        document.getElementById('menu-items-list').innerHTML = '<p>حدث خطأ أثناء تحميل عناصر القائمة.</p>';
    }
}

async function handleFormSubmit(event) {
    event.preventDefault();

    const itemId = document.getElementById('item-id').value;
    const name = document.getElementById('item-name').value;
    const price = document.getElementById('item-price').value;
    const description = document.getElementById('item-description').value;
    const image = document.getElementById('item-image').value;

    const method = itemId ? 'PUT' : 'POST';
    const url = itemId ? `/api/menu/${itemId}` : '/api/menu';

    try {
        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, price, description, image }),
        });
        const data = await response.json();

        if (data.message === 'success') {
            alert(itemId ? 'تم تحديث الطبق بنجاح!' : 'تم إضافة طبق جديد بنجاح!');
            // Clear form and refresh list
            document.getElementById('menu-form').reset();
            document.getElementById('item-id').value = '';
            fetchMenuItems();
        } else {
            alert('فشل حفظ الطبق: ' + data.error);
        }
    } catch (error) {
        console.error('Error saving menu item:', error);
        alert('حدث خطأ أثناء حفظ الطبق.');
    }
}

function editMenuItem(id, name, price, description, image) {
    document.getElementById('item-id').value = id;
    document.getElementById('item-name').value = name;
    document.getElementById('item-price').value = price;
    document.getElementById('item-description').value = description;
    document.getElementById('item-image').value = image;
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

async function deleteMenuItem(itemId) {
    if (confirm('هل أنت متأكد أنك تريد حذف هذا الطبق؟')) {
        try {
            const response = await fetch(`/api/menu/${itemId}`, {
                method: 'DELETE',
            });
            const data = await response.json();
            if (data.message === 'success') {
                alert('تم حذف الطبق بنجاح!');
                fetchMenuItems(); // Refresh the list
            } else {
                alert('فشل حذف الطبق: ' + data.error);
            }
        } catch (error) {
            console.error('Error deleting menu item:', error);
            alert('حدث خطأ أثناء حذف الطبق.');
        }
    }
}
