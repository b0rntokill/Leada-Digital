$(document).ready(function() {
    $('.our-clients__carousel').owlCarousel({
        loop: true,
        autoplay: false,
        nav: true,
        dots: false,
        responsive:{
            0:{
                items: 1
            },
            768:{
                items: 2
            },
            1280:{
                items: 4
            },
        }
    });

    const header = $('.header');
    const mainPage = $('.main-page');

    $(window).scroll(function() {
        if ($(window).scrollTop() > 0) {
            header.addClass('header--sticky');
            mainPage.addClass('main-page--sticky-fix');
        } else {
            header.removeClass('header--sticky');
            mainPage.removeClass('main-page--sticky-fix');
        }
    });

    // Прокрутка по якорям
    $('.header__menu a').click(function() {
        $('html, body').animate({
            scrollTop: $($(this).attr('href')).offset().top - header.outerHeight() + 'px'
        }, {
            duration: 500,
            easing: 'linear',
        });
        return false;
    });
});

// Валидация полей телефона
(function () {
    const maskOptions = { mask: '+{7}(000)000-00-00' };
    let elements = document.querySelectorAll('input[type="tel"]');
    Array.from(elements).forEach((element) => {
        let mask = IMask(element, maskOptions);
    });
})();

// Открытие кейсов на мобильной версии
(function () {
    const cases = document.querySelectorAll('.cases__item');

    function onCaseElementClick (evt) {
        this.classList.toggle('show');
    }

    window.addEventListener("resize", function() {
        if (window.matchMedia("(min-width: 768px)").matches) {
            Array.from(cases).forEach((caseElement) => {
                caseElement.classList.add('cases__item--hover-on');
                caseElement.removeEventListener('click', onCaseElementClick);
            });
        } else {
            Array.from(cases).forEach((caseElement) => {
                caseElement.classList.remove('cases__item--hover-on');
                caseElement.addEventListener('click', onCaseElementClick);
            });
        }
    });

    if (document.documentElement.clientWidth < 768) {
        Array.from(cases).forEach((caseElement) => {
            caseElement.classList.remove('cases__item--hover-on');
            caseElement.addEventListener('click', onCaseElementClick);
        });

    } else {
        Array.from(cases).forEach((caseElement) => {
            caseElement.classList.add('cases__item--hover-on');
            caseElement.removeEventListener('click', onCaseElementClick);
        });
    }
})();

// Бургер меню
(function () {
    const burgerButton = document.querySelector('.header__btn');
    const header = document.querySelector('.header');
    const overlay = document.querySelector('.modal-overlay');

    function onOverlayClick(evt) {
        if (evt.target.classList.contains('modal-overlay')) {
            closeMenu();
        }
    }

    function closeMenu () {
        header.classList.remove("open");
        overlay.classList.remove("open");
        overlay.removeEventListener("click", onOverlayClick);
    }

    function onBurgerButtonClick (evt) {
        evt.preventDefault();
        header.classList.toggle("open");
        overlay.classList.toggle("open");
        overlay.addEventListener("click", onOverlayClick);
    }

    burgerButton.addEventListener("click", onBurgerButtonClick);
})();

(function () {
    // Открытие модалки
    const ESC_BUTTON = 27;
    const closeButtons = document.querySelectorAll('.callback-modal__close-btn');
    const modal = document.querySelector('.modal-overlay');
    const menu = document.querySelector('.callback-modal');
    const message = document.querySelector('.message');
    const loader = message.querySelector('.loader');
    const messageText = message.querySelector('.message p');
    const openModalButtons = document.querySelectorAll('.js-openCallbackModal');
    const body = document.querySelector('body');
    const AJAX_ERROR_TEXT = 'Что-то пошло не так, попробуйте еще раз отправить форму';
    let currentService = 'nope';

    function onOverlayClick(evt) {
        if (evt.target.classList.contains('modal-overlay')) {
            closeMenu();
            closeOverlay();
            closeMessage();
        }
    }

    function onCloseButtonClick(evt) {
        closeMenu();
        closeOverlay();
        closeMessage();
    }

    function onDocumentKeyDown(evt) {
        if (evt.keyCode === ESC_BUTTON && modal.classList.contains("open")) {
            evt.preventDefault();
            closeMenu();
            closeOverlay();
            closeMessage();
        }
    }

    function closeMenu () {
        menu.classList.remove("open");
    }

    function closeMessage () {
        message.classList.remove("show");
        loader.classList.remove("hide");
        messageText.classList.remove("show");
    }

    function showMessage () {
        message.classList.add("show");
    }

    function showMessageText () {
        messageText.classList.add("show");
        loader.classList.add("hide");
    }

    function closeOverlay () {
        modal.classList.remove("open");
        body.classList.remove("no-scroll");
        modal.removeEventListener("click", onOverlayClick);
        Array.from(closeButtons).forEach((btn) => {
            btn.removeEventListener("click", onCloseButtonClick);
        });
        window.removeEventListener("keydown", onDocumentKeyDown);
    }

    function onOpenModalButtonClick (evt) {
        evt.preventDefault();
        const service = evt.target.dataset.service;
        if (service) {
            currentService = service;
        }
        currentService = 'nope';
        modal.classList.toggle("open");
        menu.classList.toggle("open");
        body.classList.toggle("no-scroll");
        modal.addEventListener("click", onOverlayClick);
        Array.from(closeButtons).forEach((btn) => {
            btn.addEventListener("click", onCloseButtonClick);
        });
        window.addEventListener("keydown", onDocumentKeyDown);
    }

    Array.from(openModalButtons).forEach((btn) => {
        btn.addEventListener("click", onOpenModalButtonClick);
    });

    // Отправка формы, вывод сообщения об отправке
    const callbackForm = document.querySelector('.callback-form');

    function onCallbackFormSubmit(evt) {
        evt.preventDefault();
        const data = new FormData(evt.target);
        const request = {
            name: data.get('name-main'),
            phone: data.get('phone-main'),
            service: currentService,
        };
        closeMenu();
        showMessage();

        const ajaxSend = async (request) => {
            showMessage();
            console.log(request);
            const fetchResp = await fetch('/ajax/callback.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json; charset=utf-8'
                },
                body: JSON.stringify(request),
            });
            if (!fetchResp.ok) {
                throw new Error(`Статус ошибки ${fetchResp.status}`);
            }
            return await fetchResp.text();
        };

        ajaxSend(request)
            .then((response) => {
                showMessageText();
            })

            .catch((err) => {
                messageText.textContent = AJAX_ERROR_TEXT;
                showMessageText();
                console.error(err);
            });
    }

    callbackForm.addEventListener('submit', onCallbackFormSubmit);
})();

