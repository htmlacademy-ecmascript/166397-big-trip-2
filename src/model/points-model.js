import { getElementByKey, toCamelFromSnakeCase } from '../utils/common';
import { UpdateType } from '../const';
import Observable from '../framework/observable';
import dayjs from 'dayjs';

export default class PointsModel extends Observable {
  #points = [];
  #destinations = [];
  #offers = [];
  #pointsApiService = null;

  constructor({pointsApiService}) {
    super();
    this.#pointsApiService = pointsApiService;
  }

  get points() {
    return this.#points;
  }

  get destinations() {
    return this.#destinations;
  }

  get offers() {
    return this.#offers;
  }

  get trip() {
    return this.#points.map((point) => this.getDestinationById(point.destination).name);
  }

  get dateStart() {
    return this.#points[0]?.dateFrom;
  }

  get dateEnd() {
    return this.#points[this.#points.length - 1]?.dateTo;
  }

  async init() {
    try {
      const points = await this.#pointsApiService.points;

      this.#points = points.map(this.#adaptToClient);
      this.#destinations = await this.#pointsApiService.destinations;
      this.#offers = await this.#pointsApiService.offers;

      this._notify(UpdateType.INIT);

    } catch {
      this.#points = [];
      this.#destinations = [];
      this.#offers = [];

      this._notify(UpdateType.FAIL);
    }
  }

  getDestinationById(id) {
    return getElementByKey('id', id, this.#destinations);
  }

  getOffersByType(type) {
    return getElementByKey('type', type, this.#offers)?.offers;
  }

  async updatePoint(updateType, update) {
    const index = this.#points.findIndex((point) => point.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting point');
    }

    try {
      const response = await this.#pointsApiService.updatePoint(update);
      const updatedPoint = this.#adaptToClient(response);

      // this.#points = [
      //   ...this.#points.slice(0, index),
      //   updatedPoint,
      //   ...this.#points.slice(index + 1),
      // ];

      const points = await this.#pointsApiService.points;

      this.#points = points.map(this.#adaptToClient);

      this._notify(updateType, updatedPoint);
    } catch {
      throw new Error('Can\'t update point');
    }
  }

  async addPoint(updateType, update) {
    try {
      const response = await this.#pointsApiService.addPoint(update);
      const newPoint = this.#adaptToClient(response);

      // this.#points = [
      //   newPoint,
      //   ...this.#points,
      // ];

      const points = await this.#pointsApiService.points;

      this.#points = points.map(this.#adaptToClient);

      this._notify(updateType, newPoint);
    } catch {
      throw new Error('Can\'t add point');
    }
  }

  async deletePoint(updateType, update) {
    const index = this.#points.findIndex((point) => point.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t delete unexisting point');
    }

    try {
      await this.#pointsApiService.deletePoint(update);

      this.#points = this.#points.filter((point) => point.id !== update.id);

      this._notify(updateType, update);
    } catch {
      throw new Error('Can\'t delete point');
    }
  }

  #adaptToClient(point) {
    const formattedPoint = {};

    Object.entries(point).map(
      ([key, value]) => {
        let formattedValue = value instanceof Object ? structuredClone(value) : value;
        let formattedKey = key;

        if (dayjs(value).isValid() && dayjs(value).toISOString() === value) {
          formattedValue = new Date(value);
        }

        if (key.includes('_')) {
          formattedKey = toCamelFromSnakeCase(key);
        }

        formattedPoint[formattedKey] = formattedValue;
      },
    );

    return formattedPoint;
  }
}
