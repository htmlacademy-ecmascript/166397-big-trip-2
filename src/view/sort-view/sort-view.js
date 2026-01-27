import { createSortTemplate } from './sort-template';
import AbstractView from '../../framework/view/abstract-view';

export default class SortView extends AbstractView {
  #sortingItems = [];

  constructor({sortingItems}) {
    super();
    this.#sortingItems = sortingItems;
  }

  get template() {
    return createSortTemplate(this.#sortingItems);
  }
}
