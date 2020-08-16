import EventEditorView from "../view/event-editor.js";
import EventView from "../view/event.js";
import SortView from "../view/sort.js";
import TripEventsView from "../view/trip-events.js";
import NoEventsView from "../view/no-events.js";
import TripDayListView from "../view/trip-day-list.js";
import TripDayView from "../view/trip-day.js";

import {formatDateAsDateMD, truncDate} from "../util/date.js";
import {RenderPosition, render, replace} from "../util/render.js";


export default class Trip {
  constructor(container) {
    this._tripContainer = container;

    this._tripEventsComponent = new TripEventsView();
    this._noEventsComponent = new NoEventsView();
    this._sortComponent = new SortView();
    this._tripDayListComponent = new TripDayListView();
  }

  init(events) {
    this._events = events;

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
    render(this._tripEventsComponent, this._sortComponent, RenderPosition.BEFOREEND);
  }

  _renderTripDayList() {
    let currentDate = ``;
    let currentDateNumber = 0;
    let tripDayComponent;

    for (let evt of this._events) {
      const eventDate = formatDateAsDateMD(evt.beginDateTime);
      if (eventDate !== currentDate) {
        currentDate = eventDate;
        currentDateNumber++;
        tripDayComponent = new TripDayView(truncDate(evt.beginDateTime), currentDateNumber);
        render(this._tripDayListComponent, tripDayComponent, RenderPosition.BEFOREEND);
      }

      this._renderEvent(tripDayComponent, evt);
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
    this._renderTripDayList();
  }

}
