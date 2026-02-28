import ApiService from './framework/api-service';
import { toSnakeFromCamelCase } from './utils/common';
import he from 'he';

const Method = {
  GET: 'GET',
  PUT: 'PUT',
  POST: 'POST',
  DELETE: 'DELETE'
};

const Route = {
  POINTS: 'points',
  OFFERS: 'offers',
  DESTINATIONS: 'destinations',
};

export default class PointsApiService extends ApiService {
  get points() {
    return this._load({url: Route.POINTS})
      .then(ApiService.parseResponse);
  }

  get offers() {
    return this._load({url: Route.OFFERS})
      .then(ApiService.parseResponse);
  }

  get destinations() {
    return this._load({url: Route.DESTINATIONS})
      .then(ApiService.parseResponse);
  }

  async updatePoint(point) {
    const response = await this._load({
      url: `${Route.POINTS}/${point.id}`,
      method: Method.PUT,
      body: JSON.stringify(this.#adaptToServer(point)),
      headers: new Headers({'Content-Type': 'application/json'})
    });

    const parsedResponse = await ApiService.parseResponse(response);

    return parsedResponse;
  }

  async addPoint(point) {
    const response = await this._load({
      url: `${Route.POINTS}`,
      method: Method.POST,
      body: JSON.stringify(this.#adaptToServer(point)),
      headers: new Headers({'Content-Type': 'application/json'})
    });

    const parsedResponse = await ApiService.parseResponse(response);

    return parsedResponse;
  }

  async deletePoint(point) {
    const response = await this._load({
      url: `${Route.POINTS}/${point.id}`,
      method: Method.DELETE,
    });

    return response;
  }

  #adaptToServer(point) {
    const formattedPoint = {};

    Object.entries(point).map(
      ([key, value]) => {
        let formattedValue = value instanceof Object ? structuredClone(value) : value;
        const formattedKey = toSnakeFromCamelCase(key);

        if (typeof value === 'string') {
          formattedValue = he.encode(value);
        }

        if (value instanceof Date) {
          formattedValue = value.toISOString();
        }

        formattedPoint[formattedKey] = formattedValue;
      },
    );

    return formattedPoint;
  }
}
