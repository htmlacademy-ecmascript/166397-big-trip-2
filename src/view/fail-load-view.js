import AbstractView from '../framework/view/abstract-view';

function createFailLoadTemplate() {
  return '<p class="trip-events__msg">Failed to load latest route information</p>';
}

export default class FailLoadView extends AbstractView {
  get template() {
    return createFailLoadTemplate();
  }
}
