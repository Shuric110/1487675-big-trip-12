import EventView from "../view/event.js";
import EventEditorView from "../view/event-editor.js";

import {UpdateAction} from "../const.js";
import {RenderPosition, replace, replaceOrRender, remove} from "../util/render.js";


export default class Event {
  constructor(eventContainer) {
    this._eventContainer = eventContainer;

    this._eventComponent = null;
    this._eventEditorComponent = null;
    this._isEditing = false;

    this._dataChangeHandler = null;
    this._modeChangeHandler = null;
    this._destinationInfoCallback = null;
    this._destinationsListCallback = null;
    this._specialOffersCallback = null;

    this._onEscKeyDown = this._onEscKeyDown.bind(this);
    this._onFormSubmit = this._onFormSubmit.bind(this);
    this._onRollupButtonClick = this._onRollupButtonClick.bind(this);
    this._onEditorRollupButtonClick = this._onEditorRollupButtonClick.bind(this);
    this._onEditorFavoriteClick = this._onEditorFavoriteClick.bind(this);

    this.getDestinationInfo = this.getDestinationInfo.bind(this);
    this.getDestinationsList = this.getDestinationsList.bind(this);
    this.getSpecialOffers = this.getSpecialOffers.bind(this);
  }

  setDataChangeHandler(dataChangeHandler) {
    this._dataChangeHandler = dataChangeHandler;
  }

  setModeChangeHandler(modeChangeHandler) {
    this._modeChangeHandler = modeChangeHandler;
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

  init(tripEvent, keepOldEditor = true) {
    this._tripEvent = Object.assign({}, tripEvent);

    const oldEventEditorComponent = this._eventEditorComponent;
    const oldEventComponent = this._eventComponent;

    this._eventComponent = new EventView(tripEvent);
    this._eventComponent.setRollupButtonClickHandler(this._onRollupButtonClick);

    if (oldEventEditorComponent) {
      if (!keepOldEditor) {
        this._eventEditorComponent = null;
        this._makeEditor(oldEventEditorComponent);
        remove(oldEventEditorComponent);
      }
    } else {
      replaceOrRender(this._eventContainer, this._eventComponent, oldEventComponent, RenderPosition.BEFOREEND);
    }

    remove(oldEventComponent);
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
      this._switchToView();
    }
  }

  _onFormSubmit(tripEvent) {
    if (this._dataChangeHandler) {
      this._dataChangeHandler(
          UpdateAction.EVENT_UPDATE,
          tripEvent
      );
    }

    this._switchToView();
  }

  _onRollupButtonClick() {
    this._makeEditor(this._eventComponent);
  }

  _onEditorRollupButtonClick() {
    // Формально в ТЗ про эту кнопку ничего не сказано, но по логике она должна закрывать редактор
    this._switchToView();
  }

  _onEditorFavoriteClick(update) {
    if (this._dataChangeHandler) {
      this._dataChangeHandler(UpdateAction.EVENT_UPDATE, Object.assign({}, this._tripEvent, update));
    }
  }

  _switchToView() {
    if (this._modeChangeHandler) {
      this._modeChangeHandler(this, false);
    }
    this._isEditing = false;

    replace(this._eventComponent, this._eventEditorComponent);
    this._eventEditorComponent = null;
    document.removeEventListener(`keydown`, this._onEscKeyDown);
  }

  _makeEditor(insteadComponent) {
    if (this._modeChangeHandler && !this._isEditing) {
      this._modeChangeHandler(this, true);
    }
    this._isEditing = true;

    this._eventEditorComponent = new EventEditorView(this._tripEvent, this.getDestinationInfo, this.getDestinationsList, this.getSpecialOffers);

    this._eventEditorComponent.setFormSubmitHandler(this._onFormSubmit);
    this._eventEditorComponent.setRollupButtonClickHandler(this._onEditorRollupButtonClick);
    this._eventEditorComponent.setFavoriteClickHandler(this._onEditorFavoriteClick);
    document.addEventListener(`keydown`, this._onEscKeyDown);

    replace(this._eventEditorComponent, insteadComponent);
  }

  resetView() {
    if (this._isEditing) {
      this._switchToView();
    }
  }

  destroy() {
    remove(this._eventComponent);
    remove(this._eventEditorComponent);
  }
}
