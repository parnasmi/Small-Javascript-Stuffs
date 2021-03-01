'use strict';

class Workout {
	date = new Date();
	id = (Date.now() + '').toString().slice(-10);
	clicks = 0;
	constructor(coords, distance, duration, type) {
		this.distance = distance;
		this.duration = duration;
		this.coords = coords;
	}

	_setDescription() {
		// prettier-ignore
		const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

		this.description = `${this.type[0].toUpperCase()}${this.type.slice(1)} on ${
			months[this.date.getMonth()]
		} ${this.date.getDate()}`;
	}

	click() {
		this.clicks++;
	}
}

class Cycling extends Workout {
	type = 'cycling';
	constructor(coords, distance, duration, elevationGain) {
		super(coords, distance, duration);
		this.elevationGain = elevationGain;

		this.calcSpeed();
		this._setDescription();
	}

	calcSpeed() {
		this.speed = this.distance / (this.duration / 60);
		return this.speed;
	}
}

class Running extends Workout {
	type = 'running';

	constructor(coords, distance, duration, cadence) {
		super(coords, distance, duration);
		this.cadence = cadence;
		this.calcPace();
		this._setDescription();
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
	#mapZoomLevel = 13;

	constructor() {
		this._getPosition();
		form.addEventListener('submit', this._newWorkout.bind(this));
		inputType.addEventListener('change', this._toggleElevationField);
		containerWorkouts.addEventListener('click', this._moveToPosition.bind(this));
	}

	_getPosition() {
		navigator.geolocation.getCurrentPosition(this._loadMap.bind(this), () => {
			console.log('error getting position');
		});
	}

	_loadMap(pos) {
		const { latitude, longitude } = pos.coords;
		const coords = [latitude, longitude];

		this.#map = L.map('map').setView(coords, this.#mapZoomLevel);

		L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
			attribution:
				'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
		}).addTo(this.#map);

		this.#map.on('click', this._showForm.bind(this));
	}

	_showForm(mapE) {
		this.#mapEvent = mapE;
		form.classList.remove('hidden');
		inputDistance.focus();
	}

	_hideForm() {
		inputDistance.value = inputDuration.value = inputCadence.value = inputElevation.value = '';

		form.style.display = 'none';
		form.classList.add('hidden');
		setTimeout(() => {
			form.style.display = 'grid';
		}, 1000);
	}

	_toggleElevationField() {
		inputCadence.closest('.form__row').classList.toggle('form__row--hidden');
		inputElevation.closest('.form__row').classList.toggle('form__row--hidden');
	}

	_newWorkout(e) {
		e.preventDefault();
		console.log('e newWorkout', e);
		const coords = Object.values(this.#mapEvent.latlng);
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

		//Add new  object to workout array
		this.#workouts.push(workout);
		console.log('workouts', this.#workouts);

		//Render workout on as marker
		this._renderWorkoutMarker(workout);

		//Render workout
		this._renderWorkout(workout);

		//Hide form
		this._hideForm();
	}

	_renderWorkoutMarker(workout) {
		L.marker(workout.coords)
			.addTo(this.#map)
			.bindPopup(
				L.popup({
					maxWidth: 250,
					minWidth: 100,
					autoClose: false,
					closeOnClick: false,
					className: `${workout.type}-popup`,
				})
			)
			.setPopupContent(`${workout.type === 'running' ? '🏃‍♂️' : '🚴‍♀️'} ${workout.description}`)
			.openPopup();
	}

	_renderWorkout(workout) {
		let html = `
			<li class="workout workout--${workout.type}" data-id="${workout.id}">
				<h2 class="workout__title">${workout.description}</h2>
				<div class="workout__details">
					<span class="workout__icon">${workout.type === 'running' ? '🏃‍♂️' : '🚴‍♀️'}</span>
					<span class="workout__value">${workout.distance}</span>
					<span class="workout__unit">km</span>
				</div>
				<div class="workout__details">
					<span class="workout__icon">⏱</span>
					<span class="workout__value">${workout.duration}</span>
					<span class="workout__unit">min</span>
				</div>
		`;

		if (workout.type === 'running') {
			html += `
					<div class="workout__details">
            <span class="workout__icon">⚡️</span>
            <span class="workout__value">${workout.pace.toFixed(1)}</span>
            <span class="workout__unit">min/km</span>
          </div>
          <div class="workout__details">
            <span class="workout__icon">🦶🏼</span>
            <span class="workout__value">${workout.cadence}</span>
            <span class="workout__unit">spm</span>
          </div>
        </li>
			`;
		}
		if (workout.type === 'cycling') {
			html += `
					<div class="workout__details">
						<span class="workout__icon">⚡️</span>
						<span class="workout__value">${workout.elevationGain}</span>
						<span class="workout__unit">km/h</span>
					</div>
					<div class="workout__details">
						<span class="workout__icon">⛰</span>
						<span class="workout__value">${workout.speed.toFixed(1)}</span>
						<span class="workout__unit">m</span>
					</div>
				</li>
			`;
		}
		form.insertAdjacentHTML('afterend', html);
	}

	_moveToPosition(e) {
		const workoutEl = e.target.closest('.workout');
		if (!workoutEl) return;

		const workout = this.#workouts.find(workout => workout.id === workoutEl.dataset.id);

		this.#map.setView(workout.coords, this.#mapZoomLevel, {
			animation: true,
			pan: {
				duration: 1,
			},
		});

		workout.click();
	}
}

const app = new App();
