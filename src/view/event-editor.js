import SmartComponentView from "./smart-component.js";
import {EventType, EVENT_TYPES} from "../const.js";
import {formatDateForEditor, getTomorrow} from "../util/date.js";
import flatpickr from "flatpickr";
import moment from "moment";
import he from "he";

import "flatpickr/dist/flatpickr.min.css";

const BLANK_EVENT = {
  type: EventType.FLIGHT,
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
      <label class="event__type-label  event__type-label--${eventType}" for="event-type-${eventType}-1">${eventTypeInfo.displayName}</label>
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

const createOfferTemplate = function (offer, index, isDisabled) {
  const {name, cost, isSelected} = offer;
  return `
    <div class="event__offer-selector">
      <input class="event__offer-checkbox  visually-hidden" id="event-offer-luggage-${index}" type="checkbox"
        name="event-offer-luggage" data-index="${index}" ${isSelected ? `checked` : ``} ${isDisabled ? `disabled` : ``}>
      <label class="event__offer-label" for="event-offer-luggage-${index}">
        <span class="event__offer-title">${name}</span>
        &plus;
        &euro;&nbsp;<span class="event__offer-price">${cost}</span>
      </label>
    </div>
  `;
};

const createOffersTemplate = function (offers, isDisabled) {
  return offers.length === 0 ? `` : `
    <section class="event__section  event__section--offers">
      <h3 class="event__section-title  event__section-title--offers">Offers</h3>

      <div class="event__available-offers">
        ${offers.map((offer, index) => createOfferTemplate(offer, index, isDisabled)).join(``)}
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
            ${destinationInfo.photos.map(({src, description}) => `
              <img class="event__photo" src="${src}" alt="${he.encode(description)}">
            `).join(``)}
          </div>
        </div>
      `}
    </section>
  `;
};

const createDestinationsListTemplate = function (destinationsList) {
  return `
    <datalist id="destination-list-1">
      ${destinationsList.map((destination) => `
        <option value="${he.encode(destination)}"></option>
      `).join(``)}
    </datalist>
  `;
};

const createEventEditorTemplate = function (data) {
  const {type, destination, beginDateTime, endDateTime, cost, isFavorite, offers, destinationInfo, destinationsList,
    isNewEvent, isDisabled, isSaving, isDeleting} = data;
  const eventTypeInfo = EVENT_TYPES[type];

  const eventTypeListTemplate = createEventTypeListTemplate(type);
  const destinationsListTemplate = createDestinationsListTemplate(destinationsList);

  const offersTemplate = createOffersTemplate(offers, isDisabled);
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
            <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox" ${isDisabled ? `disabled` : ``}>

            <div class="event__type-list">
              ${eventTypeListTemplate}
            </div>
          </div>

          <div class="event__field-group  event__field-group--destination">
            <label class="event__label  event__type-output" for="event-destination-1">
              ${eventTypeInfo.titlePrefix}
            </label>
            <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination"
              value="${he.encode(destination)}" list="destination-list-1" ${isDisabled ? `disabled` : ``}
            >
            ${destinationsListTemplate}
          </div>

          <div class="event__field-group  event__field-group--time">
            <label class="visually-hidden" for="event-start-time-1">
              From
            </label>
            <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time"
              value="${formatDateForEditor(beginDateTime)}" ${isDisabled ? `disabled` : ``}
            >
            &mdash;
            <label class="visually-hidden" for="event-end-time-1">
              To
            </label>
            <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time"
              value="${formatDateForEditor(endDateTime)}" ${isDisabled ? `disabled` : ``}
            >
          </div>

          <div class="event__field-group  event__field-group--price">
            <label class="event__label" for="event-price-1">
              <span class="visually-hidden">Price</span>
              &euro;
            </label>
            <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${cost}" ${isDisabled ? `disabled` : ``}>
          </div>

          <button class="event__save-btn  btn  btn--blue" type="submit">${isSaving ? `Saving...` : `Save`}</button>
          <button class="event__reset-btn" type="reset" ${isDisabled ? `disabled` : ``}>
            ${isNewEvent ? `Cancel` : `${isDeleting ? `Deleting...` : `Delete`}`}
          </button>

          <input id="event-favorite-1" class="event__favorite-checkbox  visually-hidden" type="checkbox" name="event-favorite" ${isFavorite ? `checked` : ``} ${isDisabled ? `disabled` : ``}>
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
  constructor(evt, state, destinationInfoCallback, destinationsListCallback, specialOffersCallback) {
    super();

    this._destinationInfoCallback = destinationInfoCallback;
    this._destinationsListCallback = destinationsListCallback;
    this._specialOffersCallback = specialOffersCallback;

    this._beginDatePicker = null;
    this._endDatePicker = null;

    this._formSubmitHandler = this._formSubmitHandler.bind(this);
    this._formResetHandler = this._formResetHandler.bind(this);
    this._formRollupButtonClickHandler = this._formRollupButtonClickHandler.bind(this);

    this._typeChangeHandler = this._typeChangeHandler.bind(this);
    this._destinationChangeHandler = this._destinationChangeHandler.bind(this);
    this._priceChangeHandler = this._priceChangeHandler.bind(this);
    this._favouriteClickHandler = this._favouriteClickHandler.bind(this);
    this._offerClickHandler = this._offerClickHandler.bind(this);
    this._beginDateChangeHandler = this._beginDateChangeHandler.bind(this);
    this._endDateChangeHandler = this._endDateChangeHandler.bind(this);

    this._data = this.convertEventToData(evt || BLANK_EVENT,
        Object.assign({isNewEvent: !evt}, state));
  }

  getTemplate() {
    return createEventEditorTemplate(this._data);
  }

  getDestinationInfo(destination) {
    const result = this._destinationInfoCallback ? this._destinationInfoCallback(destination) : null;
    return result ? Object.assign({}, result) : null;
  }

  getDestinationsList() {
    return this._destinationsListCallback ? this._destinationsListCallback() : [];
  }

  getSpecialOffers(eventType) {
    return this._specialOffersCallback ? this._specialOffersCallback(eventType) : [];
  }

  _setInnerHandlers() {
    this.getElement().querySelector(`.event__type-list`).addEventListener(`change`, this._typeChangeHandler);
    this.getElement().querySelector(`.event__input--destination`).addEventListener(`change`, this._destinationChangeHandler);
    this.getElement().querySelector(`.event__input--price`).addEventListener(`input`, this._priceChangeHandler);
    this.getElement().querySelector(`.event__favorite-btn`).addEventListener(`click`, this._favouriteClickHandler);

    if (this._data.offers.length > 0) {
      this.getElement().querySelector(`.event__available-offers`).addEventListener(`click`, this._offerClickHandler);
    }

    this._beginDatePicker = this._setDatePicker(
        this._beginDatePicker,
        this.getElement().querySelector(`.event__input--time[name="event-start-time"]`),
        this._data.beginDateTime,
        this._beginDateChangeHandler
    );
    this._endDatePicker = this._setDatePicker(
        this._endDatePicker,
        this.getElement().querySelector(`.event__input--time[name="event-end-time"]`),
        this._data.endDateTime,
        this._endDateChangeHandler
    );

    this._saveButtonElement = this.getElement().querySelector(`.event__save-btn`);
    this._updateSaveEnabled();
  }

  _setDatePicker(oldDatePicker, element, value, changeHandler) {
    if (oldDatePicker) {
      oldDatePicker.destroy();
      oldDatePicker = null;
    }

    if (!element) {
      return null;
    }

    return flatpickr(
        element,
        {
          "dateFormat": `d/m/y H:i`,
          "enableTime": true,
          "time_24hr": true,
          "defaultDate": value,
          "onChange": changeHandler
        }
    );

  }

  _beginDateChangeHandler(selectedDates) {
    this.updateData({
      beginDateTime: selectedDates[0]
    }, true);
  }

  _endDateChangeHandler(selectedDates) {
    this.updateData({
      endDateTime: selectedDates[0]
    }, true);
  }

  _typeChangeHandler(evt) {
    if (evt.target.value) {
      evt.preventDefault();
      this.updateData({
        type: evt.target.value,
        offers: this.getSpecialOffers(evt.target.value)
      });
    }
  }

  _destinationChangeHandler(evt) {
    evt.preventDefault();
    this.updateData({
      destination: evt.target.value,
      destinationInfo: this.getDestinationInfo(evt.target.value)
    });
  }

  _priceChangeHandler(evt) {
    evt.preventDefault();
    this.updateData({cost: evt.target.value}, true);
  }

  _formSubmitHandler(evt) {
    evt.preventDefault();
    this._callback.formSubmit(this.convertDataToEvent(this._data));
  }

  _formResetHandler(evt) {
    evt.preventDefault();
    this._callback.formReset(this.convertDataToEvent(this._data));
  }

  _formRollupButtonClickHandler(evt) {
    evt.preventDefault();
    this._callback.rollupButtonClick();
  }

  _favouriteClickHandler(evt) {
    evt.preventDefault();
    if (!this._data.isDisabled) {
      const update = {isFavorite: !this._data.isFavorite};
      this.updateData(update);
      if (this._callback.favoriteClick) {
        this._callback.favoriteClick(update);
      }
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
      this.updateData({offers}, true);
    }
  }

  setFormSubmitHandler(callback) {
    this._callback.formSubmit = callback;
    this.getElement().querySelector(`form`).addEventListener(`submit`, this._formSubmitHandler);
  }

  setFormResetHandler(callback) {
    this._callback.formReset = callback;
    this.getElement().querySelector(`form`).addEventListener(`reset`, this._formResetHandler);
  }

  setRollupButtonClickHandler(callback) {
    this._callback.rollupButtonClick = callback;
    this.getElement().querySelector(`.event__rollup-btn`).addEventListener(`click`, this._formRollupButtonClickHandler);
  }

  setFavoriteClickHandler(callback) {
    this._callback.favoriteClick = callback;
  }

  updateData(update, noRender = false) {
    super.updateData(update, noRender);
    if (noRender) {
      this._updateSaveEnabled();
    }
  }

  _updateSaveEnabled() {
    const {destination, beginDateTime, endDateTime, cost, destinationsList, isDisabled} = this._data;

    this._saveButtonElement.disabled =
      isDisabled ||
      !moment(beginDateTime).isValid() ||
      !moment(endDateTime).isValid() ||
      moment(beginDateTime).isAfter(endDateTime) ||
      !String(cost).match(/^ *\d+ *$/) ||
      destinationsList.indexOf(destination) === -1;
  }

  convertEventToData(evt, state) {
    const {isNewEvent = false, isSaving = false, isDeleting = false} = state;

    return Object.assign(
        {},
        evt,
        {
          destinationInfo: isNewEvent ? this.getDestinationInfo(evt.destination) : evt.destinationInfo,
          destinationsList: this.getDestinationsList(),
          offers: this.getSpecialOffers(evt.type).map((offer) => Object.assign({}, offer, {
            isSelected: evt.offers.some(({name}) => name === offer.name)
          })),
          isNewEvent,
          isDisabled: isSaving || isDeleting,
          isSaving,
          isDeleting
        }
    );
  }

  convertDataToEvent(eventData) {
    const result = Object.assign({}, eventData);

    result.cost = isFinite(+result.cost) ? +result.cost : 0;

    result.offers = result.offers
      .filter(({isSelected}) => isSelected)
      .map((offer) => {
        delete offer.isSelected;
        return offer;
      });

    delete result.destinationsList;
    delete result.isNewEvent;
    delete result.isDisabled;
    delete result.isSaving;
    delete result.isDeleting;

    return result;
  }
}
