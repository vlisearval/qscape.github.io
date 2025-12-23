// Основной JavaScript для Qscape сайта

document.addEventListener('DOMContentLoaded', function() {
    // Инициализация меню на мобильных устройствах
    initMobileMenu();
    
    // Создание анимированного "цифрового ландшафта"
    createDigitalLandscape();
    
    // Анимация появления элементов при скролле
    initScrollAnimations();
    
    // Обработка формы
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', handleFormSubmit);
    }
    
    // Закрытие меню при клике на ссылку на мобильных
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', function() {
            if (window.innerWidth <= 768) {
                closeMobileMenu();
            }
        });
    });
});

// Инициализация мобильного меню
function initMobileMenu() {
    const menuToggle = document.getElementById('menuToggle');
    if (menuToggle) {
        menuToggle.addEventListener('click', toggleMobileMenu);
    }
}

function toggleMobileMenu() {
    const navLinks = document.querySelector('.nav-links');
    const navCta = document.querySelector('.nav-cta');
    const navBannerControl = document.querySelector('.nav-banner-control');
    
    if (navLinks.style.display === 'flex') {
        closeMobileMenu();
    } else {
        openMobileMenu();
    }
}

function openMobileMenu() {
    const navLinks = document.querySelector('.nav-links');
    const navCta = document.querySelector('.nav-cta');
    const navBannerControl = document.querySelector('.nav-banner-control');
    
    navLinks.style.display = 'flex';
    navLinks.style.flexDirection = 'column';
    navLinks.style.position = 'absolute';
    navLinks.style.top = '100%';
    navLinks.style.left = '0';
    navLinks.style.width = '100%';
    navLinks.style.backgroundColor = 'white';
    navLinks.style.padding = '20px';
    navLinks.style.boxShadow = '0 10px 20px rgba(0,0,0,0.1)';
    navLinks.style.gap = '15px';
    navLinks.style.zIndex = '1000';
    
    if (navCta) {
        navCta.style.display = 'block';
        navCta.style.width = '100%';
        navCta.style.marginTop = '15px';
    }
    
    if (navBannerControl) {
        navBannerControl.style.display = 'flex';
        navBannerControl.style.width = '100%';
        navBannerControl.style.marginTop = '15px';
        navBannerControl.style.borderRadius = '8px';
    }
}

function closeMobileMenu() {
    const navLinks = document.querySelector('.nav-links');
    const navCta = document.querySelector('.nav-cta');
    const navBannerControl = document.querySelector('.nav-banner-control');
    
    navLinks.style.display = 'none';
    
    if (navCta) navCta.style.display = 'none';
    if (navBannerControl) navBannerControl.style.display = 'none';
}

// Создание анимированного фона "цифрового ландшафта"
function createDigitalLandscape() {
    const landscape = document.getElementById('digitalLandscape');
    if (!landscape) return;

    // Создаем канвас для анимации
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    landscape.appendChild(canvas);

    // Устанавливаем размеры
    function resizeCanvas() {
        canvas.width = landscape.clientWidth;
        canvas.height = landscape.clientHeight;
    }
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Параметры анимации
    const particles = [];
    const particleCount = 80;
    const connections = [];
    const maxConnectionDistance = 150;

    // Цвета
    const colors = [
        'rgba(0, 229, 229, 0.8)',
        'rgba(0, 255, 171, 0.6)',
        'rgba(138, 43, 226, 0.4)'
    ];

    // Класс частицы
    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 3 + 1;
            this.speedX = Math.random() * 1 - 0.5;
            this.speedY = Math.random() * 1 - 0.5;
            this.color = colors[Math.floor(Math.random() * colors.length)];
            this.waveOffset = Math.random() * Math.PI * 2;
        }

        update() {
            // Движение с волнообразным эффектом
            this.x += this.speedX + Math.sin(Date.now() * 0.001 + this.waveOffset) * 0.3;
            this.y += this.speedY + Math.cos(Date.now() * 0.001 + this.waveOffset) * 0.3;
            
            // Отскок от границ
            if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
            if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
            
            // Удержание в пределах
            this.x = Math.max(0, Math.min(canvas.width, this.x));
            this.y = Math.max(0, Math.min(canvas.height, this.y));
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.fill();
            
            // Свечение
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size * 2, 0, Math.PI * 2);
            ctx.fillStyle = this.color.replace('0.8', '0.2').replace('0.6', '0.2').replace('0.4', '0.2');
            ctx.fill();
        }
    }

    // Создаем частицы
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }

    // Функция соединения частиц
    function connectParticles() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < maxConnectionDistance) {
                    const opacity = 1 - (distance / maxConnectionDistance);
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(0, 229, 229, ${opacity * 0.3})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
        }
    }

    // Анимация
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Обновляем и отрисовываем частицы
        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });
        
        // Соединяем частицы
        connectParticles();
        
        requestAnimationFrame(animate);
    }

    animate();
}

// Анимация при скролле
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);

    // Наблюдаем за элементами для анимации
    document.querySelectorAll('.service-card, .case-card, .process-step').forEach(el => {
        observer.observe(el);
    });
}

// Функция для открытия основного модального окна
function openModal() {
    const modal = document.getElementById('modalOverlay');
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

// Функция для закрытия основного модального окна
function closeModal() {
    const modal = document.getElementById('modalOverlay');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// Закрытие модальных окон при клике на оверлей
document.addEventListener('click', function(event) {
    const modalOverlay = document.getElementById('modalOverlay');
    const bannerModalOverlay = document.getElementById('bannerModalOverlay');
    
    if (event.target === modalOverlay) {
        closeModal();
    }
    
    if (event.target === bannerModalOverlay) {
        closeBannerModal();
    }
});

// Закрытие модальных окон при нажатии Escape
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeModal();
        closeBannerModal();
    }
});

// Обработка отправки формы
function handleFormSubmit(event) {
    event.preventDefault();
    
    // Здесь можно добавить отправку данных на сервер
    const formData = new FormData(event.target);
    const formValues = Object.fromEntries(formData.entries());
    
    console.log('Форма отправлена:', formValues);
    
    // Показываем сообщение об успехе
    alert('Спасибо! Ваша заявка отправлена. Мы свяжемся с вами в течение 24 часов.');
    
    // Закрываем модальное окно
    closeModal();
    
    // Сбрасываем форму
    event.target.reset();
}

// Функции для баннеров (объявлены здесь для доступа из HTML)
function showBannerModal() {
    const modal = document.getElementById('bannerModalOverlay');
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeBannerModal() {
    const modal = document.getElementById('bannerModalOverlay');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

function closeBanner(bannerType) {
    if (typeof closeBannerType === 'function') {
        closeBannerType(bannerType);
    }
}

function resetBanners() {
    if (typeof resetBannerSettings === 'function') {
        resetBannerSettings();
    }
}

function saveBannerSettings() {
    if (typeof saveBannerConfig === 'function') {
        saveBannerConfig();
    }
}