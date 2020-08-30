import Observable from "../util/observable.js";

export default class Events extends Observable {
  constructor() {
    super();
  }

  setDestinationsList(destinationsList) {
    this._destinationsList = destinationsList;
  }

  setDestinationsInfo(destinationsInfo) {
    this._destinationsInfo = destinationsInfo;
  }

  setSpecialOffersList(specialOffersList) {
    this._specialOffersList = specialOffersList;
  }


  getDestinationsList() {
    return this._destinationsList;
  }

  getDestinationInfo(destination) {
    return this._destinationsInfo[destination];
  }

  getSpecialOffers(eventType) {
    return this._specialOffersList[eventType] || [];
  }
}
