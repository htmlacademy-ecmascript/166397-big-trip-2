import { createElement } from '../../render';
import { createPointTemplate } from './point-template';

export default class PointView {
  getTemplate() {
    return createPointTemplate();
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
