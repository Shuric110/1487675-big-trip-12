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
    this._dataChangeHandler = null;

    this._onChangeData = this._onChangeData.bind(this);
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

  setDataChangeHandler(dataChangeHandler) {
    this._dataChangeHandler = dataChangeHandler;
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
      eventPresenter.init(tripEvent);
      eventPresenter.setDataChangeHandler(this._onChangeData);
      return [tripEvent.id, eventPresenter];
    }));
  }

  _onChangeData(newEvent) {
    if (this._dataChangeHandler) {
      this._dataChangeHandler(newEvent);
    }
  }

  destroy() {
    this._clearEvents();
    remove(this._tripDayComponent);
  }

}
