import { getRandomPoint } from '../mocks/point';
import { getMockOffers } from '../mocks/offer';
import { getMockDestinations } from '../mocks/destination';

const POINT_COUNT = 4;

export default class PointsModel {
  points = Array.from({length: POINT_COUNT}, getRandomPoint);
  destinations = getMockDestinations();
  offers = getMockOffers();

  getPoints() {
    return this.points;
  }

  getDestinations() {
    return this.destinations;
  }

  getOffers() {
    return this.offers;
  }
}
