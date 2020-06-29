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

function renderMonths() {
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
}

function renderDays() {
  const currentDay = new Date().getDate();
  const days = [...Array(32).keys()].slice(1);
  const daysWrapper = document.createElement('div');
  daysWrapper.id = `${prefix}-days`;

  for (const day of days) {
    const dayNode = document.createElement('div');

    if (currentDay === day) dayNode.className = '--today';

    dayNode.addEventListener('click', function () {
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
}

function prevMonth() {
  const prevButton = document.createElement('button');
  prevButton.id = `${prefix}-prev-month`;
  prevButton.innerText = '<';

  return prevButton;
}

function nextMonth() {
  const nextButton = document.createElement('button');
  nextButton.id = `${prefix}-next-month`;
  nextButton.innerText = '>';

  return nextButton;
}

function monthName(lang, date, month) {
  const monthName = document.createElement('span');
  monthName.id = `${prefix}-month-name`;
  monthName.innerText = date.toLocaleDateString(lang, {
    month,
  });

  return monthName;
}

function renderMonth({ lang, date, month }) {
  const monthWrapper = document.createElement('div');
  monthWrapper.id = `${prefix}-month-wrapper`;
  const prevNode = prevMonth();
  const nameNode = monthName(lang, date, month);
  const nextNode = nextMonth();

  prevNode.addEventListener('click', () => {
    const prevDate = new Date(date.setMonth(date.getMonth() - 1));
    console.log(prevDate);
  });

  nextNode.addEventListener('click', () => {
    const nextDate = new Date(date.setMonth(date.getMonth() + 1));
    console.log(nextDate);
  });

  monthWrapper.appendChild(prevNode);
  monthWrapper.appendChild(nameNode);
  monthWrapper.appendChild(nextNode);

  return monthWrapper;
}

function render(conf) {
  const wrapper = document.createElement('div');
  wrapper.className = `${prefix}-wrapper`;

  /* Render all months */
  // wrapper.appendChild(renderMonths());
  wrapper.appendChild(renderMonth(conf));

  /* Render all days in this month */
  wrapper.appendChild(renderDays());

  /* today button */
  const today = document.createElement('button');
  today.className = `${prefix}-today`;
  today.innerText = 'Today';
  wrapper.appendChild(today);

  return wrapper;
}

class ViotDatePicker {
  constructor(conf) {
    this.conf = {
      selector: conf.selector || 'viot-dp',
      lang: conf.lang || 'en-US',
      date: new Date(),
      year: conf.year || 'numeric',
      month: conf.month || 'long',
      day: conf.day || 'numeric',
    };

    this.init = (() => {
      const selector = document.getElementById(this.conf.selector);
      selector.appendChild(render(this.conf));
    })();
  }
}

exports = { ViotDatePicker };
