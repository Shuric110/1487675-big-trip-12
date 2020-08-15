import ComponentView from "./component.js";

export default class NoEvents extends ComponentView {
  getTemplate() {
    return `<p class="trip-events__msg">Click New Event to create your first point</p>`;
  }
}
