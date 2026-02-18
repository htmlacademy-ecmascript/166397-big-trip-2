import { createSortTemplate } from './sort-template';
import AbstractView from '../../framework/view/abstract-view';

export default class SortView extends AbstractView {
  #sortings = [];
  #handleSortChange = null;
  #currentSort = null;

  constructor({sortings, currentSort, onSortChange}) {
    super();
    this.#sortings = sortings;
    this.#handleSortChange = onSortChange;
    this.#currentSort = currentSort;

    this.#initEventListeners();
  }

  get template() {
    return createSortTemplate(this.#sortings, this.#currentSort);
  }

  #initEventListeners() {
    this.element.addEventListener('change', this.#sortChangeHandler);
  }

  #sortChangeHandler = (evt) => {
    evt.preventDefault();
    const currentValue = this.element['trip-sort'].value;
    const currentType = currentValue.replace('sort-', '');

    this.#handleSortChange(currentType);
  };
}
