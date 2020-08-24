import Component from "./component.js";
import {replace} from "../util/render.js";

export default class SmartComponent extends Component {
  constructor() {
    if (new.target === Component) {
      throw new Error(`Can't instantiate abstract class, only concrete one.`);
    }

    super();

    this._data = {};
  }

  _createElement() {
    super._createElement();
    this._setInnerHandlers();
  }

  _updateComponent() {
    if (!this.getHasElement) {
      throw new Error(`Can't update unrendered component.`);
    }

    const oldElement = this.getElement();
    this.removeElement();

    replace(this, oldElement);

    this._restoreHandlers();
  }

  _updateData(update, noRender = false) {
    if (!update) {
      return;
    }

    Object.assign(this._data, update);

    if (!noRender) {
      this._updateComponent();
    }
  }

  _setInnerHandlers() {
  }

  _restoreHandlers() {
    Object.entries(this._callback).forEach(([eventName, callback]) => {
      // Имя сеттера события: set + <имя события с большой буквы> + Handler
      const setterName = `set` + eventName.charAt(0).toUpperCase() + eventName.slice(1) + `Handler`;
      this[setterName](callback);
    });
  }

}
