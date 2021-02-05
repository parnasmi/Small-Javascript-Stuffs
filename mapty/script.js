'use strict';

// prettier-ignore
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const form = document.querySelector('.form');
const containerWorkouts = document.querySelector('.workouts');
const inputType = document.querySelector('.form__input--type');
const inputDistance = document.querySelector('.form__input--distance');
const inputDuration = document.querySelector('.form__input--duration');
const inputCadence = document.querySelector('.form__input--cadence');
const inputElevation = document.querySelector('.form__input--elevation');

class App {
	#map;
	#mapEvent;

	constructor() {
		console.log('tes App');
		this._getPosition();
		form.addEventListener('submit', this._newWorkout.bind(this));
		inputType.addEventListener('change', this._toggleElevationField);
	}

	_getPosition() {
		console.log('get position');
		console.log('get position', this._loadMap);
		console.log('navigator', navigator);
		navigator.geolocation.getCurrentPosition(this._loadMap.bind(this), () => {
			console.log('error getting position');
		});
	}

	_loadMap(pos) {
		const { latitude, longitude } = pos.coords;
		console.log('pos', pos);
		const coords = [latitude, longitude];

		this.map = L.map('map').setView(coords, 13);

		L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
			attribution:
				'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
		}).addTo(this.map);

		this.map.on('click', this._showForm.bind(this));
	}

	_showForm(mapE) {
		this.mapEvent = mapE;
		form.classList.remove('hidden');
		inputDistance.focus();
	}

	_toggleElevationField() {
		inputCadence.closest('.form__row').classList.toggle('form__row--hidden');
		inputElevation.closest('.form__row').classList.toggle('form__row--hidden');
	}

	_newWorkout(e) {
		e.preventDefault();
		const coords = Object.values(this.mapEvent.latlng);

		inputDistance.value = inputDuration.value = inputCadence.value = inputElevation.value = '';

		L.marker(coords)
			.addTo(this.map)
			.bindPopup(
				L.popup({
					maxWidth: 250,
					minWidth: 100,
					autoClose: false,
					closeOnClick: false,
					className: 'running-popup',
				})
			)
			.setPopupContent('Workout')
			.openPopup();
	}
}

const app = new App();
