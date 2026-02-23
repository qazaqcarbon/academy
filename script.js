document.addEventListener('DOMContentLoaded', () => {
    const navbar = document.getElementById('navbar');
    
    // Change navbar on scroll
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.style.backgroundColor = 'rgba(255, 255, 255, 0.98)';
            navbar.style.boxShadow = '0 4px 20px rgba(0,0,0,0.05)';
        } else {
            navbar.style.backgroundColor = 'rgba(231, 232, 234, 0.95)';
            navbar.style.boxShadow = 'none';
        }
    });

    // Smooth scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if(targetId === '#') return;
            
            const target = document.querySelector(targetId);
            if(target) {
                window.scrollTo({
                    top: target.offsetTop - 80, // Offset for sticky header
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Simple reveal animation observer
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = 1;
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Apply reveal to some elements dynamically
    const revealElements = document.querySelectorAll('.feature-card, .timeline-step, .module-card');
    revealElements.forEach(el => {
        el.style.opacity = 0;
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        observer.observe(el);
    });
});
