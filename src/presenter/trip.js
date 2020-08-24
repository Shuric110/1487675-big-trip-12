import SortView from "../view/sort.js";
import TripEventsView from "../view/trip-events.js";
import NoEventsView from "../view/no-events.js";
import TripDayListView from "../view/trip-day-list.js";

import TripDayPresenter from "./trip-day.js";

import {truncDate} from "../util/date.js";
import {RenderPosition, render, replace} from "../util/render.js";
import {updateItem} from "../util/common.js";
import {SortMode, SORT_TYPES} from "../const.js";


export default class Trip {
  constructor(container) {
    this._tripContainer = container;

    this._tripDayPresenters = {};
    this._eventPresenters = {};
    this._sortMode = `event`;
    this._destinationsInfo = {};
    this._destinationsList = [];
    this._specialOffersList = {};

    this._tripEventsComponent = new TripEventsView();
    this._noEventsComponent = new NoEventsView();
    this._sortComponent = new SortView();
    this._tripDayListComponent = new TripDayListView();

    this._onSortChange = this._onSortChange.bind(this);
    this._onTripEventDataChange = this._onTripEventDataChange.bind(this);
    this._onTripEventModeChange = this._onTripEventModeChange.bind(this);

    this.getDestinationInfo = this.getDestinationInfo.bind(this);
    this.getDestinationsList = this.getDestinationsList.bind(this);
    this.getSpecialOffers = this.getSpecialOffers.bind(this);
  }

  init(events) {
    this._events = events.slice();
    this._sourceEvents = events.slice();

    this._renderTrip();
  }

  setDestinationsInfo(destinationsInfo) {
    this._destinationsInfo = destinationsInfo;
  }

  setDestinationsList(destinationsList) {
    this._destinationsList = destinationsList;
  }

  setSpecialOffersList(specialOffersList) {
    this._specialOffersList = specialOffersList;
  }

  getDestinationInfo(destination) {
    return this._destinationsInfo[destination];
  }

  getDestinationsList() {
    return this._destinationsList;
  }

  getSpecialOffers(eventType) {
    return this._specialOffersList[eventType] || [];
  }

  _renderTripDay(date, number, tripEvents) {
    const tripDayPresenter = new TripDayPresenter(this._tripDayListComponent, date, number);
    this._tripDayPresenters[`day-` + date] = tripDayPresenter;
    tripDayPresenter.setTripEventDataChangeHandler(this._onTripEventDataChange);
    tripDayPresenter.setTripEventModeChangeHandler(this._onTripEventModeChange);
    tripDayPresenter.setDestinationInfoCallback(this.getDestinationInfo);
    tripDayPresenter.setDestinationsListCallback(this.getDestinationsList);
    tripDayPresenter.setSpecialOffersCallback(this.getSpecialOffers);
    tripDayPresenter.init(tripEvents);
    Object.assign(this._eventPresenters, tripDayPresenter.getEventPresenters());
  }

  _renderNoEvents() {
    render(this._tripEventsComponent, this._noEventsComponent, RenderPosition.BEFOREEND);
  }

  _renderSort() {
    const oldSortElement = this._sortComponent.getHasElement() ? this._sortComponent.getElement() : null;

    this._sortComponent.setSortMode(this._sortMode);
    this._sortComponent.setShowDayTitle(this._sortMode === SortMode.EVENT);

    if (oldSortElement) {
      replace(this._sortComponent, oldSortElement);
    } else {
      render(this._tripEventsComponent, this._sortComponent, RenderPosition.BEFOREEND);
    }

    this._sortComponent.setSortChangeHandler(this._onSortChange);
  }

  _renderEvents() {
    if (this._sortMode !== SortMode.EVENT) {
      this._renderTripDay(null, null, this._events.slice());
    } else {
      const eventsByDate = {};

      for (let evt of this._events) {
        const eventDate = truncDate(evt.beginDateTime).getTime();
        if (!eventsByDate[eventDate]) {
          eventsByDate[eventDate] = [evt];
        } else {
          eventsByDate[eventDate].push(evt);
        }
      }

      Object.entries(eventsByDate).forEach(([date, dayEvents], index) => {
        this._renderTripDay(new Date(+date), index + 1, dayEvents);
      });
    }
  }

  _clearEvents() {
    Object.values(this._tripDayPresenters).forEach(function (tripDayPresenter) {
      tripDayPresenter.destroy();
    });
    this._tripDayPresenters = {};
    this._eventPresenters = {};
  }

  _sortEvents(sortMode) {
    const {compare} = SORT_TYPES[sortMode];

    if (!compare) {
      this._events = this._sourceEvents.slice();
    } else {
      this._events.sort(compare);
    }

    this._sortMode = sortMode;
  }

  _onSortChange(sortMode) {
    if (sortMode === this._sortMode) {
      return;
    }

    this._sortEvents(sortMode);

    this._clearEvents();
    this._renderEvents();

    this._renderSort();
  }

  _onTripEventDataChange(newEvent, isEditing) {
    updateItem(this._events, newEvent);
    updateItem(this._sourceEvents, newEvent);
    if (!isEditing) {
      this._eventPresenters[newEvent.id].init(newEvent);
    }
  }

  _onTripEventModeChange(tripEventEditorPresenter, isEditing) {
    if (isEditing) {
      Object.values(this._eventPresenters).forEach(function (eventPresenter) {
        eventPresenter.resetView();
      });
    }
  }

  _renderTrip() {
    render(this._tripContainer, this._tripEventsComponent, RenderPosition.BEFOREEND);

    if (this._events.length === 0) {
      this._renderNoEvents();
      return;
    }
    this._renderSort();

    render(this._tripEventsComponent, this._tripDayListComponent, RenderPosition.BEFOREEND);
    this._renderEvents();
  }

}
