'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
	owner: 'Jonas Schmedtmann',
	movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
	interestRate: 1.2, // %
	pin: 1111,
};

const account2 = {
	owner: 'Jessica Davis',
	movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
	interestRate: 1.5,
	pin: 2222,
};

const account3 = {
	owner: 'Steven Thomas Williams',
	movements: [200, -200, 340, -300, -20, 50, 400, -460],
	interestRate: 0.7,
	pin: 3333,
};

const account4 = {
	owner: 'Sarah Smith',
	movements: [430, 1000, 700, 50, 90],
	interestRate: 1,
	pin: 4444,
};

const accounts = [account1, account2, account3, account4];

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

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

const currencies = new Map([
	['USD', 'United States dollar'],
	['EUR', 'Euro'],
	['GBP', 'Pound sterling'],
]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

const displayContainer = (movements, sort) => {
	containerMovements.innerHTML = '';
	const moves = sort ? movements.slice().sort((a, b) => a - b) : movements;
	moves.forEach((mov, i) => {
		const type = mov > 1 ? 'deposit' : 'withdrawal';
		const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
        <div class="movements__date">3 days ago</div>
        <div class="movements__value">${mov}€</div>
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

const displayCalcBalance = acc => {
	acc.balance = acc.movements.reduce((acc, curr) => acc + curr, 0);
	labelBalance.textContent = `${acc.balance}€`;
};

const calcDisplaySummary = acc => {
	const { movements, interestRate } = acc;
	const income = movements.filter(mov => mov > 0).reduce((acc, curr) => acc + curr, 0);
	const outcome = movements.filter(mov => mov < 0).reduce((acc, curr) => acc + curr, 0);
	const interest = movements
		.filter(mov => mov > 0)
		.map(deposit => (deposit * interestRate) / 100)
		.filter(int => int > 1)
		.reduce((acc, curr) => acc + curr, 0);

	labelSumIn.textContent = `${income}€`;
	labelSumOut.textContent = `${Math.abs(outcome)}€`;
	labelSumInterest.textContent = `${Math.abs(interest)}€`;
};

const updateUI = acc => {
	//Display movements
	displayContainer(acc.movements);

	//Display balance
	displayCalcBalance(acc);

	//Display summary
	calcDisplaySummary(acc);
};

/////////////////////////////////////////////////
let currentAccount;
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
	}
	//Update UI
	updateUI(currentAccount);
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

	inputCloseUsername.value = inputClosePin.value = '';
	containerApp.style.opacity = 0;
	labelWelcome.textContent = 'Log in to get started';
});

//Request loan
btnLoan.addEventListener('click', function (e) {
	e.preventDefault();

	const amount = Number(inputLoanAmount.value);

	if (amount > 0 && currentAccount.movements.some(mov => mov > amount * 0.1)) {
		//Add movement
		currentAccount.movements.push(amount);
		//Update UI(When you don't use React😊 )
		updateUI(currentAccount);
	}
	inputLoanAmount.value = '';
});

let sorted = false;

btnSort.addEventListener('click', function (e) {
	e.preventDefault();

	displayContainer(currentAccount.movements, !sorted);
	sorted = !sorted;
});
