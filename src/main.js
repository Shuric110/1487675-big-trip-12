import BoardModel from "./model/board.js";
import EventsModel from "./model/events.js";
import DestinationModel from "./model/destination.js";

import MenuView from "./view/menu.js";
import StatisticsView from "./view/statistics.js";

import FilterPresenter from "./presenter/filter.js";
import TripInfoPresenter from "./presenter/trip-info.js";
import TripPresenter from "./presenter/trip.js";

import {RenderPosition, render, remove} from "./util/render.js";

import {EVENT_OFFERS, generateEvents} from "./mock/event.js";
import {DESTINATIONS, generateDestinationsInfo} from "./mock/destination.js";

import {MenuItem} from "./const.js";

const EVENT_COUNT = 25;

const events = generateEvents(EVENT_COUNT);
const destinationsInfo = generateDestinationsInfo();

const boardModel = new BoardModel();
const eventsModel = new EventsModel();
const destinationModel = new DestinationModel();

eventsModel.setEvents(events);
destinationModel.setDestinationsInfo(destinationsInfo);
destinationModel.setDestinationsList(DESTINATIONS);
destinationModel.setSpecialOffersList(EVENT_OFFERS);

const tripMainElement = document.querySelector(`.trip-main`);
const tripControlsElement = tripMainElement.querySelector(`.trip-controls`);
const tripMainContainerElement = document.querySelector(`main .page-body__container`);

const filterPresenter = new FilterPresenter(tripControlsElement, boardModel);
const tripInfoPresenter = new TripInfoPresenter(tripMainElement, eventsModel);
const tripPresenter = new TripPresenter(tripMainContainerElement, eventsModel, destinationModel, boardModel);

const addNewButtonElement = document.querySelector(`.trip-main__event-add-btn`);
const menuComponent = new MenuView();

let staticticsComponent = null;

const switchPage = function (menuItem) {
  if (menuComponent.getActiveItem() === menuItem) {
    return;
  }

  switch (menuItem) {
    case MenuItem.TABLE:
      remove(staticticsComponent);
      tripPresenter.init();
      break;
    case MenuItem.STATISTICS:
      tripPresenter.destroy();
      staticticsComponent = new StatisticsView(eventsModel.getEvents());
      render(tripMainContainerElement, staticticsComponent, RenderPosition.BEFOREEND);
      staticticsComponent.renderCharts();
      break;
  }
  menuComponent.setActiveItem(menuItem);
};

const onMenuClick = function (menuItem) {
  switchPage(menuItem);
};

const onNewEventClick = function (evt) {
  evt.preventDefault();
  switchPage(MenuItem.TABLE);
  tripPresenter.createTripEvent(onNewEventFormClose);
  addNewButtonElement.disabled = true;
};

const onNewEventFormClose = function () {
  addNewButtonElement.disabled = false;
};

menuComponent.setMenuClickHandler(onMenuClick);
addNewButtonElement.addEventListener(`click`, onNewEventClick);

render(tripControlsElement, menuComponent, RenderPosition.BEFOREEND);

tripInfoPresenter.init();
filterPresenter.init();
tripPresenter.init(events);
