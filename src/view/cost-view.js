import { createElement } from '../render';

function createCostTemplate() {
  return (
    `<p class="trip-info__cost">
      Total: €&nbsp;<span class="trip-info__cost-value">1230</span>
    </p>`
  );
}

export default class CostView {
  getTemplate() {
    return createCostTemplate();
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
