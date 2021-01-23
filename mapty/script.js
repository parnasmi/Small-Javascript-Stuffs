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

navigator.geolocation.getCurrentPosition(
	pos => {
		const { latitude, longitude } = pos.coords;

		const coords = [latitude, longitude];

		var map = L.map('map').setView(coords, 13);

		L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
			attribution:
				'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
		}).addTo(map);

		map.on('click', function (mapEvent) {
			const coords = Object.values(mapEvent.latlng);

			L.marker(coords)
				.addTo(map)
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
		});
	},
	() => {
		console.log('error getting position');
	}
);
