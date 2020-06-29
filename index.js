/* import styling */
(function importStyles() {
  const stylesheet = document.createElement('link');
  stylesheet.rel = 'stylesheet';
  stylesheet.href = './style.css';

  document.head.appendChild(stylesheet);
})();

const prefix = 'vdp';
const monthNames = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

class ViotDatePicker {
  #selector = 'viot-dp';
  #lang = 'en-US';
  #date = new Date();
  #year = 'numeric';
  #month = 'long';
  #day = 'numeric';

  constructor({ selector, lang, date, year, month, day }) {
    this.#selector = selector || this.#selector;
    this.#lang = lang || this.#lang;
    this.#date = date || this.#date;
    this.#year = year || this.#year;
    this.#month = month || this.#month;
    this.#day = day || this.#day;

    this.init = (() => {
      const selector = document.getElementById(this.#selector);
      selector.appendChild(this.#render());
    })();
  }

  #renderMonths = () => {
    const monthsWrapper = document.createElement('div');
    monthsWrapper.id = `${prefix}-months`;

    for (const month of monthNames) {
      // const shortName = month.toLowerCase().slice(0, 3);
      const monthNode = document.createElement('div');
      monthNode.innerText = month;
      // monthNode.className = `${prefix}-${shortName}`;
      monthsWrapper.appendChild(monthNode);
    }

    return monthsWrapper;
  };

  #renderYear = () => {
    const yearNode = document.createElement('span');
    yearNode.id = `${prefix}-year`;
    yearNode.innerText = this.#date.getFullYear();

    return yearNode;
  };

  #renderDays = () => {
    const currentDay = new Date().getDate();
    const days = [...Array(32).keys()].slice(1);
    const daysWrapper = document.createElement('div');
    daysWrapper.id = `${prefix}-days`;

    for (const day of days) {
      const dayNode = document.createElement('div');

      if (currentDay === day) dayNode.className = '--today';

      dayNode.addEventListener('click', () => {
        const selectedClassName = '--selected';
        const selectedNode = document.getElementsByClassName(
          selectedClassName,
        )[0];

        if (selectedNode) selectedNode.classList.remove(selectedClassName);
        this.classList.add(selectedClassName);
      });

      dayNode.innerText = day;
      daysWrapper.appendChild(dayNode);
    }

    return daysWrapper;
  };

  #prevMonth = () => {
    const prevNode = document.createElement('button');
    prevNode.id = `${prefix}-prev-month`;
    prevNode.innerText = '<';

    prevNode.addEventListener('click', () => {
      const prevDate = new Date(this.#date.setMonth(this.#date.getMonth() - 1));

      document.getElementById(
        `${prefix}-month-name`,
      ).innerText = prevDate.toLocaleDateString(this.#lang, {
        month: this.#month,
      });

      document.getElementById(
        `${prefix}-year`,
      ).innerText = prevDate.getFullYear();
    });

    return prevNode;
  };

  #nextMonth = () => {
    const nextNode = document.createElement('button');
    nextNode.id = `${prefix}-next-month`;
    nextNode.innerText = '>';

    nextNode.addEventListener('click', () => {
      const nextDate = new Date(this.#date.setMonth(this.#date.getMonth() + 1));

      document.getElementById(
        `${prefix}-month-name`,
      ).innerText = nextDate.toLocaleDateString(this.#lang, {
        month: this.#month,
      });

      document.getElementById(
        `${prefix}-year`,
      ).innerText = nextDate.getFullYear();
    });

    return nextNode;
  };

  #monthName = () => {
    const monthName = document.createElement('span');
    monthName.id = `${prefix}-month-name`;
    monthName.innerText = this.#date.toLocaleDateString(this.#lang, {
      month: this.#month,
    });

    return monthName;
  };

  #monthYearWrapper = () => {
    const monthYearWrapper = document.createElement('div');
    const yearNode = this.#renderYear(this.#date);
    const monthNode = this.#monthName(this.#lang, this.#date, this.#month);

    monthYearWrapper.appendChild(monthNode);
    monthYearWrapper.appendChild(yearNode);

    return monthYearWrapper;
  };

  #monthWrapper = () => {
    const monthWrapper = document.createElement('div');
    monthWrapper.id = `${prefix}-month-wrapper`;
    const prevNode = this.#prevMonth(this.#lang, this.#date, this.#month);
    const monthYearNode = this.#monthYearWrapper(
      this.#lang,
      this.#date,
      this.#month,
    );
    const nextNode = this.#nextMonth(this.#lang, this.#date, this.#month);

    monthWrapper.appendChild(prevNode);
    monthWrapper.appendChild(monthYearNode);
    monthWrapper.appendChild(nextNode);

    return monthWrapper;
  };

  #today = () => {
    const todayNode = document.createElement('button');
    todayNode.className = `${prefix}-today`;
    todayNode.innerText = 'Today';

    todayNode.addEventListener('click', () => {
      this.#date = new Date();

      document.getElementById(
        `${prefix}-month-name`,
      ).innerText = this.#date.toLocaleDateString(this.#lang, {
        month: this.#month,
      });

      document.getElementById(
        `${prefix}-year`,
      ).innerText = this.#date.getFullYear();
    });

    return todayNode;
  };

  #render = () => {
    const wrapper = document.createElement('div');
    wrapper.className = `${prefix}-wrapper`;

    /* Render all months */
    wrapper.appendChild(this.#monthWrapper());

    /* Render all days in this month */
    wrapper.appendChild(this.#renderDays());

    /* today button */
    const todayNode = this.#today();
    wrapper.appendChild(todayNode);

    return wrapper;
  };
}

exports = { ViotDatePicker };
