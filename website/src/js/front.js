document.addEventListener("DOMContentLoaded", function () {
    var html = document.documentElement;
    var body = document.body;

    html.classList.remove('no-js');
    html.classList.add('js');

    // Notifies the DOM if it's a touch device
    if (is_touch_device()) {
        html.classList.remove('no-touch');
        html.classList.add('touch');
    }

    // Animations
    var observerOptions = {
        threshold: 0.3
    };

    var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            // If the element is visible
            if (entry.isIntersecting) {

                // If it's an animation
                if (entry.target.classList.contains('animation')) {
                    entry.target.classList.add('animated');
                }

            }
        });
    }, observerOptions);

    document.querySelectorAll('.animation').forEach(function (el) {
        observer.observe(el)
    });

    const links = document.querySelectorAll('header .scroll');

    for (const link of links) {
        link.onclick = function clickHandler(e) {
            e.preventDefault()
            const href = this.getAttribute('href')
            document.querySelector(href).scrollIntoView({ behavior: 'smooth' })
        }
    }
});


function is_touch_device() {
    var prefixes = ' -webkit- -moz- -o- -ms- '.split(' ');
    var mq = function (query) {
        return window.matchMedia(query).matches;
    }

    if (('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch) {
        return true;
    }

    var query = ['(', prefixes.join('touch-enabled),('), 'heartz', ')'].join('');
    return mq(query);
}
