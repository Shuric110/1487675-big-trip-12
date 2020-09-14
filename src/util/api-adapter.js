export default class ApiAdapter {
  constructor(api) {
    this._api = api;
  }

  getEvents() {
    return this._api.getPoints()
      .then(ApiAdapter.convertApiPointsToEvents);
  }

  getOffers() {
    return this._api.getOffers()
      .then(ApiAdapter.convertApiOffersToLocal);
  }

  getDestinations() {
    return this._api.getDestinations()
      .then(ApiAdapter.convertApiDestinationsToLocal);
  }

  updateEvent(evt) {
    return this._api.updatePoint(ApiAdapter.convertEventToApiPoint(evt))
      .then(ApiAdapter.convertApiPointToEvent);
  }

  static convertApiPointsToEvents(apiPoints) {
    return apiPoints.map((apiPoint) => ApiAdapter.convertApiPointToEvent(apiPoint));
  }

  static convertApiPointToEvent(apiPoint) {
    return {
      id: apiPoint.id,
      type: apiPoint.type,
      destination: apiPoint.destination.name,
      beginDateTime: new Date(apiPoint.date_from),
      endDateTime: new Date(apiPoint.date_to),
      cost: apiPoint.base_price,
      isFavorite: apiPoint.is_favorite,
      offers: apiPoint.offers.slice().map((apiOffer) => ({
        name: apiOffer.title,
        cost: apiOffer.price
      })),
      destinationInfo: {
        description: apiPoint.destination.description,
        photos: apiPoint.destination.pictures
      }
    };
  }

  static convertEventToApiPoint(evt) {
    return {
      "base_price": evt.cost,
      "date_from": evt.beginDateTime.toISOString(),
      "date_to": evt.endDateTime.toISOString(),
      "destination": {
        name: evt.destination,
        description: evt.destinationInfo.description,
        pictures: evt.destinationInfo.photos
      },
      "id": evt.id,
      "is_favorite": evt.isFavorite,
      "offers": evt.offers.slice().map((offer) => ({
        title: offer.name,
        price: offer.cost
      })),
      "type": evt.type
    };
  }

  static convertEventToApiLocalPoint(evt) {
    const apiLocalPoint = ApiAdapter.convertEventToApiPoint(evt);
    delete apiLocalPoint.id;
    return apiLocalPoint;
  }

  static convertApiOffersToLocal(apiOffers) {
    return apiOffers.reduce(
        (result, {type, offers}) => Object.assign(result,
            {[type]: offers.map((apiOffer) => (
              {
                name: apiOffer.title,
                cost: apiOffer.price,
              }))
            }),
        {}
    );
  }

  static convertApiDestinationsToLocal(apiDestinations) {
    return apiDestinations.reduce(
        (result, {name, description, pictures}) => Object.assign(result,
            {[name]:
              {
                description,
                photos: pictures
              }
            }),
        {}
    );
  }
}
