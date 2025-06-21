/**
 * Personal Portfolio Website Script
 * Version: Advanced Single-Page with Motion Graphics (WhatsApp Contact & Debugs)
 * Author: Adelli Rahul Reddy & AI Assistant
 * Description: Manages responsive navigation, smooth scrolling, scroll-reveal animations,
 * typewriter effect, particle background using HTML Canvas, and dynamically loads project teasers.
 * Contact form is now a WhatsApp redirect.
 */
document.addEventListener('DOMContentLoaded', () => {

    const header = document.querySelector('.header');
    const menuIcon = document.querySelector('#menu-icon');
    const navbar = document.querySelector('.navbar');
    const sections = document.querySelectorAll('section'); // All sections on the current page
    const navLinks = document.querySelectorAll('header nav a'); // All nav links in the header

    // --- Particle Canvas Background Animation (Motion Graphics) ---
    const homeCanvas = document.getElementById('particleCanvas');
    const homeCtx = homeCanvas ? homeCanvas.getContext('2d') : null;
    let particles = [];
    const numParticles = 80; // Number of particles
    const particleSize = 1; // Size of particles
    const particleSpeed = 0.5; // Speed of particles
    const lineColor = 'rgba(0, 171, 240, 0.1)'; // Subtle line color
    const particleColor = 'rgba(237, 237, 237, 0.8)'; // Particle color

    if (homeCanvas && homeCtx) {
        // Set canvas dimensions to full screen initially and on resize
        const resizeHomeCanvas = () => {
            homeCanvas.width = window.innerWidth;
            homeCanvas.height = window.innerHeight;
            // Re-initialize particles on resize to ensure they fill the new dimensions
            initParticles();
        };

        const initParticles = () => {
            particles = [];
            for (let i = 0; i < numParticles; i++) {
                particles.push({
                    x: Math.random() * homeCanvas.width,
                    y: Math.random() * homeCanvas.height,
                    vx: (Math.random() - 0.5) * particleSpeed, // velocity x
                    vy: (Math.random() - 0.5) * particleSpeed, // velocity y
                    radius: Math.random() * particleSize + 0.5,
                    alpha: Math.random() * 0.5 + 0.3 // Random transparency for twinkle effect
                });
            }
        };

        const drawParticles = () => {
            homeCtx.clearRect(0, 0, homeCanvas.width, homeCanvas.height); // Clear canvas

            for (let i = 0; i < particles.length; i++) {
                const p1 = particles[i];

                // Draw particle
                homeCtx.beginPath();
                homeCtx.arc(p1.x, p1.y, p1.radius, 0, Math.PI * 2);
                homeCtx.fillStyle = particleColor;
                homeCtx.fill();

                // Connect particles with lines
                for (let j = i + 1; j < particles.length; j++) {
                    const p2 = particles[j];
                    const distance = Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));

                    if (distance < 120) { // Connect if particles are close
                        homeCtx.beginPath();
                        homeCtx.moveTo(p1.x, p1.y);
                        homeCtx.lineTo(p2.x, p2.y);
                        homeCtx.strokeStyle = lineColor;
                        homeCtx.lineWidth = 1;
                        homeCtx.stroke();
                    }
                }

                // Update particle position
                p1.x += p1.vx;
                p1.y += p1.vy;

                // Bounce off edges
                if (p1.x < 0 || p1.x > homeCanvas.width) p1.vx *= -1;
                if (p1.y < 0 || p1.y > homeCanvas.height) p1.vy *= -1;
            }

            requestAnimationFrame(drawParticles); // Loop animation
        };

        // Initialize and start animation
        resizeHomeCanvas(); // Set initial size
        window.addEventListener('resize', resizeHomeCanvas); // Adjust on resize
        drawParticles(); // Start drawing loop
    } else {
        console.warn('Canvas element with ID "particleCanvas" not found, particle animation will not run.');
    }


    // --- Mobile Menu Toggle ---
    if (menuIcon && navbar) {
        menuIcon.onclick = () => {
            menuIcon.classList.toggle('bx-x');
            navbar.classList.toggle('active');
        };
    }

    // --- Active Link Highlighting ---
    const highlightNavLink = () => {
        let currentSectionId = '';

        if (window.location.pathname.endsWith('index.html') || window.location.pathname === '/' || window.location.pathname.endsWith('/personal-portfolio/')) {
            sections.forEach(sec => {
                const top = window.scrollY;
                const offset = sec.offsetTop - (header ? header.offsetHeight + 50 : 150);
                const height = sec.offsetHeight;
                const id = sec.getAttribute('id');

                if (id && top >= offset && top < offset + height) {
                    currentSectionId = id;
                }
            });
        }
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            const linkHref = link.getAttribute('href');

            if (linkHref.startsWith('#') && currentSectionId && linkHref === '#' + currentSectionId) {
                link.classList.add('active');
            } 
            else if (!linkHref.startsWith('#')) {
                const linkPageName = linkHref.split('/').pop();
                const currentPageName = window.location.pathname.split('/').pop();

                if (linkPageName === currentPageName) {
                    link.classList.add('active');
                } else if (linkPageName === 'index.html' && (currentPageName === '' || currentPageName === 'personal-portfolio' || currentPageName === 'index.html')) {
                    link.classList.add('active');
                }
            }
        });
    };

    window.addEventListener('scroll', highlightNavLink);
    highlightNavLink();

    // --- Sticky Header ---
    window.addEventListener('scroll', () => {
        if (header) {
            header.classList.toggle('sticky', window.scrollY > 100);
        }
        if (navbar && menuIcon && navbar.classList.contains('active')) {
            menuIcon.classList.remove('bx-x');
            navbar.classList.remove('active');
        }
    });

    // --- Smooth Scrolling for Internal Links (only on index.html) ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            if (window.location.pathname.endsWith('index.html') || window.location.pathname === '/' || window.location.pathname.endsWith('/personal-portfolio/')) {
                const targetId = this.getAttribute('href');
                const targetSection = document.querySelector(targetId);
                
                if (targetSection) {
                    e.preventDefault();
                    const headerHeight = header ? header.offsetHeight : 0;
                    window.scrollTo({
                        top: targetSection.offsetTop - headerHeight,
                        behavior: 'smooth'
                    });
                    if (navbar && menuIcon && navbar.classList.contains('active')) {
                        menuIcon.classList.remove('bx-x');
                        navbar.classList.remove('active');
                    }
                }
            }
        });
    });

    // --- Universal Scroll-Reveal Animation ---
    const animatedElements = document.querySelectorAll('.reveal-on-scroll');
    const scrollObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            } else {
                // Optional: reset animation if scrolled out of view, and want it to re-animate on re-entry
                // No specific reset needed for progress bars as they are removed
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -10% 0px' });

    animatedElements.forEach(el => scrollObserver.observe(el));


    // --- Dynamic Project Teaser Loading ---
    const loadDynamicProjectTeasers = async () => {
        const teaserContainer = document.getElementById('dynamic-project-teasers');
        if (!teaserContainer) {
            console.warn("Dynamic project teaser container not found.");
            return;
        }

        teaserContainer.innerHTML = '<div class="loading-spinner"></div>'; // Show loading indicator

        try {
            const response = await fetch('projects.html');
            if (!response.ok) throw new Error(`Failed to fetch projects.html: ${response.status}`);
            const text = await response.text();
            
            // Use DOMParser to safely parse the fetched HTML
            const parser = new DOMParser();
            const doc = parser.parseFromString(text, 'text/html');
            
            // Select project cards from the parsed document
            const projectCards = doc.querySelectorAll('.project-card');
            let teasersHtml = '';
            let count = 0;
            const maxTeasers = 3; // Limit the number of teasers to display

            projectCards.forEach(card => {
                if (count >= maxTeasers) return; // Stop after maxTeasers

                const title = card.querySelector('.project-title')?.textContent || 'Untitled Project';
                const desc = card.querySelector('.project-desc')?.textContent || 'No description available.';
                const techTagsElements = card.querySelectorAll('.tech-tags .tag');
                let techTagsHtml = '';
                techTagsElements.forEach(tagEl => {
                    techTagsHtml += `<span class="tag">${tagEl.textContent}</span>`;
                });

                // Construct dynamic teaser card HTML with reveal-on-scroll
                teasersHtml += `
                    <div class="dynamic-project-teaser-card reveal-on-scroll">
                        <h3>${title}</h3>
                        <p>${desc.substring(0, 120)}...</p> <!-- Truncate description for teaser -->
                        <div class="tech-tags">${techTagsHtml}</div>
                    </div>
                `;
                count++;
            });

            teaserContainer.innerHTML = teasersHtml; // Inject generated teasers
            
            // Re-observe newly added elements for scroll-reveal animation
            const newTeaserCards = teaserContainer.querySelectorAll('.reveal-on-scroll');
            newTeaserCards.forEach(el => scrollObserver.observe(el));


        } catch (error) {
            console.error("Error loading featured projects:", error);
            teaserContainer.innerHTML = '<p class="error-message">Failed to load projects. Please try again later.</p>';
        }
    };

    // Call the function to load featured projects when index.html is loaded
    if (window.location.pathname.endsWith('index.html') || window.location.pathname === '/' || window.location.pathname.endsWith('/personal-portfolio/')) {
        loadDynamicProjectTeasers();
    }


    // --- Typewriter Effect (only on index.html home section) ---
    const taglineElement = document.querySelector('.home-tagline');
    if (taglineElement && (window.location.pathname.endsWith('index.html') || window.location.pathname === '/' || window.location.pathname.endsWith('/personal-portfolio/'))) {
        const taglines = [
            "Software Analyst & AI-Powered Developer",
            "Crafting Intelligent Digital Experiences",
            "Bridging Network Insights with Creative Code"
        ];
        let taglineIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        let delay = 100;

        function typeWriterEffect() {
            if (!taglineElement) return;
            const currentTagline = taglines[taglineIndex];

            if (isDeleting) {
                taglineElement.textContent = currentTagline.substring(0, charIndex--);
                delay = 50;
            } else {
                taglineElement.textContent = currentTagline.substring(0, charIndex++);
                delay = 100;
            }

            if (!isDeleting && charIndex === currentTagline.length + 1) {
                delay = 1500;
                isDeleting = true;
            } else if (isDeleting && charIndex < 0) {
                isDeleting = false;
                taglineIndex = (taglineIndex + 1) % taglines.length;
                delay = 500;
            }

            setTimeout(typeWriterEffect, delay);
        }
        setTimeout(typeWriterEffect, 1000);
    }

    // --- Contact Form Submission (Removed as it's now a WhatsApp redirect) ---
    // No code here, as the form no longer exists.

});
