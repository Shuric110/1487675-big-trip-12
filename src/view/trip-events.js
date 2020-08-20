import ComponentView from "./component.js";

export default class TripEvents extends ComponentView {
  getTemplate() {
    return `
      <section class="trip-events">
        <h2 class="visually-hidden">Trip events</h2>
      </section>
    `;
  }
}
