'use strict';

// ============== PRELOADER (NEW) ==============
const preloader = document.querySelector("#preloader");
const body = document.body;

window.addEventListener("load", function () {
    // Hide preloader after window load
    if (preloader) {
        preloader.classList.add("remove");
        body.classList.add("loaded");
    }
});

// ============== NAVBAR TOGGLE ==============
const navbar = document.querySelector("[data-navbar]");
const navToggler = document.querySelector("[data-nav-toggler]");

if (navToggler) {
    navToggler.addEventListener("click", function () {
        navbar.classList.toggle("active");
    });
}

// Close navbar when clicking on nav links (mobile)
const navLinks = document.querySelectorAll(".navbar-link");
navLinks.forEach(link => {
    link.addEventListener("click", function () {
        navbar.classList.remove("active");
    });
});

// ============== HEADER SCROLL EFFECT ==============
const header = document.querySelector("[data-header]");

window.addEventListener("scroll", function () {
    if (header) {
        header.classList[this.scrollY > 50 ? "add" : "remove"]("active");
    }
});

// ============== SCROLL REVEAL ANIMATION ==============
const revealElements = document.querySelectorAll(".reveal-element");

const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add("revealed");
            observer.unobserve(entry.target); // Only animate once
        }
    });
}, {
    root: null,
    threshold: 0.15, // Trigger when 15% of element is visible
});

revealElements.forEach(el => revealObserver.observe(el));

// ============== ACTIVE LINK HIGHLIGHTER ==============
const sections = document.querySelectorAll("section[id]");

function scrollActive() {
    const scrollY = window.pageYOffset;

    sections.forEach(current => {
        const sectionHeight = current.offsetHeight;
        const sectionTop = current.offsetTop - 100; // Offset for header height
        const sectionId = current.getAttribute("id");
        const navLink = document.querySelector(`.navbar a[href*=${sectionId}]`);

        if (navLink) {
            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                navLink.classList.add("active-link");
            } else {
                navLink.classList.remove("active-link");
            }
        }
    });
}
window.addEventListener("scroll", scrollActive);

// ============== MOBILE WARNING POPUP ==============
const mobileWarning = document.getElementById("mobileWarning");
const warningBtn = document.getElementById("warningBtn");

// Function to handle body scroll
const toggleBodyScroll = (disable) => {
    // Only toggle if body doesn't already have 'loaded' (handled by preloader)
    // or if we strictly need to lock it again
    if (disable) {
        document.body.style.overflow = "hidden";
    } else {
        document.body.style.overflow = "";
    }
}

// Check if device is mobile (width < 768px) and warning hasn't been dismissed in this session
const isMobile = window.innerWidth <= 768;
const hasDismissedWarning = sessionStorage.getItem("mobileWarningDismissed");

if (isMobile && !hasDismissedWarning && mobileWarning) {
    // Timeout extended to ensure preloader finishes first, 
    // though preloader sits on top via z-index anyway.
    setTimeout(() => {
        mobileWarning.classList.add("active");
        toggleBodyScroll(true);
    }, 2000); 
}

if (warningBtn) {
    warningBtn.addEventListener("click", function () {
        mobileWarning.classList.remove("active");
        toggleBodyScroll(false);
        // Save dismissal to session storage so it doesn't pop up again on refresh
        sessionStorage.setItem("mobileWarningDismissed", "true");
    });
}

// ============== CONTACT FORM HANDLING ==============
const contactForm = document.getElementById("contactForm");
const formMessage = document.getElementById("formMessage");

if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
        e.preventDefault();

        // 1. Get form values
        const name = document.getElementById("name").value.trim();
        const email = document.getElementById("email").value.trim();
        const message = document.getElementById("message").value.trim();

        // 2. Basic validation
        if (!name || !email || !message) {
            showMessage("Please fill in all fields.", "error");
            return;
        }

        // 3. Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showMessage("Please enter a valid email address.", "error");
            return;
        }

        // 4. UI: Show loading state
        const submitBtn = contactForm.querySelector("button[type='submit']");
        const originalBtnText = submitBtn.querySelector(".span").textContent;
        submitBtn.querySelector(".span").textContent = "Sending...";
        submitBtn.disabled = true;

        // 5. Send via EmailJS
        emailjs.sendForm('service_7ztlwro', 'template_e5777l2', this)
            .then(function () {
                // Success
                showMessage("Thank you! Your message has been sent successfully.", "success");
                contactForm.reset();
            }, function (error) {
                // Error
                console.error('EmailJS Error:', error);
                showMessage("Failed to send message. Please try again later.", "error");
            })
            .finally(function () {
                // Reset button state regardless of success/failure
                submitBtn.querySelector(".span").textContent = originalBtnText;
                submitBtn.disabled = false;
            });
    });
}

function showMessage(text, type) {
    if (!formMessage) return;

    formMessage.textContent = text;
    formMessage.className = `form-message ${type}`;

    // Auto-hide after 5 seconds
    setTimeout(() => {
        formMessage.className = "form-message";
        formMessage.textContent = ""; // Clear text
    }, 5000);
}