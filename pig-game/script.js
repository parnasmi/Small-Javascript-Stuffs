'use strict';

//Selecting Elements
const playerEl0 = document.querySelector('.player--0');
const playerEl1 = document.querySelector('.player--1');
const scoreEl0 = document.querySelector('#score--0');
const scoreEl1 = document.querySelector('#score--1');
const current0 = document.querySelector('#current--0');
const current1 = document.querySelector('#current--1');
const diceEl = document.querySelector('.dice');
const btnNew = document.querySelector('.btn--new');
const btnRoll = document.querySelector('.btn--roll');
const btnHold = document.querySelector('.btn--hold');

//Starting conditions
let scores, currentScore;
let activePlayer = 0;

diceEl.classList.add('hidden');

function init() {
	scores = [0, 0];
	scoreEl0.textContent = scores[0];
	scoreEl1.textContent = scores[1];
	currentScore = 0;
}

init();

function switchPlayers() {
	currentScore = 0;
	document.getElementById(`current--${activePlayer}`).textContent = 0;
	activePlayer = activePlayer === 0 ? 1 : 0;
	playerEl0.classList.toggle('player--active');
	playerEl1.classList.toggle('player--active');
}

btnRoll.addEventListener('click', function () {
	//1. Generate a random dice roll
	const dice = Math.trunc(Math.random() * 6) + 1;

	//2. Display dice
	diceEl.setAttribute('src', `./dice-${dice}.png`);
	diceEl.classList.remove('hidden');

	//3. Check for rolled 1: if true, switch to next player
	if (dice !== 1) {
		currentScore += dice;
		document.getElementById(`current--${activePlayer}`).textContent = currentScore;
	} else {
		// Switch to next player
		switchPlayers();
	}
});

btnHold.addEventListener('click', function () {
	if (currentScore > 0) {
		diceEl.classList.add('hidden');
		//1.Add current score to active players score
		scores[activePlayer] += currentScore;
		document.getElementById(`score--${activePlayer}`).textContent = scores[activePlayer];

		//2.Checkif player's score is >= 100
		if (scores[activePlayer] >= 100) {
			//Finish the game
			this.setAttribute('disabled', 'disabled');
			btnRoll.setAttribute('disabled', 'disabled');
			document.querySelector(`.player--${activePlayer}`).classList.add('player--winner');
			document.querySelector(`.player--${activePlayer}`).classList.remove('player--active');
		} else {
			//Switch to the next player
			switchPlayers();
		}
	}
});

btnNew.addEventListener('click', () => {
	document.querySelectorAll('.player').forEach(btn => {
		btn.classList.remove('player--winner');
		btn.classList.remove('player--active');
	});
	btnRoll.removeAttribute('disabled');
	btnHold.removeAttribute('disabled');

	init();

	document.getElementById(`score--${activePlayer}`).textContent = 0;
	document.getElementById(`current--${activePlayer}`).textContent = 0;
	document.querySelector(`.player--${activePlayer === 0 ? 1 : 0}`).classList.add('player--active');
	activePlayer = activePlayer === 0 ? 1 : 0;
});
