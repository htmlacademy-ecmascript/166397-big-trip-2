
import SortView from '../view/sort-view/sort-view';
import PointEditView from '../view/point-edit-view/point-edit-view';
import PointView from '../view/point-view/point-view';
import ListView from '../view/list-view';
import FiltersView from '../view/filters-view/filters-view';
import CostView from '../view/cost-view';
import ListEmptyView from '../view/list-empty-view';
import { render, replace } from '../framework/render';

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

    this.#render(boardPoints, boardDestinations);
  }

  #render(boardPoints, boardDestinations) {
    render(new CostView(), this.#tripInfoContainer);
    render(new FiltersView(), this.#filtersContainer);
    render(new SortView(), this.#boardContainer);
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
        replaceFormToPoint();
        document.removeEventListener('keydown', documentKeydownHandler);
      }
    }

    const pointComponent = new PointView({
      point: point,
      destination: this.#pointsModel.getDestinationById(point.destination),
      offers: this.#pointsModel.getOffersByType(point.type),
      onRollupClick: () => {
        replacePointToForm();
        document.addEventListener('keydown', documentKeydownHandler);
      }
    });

    const pointEditComponent = new PointEditView({
      point: point,
      destinations: boardDestinations,
      offers: this.#pointsModel.getOffersByType(point.type),
      onRollupClick: () => {
        replaceFormToPoint();
        document.removeEventListener('keydown', documentKeydownHandler);
      },
      onFormSubmit: () => {
        replaceFormToPoint();
        document.removeEventListener('keydown', documentKeydownHandler);
      }
    });

    function replacePointToForm() {
      replace(pointEditComponent, pointComponent);
    }

    function replaceFormToPoint() {
      replace(pointComponent, pointEditComponent);
    }

    render(pointComponent, this.#listView.element);
  }
}
