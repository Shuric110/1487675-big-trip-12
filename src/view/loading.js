import ComponentView from "./component.js";

export default class Loading extends ComponentView {
  getTemplate() {
    return `
      <p class="trip-events__msg">
        Loading...
      </p>
    `;
  }
}
