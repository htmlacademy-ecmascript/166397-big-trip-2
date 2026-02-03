import { createSortTemplate } from './sort-template';
import AbstractView from '../../framework/view/abstract-view';

export default class SortView extends AbstractView {
  #sortingItems = [];
  #handleSortChange = null;

  constructor({sortingItems, onSortChange}) {
    super();
    this.#sortingItems = sortingItems;
    this.#handleSortChange = onSortChange;

    this.#initEventListeners();
  }

  get template() {
    return createSortTemplate(this.#sortingItems);
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
