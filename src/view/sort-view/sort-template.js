import { capitalizeString } from '../../utils/common';

function createSortItemTemplate(sortItem, currentSort) {
  const {type, points} = sortItem;
  const capitalizedType = capitalizeString(type);
  const disabled = points ? '' : 'disabled';
  const checked = type === currentSort ? 'checked' : '';

  return `
    <div class="trip-sort__item  trip-sort__item--${type}">
      <input id="sort-${type}" data-sort-type="${type}" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-${type}" ${checked} ${disabled}>
      <label class="trip-sort__btn" for="sort-${type}">${capitalizedType}</label>
    </div>
  `;
}

function createSortTemplate(sortings, currentSort) {
  const sortingItemsTemplate = sortings.map((sortingItem) => createSortItemTemplate(sortingItem, currentSort)).join('');

  return (`
    <form class="trip-events__trip-sort  trip-sort" action="#" method="get">
      ${sortingItemsTemplate}

    </form>
  `);
}

export { createSortTemplate };
