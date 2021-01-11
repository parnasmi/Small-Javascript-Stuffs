'use strict';

///////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnLearnMore = document.querySelector('.btn--scroll-to');
const navLinks = document.querySelector('.nav__links');
const nav = document.querySelector('.nav');
const section1 = document.querySelector('#section--1');

const openModal = function (e) {
	e.preventDefault();
	modal.classList.remove('hidden');
	overlay.classList.remove('hidden');
};

const closeModal = function () {
	modal.classList.add('hidden');
	overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));
btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
	if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
		closeModal();
	}
});
//Scroll into section 1
btnLearnMore.addEventListener('click', function (e) {
	const section1 = document.querySelector('#section--1');
	section1.scrollIntoView({ behavior: 'smooth' });
});
//Scroll to sections
navLinks.addEventListener('click', function (e) {
	e.preventDefault();

	if (e.target.classList.contains('nav__link')) {
		const id = e.target.getAttribute('href');
		document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
	}
});

//Tabbed component

const tabsContainer = document.querySelector('.operations__tab-container');
const tabs = document.querySelectorAll('.operations__tab');
const tabContents = document.querySelectorAll('.operations__content');

tabsContainer.addEventListener('click', function (e) {
	const clicked = e.target.closest('.operations__tab');

	if (!clicked) return;

	function removeActiveClass(elems, className) {
		elems.forEach(el => el.classList.remove(className));
	}
	//Remove active classes
	removeActiveClass(tabs, 'operations__tab--active');
	removeActiveClass(tabContents, 'operations__content--active');

	clicked.classList.add('operations__tab--active');
	document
		.querySelector(`.operations__content--${clicked.dataset.tab}`)
		.classList.add('operations__content--active');
});

const hoverHandle = function (e) {
	if (e.target.classList.contains('nav__link')) {
		const link = e.target;
		const siblings = link.closest('.nav').querySelectorAll('.nav__link');
		const logo = document.querySelector('.nav__logo');

		siblings.forEach(el => {
			if (el !== link) {
				el.style.opacity = this;
			}
		});
		logo.style.opacity = this;
	}
};

//Hovering menu links
nav.addEventListener('mouseover', hoverHandle.bind(0.5));
nav.addEventListener('mouseout', hoverHandle.bind(1));

//Intersection observer
// const obsCallback = (entries, observer) => {
// 	entries.forEach(entry => {
// 		console.log(entry);
// 	});
// };

// const obsOptions = {
// 	root: null,
// 	threshold: 0.05,
// };
// const observer = new IntersectionObserver(obsCallback, obsOptions);
// observer.observe(section1);

//Header intersection observer to add sticky nav

const header = document.querySelector('.header');
const navHeight = nav.getBoundingClientRect().height;
const headerObsCallback = entries => {
	const [entry] = entries;

	if (!entry.isIntersecting) nav.classList.add('sticky');
	else nav.classList.remove('sticky');
};

const headerObserver = new IntersectionObserver(headerObsCallback, {
	root: null,
	rootMargin: `-${navHeight}px`,
	threshold: 0,
});

headerObserver.observe(header);

//Revealing sections
const allSections = document.querySelectorAll('.section');

const revealSection = (entries, observer) => {
	const [entry] = entries;

	if (!entry.isIntersecting) return;

	entry.target.classList.remove('section--hidden');
	observer.unobserve(entry.target);
};

const sectionsObserver = new IntersectionObserver(revealSection, { root: null, threshold: 0.15 });

allSections.forEach(section => {
	sectionsObserver.observe(section);
	// section.classList.add('section--hidden');
});

//LazyLoading images
const lazyImgs = document.querySelectorAll('img[data-src]');

const lazyEntry = (entries, observer) => {
	const [entry] = entries;

	const { target } = entry;
	if (!entry.isIntersecting) return;

	target.src = target.dataset.src;

	target.addEventListener('load', function (e) {
		target.classList.remove('lazy-img');
	});

	observer.unobserve(target);
};

const lazyImgObserver = new IntersectionObserver(lazyEntry, {
	root: null,
	threshold: 0,
	rootMargin: '200px',
});

lazyImgs.forEach(img => lazyImgObserver.observe(img));

const slider = () => {
	const slides = document.querySelectorAll('.slide');
	const btnRight = document.querySelector('.slider__btn--right');
	const btnLeft = document.querySelector('.slider__btn--left');
	const dotsContainer = document.querySelector('.dots');
	let currSlide = 0;
	const maxSlide = slides.length;

	const setActiveDot = activeSlide => {
		document.querySelectorAll('.dots__dot').forEach(dot => {
			dot.classList.remove('dots__dot--active');
		});
		console.log('activeSlide', activeSlide);
		document
			.querySelector(`.dots__dot[data-slide="${activeSlide}"]`)
			.classList.add('dots__dot--active');
	};

	const createDots = () => {
		slides.forEach((s, i) => {
			dotsContainer.insertAdjacentHTML(
				'beforeend',
				`
			<button class="dots__dot" data-slide="${i}"></button>
		`
			);
		});
	};

	const goToSlide = slide => {
		slides.forEach((s, i) => {
			s.style.transform = `translateX(${100 * (i - slide)}%)`;
		});
	};

	//Initializing slider
	const init = () => {
		createDots();
		setActiveDot(0);
		goToSlide(0);
	};

	init();

	const goToNextSlide = () => {
		if (currSlide === maxSlide - 1) {
			currSlide = 0;
		} else {
			currSlide++;
		}
		goToSlide(currSlide);
		setActiveDot(currSlide);
	};
	const goToPrevSlide = () => {
		console.log('currSlide', currSlide);
		if (currSlide === 0) {
			currSlide = maxSlide - 1;
		} else {
			currSlide--;
		}

		setActiveDot(currSlide);
		goToSlide(currSlide);
	};

	document.addEventListener('keydown', function (e) {
		e.key === 'ArrowLeft' && goToPrevSlide();
		e.key === 'ArrowRight' && goToNextSlide();
	});

	dotsContainer.addEventListener('click', function (e) {
		if (e.target.classList.contains('dots__dot')) {
			const { slide } = e.target.dataset;
			setActiveDot(slide);
			goToSlide(slide);
		}
	});

	btnRight.addEventListener('click', goToNextSlide);
	btnLeft.addEventListener('click', goToPrevSlide);
};

slider();
