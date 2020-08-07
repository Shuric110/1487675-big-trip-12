import {EVENT_TYPES} from "../const.js";
import {formatDateAsISOString, formatDateAsTimeHM, formatIntervalDuration} from "../util.js";

export const createEventTemplate = function (evt) {
  const {eventType, destination, beginDateTime, endDateTime, cost, offers} = evt;

  const eventTypeInfo = EVENT_TYPES[eventType];

  const offersTemplate = offers.length === 0 ? `` : `
    <h4 class="visually-hidden">Offers:</h4>
    <ul class="event__selected-offers">
      ${offers
        .filter(({selected}) => selected)
        .slice(0, 2)
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
          <img class="event__type-icon" width="42" height="42" src="img/icons/${eventType}.png" alt="Event type icon">
        </div>
        <h3 class="event__title">${eventTypeInfo.titlePrefix}${destination}</h3>

        <div class="event__schedule">
          <p class="event__time">
            <time class="event__start-time" datetime="${formatDateAsISOString(beginDateTime)}">${formatDateAsTimeHM(beginDateTime)}</time>
            &mdash;
            <time class="event__end-time" datetime="${formatDateAsISOString(endDateTime)}">${formatDateAsTimeHM(endDateTime)}</time>
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
};
