import BoardModel from "./model/board.js";
import EventsModel from "./model/events.js";
import DestinationModel from "./model/destination.js";

import MenuView from "./view/menu.js";
import StatisticsView from "./view/statistics.js";

import FilterPresenter from "./presenter/filter.js";
import TripInfoPresenter from "./presenter/trip-info.js";
import TripPresenter from "./presenter/trip.js";

import {RenderPosition, render, remove} from "./util/render.js";

import Api from "./api/api.js";
import ApiAdapter from "./api/api-adapter.js";
import Store from "./api/store.js";
import Provider from "./api/provider.js";

import {MenuItem} from "./const.js";

const API_URL = `https://12.ecmascript.pages.academy/big-trip`;
const API_AUTH_TOKEN = `su2o3os9f0dfdf03l`;

const STORE_PREFIX = `bigtrip-localstorage`;
const STORE_VER = `v12`;
const STORE_NAME = `${STORE_PREFIX}-${STORE_VER}`;

const api = new Api(API_URL, API_AUTH_TOKEN);
const store = new Store(STORE_NAME, window.localStorage);
const apiWithProvider = new Provider(api, store);
const apiAdapter = new ApiAdapter(apiWithProvider);

const boardModel = new BoardModel();
const eventsModel = new EventsModel();
const destinationModel = new DestinationModel();


const tripMainElement = document.querySelector(`.trip-main`);
const tripControlsElement = tripMainElement.querySelector(`.trip-controls`);
const tripMainContainerElement = document.querySelector(`main .page-body__container`);

const filterPresenter = new FilterPresenter(tripControlsElement, boardModel, eventsModel);
const tripInfoPresenter = new TripInfoPresenter(tripMainElement, eventsModel);
const tripPresenter = new TripPresenter(tripMainContainerElement, eventsModel, destinationModel, boardModel, apiAdapter);

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

render(tripControlsElement, menuComponent, RenderPosition.BEFOREEND);

tripInfoPresenter.init();
filterPresenter.init();
tripPresenter.init();

Promise.all([apiAdapter.getEvents(), apiAdapter.getOffers(), apiAdapter.getDestinations()])
  .then(([events, offers, destinations]) => {
    destinationModel.setDestinationsList(Object.keys(destinations));
    destinationModel.setDestinationsInfo(destinations);
    destinationModel.setSpecialOffersList(offers);
    eventsModel.setEvents(events);
  })
  .catch(() => {
    eventsModel.setEvents([]);
  })
  .finally(() => {
    menuComponent.setMenuClickHandler(onMenuClick);
    addNewButtonElement.addEventListener(`click`, onNewEventClick);
  });

window.addEventListener(`load`, () => {
  navigator.serviceWorker.register(`/sw.js`)
    .then(() => {
      console.log(`ServiceWorker available`); // eslint-disable-line
    }).catch(() => {
      console.error(`ServiceWorker isn't available`); // eslint-disable-line
    });
});

window.addEventListener(`online`, () => {
  document.title = document.title.replace(` [offline]`, ``);
  apiWithProvider.sync();
});

window.addEventListener(`offline`, () => {
  document.title += ` [offline]`;
});

if (!window.navigator.onLine) {
  document.title += ` [offline]`;
}
