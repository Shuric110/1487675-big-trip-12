import ComponentView from "./component.js";
import {MenuItem} from "../const.js";

export default class Menu extends ComponentView {
  constructor() {
    super();

    this._onMenuClick = this._onMenuClick.bind(this);

    this._activeItem = MenuItem.TABLE;
  }

  setMenuClickHandler(callback) {
    this._callback.menuClick = callback;
    this.getElement().addEventListener(`click`, this._onMenuClick);
  }

  getActiveItem() {
    return this._activeItem;
  }

  setActiveItem(menuItem) {
    if (menuItem === this._activeItem) {
      return;
    }

    const oldActiveElement = this.getElement().querySelector(`[data-menu-item=${this._activeItem}]`);
    const newActiveElement = this.getElement().querySelector(`[data-menu-item=${menuItem}]`);

    if (!newActiveElement) {
      return;
    }

    if (oldActiveElement) {
      oldActiveElement.classList.remove(`trip-tabs__btn--active`);
    }
    newActiveElement.classList.add(`trip-tabs__btn--active`);

    this._activeItem = menuItem;
  }

  _onMenuClick(evt) {
    if (evt.target.dataset.menuItem) {
      evt.preventDefault();
      this._callback.menuClick(evt.target.dataset.menuItem);
    }
  }

  getTemplate() {
    return `
      <div>
        <h2 class="visually-hidden">Switch trip view</h2>
        <nav class="trip-controls__trip-tabs  trip-tabs">
          <a class="trip-tabs__btn  trip-tabs__btn--active" href="#" data-menu-item="${MenuItem.TABLE}">Table</a>
          <a class="trip-tabs__btn" href="#" data-menu-item="${MenuItem.STATISTICS}">Stats</a>
        </nav>
      </div>
    `;
  }
}
