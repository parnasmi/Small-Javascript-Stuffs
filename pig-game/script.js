'use strict';

//Selecting Elements
const playerEl0  = document.querySelector('.player--0')
const playerEl1  = document.querySelector('.player--1')
const scoreEl0 = document.querySelector('#score--0')
const scoreEl1 = document.querySelector('#score--1')
const current0 = document.querySelector('#current--0')
const current1 = document.querySelector('#current--1')
const diceEl = document.querySelector('.dice');
const btnNew = document.querySelector('.btn--new');
const btnRoll = document.querySelector('.btn--roll');
const btnHold = document.querySelector('.btn--hold');

//Starting conditions
scoreEl0.textContent = 0;
scoreEl1.textContent = 0;
diceEl.classList.add('hidden');

let currentScore = 0
let activePlayer = 0;
btnRoll.addEventListener('click', function(){
	
	//1. Generate a random dice roll
	const dice = Math.trunc(Math.random() * 6) + 1;
	
	//2. Display dice
	diceEl.setAttribute('src', `./dice-${dice}.png`)
	diceEl.classList.remove('hidden')
	
	//3. Check for rolled 1: if true, switch to next player
	if(dice !== 1) {
		currentScore += dice;
		document.getElementById(`current--${activePlayer}`).textContent = currentScore;
	} else {
		// Switch to next player
		document.getElementById(`current--${activePlayer}`).textContent = 0;
		currentScore = 0;
		activePlayer = activePlayer === 0 ? 1 : 0;
		playerEl0.classList.toggle('player--active')
		playerEl1.classList.toggle('player--active')
	}
	
})


