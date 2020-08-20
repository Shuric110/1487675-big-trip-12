import EventView from "../view/event.js";
import EventEditorView from "../view/event-editor.js";

import {RenderPosition, replace, replaceOrRender, remove} from "../util/render.js";


export default class Event {
  constructor(eventContainer) {
    this._eventContainer = eventContainer;

    this._eventComponent = null;
    this._eventEditorComponent = null;

    this._dataChangeHandler = null;

    this._onEscKeyDown = this._onEscKeyDown.bind(this);
    this._onFormSubmit = this._onFormSubmit.bind(this);
    this._onRollupButtonClick = this._onRollupButtonClick.bind(this);
    this._onEditorRollupButtonClick = this._onEditorRollupButtonClick.bind(this);
    this._onEditorFavoriteClick = this._onEditorFavoriteClick.bind(this);
  }

  setDataChangeHandler(dataChangeHandler) {
    this._dataChangeHandler = dataChangeHandler;
  }

  init(tripEvent) {
    this._tripEvent = tripEvent;

    const oldEventComponent = this._eventComponent;
    const oldEventEditorComponent = this._eventEditorComponent;

    this._eventComponent = new EventView(tripEvent);
    this._eventEditorComponent = null;

    this._eventComponent.setRollupButtonClickHandler(this._onRollupButtonClick);

    if (oldEventEditorComponent) {
      this._makeEditor(oldEventEditorComponent);
    } else {
      replaceOrRender(this._eventContainer, this._eventComponent, oldEventComponent, RenderPosition.BEFOREEND);
    }

    remove(oldEventComponent);
    remove(oldEventEditorComponent);
  }

  _onEscKeyDown(evt) {
    if (evt.key === `Escape` || evt.key === `Esc`) {
      evt.preventDefault();
      this._switchToView();
    }
  }

  _onFormSubmit() {
    this._switchToView();
  }

  _onRollupButtonClick() {
    this._makeEditor(this._eventComponent);
  }

  _onEditorRollupButtonClick() {
    // Формально в ТЗ про эту кнопку ничего не сказано, но по логике она должна закрывать редактор
    this._switchToView();
  }

  _onEditorFavoriteClick() {
    if (this._dataChangeHandler) {
      this._dataChangeHandler(Object.assign({}, this._tripEvent, {isFavorite: !this._tripEvent.isFavorite}));
    }
  }

  _switchToView() {
    replace(this._eventComponent, this._eventEditorComponent);
    this._eventEditorComponent = null;
    document.removeEventListener(`keydown`, this._onEscKeyDown);
  }

  _makeEditor(insteadComponent) {
    this._eventEditorComponent = new EventEditorView(this._tripEvent);
    this._eventEditorComponent.setFormSubmitHandler(this._onFormSubmit);
    this._eventEditorComponent.setRollupButtonClickHandler(this._onEditorRollupButtonClick);
    this._eventEditorComponent.setFavoriteClickHandler(this._onEditorFavoriteClick);
    document.addEventListener(`keydown`, this._onEscKeyDown);

    replace(this._eventEditorComponent, insteadComponent);
  }

  destroy() {
    remove(this._eventComponent);
    remove(this._eventEditorComponent);
  }
}
