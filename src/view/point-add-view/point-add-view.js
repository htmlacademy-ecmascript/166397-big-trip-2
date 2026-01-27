import { createPointAddTemplate } from './point-add-template';
import AbstractView from '../../framework/view/abstract-view';

export default class PointAddView extends AbstractView {
  get template() {
    return createPointAddTemplate();
  }
}
