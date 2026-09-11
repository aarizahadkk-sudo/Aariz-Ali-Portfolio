/**
 * ASP.NET Core Portfolio - Client-side Interactive Logic
 * Handles hidden padlock login modal, smooth scrolling, project filtering,
 * and pre-filled Gmail compose link generation.
 */

document.addEventListener('DOMContentLoaded', () => {
    initSmoothScroll();
    initProjectFilters();
    initHiddenAdminAuth();
});

/**
 * 1. Smooth scrolling for internal anchor links
 */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElem = document.querySelector(targetId);
            if (targetElem) {
                e.preventDefault();
                targetElem.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

/**
 * 2. Projects category filter logic
 */
function initProjectFilters() {
    const filterBtns = document.querySelectorAll('.btn-filter');
    const projectItems = document.querySelectorAll('.project-item');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');

            const filterValue = this.getAttribute('data-filter');

            projectItems.forEach(item => {
                const category = item.getAttribute('data-category');
                if (filterValue === 'all' || category === filterValue) {
                    item.style.display = 'block';
                    item.style.opacity = '0';
                    setTimeout(() => {
                        item.style.transition = 'opacity 0.3s ease';
                        item.style.opacity = '1';
                    }, 50);
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });
}

/**
 * 3. Hidden Admin Padlock Authentication modal handling
 */
function initHiddenAdminAuth() {
    const form = document.getElementById('hiddenLoginForm');
    const errorAlert = document.getElementById('loginErrorAlert');

    if (!form) return;

    form.addEventListener('submit', async function (e) {
        e.preventDefault();
        if (errorAlert) {
            errorAlert.classList.add('d-none');
            errorAlert.innerText = '';
        }

        const formData = new FormData(form);

        try {
            const response = await fetch(form.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'X-Requested-With': 'XMLHttpRequest'
                }
            });

            if (response.ok) {
                const data = await response.json();
                if (data.success) {
                    window.location.href = data.redirectUrl || '/Admin';
                    return;
                } else if (errorAlert) {
                    errorAlert.innerText = data.message || 'Authentication failed. Please check credentials.';
                    errorAlert.classList.remove('d-none');
                }
            } else {
                if (errorAlert) {
                    errorAlert.innerText = 'Server error during authentication attempt.';
                    errorAlert.classList.remove('d-none');
                }
            }
        } catch (err) {
            // If AJAX is blocked or standard POST fallback
            form.submit();
        }
    });
}

/**
 * 4. Interactive Contact Form: Dynamically construct pre-filled Gmail compose link
 * Target Email: Aarizahadkk@gmail.com
 */
const TARGET_EMAIL = 'Aarizahadkk@gmail.com';

function handleContactSubmit(event) {
    event.preventDefault();

    const nameInput = document.getElementById('contactName');
    const emailInput = document.getElementById('contactEmail');
    const subjectInput = document.getElementById('contactSubject');
    const messageInput = document.getElementById('contactMessage');

    const name = nameInput ? nameInput.value.trim() : '';
    const email = emailInput ? emailInput.value.trim() : '';
    const userSubject = subjectInput ? subjectInput.value.trim() : 'Project Inquiry';
    const userMessage = messageInput ? messageInput.value.trim() : '';

    const subject = encodeURIComponent(`[Portfolio Contact] ${userSubject}`);
    const bodyContent = 
`Hello Aariz,

${userMessage}

---------------------------
Sender Information:
Name: ${name}
Email: ${email}
Timestamp: ${new Date().toUTCString()}
Reference: ASP.NET Core Portfolio Ingestion`;

    const body = encodeURIComponent(bodyContent);

    // Primary: Google Mail Web Compose URL
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(TARGET_EMAIL)}&su=${subject}&body=${body}`;

    // Attempt opening Gmail Web Compose in a new tab
    const opened = window.open(gmailUrl, '_blank', 'noopener,noreferrer');

    // Fallback to mailto: protocol if popup blocked or user prefers local client
    if (!opened || opened.closed || typeof opened.closed === 'undefined') {
        window.location.href = `mailto:${TARGET_EMAIL}?subject=${subject}&body=${body}`;
    }
}

function sendViaMailto() {
    const name = document.getElementById('contactName')?.value.trim() || 'Colleague';
    const email = document.getElementById('contactEmail')?.value.trim() || '';
    const userSubject = document.getElementById('contactSubject')?.value.trim() || 'Inquiry';
    const userMessage = document.getElementById('contactMessage')?.value.trim() || '';

    const subject = encodeURIComponent(`[Portfolio Contact] ${userSubject}`);
    const body = encodeURIComponent(`Hello Aariz,\n\n${userMessage}\n\nFrom: ${name} (${email})`);
    
    window.location.href = `mailto:${TARGET_EMAIL}?subject=${subject}&body=${body}`;
}
