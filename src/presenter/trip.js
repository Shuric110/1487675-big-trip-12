import SortView from "../view/sort.js";
import TripEventsView from "../view/trip-events.js";
import NoEventsView from "../view/no-events.js";
import LoadingView from "../view/loading.js";
import TripDayListView from "../view/trip-day-list.js";

import TripDayPresenter from "./trip-day.js";
import EventNewPresenter from "./event-new.js";

import {truncDate} from "../util/date.js";
import {RenderPosition, render, remove} from "../util/render.js";
import {UpdateAction} from "../const.js";
import {FilterType} from "../model/board.js";

export default class Trip {
  constructor(container, eventsModel, destinationModel, boardModel, api) {
    this._tripContainer = container;
    this._eventsModel = eventsModel;
    this._destinationModel = destinationModel;
    this._boardModel = boardModel;
    this._api = api;

    this._onSortChange = this._onSortChange.bind(this);
    this._onTripEventModeChange = this._onTripEventModeChange.bind(this);
    this._onViewAction = this._onViewAction.bind(this);
    this._onModelEvent = this._onModelEvent.bind(this);

    this.getDestinationInfo = this.getDestinationInfo.bind(this);
    this.getDestinationsList = this.getDestinationsList.bind(this);
    this.getSpecialOffers = this.getSpecialOffers.bind(this);

    this._sortComponent = null;
    this._tripEventsComponent = new TripEventsView();
    this._noEventsComponent = new NoEventsView();
    this._tripDayListComponent = new TripDayListView();
    this._loadingComponent = new LoadingView();

    this._tripDayPresenters = {};
    this._eventPresenters = {};
    this._events = null;
    this._isLoading = true;

    this._eventNewPresenter = new EventNewPresenter(this._tripDayListComponent);
    this._eventNewPresenter.setDataChangeHandler(this._onViewAction);
    this._eventNewPresenter.setDestinationInfoCallback(this.getDestinationInfo);
    this._eventNewPresenter.setDestinationsListCallback(this.getDestinationsList);
    this._eventNewPresenter.setSpecialOffersCallback(this.getSpecialOffers);
  }

  init() {
    this._events = null;
    this._eventsModel.addObserver(this._onModelEvent);
    this._boardModel.addObserver(this._onModelEvent);

    this._currentSort = this._boardModel.getSort();
    this._currentFilter = this._boardModel.getFilter();

    render(this._tripContainer, this._tripEventsComponent, RenderPosition.BEFOREEND);
    this._renderTrip();
  }

  destroy() {
    this._clearTrip();
    remove(this._tripEventsComponent);
    this._eventsModel.removeObserver(this._onModelEvent);
    this._boardModel.removeObserver(this._onModelEvent);
  }

  createTripEvent(formCloseHandler) {
    this._cancelEventEditors();
    this._boardModel.setFilter(FilterType.EVERYTHING);
    this._eventNewPresenter.init(formCloseHandler);
  }

  cancelCreateTripEvent() {
    this._eventNewPresenter.destroy();
  }

  _cancelEventEditors() {
    this.cancelCreateTripEvent();
    Object.values(this._eventPresenters).forEach(function (eventPresenter) {
      eventPresenter.resetView();
    });
  }

  _getEvents() {
    if (this._events === null) {
      this._events = this._eventsModel.getEvents()
        .slice()
        .filter(this._currentFilter.filter)
        .sort(this._currentSort.compare);
    }
    return this._events;
  }

  _onViewAction(updateAction, update) {
    switch (updateAction) {
      case UpdateAction.EVENT_ADD:
        this._eventNewPresenter.setSaving();
        this._api.addEvent(update)
          .then((response) => {
            this._eventsModel.addEvent(response);
          })
          .catch(() => {
            this._eventNewPresenter.setAborting();
          });
        break;
      case UpdateAction.EVENT_UPDATE:
        this._eventPresenters[update.id].setSaving();
        this._api.updateEvent(update).then((response) => {
          this._eventsModel.updateEvent(response);
        })
        .catch(() => {
          this._eventPresenters[update.id].setAborting();
        });
        break;
      case UpdateAction.EVENT_DELETE:
        this._eventPresenters[update.id].setDeleting();
        this._api.deleteEvent(update).then(() => {
          this._eventsModel.deleteEvent(update);
        })
        .catch(() => {
          this._eventPresenters[update.id].setAborting();
        });
        break;
    }
  }

  _onModelEvent(updateAction, update) {
    switch (updateAction) {
      case UpdateAction.EVENTS_INIT:
        this._isLoading = false;
        this._refreshTrip();
        break;

      case UpdateAction.EVENT_ADD:
      case UpdateAction.EVENT_DELETE:
        this._refreshTrip();
        break;

      case UpdateAction.EVENT_FLAGS_UPDATE:
        this._eventPresenters[update.id].init(update, true);
        break;

      case UpdateAction.EVENT_UPDATE:
        const oldEvent = this._events.find((evt) => evt.id === update.id);
        const sortDiff = this._currentSort.compare(oldEvent, update);
        const isFiltered = this._currentFilter.filter(oldEvent) !== this._currentFilter.filter(update);

        if (sortDiff > 0 | sortDiff < 0 || isFiltered) {
          // Изменилось расположение согласно сортировке или фильтру - перерисовываем весь список
          this._refreshTrip();
        } else {
          // Событие на прежнем месте, просто обновим его
          const eventIndex = this._events.findIndex((evt) => evt.id === update.id);
          this._events[eventIndex] = update;
          this._eventPresenters[update.id].init(update);
        }

        break;

      case UpdateAction.FILTER_SORT_UPDATE:
        if (update.filter) {
          this._currentFilter = update.filter;
        }
        if (update.sort) {
          this._currentSort = update.sort;
        }
        this._refreshTrip();
        break;
    }
  }

  getDestinationInfo(destination) {
    return this._destinationModel.getDestinationInfo(destination);
  }

  getDestinationsList() {
    return this._destinationModel.getDestinationsList();
  }

  getSpecialOffers(eventType) {
    return this._destinationModel.getSpecialOffers(eventType);
  }

  _renderTripDay(date, number, tripEvents) {
    const tripDayPresenter = new TripDayPresenter(this._tripDayListComponent, date, number);
    this._tripDayPresenters[`day-` + date] = tripDayPresenter;
    tripDayPresenter.setTripEventDataChangeHandler(this._onViewAction);
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

  _renderLoading() {
    render(this._tripEventsComponent, this._loadingComponent, RenderPosition.BEFOREEND);
  }

  _renderSort() {
    this._sortComponent = new SortView(this._boardModel.getSortDefinitions(), this._currentSort);
    this._sortComponent.setSortChangeHandler(this._onSortChange);

    render(this._tripEventsComponent, this._sortComponent, RenderPosition.BEFOREEND);
  }

  _renderEvents() {
    const events = this._getEvents();
    if (!this._currentSort.dayGrouping) {
      this._renderTripDay(null, null, events.slice());
    } else {
      const eventsByDate = {};

      for (let evt of events) {
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

  _onSortChange(sortType) {
    if (sortType === this._currentSort.code) {
      return;
    }

    this._boardModel.setSort(sortType);
  }

  _onTripEventModeChange(tripEventEditorPresenter, isEditing) {
    if (isEditing) {
      this._cancelEventEditors();
    }
  }

  _refreshTrip() {
    this._clearTrip();
    this._events = null;
    this._renderTrip();
  }

  _clearTrip() {
    this._eventNewPresenter.destroy();

    Object.values(this._tripDayPresenters).forEach(function (tripDayPresenter) {
      tripDayPresenter.destroy();
    });

    this._tripDayPresenters = {};
    this._eventPresenters = {};

    remove(this._tripDayListComponent);
    remove(this._sortComponent);
    remove(this._noEventsComponent);
    remove(this._loadingComponent);
  }

  _renderTrip() {
    if (this._isLoading) {
      this._renderLoading();
      return;
    }

    if (this._getEvents().length === 0) {
      this._renderNoEvents();
      return;
    }
    this._renderSort();

    render(this._tripEventsComponent, this._tripDayListComponent, RenderPosition.BEFOREEND);
    this._renderEvents();
  }

}
