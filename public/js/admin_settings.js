document.addEventListener('DOMContentLoaded', () => {
    fetchSettings();

    const settingsForm = document.getElementById('settings-form');
    settingsForm.addEventListener('submit', handleFormSubmit);
});

async function fetchSettings() {
    try {
        const response = await fetch('/api/settings');
        const settings = await response.json();
        if (settings) {
            document.getElementById('working-hours').value = settings.working_hours || '';
            document.getElementById('delivery-companies').value = settings.delivery_companies || '';
            document.getElementById('payment-settings').value = settings.payment_settings || '';
        } else {
            console.log('No settings found or error fetching settings.');
        }
    } catch (error) {
        console.error('Error fetching settings:', error);
        alert('حدث خطأ أثناء تحميل الإعدادات.');
    }
}

async function handleFormSubmit(event) {
    event.preventDefault();

    const working_hours = document.getElementById('working-hours').value;
    const delivery_companies = document.getElementById('delivery-companies').value;
    const payment_settings = document.getElementById('payment-settings').value;

    try {
        const response = await fetch('/api/settings', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ working_hours, delivery_companies, payment_settings }),
        });
        const data = await response.json();

        if (response.ok) {
            alert('تم حفظ الإعدادات بنجاح!');
        } else {
            alert('فشل حفظ الإعدادات: ' + data.error);
        }
    } catch (error) {
        console.error('Error saving settings:', error);
        alert('حدث خطأ أثناء حفظ الإعدادات.');
    }
}