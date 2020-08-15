import ComponentView from "./component.js";

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
          <span class="day__counter">${this._number}</span>
          <time class="day__date" datetime="2019-03-18">${this._date}</time>
        </div>

        <ul class="trip-events__list">
        </ul>
      </li>
    `;
  }
}
