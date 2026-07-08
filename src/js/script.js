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
});
