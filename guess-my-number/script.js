'use strict';

const SCORE = 20;
let highScore = 0;
let secretNumber = Math.trunc(Math.random() * 20) + 1;
let score = SCORE;
const numberElem = document.querySelector('.number');
const checkBtn = document.querySelector('.check');
const numberInput = document.querySelector('.guess');
const bodyElem = document.querySelector('body');
const againElem = document.querySelector('.again');
const message = document.querySelector('.message');
const scoreElem = document.querySelector('.score');
const highScoreElem = document.querySelector('.highscore');

highScoreElem.textContent = highScore;

function displayTextUI(text,elem = message) {
	elem.textContent = text;
}

checkBtn.addEventListener('click', function(){
	const guess = Number(numberInput.value);
	
	if(!guess) displayTextUI('🚫  No number!')
	else if(guess === secretNumber) {
		displayTextUI('✅ You guess');
		displayTextUI(secretNumber,numberElem);
		bodyElem.style.backgroundColor  = '#60b347';
		numberElem.style.width  = '30rem';
		
		if(score > highScore) {
			highScore = score;
			displayTextUI(highScore,highScoreElem);
		}
	} else if(guess !== secretNumber) {
		--score;
		if(score >= 1) {
			displayTextUI(guess > secretNumber ? '📈 Too High' : '📉 Too Low');
			displayTextUI(score,scoreElem);
		} else {
			message.textContent = "🤯 You loose the game";
			displayTextUI("🤯 You loose the game");
			displayTextUI(0,scoreElem);
			this.setAttribute('disabled', 'disabled')
		}
	}
		
	
});

againElem.addEventListener('click', () => {
	secretNumber = Math.trunc(Math.random() * 20) + 1;
	score = SCORE;
	
	displayTextUI(SCORE,scoreElem);
	displayTextUI('?',numberElem);
	displayTextUI('Start guessing...');
	
	numberInput.value = '';
	checkBtn.removeAttribute('disabled');
	bodyElem.style.backgroundColor  = '#222';
	numberElem.style.width  = '15rem';
})


