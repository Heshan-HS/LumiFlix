// Contact Form Handler
console.log('📧 Contact form script loaded');

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('contact-form');
    const successMessage = document.getElementById('form-success');

    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            console.log('📨 Form submitted');

            // Get form data
            const formData = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                subject: document.getElementById('subject').value,
                message: document.getElementById('message').value,
                timestamp: new Date().toISOString()
            };

            console.log('Form data:', formData);

            // Show loading state
            const submitBtn = form.querySelector('.submit-btn');
            const btnText = submitBtn.querySelector('.btn-text');
            const btnLoader = submitBtn.querySelector('.btn-loader');
            
            btnText.style.display = 'none';
            btnLoader.style.display = 'inline-block';
            submitBtn.disabled = true;

            try {
                // Save to Firebase Firestore
                if (typeof firebase !== 'undefined' && firebase.firestore) {
                    await firebase.firestore().collection('contact_messages').add(formData);
                    console.log('✅ Message saved to Firestore');
                } else {
                    console.warn('⚠️ Firebase not available, simulating success');
                }

                // Show success message
                form.style.display = 'none';
                successMessage.style.display = 'flex';

                // Reset form after 3 seconds
                setTimeout(() => {
                    form.reset();
                    form.style.display = 'flex';
                    successMessage.style.display = 'none';
                    btnText.style.display = 'inline-block';
                    btnLoader.style.display = 'none';
                    submitBtn.disabled = false;
                }, 3000);

            } catch (error) {
                console.error('❌ Error sending message:', error);
                alert('Failed to send message. Please try again.');
                
                // Reset button state
                btnText.style.display = 'inline-block';
                btnLoader.style.display = 'none';
                submitBtn.disabled = false;
            }
        });

        console.log('✅ Contact form handler set up');
    }
});
