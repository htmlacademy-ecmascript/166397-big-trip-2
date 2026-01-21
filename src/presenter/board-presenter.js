
import SortView from '../view/sort-view/sort-view';
import PointEditView from '../view/point-edit-view/point-edit-view';
import PointView from '../view/point-view/point-view';
import ListView from '../view/list-view';
import FiltersView from '../view/filters-view/filters-view';
import CostView from '../view/cost-view';
import { render } from '../render';

export default class BoardPresenter {
  listView = new ListView();

  constructor({boardContainer, tripInfoContainer, filtersContainer, pointsModel}) {
    this.boardContainer = boardContainer;
    this.tripInfoContainer = tripInfoContainer;
    this.filtersContainer = filtersContainer;
    this.pointsModel = pointsModel;
  }

  render(boardPoints, boardDestinations) {
    render(new CostView(), this.tripInfoContainer);
    render(new FiltersView(), this.filtersContainer);
    render(new SortView(), this.boardContainer);
    render(this.listView, this.boardContainer);
    render(new PointEditView({
      point: boardPoints[0],
      destinations: boardDestinations,
      offers: this.pointsModel.getOffersByType(boardPoints[0].type)
    }), this.listView.getElement());

    for (let i = 1; i < boardPoints.length; i++) {
      render(new PointView({
        point: boardPoints[i],
        destination: this.pointsModel.getDestinationById(boardPoints[i].destination),
        offers: this.pointsModel.getOffersByType(boardPoints[i].type)
      }), this.listView.getElement());
    }
  }

  init() {
    const boardPoints = [...this.pointsModel.getPoints()];
    const boardDestinations = [...this.pointsModel.getDestinations()];

    this.render(boardPoints, boardDestinations);
  }
}
