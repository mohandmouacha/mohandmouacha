/**
 * Mohand Mouacha Portfolio - Interactive Script
 * Smooth Slide Navigation, Scroll Snap Observer, Active State Updates, Formspree AJAX Handler
 */

document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const slideContainer = document.querySelector('.slide-container');
    const slides = document.querySelectorAll('.slide');
    const navItems = document.querySelectorAll('.nav-item');
    const dotBtns = document.querySelectorAll('.dot-btn');
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    const contactForm = document.getElementById('contact-form');
    const submitBtn = document.getElementById('submit-btn');
    const formStatus = document.getElementById('form-status');

    let currentSlideIndex = 0;
    let isScrolling = false;

    // --- Slide Observer for Active Slide Detection ---
    const observerOptions = {
        root: null, // use viewport
        threshold: 0.3
    };

    const slideObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const index = Array.from(slides).indexOf(entry.target);
                setActiveSlide(index);
            }
        });
    }, observerOptions);

    slides.forEach(slide => slideObserver.observe(slide));

    // Update Active Slide UI
    function setActiveSlide(index) {
        currentSlideIndex = index;

        // Active class on slide elements
        slides.forEach((slide, i) => {
            if (i === index) {
                slide.classList.add('active-slide');
            } else {
                slide.classList.remove('active-slide');
            }
        });

        // Active class on Nav Links
        navItems.forEach((item, i) => {
            if (i === index) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });

        // Active class on Side Dots
        dotBtns.forEach((dot, i) => {
            if (i === index) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    }

    // --- Navigation Click Handlers ---
    function scrollToSlide(index) {
        if (index >= 0 && index < slides.length) {
            slides[index].scrollIntoView({ behavior: 'smooth' });
        }
    }

    navItems.forEach((item, index) => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            scrollToSlide(index);
            if (navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
            }
        });
    });

    dotBtns.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            scrollToSlide(index);
        });
    });


    // --- Mobile Hamburger Menu ---
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            const icon = mobileMenuToggle.querySelector('i');
            if (navLinks.classList.contains('active')) {
                icon.className = 'fa-solid fa-xmark';
            } else {
                icon.className = 'fa-solid fa-bars';
            }
        });
    }

    // --- Formspree Asynchronous Contact Form Submit ---
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const btnText = submitBtn.querySelector('.btn-text');
            const btnIcon = submitBtn.querySelector('.btn-icon');
            const spinner = submitBtn.querySelector('.spinner');

            // UI Loading state
            submitBtn.disabled = true;
            btnText.classList.add('hidden');
            btnIcon.classList.add('hidden');
            spinner.classList.remove('hidden');

            formStatus.className = 'form-status hidden';

            const formData = new FormData(contactForm);

            try {
                const response = await fetch(contactForm.action, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                });

                if (response.ok) {
                    formStatus.textContent = "✨ Thank you! Your message has been sent successfully. Mohand will get back to you shortly.";
                    formStatus.className = 'form-status success';
                    contactForm.reset();
                } else {
                    const data = await response.json();
                    if (Object.hasOwn(data, 'errors')) {
                        formStatus.textContent = data["errors"].map(error => error["message"]).join(", ");
                    } else {
                        formStatus.textContent = "Oops! There was a problem submitting your form. Please try emailing directly to mohandmouacha0@gmail.com";
                    }
                    formStatus.className = 'form-status error';
                }
            } catch (error) {
                formStatus.textContent = "Oops! Network error submitting form. Please check your connection or contact directly via mohandmouacha0@gmail.com";
                formStatus.className = 'form-status error';
            } finally {
                // Reset button state
                submitBtn.disabled = false;
                btnText.classList.remove('hidden');
                btnIcon.classList.remove('hidden');
                spinner.classList.add('hidden');
            }
        });
    }
});
