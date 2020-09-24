import Observable from "../util/observable.js";
import {UpdateAction} from "../const.js";

export default class Events extends Observable {
  constructor() {
    super();
    this._events = [];
  }

  setEvents(events) {
    this._events = events.slice();
    this._notify(UpdateAction.EVENTS_INIT, null);
  }

  getEvents() {
    return this._events;
  }

  updateEvent(update) {
    const index = this._events.findIndex((evt) => evt.id === update.id);

    if (index === -1) {
      throw new Error(`Can't update unexisting event`);
    }

    // Проверка масштаба изменений: если изменилось только свойство isFavorite, то такое
    // изменение будет считаться обновлением флагов
    const oldEvent = this._events[index];
    const oldEventForComparing = Object.assign({}, oldEvent, {isFavorite: update.isFavorite});
    const isFlagsUpdate = JSON.stringify(oldEventForComparing) === JSON.stringify(update)
      && update.isFavorite !== oldEvent.isFavorite;

    this._events = this._events.slice();
    this._events.splice(index, 1, update);

    this._notify(isFlagsUpdate ? UpdateAction.EVENT_FLAGS_UPDATE : UpdateAction.EVENT_UPDATE, update);
  }

  addEvent(update) {
    this._events = this._events.slice();
    this._events.splice(0, 0, update);

    this._notify(UpdateAction.EVENT_ADD, update);
  }

  deleteEvent(update) {
    const index = this._events.findIndex((evt) => evt.id === update.id);

    if (index === -1) {
      throw new Error(`Can't delete unexisting event`);
    }

    this._events = this._events.slice();
    this._events.splice(index, 1);

    this._notify(UpdateAction.EVENT_DELETE, update);
  }
}
