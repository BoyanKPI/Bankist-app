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
  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-05-27T17:01:17.194Z',
    '2020-07-11T23:36:17.929Z',
    '2020-07-12T10:51:36.790Z',
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
const displayMovements = function (acc, sort = false) {
  containerMovements.innerHTML = "";
  //sorting in ascending order... 
  //using slice() to create a copy and not
  //sort the original array
  const movs = sort ? acc.movements
    .slice()
    .sort((a, b) => a - b) : acc.movements;
    
  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    const date = new Date (acc.movementsDates[i]);
    const daysPassed = Math.round(Math.abs(new Date() - date) / (1000 * 60 * 60 * 24));
    let displayDate;
    if (daysPassed === 0) {displayDate = 'Today'}
    else if (daysPassed === 1) {displayDate = 'Yesterday'}
    else if (daysPassed <= 7) {displayDate = `${daysPassed} days ago`}
    else {
      const day = `${date.getDate()}`.padStart(2, 0);
      const month = `${date.getMonth() + 1}`.padStart(2, 0); ; 
      const year = date.getFullYear();
      displayDate = `${day}/${month}/${year}`;
    }
      const html = `
      <div class="movements__row">
      <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
      <div class="movements__date">${displayDate}</div>
      <div class="movements__value">${mov.toFixed(2)}</div>
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
  labelBalance.textContent = `${acc.balance.toFixed(2)} €`;
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
  labelSumIn.textContent = `${income.toFixed(2)} €`;
  
  const out = obj.movements
  .filter(mov => mov < 0)
  .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `${Math.abs(out).toFixed(2)} €`;
  
  const interest = obj.movements
  .filter(mov => mov > 0)
  .map(deposit => (deposit * obj.interestRate) / 100)
  .reduce((acc, interest) => acc + interest, 0);
  labelSumInterest.textContent = `${interest.toFixed(2)} €`;
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
      displayMovements(acc);
      // Display balance
      calcDysplaytBalance(acc);
      // Display summary
      calcDisplaySummary(acc);
}


/*
  Timer function
*/

const startLogoutTimer = function(){

    const tick = function(){
    // Implement minutes
    const min =String(Math.trunc(time / 60))
    .padStart(2, 0) ;
    const sec = String(time % 60).padStart(2, 0);
    // In each call, print the remaining time ti UI
    labelTimer.textContent = `${min}:${sec}`;
    // When 0 seconds, stop timer and log out user
    if(time===0){
      clearInterval(timer);
      labelWelcome.textContent = `Log in to ger started`
      containerApp.style.opacity = 0;
    }
    // Decrease time for 1
    time--
  }
  // Set time to 5 minutes
  let time = 300;
  tick();
  // Call the timer every second
  const timer = setInterval(tick ,1000)
  return timer;
}


//////////////////// Event handlers

let currentAccount, timer; /* defining the variable in outer scope */


/*
Date as of today
*/
const now = new Date();
// .padStart(2, 0) .... python zfill(2) 
const day = `${now.getDate()}`.padStart(2, 0);
const month = `${now.getMonth() + 1}`.padStart(2, 0); ; 
const year = now.getFullYear();
const hour = `${now.getHours()}`.padStart(2, 0);
const min = `${now.getMinutes()}`.padStart(2, 0);
labelDate.textContent = `${day}/${month}/${year}, ${hour}:${min}`;


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
    // Start timer
    if(timer) clearInterval(timer);
    timer = startLogoutTimer();
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
  // Add transfer date
    currentAccount.movementsDates
    .push(new Date().toISOString());
    recieverAcc.movementsDates
    .push(new Date().toISOString());
  // update UI
    updateUI(currentAccount);
  // Reset timer
  clearInterval(timer);
  timer = startLogoutTimer();
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
    setTimeout(function() {    
        // Add movement
        currentAccount.movements.push(amount);
        // Add transfer date
        currentAccount.movementsDates
        .push(new Date().toISOString());
        //Update UI
        updateUI(currentAccount)},2500);
          // Reset timer
        clearInterval(timer);
        timer = startLogoutTimer();
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
  displayMovements(currentAccount, !sorted);
  sorted = !sorted;
})