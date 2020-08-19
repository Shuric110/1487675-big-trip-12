import EventEditorView from "../view/event-editor.js";
import EventView from "../view/event.js";
import SortView from "../view/sort.js";
import TripEventsView from "../view/trip-events.js";
import NoEventsView from "../view/no-events.js";
import TripDayListView from "../view/trip-day-list.js";
import TripDayView from "../view/trip-day.js";

import {formatDateAsDateMD, truncDate} from "../util/date.js";
import {RenderPosition, render, replace} from "../util/render.js";
import {SortMode, SORT_TYPES} from "../const.js";


export default class Trip {
  constructor(container) {
    this._tripContainer = container;

    this._sortMode = `event`;

    this._tripEventsComponent = new TripEventsView();
    this._noEventsComponent = new NoEventsView();
    this._sortComponent = new SortView();
    this._tripDayListComponent = new TripDayListView();

    this._onSortChange = this._onSortChange.bind(this);
  }

  init(events) {
    this._events = events.slice();
    this._sourceEvents = events.slice();

    this._renderTrip();
  }

  _renderEvent(eventContainerComponent, evt) {
    const eventComponent = new EventView(evt);
    let eventEditorComponent;

    const onEscKeyDown = function (keyboardEvt) {
      if (keyboardEvt.key === `Escape` || keyboardEvt.key === `Esc`) {
        keyboardEvt.preventDefault();
        switchToView();
      }
    };

    const switchToEdit = function () {
      if (!eventEditorComponent) {
        eventEditorComponent = new EventEditorView(evt);

        eventEditorComponent.setFormSubmitHandler(function () {
          switchToView();
        });

        eventEditorComponent.setRollupButtonClickHandler(function () {
          switchToView();
        });

        replace(eventEditorComponent, eventComponent);
        document.addEventListener(`keydown`, onEscKeyDown);
      }
    };

    const switchToView = function () {
      replace(eventComponent, eventEditorComponent);
      eventEditorComponent = null;
      document.removeEventListener(`keydown`, onEscKeyDown);
    };

    eventComponent.setRollupButtonClickHandler(function () {
      switchToEdit();
    });

    render(eventContainerComponent, eventComponent, RenderPosition.BEFOREEND);
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
    let currentDate = ``;
    let currentDateNumber = 0;
    let tripDayComponent;
    const separateDays = this._sortMode === SortMode.EVENT;

    if (!separateDays) {
      tripDayComponent = new TripDayView(null, null);
      render(this._tripDayListComponent, tripDayComponent, RenderPosition.BEFOREEND);
    }

    for (let evt of this._events) {
      if (separateDays) {
        const eventDate = formatDateAsDateMD(evt.beginDateTime);
        if (eventDate !== currentDate) {
          currentDate = eventDate;
          currentDateNumber++;
          tripDayComponent = new TripDayView(truncDate(evt.beginDateTime), currentDateNumber);
          render(this._tripDayListComponent, tripDayComponent, RenderPosition.BEFOREEND);
        }
      }

      this._renderEvent(tripDayComponent, evt);
    }
  }

  _clearEvents() {
    this._tripDayListComponent.getContainerElement().innerHTML = ``;
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
