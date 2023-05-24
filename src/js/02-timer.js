import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const refs = {
  inputField: document.querySelector('#datetime-picker'),
  startBtn: document.querySelector('button[data-start]'),
  stopBtn: document.querySelector('button[data-stop]'),
  clockface: document.querySelector('.timer')
};
  
let endTime; // Добавляем переменную endTime

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    const selectedDate = selectedDates[0];

    if (selectedDate <= new Date()) {
      Notify.warning("Please choose a date in the future");
      refs.startBtn.disabled = true;
    } else {
      refs.startBtn.disabled = false;
    }
  },
};

refs.startBtn.disabled = true;

flatpickr('#datetime-picker', options);

// Обработчик события change для выбора даты
refs.inputField.addEventListener('change', function (event) {
  endTime = new Date(event.target.value);
  refs.startBtn.disabled = false; // доп.код для деактивации кнопки при загрузке страницы
});

class Timer {
  constructor({ onTick }) {
    this.intervalId = null;
    this.isActive = false;
    this.onTick = onTick;

    this.init();
  }
// дополним наш класс функционалом: при открытии страницы в нашем интерфейсе будет сразу доступен счетчик с нолями.
    init() {
    const time = this.convertMs(0);
    this.onTick(time);
  }

  start() {
    if (this.isActive) {
      return;
    }
// Доп.код для деактивации поля инпута и кнопки старт:
  refs.inputField.disabled = true;
    refs.startBtn.disabled = true;
    refs.stopBtn.disabled = false;
    

  const currentTime = Date.now();
  const deltaTime = endTime - currentTime;

  if (deltaTime <= 0) {
    return;
  }

    this.isActive = true;

    this.intervalId = setInterval(() => {
      const currentTime = Date.now();
      const deltaTime = endTime - currentTime;

    if (deltaTime <= 0) {
      this.stop();
      return;
    }
      const time = this.convertMs(deltaTime);

      this.onTick(time);
    }, 1000);
  }

  stop() {
    clearInterval(this.intervalId);
    this.isActive = false;
    const time = this.convertMs(0);
    this.onTick(time);

    refs.inputField.disabled = false;
    refs.startBtn.disabled = false;
    refs.stopBtn.disabled = true;
  }

// Принимает число, приводит к строке и добавляет в начало 0 если число меньше 2-х знаков
 addLeadingZero(value) {
     return String(value).padStart(2, '0');
}    
    
// Функция которая будет полученный результат преобразовать в нормальный формат времени:
convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const days =  this.addLeadingZero(Math.floor(ms / day));
  const hours = this.addLeadingZero(Math.floor((ms % day) / hour));
  const minutes = this.addLeadingZero(Math.floor(((ms % day) % hour) / minute));
  const seconds = this.addLeadingZero(Math.floor((((ms % day) % hour) % minute) / second));

  return { days, hours, minutes, seconds };
}

}

const timer = new Timer({
  onTick: updateClockface,
});

refs.startBtn.addEventListener('click', timer.start.bind(timer));
refs.stopBtn.addEventListener('click', timer.stop.bind(timer));

// Функция updateClockface принимает время в миллисекундах, Высчитывает сколько в них вмещается часов/минут/секунд, Рисует интерфейс:
function updateClockface({ days, hours, minutes, seconds }) {
    const daysElement = refs.clockface.querySelector('[data-days]');
    const hoursElement = refs.clockface.querySelector('[data-hours]');
    const minutesElement = refs.clockface.querySelector('[data-minutes]');
    const secondsElement = refs.clockface.querySelector('[data-seconds]');

daysElement.textContent = isNaN(days) ? '00' : this.addLeadingZero(days);
hoursElement.textContent = isNaN(hours) ? '00' : this.addLeadingZero(hours);
minutesElement.textContent = isNaN(minutes) ? '00' : this.addLeadingZero(minutes);
secondsElement.textContent = isNaN(seconds) ? '00' : this.addLeadingZero(seconds);
}