import { getRandomPoint } from '../mocks/point';
import { getMockOffers } from '../mocks/offer';
import { getMockDestinations } from '../mocks/destination';
import { getElementByKey, toCamelFromSnakeCase } from '../utils/common';
import { UpdateType } from '../const';
import Observable from '../framework/observable';
import dayjs from 'dayjs';
// import he from 'he';

const POINT_COUNT = 4;

export default class PointsModel extends Observable {
  #points = [];
  #destinations = [];
  #offers = [];
  #pointsApiService = null;

  constructor({pointsApiService}) {
    super();
    this.#pointsApiService = pointsApiService;

    // this.#pointsApiService.points.then((points) => {
    //   console.log(points);

    //   console.log(points.map(this.#adaptToClient));
    // });

    // this.#pointsApiService.destinations.then((destionations) => {
    //   console.log(destionations);
    // });


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

  async init() {
    try {
      const points = await this.#pointsApiService.points;

      this.#points = points.map(this.#adaptToClient);
      this.#destinations = await this.#pointsApiService.destinations;
      this.#offers = await this.#pointsApiService.offers;

    } catch {
      this.#points = [];
      this.#destinations = [];
      this.#offers = [];
    }

    this._notify(UpdateType.INIT);
  }

  getDestinationById(id) {
    return getElementByKey('id', id, this.#destinations);
  }

  getOffersByType(type) {
    return getElementByKey('type', type, this.#offers)?.offers;
  }

  updatePoint(updateType, update) {
    const index = this.#points.findIndex((point) => point.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting point');
    }

    // const encodedUpdate = this.#encodeData(update);

    this.#points = [
      ...this.#points.slice(0, index),
      update,
      ...this.#points.slice(index + 1),
    ];

    this._notify(updateType, update);
  }

  addPoint(updateType, update) {
    // const encodedUpdate = this.#encodeData(update);

    this.#points = [
      update,
      ...this.#points,
    ];

    this._notify(updateType, update);
  }

  deletePoint(updateType, update) {
    const index = this.#points.findIndex((point) => point.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t delete unexisting point');
    }

    this.#points = this.#points.filter((point) => point.id !== update.id);

    this._notify(updateType, update);
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

  // #encodeData(point) {
  //   const map = new Map(Object.entries(point));

  //   for (const [key, value] of map.entries()) {
  //     if (typeof value === 'string') {
  //       map.set(key, he.encode(value));
  //     }
  //   }

  //   return Object.fromEntries(map.entries());
  // }
}
