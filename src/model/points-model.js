import { getRandomPoint } from '../mocks/point';
import { getMockOffers } from '../mocks/offer';
import { getMockDestinations } from '../mocks/destination';
import { getElementByKey } from '../utils/common';
import Observable from '../framework/observable';

const POINT_COUNT = 4;

export default class PointsModel extends Observable {
  #points = [];
  #destinations = [];
  #offers = [];

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
      this.#points = await Array.from({length: POINT_COUNT}, getRandomPoint);
      this.#destinations = await getMockDestinations();
      this.#offers = await getMockOffers();

    } catch {
      this.#points = [];
      this.#destinations = [];
      this.#offers = [];
    }
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

    this.#points = [
      ...this.#points.slice(0, index),
      update,
      ...this.#points.slice(index + 1),
    ];

    this._notify(updateType, update);
  }

  addPoint(updateType, update) {
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
}
