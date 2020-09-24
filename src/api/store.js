export default class Store {
  constructor(key, storage) {
    this._storage = storage;
    this._storeKey = key;
    this._subStores = {};
  }

  getItems() {
    try {
      return JSON.parse(this._storage.getItem(this._storeKey)) || {};
    } catch (err) {
      return {};
    }
  }

  setItems(items) {
    this._storage.setItem(
        this._storeKey,
        JSON.stringify(items)
    );
  }

  getItem(key) {
    return this.getItems()[key] || {};
  }

  setItem(key, value) {
    const store = this.getItems();

    this._storage.setItem(
        this._storeKey,
        JSON.stringify(
            Object.assign({}, store, {
              [key]: value
            })
        )
    );
  }

  removeItem(key) {
    const store = this.getItems();

    delete store[key];

    this._storage.setItem(
        this._storeKey,
        JSON.stringify(store)
    );
  }

  getSubStore(key) {
    let subStore = this._subStores[key];
    if (!subStore) {
      subStore = new Store(this._storeKey + `-` + key, this._storage);
      this._subStores[key] = subStore;
    }
    return subStore;
  }
}
