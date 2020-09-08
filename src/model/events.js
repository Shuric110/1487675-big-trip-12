import Observable from "../util/observable.js";
import {UpdateAction} from "../const.js";

export default class Events extends Observable {
  constructor() {
    super();
    this._events = [];
  }

  setEvents(events) {
    this._events = events.slice();
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
    const oldEventForComparing = Object.assign({}, this._events[index], {isFavorite: update.isFavorite});
    const isFlagsUpdate = Object.entries(oldEventForComparing).every(([idx, value]) => value === update[idx]
    );

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
