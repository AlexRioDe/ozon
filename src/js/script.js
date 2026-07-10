$(document).ready(function () {
    $('.btn-menu').on('click', function () {
        $(this).toggleClass('open');
        $('.header-nav').toggleClass('open').fadeToggle();
        $('body').toggleClass('menu-open');
    });

    $('.scroll-page').on('click', function (e) {
        e.preventDefault();
        var body = $('html, body');
        var $target = $($(this).attr('href'));
        if ($target.length) {
            $('html, body').animate({
                'scrollTop': $target.offset().top - 60
            }, 500);
        }
        if ($('.btn-menu').hasClass('open')) $('.btn-menu').removeClass('open');
        if ($('.header-nav').hasClass('open')) $('.header-nav').removeClass('open').fadeOut();
        if ($('body').hasClass('menu-open')) $('body').removeClass('menu-open');

        return false;
    });

    $(window).on('scroll', function () {
        var scroll = $(window).scrollTop();
        if (scroll > 50) {
            $('header').addClass('scrolled');
        } else {
            $('header').removeClass('scrolled');
        }
    });

    $('.faq-item__question').on('click', function () {
        var $answer = $(this).siblings('.faq-item__answer');
        var $arrow = $(this).find('.faq-item__question_arrow');

        // Закрываем все другие ответы (опционально - для аккордеона)
        $('.faq-item__answer').not($answer).slideUp(300);
        $('.faq-item__question').not(this).removeClass('active');

        // Переключаем текущий ответ
        $answer.slideToggle(300);
        $(this).toggleClass('active');
    });
});
