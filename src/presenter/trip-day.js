import {RenderPosition, render, remove} from "../util/render.js";

import TripDayView from "../view/trip-day.js";

import EventPresenter from "./event.js";

export default class TripDay {
  constructor(tripDayContainer, date, number) {
    this._tripDayContainer = tripDayContainer;

    this._tripDayComponent = new TripDayView(date, number);

    this._initialized = false;
    this._eventPresenters = {};
    this._tripEvents = null;
    this._tripEventDataChangeHandler = null;
    this._tripEventModeChangeHandler = null;
    this._destinationInfoCallback = null;
    this._destinationsListCallback = null;
    this._specialOffersCallback = null;

    this._onTripEventDataChange = this._onTripEventDataChange.bind(this);
    this._onTripEventModeChange = this._onTripEventModeChange.bind(this);

    this.getDestinationInfo = this.getDestinationInfo.bind(this);
    this.getDestinationsList = this.getDestinationsList.bind(this);
    this.getSpecialOffers = this.getSpecialOffers.bind(this);
  }

  init(tripEvents) {
    this._tripEvents = tripEvents;

    if (!this._initialized) {
      render(this._tripDayContainer, this._tripDayComponent, RenderPosition.BEFOREEND);
      this._initialized = true;
    } else {
      this._clearEvents();
    }
    this._renderEvents();
  }

  getEventPresenters() {
    return this._eventPresenters;
  }

  setDestinationInfoCallback(destinationInfoCallback) {
    this._destinationInfoCallback = destinationInfoCallback;
  }

  setDestinationsListCallback(destinationsListCallback) {
    this._destinationsListCallback = destinationsListCallback;
  }

  setSpecialOffersCallback(specialOffersCallback) {
    this._specialOffersCallback = specialOffersCallback;
  }

  setTripEventDataChangeHandler(tripEventDataChangeHandler) {
    this._tripEventDataChangeHandler = tripEventDataChangeHandler;
  }

  setTripEventModeChangeHandler(tripEventModeChangeHandler) {
    this._tripEventModeChangeHandler = tripEventModeChangeHandler;
  }

  getDestinationInfo(destination) {
    return this._destinationInfoCallback ? this._destinationInfoCallback(destination) : null;
  }

  getDestinationsList() {
    return this._destinationsListCallback ? this._destinationsListCallback() : [];
  }

  getSpecialOffers(eventType) {
    return this._specialOffersCallback ? this._specialOffersCallback(eventType) : [];
  }

  _clearEvents() {
    Object.values(this._eventPresenters).forEach(function (eventPresenter) {
      eventPresenter.destroy();
    });
    this._eventPresenters = {};
  }

  _renderEvents() {
    this._eventPresenters = Object.fromEntries(this._tripEvents.map((tripEvent) => {
      const eventPresenter = new EventPresenter(this._tripDayComponent);
      eventPresenter.setDestinationInfoCallback(this.getDestinationInfo);
      eventPresenter.setDestinationsListCallback(this.getDestinationsList);
      eventPresenter.setSpecialOffersCallback(this.getSpecialOffers);
      eventPresenter.setDataChangeHandler(this._onTripEventDataChange);
      eventPresenter.setModeChangeHandler(this._onTripEventModeChange);
      eventPresenter.init(tripEvent);
      return [tripEvent.id, eventPresenter];
    }));
  }

  _onTripEventDataChange(updateAction, update) {
    if (this._tripEventDataChangeHandler) {
      this._tripEventDataChangeHandler(updateAction, update);
    }
  }

  _onTripEventModeChange(tripEventEditorPresenter, isEditing) {
    if (this._tripEventModeChangeHandler) {
      this._tripEventModeChangeHandler(tripEventEditorPresenter, isEditing);
    }
  }

  destroy() {
    this._clearEvents();
    remove(this._tripDayComponent);
  }

}
