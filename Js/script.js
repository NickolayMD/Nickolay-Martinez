document.addEventListener("DOMContentLoaded", function() {
    
    // --- 1. Accordion Logic ---
    var acc = document.getElementsByClassName("accordion");
    var i;

    for (i = 0; i < acc.length; i++) {
        acc[i].addEventListener("click", function() {
            this.classList.toggle("active");
            
            var panel = this.nextElementSibling;
            if (panel.style.maxHeight) {
                panel.style.maxHeight = null;
                this.querySelector('.icon').style.transform = "rotate(0deg)";
            } else {
                panel.style.maxHeight = panel.scrollHeight + "px";
                this.querySelector('.icon').style.transform = "rotate(180deg)";
                this.querySelector('.icon').style.display = "inline-block";
                this.querySelector('.icon').style.transition = "0.3s";
            }
        });
    }

    // --- 2. Project Card Scroll Interaction (10% upscale) ---
    const projectCards = document.querySelectorAll('.project-card');
    
    const cardObserverOptions = {
        root: null,
        rootMargin: '-40% 0px -40% 0px', 
        threshold: 0 
    };

    const cardObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active-scroll');
            } else {
                entry.target.classList.remove('active-scroll');
            }
        });
    }, cardObserverOptions);

    projectCards.forEach(card => {
        cardObserver.observe(card);
    });

    // --- 3. Section Fade-in / Fade-out Interaction ---
    // Grabs all major sections on the page
    const sections = document.querySelectorAll('section');

    const sectionObserverOptions = {
        root: null,
        // Shrinks the "visible" window by 10% on top and bottom
        rootMargin: '-20% 0px -20% 0px', 
        threshold: 0 
    };

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // If it enters the middle 80% of the screen, make it visible
                entry.target.classList.add('section-visible');
            } else {
                // If it touches the top 10% or bottom 10%, make it fade out
                entry.target.classList.remove('section-visible');
            }
        });
    }, sectionObserverOptions);

    sections.forEach(section => {
        // Add the hidden class to all sections immediately on load
        section.classList.add('section-hidden');
        // Tell the observer to start watching them
        sectionObserver.observe(section);
    });

    // --- 4. Modular Smart Scroll Button ---
    function initSmartScroll(targetSelector) {
        const wrapper = document.getElementById('smartScrollWrapper');
        const btn = document.getElementById('smartScrollBtn');
        const targetSection = document.querySelector(targetSelector);
        
        // Safety check to ensure elements exist on the page
        if (!wrapper || !btn || !targetSection) return;

        let isScrolledPast = false;

        const checkScrollPosition = () => {
            // Get the target section's position relative to the viewport
            const rect = targetSection.getBoundingClientRect();
            
            // Checks if the user has scrolled past the end of the section
            // We use window.innerHeight * 0.8 so the transition happens smoothly 
            // just as the section is leaving the screen
            if (rect.bottom <= window.innerHeight * 0.8) {
                if (!isScrolledPast) {
                    wrapper.classList.add('scrolled-past');
                    isScrolledPast = true;
                }
            } else {
                if (isScrolledPast) {
                    wrapper.classList.remove('scrolled-past');
                    isScrolledPast = false;
                }
            }
        };

        // Attach scroll listener with requestAnimationFrame for peak performance
        window.addEventListener('scroll', () => {
            window.requestAnimationFrame(checkScrollPosition);
        });
        
        // Run once on load just in case the user refreshes midway down the page
        checkScrollPosition();

        // Click Logic
        btn.addEventListener('click', () => {
            if (isScrolledPast) {
                // If on the right, scroll smoothly back to the top
                window.scrollTo({ top: 0, behavior: 'smooth' });
            } else {
                // If in the center, scroll down to the target section
                targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    }

    // Initialize the module specifically for this case study
    initSmartScroll('#project-overview');

    // --- 5. Copy Email Logic ---
    const copyEmailBtn = document.getElementById('copyEmailBtn');
    
    if (copyEmailBtn) {
        copyEmailBtn.addEventListener('click', () => {
            // Your email address
            const email = 'nickolay.martinezd@gmail.com';
            
            // Modern API to write to the user's clipboard
            navigator.clipboard.writeText(email).then(() => {
                // Add the class to trigger the CSS slide-down animation
                copyEmailBtn.classList.add('copied');
                
                // Remove the class after 2.5 seconds to reset the button
                setTimeout(() => {
                    copyEmailBtn.classList.remove('copied');
                }, 2500);
            }).catch(err => {
                console.error('Failed to copy email: ', err);
                // Optional fallback: you could open a mailto: link here if the clipboard fails
                window.location.href = `mailto:${email}`;
            });
        });
    }
});