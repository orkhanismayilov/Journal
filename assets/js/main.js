$(document).ready(function () {

    'use strict';

    // Global Variables
    var $W = $(window),
        $D = $(document),
        $B = $('body'),
        $HB = $('html, body'),
        $header = $('#header');

    // Scroll To Top on Main Page Refresh
    window.addEventListener('beforeunload', function (e) {
        $B.hide();

        if ($B.hasClass('main-page')) {
            $D.scrollTop(0);
        }
    });

    // Go Up Button
    var btnUp = $('.btn-up');
    if (btnUp.length > 0) {
        if ($D.scrollTop() > 1000) {
            btnUp.css('right', '50px');
        }

        $D.scroll(function () {
            if ($D.scrollTop() > 1000) {
                btnUp.css('right', '50px');
            } else {
                btnUp.css('right', '-50px');
            }
        });

        btnUp.click(function () {
            $HB.animate({
                scrollTop: 0
            }, 1000);
        });
    }

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

            // Hide Search Input if Clicked Outside of It
            $B.click(function (e) {
                if ($(e.originalEvent.target).parents('.search').length <= 0) {
                    that.parent().removeClass('active');
                }
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

    // Main Page Swiper
    var mainPageSlider = $('#main-swiper');
    if (mainPageSlider.length > 0) {
        var mainSwiper = new Swiper('#main-swiper', {
            direction: 'vertical',
            autoHeight: true,
            speed: 500,
            effect: 'fade',
            pagination: {
                el: '.pager',
                clickable: true,
                bulletClass: 'pager-item',
                bulletActiveClass: 'active',
                renderBullet: function (index, className) {
                    if (index === (this.slides.length - 1)) {
                        return '<li class="' + className + ' long"></li>';
                    } else {
                        return '<li class="' + className + '"></li>';
                    }
                }
            },
            mousewheel: {
                releaseOnEdges: true
            },
            fadeEffec: {
                crossFade: true
            },
            on: {
                init: function () {
                    var firstSlide = $(this.slides[0]);
                    firstSlide.find('.section-item').addClass('active');
                },
                slideChangeTransitionStart: function () {
                    if (this.realIndex === this.slides.length - 2) {
                        $B.addClass('no-scroll');
                    }
                },
                slideChangeTransitionEnd: function () {
                    var activeSlide = $(this.slides[this.realIndex]),
                        prevSlide = $(this.slides[this.previousIndex]);

                    prevSlide.find('.section-item').removeClass('active');
                    activeSlide.find('.section-item').addClass('active');
                },
                reachEnd: function () {
                    $B.removeClass('no-scroll');

                    $D.scroll(function () {
                        if ($D.scrollTop() > 0) {
                            mainSwiper.mousewheel.disable();
                        } else {
                            mainSwiper.mousewheel.enable();
                        }
                    });
                }
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

            $D.scrollTop(0);
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

    // Scroll Down Tip
    var scrollDownTip = $('#scrolldown-tip');
    if (scrollDownTip.length > 0) {
        scrollDownTip.click(function () {
            var scrollTarget = $(this).data('target');

            $HB.animate({
                scrollTop: $(scrollTarget).offset().top
            }, 1000);
        });
    }

    // Fill Header When Scroll is Over Category Articles
    var categoryArticlesWrapper = $('#category-articles');
    if (categoryArticlesWrapper.length > 0) {
        toggleDarkHeader(categoryArticlesWrapper);
    }

    // Article Page Functions
    var articlePage = $('#article-page');
    if (articlePage.length > 0) {
        var articleContent = articlePage.find('.article'),
            articleWrapper = articlePage.find('.article-wrapper');

        // Fill Header When Scroll is Over Article Excerpt
        var articleExcerptWrapper = articlePage.find('.article-excerpt-wrapper'),
            articleLimit = articleExcerptWrapper.find('.article-excerpt').offset().top;

        toggleDarkHeader(articleExcerptWrapper);

        // Animate Exhibit Items on Scroll
        var exhibits = $('.exhibit-wrapper');
        exhibits.each(function () {
            var that = $(this),
                columns = that.find('.exhibit-column');

            // Animate Exhibit Items on Page Load if In View
            if ($D.scrollTop() > that.offset().top - 500 && !that.hasClass('animated')) {
                columns.each(function (i, el) {
                    var items = $(el).find('.exhibit-item');

                    items.each(function (i, el) {
                        setTimeout(function () {
                            $(el).animate({
                                top: 0,
                                opacity: 1
                            }, 350 * (i + 1));
                        });
                    });
                });

                that.addClass('animated');
            }

            // Animate Exhibit Items on Scroll
            $D.scroll(function () {
                if ($D.scrollTop() > that.offset().top - 500 && !that.hasClass('animated')) {
                    columns.each(function (i, el) {
                        var items = $(el).find('.exhibit-item');

                        items.each(function (i, el) {
                            setTimeout(function () {
                                $(el).animate({
                                    top: 0,
                                    opacity: 1
                                }, 350 * (i + 1));
                            });
                        });
                    });

                    that.addClass('animated');
                }
            });
        });

        // Apply ScrollMagic for Opacity Animations
        // Defining Controller and Tweens
        var smController = new ScrollMagic.Controller(),
            whiteOpacityTween = new TweenMax.to('.overlay.white', 1, { opacity: 1 }),
            headingOpacityTween = new TweenMax.to('.article-heading', 1, { opacity: .3 }),
            excerptOpacityTween = new TweenMax.to('.article-excerpt', 1, { opacity: 1 }),
            progressBarTween = new TweenMax.to('.progress-bar', 1, { width: '100%' });

        // Defining White Overlay Scene
        var overlayScene = new ScrollMagic.Scene({
            offset: 0,
            duration: articleLimit - 200,
            reverse: true
        })
            .setTween(whiteOpacityTween)
            .addTo(smController);

        // Defining Article Heading Opacity Scene
        var headingScene = new ScrollMagic.Scene({
            offset: 0,
            duration: articleLimit - 200,
            reverse: true
        })
            .setTween(headingOpacityTween)
            .addTo(smController);

        // Defining Article Excerpt Opacity Scene
        var excerptScene = new ScrollMagic.Scene({
            offset: 0,
            duration: articleLimit - 200,
            reverse: true
        })
            .setTween(excerptOpacityTween)
            .addTo(smController);

        var progressBarScene = new ScrollMagic.Scene({
            offset: articleWrapper.offset().top,
            duration: articleWrapper.offset().top + articleWrapper.height() - 2000,
            reverse: true
        })
            .setTween(progressBarTween)
            .addTo(smController);

        var articleHeaderInfoScene = new ScrollMagic.Scene({
            triggerElement: '.article'
        })
            .setClassToggle('.article-header-info', 'show')
            .addTo(smController);

        // Find Zoomable Images in Article and Add Zoom Icon
        var zoomableImages = articleContent.find('.zoomable');
        if (zoomableImages.length > 0) {
            // Creating Figure Container
            var figureContainer = $('<figure class="zoomable-image-figure"></figure>'),
                zoomIcon = $('<span class="zoom-icon"><i class="far fa-plus-circle"></i></span>'),
                zoomModal = $('<div id="zoom-modal"></div>'),
                zoomModalClose = $('<span class="close-zoom-modal"><i class="fal fa-times"></i></span>');

            // Cycle Through Zoomable Images
            zoomableImages.each(function () {
                var image = $(this),
                    figureClone = figureContainer.clone(),
                    iconClone = zoomIcon.clone(),
                    imageClone = image.clone();

                // Append Icon and Image to Figure
                figureClone.append(iconClone);
                figureClone.append(imageClone);

                // Append Figure before Original Image
                image.before(figureClone);
                image.remove();

                // Zoom on Zoom Icon Click
                iconClone.click(function () {
                    // Clone Target Image
                    var zoomImageClone = $(this).next().clone();
                    // Append Image and Close Icon to Zoom Modal
                    zoomModal.append(zoomModalClose).append(zoomImageClone);

                    // Append Zoom Modal to Body and Lock Scroll of Body
                    $B.append(zoomModal).addClass('menu-opened');
                    // Fade In Zoom Modal
                    zoomModal.fadeIn(300);

                    // Close Zoom Modal on Close Icon Click
                    zoomModalClose.click(function () {
                        // Fade Out Zoom Modal
                        zoomModal.fadeOut(300, function () {
                            // Callback after Fade Out 
                            // Clear Zoom Modal and Remove It from DOM
                            zoomModal.empty().remove();
                        });

                        // Clear Image Clone
                        zoomImageClone = null;

                        // Unlock Scroll of Body
                        $B.removeClass('menu-opened');
                    });
                });
            });
        }

        // Our Researches Blocks
        var researches = articleContent.find('.our-research');
        if (researches.length > 0) {
            var researchTrigger = researches.find('.or-trigger');

            researchTrigger.click(function () {
                var targetDropdown = $(this).next(),
                    triggerIcon = $(this).find('i');

                reserchDropdownToggle(targetDropdown, triggerIcon);
            });

            // Research Dropdown Toggle Function
            function reserchDropdownToggle(targetDropdown, triggerIcon) {
                researchTrigger.toggleClass('dark');
                targetDropdown.slideToggle();
                if (triggerIcon.hasClass('fa-plus')) {
                    triggerIcon.removeClass('fa-plus').addClass('fa-minus');
                } else {
                    triggerIcon.removeClass('fa-minus').addClass('fa-plus');
                }
            }
        }

        // Exhibits Slider
        var exhibits = articleContent.find('.exhibit-wrapper');
        if (exhibits.length > 0) {
            exhibits.each(function () {
                var sliderWrapper = $(this).find('.slider-wrapper'),
                    sliderId = '#' + $(this).find('.swiper-container').prop('id'),
                    exhibitItems = $(this).find('.exhibit-item'),
                    closeButtons = $(this).find('.close');

                // Init Exhibit Slider
                var exhibitSlider = new Swiper(sliderId, {
                    loop: true,
                    navigation: {
                        nextEl: '.swiper-button-next',
                        prevEl: '.swiper-button-prev',
                    },
                    pagination: {
                        el: '.swiper-pagination',
                        type: 'fraction'
                    },
                    spaceBetween: 70,
                    effect: 'fade'
                });

                // Open Slider on Exhibit Item Click
                exhibitItems.click(function () {
                    // Index of Slider
                    var exhibitSlideIndex = $(this).data('slide');

                    // Setting Active Slide
                    exhibitSlider.slideTo(exhibitSlideIndex);

                    // Show Slider
                    sliderWrapper.css('visibility', 'visible');
                    sliderWrapper.animate({
                        opacity: 1
                    }, 300);
                });

                // Close Slider on Close Click
                closeButtons.click(function () {
                    // Hide Slider
                    sliderWrapper.animate({
                        opacity: 0
                    }, 300, function () {
                        sliderWrapper.css('visibility', 'hidden');
                    });
                });
            });
        }
    }

    // Article Download Dropdown
    var articleDownloadDropdown = $('.share-item.dropdown .share-link');
    if (articleDownloadDropdown.length > 0) {
        articleDownloadDropdown.click(function () {
            var that = $(this),
                icons = that.find('i'),
                dropdown = that.next();

            // Toggle Icon and Dropdown
            icons.toggle();
            dropdown.fadeToggle(200);

            // Add Event Listener to Outside Click
            $D.bind('click', closeDropdown);

            // Close Dropdown on Outside Click Function
            function closeDropdown(e) {
                var originalTarget = $(e.originalEvent.target);

                if (!originalTarget.hasClass('share-link') && originalTarget.parents('.share-link').length === 0) {
                    icons.toggle();
                    dropdown.fadeOut(200);
                    $D.unbind('click', closeDropdown);
                }
            }
        });
    }

    // User Page Functions
    var userPage = $('#user-page');
    if (userPage.length > 0) {
        var userTitle = userPage.find('.user-title');

        toggleDarkHeader(userTitle);

        // Apply ScrollMagic for Parallax Animations
        // Defining Controller and Tweens
        var smController = new ScrollMagic.Controller(),
            parallaxTween = new TweenMax.to('.parallax-container', 1, { top: '-500px' });

        // Defining Parallax Scene
        var overlayScene = new ScrollMagic.Scene({
            offset: 0,
            duration: $W.height(),
            reverse: true
        })
            .setTween(parallaxTween)
            .addTo(smController);
    }

    // Issue Page Functions
    var issuePage = $('#issue-page');
    if (issuePage.length > 0) {
        var issueInfo = issuePage.find('.issue-info'),
            currentIssueInfo = issuePage.find('.current-issue-info'),
            currentIssueArticles = issuePage.find('.current-issue-articles'),
            issueInfoHeight,
            currentIssueHeight,
            issueArticlesHeight;

        $W.on('load resize', function () {
            issueInfoHeight = issueInfo.height();
            currentIssueHeight = currentIssueInfo.outerHeight(true);
            issueArticlesHeight = issueInfoHeight - currentIssueHeight;

            currentIssueArticles.outerHeight(issueArticlesHeight);

            if (currentIssueArticles.css('display') == 'none') {
                currentIssueArticles.fadeIn(400);
            }
        });


    }

    // All Issues Page Functions
    var allIssuesPage = $('#all-issues-page');
    if (allIssuesPage.length > 0) {
        var initialSlideIndex = 0;

        if (window.location.hash) {
            initialSlideIndex = (window.location.hash.split('-')[1] - 1);
        }

        var issueSwiper = new Swiper('.issues-list', {
            initialSlide: initialSlideIndex,
            pagination: {
                el: '.swiper-pagination',
                type: 'bullets',
                clickable: true,
                renderBullet: function (index, className) {
                    return '<span class="' + className + '">' + (index + 1) + '</span>';
                }
            }
        });

        issueSwiper.on('slideChange', function () {
            window.location.hash = '#page-' + (this.realIndex + 1);
        });
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

    // Toggle Dark Header Function
    function toggleDarkHeader(trigger) {
        // Check on Page Load and Apply Dark on Header
        if ($D.scrollTop() > trigger.offset().top) {
            $header.addClass('dark');
        }

        // Check scrollTop and Apply Dark on Header
        $D.scroll(function (e) {
            if ($D.scrollTop() > trigger.offset().top) {
                $header.addClass('dark');
            } else {
                $header.removeClass('dark');
            }
        });
    }
});

// Page Load
$(window).on('load', function () {
    // Hide Preloader on Page Load
    $('#preloader').fadeOut('fast');

    // Init Particles on Page Load
    if ($(window).width() > 1024) {
        var particlesContainer = $('#particles');
        if (particlesContainer.length > 0) {
            particlesJS.load('particles', 'assets/js/particles.json', function () {
                // console.log('callback - particles.js config loaded');
            });
        }
    }
});