import { createFiltersTemplate } from './filters-template';
import AbstractView from '../../framework/view/abstract-view';

export default class FiltersView extends AbstractView {
  #filters = [];

  constructor({filters}) {
    super();
    this.#filters = filters;
  }

  get template() {
    return createFiltersTemplate(this.#filters);
  }
}
