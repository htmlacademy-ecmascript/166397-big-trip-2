
import SortView from '../view/sort-view';
import PointAddView from '../view/point-add-view';
import PointEditView from '../view/point-edit-view';
import PointView from '../view/point-view';
import ListView from '../view/list-view';
import { render } from '../render';

export default class BoardPresenter {
  listView = new ListView();

  constructor({boardContainer}) {
    this.boardContainer = boardContainer;
  }

  init() {
    render(this.listView, this.boardContainer);
    render(new SortView(), this.listView.getElement());
    render(new PointEditView(), this.listView.getElement());
    render(new PointAddView(), this.listView.getElement());

    for (let i = 1; i <= 3; i++) {
      render(new PointView(), this.listView.getElement());
    }
  }
}
