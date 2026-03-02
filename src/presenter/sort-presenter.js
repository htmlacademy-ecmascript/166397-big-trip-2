import { sorting } from '../utils/sorting';
import { remove, render, replace, RenderPosition } from '../framework/render';
import SortView from '../view/sort-view/sort-view';
import { UpdateType } from '../const';

export default class SortPresenter {
  #sortContainer = null;
  #sortModel = null;
  #pointsModel = null;
  #sortComponent = null;
  #currentUpdateType = UpdateType.FAIL;

  constructor({sortContainer, sortModel, pointsModel}) {
    this.#sortContainer = sortContainer;
    this.#sortModel = sortModel;
    this.#pointsModel = pointsModel;

    this.#sortModel.addObserver(this.#handleModelEvent);
    this.#pointsModel.addObserver(this.#handleModelEvent);
  }

  get sort() {
    const points = this.#pointsModel.points;

    return Object.entries(sorting).map(
      ([sortingType, sortingPoints]) => {
        const sorteredPoints = sortingPoints ? sortingPoints(points) : null;

        return ({
          type: sortingType,
          points: sorteredPoints,
        });
      },
    );
  }

  init() {
    if (this.#currentUpdateType === UpdateType.FAIL) {
      return;
    }

    if (!this.#pointsModel.points.length) {
      remove(this.#sortComponent);
      return;
    }

    const prevSortComponent = this.#sortComponent;

    this.#sortComponent = new SortView({
      sortings: this.sort,
      currentSort: this.#sortModel.sort,
      onSortChange: this.#handleSortTypeChange
    });

    if (!prevSortComponent) {
      render(this.#sortComponent, this.#sortContainer, RenderPosition.AFTERBEGIN);
      return;
    }

    replace(this.#sortComponent, prevSortComponent);
    remove(prevSortComponent);
  }

  #handleModelEvent = (updateType) => {
    this.#currentUpdateType = updateType;

    this.init();
  };

  #handleSortTypeChange = (sortType) => {
    if (sortType === this.#sortModel.sort) {
      return;
    }

    this.#sortModel.setSort(UpdateType.MAJOR, sortType);
  };
}
