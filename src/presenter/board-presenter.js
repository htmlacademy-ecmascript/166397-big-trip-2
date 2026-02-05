
import SortView from '../view/sort-view/sort-view';
import ListView from '../view/list-view';
import FiltersView from '../view/filters-view/filters-view';
import CostView from '../view/cost-view';
import ListEmptyView from '../view/list-empty-view';
import { render } from '../framework/render';
import { generateFilters } from '../mocks/filter';
import { generateSorting } from '../mocks/sorting';
import { updateElement, getElementByKey } from '../utils/common';
import { SortingType } from '../const';
import PointPresenter from './point-presenter';

export default class BoardPresenter {
  #listView = new ListView();
  #boardContainer = null;
  #tripInfoContainer = null;
  #filtersContainer = null;
  #pointsModel = null;
  #points = [];
  #filters = [];
  #sortings = [];
  #isSortingExist = false;
  #pointPresenters = new Map();
  #currentSortType = SortingType.DAY;

  constructor({boardContainer, tripInfoContainer, filtersContainer, pointsModel}) {
    this.#boardContainer = boardContainer;
    this.#tripInfoContainer = tripInfoContainer;
    this.#filtersContainer = filtersContainer;
    this.#pointsModel = pointsModel;
  }

  init() {
    this.#points = [...this.#pointsModel.points];
    this.#filters = generateFilters(this.#points);
    this.#sortings = generateSorting(this.#points);
    this.#isSortingExist = !this.#sortings || !this.#sortings.length;

    this.#renderBoard();
  }

  #renderCost() {
    render(new CostView(), this.#tripInfoContainer);
  }

  #renderFilters() {
    render(new FiltersView({ filters: this.#filters }), this.#filtersContainer);
  }

  #renderSort() {
    if (this.#isSortingExist) {
      return;
    }

    render(new SortView({
      sortings: this.#sortings,
      onSortChange: this.#sortChangeHandler
    }), this.#boardContainer);
  }

  #renderEmptyList() {
    render(new ListEmptyView(), this.#boardContainer);
  }

  #renderPoint(point) {
    const pointPresenter = new PointPresenter({
      listContainer: this.#listView.element,
      pointsModel: this.#pointsModel,
      onDataChange: this.#PointDataChangeHandler,
      onModeChange: this.#handleModeChange
    });

    pointPresenter.init(point);

    this.#pointPresenters.set(point.id, pointPresenter);
  }

  #renderPoints() {
    this.#sortPoints();

    this.#points.forEach((point) => {
      this.#renderPoint(point);
    });
  }

  #clearPointsList() {
    this.#pointPresenters.forEach((presenter) => {
      presenter.destroy();
    });

    this.#pointPresenters.clear();
  }

  #renderPointsList() {
    if (!this.#points.length) {
      this.#renderEmptyList();
      return;
    }

    render(this.#listView, this.#boardContainer);
    this.#renderPoints();
  }

  #sortPoints() {
    if (this.#isSortingExist) {
      return;
    }

    this.#points = getElementByKey('type', this.#currentSortType, this.#sortings).points;
  }

  #renderBoard() {
    this.#renderCost();
    this.#renderFilters();
    this.#renderSort();
    this.#renderPointsList();
  }

  #PointDataChangeHandler = (newPoint) => {
    this.#points = updateElement(this.#points, newPoint);
    this.#pointPresenters.get(newPoint.id).init(newPoint);
  };

  #handleModeChange = () => {
    this.#pointPresenters.forEach((presenter) => {
      presenter.resetMode();
    });
  };

  #sortChangeHandler = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#currentSortType = sortType;

    this.#clearPointsList();
    this.#renderPointsList();
  };
}
