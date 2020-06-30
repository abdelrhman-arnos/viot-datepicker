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

  getDate() {
    return this.#date;
  }

  #update = () => {
    const daysWrapper = document.getElementById(`${this.#prefix}-days`);
    document.getElementById(
      `${this.#prefix}-month-name`,
    ).innerText = this.#date.toLocaleDateString(this.#lang, {
      month: this.#month,
    });

    document.getElementById(
      `${this.#prefix}-year`,
    ).innerText = this.#date.getFullYear();

    daysWrapper.innerHTML = '';
    daysWrapper.append(this.#renderDays());
  };

  #yearNode = () => {
    const yearNode = document.createElement('span');
    yearNode.id = `${this.#prefix}-year`;
    yearNode.innerText = this.#date.getFullYear();

    return yearNode;
  };

  #renderDays = () => {
    const thisDate = new Date();
    const maxRender = 42;

    const currentDate = (i) =>
      new Date(this.#date.getFullYear(), this.#date.getMonth(), i);

    const isToday = (day) =>
      this.#date.getFullYear() === thisDate.getFullYear() &&
      this.#date.getMonth() === thisDate.getMonth() &&
      thisDate.getDate() === day;

    const daysWrapper = document.createDocumentFragment();
    daysWrapper.id = `${this.#prefix}-days`;

    for (let i = 0; i < maxRender; i++) {
      const dayNode = document.createElement('div');

      if (isToday(currentDate(i).getDate())) dayNode.classList.add('--today');
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

      dayNode.innerText = currentDate(i).getDate();
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

    /* Render all months */
    wrapper.appendChild(this.#monthWrapper());

    /* Render all days in this month */
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
