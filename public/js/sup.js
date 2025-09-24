// Accordéon FAQ
document.querySelectorAll('.faq-question').forEach(button => {
    button.addEventListener('click', () => {
        const item = button.parentElement;
        item.classList.toggle('active');
    });
});

// Contact Form (simulé)
document.getElementById('contactForm').addEventListener('submit', e => {
    e.preventDefault();
    alert("Merci pour votre message ! Nous vous répondrons bientôt.");
    e.target.reset();
});
