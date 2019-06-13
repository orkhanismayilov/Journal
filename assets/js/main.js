$(document).ready(function () {

    'use strict';

    // Global Variables
    var $W = $(window),
        $D = $(document),
        $B = $('body'),
        $header = $('#header');

    // Force Page to Load from Top
    $(this).scrollTop(0);

    // Page Load
    $W.on('load', function () {

        // Hide Preloader on Page Load
        $('#preloader').fadeOut('fast');

        // Init Particles on Page Load
        var particlesContainer = $('#particles');
        if (particlesContainer.length > 0) {
            particlesJS.load('particles', 'assets/js/particles.json', function () {
                // console.log('callback - particles.js config loaded');
            });
        }
    });

    // Menu Trigger
    var mainMenu = $('#main-menu');
    if (mainMenu.length > 0) {
        var menuTrigger = $('#menu-trigger'),
            logo = $header.find('.logo'),
            overlay = mainMenu.find('.mm-overlay');

        // Openin/Closing Main Menu
        menuTrigger.click(toggleMainMenu);

        var subMenuTriggers = mainMenu.find('.mm-list-link.has-submenu'),
            activeSubmenu = mainMenu.find('.mm-submenu-item.active');

        subMenuTriggers.click(function () {
            var that = $(this),
                targetID = that.data('submenu');

            if ('#' + activeSubmenu.prop('id') !== targetID) {
                activeSubmenu.slideUp(300, function () {
                    activeSubmenu.removeClass('active');

                    activeSubmenu = $(targetID).slideDown(300, function () {
                        activeSubmenu.addClass('active');
                    });
                });

                that.parent().siblings().removeClass('active');
                that.parent().addClass('active');
            }

            return false;
        });

        // Close Menu on Outside Click
        overlay.click(toggleMainMenu);

        // Toggle Main Menu
        function toggleMainMenu() {
            // Toggle Hamburger State
            menuTrigger.toggleClass('is-active');

            // Toggle Main Menu
            mainMenu.toggleClass('active');

            // Toggle Search Bar and Logo Background
            $header.toggleClass('menu-opened');

            // Toggle Sections Scroll Event
            $B.toggleClass('menu-opened');
        }
    }

    // Search Trigger [Header]
    var searchTrigger = $('#search-trigger-header');
    if (searchTrigger.length > 0) {
        // Open Search Input on Click
        searchTrigger.click(function () {
            var that = $(this),
                searchInput = $('.search-input'),
                focusTimeout;

            $(this).parent().addClass('active');

            // Focus on Search Input after Open
            focusTimeout = setTimeout(function () {
                searchInput.focus();
                clearTimeout(focusTimeout);
            }, 200);

            // Hide Search Input on Blur
            searchInput.blur(function () {
                that.parent().removeClass('active');
            });

            // Close on ESC Key
            $D.on('keyup', closeOnEsc);

            // Close on ESC Key Function
            function closeOnEsc(e) {
                if (e.keyCode === 27) {
                    searchInput.blur();
                    $D.off('keyup', closeOnEsc);
                }
            }
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
                diff = posX - e.changedTouches[0].clientX;
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
            shiftIndex = activePanelIndex,
            zIndex = 0,
            animating = false,
            menuOpened = $B.hasClass('menu-opened'),
            posY = 0,
            diff = 0,
            verticalTreshold = 150;

        // Changing Panels Z-Index and Initializing Active
        $W.on('load', function () {
            panels.each(function () {
                $(this).css('z-index', zIndex);

                if (zIndex === 0) {
                    $(this).fadeIn().addClass('active');
                }

                zIndex--;
            });
        })

        // Scroll to Section on Mouse Scroll
        $D.on('mousewheel', function (e) {
            e = e || window.event;
            menuOpened = $B.hasClass('menu-opened');

            if (e.originalEvent.deltaY > 99 && activePanelIndex != panels.last().data('panel') && !menuOpened) {
                shiftIndex = activePanelIndex + 1;
                togglePanels(shiftIndex);
            } else if (e.originalEvent.deltaY < -99 && activePanelIndex != panels.first().data('panel') && $D.scrollTop() === 0 && !menuOpened) {
                shiftIndex = activePanelIndex - 1;
                togglePanels(shiftIndex);
            }
        });

        // Scroll To Section On TouchDrag
        panels.on({
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
                posY = e.touches[0].clientY;
            }
        }

        // Drag End Function
        function dragEnd(e) {
            e = e || window.event;

            if (e.type == 'touchend') {
                diff = posY - e.changedTouches[0].clientY;

                if (diff < -verticalTreshold) {
                    if (activePanelIndex - 1 >= 0) {
                        shiftIndex = activePanelIndex - 1;

                        togglePanels(shiftIndex);
                    }
                } else if (diff > verticalTreshold) {
                    if (activePanelIndex + 1 < panels.length) {
                        shiftIndex = activePanelIndex + 1;

                        togglePanels(shiftIndex);
                    }
                }
            }

            document.onmouseup = null;
            document.onmousemove = null;
        }
    }

    // Pagers Scroll
    var pagers = $('.pager-item');
    if (pagers.length > 0) {
        pagers.click(function () {
            shiftIndex = $(this).data('panel');

            if (!$(this).hasClass('active')) {
                togglePanels(shiftIndex);
            }
        });
    }

    // Toggle Login SignUp Forms
    var lsPage = $('#login-signup-page');
    if (lsPage.length > 0) {
        var tabLinks = lsPage.find('.tab-link'),
            trigger,
            target;

        // Toggle Tab Contents on Tab Link Click
        tabLinks.click(function () {
            trigger = $(this);
            target = $(trigger.attr('href'));

            toggleTabContent(trigger, target);

            // Prevent Default
            return false;
        });

        // Toggle Tab Contents from URL hash
        var hash = window.location.hash;
        if (hash != '') {
            trigger = $('[href="' + hash + '"]');

            if (!trigger.hasClass('active')) {
                target = $(hash);

                toggleTabContent(trigger, target);
            }
        }

        // Signup Tip Trigger
        var signupTipTrigger = $('#signup-trigger');
        signupTipTrigger.click(function () {
            trigger = $('.tab-link[href="#signup"]');
            target = $('#signup');

            toggleTabContent(trigger, target);

            return false;
        });

        // Tab Content Toggle Function
        function toggleTabContent(trigger, target) {
            // Toggle Tab Links
            trigger.siblings('.tab-link').removeClass('active');
            trigger.addClass('active');

            // Toggle Tab Contents
            target.siblings('.tab-content').hide().removeClass('active');
            target.fadeIn(function () {
                target.addClass('active');
            });
        }
    }

    // Toggle Panels Function
    function togglePanels(shiftIndex) {
        // Checking Animating State and Going On
        if (!animating) {
            // Set Animation State
            animating = true;

            // Animating out Active Panel
            activePanel.fadeOut();
            activePanel.removeClass('active');

            // Updating and Animating in Next Panel
            activePanel = $(panels[shiftIndex]);
            activePanel.fadeIn(function () {
                activePanel.addClass('active');

                // Unset Animation State
                animating = false;
            });

            // Update Active Panel Index
            activePanelIndex = shiftIndex;

            // Add/Remove Scrollbar
            if (activePanelIndex === panels.last().data('panel')) {
                $B.height(panels.last().outerHeight(true));
            } else {
                $B.height(0);
            }

            // Update Pagers
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