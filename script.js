// Initialize everything when the document is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Mobile Menu Toggle
    document.querySelector('.mobile-menu').addEventListener('click', function() {
        document.querySelector('.nav-links').classList.toggle('active');
    });

    // Add guest functionality
    const addPersonBtn = document.getElementById('addPersonBtn');
    const namesContainer = document.getElementById('namesContainer');
    let guestCount = 1;

    if (addPersonBtn && namesContainer) {
        addPersonBtn.addEventListener('click', function() {
            guestCount++;
            const newFormGroup = document.createElement('div');
            newFormGroup.className = 'form-group';
            newFormGroup.innerHTML = `
                <label for="fullName${guestCount}" data-translate="rsvpFormNameLabel">Nome Completo:</label>
                <div class="name-input-group">
                    <input type="text" id="fullName${guestCount}" name="fullName[]" required>
                    <button type="button" class="remove-name-btn" onclick="this.parentElement.parentElement.remove()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            `;
            namesContainer.appendChild(newFormGroup);
        });
    }

    // Card Flip Animation
    const flipCardInner = document.querySelector('.flip-card-inner');
    let isFront = true;
    let isAnimating = false;

    // Function to switch images
    window.switchImage = function() {
        if (isAnimating) return; // Prevent multiple clicks during animation
        isAnimating = true;
        
        if (isFront) {
            // If on front, flip to back and stay there
            flipCardInner.classList.add('flip-active');
            setTimeout(() => {
                isFront = false;
                isAnimating = false;
            }, 400);
        } else {
            // If on back, flip to front, wait 2 seconds, then flip back
            flipCardInner.classList.remove('flip-active');
            setTimeout(() => {
                isFront = true;
                isAnimating = false;
                
                // After showing front for 2 seconds, flip to back
                setTimeout(() => {
                    flipCardInner.classList.add('flip-active');
                    setTimeout(() => {
                        isFront = false;
                        isAnimating = false;
                    }, 400);
                }, 2000);
            }, 400);
        }
    };

    // Initial automatic switch after 2 seconds
    setTimeout(window.switchImage, 2000);

    // Add click handler to switch images
    flipCardInner.addEventListener('click', window.switchImage);

    // Smooth Scrolling for Navigation
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 70, // Accounting for fixed header
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                document.querySelector('.nav-links').classList.remove('active');

                // If clicking hero link or invitation link, trigger flip card animation
                if (targetId === '#hero' || targetId === '#invitation') {
                    window.switchImage();
                }
            }
        });
    });

    // Form submission handling
    document.getElementById('rsvpForm').addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const form = this;
        const submitBtn = form.querySelector('.submit-btn');
        const successMessage = form.nextElementSibling;
        const currentLang = document.documentElement.lang;
        
        // Disable submit button and show loading state
        submitBtn.disabled = true;
        submitBtn.textContent = translations[currentLang].rsvpFormSending;
        
        try {
            const formData = new FormData(form);
            const names = formData.getAll('fullName[]');
            const attendance = formData.get('attendance');
            const song = formData.get('song');

            // Send each name as a separate request
            for (const name of names) {
                const data = {
                    name: name,
                    attendance: attendance === 'yes' ? 'Sim' : 'Não',
                    song: song
                };

                const response = await fetch('https://script.google.com/macros/s/AKfycbzTHrrPcd0PgLBKkYX4HpqXBqm2TXIOWEfjxZSa-EnOxh9kkC601axFUP6oPSQlnf_r/exec', {
                    method: 'POST',
                    mode: 'no-cors',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data)
                });
            }

            // Show success toast
            showToast(translations[currentLang].rsvpFormSuccessToast, 'success');
            
            // Hide form and show success message
            form.style.display = 'none';
            successMessage.classList.add('show');
            
        } catch (error) {
            // Show error toast
            showToast(translations[currentLang].rsvpFormErrorToast, 'error');
        } finally {
            // Re-enable submit button
            submitBtn.disabled = false;
            submitBtn.textContent = translations[currentLang].rsvpFormSubmit;
        }
    });
});

// Toast notification function
function showToast(message, type = 'success') {
    const toastContainer = document.querySelector('.toast-container');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
        <span>${message}</span>
    `;
    
    toastContainer.appendChild(toast);
    
    // Trigger reflow
    toast.offsetHeight;
    
    // Show toast
    toast.classList.add('show');
    
    // Remove toast after 3 seconds
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            toastContainer.removeChild(toast);
        }, 300);
    }, 3000);
} 