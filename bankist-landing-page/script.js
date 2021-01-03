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
