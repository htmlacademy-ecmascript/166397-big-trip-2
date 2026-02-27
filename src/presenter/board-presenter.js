
import ListView from '../view/list-view';
// import CostView from '../view/cost-view';
import ListEmptyView from '../view/list-empty-view';
import LoadingView from '../view/loading-view';
import { render, remove } from '../framework/render';
import { SortingType, UpdateType, UserAction, FilterType } from '../const';
import { filter } from '../utils/filter';
import { sorting } from '../utils/sorting';
import PointPresenter from './point-presenter';
import NewPointPresenter from './new-point-presenter';
import UiBlocker from '../framework/ui-blocker/ui-blocker';
import FailLoadView from '../view/fail-load-view';
import NewPointButtonView from '../view/new-point-button-view';

const TimeLimit = {
  LOWER_LIMIT: 350,
  UPPER_LIMIT: 1000,
};

export default class BoardPresenter {
  #listComponent = new ListView();
  #loadingComponent = new LoadingView();
  #boardContainer = null;
  #tripMainContainer = null;
  #pointsModel = null;
  #pointPresenters = new Map();
  #currentSortType = SortingType.DAY;
  #currentFilterType = FilterType.EVERYTHING;

  // #sortComponent = null;
  #emptyListComponent = null;
  #failLoadComponent = null;
  // #costComponent = null;
  #filterModel = null;
  #sortModel = null;
  #newPointPresenter = null;
  #isLoading = true;
  #newPointButtonComponent = null;
  #isLoadingSuccessful = false;
  #uiBlocker = new UiBlocker({
    lowerLimit: TimeLimit.LOWER_LIMIT,
    upperLimit: TimeLimit.UPPER_LIMIT
  });

  constructor({boardContainer, tripMainContainer, pointsModel, filterModel, sortModel}) {

    this.#boardContainer = boardContainer;
    this.#tripMainContainer = tripMainContainer;
    this.#pointsModel = pointsModel;
    this.#filterModel = filterModel;
    this.#sortModel = sortModel;

    this.#newPointPresenter = new NewPointPresenter({
      boardContainer: this.#boardContainer,
      pointsListComponent: this.#listComponent,
      emptyListComponent: this.#emptyListComponent,
      onDataChange: this.#handleViewAction,
      onDestroy: this.#handleNewPointFormClose,
      getEmptyComponent: this.#getEmptyComponent,
      pointsModel: this.#pointsModel
    });

    this.#pointsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
    this.#sortModel.addObserver(this.#handleModelEvent);
  }

  get points() {
    this.#currentFilterType = this.#filterModel.filter;
    this.#currentSortType = this.#sortModel.sort;
    const points = [...this.#pointsModel.points];
    const filteredPoints = filter[this.#currentFilterType](points);

    const sortingPoints = sorting[this.#currentSortType](filteredPoints);

    return sortingPoints;
  }

  init() {
    this.#newPointButtonComponent = new NewPointButtonView({
      onClick: this.#handleNewPointButtonClick,
    });

    render(this.#newPointButtonComponent, this.#tripMainContainer);

    this.#renderBoard();

  }

  createPoint() {
    this.#sortModel.setSort(UpdateType.MAJOR, SortingType.DAY);
    this.#filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
    this.#newPointPresenter.init();
  }

  #getEmptyComponent = () => this.#emptyListComponent;

  // #renderCost() {
  //   this.#costComponent = new CostView();
  //   render(this.#costComponent, this.#tripInfoContainer);
  // }

  #renderLoading() {
    render(this.#loadingComponent, this.#boardContainer);
  }

  #renderEmptyList() {
    this.#emptyListComponent = new ListEmptyView({filterType: this.#currentFilterType});
    render(this.#emptyListComponent, this.#boardContainer);
  }

  #renderFailLoad() {
    this.#failLoadComponent = new FailLoadView();
    render(this.#failLoadComponent , this.#boardContainer);
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


    if (!this.#isLoadingSuccessful) {
      this.#renderFailLoad();
      return;
    }

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

    // remove(this.#sortComponent);
    remove(this.#loadingComponent);

    if (this.#failLoadComponent) {
      remove(this.#failLoadComponent);
    }

    if (this.#emptyListComponent) {
      remove(this.#emptyListComponent);
    }
    // remove(this.#costComponent);
    this.#currentFilterType = this.#filterModel.filter;
  }

  #renderBoard() {
    if (this.#isLoading) {
      this.#renderLoading();
      return;
    }

    // this.#renderCost();
    this.#renderPointsList();

  }

  #handleNewPointButtonClick = () => {
    this.createPoint();
    this.#newPointButtonComponent.element.disabled = true;
  };

  #handleNewPointFormClose = () => {
    this.#newPointButtonComponent.element.disabled = false;
  };

  #handleViewAction = async (actionType, updateType, update) => {
    this.#uiBlocker.block();

    switch (actionType) {
      case UserAction.UPDATE_POINT:
        this.#pointPresenters.get(update.id).setSaving();

        try {
          await this.#pointsModel.updatePoint(updateType, update);
        } catch {
          this.#pointPresenters.get(update.id).setAborting();
        }

        break;
      case UserAction.ADD_POINT:
        this.#newPointPresenter.setSaving();

        try {
          await this.#pointsModel.addPoint(updateType, update);
        } catch {
          this.#newPointPresenter.setAborting();
        }

        break;
      case UserAction.DELETE_POINT:
        this.#pointPresenters.get(update.id).setDeleting();

        try {
          await this.#pointsModel.deletePoint(updateType, update);
        } catch {
          this.#pointPresenters.get(update.id).setAborting();
        }
        break;
    }

    this.#uiBlocker.unblock();
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
        this.#isLoadingSuccessful = true;
        remove(this.#loadingComponent);
        this.#renderBoard();
        this.#newPointButtonComponent.element.disabled = false;
        break;
      case UpdateType.FAIL:
        this.#isLoading = false;
        this.#isLoadingSuccessful = false;
        remove(this.#loadingComponent);
        this.#renderBoard();
        this.#newPointButtonComponent.element.disabled = true;
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
