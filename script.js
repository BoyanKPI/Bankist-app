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

/*  
  Clearing the container...
  forEach callback function using the... 
  variable (mov) and index (i)...
  Is it deposit or withdrawal... using ternary operator..?
  Creating the dynamic DOM element string to be inserted
  into the movements container... 
  Insert the DOM element string using nsertAdjacentHTML
*/

const displayMovements = function (transactions) {
  containerMovements.innerHTML = ""
  transactions.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal'
    const html = `
    <div class="movements__row">
      <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
      <div class="movements__value">${mov}</div>
    </div>
    `;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};
displayMovements(account1.movements);

/*
Reducing the movemenets array for balance 
display 
*/

const calcDysplaytBalance = function (movements) {
  const balance = movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = `${balance} €`;
}
calcDysplaytBalance(account1.movements)

/*
  Computing the user names from accounts.owner key...
  create the username property for each account...
  assign all the methods to create the property value ==>
  ==> transforming string to lowercase... split by ' ' 
  and take (map) the first letter ([0]) of ewery word...
  join by empty string (join(''))... beauty by methods
*/

const createUsername = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLocaleLowerCase()
      .split(' ')
      .map((name) => name[0])
      .join('');
  });
};
createUsername(accounts);



/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES


const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

////////////////map///////////////////////
const eutToUsd = 1.1
// Map function
const movementsUSD = movements.map(function (mov) {
  return mov * eutToUsd
});

// Map using arrow function
const movementsUSDArrow = movements.map(mov => mov * eutToUsd);

// For of loop old fasion solution
const movementsUSDFor = [];
for (const mov of movements) movementsUSDFor.push(mov * eutToUsd);

/*
  Making use of variable and index to make a
  function ("arrow") return new array for to be used for
  DOM injection
*/

const movementsDescriptions = movements.map((mov, i) =>
  `Movement ${i + 1} You ${mov > 0 ? 'deposited' : 'withdrew'} ${Math.abs(mov)}`
);

/////////////////endmap//////////////////////*/


/////////////////filter////////////////////////
/*
  Filtering for elements that satisfy a 
  certain condition...
  For our case deposits heve positive 
  value while withdrawals have negative 
  values...
*/

const deposit = movements.filter(function (mov) {
  return mov > 0;
})

// withdrawals now with arrow function...
const withdrawals = movements.filter(mov => mov < 0);

/////////////////endfilter////////////////////


//////////////////reduce//////////////////////
/*
  reduce method reduces the array into a 
  single value by snowballing the accumulator!!!
  !!! not that the accomulator has a second
  parameter => initail value (here zet at '0')
  ... the first argument of the call-back
  function that is...
*/

const balance = movements.reduce((acc, cur) => acc + cur, 0);

/////////////////endreduce////////////////////


/////////////////MAX value////////////////////

const max = movements.reduce((acc, mov) =>
acc > mov ? acc : mov , movements[0]
);
console.log(max);
/////////////////End MAX/////////////////////