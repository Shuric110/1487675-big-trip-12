import ComponentView from "./component.js";

export default class TripDayList extends ComponentView {
  getTemplate() {
    return `
      <ul class="trip-days">
      </ul>
    `;
  }
}
