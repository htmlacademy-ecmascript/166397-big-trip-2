import ApiService from './framework/api-service';
import { toSnakeFromCameCase } from './utils/common';
import he from 'he';

const Method = {
  GET: 'GET',
  PUT: 'PUT'
};

export default class PointsApiService extends ApiService {
  get points() {
    return this._load({url: 'points'})
      .then(ApiService.parseResponse);
  }

  async udatePoint(point) {
    const response = await this._load({
      url: `points/${point.id}`,
      method: Method.PUT,
      body: JSON.stringify(this.#adaptToServer(point)),
      headers: new Headers({'Content-Type': 'application/json'})
    });

    const parsedResponse = await ApiService.parseResponse(response);

    return parsedResponse;
  }

  // #adaptToServer(point) {
  //   const map = new Map(Object.entries(point));


  //   for (const [key, value] of map.entries()) {
  //     let formattedValue = value;

  //     if (typeof value === 'string') {
  //       formattedValue = he.encode(value);
  //     }

  //     if (value instanceof Date) {
  //       formattedValue = value.toISOString;
  //     }

  //     if (key.includes('_')) {
  //       formattedValue = toCamelFromSnakeCase(value);
  //     }

  //     map.set(key, formattedValue);
  //   }

  //   return Object.fromEntries(map.entries());
  // }

  #adaptToServer(point) {
    const formattedPoint = {};

    Object.entries(point).map(
      ([key, value]) => {
        let formattedValue = value instanceof Object ? structuredClone(value) : value;
        // let formattedKey = key;

        if (typeof value === 'string') {
          formattedValue = he.encode(value);
        }

        if (value instanceof Date) {
          formattedValue = value.toISOString;
        }

        const formattedKey = toSnakeFromCameCase(key);

        formattedPoint[formattedKey] = formattedValue;
      },
    );

    return formattedPoint;
  }

}
