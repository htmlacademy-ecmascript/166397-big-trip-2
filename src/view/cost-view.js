import AbstractView from '../framework/view/abstract-view';
import { localeSum } from '../utils/common';

function createCostTemplate(cost) {
  const localCost = localeSum(cost);

  return (
    `<p class="trip-info__cost">
      Total: €&nbsp;<span class="trip-info__cost-value">${localCost}</span>
    </p>`
  );
}

export default class CostView extends AbstractView {
  #cost = null;

  constructor({cost} = {}) {
    super();
    this.#cost = cost;
  }

  get template() {
    return createCostTemplate(this.#cost);
  }
}
