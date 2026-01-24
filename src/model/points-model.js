import { getRandomPoint } from '../mocks/point';
import { getMockOffers } from '../mocks/offer';
import { getMockDestinations } from '../mocks/destination';
import { getElementByKey } from '../utils';

const POINT_COUNT = 4;

export default class PointsModel {
  points = [];
  destinations = [];
  offers = [];

  init() {
    return Promise.all([
      Array.from({length: POINT_COUNT}, getRandomPoint),
      getMockDestinations(),
      getMockOffers()
    ]).then(([points, destinations, offers]) => {
      this.points = points;
      this.destinations = destinations;
      this.offers = offers;
    }).catch(() => {
      this.points = [];
      this.destinations = [];
      this.offers = [];
    });
  }

  getPoints() {
    return this.points;
  }

  getDestinations() {
    return this.destinations;
  }

  getOffers() {
    return this.offers;
  }

  getDestinationById(id) {
    return getElementByKey('id', id, this.destinations);
  }

  getOffersByType(type) {
    return getElementByKey('type', type, this.offers).offers;
  }
}
