import { createElement } from '../../render';
import { createPointEditTemplate } from './point-edit-template';

const BLANK_POINT = {
  id: 0,
  basePrice: null,
  dateFrom: new Date('2019-03-19T00:00:00.00Z'),
  dateTo: new Date('2019-03-19T00:00:00.00Z'),
  destination: 4,
  isFavorite: true,
  offers: [
    0, 1
  ],
  type: 'flight'
};
export default class PointEditView {
  constructor({point = BLANK_POINT, destinations, offers}) {
    this.point = point;
    this.destinations = destinations;
    this.offers = offers;
  }

  getTemplate() {
    return createPointEditTemplate(this.point, this.destinations, this.offers);
  }

  getElement() {
    if (!this.element) {
      this.element = createElement(this.getTemplate());
    }

    return this.element;
  }

  removeElement() {
    this.element = null;
  }
}
