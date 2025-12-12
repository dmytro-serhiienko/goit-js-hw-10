//  Бібліотека
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const dateTimePicker = document.querySelector('#datetime-picker');
const startButton = document.querySelector('[data-start]');
const daysValue = document.querySelector('[data-days]');
const hoursValue = document.querySelector('[data-hours]');
const minutesValue = document.querySelector('[data-minutes]');
const secondsValue = document.querySelector('[data-seconds]');

let userSelectedDate = null;
let timerInterval = null;

// Коли завершиться - не активна
startButton.disabled = true;

//Settings flatpickr
const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    const selectedDate = selectedDates[0];

    //чи майбутня дата
    if (selectedDate <= new Date()) {
      //якщо в минулому
      iziToast.error({
        title: 'Error',
        message: 'Please choose a date in the future',
        position: 'topRight',
      });
      startButton.disabled = true;
      userSelectedDate = null;
    } else {
      //в майбутньому -ок
      userSelectedDate = selectedDate;
      startButton.disabled = false;
    }
  },
};

//старт flatpickr
flatpickr(dateTimePicker, options);

// !
startButton.addEventListener('click', () => {
  if (!userSelectedDate) return;

  // !
  startButton.disabled = true;
  dateTimePicker.disabled = true;

  // таймер-старт
  startTimer();
});

// Функція запуску таймера
function startTimer() {
  // Оновлюємо таймер одразу
  updateTimer();

  // Запускаємо інтервал для оновлення кожну секунду
  timerInterval = setInterval(() => {
    updateTimer();
  }, 1000);
}

// оновлення
function updateTimer() {
  const currentTime = new Date();
  const timeDifference = userSelectedDate - currentTime;

  // чи  дійшов до кінця
  if (timeDifference <= 0) {
    clearInterval(timerInterval);
    updateTimerDisplay({ days: 0, hours: 0, minutes: 0, seconds: 0 });
    dateTimePicker.disabled = false; // Інпут стає активним
    return;
  }

  //  мілісекунди - дні і тд...
  const timeComponents = convertMs(timeDifference);
  updateTimerDisplay(timeComponents);
}

// !
function updateTimerDisplay({ days, hours, minutes, seconds }) {
  daysValue.textContent = addLeadingZero(days);
  hoursValue.textContent = addLeadingZero(hours);
  minutesValue.textContent = addLeadingZero(minutes);
  secondsValue.textContent = addLeadingZero(seconds);
}

// !
function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const days = Math.floor(ms / day);
  const hours = Math.floor((ms % day) / hour);
  const minutes = Math.floor(((ms % day) % hour) / minute);
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

//!
function addLeadingZero(value) {
  return String(value).padStart(2, '0');
}
