 document.addEventListener('DOMContentLoaded', function() {
            const slides = document.querySelector('.banner-slides');
            const slideItems = document.querySelectorAll('.slide');
            const prevBtn = document.getElementById('prevBtn');
            const nextBtn = document.getElementById('nextBtn');
            const dots = document.querySelectorAll('.nav-dot');
            
            let currentIndex = 0;
            const totalSlides = slideItems.length;
            let slideInterval;
            let isAnimating = false;
            
            // Atualizar slider
            function updateSlider() {
                isAnimating = true;
                slides.style.transform = `translateX(-${currentIndex * 100}%)`;
                
                dots.forEach((dot, index) => {
                    dot.classList.toggle('active', index === currentIndex);
                });
                
                setTimeout(() => {
                    isAnimating = false;
                }, 800);
            }
            
            // Próximo slide
            function nextSlide() {
                if (isAnimating) return;
                currentIndex = (currentIndex + 1) % totalSlides;
                updateSlider();
            }
            
            // Slide anterior
            function prevSlide() {
                if (isAnimating) return;
                currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
                updateSlider();
            }
            
            // Event listeners
            nextBtn.addEventListener('click', nextSlide);
            prevBtn.addEventListener('click', prevSlide);
            
            // Navegação por dots
            dots.forEach((dot, index) => {
                dot.addEventListener('click', () => {
                    if (isAnimating || index === currentIndex) return;
                    currentIndex = index;
                    updateSlider();
                    resetInterval();
                });
            });
            
            // Auto-play
            function startInterval() {
                slideInterval = setInterval(nextSlide, 6000);
            }
            
            function resetInterval() {
                clearInterval(slideInterval);
                startInterval();
            }
            
            startInterval();
            
            // Pausar no hover
            const banner = document.querySelector('.banner-container');
            banner.addEventListener('mouseenter', () => {
                clearInterval(slideInterval);
            });
            
            banner.addEventListener('mouseleave', startInterval);
            
            // Suporte a touch
            let touchStartX = 0;
            let touchEndX = 0;
            
            banner.addEventListener('touchstart', (e) => {
                touchStartX = e.changedTouches[0].screenX;
                clearInterval(slideInterval);
            }, {passive: true});
            
            banner.addEventListener('touchend', (e) => {
                touchEndX = e.changedTouches[0].screenX;
                handleSwipe();
                startInterval();
            }, {passive: true});
            
            function handleSwipe() {
                if (isAnimating) return;
                if (touchEndX < touchStartX - 50) nextSlide();
                if (touchEndX > touchStartX + 50) prevSlide();
            }
            
            // Teclado
            document.addEventListener('keydown', (e) => {
                if (e.key === 'ArrowRight') nextSlide();
                if (e.key === 'ArrowLeft') prevSlide();
            });
        });