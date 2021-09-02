'use strict';
// *Эта функция проверяет поддерживается ли браузером формат изображения webp и если поддерживается, то эта функция добавляет из css-документа внутрь html-документа класс с изобажением формата webp
function testWebP(callback) {
    var webP = new Image();
    webP.onload = webP.onerror = function () {
        callback(webP.height == 2);
    };
    webP.src = "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA";
}
testWebP(function (support) {
    if (support === true) {
        document.querySelector('html').classList.add('_webp');
    } else {
        document.querySelector('html').classList.add('_no-webp');
    }
});


// *iconMenu
let menuBody = document.querySelector('.menu__body');
let iconMenu = document.querySelector('.icon-menu');
if (iconMenu) {
    iconMenu.addEventListener('click', function () {
        iconMenu.classList.toggle('_active');
        menuBody.classList.toggle('_active');
        document.body.classList.toggle('_lock');
    })
}

// *Filter
const filterLinks = document.querySelectorAll('.filter__link');
const filterCards = document.querySelectorAll('.filter__card');
// Добавить функцию filterCardBegining() в мои загатовочки для фильтров без all
function filterCardBegining() {
    for (const filterCard of filterCards) {
        if (!filterCard.classList.contains(filterLinks[0].dataset.filter)) {
            filterCard.classList.add('_hide');
        }
    }
}
filterCardBegining();

for (let index = 0; index < filterLinks.length; index++) {
    const filterLink = filterLinks[index];
    filterLink.addEventListener('click', function () {
        filterLinkClicked(filterLink);
        filterLinksNoTouch(filterLinks);
        filterBody(filterLink.dataset.filter, filterCards);
    });
}


function filterLinkClicked(filterLink) {
    const opened = document.querySelectorAll('.filter__link._opened');
    if (opened) {
        opened[0].className = opened[0].className.replace(' _opened', '');
        filterLink.classList.add('_opened');
    }
}

function filterLinksNoTouch(links) {
    for (let index = 0; index < links.length; index++) {
        const link = links[index];
        if (link.dataset.filter && !link.classList.contains('_no-touch')) {
            link.classList.add('_no-touch');
        }
        const linkAnim = document.querySelector('.filter__link._opened');
        linkAnim.addEventListener('transitionend', function () {
            link.classList.remove('_no-touch');
        });
    }
}

function filterBody(category, items) {
    for (let index = 0; index < items.length; index++) {
        const item = items[index];
        const ItemFilter = item.classList.contains(category);
        item.classList.add('_show')
        item.addEventListener('transitionend', function () {
            const itemBody = item.querySelector('.card-filter__item');
            itemBody.classList.remove('_anim-items');
            itemBody.classList.remove('_anim');
            if (!ItemFilter) {
                item.classList.add('_hide')
                item.classList.remove('_show')
            } else if (ItemFilter) {
                item.classList.remove('_hide')
                item.classList.remove('_show')
            }
        });
    }
}

// *Scroll to top of the window
const scrollTops = document.querySelectorAll('._scrolltop');
if (scrollTops.length > 0) {
    for (let index = 0; index < scrollTops.length; index++) {
        const scrollTop = scrollTops[index];
        scrollTop.addEventListener('click', function (e) {
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            })
            e.preventDefault();
        });
    }
}
// * LazyLoading
// window.onload необходим чтобы не было определённых багов с появлением картины 
window.onload = function () {
	const lazyImages = document.querySelectorAll('img[data-src]');
	if (lazyImages.length > 0) {
		const options = {
			rootMargin: "0px 0px 50px 0px",
			threshold: 0
		};
		const imageObserver = new IntersectionObserver(lazyImages => {
			for (let index = 0; index < lazyImages.length; index++) {
				const lazyImage = lazyImages[index];
				if (lazyImage.isIntersecting) {
					loadImage(lazyImage.target)
					imageObserver.unobserve(lazyImage.target);
				} else {
					return;
				}
			}
		}, options);
		function loadImage(image) {
			if (image.dataset.src) {
				image.src = image.dataset.src;
				image.removeAttribute('data-src');
				if (image.previousElementSibling) {
					webpDelete(image)
				}
			}
		}
		function webpDelete(img) {
			const webp = img.previousElementSibling;
			if (webp.tagName == 'SOURCE') {
				const dataImgSrc = img.getAttribute('src').split('.');
				if (dataImgSrc[1] !== 'svg') {
					dataImgSrc[1] = 'webp'
				}
				const dataImgSrcWebp = dataImgSrc.join('.');
				webp.setAttribute('srcset', dataImgSrcWebp);
				webp.removeAttribute('data-srcset');
			}
		}
		lazyImages.forEach(image => {
			if (image.getBoundingClientRect().top + pageYOffset > pageYOffset) {
				imageObserver.observe(image);
			} else {
				loadImage(image);
			}
		});
	}
}

// *correct page left/top coordinates
function offset(el) {
	var rect = el.getBoundingClientRect(),
		scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
		scrollTop = window.pageYOffset || document.documentElement.scrollTop;
	return { top: rect.top + scrollTop, left: rect.left + scrollLeft }
}

// *Animation on scroll
const animItems = document.querySelectorAll('._anim-items');
if (animItems.length > 0) {
	window.addEventListener('scroll', animOnScroll);
	function animOnScroll() {
		for (let index = 0; index < animItems.length; index++) {
			const animItem = animItems[index];
			const animItemHeight = animItem.offsetHeight;
			const animItemOffset = offset(animItem).top;
			const animStart = 4;
			let animItemPoint = window.innerHeight - animItemHeight / animStart;
			if (animItemHeight > window.innerHeight) {
				animItemPoint = window.innerHeight - window.innerHeight / animStart;
			}
			if ((pageYOffset > animItemOffset - animItemPoint) && pageYOffset < (animItemOffset + animItemHeight)) {
				animItem.classList.add('_anim')
				animItem.addEventListener('transitionend', function () {
					animItem.classList.remove('_anim-items')
				});
			}
		}
	}
	setTimeout(() => {
		animOnScroll();
	}, 300);
}


