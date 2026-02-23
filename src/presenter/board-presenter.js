
import ListView from '../view/list-view';
import CostView from '../view/cost-view';
import ListEmptyView from '../view/list-empty-view';
import LoadingView from '../view/loading-view';
import { render, remove } from '../framework/render';
import { SortingType, UpdateType, UserAction, FilterType } from '../const';
import { filter } from '../utils/filter';
import { sorting } from '../utils/sorting';
import PointPresenter from './point-presenter';
import NewPointPresenter from './new-point-presenter';

export default class BoardPresenter {
  #listComponent = new ListView();
  #loadingComponent = new LoadingView();
  #boardContainer = null;
  #tripInfoContainer = null;
  #pointsModel = null;
  #pointPresenters = new Map();
  #currentSortType = SortingType.DAY;
  #currentFilterType = FilterType.EVERYTHING;
  #sortComponent = null;
  #emptyListComponent = null;
  #costComponent = null;
  #filterModel = null;
  #sortModel = null;
  #newPointPresenter = null;
  #isLoading = true;

  constructor({boardContainer, tripInfoContainer, pointsModel, filterModel, sortModel, onNewPointDestroy}) {

    this.#boardContainer = boardContainer;
    this.#tripInfoContainer = tripInfoContainer;
    this.#pointsModel = pointsModel;
    this.#filterModel = filterModel;
    this.#sortModel = sortModel;

    this.#newPointPresenter = new NewPointPresenter({
      pointsListContainer: this.#listComponent.element,
      onDataChange: this.#handleViewAction,
      onDestroy: onNewPointDestroy,
      pointsModel
    });

    this.#pointsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
    this.#sortModel.addObserver(this.#handleModelEvent);
  }

  get points() {
    this.#currentFilterType = this.#filterModel.filter;
    this.#currentSortType = this.#sortModel.sort;
    const points = this.#pointsModel.points;
    const filteredPoints = filter[this.#currentFilterType](points);

    const sortingPoints = sorting[this.#currentSortType](filteredPoints);

    return sortingPoints;
  }

  init() {
    this.#renderBoard();
  }

  createPoint() {
    this.#sortModel.setSort(UpdateType.MAJOR, SortingType.DAY);
    this.#filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
    this.#newPointPresenter.init();
  }

  #renderCost() {
    this.#costComponent = new CostView();
    render(this.#costComponent, this.#tripInfoContainer);
  }

  #renderLoading() {
    render(this.#loadingComponent, this.#boardContainer);
  }

  #renderEmptyList() {
    this.#emptyListComponent = new ListEmptyView({filterType: this.#currentFilterType});
    render(this.#emptyListComponent, this.#boardContainer);
  }

  #renderPoint(point) {
    const pointPresenter = new PointPresenter({
      listContainer: this.#listComponent.element,
      pointsModel: this.#pointsModel,
      onDataChange: this.#handleViewAction,
      onModeChange: this.#handleModeChange
    });

    pointPresenter.init(point);

    this.#pointPresenters.set(point.id, pointPresenter);
  }

  #renderPoints() {
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

    render(this.#listComponent, this.#boardContainer);
    this.#renderPoints();
  }

  #clearBoard() {
    this.#newPointPresenter.destroy();
    this.#clearPointsList();

    remove(this.#sortComponent);
    remove(this.#loadingComponent);
    if (this.#emptyListComponent) {
      remove(this.#emptyListComponent);
    }
    remove(this.#costComponent);
    this.#currentFilterType = this.#filterModel.filter;
  }

  #renderBoard() {
    if (this.#isLoading) {
      this.#renderLoading();
      return;
    }

    this.#renderCost();
    this.#renderPointsList();
  }

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
        this.#clearBoard();
        this.#renderBoard();
        break;
      case UpdateType.INIT:
        this.#isLoading = false;
        remove(this.#loadingComponent);
        this.#renderBoard();
        break;
    }
  };

  #handleModeChange = () => {
    this.#newPointPresenter.destroy();
    this.#pointPresenters.forEach((presenter) => {
      presenter.resetMode();
    });
  };
}
