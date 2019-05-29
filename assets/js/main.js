$(document).ready(function () {

    'use strict';

    // Force Page to Load from Top
    $(this).scrollTop(0);

    // Particles
    particlesJS.load('particles', 'assets/js/particles.json', function () {
        // console.log('callback - particles.js config loaded');
    });

    // Menu Trigger
    var mainMenu = $('#main-menu');
    if (mainMenu.length > 0) {
        var menuTrigger = $('#menu-trigger'),
            header = $('#header');

        menuTrigger.click(function () {
            menuTrigger.toggleClass('is-active');
            mainMenu.toggleClass('active');

            header.toggleClass('menu-opened');
        });
    }

    // Search Trigger [Header]
    var searchTrigger = $('#search-trigger-header');
    if (searchTrigger.length > 0) {
        searchTrigger.click(function () {
            var that = $(this),
                searchInput = $('.search-input'),
                focusTimeout;

            $(this).parent().addClass('active');

            focusTimeout = setTimeout(function () {
                searchInput.focus();
                clearTimeout(focusTimeout);
            }, 200);

            searchInput.blur(function () {
                that.parent().removeClass('active');
            });
        });
    }

    // Featured Slider
    var featuredSlider = $('#featured-slider');
    if (featuredSlider.length > 0) {

        // Changing Slides Z-Index
        var slides = featuredSlider.find('.featured-item'),
            zIndex = 0,
            activeIndex = 0,
            treshold = 100,
            posX = 0,
            diff = 0;

        slides.each(function () {
            $(this).css('z-index', zIndex);
            zIndex++;
        });

        // Change Slides on Page Click
        var pagers = featuredSlider.find('.slider-page');
        pagers.click(function () {
            var slideIndex = $(this).data('page');

            if (slideIndex > activeIndex) {
                for (var i = 0; i <= slideIndex; i++) {
                    $(slides[i]).addClass('active');
                }

                activeIndex = slideIndex;
            } else if (slideIndex < activeIndex) {
                for (var i = slides.length; i > slideIndex; i--) {
                    $(slides[i]).removeClass('active');
                }

                activeIndex = slideIndex;
            }

        });

        // Mouse and Touch Events
        slides.mousedown(function () {
            dragStart();

            // Blur Search Input on Click
            $('.search-input').blur();
        });

        slides.on({
            'touchstart': function () {
                dragStart();
            },
            'touchend': function () {
                dragEnd();
            }
        });

        // Drag Start Function
        function dragStart(e) {
            e = e || window.event;
            e.preventDefault();

            if (e.type == 'touchstart') {
                posX = e.touches[0].clientX;
            } else {
                posX = e.clientX;
                document.onmouseup = dragEnd;
            }
        }

        // Drag End Function
        function dragEnd(e) {
            e = e || window.event;

            if (e.type == 'touchend') {
                diff = posX - e.touches[0].clientX;
            } else {
                diff = posX - e.clientX;
            }

            if (diff < -treshold) {
                if (activeIndex - 1 >= 0) {
                    $(slides[activeIndex]).removeClass('active');

                    activeIndex--;
                }
            } else if (diff > treshold) {
                if (activeIndex + 1 < slides.length) {
                    $(slides[activeIndex + 1]).addClass('active');

                    activeIndex++;
                }
            }

            document.onmouseup = null;
            document.onmousemove = null;
        }
    }

    // Panel Scroll
    var panels = $('.section-scroll');
    if (panels.length > 0) {
        var activePanel = panels.first(),
            activePanelIndex = activePanel.data('panel'),
            zIndex = 0,
            animating = false;

        // Changing Panels Z-Index and Initializing Active
        panels.each(function () {
            $(this).css('z-index', zIndex);

            if (zIndex === 0) {
                $(this).fadeIn().addClass('active');
            }

            zIndex--;
        });

        // Scroll to Section on Mouse Scroll
        $(document).on('mousewheel', function (e) {
            e = e || window.event;

            if (e.originalEvent.deltaY > 99 && activePanelIndex != panels.last().data('panel')) {
                togglePanels('next');
            } else if (e.originalEvent.deltaY < -99 && activePanelIndex != panels.first().data('panel')) {
                togglePanels('prev');
            }
        });
    }

    // Pagers Scroll
    var pagers = $('.pager-item');
    if (pagers.length > 0) {
        var activePager = pagers.first();

        pagers.click(function () {
            var shiftIndex = $(this).data('panel');

            togglePanels(null, shiftIndex);
        });
    }

    // Toggle Panels Function
    function togglePanels(dir, shiftIndex) {
        var shiftIndex;

        // Checking Direction and Setting Shift Index
        if (dir === 'next') {
            shiftIndex = activePanelIndex + 1;
        } else if (dir === 'prev') {
            shiftIndex = activePanelIndex - 1;
        }

        // Checking Animating State and Going On
        if (!animating) {
            animating = true;

            activePanel.fadeOut();
            activePanel.removeClass('active');

            activePanel = $(panels[shiftIndex]);
            activePanel.fadeIn(function () {
                animating = false;
                activePanel.addClass('active');
            });

            if (dir === 'next') {
                activePanelIndex++;
            } else if (dir === 'prev') {
                activePanelIndex--;
            }

            togglePagers(shiftIndex);
        } else {
            return false;
        }
    }

    // Toggle Pagers Function
    function togglePagers(index) {
        pagers.parent().find('.active').removeClass('active');
        $(pagers[index]).addClass('active');
    }
});