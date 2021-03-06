import ComponentView from "./component.js";
import {formatDateAsISOString, formatDateAsDateMD} from "../util/date.js";

export default class TripDay extends ComponentView {
  constructor(date, number) {
    super();
    this._date = date;
    this._number = number;
  }

  getTemplate() {
    return `
      <li class="trip-days__item  day">
        <div class="day__info">
          ${this._number ? `
            <span class="day__counter">${this._number}</span>
          ` : ``}
          ${this._date ? `
            <time class="day__date" datetime="${formatDateAsISOString(this._date)}">${formatDateAsDateMD(this._date)}</time>
          ` : ``}
        </div>

        <ul class="trip-events__list">
        </ul>
      </li>
    `;
  }

  _findContainerElement() {
    return this.getElement().querySelector(`.trip-events__list`);
  }
}
