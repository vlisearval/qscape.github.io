// Управление анимированными баннерами

// Глобальные функции для доступа из HTML
window.closeBanner = closeBannerType;
window.resetBanners = resetBannerSettings;
window.saveBannerSettings = saveBannerConfig;

document.addEventListener('DOMContentLoaded', function() {
    // Загружаем сохраненные настройки баннеров
    loadBannerSettings();
    
    // Инициализируем баннеры
    initBanners();
    
    // Настройка переключателей в модальном окне
    setupBannerControls();
    
    // Автоматическое скрытие баннеров через 30 секунд
    setTimeout(() => {
        autoHideBanners();
    }, 30000);
    
    // Обработка ресайза окна
    window.addEventListener('resize', handleBannerResize);
});

// Загрузка сохраненных настроек
function loadBannerSettings() {
    const defaultSettings = {
        showBanner728: 'true',
        showBanner468: 'true',
        bannerDisplayMode: 'auto',
        bannerAnimation: 'true',
        autoHideBanners: 'true'
    };
    
    Object.keys(defaultSettings).forEach(key => {
        if (!localStorage.getItem(key)) {
            localStorage.setItem(key, defaultSettings[key]);
        }
    });
}

// Инициализация баннеров
function initBanners() {
    // Проверяем настройки отображения
    const displayMode = localStorage.getItem('bannerDisplayMode') || 'auto';
    const show728 = localStorage.getItem('showBanner728') === 'true';
    const show468 = localStorage.getItem('showBanner468') === 'true';
    
    const banner728 = document.querySelector('.banner-728');
    const banner468 = document.querySelector('.banner-468');
    
    // Сначала скрываем все
    if (banner728) banner728.classList.remove('show');
    if (banner468) banner468.classList.remove('show');
    
    // Определяем, какие баннеры показывать
    if (displayMode === 'auto') {
        // Адаптивное отображение
        if (window.innerWidth >= 769) {
            if (show728 && banner728) banner728.classList.add('show');
        } else {
            if (show468 && banner468) banner468.classList.add('show');
        }
    } else if (displayMode === '728') {
        // Только десктоп баннер
        if (show728 && banner728) banner728.classList.add('show');
    } else if (displayMode === '468') {
        // Только мобильный баннер
        if (show468 && banner468) banner468.classList.add('show');
    }
    
    // Применяем настройки анимации
    const showAnimation = localStorage.getItem('bannerAnimation') === 'true';
    applyAnimationSettings(showAnimation);
}

// Обработка изменения размера окна
function handleBannerResize() {
    const displayMode = localStorage.getItem('bannerDisplayMode') || 'auto';
    
    if (displayMode === 'auto') {
        const banner728 = document.querySelector('.banner-728');
        const banner468 = document.querySelector('.banner-468');
        const show728 = localStorage.getItem('showBanner728') === 'true';
        const show468 = localStorage.getItem('showBanner468') === 'true';
        
        // Сначала скрываем все
        if (banner728) banner728.classList.remove('show');
        if (banner468) banner468.classList.remove('show');
        
        if (window.innerWidth >= 769) {
            if (show728 && banner728) banner728.classList.add('show');
        } else {
            if (show468 && banner468) banner468.classList.add('show');
        }
    }
}

// Закрытие баннера
function closeBannerType(bannerType) {
    if (bannerType === '728') {
        const banner = document.querySelector('.banner-728');
        if (banner) {
            banner.classList.remove('show');
            localStorage.setItem('showBanner728', 'false');
            
            // Обновляем переключатель в модальном окне
            const toggle728 = document.getElementById('toggle728');
            if (toggle728) toggle728.checked = false;
            
            showNotification('Баннер 728×90 скрыт');
        }
    } else if (bannerType === '468') {
        const banner = document.querySelector('.banner-468');
        if (banner) {
            banner.classList.remove('show');
            localStorage.setItem('showBanner468', 'false');
            
            // Обновляем переключатель в модальном окне
            const toggle468 = document.getElementById('toggle468');
            if (toggle468) toggle468.checked = false;
            
            showNotification('Баннер 468×60 скрыт');
        }
    }
}

// Автоматическое скрытие баннеров
function autoHideBanners() {
    const autoHide = localStorage.getItem('autoHideBanners') === 'true';
    
    if (autoHide) {
        const banners = document.querySelectorAll('.banner-wrapper.show');
        banners.forEach(banner => {
            banner.style.opacity = '0';
            banner.style.transform = 'translateY(-20px)';
            banner.style.transition = 'all 0.5s ease';
            
            setTimeout(() => {
                banner.classList.remove('show');
                banner.style.opacity = '';
                banner.style.transform = '';
            }, 500);
        });
        
        if (banners.length > 0) {
            showNotification('Баннеры автоматически скрыты');
        }
    }
}

// Настройка элементов управления в модальном окне
function setupBannerControls() {
    // Переключатели баннеров
    const toggle728 = document.getElementById('toggle728');
    const toggle468 = document.getElementById('toggle468');
    const animationToggle = document.getElementById('showAnimation');
    
    if (toggle728) {
        toggle728.checked = localStorage.getItem('showBanner728') === 'true';
        toggle728.addEventListener('change', function() {
            localStorage.setItem('showBanner728', this.checked);
            initBanners();
        });
    }
    
    if (toggle468) {
        toggle468.checked = localStorage.getItem('showBanner468') === 'true';
        toggle468.addEventListener('change', function() {
            localStorage.setItem('showBanner468', this.checked);
            initBanners();
        });
    }
    
    if (animationToggle) {
        animationToggle.checked = localStorage.getItem('bannerAnimation') === 'true';
        animationToggle.addEventListener('change', function() {
            localStorage.setItem('bannerAnimation', this.checked);
            applyAnimationSettings(this.checked);
        });
    }
    
    // Радиокнопки режима отображения
    const displayModes = document.querySelectorAll('input[name="displayMode"]');
    const savedMode = localStorage.getItem('bannerDisplayMode') || 'auto';
    
    displayModes.forEach(radio => {
        if (radio.value === savedMode) {
            radio.checked = true;
        }
        
        radio.addEventListener('change', function() {
            localStorage.setItem('bannerDisplayMode', this.value);
            initBanners();
        });
    });
}

// Применение настроек анимации
function applyAnimationSettings(showAnimation) {
    const banners = document.querySelectorAll('.banner-728x90, .banner-468x60');
    
    banners.forEach(banner => {
        if (showAnimation) {
            banner.style.animationPlayState = 'running';
            
            // Включаем конкретные анимации
            const progressBar = banner.querySelector('.progress-bar');
            const bannerIcon = banner.querySelector('.banner-icon');
            const badge = banner.querySelector('.banner-badge');
            
            if (progressBar) progressBar.style.animationPlayState = 'running';
            if (bannerIcon) bannerIcon.style.animationPlayState = 'running';
            if (badge) badge.style.animationPlayState = 'running';
        } else {
            banner.style.animationPlayState = 'paused';
            
            // Отключаем анимации
            const progressBar = banner.querySelector('.progress-bar');
            const bannerIcon = banner.querySelector('.banner-icon');
            const badge = banner.querySelector('.banner-badge');
            
            if (progressBar) progressBar.style.animationPlayState = 'paused';
            if (bannerIcon) bannerIcon.style.animationPlayState = 'paused';
            if (badge) badge.style.animationPlayState = 'paused';
        }
    });
}

// Сохранение настроек баннеров
function saveBannerConfig() {
    // Настройки уже сохраняются при изменении элементов управления
    closeBannerModal();
    showNotification('Настройки баннеров сохранены');
    
    // Переинициализируем баннеры
    initBanners();
}

// Сброс настроек баннеров
function resetBannerSettings() {
    // Сбрасываем настройки к значениям по умолчанию
    localStorage.removeItem('showBanner728');
    localStorage.removeItem('showBanner468');
    localStorage.removeItem('bannerDisplayMode');
    localStorage.removeItem('bannerAnimation');
    localStorage.removeItem('autoHideBanners');
    
    // Обновляем UI
    loadBannerSettings();
    setupBannerControls();
    initBanners();
    
    showNotification('Настройки баннеров сброшены к значениям по умолчанию');
}

// Показать уведомление
function showNotification(message) {
    // Проверяем, нет ли уже уведомления
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Создаем элемент уведомления
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-check-circle"></i>
            <span>${message}</span>
        </div>
    `;
    
    // Добавляем стили
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, var(--primary-dark), var(--primary-blue));
        color: white;
        padding: 15px 25px;
        border-radius: 8px;
        box-shadow: 0 10px 25px rgba(0,0,0,0.15);
        z-index: 9999;
        transform: translateX(120%);
        transition: transform 0.3s ease;
        max-width: 300px;
    `;
    
    document.body.appendChild(notification);
    
    // Показываем уведомление
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Скрываем через 3 секунды
    setTimeout(() => {
        notification.style.transform = 'translateX(120%)';
        setTimeout(() => {
            if (notification.parentNode) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Создаем стили для уведомлений
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
    .notification-content {
        display: flex;
        align-items: center;
        gap: 10px;
        font-weight: 500;
        font-size: 0.875rem;
    }
    
    .notification-content i {
        color: var(--accent-cyan);
        font-size: 1.25rem;
        flex-shrink: 0;
    }
    
    .notification-content span {
        flex: 1;
    }
`;
document.head.appendChild(notificationStyles);

// Инициализируем баннеры при загрузке страницы
window.addEventListener('load', initBanners);