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
const displayMovements = function (movements, sort = false) {
  containerMovements.innerHTML = "";
  //sorting in ascending order... 
  //using slice() to create a copy and not
  //sort the original array
  const movs = sort ? movements
    .slice()
    .sort((a, b) => a - b) : movements;
    
  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal'
    const html = `
    <div class="movements__row">
      <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
      <div class="movements__value">${mov}</div>
    </div>`;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

/*
Reducing the movemenets array for balance 
display 
*/
const calcDysplaytBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = `${acc.balance} €`;
}

/*
Calculating summary with methods chaining...
creating a new array with + movements...
reduce to a single number with .reduce acc...
*/
const calcDisplaySummary = function (obj) {
  const income = obj.movements
  .filter(mov => mov > 0)
  .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${income} €`;
  
  const out = obj.movements
  .filter(mov => mov < 0)
  .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `${Math.abs(out)} €`;
  
  const interest = obj.movements
  .filter(mov => mov > 0)
  .map(deposit => (deposit * obj.interestRate) / 100)
  .reduce((acc, interest) => acc + interest, 0);
  labelSumInterest.textContent = `${interest} €`;
}

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

/*
  Update UI function
*/
const updateUI = function (acc) {
      // Display movements
      displayMovements(acc.movements);
      // Display balance
      calcDysplaytBalance(acc);
      // Display summary
      calcDisplaySummary(acc);
}

// Event handlers
let currentAccount; /* defining the variable in outer scope */
/*
  Login
*/
btnLogin.addEventListener('click', function (e) {
  e.preventDefault(); //preventing form submitting for now
  currentAccount = accounts
    .find(acc => acc.username === inputLoginUsername.value);
  // Optional chaining (?.) for handeling err to undefined
  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    // Display UI and message
    labelWelcome.textContent = `Wellcome back, 
    ${currentAccount.owner.split(' ')[0]}`;
    containerApp.style.opacity = 100;
    // Clear input fields
    inputLoginUsername.value = inputLoginPin.value = "";
    inputLoginPin.blur(); // unfocus carret
    // update UI
    updateUI(currentAccount);
  }
});

/*
  Transfer money
*/
btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const recieverAcc = accounts
    .find(acc => acc.username === inputTransferTo.value);
  // Clear input fileds
  inputTransferAmount.value = inputTransferTo.value = '';
  if (amount > 0
    && recieverAcc
    && currentAccount.balance >= amount
    && recieverAcc?.username !== currentAccount.username) {
  // add -amount to current account
    currentAccount.movements.push(-amount);
  // add amount to reciever accoutn
    recieverAcc.movements.push(amount);
    // update UI
    updateUI(currentAccount);
}
});

/*
  Request a loan, only it the acc has atleast one
  deposit with atleast 10% of the requested loan
  amount.
*/
btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputLoanAmount.value);
  if (amount > 0
    && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    // Add movement
    currentAccount.movements.push(amount);
    //Update UI
    updateUI(currentAccount);
  }
  //Clear input field
  inputLoanAmount.value = '';
})

/*
  Close account
*/
btnClose.addEventListener('click', function (e) {
  e.preventDefault();
  if (currentAccount.username === inputCloseUsername.value
    && currentAccount.pin === Number(inputClosePin.value)) { 
      
    // finding the index, first one that matches
    const index = accounts.findIndex(acc =>
      acc.username === currentAccount.username)
    // deleting the array element coresponding to the index
    inputCloseUsername.value = inputClosePin.value = '';
    labelWelcome.textContent = `Sorry to se you go, 
    ${currentAccount.owner.split(' ')[0]}`;
    accounts.splice(index, 1);
    //Hide UI
    containerApp.style.opacity = 0;  
    }
})

/*
  Sorting call and state checking for two
  way functioning of a sort state
*/
let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
})