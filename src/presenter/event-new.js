import TripDayView from "../view/trip-day.js";
import EventEditorView from "../view/event-editor.js";

import {UpdateAction} from "../const.js";
import {RenderPosition, render, remove} from "../util/render.js";


export const eventIdSequence = {
  _currentValue: 0,

  getNextValue() {
    this._currentValue++;
    return `event-` + this._currentValue;
  }
};


export default class EventNew {
  constructor(tripDayContainer) {
    this._tripDayContainer = tripDayContainer;
    this._tripDayComponent = null;
    this._eventEditorComponent = null;

    this._dataChangeHandler = null;
    this._formCloseHandler = null;
    this._destinationInfoCallback = null;
    this._destinationsListCallback = null;
    this._specialOffersCallback = null;

    this._onEscKeyDown = this._onEscKeyDown.bind(this);
    this._onFormSubmit = this._onFormSubmit.bind(this);
    this._onFormReset = this._onFormReset.bind(this);
    this._onEditorRollupButtonClick = this._onEditorRollupButtonClick.bind(this);

    this.getDestinationInfo = this.getDestinationInfo.bind(this);
    this.getDestinationsList = this.getDestinationsList.bind(this);
    this.getSpecialOffers = this.getSpecialOffers.bind(this);
  }

  init(formCloseHandler) {
    if (this._tripDayComponent) {
      this.destroy();
    }

    this._formCloseHandler = formCloseHandler;

    this._tripDayComponent = new TripDayView();
    this._eventEditorComponent = new EventEditorView(this._tripEvent, this.getDestinationInfo, this.getDestinationsList, this.getSpecialOffers);

    this._eventEditorComponent.setFormSubmitHandler(this._onFormSubmit);
    this._eventEditorComponent.setFormResetHandler(this._onFormReset);
    this._eventEditorComponent.setRollupButtonClickHandler(this._onEditorRollupButtonClick);
    document.addEventListener(`keydown`, this._onEscKeyDown);

    render(this._tripDayContainer, this._tripDayComponent, RenderPosition.AFTERBEGIN);
    render(this._tripDayComponent, this._eventEditorComponent, RenderPosition.BEFOREEND);
  }

  destroy() {
    remove(this._eventEditorComponent);
    remove(this._tripDayComponent);

    this._eventEditorComponent = null;
    this._tripDayComponent = null;

    document.removeEventListener(`keydown`, this._onEscKeyDown);

    if (this._formCloseHandler) {
      this._formCloseHandler();
    }
  }

  setDataChangeHandler(dataChangeHandler) {
    this._dataChangeHandler = dataChangeHandler;
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

  getDestinationInfo(destination) {
    return this._destinationInfoCallback ? this._destinationInfoCallback(destination) : null;
  }

  getDestinationsList() {
    return this._destinationsListCallback ? this._destinationsListCallback() : [];
  }

  getSpecialOffers(eventType) {
    return this._specialOffersCallback ? this._specialOffersCallback(eventType) : [];
  }

  _onEscKeyDown(evt) {
    if (evt.key === `Escape` || evt.key === `Esc`) {
      evt.preventDefault();
      this.destroy();
    }
  }

  _onFormReset() {
    this.destroy();
  }

  _onEditorRollupButtonClick() {
    // Формально в ТЗ про эту кнопку ничего не сказано, но по логике она должна закрывать редактор
    this.destroy();
  }

  _onFormSubmit(tripEvent) {
    this.destroy();

    if (this._dataChangeHandler) {
      this._dataChangeHandler(
          UpdateAction.EVENT_ADD,
          Object.assign({id: eventIdSequence.getNextValue()}, tripEvent)
      );
    }
  }
}
