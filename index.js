/* import styling */
(function importStyles() {
  const stylesheet = document.createElement('link');
  stylesheet.rel = 'stylesheet';
  stylesheet.href = './style.css';

  document.head.appendChild(stylesheet);
})();

class ViotDatePicker {
  #prefix = 'vdp';

  #selector = 'viot-dp';
  #lang = 'en-US';
  #date = new Date();
  #year = 'numeric';
  #month = 'long';
  #day = 'numeric';
  #weekday = 'short';

  #primaryColor = 'slategray';
  #highlightColor = 'deepskyblue';

  constructor({
    selector,
    lang,
    date,
    year,
    month,
    day,
    primaryColor,
    highlightColor,
  }) {
    this.#selector = selector || this.#selector;
    this.#lang = lang || this.#lang;
    this.#date = date || this.#date;
    this.#year = year || this.#year;
    this.#month = month || this.#month;
    this.#day = day || this.#day;

    this.#primaryColor = primaryColor || this.#primaryColor;
    this.#highlightColor = highlightColor || this.#highlightColor;

    this.init = (() => {
      const selector = document.getElementById(this.#selector);
      selector.appendChild(this.#render());
      this.#style();
    })();
  }

  getDate() {
    return this.#date;
  }

  #style = () => {
    const root = document.querySelector(':root');

    root.style.setProperty('--primary-color', this.#primaryColor);
    root.style.setProperty('--highlight-color', this.#highlightColor);
  };

  #localeNumbers = (number) => {
    return (
      number
        .toLocaleString(this.#lang)
        .match(/[٠١٢٣٤٥٦٧٨٩]/g)
        ?.join('') || number
    );
  };

  #update = () => {
    const daysWrapper = document.getElementById(`${this.#prefix}-days`);
    document.getElementById(
      `${this.#prefix}-month-name`,
    ).innerText = this.#date.toLocaleDateString(this.#lang, {
      month: this.#month,
    });

    document.getElementById(
      `${this.#prefix}-year`,
    ).innerText = this.#localeNumbers(this.#date.getFullYear());

    daysWrapper.innerHTML = '';
    daysWrapper.append(this.#renderDays());
  };

  #yearNode = () => {
    const yearNode = document.createElement('span');
    yearNode.id = `${this.#prefix}-year`;
    yearNode.innerText = this.#localeNumbers(this.#date.getFullYear());

    return yearNode;
  };

  #week = () => {
    const date = new Date('2020', '00', '05');
    const weekWrapper = document.createElement('div');
    weekWrapper.id = `${this.#prefix}-week`;

    for (let i = 0; i < 7; i++) {
      const weekday = document.createElement('span');

      const dayName = new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate() + i,
      ).toLocaleDateString(this.#lang, { weekday: this.#weekday });

      weekday.innerText = dayName;
      weekWrapper.appendChild(weekday);
    }

    return weekWrapper;
  };

  #renderDays = () => {
    const thisDate = new Date().setHours(0, 0, 0, 0);
    const maxRender = 42;
    const firstDay = new Date(
      new Date(this.#date).setDate(this.#date.getDate() - this.#date.getDay()),
    );

    const currentDate = (i) =>
      new Date(this.#date.getFullYear(), this.#date.getMonth(), i);

    const isToday = (day) => +currentDate(day) === thisDate;

    const daysWrapper = document.createDocumentFragment();
    daysWrapper.id = `${this.#prefix}-days`;

    for (let i = 0; i < maxRender; i++) {
      const dayNode = document.createElement('span');

      if (isToday(i)) dayNode.classList.add('--today');
      if (currentDate(i).getMonth() !== this.#date.getMonth())
        dayNode.classList.add('--dimmed');

      dayNode.addEventListener('click', () => {
        const selectedClassName = '--selected';
        const selectedNode = document.getElementsByClassName(
          selectedClassName,
        )[0];

        if (selectedNode) selectedNode.classList.remove(selectedClassName);
        dayNode.classList.add(selectedClassName);

        this.#date = currentDate(i);
        console.log(this.#date);
      });

      dayNode.innerText = currentDate(i).getDate().toLocaleString(this.#lang);
      daysWrapper.appendChild(dayNode);
    }

    return daysWrapper;
  };

  #prevMonth = () => {
    const prevNode = document.createElement('button');
    prevNode.id = `${this.#prefix}-prev-month`;
    prevNode.innerText = '<';

    prevNode.addEventListener('click', () => {
      this.#date = new Date(this.#date.setMonth(this.#date.getMonth() - 1));
      this.#update();
    });

    return prevNode;
  };

  #nextMonth = () => {
    const nextNode = document.createElement('button');
    nextNode.id = `${this.#prefix}-next-month`;
    nextNode.innerText = '>';

    nextNode.addEventListener('click', () => {
      this.#date = new Date(this.#date.setMonth(this.#date.getMonth() + 1));
      this.#update();
    });

    return nextNode;
  };

  #monthName = () => {
    const monthName = document.createElement('span');
    monthName.id = `${this.#prefix}-month-name`;
    monthName.innerText = this.#date.toLocaleDateString(this.#lang, {
      month: this.#month,
    });

    return monthName;
  };

  #monthYearWrapper = () => {
    const monthYearWrapper = document.createElement('div');
    const yearNode = this.#yearNode(this.#date);
    const monthNode = this.#monthName(this.#lang, this.#date, this.#month);

    monthYearWrapper.appendChild(monthNode);
    monthYearWrapper.appendChild(yearNode);

    return monthYearWrapper;
  };

  #monthWrapper = () => {
    const monthWrapper = document.createElement('div');
    monthWrapper.id = `${this.#prefix}-month-wrapper`;
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
    todayNode.className = `${this.#prefix}-today`;
    todayNode.innerText = 'Today';

    todayNode.addEventListener('click', () => {
      this.#date = new Date();
      this.#update();
    });

    return todayNode;
  };

  #render = () => {
    const wrapper = document.createElement('div');
    wrapper.className = `${this.#prefix}-wrapper`;

    /* render all months */
    wrapper.appendChild(this.#monthWrapper());

    /* render all weekdays */
    wrapper.appendChild(this.#week());

    /* render all days in this month */
    const daysWrapper = document.createElement('div');
    daysWrapper.id = `${this.#prefix}-days`;
    daysWrapper.appendChild(this.#renderDays());
    wrapper.appendChild(daysWrapper);

    /* today button */
    const todayNode = this.#today();
    wrapper.appendChild(todayNode);

    return wrapper;
  };
}

exports = { ViotDatePicker };
