const userForm = document.getElementById('user-form');
const usersList = document.getElementById('users-list');
const cancelEditBtn = document.getElementById('cancel-edit');

// Fetch and display users on page load
function fetchUsers() {
    fetch('/api/users')
        .then(response => response.json())
        .then(users => {
            usersList.innerHTML = '';
            users.forEach(user => {
                const userElement = document.createElement('div');
                userElement.className = 'flex items-center justify-between p-4 bg-gray-50 rounded-lg';
                userElement.innerHTML = `
                    <div>
                        <p class="font-bold">${user.name}</p>
                        <p class="text-sm text-gray-600">${user.email}</p>
                        <p class="text-sm text-gray-600">${user.phone}</p>
                    </div>
                    <div>
                        <button class="text-blue-500 hover:text-blue-700 mr-2" onclick="editUser(${user.id}, '${user.name}', '${user.email}', '${user.phone}', '${user.address}', '${user.notes}')">تعديل</button>
                        <button class="text-red-500 hover:text-red-700" onclick="deleteUser(${user.id})">حذف</button>
                    </div>
                `;
                usersList.appendChild(userElement);
            });
        });
}

// Add or edit a user
userForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const id = document.getElementById('user-id').value;
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const address = document.getElementById('address').value;
    const notes = document.getElementById('notes').value;

    const url = id ? `/api/users/${id}` : '/api/users';
    const method = id ? 'PUT' : 'POST';

    fetch(url, {
        method: method,
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, email, phone, address, notes })
    })
    .then(() => {
        userForm.reset();
        cancelEditBtn.style.display = 'none';
        fetchUsers();
    });
});

// Edit a user
function editUser(id, name, email, phone, address, notes) {
    document.getElementById('user-id').value = id;
    document.getElementById('name').value = name;
    document.getElementById('email').value = email;
    document.getElementById('phone').value = phone;
    document.getElementById('address').value = address;
    document.getElementById('notes').value = notes;
    cancelEditBtn.style.display = 'block';
}

// Cancel editing
cancelEditBtn.addEventListener('click', () => {
    userForm.reset();
    cancelEditBtn.style.display = 'none';
});

// Delete a user
function deleteUser(id) {
    fetch(`/api/users/${id}`, {
        method: 'DELETE'
    })
    .then(() => {
        fetchUsers();
    });
}

// Initial fetch of users
fetchUsers();
