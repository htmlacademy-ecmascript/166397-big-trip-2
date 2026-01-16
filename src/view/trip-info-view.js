import { createElement } from '../render';

const createTripInfoTemplate = () => (
  '<section class="trip-main__trip-info  trip-info"></section>'
);

export default class TripInfoView {
  getTemplate() {
    return createTripInfoTemplate();
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
