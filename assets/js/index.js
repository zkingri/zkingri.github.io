$('#back').click(function () {
    if (navigator.userAgent.indexOf("Edge") > -1)
        $('body').animate({scrollTop: 0}, 500);
    else
        $('html').animate({scrollTop: 0}, 500);
});

function topToggle() {
    if ($(window).scrollTop() > 600)
        document.getElementById("back").style.display = "block";
    else
        document.getElementById("back").style.display = "none";
}

$(document).ready(function () {
    let nav = $('.g-nav');

    /**
     * Responsive Navigation
     */
    $('#menu-toggle').on('click', function (e) {
        let duration = 200;
        nav.slideToggle(duration);
        $(document).on('click', function () {
            nav.slideUp(duration);
        });
        e.stopPropagation();
    });

    nav.on('click', function (e) {
        e.stopPropagation();
    });

    /*
    *  Header Bar
    */
    if ($(window).width() > 695) {
        let header = $('.g-header');
        let headerHeight = header.outerHeight();
        let navText = nav.find('a');
        let themeStyle = $('.g-banner').attr('data-theme');
        let scFlag = $(document).scrollTop();

        $(document).scroll(function () {
            let scrollTop = $(this).scrollTop();
            let navClassName = 'nav-' + themeStyle;

            if (scrollTop > headerHeight) {
                if (scrollTop > 3 * headerHeight) {
                    header.addClass('headerUp');
                }
                header.css({
                    'background-color': 'rgba(255, 255, 255, .7)',
                    'backdrop-filter': 'saturate(180%) blur(20px)',
                    '-webkit-backdrop-filter': 'saturate(180%) blur(20px)',
                    'border-bottom': 'rgba(51,51,51,.1) 1px solid'
                });
                navText.css('color', '#666');
                nav.addClass(navClassName);
            } else {
                header.removeClass('headerUp');
                header.css({
                    'background-color': 'transparent',
                    'backdrop-filter': 'none',
                    '-webkit-backdrop-filter': 'none',
                    'border-bottom': 'none'
                });
                navText.css('color', '#fff');
                nav.removeClass(navClassName);
            }

            // scroll action
            if (scFlag > scrollTop) {
                header.addClass('headerDown');
            } else {
                header.removeClass('headerDown');
            }
            scFlag = scrollTop;
        });
    }

    /*
    * Post Cover Resize
    */
    function postCover(img, container) {
        let imgWidth = img.width();
        let containerWidth = container.width();
        let imgHeight = img.height();
        let containerHeight = container.height();

        if (imgHeight < containerHeight) {
            img.css({
                'width': 'auto',
                'height': '100%'
            });
            imgWidth = img.width(),
                containerWidth = container.width();
            let marginLeft = (imgWidth - containerWidth) / 2;
            img.css('margin-left', '-' + marginLeft + 'px');
        } else {
            let marginTop = (containerHeight - imgHeight) / 2;
            img.css('margin-top', marginTop + 'px');
        }

        img.fadeIn();
    }

    /**
     * The Post Navigator
     */
    $('.read-next-item section').each(function () {
        let textHeight = $(this).height();
        let cardHeight = $('.read-next-item').height();
        let iconHeight = $('.read-next-item .read-nav').height() + parseInt($('.read-next-item .read-nav').css('margin-top'), 10);
        $(this).css('margin-top', (cardHeight - textHeight) / 2 - iconHeight * 4 / 5 + 'px');
        $(this).fadeIn();
    });

    $('.read-next-item img').each(function () {
        postCover($(this), $('.read-next-item'));
    });

    /**
     * Pagination
     */
    function pagination() {
        let total = parseInt($('#total_pages').val());
        let current = parseInt($('#current_pages').val());
        let baseUrl = $('#base_url').val();
        let limit = 3;

        let link_html = '';

        for (let i = current - limit; i < current; i++) {
            if (i > 0 && i !== 1) {
                link_html += '<a href="' + baseUrl + 'page' + i + '" class="page-link page-num">' + i + '</a>';
            } else if (i === 1) {
                link_html += '<a href="' + baseUrl + '" class="page-link page-num">' + i + '</a>';
            }
        }

        link_html += '<span class="page-link page-num active">' + current + '</span>';

        for (let j = current + 1; j <= current + limit; j++) {
            if (j <= total) {
                link_html += '<a href="' + baseUrl + 'page' + j + '" class="page-link page-num">' + j + '</a>';
            }
        }

        $('#page-link-container').html(link_html);
    }

    pagination();

    /**
     * Search
     */
    function Search() {
        let self = this;
        let input = $('#search_input');
        let result = $('.search_result');

        input.focus(function () {
            $('.icon-search').css('color', '#3199DB');
            result.show();
        });

        input.keyup(debounce(this.autoComplete));

        /*$(document).click(function(e) {
            if(e.target.id === 'search_input' || e.target.className === 'search_result' || e.target.className === 'search_item') {
                return;
            }
            $('.icon-search').css('color', '#CAD3DC');
            result.hide();
        });*/
    }

    Search.prototype.autoComplete = function () {
        let keywords = this.value.toLowerCase();

        if (keywords.length) {
            $('.icon-search').css('color', '#3199DB');
        } else {
            $('.icon-search').css('color', '#CAD3DC');
        }

        $.getJSON('../../search.json').done(function (data) {
            let html = '';
            for (let i in data) {
                let item = data[i];
                let title = item.title;
                let tags = item.tags;
                let url = item.url;

                let k = title + tags;
                if (keywords !== '' && k.toLowerCase().indexOf(keywords) >= 0) {
                    html += '<a class="search_item" href="' + item.url + '">' + item.title + '</a>';
                }
            }
            $('.search_result').html(html);
        });
    };

    function debounce(fn, delay) {
        let timer;
        delay = delay || 120;

        return function () {
            let ctx = this;
            let args = arguments;
            let later = function () {
                fn.apply(ctx, args);
            };
            clearTimeout(timer);
            timer = setTimeout(later, delay);
        };
    }

    new Search();

    /**
     * Night mode
     */
    function nightMode() {
        let el = $('body');
        let className = 'night-mode';

        let date = new Date();
        let hour = date.getHours();

        if (hour <= 6 || hour >= 18) {
            el.addClass(className);
        }
    }

    if ($('#nm-switch').val() === 'true') {
        nightMode();
    }

    /**
     * Copy and copyright
     */
    function setClipboardData(str) {
        str += '\n著作权归作者 Z King`Ri 所有。\n商业转载请联系作者（YD821607@live.cn）获得授权，非商业转载请注明出处。\n原文: ' + location.href;
        $('.post-content').on('copy', function (e) {
            let data = window.clipboardData || e.originalEvent.clipboardData;
            data.setData('text/plain', str);
            e.preventDefault();
        });
    }

    $('.post-content').on('mouseup', function (e) {
        let txt = window.getSelection();
        if (txt.toString().length >= 30) {
            setClipboardData(txt);
        }
    });

    $(window).scroll(function () {
        topToggle();
    });
});
