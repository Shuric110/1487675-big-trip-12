import {EVENT_TYPES} from "../const.js";
import {formatDateForEditor} from "../util.js";

const createEventTypeListItemTemplate = function (eventType, eventTypeInfo, selectedEventType) {
  return `
    <div class="event__type-item">
      <input id="event-type-${eventType}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${eventType}"
        ${eventType === selectedEventType ? `checked` : ``}
      >
      <label class="event__type-label  event__type-label--${eventType}" for="event-type-${eventType}-1">${eventTypeInfo.displayName}1</label>
    </div>
  `;
};

const createEventTypeListTemplate = function (selectedEventType) {
  return `
    <fieldset class="event__type-group">
      <legend class="visually-hidden">Transfer</legend>
      ${Object.entries(EVENT_TYPES).filter(([, {isTransport}]) => isTransport)
        .map(([eventType, eventTypeInfo]) => createEventTypeListItemTemplate(eventType, eventTypeInfo, selectedEventType)).join(``)}
    </fieldset>

    <fieldset class="event__type-group">
      <legend class="visually-hidden">Activity</legend>
      ${Object.entries(EVENT_TYPES).filter(([, {isTransport}]) => !isTransport)
        .map(([eventType, eventTypeInfo]) => createEventTypeListItemTemplate(eventType, eventTypeInfo, selectedEventType)).join(``)}
    </fieldset>
  `;
};

const createOfferTemplate = function (offer) {
  const {name, cost, isSelected} = offer;
  return `
    <div class="event__offer-selector">
      <input class="event__offer-checkbox  visually-hidden" id="event-offer-luggage-1" type="checkbox" name="event-offer-luggage" ${isSelected ? `checked` : ``}>
      <label class="event__offer-label" for="event-offer-luggage-1">
        <span class="event__offer-title">${name}</span>
        &plus;
        &euro;&nbsp;<span class="event__offer-price">${cost}</span>
      </label>
    </div>
  `;
};

const createOffersTemplate = function (offers) {
  return offers.length === 0 ? `` : `
    <section class="event__section  event__section--offers">
      <h3 class="event__section-title  event__section-title--offers">Offers</h3>

      <div class="event__available-offers">
        ${offers.map((offer) => createOfferTemplate(offer)).join(``)}
      </div>
    </section>
  `;
};

const createDestinationDescriptionTemplate = function (destinationInfo) {
  return destinationInfo === null ? `` : `
    <section class="event__section  event__section--destination">
      <h3 class="event__section-title  event__section-title--destination">Destination</h3>
      <p class="event__destination-description">${destinationInfo.description}</p>

      ${destinationInfo.photos.length === 0 ? `` : `
        <div class="event__photos-container">
          <div class="event__photos-tape">
            ${destinationInfo.photos.map((photo) => `
              <img class="event__photo" src="${photo}" alt="Event photo">
            `).join(``)}
          </div>
        </div>
      `}
    </section>
  `;
};

export const createEventEditorTemplate = function (evt) {
  if (!evt) {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    evt = {
      type: `flight`,
      destination: ``,
      beginDateTime: tomorrow,
      endDateTime: new Date(tomorrow),
      cost: 0,
      offers: [],
      destinationInfo: null
    };
  }

  const {type, destination, beginDateTime, endDateTime, cost, offers, destinationInfo} = evt;
  const eventTypeInfo = EVENT_TYPES[type];

  const eventTypeListTemplate = createEventTypeListTemplate(type);

  const offersTemplate = createOffersTemplate(offers);
  const destinationDescriptionTemplate = createDestinationDescriptionTemplate(destinationInfo);

  const eventsDetailsTemplate = offersTemplate || destinationDescriptionTemplate ? `
    <section class="event__details">
      ${offersTemplate}
      ${destinationDescriptionTemplate}
    </section>
  ` : ``;

  return `
    <li class="trip-events__item">
      <form class="event  event--edit" action="#" method="post">
        <header class="event__header">
          <div class="event__type-wrapper">
            <label class="event__type  event__type-btn" for="event-type-toggle-1">
              <span class="visually-hidden">Choose event type</span>
              <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
            </label>
            <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

            <div class="event__type-list">
              ${eventTypeListTemplate}
            </div>
          </div>

          <div class="event__field-group  event__field-group--destination">
            <label class="event__label  event__type-output" for="event-destination-1">
              ${eventTypeInfo.titlePrefix}
            </label>
            <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${destination}" list="destination-list-1">
            <datalist id="destination-list-1">
              <option value="Amsterdam"></option>
              <option value="Geneva"></option>
              <option value="Chamonix"></option>
            </datalist>
          </div>

          <div class="event__field-group  event__field-group--time">
            <label class="visually-hidden" for="event-start-time-1">
              From
            </label>
            <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${formatDateForEditor(beginDateTime)}">
            &mdash;
            <label class="visually-hidden" for="event-end-time-1">
              To
            </label>
            <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${formatDateForEditor(endDateTime)}">
          </div>

          <div class="event__field-group  event__field-group--price">
            <label class="event__label" for="event-price-1">
              <span class="visually-hidden">Price</span>
              &euro;
            </label>
            <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${cost}">
          </div>

          <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
          <button class="event__reset-btn" type="reset">Delete</button>

          <input id="event-favorite-1" class="event__favorite-checkbox  visually-hidden" type="checkbox" name="event-favorite" checked>
          <label class="event__favorite-btn" for="event-favorite-1">
            <span class="visually-hidden">Add to favorite</span>
            <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
              <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
            </svg>
          </label>

          <button class="event__rollup-btn" type="button">
            <span class="visually-hidden">Open event</span>
          </button>
        </header>

        ${eventsDetailsTemplate}
      </form>
    </li>
  `;
};
