import { createElement } from '../../render';
import { createPointAddTemplate } from './point-add-template';

export default class PointAddView {
  getTemplate() {
    return createPointAddTemplate();
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
