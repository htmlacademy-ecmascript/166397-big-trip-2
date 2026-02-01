
import SortView from '../view/sort-view/sort-view';
import ListView from '../view/list-view';
import FiltersView from '../view/filters-view/filters-view';
import CostView from '../view/cost-view';
import ListEmptyView from '../view/list-empty-view';
import { render } from '../framework/render';
import { generateFilters } from '../mocks/filter';
import { generateSorting } from '../mocks/sorting';
import PointPresenter from './point-presenter';

export default class BoardPresenter {
  #listView = new ListView();
  #boardContainer = null;
  #tripInfoContainer = null;
  #filtersContainer = null;
  #pointsModel = null;
  #pointPresenters = new Map();

  constructor({boardContainer, tripInfoContainer, filtersContainer, pointsModel}) {
    this.#boardContainer = boardContainer;
    this.#tripInfoContainer = tripInfoContainer;
    this.#filtersContainer = filtersContainer;
    this.#pointsModel = pointsModel;
  }

  init() {
    const boardPoints = [...this.#pointsModel.points];
    const boardDestinations = [...this.#pointsModel.destinations];
    const filters = generateFilters(boardPoints);
    const sortingItems = generateSorting(boardPoints);

    this.#renderBoard(boardPoints, boardDestinations, filters, sortingItems);
  }

  #renderCost() {
    render(new CostView(), this.#tripInfoContainer);
  }

  #renderFilters(filters) {
    render(new FiltersView({ filters }), this.#filtersContainer);
  }

  #renderSort(sortingItems) {
    render(new SortView({ sortingItems }), this.#boardContainer);
  }

  #renderEmptyList() {
    render(new ListEmptyView(), this.#boardContainer);
  }

  #renderPoint(point, boardDestinations, boardPoints) {
    const destination = this.#pointsModel.getDestinationById(point.destination);
    const offers = this.#pointsModel.getOffersByType(point.type);

    const dataChangeHandler = (newPoint) => {
      boardPoints = boardPoints.map((item) => item.id === newPoint.id ? newPoint : item);
      this.#pointPresenters.get(newPoint.id).init(newPoint, destination, offers);
    };

    const pointPresenter = new PointPresenter({
      boardDestinations: boardDestinations,
      listContainer: this.#listView.element,

      onDataChange: dataChangeHandler
    });

    pointPresenter.init(point, destination, offers);

    this.#pointPresenters.set(point.id, pointPresenter);
  }

  #renderPoints(boardPoints, boardDestinations) {
    boardPoints.forEach((point) => {
      this.#renderPoint(point, boardDestinations, boardPoints);
    });
  }

  #clearPointsList() {
    this.#pointPresenters.forEach((presenter) => {
      presenter.destroy();
    });

    this.#pointPresenters.clear();
  }

  #renderPointsList(boardPoints, boardDestinations) {
    render(this.#listView, this.#boardContainer);

    if (!boardPoints.length) {
      this.#renderEmptyList();
    }

    this.#renderPoints(boardPoints, boardDestinations);
  }

  #renderBoard(boardPoints, boardDestinations, filters, sortingItems) {
    this.#renderCost();
    this.#renderFilters(filters);
    this.#renderSort(sortingItems);
    this.#renderPointsList(boardPoints, boardDestinations);
  }
}
