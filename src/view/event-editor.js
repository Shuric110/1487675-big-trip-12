import SmartComponentView from "./smart-component.js";
import {EVENT_TYPES} from "../const.js";
import {formatDateForEditor, getTomorrow} from "../util/date.js";

const BLANK_EVENT = {
  type: `flight`,
  destination: ``,
  beginDateTime: getTomorrow(),
  endDateTime: getTomorrow(),
  cost: 0,
  isFavorite: false,
  offers: [],
  destinationInfo: null
};

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

const createOfferTemplate = function (offer, index) {
  const {name, cost, isSelected} = offer;
  return `
    <div class="event__offer-selector">
      <input class="event__offer-checkbox  visually-hidden" id="event-offer-luggage-1" type="checkbox"
        name="event-offer-luggage" data-index="${index}" ${isSelected ? `checked` : ``}>
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
        ${offers.map((offer, index) => createOfferTemplate(offer, index)).join(``)}
      </div>
    </section>
  `;
};

const createDestinationDescriptionTemplate = function (destinationInfo) {
  return !destinationInfo ? `` : `
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

const createEventEditorTemplate = function (evt) {
  const {type, destination, beginDateTime, endDateTime, cost, isFavorite, offers, getDestinationInfo} = evt;
  const eventTypeInfo = EVENT_TYPES[type];
  const destinationInfo = getDestinationInfo(destination);

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

          <input id="event-favorite-1" class="event__favorite-checkbox  visually-hidden" type="checkbox" name="event-favorite" ${isFavorite ? `checked` : ``}>
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

export default class EventEditor extends SmartComponentView {
  constructor(evt = BLANK_EVENT) {
    super();

    this._destinationInfoHandler = null;

    this._formSubmitHandler = this._formSubmitHandler.bind(this);
    this._formRollupButtonClickHandler = this._formRollupButtonClickHandler.bind(this);
    this.getDestinationInfo = this.getDestinationInfo.bind(this);

    this._typeChangeHandler = this._typeChangeHandler.bind(this);
    this._destinationChangeHandler = this._destinationChangeHandler.bind(this);
    this._priceChangeHandler = this._priceChangeHandler.bind(this);
    this._favoriteClickHandler = this._favoriteClickHandler.bind(this);
    this._offerClickHandler = this._offerClickHandler.bind(this);

    this._data = this.convertEventToData(evt);
  }

  getTemplate() {
    return createEventEditorTemplate(this._data);
  }

  setDestinationInfoHandler(destinationInfoHandler) {
    this._destinationInfoHandler = destinationInfoHandler;
  }

  getDestinationInfo(destination) {
    return this._destinationInfoHandler ? this._destinationInfoHandler(destination) : null;
  }

  _setInnerHandlers() {
    this.getElement().querySelector(`.event__type-list`).addEventListener(`change`, this._typeChangeHandler);
    this.getElement().querySelector(`.event__input--destination`).addEventListener(`change`, this._destinationChangeHandler);
    this.getElement().querySelector(`.event__input--price`).addEventListener(`change`, this._priceChangeHandler);
    this.getElement().querySelector(`.event__favorite-btn`).addEventListener(`click`, this._favouriteClickHandler);

    if (this._data.offers.length > 0) {
      this.getElement().querySelector(`.event__available-offers`).addEventListener(`click`, this._offerClickHandler);
    }
  }

  _typeChangeHandler(evt) {
    if (evt.target.value) {
      evt.preventDefault();
      this._updateData({type: evt.target.value});
    }
  }

  _destinationChangeHandler(evt) {
    evt.preventDefault();
    this._updateData({destination: evt.target.value});
  }

  _priceChangeHandler(evt) {
    evt.preventDefault();
    this._updateData({cost: evt.target.value}, true);
  }

  _formSubmitHandler(evt) {
    evt.preventDefault();
    this._callback.formSubmit();
  }

  _formRollupButtonClickHandler(evt) {
    evt.preventDefault();
    this._callback.rollupButtonClick();
  }

  _favoriteClickHandler(evt) {
    evt.preventDefault();
    this._updateData({isFavorite: !this._data.isFavorite}, true);
    if (this._callback.favoriteClick) {
      this._callback.favoriteClick();
    }
  }

  _offerClickHandler(evt) {
    if (`index` in evt.target.dataset) {
      const offers = this._data.offers.slice();
      offers[evt.target.dataset.index] = Object.assign(
          {},
          offers[evt.target.dataset.index],
          {isSelected: !offers[evt.target.dataset.index].isSelected}
      );
      this._updateData({offers}, true);
    }
  }

  setFormSubmitHandler(callback) {
    this._callback.formSubmit = callback;
    this.getElement().querySelector(`form`).addEventListener(`submit`, this._formSubmitHandler);
  }

  setRollupButtonClickHandler(callback) {
    this._callback.rollupButtonClick = callback;
    this.getElement().querySelector(`.event__rollup-btn`).addEventListener(`click`, this._formRollupButtonClickHandler);
  }

  setFavoriteClickHandler(callback) {
    this._callback.favoriteClick = callback;
  }

  convertEventToData(evt) {
    return Object.assign(
        {},
        evt,
        {getDestinationInfo: this.getDestinationInfo}
    );
  }

  convertDataToEvent(data) {
    const result = Object.assign({}, data);
    delete result.getDestinationInfo;
    return result;
  }
}
