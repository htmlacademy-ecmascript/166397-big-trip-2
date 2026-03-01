import AbstractView from '../framework/view/abstract-view';

function createNewPointButtonTemplate() {
  return ('<button class="trip-main__event-add-btn  btn  btn--big  btn--yellow" type="button" disabled>New event</button>');
}

export default class NewPointButtonView extends AbstractView {
  #handleClick = null;

  constructor({onClick}) {
    super();
    this.#handleClick = onClick;

    this.element.addEventListener('click', this.#clickHandler);
  }

  get template() {
    return createNewPointButtonTemplate();
  }

  setDisabled(value) {
    this.element.disabled = value;
  }

  #clickHandler = (evt) => {
    evt.preventDefault();

    this.#handleClick();
  };
}
