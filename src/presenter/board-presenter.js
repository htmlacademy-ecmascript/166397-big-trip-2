
import SortView from '../view/sort-view/sort-view';
import PointAddView from '../view/point-add-view/point-add-view';
import PointEditView from '../view/point-edit-view/point-edit-view';
import PointView from '../view/point-view/point-view';
import ListView from '../view/list-view';
import FiltersView from '../view/filters-view/filters-view' ;
import CostView from '../view/cost-view' ;
import { render } from '../render';

export default class BoardPresenter {
  listView = new ListView();

  constructor({boardContainer, tripInfoContainer, filtersContainer, pointsModel}) {
    this.boardContainer = boardContainer;
    this.tripInfoContainer = tripInfoContainer;
    this.filtersContainer = filtersContainer;
    this.pointsModel = pointsModel;
  }

  init() {
    this.boardPoints = [...this.pointsModel.getPoints()];
    this.boardDestinations = [...this.pointsModel.getDestinations()];
    this.boardOffers = [...this.pointsModel.getOffers()];

    render(new CostView(), this.tripInfoContainer);
    render(new FiltersView(), this.filtersContainer);
    render(new SortView(), this.boardContainer);
    render(this.listView, this.boardContainer);
    render(new PointEditView({point: this.boardPoints[0], destinations: this.boardDestinations, offers: this.boardOffers}), this.listView.getElement());

    for (let i = 1; i < this.boardPoints.length; i++) {
      render(new PointView({point: this.boardPoints[i], destinations: this.boardDestinations, offers: this.boardOffers}), this.listView.getElement());
    }
  }
}
