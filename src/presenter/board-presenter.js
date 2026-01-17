
import SortView from '../view/sort-view';
import PointAddView from '../view/point-add/point-add-view';
import PointEditView from '../view/point-edit/point-edit-view';
import PointView from '../view/point/point-view';
import ListView from '../view/list-view';
import FiltersView from '../view/filters-view' ;
import CostView from '../view/cost-view' ;
import { render } from '../render';

export default class BoardPresenter {
  listView = new ListView();

  constructor({boardContainer, tripInfoContainer, filtersContainer}) {
    this.boardContainer = boardContainer;
    this.tripInfoContainer = tripInfoContainer;
    this.filtersContainer = filtersContainer;
  }

  init() {
    render(new CostView(), this.tripInfoContainer);
    render(new FiltersView(), this.filtersContainer);
    render(new SortView(), this.boardContainer);
    render(this.listView, this.boardContainer);
    render(new PointEditView(), this.listView.getElement());
    render(new PointAddView(), this.listView.getElement());

    for (let i = 1; i <= 3; i++) {
      render(new PointView(), this.listView.getElement());
    }
  }
}
