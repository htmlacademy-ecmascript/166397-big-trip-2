import Observable from '../framework/observable';
import { SortingType } from '../const';

export default class SortModel extends Observable {
  #currentSort = SortingType.DAY;

  get sort() {
    return this.#currentSort;
  }

  setSort(updateType, sort) {
    this.#currentSort = sort;
    this._notify(updateType, sort);
  }
}
