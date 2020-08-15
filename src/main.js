import EventEditorView from "./view/event-editor.js";
import EventView from "./view/event.js";
import FilterView from "./view/filter.js";
import MenuView from "./view/menu.js";
import SortView from "./view/sort.js";
import TripEventsView from "./view/trip-events.js";
import NoEventsView from "./view/no-events.js";
import TripDayListView from "./view/trip-day-list.js";
import TripDayView from "./view/trip-day.js";
import TripInfoView from "./view/trip-info.js";

import {formatDateAsDateMD, truncDate} from "./util.js";
import {RenderPosition, render, replace} from "./util/render.js";

import {generateEvents} from "./mock/event.js";
import {createJourneySummary} from "./mock/summary.js";

const EVENT_COUNT = 25;

const events = generateEvents(EVENT_COUNT);
const journeySummary = createJourneySummary(events);

const tripMainElement = document.querySelector(`.trip-main`);
const tripControlsElement = tripMainElement.querySelector(`.trip-controls`);
const tripMainContainerElement = document.querySelector(`main .page-body__container`);

const renderEvent = function (eventListComponent, evt) {
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

      eventEditorComponent.getElement().querySelector(`form`).addEventListener(`submit`, function (submitEvt) {
        submitEvt.preventDefault();
        switchToView();
      });

      eventEditorComponent.getElement().querySelector(`.event__rollup-btn`).addEventListener(`click`, function () {
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

  eventComponent.getElement().querySelector(`.event__rollup-btn`).addEventListener(`click`, function () {
    switchToEdit();
  });

  render(eventListComponent, eventComponent, RenderPosition.BEFOREEND);
};

const renderTripEvents = function (tripEventsContainer, tripEventsList) {
  const tripEventsComponent = new TripEventsView();
  render(tripEventsContainer, tripEventsComponent, RenderPosition.BEFOREEND);

  if (tripEventsList.length === 0) {
    render(tripEventsComponent, new NoEventsView(), RenderPosition.BEFOREEND);
    return;
  }
  render(tripEventsComponent, new SortView(), RenderPosition.BEFOREEND);

  const tripDayListComponent = new TripDayListView();
  render(tripEventsComponent, tripDayListComponent, RenderPosition.BEFOREEND);

  let currentDate = ``;
  let currentDateNumber = 0;
  let tripDayComponent;

  for (let evt of tripEventsList) {
    const eventDate = formatDateAsDateMD(evt.beginDateTime);
    if (eventDate !== currentDate) {
      currentDate = eventDate;
      currentDateNumber++;
      tripDayComponent = new TripDayView(truncDate(evt.beginDateTime), currentDateNumber);
      render(tripDayListComponent, tripDayComponent, RenderPosition.BEFOREEND);
    }

    renderEvent(tripDayComponent, evt);
  }
};

render(tripMainElement, new TripInfoView(journeySummary), RenderPosition.AFTERBEGIN);
render(tripControlsElement, new MenuView(), RenderPosition.BEFOREEND);
render(tripControlsElement, new FilterView(), RenderPosition.BEFOREEND);

renderTripEvents(tripMainContainerElement, events);
