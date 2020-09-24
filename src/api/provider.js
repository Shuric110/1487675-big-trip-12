import {nanoid} from "nanoid";

const SUPPLEMENTAL_STORE_KEY = `supplemental`;
const SupplementType = {
  OFFERS: `offers`,
  DESTINATIONS: `destinations`
};

const getSyncedPoints = (items) => {
  return items.filter(({success}) => success)
    .map(({payload}) => payload.point);
};

const createStoreStructure = (items) => {
  return items.reduce((acc, current) => {
    return Object.assign({}, acc, {
      [current.id]: current,
    });
  }, {});
};

export default class Provider {
  constructor(api, store) {
    this._api = api;
    this._store = store;
    this._supplementalStore = store.getSubStore(SUPPLEMENTAL_STORE_KEY);
  }

  getPoints() {
    if (Provider.isOnline()) {
      return this._api.getPoints()
        .then((points) => {
          this._store.setItems(createStoreStructure(points));
          return points;
        });
    }

    return Promise.resolve(Object.values(this._store.getItems()));
  }

  getOffers() {
    if (Provider.isOnline()) {
      return this._api.getOffers()
        .then((offers) => {
          this._supplementalStore.setItem(SupplementType.OFFERS, offers);
          return offers;
        });
    }

    return Promise.resolve(this._supplementalStore.getItem(SupplementType.OFFERS));
  }

  getDestinations() {
    if (Provider.isOnline()) {
      return this._api.getDestinations()
        .then((destinations) => {
          this._supplementalStore.setItem(SupplementType.DESTINATIONS, destinations);
          return destinations;
        });
    }

    return Promise.resolve(this._supplementalStore.getItem(SupplementType.DESTINATIONS));
  }

  updatePoint(point) {
    if (Provider.isOnline()) {
      return this._api.updatePoint(point)
        .then((updatedPoint) => {
          this._store.setItem(updatedPoint.id, updatedPoint);
          return updatedPoint;
        });
    }

    this._store.setItem(point.id, point);
    return Promise.resolve(point);
  }

  addPoint(point) {
    if (Provider.isOnline()) {
      return this._api.addPoint(point)
        .then((newPoint) => {
          this._store.setItem(newPoint.id, newPoint);
          return newPoint;
        });
    }

    const localNewPointId = nanoid();
    const localNewPoint = Object.assign({}, point, {id: localNewPointId});

    this._store.setItem(localNewPoint.id, localNewPoint);

    return Promise.resolve(localNewPoint);
  }

  deletePoint(id) {
    if (Provider.isOnline()) {
      return this._api.deletePoint(id)
        .then(() => this._store.removeItem(id));
    }

    this._store.removeItem(id);

    return Promise.resolve();
  }

  sync() {
    if (Provider.isOnline()) {
      const storePoints = Object.values(this._store.getItems());

      return this._api.sync(storePoints)
        .then((response) => {
          // Здесь баг бэкенда: created отдаётся согласно ТЗ, а updated - в своём формате, который необходимо конвертировать
          const createdPoints = response.created;
          const updatedPoints = getSyncedPoints(response.updated);

          const items = createStoreStructure([...createdPoints, ...updatedPoints]);

          this._store.setItems(items);
        });
    }

    return Promise.reject(new Error(`Sync data failed (client is offline)`));
  }

  static isOnline() {
    return window.navigator.onLine;
  }
}
