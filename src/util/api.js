const Method = {
  GET: `GET`,
  PUT: `PUT`,
  POST: `POST`,
  DELETE: `DELETE`
};

const SuccessHTTPStatusRange = {
  MIN: 200,
  MAX: 299
};

export default class Api {
  constructor(baseUrl, authToken) {
    this._baseUrl = baseUrl;
    this._authToken = authToken;
  }

  getPoints() {
    return this._query({url: `points`})
      .then(Api.toJSON);
    /*
      .then((result) => {
        return new Promise((resolve) => {
          setTimeout(() => resolve(result), 2000);
        });
      });
    */
  }

  getOffers() {
    return this._query({url: `offers`})
      .then(Api.toJSON);
  }

  getDestinations() {
    return this._query({url: `destinations`})
      .then(Api.toJSON);
  }

  updatePoint(point) {
    return this._query({
      url: `points/${point.id}`,
      method: Method.PUT,
      body: JSON.stringify(point),
      headers: new Headers({"Content-Type": `application/json`})
    })
      .then(Api.toJSON);
  }

  addPoint(point) {
    return this._query({
      url: `points`,
      method: Method.POST,
      body: JSON.stringify(point),
      headers: new Headers({"Content-Type": `application/json`})
    })
      .then(Api.toJSON);
  }

  deletePoint(id) {
    return this._query({
      url: `points/${id}`,
      method: Method.DELETE
    });
  }

  _query({
    url,
    method = Method.GET,
    body = null,
    headers = new Headers()
  }) {
    headers.append(`Authorization`, `Basic ${this._authToken}`);

    return fetch(
        `${this._baseUrl}/${url}`,
        {method, body, headers}
    )
      .then(Api.checkStatus)
      .catch(Api.catchError);
  }

  static checkStatus(response) {
    if (
      response.status < SuccessHTTPStatusRange.MIN &&
      response.status > SuccessHTTPStatusRange.MAX
    ) {
      throw new Error(`${response.status}: ${response.statusText}`);
    }

    return response;
  }

  static toJSON(response) {
    return response.json();
  }

  static catchError(err) {
    throw err;
  }
}
