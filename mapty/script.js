'use strict';

// prettier-ignore
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

class Workout {
	date = new Date();
	id = (Date.now() + '').toString().slice(-10);

	constructor(coords, distance, duration) {
		this.distance = distance;
		this.duration = duration;
		this.coords = coords;
	}
}

class Cycling extends Workout {
	constructor(coords, distance, duration, elevationGain) {
		super(coords, distance, duration);
		this.elevationGain = elevationGain;

		this.calcSpeed();
	}

	calcSpeed() {
		this.speed = this.distance / (this.duration / 60);
		return this.speed;
	}
}

class Running extends Workout {
	constructor(coords, distance, duration, cadence) {
		super(coords, distance, duration);
		this.cadence = cadence;
		this.calcPace();
	}

	calcPace() {
		this.pace = this.duration / this.distance;
		return this.pace;
	}
}

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
	#workouts = [];

	constructor() {
		this._getPosition();
		form.addEventListener('submit', this._newWorkout.bind(this));
		inputType.addEventListener('change', this._toggleElevationField);
	}

	_getPosition() {
		navigator.geolocation.getCurrentPosition(this._loadMap.bind(this), () => {
			console.log('error getting position');
		});
	}

	_loadMap(pos) {
		const { latitude, longitude } = pos.coords;
		const coords = [latitude, longitude];

		this.#map = L.map('map').setView(coords, 13);

		L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
			attribution:
				'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
		}).addTo(this.#map);

		this.#map.on('click', this._showForm.bind(this));
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
		const validInputs = (...inputs) => inputs.every(input => isFinite(input));
		const allPositive = (...inputs) => inputs.every(input => input > 0);
		let workout;
		//Get data from form
		const type = inputType.value;
		const distance = +inputDistance.value;
		const duration = +inputDuration.value;
		//If workout is running, create running object
		if (type === 'running') {
			const cadence = +inputCadence.value;

			//Check if data is valid
			// if (!Number.isFinite(distance) || !Number.isFinite(duration) || !Number.isFinite(cadence)) {
			if (!validInputs(distance, duration, cadence) || !allPositive(distance, duration, cadence)) {
				return alert('Inputs have to be positive numbers!');
			}

			workout = new Running(coords, distance, duration, cadence);
		}

		//If workout is cycling, create cycling object
		if (type === 'cycling') {
			const elevation = +inputElevation.value;
			//Check if data is valid
			if (!validInputs(distance, duration, elevation) || !allPositive(distance, duration)) {
				return alert('Inputs have to be positive numbers!');
			}
			workout = new Cycling(coords, distance, duration, elevation);
		}
		console.log('workout', workout);
		//Add new  object to workout array
		this.#workouts.push(workout);
		console.log('workouts', this.#workouts);
		//Render workout on as marker
		this.renderWorkoutMarker(workout, type);

		inputDistance.value = inputDuration.value = inputCadence.value = inputElevation.value = '';
	}

	renderWorkoutMarker(workout, type) {
		L.marker(workout.coords)
			.addTo(this.#map)
			.bindPopup(
				L.popup({
					maxWidth: 250,
					minWidth: 100,
					autoClose: false,
					closeOnClick: false,
					className: `${type}-popup`,
				})
			)
			.setPopupContent(`${workout.distance}`)
			.openPopup();
	}
}

const app = new App();
