import AbstractView from '../framework/view/abstract-view';

function createCostTemplate() {
  return (
    `<p class="trip-info__cost">
      Total: €&nbsp;<span class="trip-info__cost-value">1230</span>
    </p>`
  );
}

export default class CostView extends AbstractView {
  get template() {
    return createCostTemplate();
  }
}
