$(document).ready(function () {
    const Visible = function (target) {
        let targetPosition = {
              top: window.scrollY + target.getBoundingClientRect().top,
              left: window.scrollX + target.getBoundingClientRect().left,
              right: window.scrollX + target.getBoundingClientRect().right,
              bottom: window.scrollY + target.getBoundingClientRect().bottom
          },

          windowPosition = {
              top: window.scrollY,
              left: window.scrollX,
              right: window.scrollX + document.documentElement.clientWidth,
              bottom: window.scrollY + document.documentElement.clientHeight - 100
          };

        if (targetPosition.bottom > windowPosition.top &&
          targetPosition.top < windowPosition.bottom &&
          targetPosition.right > windowPosition.left &&
          targetPosition.left < windowPosition.right) {


            if (!target.classList.contains('animated')) {
                target.classList.add('animated')
            }

        } else {
            // !target.classList.contains('animated') || target.classList.remove('animated')
        };
    };

    if (document.querySelector('.animate')) {
        const items = document.querySelectorAll('.animate');

        const checkVisible = (items) => {
            items.forEach(item => Visible(item))
        }

        window.addEventListener('scroll', function () {
            checkVisible(items);
        });

        checkVisible(items);
    }
});
