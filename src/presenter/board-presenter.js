
import SortView from '../view/sort-view/sort-view';
import ListView from '../view/list-view';
import CostView from '../view/cost-view';
import ListEmptyView from '../view/list-empty-view';
import { render, remove } from '../framework/render';
import { generateSorting } from '../mocks/sorting';
import { getElementByKey } from '../utils/common';
import { SortingType, UpdateType, UserAction, FilterType } from '../const';
import { filter } from '../utils/filter';
import PointPresenter from './point-presenter';

export default class BoardPresenter {
  #listView = new ListView();
  #boardContainer = null;
  #tripInfoContainer = null;
  #pointsModel = null;
  // #points = [];
  #sortings = [];
  #isSortingsExist = false;
  #pointPresenters = new Map();
  #currentSortType = SortingType.DAY;
  #currentFilterType = FilterType.EVERYTHING;
  #sortComponent = null;
  #emptyListComponent = null;
  #costComponent = null;
  #filterModel = null;

  constructor({boardContainer, tripInfoContainer, pointsModel, filterModel}) {
    this.#boardContainer = boardContainer;
    this.#tripInfoContainer = tripInfoContainer;
    this.#pointsModel = pointsModel;
    this.#filterModel = filterModel;

    this.#pointsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);

  }

  get points() {
    this.#currentFilterType = this.#filterModel.filter;
    const points = this.#pointsModel.points;
    const filteredPoints = filter[this.#currentFilterType](points);

    const sortings = generateSorting(filteredPoints);
    this.#isSortingsExist = Boolean(sortings.length);
    return getElementByKey('type', this.#currentSortType, sortings).points;
  }

  init() {
    // this.#points = [...this.#pointsModel.points];
    // this.#sortings = generateSorting(this.points);
    // this.#isSortingsExist = Boolean(this.#sortings.length);

    this.#renderBoard();
  }

  #renderCost() {
    this.#costComponent = new CostView();
    render(this.#costComponent, this.#tripInfoContainer);
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
    this.#emptyListComponent = new ListEmptyView({filterType: this.#currentFilterType});
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
    if (this.#emptyListComponent) {
      remove(this.#emptyListComponent);
    }
    remove(this.#costComponent);

    if (resetSortType) {
      this.#currentSortType = SortingType.DAY;
    }
  }

  #renderBoard() {
    this.#renderCost();
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
    this.#renderBoard();
  };
}
