import { SortingTypes } from '../const';
import { getDuration } from './point';

const sorting = {
  [SortingTypes.DAY]: (points) => points,
  [SortingTypes.EVENT]: null,
  [SortingTypes.TIME]: (points) => points.toSorted((a, b) => getDuration(b.date_from, b.date_to) - getDuration(a.date_from, a.date_to)),
  [SortingTypes.PRICE]: (points) => points.toSorted((a, b) => b.price - a.price),
  [SortingTypes.OFFERS]: null,
};

export { sorting };
