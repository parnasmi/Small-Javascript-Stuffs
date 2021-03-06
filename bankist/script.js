'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

/////////////////////////////////////////////////
let currentAccount, timer;

// Data
const account1 = {
	owner: 'Jonas Schmedtmann',
	movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
	interestRate: 1.2, // %
	pin: 1111,

	movementsDates: [
		'2019-11-18T21:31:17.178Z',
		'2019-12-23T07:42:02.383Z',
		'2020-01-28T09:15:04.904Z',
		'2020-04-01T10:17:24.185Z',
		'2020-05-08T14:11:59.604Z',
		'2020-12-24T17:01:17.194Z',
		'2020-12-28T23:36:17.929Z',
		'2020-12-29T10:51:36.790Z',
	],
	currency: 'EUR',
	locale: 'pt-PT', // de-DE
};

const account2 = {
	owner: 'Jessica Davis',
	movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
	interestRate: 1.5,
	pin: 2222,

	movementsDates: [
		'2019-11-01T13:15:33.035Z',
		'2019-11-30T09:48:16.867Z',
		'2019-12-25T06:04:23.907Z',
		'2020-01-25T14:18:46.235Z',
		'2020-02-05T16:33:06.386Z',
		'2020-04-10T14:43:26.374Z',
		'2020-06-25T18:49:59.371Z',
		'2020-07-26T12:01:20.894Z',
	],
	currency: 'USD',
	locale: 'en-US',
};

const accounts = [account1, account2];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

const currencies = new Map([
	['USD', 'United States dollar'],
	['EUR', 'Euro'],
	['GBP', 'Pound sterling'],
]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

const calcDaysPassed = (date1, date2) => {
	return Math.round(Math.abs((date1 - date2) / (1000 * 60 * 60 * 24)));
};

const formatDates = (date, locale) => {
	const daysPassed = calcDaysPassed(new Date(), date);

	if (daysPassed === 0) return 'today';
	if (daysPassed === 1) return 'yesterday';
	if (daysPassed <= 7) return `${daysPassed} days passed`;

	// const day = `${date.getDate()}`.padStart(2, 0);
	// const month = `${date.getMonth()}`.padStart(2, 0);
	// const year = date.getFullYear();
	// return `${day}/${month}/${year}`;

	return new Intl.DateTimeFormat(locale).format(date);
};

const formatCur = (value, locale, currency) => {
	return new Intl.NumberFormat(locale, {
		style: 'currency',
		currency: currency,
	}).format(value);
};

const displayContainer = (acc, sort) => {
	const { movements, movementsDates } = acc;

	containerMovements.innerHTML = '';
	const moves = sort ? movements.slice().sort((a, b) => a - b) : movements;
	moves.forEach((mov, i) => {
		const type = mov > 1 ? 'deposit' : 'withdrawal';

		const date = new Date(movementsDates[i]);
		const displayDate = formatDates(date, acc.locale);

		const formattedMov = formatCur(mov, acc.locale, acc.currency);

		const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
        <div class="movements__date">${displayDate}</div>
        <div class="movements__value">${formattedMov}</div>
      </div
    `;
		containerMovements.insertAdjacentHTML('afterbegin', html);
	});
};

const createUsernames = accs => {
	accs.forEach(acc => {
		acc.username = acc.owner
			.toLowerCase()
			.split(' ')
			.map(name => name[0])
			.join('');
	});
};
createUsernames(accounts);

const resetUI = () => {
	inputCloseUsername.value = inputClosePin.value = '';
	containerApp.style.opacity = 0;
	labelWelcome.textContent = 'Log in to get started';
};

const displayCalcBalance = acc => {
	acc.balance = acc.movements.reduce((acc, curr) => acc + curr, 0);
	labelBalance.textContent = formatCur(acc.balance, acc.locale, acc.currency);
};

const calcDisplaySummary = acc => {
	const { movements, interestRate, locale, currency } = acc;
	const income = movements.filter(mov => mov > 0).reduce((acc, curr) => acc + curr, 0);
	const outcome = movements.filter(mov => mov < 0).reduce((acc, curr) => acc + curr, 0);
	const interest = movements
		.filter(mov => mov > 0)
		.map(deposit => (deposit * interestRate) / 100)
		.filter(int => int > 1)
		.reduce((acc, curr) => acc + curr, 0);

	labelSumIn.textContent = formatCur(income, locale, currency);
	labelSumOut.textContent = formatCur(Math.abs(outcome), locale, currency);
	labelSumInterest.textContent = formatCur(Math.abs(interest), locale, currency);
};

const logoutTimer = () => {
	let time = 300;
	const tick = () => {
		const minute = String(Math.trunc(time / 60)).padStart(2, 0);
		const seconds = String(time % 60).padStart(2, 0);

		//In each call, print the remaining time to UI
		labelTimer.textContent = `${minute}:${seconds}`;

		if (time === 0) {
			clearTimeout(timer);

			resetUI();
		}

		time--;
	};
	tick();
	const timer = setInterval(tick, 1000);
	return timer;
};

const updateUI = acc => {
	//Display movements
	displayContainer(acc);

	//Display balance
	displayCalcBalance(acc);

	//Display summary
	calcDisplaySummary(acc);
};

btnLogin.addEventListener('click', function (e) {
	e.preventDefault();
	currentAccount = accounts.find(acc => acc.username === inputLoginUsername.value);

	if (currentAccount?.pin === Number(inputLoginPin.value)) {
		//Display UI and message
		labelWelcome.textContent = `Welcome, ${currentAccount.owner.split(' ')[0]}`;
		containerApp.style.opacity = 1;

		//Clear fields
		inputLoginUsername.value = inputLoginPin.value = '';
		inputLoginPin.blur();

		//Update UI
		updateUI(currentAccount);

		if (timer) {
			clearInterval(timer);
		}
		//Calling countdown timer.
		timer = logoutTimer();

		const date = new Date();
		const options = {
			hour: 'numeric',
			minute: 'numeric',
			day: 'numeric',
			month: 'long',
			year: 'numeric',
			weekday: 'long',
		};

		const locale = navigator.language;

		labelDate.textContent = new Intl.DateTimeFormat(currentAccount.locale, options).format(date);
	}
});

btnTransfer.addEventListener('click', function (e) {
	e.preventDefault();

	const amount = Number(inputTransferAmount.value);
	const receiverAcc = accounts.find(acc => acc.username === inputTransferTo.value);
	inputTransferAmount.value = inputTransferTo.value = '';

	if (
		amount > 0 &&
		currentAccount.balance >= amount &&
		receiverAcc &&
		receiverAcc.username !== currentAccount.username
	) {
		receiverAcc.movements.push(amount);
		currentAccount.movements.push(-amount);

		receiverAcc.movementsDates.push(new Date().toISOString());
		currentAccount.movementsDates.push(new Date().toISOString());
	}
	//Update UI
	updateUI(currentAccount);

	//reset timer
	clearInterval(timer);
	timer = logoutTimer();
});

//Delete the current account
btnClose.addEventListener('click', function (e) {
	e.preventDefault();

	const username = inputCloseUsername.value;
	const pin = inputClosePin.value;

	if (currentAccount.pin === Number(pin) && currentAccount.username === username) {
		const index = accounts.findIndex(acc => acc.username === username);
		accounts.splice(index, 1);
	}

	resetUI();
});

//Request loan
btnLoan.addEventListener('click', function (e) {
	e.preventDefault();

	const amount = Math.floor(inputLoanAmount.value);

	if (amount > 0 && currentAccount.movements.some(mov => mov > amount * 0.1)) {
		//Add movement
		currentAccount.movements.push(amount);
		currentAccount.movementsDates.push(new Date().toISOString());
		//Update UI(When you don't use React😊 )
		updateUI(currentAccount);
	}
	inputLoanAmount.value = '';
});

let sorted = false;

btnSort.addEventListener('click', function (e) {
	e.preventDefault();

	displayContainer(currentAccount, !sorted);
	sorted = !sorted;
});
