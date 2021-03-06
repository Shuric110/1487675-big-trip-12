import ComponentView from "./component.js";
import {EVENT_TYPES} from "../const.js";
import {formatDateTimeAsISOString, formatDateAsTimeHM, formatIntervalDuration} from "../util/date.js";
import he from "he";

const MAX_OFFERS = 3;

export default class Event extends ComponentView {
  constructor(evt) {
    super();
    this._evt = evt;

    this._formRollupButtonClickHandler = this._formRollupButtonClickHandler.bind(this);
  }

  getTemplate() {
    const {type, destination, beginDateTime, endDateTime, cost, offers} = this._evt;

    const eventTypeInfo = EVENT_TYPES[type];

    const offersTemplate = offers.length === 0 ? `` : `
      <h4 class="visually-hidden">Offers:</h4>
      <ul class="event__selected-offers">
        ${offers
          .slice(0, MAX_OFFERS)
          .map(({name, cost: offerCost}) =>
            `
          <li class="event__offer">
          <span class="event__offer-title">${name}</span>
          &plus;
          &euro;&nbsp;<span class="event__offer-price">${offerCost}</span>
          </li>
        `).join(``)}
      </ul>
    `;

    return `
      <li class="trip-events__item">
        <div class="event">
          <div class="event__type">
            <img class="event__type-icon" width="42" height="42" src="img/icons/${type}.png" alt="Event type icon">
          </div>
          <h3 class="event__title">${eventTypeInfo.titlePrefix}${he.encode(destination)}</h3>

          <div class="event__schedule">
            <p class="event__time">
              <time class="event__start-time" datetime="${formatDateTimeAsISOString(beginDateTime)}">${formatDateAsTimeHM(beginDateTime)}</time>
              &mdash;
              <time class="event__end-time" datetime="${formatDateTimeAsISOString(endDateTime)}">${formatDateAsTimeHM(endDateTime)}</time>
            </p>
            <p class="event__duration">${formatIntervalDuration(beginDateTime, endDateTime)}</p>
          </div>

          <p class="event__price">
            &euro;&nbsp;<span class="event__price-value">${cost}</span>
          </p>

          ${offersTemplate}

          <button class="event__rollup-btn" type="button">
            <span class="visually-hidden">Open event</span>
          </button>
        </div>
      </li>
    `;
  }

  _formRollupButtonClickHandler(evt) {
    evt.preventDefault();
    this._callback.rollupButtonClick();
  }

  setRollupButtonClickHandler(callback) {
    this._callback.rollupButtonClick = callback;
    this.getElement().querySelector(`.event__rollup-btn`).addEventListener(`click`, this._formRollupButtonClickHandler);
  }
}
