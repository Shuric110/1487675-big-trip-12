import {createElementFromTemplate} from "../util.js";

export default class TripDay {
  constructor(date, number) {
    this._element = null;
    this._date = date;
    this._number = number;
  }

  getElement() {
    if (!this._element) {
      this._element = createElementFromTemplate(this.getTemplate());
    }
    return this._element;
  }

  getTemplate() {
    return `
      <li class="trip-days__item  day">
        <div class="day__info">
          <span class="day__counter">${this._number}</span>
          <time class="day__date" datetime="2019-03-18">${this._date}</time>
        </div>

        <ul class="trip-events__list">
        </ul>
      </li>
    `;
  }
}
