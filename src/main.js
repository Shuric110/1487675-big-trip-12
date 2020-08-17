import EventEditorView from "./view/event-editor.js";
import EventView from "./view/event.js";
import FilterView from "./view/filter.js";
import MenuView from "./view/menu.js";
import SortView from "./view/sort.js";
import TripDayListView from "./view/trip-day-list.js";
import TripDayView from "./view/trip-day.js";
import TripInfoView from "./view/trip-info.js";

import {RenderPosition, render, formatDateAsDateMD} from "./util.js";

import {generateEvents} from "./mock/event.js";
import {createJourneySummary} from "./mock/summary.js";

const EVENT_COUNT = 25;

const events = generateEvents(EVENT_COUNT);
const journeySummary = createJourneySummary(events);

const tripMainElement = document.querySelector(`.trip-main`);
const tripControlsElement = tripMainElement.querySelector(`.trip-controls`);
const tripEventsElement = document.querySelector(`.trip-events`);

const renderEvent = function (evt) {
  const eventComponent = new EventView(evt);
  let eventEditorComponent;


  const switchToEdit = function () {
    if (!eventEditorComponent) {
      eventEditorComponent = new EventEditorView(evt);

      eventEditorComponent.getElement().querySelector(`form`).addEventListener(`submit`, function (submitEvt) {
        submitEvt.preventDefault();
        switchToView();
      });

      eventComponent.getElement().parentNode.replaceChild(eventEditorComponent.getElement(), eventComponent.getElement());
    }
  };

  const switchToView = function () {
    eventEditorComponent.getElement().parentNode.replaceChild(eventComponent.getElement(), eventEditorComponent.getElement());
    eventEditorComponent = null;
  };

  eventComponent.getElement().querySelector(`.event__rollup-btn`).addEventListener(`click`, function () {
    switchToEdit();
  });

  render(eventListElement, eventComponent.getElement(), RenderPosition.BEFOREEND);
};


render(tripMainElement, new TripInfoView(journeySummary).getElement(), RenderPosition.AFTERBEGIN);
render(tripControlsElement, new MenuView().getElement(), RenderPosition.BEFOREEND);
render(tripControlsElement, new FilterView().getElement(), RenderPosition.BEFOREEND);

render(tripEventsElement, new SortView().getElement(), RenderPosition.BEFOREEND);
render(tripEventsElement, new TripDayListView().getElement(), RenderPosition.BEFOREEND);

const tripDayListElement = tripEventsElement.querySelector(`.trip-days`);

let currentDate = ``;
let currentDateNumber = 0;
let eventListElement;

for (let evt of events) {
  const eventDate = formatDateAsDateMD(evt.beginDateTime);
  if (eventDate !== currentDate) {
    currentDate = eventDate;
    currentDateNumber++;
    render(tripDayListElement, new TripDayView(currentDate, currentDateNumber).getElement(), RenderPosition.BEFOREEND);
    const eventListElements = tripDayListElement.querySelectorAll(`.trip-events__list`);
    eventListElement = eventListElements[eventListElements.length - 1];
  }

  renderEvent(evt);
}
