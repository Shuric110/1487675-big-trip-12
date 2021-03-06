import {createElementFromTemplate} from "../util/render.js";
import {MILLISECONDS_PER_SECOND} from "../util/date.js";

const SHAKE_DURATION = 600;

export default class Component {
  constructor() {
    if (new.target === Component) {
      throw new Error(`Can't instantiate abstract class, only concrete one.`);
    }

    this._element = null;
    this._containerElement = null;
    this._callback = {};
  }

  getTemplate() {
    throw new Error(`Abstract method not implemented: getTemplate`);
  }

  _createElement() {
    this._element = createElementFromTemplate(this.getTemplate());
  }

  getElement() {
    if (!this._element) {
      this._createElement();
    }

    return this._element;
  }

  getContainerElement() {
    if (!this._containerElement) {
      this._containerElement = this._findContainerElement();
    }

    return this._containerElement;
  }

  _findContainerElement() {
    return this.getElement();
  }

  removeElement() {
    this._element = null;
    this._containerElement = null;
  }

  getHasElement() {
    return this._element !== null;
  }

  shake(callback) {
    this.getElement().style.animation = `shake ${SHAKE_DURATION / MILLISECONDS_PER_SECOND}s`;
    setTimeout(() => {
      this.getElement().style.animation = ``;
      callback();
    }, SHAKE_DURATION);
  }
}
