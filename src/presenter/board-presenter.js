
import SortView from '../view/sort-view/sort-view';
import ListView from '../view/list-view';
import FiltersView from '../view/filters-view/filters-view';
import CostView from '../view/cost-view';
import ListEmptyView from '../view/list-empty-view';
import { render, remove } from '../framework/render';
import { generateFilters } from '../mocks/filter';
import { generateSorting } from '../mocks/sorting';
import { getElementByKey } from '../utils/common';
import { SortingType, UpdateType, UserAction } from '../const';
import PointPresenter from './point-presenter';

export default class BoardPresenter {
  #listView = new ListView();
  #boardContainer = null;
  #tripInfoContainer = null;
  #filtersContainer = null;
  #pointsModel = null;
  // #points = [];
  #filters = [];
  #sortings = [];
  #isSortingsExist = false;
  #pointPresenters = new Map();
  #currentSortType = SortingType.DAY;
  #sortComponent = null;
  #emptyListComponent = null;
  #filtersComponent = null;

  constructor({boardContainer, tripInfoContainer, filtersContainer, pointsModel}) {
    this.#boardContainer = boardContainer;
    this.#tripInfoContainer = tripInfoContainer;
    this.#filtersContainer = filtersContainer;
    this.#pointsModel = pointsModel;

    this.#pointsModel.addObserver(this.#handleModelEvent);
  }

  get points() {
    const sortings = generateSorting(this.#pointsModel.points);
    return getElementByKey('type', this.#currentSortType, sortings).points;
  }

  init() {
    // this.#points = [...this.#pointsModel.points];
    this.#filters = generateFilters(this.points);
    this.#sortings = generateSorting(this.points);
    this.#isSortingsExist = Boolean(this.#sortings.length);

    this.#renderBoard();
  }

  #renderCost() {
    render(new CostView(), this.#tripInfoContainer);
  }

  #renderFilters() {
    this.#filtersComponent = new FiltersView({ filters: this.#filters });
    render(this.#filtersComponent, this.#filtersContainer);
  }

  #renderSort() {
    if (!this.#isSortingsExist) {
      return;
    }

    this.#sortComponent = new SortView({
      sortings: this.#sortings,
      onSortChange: this.#sortChangeHandler
    });

    render(this.#sortComponent, this.#boardContainer);
  }

  #renderEmptyList() {
    this.#emptyListComponent = new ListEmptyView();
    render(this.#emptyListComponent, this.#boardContainer);
  }

  #renderPoint(point) {
    const pointPresenter = new PointPresenter({
      listContainer: this.#listView.element,
      pointsModel: this.#pointsModel,
      onDataChange: this.#handleViewAction,
      onModeChange: this.#handleModeChange
    });

    pointPresenter.init(point);

    this.#pointPresenters.set(point.id, pointPresenter);
  }

  #renderPoints() {
    // this.#sortPoints();

    this.points.forEach((point) => {
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
    if (!this.points.length) {
      this.#renderEmptyList();
      return;
    }

    // this.#clearPointsList();
    render(this.#listView, this.#boardContainer);
    this.#renderPoints();
  }

  // #sortPoints() {
  //   if (!this.#isSortingsExist) {
  //     return;
  //   }

  //   this.points = getElementByKey('type', this.#currentSortType, this.#sortings).points;
  // }

  #clearBoard({resetSortType = false} = {}) {
    this.#clearPointsList();

    remove(this.#sortComponent);
    remove(this.#emptyListComponent);
    remove(this.#filtersComponent);

    if (resetSortType) {
      this.#currentSortType = SortingType.DAY;
    }
  }

  #renderBoard() {
    this.#renderCost();
    this.#renderFilters();
    this.#renderSort();
    this.#renderPointsList();
  }

  // #pointDataChangeHandler = (newPoint) => {
  //   this.#pointsModel.updatePoint(newPoint);
  //   // this.#points = [...this.#pointsModel.points];
  //   // this.#sortings = generateSorting(this.points);
  //   this.#pointPresenters.get(newPoint.id).init(newPoint);
  //   this.#renderPointsList();
  // };

  #handleViewAction = (actionType, updateType, update) => {
    switch (actionType) {
      case UserAction.UPDATE_POINT:
        this.#pointsModel.updatePoint(updateType, update);
        break;
      case UserAction.ADD_POINT:
        this.#pointsModel.addPoint(updateType, update);
        break;
      case UserAction.DELETE_POINT:
        this.#pointsModel.deletePoint(updateType, update);
        break;
    }
  };


  #handleModelEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#pointPresenters.get(data.id).init(data);
        break;
      case UpdateType.MINOR:
        this.#clearBoard();
        this.#renderBoard();
        break;
      case UpdateType.MAJOR:
        this.#clearBoard({resetSortType: true});
        this.#renderBoard();
        break;
    }
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
    this.#clearBoard();
    this.#renderPointsList();
  };
}
