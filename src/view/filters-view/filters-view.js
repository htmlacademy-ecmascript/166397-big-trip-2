import { createFiltersTemplate } from './filters-template';
import AbstractView from '../../framework/view/abstract-view';

export default class FiltersView extends AbstractView {
  get template() {
    return createFiltersTemplate();
  }
}
