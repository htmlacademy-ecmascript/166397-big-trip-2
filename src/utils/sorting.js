import { SortingType } from '../const';
import { getDuration } from './common';

const sorting = {
  [SortingType.DAY]: (points) => points,
  [SortingType.EVENT]: null,
  [SortingType.TIME]: (points) => points.toSorted((a, b) => getDuration(b.date_from, b.date_to) - getDuration(a.date_from, a.date_to)),
  [SortingType.PRICE]: (points) => points.toSorted((a, b) => b.price - a.price),
  [SortingType.OFFERS]: null,
};

export { sorting };
