// js/script.js

// Function to update the base href dynamically after loading sections
function updateBaseHref() {
    const baseElement = document.querySelector('base');
    if (baseElement) {
        baseElement.setAttribute('href', '/gbv-portfolio-site/');
    }
}

// Функция для загрузки HTML-файлов в контейнеры с возможностью передачи колбэка
function loadSection(sectionId, filePath, callback) {
    fetch(filePath)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Не удалось загрузить ${filePath}`);
            }
            return response.text();
        })
        .then(data => {
            document.getElementById(sectionId).innerHTML = data;
            // Если передан колбэк, вызываем его
            if (callback && typeof callback === 'function') {
                callback();
            }
            // Update base href after content is loaded
            updateBaseHref();
            // После загрузки контента инициализируем кнопки "Подробнее"
            initializeReadMoreButtons();
        })
        .catch(error => {
            console.error(error);
            document.getElementById(sectionId).innerHTML = `<p>Не удалось загрузить содержимое.</p>`;
        });
}

// Функция для открытия поповера
function openPopover(button) {
    console.log('Открытие поповера');
    const projectFile = button.getAttribute('data-project');
    const popover = document.getElementById('popover');
    const popoverContent = popover.querySelector('.popover-content');
    const popoverOverlay = document.getElementById('popover-overlay');

    if (popover && projectFile) {
        fetch(projectFile)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Не удалось загрузить ${projectFile}`);
                }
                return response.text();
            })
            .then(data => {
                // Вставляем содержимое проекта в поповер
                popoverContent.innerHTML = data;
                // Отобразить оверлей и поповер
                popoverOverlay.style.display = 'block';
                popover.style.display = 'block';
                // Позиционирование поповера рядом с кнопкой
                positionPopover(button, popover);
                // Добавляем класс для анимации
                setTimeout(() => popover.classList.add('show'), 10); // Небольшая задержка для CSS перехода
                // Блокируем прокрутку страницы
                document.body.style.overflow = 'hidden';
            })
            .catch(error => {
                console.error(error);
                popoverContent.innerHTML = `<p>Не удалось загрузить содержимое.</p>`;
                // Отобразить оверлей и поповер
                popoverOverlay.style.display = 'block';
                popover.style.display = 'block';
                positionPopover(button, popover);
                setTimeout(() => popover.classList.add('show'), 10);
                document.body.style.overflow = 'hidden';
            });
    }
}

// Функция для позиционирования поповера рядом с кнопкой
function positionPopover(button, popover) {
    const rect = button.getBoundingClientRect();
    const popoverRect = popover.getBoundingClientRect();

    // Вычисление позиции: снизу слева от кнопки с небольшим отступом
    let top = rect.bottom + window.scrollY + 10; // 10px от кнопки
    let left = rect.left + window.scrollX;

    // Убедимся, что поповер не выходит за правый край окна
    if (left + popoverRect.width > window.innerWidth) {
        left = window.innerWidth - popoverRect.width - 20; // 20px от края
    }

    // Убедимся, что поповер не выходит за левый край окна
    if (left < 10) {
        left = 10; // 10px от края
    }

    // Убедимся, что поповер не выходит за нижний край окна
    if (top + popoverRect.height > window.scrollY + window.innerHeight) {
        top = rect.top + window.scrollY - popoverRect.height - 10; // Показать сверху кнопки
    }

    popover.style.top = `${top}px`;
    popover.style.left = `${left}px`;
}

// Функция для закрытия поповера
function closePopover() {
    console.log('Закрытие поповера');
    const popover = document.getElementById('popover');
    const popoverOverlay = document.getElementById('popover-overlay');
    popover.classList.remove('show');
    // Скрываем поповер и оверлей после анимации
    setTimeout(() => {
        popover.style.display = 'none';
        popoverOverlay.style.display = 'none';
        popover.querySelector('.popover-content').innerHTML = '';
        // Разрешаем прокрутку страницы
        document.body.style.overflow = 'auto';
    }, 300); // Должно соответствовать длительности перехода в CSS
}

// Функция для инициализации кнопок "Подробнее"
function initializeReadMoreButtons() {
    const readMoreLinks = document.querySelectorAll('.read-more');
    const popover = document.getElementById('popover');
    const closeBtn = popover.querySelector('.close-btn');
    const popoverOverlay = document.getElementById('popover-overlay');

    readMoreLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            console.log('Клик на кнопке "Подробнее"');
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation(); // Полностью предотвращаем распространение события
            openPopover(link);
        });
    });

    // Обработчик клика на кнопку закрытия поповера
    if (closeBtn) {
        closeBtn.addEventListener('click', (e) => {
            console.log('Клик на кнопке закрытия поповера');
            e.stopPropagation();
            e.stopImmediatePropagation(); // Полностью предотвращаем распространение события
            closePopover();
        });
    }

    // Обработчик клика на оверлей для закрытия поповера
    if (popoverOverlay) {
        popoverOverlay.addEventListener('click', (e) => {
            console.log('Клик на оверлей');
            closePopover();
        });
    }

    // Обновлённый обработчик кликов для поповера
    popover.addEventListener('click', (e) => {
        // Проверяем, был ли клик на элементе с классом 'lightbox' или внутри него
        if (!e.target.closest('.lightbox')) {
            e.stopPropagation(); // Останавливаем распространение только если клик не на 'lightbox'
        }
    });
}

// Lightbox функциональность
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const lightboxClose = document.querySelector('.lightbox-close');

// Открытие lightbox при клике на изображение
document.addEventListener('click', function(e) {
    const lightboxLink = e.target.closest('.lightbox');
    if (lightboxLink) {
        console.log('Открытие lightbox');
        e.preventDefault();
        const href = lightboxLink.getAttribute('href');
        if (href) {
            lightboxImg.src = href;
            lightbox.style.display = 'block';
        }
    }
});

// Закрытие lightbox при клике на крестик
lightboxClose.addEventListener('click', () => {
    console.log('Закрытие lightbox через крестик');
    lightbox.style.display = 'none';
});

// Закрытие lightbox при клике вне изображения
lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
        console.log('Закрытие lightbox при клике вне изображения');
        lightbox.style.display = 'none';
    }
});

// Закрытие lightbox при нажатии клавиши Esc
window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        console.log('Закрытие lightbox через Esc');
        lightbox.style.display = 'none';
    }
});

// Функция для обработки отправки контактной формы
function initializeContactForm() {
    const contactForm = document.getElementById('contact-form');
    const responseMessage = document.getElementById('contact-response');

    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault(); // Предотвращаем стандартную отправку формы

            // Получаем значения полей формы
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const message = document.getElementById('message').value.trim();

            // Валидация данных (опционально, так как поля обязательны)
            if (!name || !email || !message) {
                responseMessage.innerHTML = '<p class="error-message">Пожалуйста, заполните все поля.</p>';
                return;
            }

            // Проверка формата электронной почты
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailPattern.test(email)) {
                responseMessage.innerHTML = '<p class="error-message">Пожалуйста, введите корректный email.</p>';
                return;
            }

            // Формирование темы и тела письма
            const subject = encodeURIComponent(`Новое сообщение с портфолио от ${name}`);
            const body = encodeURIComponent(`Email: ${email}\n\nСообщение:\n${message}`);

            // Формирование ссылки mailto
            const mailtoLink = `mailto:george.volkoff@yahoo.com?subject=${subject}&body=${body}`;

            // Открытие почтового клиента
            window.location.href = mailtoLink;

            // Отображение сообщения пользователю
            //responseMessage.innerHTML = '<p class="success-message">Ваше письмо открыто в почтовом клиенте. Пожалуйста, отправьте его.</p>';

            // Сброс формы
            contactForm.reset();
        });
    } else {
        console.error('Форма с id "contact-form" не найдена.');
    }
}

// Обновлённая функция для инициализации всех функций при загрузке страницы
function initializeAll() {
    loadSection('resume', 'sections/resume.html');
    loadSection('skills', 'sections/skills.html');
    loadSection('experience', 'sections/experience.html');
    loadSection('education', 'sections/education.html');
    loadSection('projects', 'sections/projects.html');
    loadSection('languages', 'sections/languages.html');
    // Загрузка контактов с передачей колбэка для инициализации формы
    loadSection('contact', 'sections/contact.html', initializeContactForm);

    // Инициализация обработчиков кнопок "Подробнее" и закрытия поповера
    initializeReadMoreButtons();
}

// Загрузка всех секций при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    initializeAll();
});
