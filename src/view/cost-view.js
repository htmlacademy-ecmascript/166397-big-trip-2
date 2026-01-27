import AbstractView from '../framework/view/abstract-view';
const DEFAULT_COST = 1230;

function createCostTemplate(cost) {
  return (
    `<p class="trip-info__cost">
      Total: €&nbsp;<span class="trip-info__cost-value">${cost}</span>
    </p>`
  );
}

export default class CostView extends AbstractView {
  #cost = null;

  constructor({cost} = {}) {
    super();
    this.#cost = cost || DEFAULT_COST;
  }

  get template() {
    return createCostTemplate(this.#cost);
  }
}
