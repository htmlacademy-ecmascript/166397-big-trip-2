
import SortView from '../view/sort-view/sort-view';
import PointEditView from '../view/point-edit-view/point-edit-view';
import PointView from '../view/point-view/point-view';
import ListView from '../view/list-view';
import FiltersView from '../view/filters-view/filters-view';
import CostView from '../view/cost-view';
import ListEmptyView from '../view/list-empty-view';
import { render, replace } from '../framework/render';
import { generateFilters } from '../mocks/filter';
import { generateSorting } from '../mocks/sorting';
import { POINT_STATES } from '../const';

export default class BoardPresenter {
  #listView = new ListView();
  #boardContainer = null;
  #tripInfoContainer = null;
  #filtersContainer = null;
  #pointsModel = null;

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

    this.#render(boardPoints, boardDestinations, filters, sortingItems);
  }

  #render(boardPoints, boardDestinations, filters, sortingItems) {
    render(new CostView(), this.#tripInfoContainer);
    render(new FiltersView({filters}), this.#filtersContainer);
    render(new SortView({sortingItems}), this.#boardContainer);
    render(this.#listView, this.#boardContainer);

    if (!boardPoints.length) {
      render(new ListEmptyView(), this.#boardContainer);
      return;
    }

    for (let i = 1; i < boardPoints.length; i++) {
      this.#renderPoint(boardPoints[i], boardDestinations);
    }
  }

  #renderPoint(point, boardDestinations) {
    function documentKeydownHandler(evt) {
      if (evt.key === 'Escape') {
        evt.preventDefault();
        changeStatePoint('view');
        document.removeEventListener('keydown', documentKeydownHandler);
      }
    }

    const pointComponent = new PointView({
      point: point,
      destination: this.#pointsModel.getDestinationById(point.destination),
      offers: this.#pointsModel.getOffersByType(point.type),
      onRollupClick: () => {
        changeStatePoint('edit');
        document.addEventListener('keydown', documentKeydownHandler);
      }
    });

    const pointEditComponent = new PointEditView({
      point: point,
      destinations: boardDestinations,
      offers: this.#pointsModel.getOffersByType(point.type),
      onRollupClick: () => {
        changeStatePoint('view');
        document.removeEventListener('keydown', documentKeydownHandler);
      },
      onFormSubmit: () => {
        changeStatePoint('view');
        document.removeEventListener('keydown', documentKeydownHandler);
      }
    });

    function changeStatePoint(state) {
      if (!POINT_STATES.includes(state)) {
        return;
      }

      if (state === 'edit') {
        replace(pointEditComponent, pointComponent);
      } else {
        replace(pointComponent, pointEditComponent);
      }
    }

    render(pointComponent, this.#listView.element);
  }
}
