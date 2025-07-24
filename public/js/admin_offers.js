// Fetch and display offers
const offerForm = document.getElementById('offer-form');
const offersList = document.getElementById('offers-list');

// Fetch and display offers on page load
fetch('/api/offers')
    .then(response => response.json())
    .then(offers => {
        offersList.innerHTML = '';
        offers.forEach(offer => {
            const offerElement = document.createElement('div');
            offerElement.className = 'flex items-center justify-between p-4 bg-gray-50 rounded-lg';
            offerElement.innerHTML = `
                <div>
                    <p class="font-bold">${offer.name}</p>
                    <p class="text-sm text-gray-600">${offer.description}</p>
                    <p class="text-sm text-gray-600">${offer.price}</p>
                </div>
                <div>
                    <button class="text-blue-500 hover:text-blue-700 mr-2" onclick='editOffer(${offer.id}, "${offer.name}", "${offer.price}", "${offer.description}", "${offer.image}")'>تعديل</button>
                    <button class="text-red-500 hover:text-red-700" onclick="deleteOffer(${offer.id})">حذف</button>
                </div>
            `;
            offersList.appendChild(offerElement);
        });
    });

// Handle form submission for adding/editing offers
offerForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(offerForm);
    const offerId = formData.get('offerId');
    const data = Object.fromEntries(formData.entries());

    const url = offerId ? `/api/offers/${offerId}` : '/api/offers';
    const method = offerId ? 'PUT' : 'POST';

    fetch(url, {
        method: method,
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(() => {
        // Refresh the list of offers
        location.reload();
    });
});

// Edit an offer
function editOffer(id, name, price, description, image) {
    document.getElementById('offer-id').value = id;
    document.getElementById('offer-name').value = name;
    document.getElementById('offer-price').value = price;
    document.getElementById('offer-description').value = description;
    document.getElementById('offer-image').value = image;
}

// Delete an offer
function deleteOffer(id) {
    fetch(`/api/offers/${id}`, {
        method: 'DELETE'
    })
    .then(() => {
        // Refresh the list of offers
        location.reload();
    });
}
