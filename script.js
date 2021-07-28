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

// /////////////////////////////////////////////////
// /////////////////////////////////////////////////
// // LECTURES

// /////////////////////////////////////////////////

const displayMovements = function (movements, sort = false) {
  containerMovements.innerHTML = ' ';
  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;
  movs.forEach(function (mov, i) {
    let type;
    mov > 0 ? (type = 'deposit') : (type = 'withdrawal');
    const html = ` <div class="movements__row">
    <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>

    <div class="movements__value">${mov}</div>
  </div>
  `;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};
const date = new Date();
const month = `${date.getMonth()}`.padStart(2, 0);

const day = `${date.getDate()}`.padStart(2, 0);

const year = date.getFullYear();
labelDate.textContent = `${day}/${month}/${year}`;

accounts.forEach(function (accs) {
  accs.username = accs.owner
    .toLowerCase()
    .split(' ')
    .map(name => name[0])
    .join('');
});

const displayBalance = function (acc) {
  acc.balance = acc.movements.reduce(function (accu, mov) {
    return accu + mov;
  }, 0);
  labelBalance.textContent = ` ${acc.balance} € `;
};

const displayBalanceSummary = function (movements) {
  const income = movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${income}€`;
  const withdraws = movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `${Math.abs(withdraws)}€`;

  const interest = movements
    .filter(mov => mov > 0)
    .map(mov => (mov * currentaccount.interestRate) / 100)
    .filter(mov => mov >= 1)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumInterest.textContent = `${interest}€`;
};

const updateUI = function (curr) {
  displayBalance(curr);
  displayBalanceSummary(curr.movements);
  displayMovements(curr.movements);
};

let currentaccount;
btnLogin.addEventListener('click', function (e) {
  e.preventDefault();
  let timer = 300;
  currentaccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );

  if (currentaccount?.pin === Number(inputLoginPin.value)) {
    labelWelcome.textContent = `Welcome Back ${
      currentaccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 100;
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();
    updateUI(currentaccount);

    setInterval(function () {
      if (timer >= 0) {
        let min = Math.floor(timer / 60);
        let sec = timer % 60;
        timer--;
        labelTimer.textContent = `${min}m:${sec}s`;
      } else {
        containerApp.style.opacity = 0;
      }
    }, 1000);
  }
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const reciever = accounts.find(acc => acc.username === inputTransferTo.value);
  if (
    amount > 0 &&
    reciever &&
    currentaccount.balance >= amount &&
    reciever?.username !== currentaccount.username
  ) {
    reciever.movements.push(amount);
    currentaccount.movements.push(-amount);
    updateUI(currentaccount);
  }
  inputTransferAmount.value = inputTransferTo.value = '';
  inputTransferAmount.blur();
});
btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  if (
    Number(inputLoanAmount.value) > 0 &&
    currentaccount.movements.some(
      mov => mov >= Number(inputLoanAmount.value) / 10
    )
  ) {
    currentaccount.movements.push(Number(inputLoanAmount.value));
    updateUI(currentaccount);
  }
  inputLoanAmount.value = '';
});
btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    inputCloseUsername?.value === currentaccount.username &&
    Number(inputClosePin.value) === currentaccount.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentaccount.username
    );
    accounts.splice(index, 1);
    containerApp.style.opacity = 0;
  }
  inputCloseUsername.value = inputClosePin.value = '';
});
let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentaccount.movements, !sorted);
  sorted = !sorted;
});
