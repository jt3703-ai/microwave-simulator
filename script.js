// These variables describe the microwave's current state.
let doorOpen = false;
let remainingSeconds = 0;
let isHeating = false;
let timerId = null; // Stores the interval so we can stop it later.

const door = document.querySelector('#door');
const doorLabel = document.querySelector('#doorLabel');
const timer = document.querySelector('#timer');
const status = document.querySelector('#status');
const secondsInput = document.querySelector('#seconds');
const timeForm = document.querySelector('#timeForm');
const setTimeButton = document.querySelector('#setTime');
const startButton = document.querySelector('#start');
const pauseButton = document.querySelector('#pause');
const cancelButton = document.querySelector('#cancel');
const doorButton = document.querySelector('#toggleDoor');

// Keep the visible interface consistent with the state variables.
function updateDisplay() {
  timer.textContent = remainingSeconds + ' s';
  door.classList.toggle('open', doorOpen);
  door.classList.toggle('heating', isHeating);
  doorLabel.textContent = doorOpen ? 'DOOR OPEN' : (isHeating ? 'HEATING' : 'DOOR CLOSED');
  doorButton.textContent = doorOpen ? 'Close door' : 'Open door';
  doorButton.setAttribute('aria-expanded', String(doorOpen));
  startButton.disabled = isHeating;
  pauseButton.disabled = !isHeating && remainingSeconds === 0;
  pauseButton.textContent = isHeating ? 'Pause' : 'Resume';
  secondsInput.disabled = isHeating;
  setTimeButton.disabled = isHeating;
}

function stopHeating() {
  clearInterval(timerId);
  timerId = null;
  isHeating = false;
}

function startHeating() {
  // Check safety and timer conditions before starting an interval.
  if (doorOpen) {
    status.textContent = 'Close the door before heating.';
  } else if (remainingSeconds <= 0) {
    status.textContent = 'Set a cooking time first.';
  } else if (!isHeating) {
    isHeating = true;
    status.textContent = 'Heating…';
    timerId = setInterval(function () {
      remainingSeconds = remainingSeconds - 1;
      if (remainingSeconds <= 0) {
        remainingSeconds = 0;
        stopHeating();
        status.textContent = 'Cooking complete! Enjoy your food.';
      }
      updateDisplay();
    }, 1000);
  }
  updateDisplay();
}

timeForm.addEventListener('submit', function (event) {
  event.preventDefault(); // Keep the form from reloading the page.
  const enteredSeconds = Number(secondsInput.value);
  if (isHeating) {
    status.textContent = 'Pause heating before changing the time.';
  } else if (Number.isInteger(enteredSeconds) && enteredSeconds >= 1 && enteredSeconds <= 3600) {
    remainingSeconds = enteredSeconds;
    status.textContent = 'Time set. ' + (doorOpen ? 'Close the door to start.' : 'Ready to start.');
  } else {
    status.textContent = 'Enter a whole number from 1 to 3600.';
  }
  updateDisplay();
});

startButton.addEventListener('click', startHeating);

pauseButton.addEventListener('click', function () {
  if (isHeating) {
    stopHeating();
    status.textContent = 'Paused. Press Resume to continue.';
    updateDisplay();
  } else {
    startHeating(); // Resume uses the same door and time checks as Start.
  }
});

doorButton.addEventListener('click', function () {
  doorOpen = !doorOpen;
  if (doorOpen) {
    stopHeating(); // Opening the door always stops the heating interval.
    status.textContent = remainingSeconds > 0
      ? 'Door open. Close it and press Resume to continue.'
      : 'Door open. Heating is blocked.';
  } else {
    status.textContent = remainingSeconds > 0
      ? 'Door closed. Ready to start or resume.'
      : 'Door closed. Set a cooking time.';
  }
  updateDisplay();
});

cancelButton.addEventListener('click', function () {
  stopHeating();
  remainingSeconds = 0;
  status.textContent = 'Cooking canceled. Timer reset.';
  updateDisplay();
});

updateDisplay();
