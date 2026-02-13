import { getRandomPoint } from '../mocks/point';
import { getMockOffers } from '../mocks/offer';
import { getMockDestinations } from '../mocks/destination';
import { updateElement, getElementByKey } from '../utils/common';

const POINT_COUNT = 4;

export default class PointsModel {
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

  updateTask(newPoint) {
    this.#points = updateElement(this.#points, newPoint);
  }
}
